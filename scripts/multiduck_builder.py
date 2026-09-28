import copy
import xml.etree.ElementTree as ET
from pathlib import Path
import mujoco

WORKSPACE = Path("/Users/mihyunlee/workspace/09_코다리_공부방")
SCENE_DIR = WORKSPACE / "microduck_rl/src/mjlab_microduck/robot/microduck"
ROBOT_XML = SCENE_DIR / "robot_allcollisions.xml"
SCENE_XML = SCENE_DIR / "scene.xml"
ASSETS_DIR = SCENE_DIR / "assets"

def build_multiduck_xml(num_ducks=3, spacing=0.35, include_ball=False):
    robot_tree = ET.parse(ROBOT_XML)
    robot_root = robot_tree.getroot()

    scene_tree = ET.parse(SCENE_XML)
    scene_root = scene_tree.getroot()

    # Remove the <include file="robot_allcollisions.xml" /> tag
    for inc in list(scene_root.findall("include")):
        scene_root.remove(inc)
    for keyframe in list(scene_root.findall("keyframe")):
        scene_root.remove(keyframe)

    # Find compiler or add one with absolute meshdir
    compiler = scene_root.find("compiler")
    if compiler is None:
        compiler = ET.SubElement(scene_root, "compiler")
    compiler.attrib["meshdir"] = str(ASSETS_DIR)
    compiler.attrib["angle"] = "radian"
    compiler.attrib["autolimits"] = "true"

    # Copy defaults from robot
    for default in robot_root.findall("default"):
        scene_root.append(copy.deepcopy(default))

    # Copy assets (materials, meshes) from robot
    robot_asset = robot_root.find("asset")
    scene_asset = scene_root.find("asset")
    if scene_asset is None:
        scene_asset = ET.SubElement(scene_root, "asset")
    if robot_asset is not None:
        for item in robot_asset:
            scene_asset.append(copy.deepcopy(item))

    # Worldbody
    scene_worldbody = scene_root.find("worldbody")

    # Add ball if requested
    if include_ball:
        ball_body = ET.SubElement(scene_worldbody, "body", attrib={"name": "soccer_ball", "pos": "0.35 0 0.035"})
        ET.SubElement(ball_body, "freejoint", attrib={"name": "ball_free"})
        ET.SubElement(ball_body, "inertial", attrib={"pos": "0 0 0", "mass": "0.015", "diaginertia": "1.225e-5 1.225e-5 1.225e-5"})
        ET.SubElement(ball_body, "geom", attrib={"type": "sphere", "name": "ball_geom", "size": "0.035", "rgba": "1 0.45 0 1", "friction": "0.5 0.005 0.0001"})

    # Actuator & Sensor containers
    scene_actuator = scene_root.find("actuator")
    if scene_actuator is None:
        scene_actuator = ET.SubElement(scene_root, "actuator")

    scene_sensor = scene_root.find("sensor")
    if scene_sensor is None:
        scene_sensor = ET.SubElement(scene_root, "sensor")

    # Helper to rename all name attributes in an element tree with a prefix
    def prefix_names(elem, prefix):
        if "name" in elem.attrib:
            elem.attrib["name"] = f"{prefix}_{elem.attrib['name']}"
        if "joint" in elem.attrib:
            elem.attrib["joint"] = f"{prefix}_{elem.attrib['joint']}"
        if "body" in elem.attrib:
            elem.attrib["body"] = f"{prefix}_{elem.attrib['body']}"
        if "site" in elem.attrib:
            elem.attrib["site"] = f"{prefix}_{elem.attrib['site']}"
        if "objname" in elem.attrib:
            elem.attrib["objname"] = f"{prefix}_{elem.attrib['objname']}"
        for child in elem:
            prefix_names(child, prefix)

    # Duck positions (V-formation or horizontal line)
    # e.g., 3 ducks: center, left, right
    # 5 ducks: V formation
    positions = []
    if num_ducks == 3:
        positions = [
            (0.0, 0.0, 0.12),
            (-0.25, -spacing, 0.12),
            (-0.25, spacing, 0.12),
        ]
    elif num_ducks == 5:
        positions = [
            (0.0, 0.0, 0.12),
            (-0.25, -spacing, 0.12),
            (-0.25, spacing, 0.12),
            (-0.5, -spacing * 2, 0.12),
            (-0.5, spacing * 2, 0.12),
        ]
    else:
        # line along Y
        for i in range(num_ducks):
            y = (i - (num_ducks - 1) / 2.0) * spacing
            positions.append((0.0, y, 0.12))

    robot_wb = robot_root.find("worldbody")
    robot_trunk = robot_wb.find("./body[@name='trunk_base']")
    robot_actuators = robot_root.find("actuator")
    robot_sensors = robot_root.find("sensor")

    for i in range(num_ducks):
        prefix = f"duck_{i}"
        pos = positions[i]

        # Duplicate trunk_base
        trunk_copy = copy.deepcopy(robot_trunk)
        trunk_copy.attrib["pos"] = f"{pos[0]} {pos[1]} {pos[2]}"
        prefix_names(trunk_copy, prefix)
        scene_worldbody.append(trunk_copy)

        # Duplicate actuators
        if robot_actuators is not None:
            for act in robot_actuators:
                act_copy = copy.deepcopy(act)
                prefix_names(act_copy, prefix)
                scene_actuator.append(act_copy)

        # Duplicate sensors
        if robot_sensors is not None:
            for sens in robot_sensors:
                sens_copy = copy.deepcopy(sens)
                prefix_names(sens_copy, prefix)
                scene_sensor.append(sens_copy)

    xml_str = ET.tostring(scene_root, encoding="utf-8").decode("utf-8")
    return xml_str

if __name__ == "__main__":
    xml_str = build_multiduck_xml(num_ducks=3)
    print("Testing MuJoCo model compilation for 3 ducks...")
    model = mujoco.MjModel.from_xml_string(xml_str)
    data = mujoco.MjData(model)
    print(f"✅ Success! nq={model.nq}, nv={model.nv}, nu={model.nu}")
    print(f"Actuators count: {model.nu} (14 * 3 = {14 * 3})")
