import AgentRobotAvatar from './src/agent-robot-avatar-head-roundness.js?v=0.1.0';

const VERSION = '0.1.0';

function syncDemoBuild() {
  window.AgentRobotAvatarDemoBuild = VERSION;
  const badge = document.getElementById('agent-demo-build');
  if (badge) badge.textContent = `Demo v${VERSION}`;
}

if (typeof window !== 'undefined' && typeof document !== 'undefined' && document.title.includes('Interactive Demo')) {
  import('./demo/agent-robot-avatar-demo-controls.js?v=0.1.0')
    .then(() => import('./demo/agent-robot-avatar-demo-extras.js?v=0.1.0'))
    .then(() => import('./demo/agent-robot-avatar-demo-roundness.js?v=0.1.0'))
    .then(() => import('./demo/agent-robot-avatar-demo-layout.js?v=0.1.0'))
    .then(() => import('./demo/agent-robot-avatar-demo-dialog-i18n.js?v=0.1.0'))
    .then(() => import('./demo/agent-robot-avatar-demo-chat-avatar-mode.js?v=0.1.0'))
    .then(() => import('./demo/agent-robot-avatar-demo-reply-loop.js?v=0.1.0'))
    .then(syncDemoBuild);
}

if (typeof window !== 'undefined') window.AgentRobotAvatarVersion = VERSION;

export { AgentRobotAvatar, VERSION };
export default AgentRobotAvatar;
