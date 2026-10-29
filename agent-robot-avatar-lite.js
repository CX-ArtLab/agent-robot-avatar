// The smallest build: every expression and gesture, without skins. The skin
// attribute and setSkin() only explain where skins live, so a page written for
// the full build keeps working with the plain avatar.
import AgentRobotAvatar from './src/agent-robot-avatar-extension-host.js';
import './src/agent-robot-avatar-actions.js';
import './src/agent-robot-avatar-antenna.js';
import './src/agent-robot-avatar-waiting.js';
import './src/agent-robot-avatar-inspect.js';
import './src/agent-robot-avatar-failure.js';
import './src/agent-robot-avatar-love.js';
import './src/agent-robot-avatar-random.js';
import './src/agent-robot-avatar-head-roundness.js';
import './src/agent-robot-avatar-gestures.js';
import './src/agent-robot-avatar-runtime.js';
import { VERSION } from './src/agent-robot-avatar-version.js';

const proto = AgentRobotAvatar.prototype;
let warned = false;
function explain() {
  if (warned) return;
  warned = true;
  console.warn('agent-robot-avatar: skins are not part of the lite build; import "agent-robot-avatar" instead of "agent-robot-avatar/lite" to use them.');
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
  document.querySelectorAll('agent-robot-avatar').forEach(avatar => avatar._resumeFrames?.());
}

if (typeof window !== 'undefined') {
  window.AgentRobotAvatarVersion = VERSION;
}

export { AgentRobotAvatar, VERSION };
export default AgentRobotAvatar;
