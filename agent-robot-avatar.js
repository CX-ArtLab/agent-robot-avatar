import AgentRobotAvatar from './src/agent-robot-avatar-extension-host.js';
import './src/agent-robot-avatar-actions.js';
import './src/agent-robot-avatar-antenna.js';
import './src/agent-robot-avatar-waiting.js';
import './src/agent-robot-avatar-antenna-flash.js';
import './src/agent-robot-avatar-inspect.js';
import './src/agent-robot-avatar-failure.js';
import './src/agent-robot-avatar-head-roundness.js';
import { VERSION } from './src/agent-robot-avatar-version.js';

if (typeof window !== 'undefined') {
  window.AgentRobotAvatarVersion = VERSION;
}

export { AgentRobotAvatar, VERSION };
export default AgentRobotAvatar;
