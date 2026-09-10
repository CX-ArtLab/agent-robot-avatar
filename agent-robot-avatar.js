import AgentRobotAvatar from './src/agent-robot-avatar-extension-host.js';
import './src/agent-robot-avatar-actions.js';
import './src/agent-robot-avatar-antenna.js';
import './src/agent-robot-avatar-waiting.js';
import './src/agent-robot-avatar-antenna-flash.js';
import './src/agent-robot-avatar-inspect.js';
import './src/agent-robot-avatar-failure.js';
import './src/agent-robot-avatar-head-roundness.js';
import './src/agent-robot-avatar-runtime.js';
import './src/agent-robot-avatar-runtime-fixes.js';
import { VERSION } from './src/agent-robot-avatar-version.js';

// Elements already present in markup can upgrade while the core module is
// loading, before runtime extensions finish installing their prototype hooks.
// Initialize those existing instances once the full public entry is ready so
// runtime policies (including touch-action) are applied synchronously.
if (typeof document !== 'undefined') {
  document.querySelectorAll('agent-robot-avatar').forEach(avatar => avatar._resumeFrames?.());
}

if (typeof window !== 'undefined') {
  window.AgentRobotAvatarVersion = VERSION;
}

export { AgentRobotAvatar, VERSION };
export default AgentRobotAvatar;