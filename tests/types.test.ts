import AgentRobotAvatar, {
  VERSION,
  type AgentRobotAvatarAction,
  type AgentRobotAvatarState,
} from 'agent-robot-avatar';

const avatar = new AgentRobotAvatar();
const action: AgentRobotAvatarAction = 'success';

void avatar.play(action);
void avatar.startWaiting();
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

avatar.addEventListener('head-roundness-change', event => {
  const value: number = event.detail.value;
  const eventVersion: string = event.detail.version;
  void value;
  void eventVersion;
});

// @ts-expect-error Unknown actions must be rejected by TypeScript.
avatar.play('not-a-real-action');

void roundness;
void version;
void element;
