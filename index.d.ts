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

/**
 * Skin numbers for the `skin` attribute and `setSkin()`. A number is permanent:
 * titles may be reworded, numbers never change and are never reused.
 */
export type AgentRobotAvatarSkin =
  | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12'
  | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' | '21' | '22' | '23' | '24'
  | '25' | '26' | '27' | '28' | '29' | '30' | '31' | '32' | '33' | '34' | '35' | '36'
  | '37' | '38' | '39' | '40' | '41' | '42' | '43' | '44' | '45' | '46' | '47' | '48'
  | '49' | '50' | '51' | '52' | '53' | '54' | '55' | '56' | '57' | '58' | '59' | '60'
  | '61' | '62' | '63' | '64' | '65' | '66' | '67' | '68' | '69' | '70' | '71' | '72'
  | '73' | '74' | '75' | '76' | '77' | '78' | '79' | '80' | '81' | '82' | '83' | '84'
  | '85' | '86' | '87' | '88' | '89' | '90' | '91' | '92' | '93' | '94' | '95' | '96'
  | '97' | '98' | '99' | '100' | '101' | '102' | '103' | '104' | '105' | '106' | '107' | '108'
  | '109' | '110' | '111' | '112' | '113' | '114' | '115' | '116' | '117' | '118' | '119' | '120'
  | '121' | '122' | '123' | '124' | '125' | '126' | '127' | '128' | '129' | '130' | '131' | '132'
  | '133' | '134' | '135' | '136' | '137' | '138' | '139' | '140' | '141' | '142' | '143' | '144'
  | '145' | '146' | '147' | '148' | '149' | '150' | '151' | '152' | '153' | '154' | '155' | '156'
  | '157' | '158' | '159' | '160' | '161' | '162' | '163' | '164' | '165' | '166' | '167' | '168'
  | '169' | '170' | '171' | '172' | '173' | '174' | '175' | '176' | '177' | '178' | '179' | '180'
  | '181' | '182' | '183' | '184' | '185' | '186' | '187' | '188';

/** Display information for one skin. */
export interface AgentRobotAvatarSkinInfo {
  /** The series id, such as `'glaze'` or `'metal'`. */
  readonly series: string;
  /** Chinese title. */
  readonly title: string;
  /** English title. */
  readonly titleEn: string;
  /** Representative colors, light to dark. */
  readonly base: readonly string[];
}

/** A group of related skins, in gallery order. */
export interface AgentRobotAvatarSkinSeries {
  readonly id: string;
  readonly title: string;
  readonly titleEn: string;
  readonly skins: readonly AgentRobotAvatarSkin[];
}

/** Every skin number, in gallery order. */
export declare const SKIN_NAMES: readonly AgentRobotAvatarSkin[];
/** Titles and colors for every skin, by number. */
export declare const SKINS: Readonly<Record<AgentRobotAvatarSkin, AgentRobotAvatarSkinInfo>>;
/** The skin series, in gallery order. */
export declare const SKIN_SERIES: readonly AgentRobotAvatarSkinSeries[];
/**
 * Skin painters download the first time a skin is used, so the first skin shows
 * a moment after it is set. Await this to load them in advance.
 */
export declare function loadSkins(): Promise<void>;

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
  /**
   * Dresses the head in a numbered skin with light that follows the pointer.
   * Same as the `skin` attribute; `null` or `'none'` returns to the flat color.
   * Throws for an unknown number.
   */
  setSkin(skin?: AgentRobotAvatarSkin | number | 'none' | null): this;
  getSkin(): AgentRobotAvatarSkin | null;
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

