import xml.etree.ElementTree as ET
from pathlib import Path
import mujoco
import numpy as np

WORKSPACE = Path("/Users/mihyunlee/workspace/09_코다리_공부방")
SCENE_DIR = WORKSPACE / "microduck_rl/src/mjlab_microduck/robot/microduck"
ROBOT_XML = SCENE_DIR / "robot_allcollisions.xml"

tree = ET.parse(ROBOT_XML)
root = tree.getroot()

print("Root tag:", root.tag)
print("Compiler meshdir:", root.find("compiler").attrib.get("meshdir"))
