import BoopFace from './src/boopface-extension-host.js';
import './src/boopface-actions.js';
import './src/boopface-antenna.js';
import './src/boopface-waiting.js';
import './src/boopface-inspect.js';
import './src/boopface-failure.js';
import './src/boopface-love.js';
import './src/boopface-random.js';
import './src/boopface-head-roundness.js';
import './src/boopface-gestures.js';
import { SKIN_NAMES, SKINS, SKIN_SERIES, loadSkins } from './src/boopface-skins.js';
import './src/boopface-runtime.js';
import { VERSION } from './src/boopface-version.js';

// Elements already present in markup can upgrade while the core module is
// loading, before runtime extensions finish installing their prototype hooks.
// Initialize those existing instances once the full public entry is ready so
// runtime policies (including touch-action) are applied synchronously.
if (typeof document !== 'undefined') {
  document.querySelectorAll('boop-face, agent-robot-avatar').forEach(avatar => avatar._resumeFrames?.());
}

if (typeof window !== 'undefined') {
  window.BoopFaceVersion = window.AgentRobotAvatarVersion = VERSION;
}

export { BoopFace, BoopFace as AgentRobotAvatar, SKIN_NAMES, SKINS, SKIN_SERIES, VERSION, loadSkins };
// AgentRobotAvatar: the 0.7 name, kept until 1.0.
export default BoopFace;
