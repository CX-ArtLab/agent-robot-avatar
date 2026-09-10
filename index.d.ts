export type AgentRobotAvatarAction =
  | 'idle'
  | 'bored'
  | 'waiting'
  | 'wait'
  | 'input'
  | 'send'
  | 'success'
  | 'failure'
  | 'failed'
  | 'fail'
  | 'warning'
  | 'inspect'
  | 'verify'
  | 'review'
  | 'angry'
  | 'blocked'
  | 'policy-blocked'
  | 'error'
  | 'system-error'
  | 'connection-error'
  | 'surprise'
  | 'sleep'
  | 'wake';

export type AgentRobotAvatarState =
  | 'idle'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'sleepy'
  | 'input'
  | 'sleep'
  | 'surprise'
  | 'waiting'
  | 'warning'
  | 'error'
  | 'inspect'
  | 'failure';

export type AgentRobotAvatarCanonicalAction =
  | 'idle'
  | 'bored'
  | 'waiting'
  | 'input'
  | 'send'
  | 'success'
  | 'failure'
  | 'warning'
  | 'inspect'
  | 'angry'
  | 'blocked'
  | 'error'
  | 'surprise'
  | 'sleep'
  | 'wake'
  | 'reaction';

export type AgentRobotAvatarActionPhase = 'start' | 'end' | 'cancel';
export type AgentRobotAvatarActionSource = 'api' | 'interaction' | 'automatic';
export type AgentRobotAvatarWakeOn = 'activity' | 'interaction' | 'manual';
export type AgentRobotAvatarMotion = 'auto' | 'reduce' | 'full';

export interface AgentRobotAvatarActionStateDetail {
  action: AgentRobotAvatarCanonicalAction;
  phase: AgentRobotAvatarActionPhase;
  source: AgentRobotAvatarActionSource;
}

export interface AgentRobotAvatarEventMap extends HTMLElementEventMap {
  'face-state': CustomEvent<{ state: AgentRobotAvatarState }>;
  'action-state': CustomEvent<AgentRobotAvatarActionStateDetail>;
  'head-roundness-change': CustomEvent<{ value: number; version: string }>;
}

export declare class AgentRobotAvatar extends HTMLElement {
  play(action: AgentRobotAvatarAction): this | Promise<void>;
  reset(): this;
  sleep(): this | Promise<void>;
  wake(): this | Promise<void>;
  input(active?: boolean): this | Promise<void>;
  startWaiting(): Promise<this>;
  stopWaiting(): this;
  setPointerFollow(enabled?: boolean): this;
  setAntennaFlash(enabled?: boolean): this;
  setHeadRoundness(value?: number): this;
  getHeadRoundness(): number;
  noteActivity(wake?: boolean): void;

  addEventListener<K extends keyof AgentRobotAvatarEventMap>(
    type: K,
    listener: (this: AgentRobotAvatar, event: AgentRobotAvatarEventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof AgentRobotAvatarEventMap>(
    type: K,
    listener: (this: AgentRobotAvatar, event: AgentRobotAvatarEventMap[K]) => unknown,
    options?: boolean | EventListenerOptions,
  ): void;
}

export declare const VERSION: string;

export default AgentRobotAvatar;

declare global {
  interface HTMLElementTagNameMap {
    'agent-robot-avatar': AgentRobotAvatar;
  }
}
