export type AgentRobotAvatarAction =
  | 'idle'
  | 'bored'
  | 'waiting'
  | 'waiting-spin'
  | 'waiting-wrap'
  | 'waiting-wave'
  | 'input'
  | 'affirm'
  | 'success'
  | 'failure'
  | 'wary'
  | 'inspect'
  | 'angry'
  | 'refuse'
  | 'surprise'
  | 'love'
  | 'random'
  | 'sleep'
  | 'wake'
  | AgentRobotAvatarDeprecatedAction;

/**
 * Older names that still play the same action but log a one-time deprecation
 * notice. They are removed in 1.0.
 */
export type AgentRobotAvatarDeprecatedAction =
  | 'wait'
  | 'send'
  | 'failed'
  | 'fail'
  | 'warning'
  | 'verify'
  | 'review'
  | 'blocked'
  | 'policy-blocked'
  | 'error'
  | 'system-error'
  | 'connection-error'
  | 'slot';

export type AgentRobotAvatarState =
  | 'idle'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'sleepy'
  | 'input'
  | 'sleep'
  | 'surprise'
  | 'love'
  | 'random'
  | 'waiting'
  | 'wary'
  | 'refuse'
  | 'inspect'
  | 'failure'
  | 'squeeze'
  | 'antenna-drag';

export type AgentRobotAvatarCanonicalAction =
  | 'idle'
  | 'bored'
  | 'waiting'
  | 'input'
  | 'affirm'
  | 'success'
  | 'failure'
  | 'wary'
  | 'inspect'
  | 'angry'
  | 'refuse'
  | 'surprise'
  | 'love'
  | 'random'
  | 'sleep'
  | 'wake'
  | 'reaction'
  | 'squeeze'
  | 'antenna-drag';

export type AgentRobotAvatarActionPhase = 'start' | 'end' | 'cancel';
export type AgentRobotAvatarActionSource = 'api' | 'interaction' | 'automatic';
export type AgentRobotAvatarWakeOn = 'activity' | 'interaction' | 'manual';
export type AgentRobotAvatarMotion = 'auto' | 'reduce' | 'full';
export interface AgentRobotAvatarWaitingOptions {
  variant?: 'default' | 'spin' | 'wrap' | 'wave';
}

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
  startWaiting(options?: AgentRobotAvatarWaitingOptions): Promise<this>;
  stopWaiting(): this;
  setPointerFollow(enabled?: boolean): this;
  /** @deprecated Removed in 0.6; does nothing and logs a one-time notice. Deleted in 1.0. */
  setAntennaFlash(enabled?: boolean): this;
  setPressSqueeze(enabled?: boolean): this;
  setAntennaDrag(enabled?: boolean): this;
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

