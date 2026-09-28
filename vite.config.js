import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { agentBridgePlugin } from './agent-bridge-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), agentBridgePlugin()],
  base: "/09_kodari_study_room/",
})
