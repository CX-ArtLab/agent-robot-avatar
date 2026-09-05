import AgentRobotAvatar from './agent-robot-avatar-core.js';

const proto = AgentRobotAvatar.prototype;
const basePlay = proto.play;
const baseReset = proto.reset;
const baseDraw = proto._draw;
const extensionNames = new Set();
const actionHandlers = new Map();
const beforePlayHooks = [];
const afterPlayHooks = [];
const resetHooks = [];
const drawHooks = [];

function registerAvatarExtension({
  name,
  actions = {},
  beforePlay,
  afterPlay,
  reset,
  draw,
}) {
  if (!name || extensionNames.has(name)) {
    throw new Error(`Agent Robot Avatar extension already registered: ${name || '(unnamed)'}`);
  }
  extensionNames.add(name);

  for (const [action, handler] of Object.entries(actions)) {
    if (actionHandlers.has(action)) {
      throw new Error(`Agent Robot Avatar action already registered: ${action}`);
    }
    actionHandlers.set(action, handler);
  }

  if (beforePlay) beforePlayHooks.push(beforePlay);
  if (afterPlay) afterPlayHooks.push(afterPlay);
  if (reset) resetHooks.push(reset);
  if (draw) drawHooks.push(draw);
}

proto.play = function(name) {
  this._resumeFrames?.();
  const action = String(name || '').trim().toLowerCase();
  const context = {};

  for (const hook of beforePlayHooks) hook.call(this, action, context);

  let result;
  try {
    const handler = actionHandlers.get(action);
    result = handler ? handler.call(this, action) : basePlay.call(this, action);
  } catch (error) {
    context.error = error;
    for (const hook of afterPlayHooks) hook.call(this, action, undefined, context);
    throw error;
  }

  for (const hook of afterPlayHooks) hook.call(this, action, result, context);
  return result;
};

// Called dynamically by core reset and disconnect; custom-element lifecycle
// callbacks themselves were already registered before extensions loaded.
proto._resetExtensionEffects = function() {
  for (const hook of resetHooks) hook.call(this);
};

proto.reset = function() {
  this._resumeFrames?.();
  return baseReset.call(this);
};

proto._draw = function(now) {
  baseDraw.call(this, now);
  for (const hook of drawHooks) hook.call(this, now);
};

export { AgentRobotAvatar, registerAvatarExtension };
export default AgentRobotAvatar;
