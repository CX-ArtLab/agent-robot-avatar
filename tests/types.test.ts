import BoopFace, {
  SKIN_NAMES,
  SKIN_SERIES,
  SKINS,
  VERSION,
  type BoopFaceAction,
  type BoopFaceActionPhase,
  type BoopFaceActionSource,
  type BoopFaceActionStateDetail,
  type BoopFaceCanonicalAction,
  type BoopFaceMotion,
  type BoopFaceSkin,
  type BoopFaceState,
  type BoopFaceWakeOn,
} from 'boopface';

const avatar = new BoopFace();
const action: BoopFaceAction = 'success';
const wakeOn: BoopFaceWakeOn = 'interaction';
const motion: BoopFaceMotion = 'reduce';

void avatar.play(action);
void avatar.startWaiting();
void avatar.startWaiting({ variant: 'wrap' });
void avatar.play('waiting-wrap');
void avatar.startWaiting({ variant: 'wave' });
void avatar.play('waiting-wave');
void avatar.play('love');
const loveState: BoopFaceState = 'love';
const loveCanonical: BoopFaceCanonicalAction = 'love';
void avatar.play('random');
void avatar.play('slot');
const randomState: BoopFaceState = 'random';
const randomCanonical: BoopFaceCanonicalAction = 'random';
void loveState;
void loveCanonical;
void randomState;
void randomCanonical;
void avatar.sleep();
void avatar.wake();
void avatar.input();
void avatar.input(false);
avatar
  .stopWaiting()
  .setPointerFollow(false)
  .setAntennaFlash(true)
  .setHeadRoundness(50)
  .setSkin('1001')
  .setSkin(1717)
  .setSkin(null)
  .reset();

const roundness: number = avatar.getHeadRoundness();
const skin: BoopFaceSkin | null = avatar.getSkin();
void skin;
const firstSkin: BoopFaceSkin | undefined = SKIN_NAMES[0];
void firstSkin;
const skinTitle: string = SKINS['301'].titleEn;
void skinTitle;
const seriesSkins: readonly BoopFaceSkin[] | undefined = SKIN_SERIES[0]?.skins;
void seriesSkins;
// @ts-expect-error skins are numbered, not named
avatar.setSkin('obsidian');
const version: string = VERSION;
const element: BoopFace = document.createElement('boop-face');

avatar.addEventListener('face-state', event => {
  const state: BoopFaceState = event.detail.state;
  void state;
});

avatar.addEventListener('action-state', event => {
  const detail: BoopFaceActionStateDetail = event.detail;
  const canonical: BoopFaceCanonicalAction = detail.action;
  const phase: BoopFaceActionPhase = detail.phase;
  const source: BoopFaceActionSource = detail.source;
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
const invalidWakeOn: BoopFaceWakeOn = 'always';
// @ts-expect-error Motion policy values are a closed set.
const invalidMotion: BoopFaceMotion = 'minimal';

void roundness;
void version;
void element;
void wakeOn;
void motion;
void invalidWakeOn;
void invalidMotion;

