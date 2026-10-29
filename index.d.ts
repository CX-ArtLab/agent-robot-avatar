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
 * Skin numbers for the `skin` attribute and `setSkin()`: the series number
 * followed by two digits, so `305` is the fifth skin of series 3. A number is
 * permanent; titles may be reworded, numbers never change and are never reused.
 */
export type AgentRobotAvatarSkin =
  | '101' | '102' | '103' | '104' | '105' | '106' | '201' | '202' | '203' | '204' | '205' | '206'
  | '301' | '302' | '303' | '304' | '305' | '306' | '307' | '308' | '309' | '310' | '311' | '312'
  | '401' | '402' | '403' | '404' | '405' | '406' | '501' | '502' | '503' | '504' | '505' | '506'
  | '507' | '508' | '509' | '510' | '511' | '512' | '601' | '602' | '603' | '604' | '605' | '606'
  | '607' | '608' | '609' | '610' | '611' | '612' | '701' | '702' | '703' | '704' | '705' | '706'
  | '707' | '708' | '709' | '710' | '711' | '712' | '801' | '802' | '803' | '804' | '805' | '806'
  | '901' | '902' | '903' | '904' | '905' | '906' | '907' | '908' | '909' | '910' | '911' | '912'
  | '913' | '914' | '915' | '916' | '917' | '918' | '919' | '920' | '921' | '922' | '923' | '924'
  | '925' | '926' | '927' | '928' | '929' | '930' | '1001' | '1002' | '1003' | '1004' | '1005' | '1006'
  | '1007' | '1008' | '1009' | '1010' | '1011' | '1012' | '1101' | '1102' | '1103' | '1104' | '1105' | '1106'
  | '1201' | '1202' | '1203' | '1204' | '1205' | '1206' | '1207' | '1208' | '1209' | '1210' | '1301' | '1302'
  | '1303' | '1304' | '1305' | '1401' | '1402' | '1403' | '1404' | '1405' | '1406' | '1407' | '1408' | '1409'
  | '1410' | '1411' | '1412' | '1501' | '1502' | '1503' | '1504' | '1505' | '1506' | '1507' | '1508' | '1509'
  | '1510' | '1511' | '1512' | '1601' | '1602' | '1603' | '1604' | '1605' | '1606' | '1607' | '1608' | '1609'
  | '1610' | '1611' | '1612' | '1701' | '1702' | '1703' | '1704' | '1705' | '1706' | '1707' | '1708' | '1709'
  | '1710' | '1711' | '1712' | '1713' | '1714' | '1715' | '1716' | '1717';

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
  /** The first digits of every skin number in the series. */
  readonly number: number;
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

