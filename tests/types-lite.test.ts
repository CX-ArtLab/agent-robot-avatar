import AgentRobotAvatar, { VERSION, SKIN_NAMES, type AgentRobotAvatarAction } from 'agent-robot-avatar/lite';

const avatar = new AgentRobotAvatar();
const action: AgentRobotAvatarAction = 'love';
avatar.play(action);
const version: string = VERSION;
void version;
// @ts-expect-error the lite build has no skin catalog to use
void SKIN_NAMES;
