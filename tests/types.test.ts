import AgentRobotAvatar, {
  VERSION,
  type AgentRobotAvatarAction,
  type AgentRobotAvatarActionPhase,
  type AgentRobotAvatarActionSource,
  type AgentRobotAvatarActionStateDetail,
  type AgentRobotAvatarCanonicalAction,
  type AgentRobotAvatarMotion,
  type AgentRobotAvatarState,
  type AgentRobotAvatarWakeOn,
} from 'agent-robot-avatar';

const avatar = new AgentRobotAvatar();
const action: AgentRobotAvatarAction = 'success';
const wakeOn: AgentRobotAvatarWakeOn = 'interaction';
const motion: AgentRobotAvatarMotion = 'reduce';

void avatar.play(action);
void avatar.startWaiting();
void avatar.sleep();
void avatar.wake();
void avatar.input();
void avatar.input(false);
avatar
  .stopWaiting()
  .setPointerFollow(false)
  .setAntennaFlash(true)
  .setHeadRoundness(50)
  .reset();

const roundness: number = avatar.getHeadRoundness();
const version: string = VERSION;
const element: AgentRobotAvatar = document.createElement('agent-robot-avatar');

avatar.addEventListener('face-state', event => {
  const state: AgentRobotAvatarState = event.detail.state;
  void state;
});

avatar.addEventListener('action-state', event => {
  const detail: AgentRobotAvatarActionStateDetail = event.detail;
  const canonical: AgentRobotAvatarCanonicalAction = detail.action;
  const phase: AgentRobotAvatarActionPhase = detail.phase;
  const source: AgentRobotAvatarActionSource = detail.source;
  void canonical;
  void phase;
  void source;
});

avatar.addEventListener('head-roundness-change', event => {
  const value: number = event.detail.value;
  const eventVersion: string = event.detail.version;
  void value;
  void eventVersion;
});

// @ts-expect-error Unknown actions must be rejected by TypeScript.
avatar.play('not-a-real-action');
// @ts-expect-error Wake policy values are a closed set.
const invalidWakeOn: AgentRobotAvatarWakeOn = 'always';
// @ts-expect-error Motion policy values are a closed set.
const invalidMotion: AgentRobotAvatarMotion = 'minimal';

void roundness;
void version;
void element;
void wakeOn;
void motion;
void invalidWakeOn;
void invalidMotion;
