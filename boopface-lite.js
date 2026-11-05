// The smallest build: every expression and gesture, without skins. The skin
// attribute and setSkin() only explain where skins live, so a page written for
// the full build keeps working with the plain avatar.
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
import './src/boopface-runtime.js';
import { VERSION } from './src/boopface-version.js';

const proto = BoopFace.prototype;
let warned = false;
function explain() {
  if (warned) return;
  warned = true;
  console.warn('boopface: skins are not part of the lite build; import "boopface" instead of "boop-face/lite" to use them.');
}
if (!proto.setSkin) {
  proto._applySkinAttribute = function() { if (this.getAttribute('skin')) explain(); };
  proto.setSkin = function(value = null) {
    if (value !== null && value !== 'none') explain();
    return this;
  };
  proto.getSkin = () => null;
}

// Elements already present in markup can upgrade while the core module is
// loading, before runtime extensions finish installing their prototype hooks.
if (typeof document !== 'undefined') {
  document.querySelectorAll('boop-face, agent-robot-avatar').forEach(avatar => avatar._resumeFrames?.());
}

if (typeof window !== 'undefined') {
  window.BoopFaceVersion = window.AgentRobotAvatarVersion = VERSION;
}

export { BoopFace, BoopFace as AgentRobotAvatar, VERSION };
// AgentRobotAvatar: the 0.7 name, kept until 1.0.
export default BoopFace;
