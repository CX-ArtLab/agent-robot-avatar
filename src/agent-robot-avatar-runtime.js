import AgentRobotAvatar, { registerAvatarExtension } from './agent-robot-avatar-extension-host.js';

const proto = AgentRobotAvatar.prototype;
const basePlay = proto.play;
const baseNoteActivity = proto.noteActivity;
const baseSleep = proto.sleep;
const baseWake = proto.wake;
const baseResetToIdle = proto._resetToIdle;
const baseStartMorph = proto._startMorph;
const baseAnimateHead = proto._animateHead;
const baseUpdateBlink = proto._updateBlink;
const baseUpdateLook = proto._updateLook;
const baseUpdateHeadFollow = proto._updateHeadFollow;
const baseUpdateDragJelly = proto._updateDragJelly;
const baseOnPointerMove = proto._onPointerMove;
const baseOnDragMove = proto._onDragMove;
const baseOnDragStart = proto._onDragStart;
const baseOnDragEnd = proto._onDragEnd;
const baseResumeFrames = proto._resumeFrames;
const baseCanPauseFrames = proto._canPauseFrames;
const baseInput = proto.input;
const baseStartWaiting = proto.startWaiting;
const baseStopWaiting = proto.stopWaiting;
const baseDraw = proto._draw;

const DEFAULT_SIZE = 112;
const ACTION_ALIASES = Object.freeze({
  idle: 'idle',
  bored: 'bored',
  waiting: 'waiting',
  wait: 'waiting',
  input: 'input',
  send: 'send',
  success: 'success',
  failure: 'failure',
  failed: 'failure',
  fail: 'failure',
  warning: 'warning',
  inspect: 'inspect',
  verify: 'inspect',
  review: 'inspect',
  angry: 'angry',
  blocked: 'blocked',
  'policy-blocked': 'blocked',
  error: 'error',
  'system-error': 'error',
  'connection-error': 'error',
  surprise: 'surprise',
  sleep: 'sleep',
  wake: 'wake',
});

function normalizeAction(name) {
  const raw = String(name || '').trim().toLowerCase();
  const canonical = Object.hasOwn(ACTION_ALIASES, raw) ? ACTION_ALIASES[raw] : null;
  return { raw, canonical };
}

function wakePolicy(instance) {
  const value = String(instance.getAttribute('wake-on') || 'activity').trim().toLowerCase();
  return value === 'manual' || value === 'interaction' ? value : 'activity';
}

function requestedMotion(instance) {
  const value = String(instance.getAttribute('motion') || 'auto').trim().toLowerCase();
  return value === 'reduce' || value === 'full' ? value : 'auto';
}

function reducedMotion(instance) {
  const requested = requestedMotion(instance);
  if (requested === 'reduce') return true;
  if (requested === 'full') return false;
  // A fresh query preserves the existing WebKit runtime-preference hardening
  // without installing additional listeners.
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return instance._runtimeMotionQuery?.matches === true;
}

function emitActionState(instance, record, phase, silent = false) {
  if (!record || (phase !== 'start' && record.terminal)) return;
  if (phase !== 'start') record.terminal = true;
  if (silent) return;
  instance.dispatchEvent(new CustomEvent('action-state', {
    detail: { action: record.action, phase, source: record.source },
    bubbles: true,
    composed: true,
  }));
}

function cancelActiveAction(instance, { silent = false } = {}) {
  const record = instance._activeActionState;
  if (!record || record.terminal) return;
  if (instance._activeActionState === record) instance._activeActionState = null;
  emitActionState(instance, record, 'cancel', silent);
}

function beginAction(instance, action, source, continuous = false) {
  clearAutoSleep(instance);
  cancelActiveAction(instance);
  const record = {
    id: (instance._actionStateSequence || 0) + 1,
    action,
    source,
    continuous,
    terminal: false,
  };
  instance._actionStateSequence = record.id;
  instance._activeActionState = record;
  emitActionState(instance, record, 'start');
  return record;
}

function finishAction(instance, record, phase = 'end') {
  if (!record || record.terminal) return;
  if (instance._activeActionState !== record) return;
  instance._activeActionState = null;
  emitActionState(instance, record, phase);
  scheduleAutoSleep(instance);
}

function trackFiniteAction(instance, record, result) {
  if (record.continuous) return;
  if (result && typeof result.then === 'function') {
    Promise.resolve(result).then(
      () => finishAction(instance, record, 'end'),
      () => finishAction(instance, record, 'cancel'),
    );
  } else {
    finishAction(instance, record, 'end');
  }
}

function parseSize(value) {
  const text = String(value ?? '').trim();
  const match = text.match(/^(?:\d+(?:\.\d+)?|\.\d+)(?:px)?$/i);
  if (!match) return DEFAULT_SIZE;
  const numeric = Number.parseFloat(text);
  if (!Number.isFinite(numeric) || numeric <= 0) return DEFAULT_SIZE;
  return numeric;
}

function applySize(instance) {
  if (!instance.hasAttribute('size')) {
    if (instance._runtimeSizeApplied) instance.style.removeProperty('--face-size');
    instance._runtimeSizeApplied = false;
    return;
  }
  const size = parseSize(instance.getAttribute('size'));
  instance.style.setProperty('--face-size', `${size}px`);
  instance._runtimeSizeApplied = true;
}

function hasVisibleLayout(instance) {
  if (!instance.isConnected) return false;
  const rects = instance.getClientRects?.();
  if (!rects || rects.length === 0) return false;
  const rect = instance.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function cancelHeadAnimations(instance) {
  const animations = instance._headMotion?.getAnimations?.() || [];
  for (const animation of animations) animation.cancel();
  if (instance._headMotion) instance._headMotion.style.transform = '';
}


function cancelContinuousMotion(instance) {
  cancelHeadAnimations(instance);
  instance._blinkAnim = null;
  instance._blink = 1;
  instance._boredRoutine = null;
  instance._boredLookSpeed = null;
  if (instance._wanderTarget) instance._wanderTarget.x = instance._wanderTarget.y = 0;
  if (instance._wander) instance._wander.x = instance._wander.y = 0;
  if (instance._look) instance._look.x = instance._look.y = 0;
}

function dragAtRest(drag) {
  if (!drag || drag.active || drag.returning || drag.pendingReaction) return false;
  return Math.abs(drag.x) < 0.0001 && Math.abs(drag.y) < 0.0001 &&
    Math.abs(drag.vx) < 0.0001 && Math.abs(drag.vy) < 0.0001 &&
    Math.abs(drag.stretch) < 0.0001 && Math.abs(drag.shear) < 0.0001 &&
    Math.abs(drag.pullX) < 0.0001 && Math.abs(drag.pullY) < 0.0001;
}

function clearIdleDragVisuals(instance) {
  if (!dragAtRest(instance._dragJelly)) return;
  if (instance._dragMotion) {
    instance._dragMotion.style.transform = '';
    instance._dragMotion.style.transformOrigin = '';
  }
  if (instance._headShape && instance._baseHeadPathD) {
    instance._headShape.setAttribute('d', instance._baseHeadPathD);
  }
}

function clearAutoSleep(instance) {
  if (!instance._runtimeAutoSleepTimer) return;
  clearTimeout(instance._runtimeAutoSleepTimer);
  instance._runtimeAutoSleepTimer = 0;
}

function autoSleepBlocked(instance) {
  const record = instance._activeActionState;
  return Boolean(
    !instance.isConnected ||
    instance._runtimeDisconnecting ||
    instance._sleeping ||
    (record && !record.terminal && record.source !== 'interaction') ||
    instance._waitingRequested ||
    instance._waitingFx ||
    instance._inputWanted ||
    instance._state === 'input' ||
    instance._expressionLock
  );
}

function scheduleAutoSleep(instance) {
  clearAutoSleep(instance);
  const delayMs = Number(instance._autoSleepMs);
  if (!Number.isFinite(delayMs) || delayMs <= 0 || autoSleepBlocked(instance)) return;
  const remaining = Math.max(0, (instance._lastActivity + delayMs) - performance.now());
  instance._runtimeAutoSleepTimer = setTimeout(() => {
    instance._runtimeAutoSleepTimer = 0;
    if (autoSleepBlocked(instance)) return;
    const currentDelay = Number(instance._autoSleepMs);
    if (!Number.isFinite(currentDelay) || currentDelay <= 0) return;
    const nextRemaining = (instance._lastActivity + currentDelay) - performance.now();
    if (nextRemaining > 1) {
      scheduleAutoSleep(instance);
      return;
    }
    const previousSource = instance._runtimeActionSource;
    instance._runtimeActionSource = 'automatic';
    try {
      instance.sleep();
    } finally {
      instance._runtimeActionSource = previousSource;
    }
  }, remaining);
}

function requestVisualCommit(instance) {
  if (!instance.isConnected || instance._runtimeDisconnecting) return;
  instance._runtimeVisualDirty = true;
  instance._resumeFrames?.();
}

function syncMotionPreference(instance) {
  const reduced = reducedMotion(instance);
  if (instance._runtimeLastReducedMotion === reduced) return reduced;
  instance._runtimeLastReducedMotion = reduced;
  instance._runtimeVisualDirty = true;
  if (reduced) cancelContinuousMotion(instance);
  return reduced;
}

function clearDragGeometry(instance, { preserveClick = false, releaseCapture = true } = {}) {
  const drag = instance._dragJelly;
  if (!drag) return;
  const pointerId = drag.pointerId;
  const suppressClick = preserveClick && drag.moved;

  drag.active = false;
  drag.returning = false;
  drag.snapped = false;
  drag.pointerId = null;
  drag.pendingReaction = null;
  drag.targetX = drag.targetY = drag.x = drag.y = drag.vx = drag.vy = 0;
  drag.targetStretch = drag.stretch = drag.stretchVel = 0;
  drag.targetShear = drag.shear = drag.shearVel = 0;
  drag.targetPullX = drag.targetPullY = drag.pullX = drag.pullY = drag.pullVX = drag.pullVY = 0;
  drag.angle = 0;
  drag.maxDist = 0;
  drag.ux = drag.uy = 0;
  drag.anchorX = drag.anchorY = 50;
  instance._pendingDragEvent = null;

  if (releaseCapture && pointerId != null) {
    try { instance.releasePointerCapture(pointerId); } catch (_) {}
  }
  if (instance._dragMotion) {
    instance._dragMotion.style.transform = '';
    instance._dragMotion.style.transformOrigin = '';
  }
  if (instance._headShape && instance._baseHeadPathD) {
    instance._headShape.setAttribute('d', instance._baseHeadPathD);
  }
  instance._suppressClick = suppressClick;
}

function programActionOwnsExpression(instance) {
  const record = instance._activeActionState;
  if (record && !record.terminal && record.source !== 'interaction') return true;
  return Boolean(
    instance._waitingRequested ||
    instance._waitingFx ||
    instance._inputWanted ||
    instance._inspectFx ||
    instance._failureFx ||
    instance._warningFx ||
    instance._systemErrorShake ||
    instance._sleeping ||
    (instance._expressionLock && instance._state !== 'idle')
  );
}

function startDragReaction(instance, reaction) {
  if (!reaction || programActionOwnsExpression(instance)) return;
  const result = reaction === 'angry'
    ? instance.angry({ fromDrag: true })
    : instance.success({ fromDrag: true });
  const record = beginAction(instance, 'reaction', 'interaction', false);
  trackFiniteAction(instance, record, result);
}

function finishDragReturn(instance, reaction) {
  clearDragGeometry(instance, { preserveClick: true, releaseCapture: false });
  startDragReaction(instance, reaction);
}

function applyDragTransform(instance) {
  const drag = instance._dragJelly;
  if (!drag) return;
  instance._applyHeadDeform?.();
  if (!instance._dragMotion) return;
  const sx = 1 + drag.stretch;
  const sy = 1 - drag.stretch * 0.30;
  const shearDeg = drag.shear * 180 / Math.PI;
  instance._dragMotion.style.transformOrigin = `${drag.anchorX.toFixed(2)}% ${drag.anchorY.toFixed(2)}%`;
  instance._dragMotion.style.transform = `translate(${drag.x.toFixed(2)}px, ${drag.y.toFixed(2)}px) rotate(${drag.angle.toFixed(4)}rad) scale(${sx.toFixed(4)}, ${sy.toFixed(4)}) skewY(${shearDeg.toFixed(3)}deg) rotate(${(-drag.angle).toFixed(4)}rad)`;
}

function flushPointerWork(instance) {
  const pointer = instance._pendingPointerEvent;
  instance._pendingPointerEvent = null;
  if (pointer) {
    baseOnPointerMove.call(instance, pointer);
    instance._runtimePointerFlushCount = (instance._runtimePointerFlushCount || 0) + 1;
  }

  const drag = instance._pendingDragEvent;
  instance._pendingDragEvent = null;
  if (drag && instance._dragJelly?.active && drag.pointerId === instance._dragJelly.pointerId) {
    baseOnDragMove.call(instance, drag);
    instance._runtimeDragFlushCount = (instance._runtimeDragFlushCount || 0) + 1;
  }
}

function setRuntimeVisible(instance, visible) {
  const next = visible === true;
  if (instance._runtimeVisible === next) return;
  instance._runtimeVisible = next;
  if (!next) {
    if (instance._raf) cancelAnimationFrame(instance._raf);
    instance._raf = 0;
    instance._framePaused = true;
    instance._pendingPointerEvent = null;
    if (instance._dragJelly?.active || instance._dragJelly?.returning) {
      clearDragGeometry(instance, { preserveClick: true });
    }
    cancelHeadAnimations(instance);
    if (instance._antennaSpring) {
      instance._antennaSpring.vx = 0;
      instance._antennaSpring.vy = 0;
      instance._antennaSpring.initialized = false;
    }
    return;
  }
  instance._resumeFrames?.();
}

function handleMotionChange(instance) {
  const reduced = syncMotionPreference(instance);
  if (reduced) {
    cancelContinuousMotion(instance);
    instance._pose = { ...instance._toPose };
    instance._fromPose = { ...instance._toPose };
    instance._morphDuration = 0;
    if (instance._dragJelly?.returning) finishDragReturn(instance, instance._dragJelly.pendingReaction);
  }
  requestVisualCommit(instance);
  scheduleAutoSleep(instance);
}

function ensureRuntime(instance) {
  if (instance._runtimePolicyReady || !instance.isConnected || instance._runtimeDisconnecting) return;
  instance._runtimePolicyReady = true;
  if (!instance.style.touchAction) instance.style.touchAction = 'pinch-zoom';
  applySize(instance);

  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = () => handleMotionChange(instance);
    instance._runtimeMotionQuery = query;
    instance._runtimeMotionListener = listener;
    if (query.addEventListener) query.addEventListener('change', listener);
    else query.addListener?.(listener);
  }

  if (typeof MutationObserver !== 'undefined') {
    instance._runtimeAttributeObserver = new MutationObserver(records => {
      let motionChanged = false;
      let autoSleepChanged = false;
      for (const record of records) {
        if (record.attributeName === 'size') applySize(instance);
        if (record.attributeName === 'motion') motionChanged = true;
        if (record.attributeName === 'auto-sleep') autoSleepChanged = true;
      }
      if (motionChanged) handleMotionChange(instance);
      if (autoSleepChanged) scheduleAutoSleep(instance);
    });
    instance._runtimeAttributeObserver.observe(instance, {
      attributes: true,
      attributeFilter: ['size', 'motion', 'wake-on', 'auto-sleep'],
    });
  }

  if (typeof IntersectionObserver !== 'undefined') {
    instance._runtimeIntersectionObserver = new IntersectionObserver(entries => {
      const entry = entries[entries.length - 1];
      if (!entry) return;
      instance._runtimeIntersecting = entry.isIntersecting;
      setRuntimeVisible(instance, entry.isIntersecting && hasVisibleLayout(instance));
    });
    instance._runtimeIntersectionObserver.observe(instance);
  }

  if (typeof ResizeObserver !== 'undefined') {
    instance._runtimeResizeObserver = new ResizeObserver(() => {
      const inView = instance._runtimeIntersecting !== false;
      setRuntimeVisible(instance, inView && hasVisibleLayout(instance));
    });
    instance._runtimeResizeObserver.observe(instance);
  }

  instance._runtimeVisible = hasVisibleLayout(instance);
  instance._runtimeLostCapture = event => {
    if (instance._dragJelly?.active && event.pointerId === instance._dragJelly.pointerId) {
      clearDragGeometry(instance, { preserveClick: false, releaseCapture: false });
    }
  };
  instance.addEventListener('lostpointercapture', instance._runtimeLostCapture);

  if (!instance._runtimeLoopWrapped && typeof instance._loop === 'function') {
    const loop = instance._loop;
    instance._loop = ts => {
      flushPointerWork(instance);
      return loop(ts);
    };
    instance._runtimeLoopWrapped = true;
  }
  scheduleAutoSleep(instance);
}

function teardownRuntime(instance) {
  clearAutoSleep(instance);
  cancelContinuousMotion(instance);
  instance._runtimeIntersectionObserver?.disconnect();
  instance._runtimeResizeObserver?.disconnect();
  instance._runtimeAttributeObserver?.disconnect();
  if (instance._runtimeMotionQuery && instance._runtimeMotionListener) {
    if (instance._runtimeMotionQuery.removeEventListener) {
      instance._runtimeMotionQuery.removeEventListener('change', instance._runtimeMotionListener);
    } else {
      instance._runtimeMotionQuery.removeListener?.(instance._runtimeMotionListener);
    }
  }
  if (instance._runtimeLostCapture) {
    instance.removeEventListener('lostpointercapture', instance._runtimeLostCapture);
  }
  instance._runtimeIntersectionObserver = null;
  instance._runtimeResizeObserver = null;
  instance._runtimeAttributeObserver = null;
  instance._runtimeMotionQuery = null;
  instance._runtimeMotionListener = null;
  instance._runtimeLostCapture = null;
  instance._runtimePolicyReady = false;
  instance._runtimeVisible = false;
  instance._runtimeLastReducedMotion = undefined;
  instance._runtimeVisualDirty = false;
  instance._pendingPointerEvent = null;
  instance._pendingDragEvent = null;
}

function eventTargetsAvatar(event, instance) {
  const path = event?.composedPath?.();
  if (Array.isArray(path)) return path.includes(instance);
  return event?.target === instance || instance.contains?.(event?.target);
}

proto._isReducedMotion = function() {
  return reducedMotion(this);
};

proto.noteActivity = function(wake = true) {
  ensureRuntime(this);
  const shouldWake = wake !== false && (this._sleeping || this._state === 'sleep');
  const result = baseNoteActivity.call(this, false);
  scheduleAutoSleep(this);
  if (shouldWake) this.wake();
  return result;
};

proto._noteEnvironmentActivity = function(event) {
  ensureRuntime(this);
  const shouldConsiderWake = this._sleeping || this._state === 'sleep';
  const result = baseNoteActivity.call(this, false);
  scheduleAutoSleep(this);
  if (!shouldConsiderWake) return result;

  const policy = wakePolicy(this);
  const shouldWake = policy === 'activity' || (policy === 'interaction' && eventTargetsAvatar(event, this));
  if (!shouldWake) return result;

  const previousSource = this._runtimeActionSource;
  this._runtimeActionSource = 'automatic';
  try {
    return this.wake();
  } finally {
    this._runtimeActionSource = previousSource;
  }
};

proto._resetToIdle = function(notify = true) {
  const previous = this._runtimeResetNotify;
  this._runtimeResetNotify = notify;
  try {
    return baseResetToIdle.call(this, notify);
  } finally {
    this._runtimeResetNotify = previous;
    scheduleAutoSleep(this);
  }
};

proto._startMorph = function(target, duration, ease) {
  const reduced = reducedMotion(this);
  const result = baseStartMorph.call(this, target, reduced ? 0 : duration, ease);
  if (reduced) requestVisualCommit(this);
  return result;
};

proto._animateHead = function(frames, duration) {
  if (reducedMotion(this)) {
    cancelHeadAnimations(this);
    return undefined;
  }
  return baseAnimateHead.call(this, frames, duration);
};

proto._updateBlink = function(now) {
  if (!reducedMotion(this)) return baseUpdateBlink.call(this, now);
  this._blinkAnim = null;
  this._blink = 1;
};

proto._updateLook = function(now, dt) {
  if (!reducedMotion(this)) return baseUpdateLook.call(this, now, dt);
  this._boredRoutine = null;
  this._boredLookSpeed = null;
  this._wanderTarget.x = this._wanderTarget.y = 0;
  this._wander.x = this._wander.y = 0;
  this._look.x = this._look.y = 0;
};

proto._updateHeadFollow = function(now, dt) {
  if (!reducedMotion(this)) return baseUpdateHeadFollow.call(this, now, dt);
  this._headFollowPose.x = this._headFollowPose.y = this._headFollowPose.rot = 0;
  this._headFollowVel.x = this._headFollowVel.y = this._headFollowVel.rot = 0;
  if (this._headFollow) this._headFollow.setAttribute('transform', '');
};

proto._updateDragJelly = function(dt) {
  const drag = this._dragJelly;
  if (!reducedMotion(this)) {
    const result = baseUpdateDragJelly.call(this, dt);
    clearIdleDragVisuals(this);
    return result;
  }
  if (!drag) return;
  if (drag.active) {
    drag.x = drag.targetX;
    drag.y = drag.targetY;
    drag.stretch = drag.targetStretch;
    drag.shear = drag.targetShear;
    drag.pullX = drag.targetPullX;
    drag.pullY = drag.targetPullY;
    applyDragTransform(this);
  } else if (drag.returning) {
    finishDragReturn(this, drag.pendingReaction);
  }
  clearIdleDragVisuals(this);
};

proto._onPointerMove = function(event) {
  ensureRuntime(this);
  if (this._runtimeVisible === false) return;
  this._pendingPointerEvent = {
    clientX: event.clientX,
    clientY: event.clientY,
  };
  this._resumeFrames?.();
};

proto._onDragMove = function(event) {
  ensureRuntime(this);
  if (!this._dragJelly?.active || event.pointerId !== this._dragJelly.pointerId) return;
  this._pendingDragEvent = {
    clientX: event.clientX,
    clientY: event.clientY,
    pointerId: event.pointerId,
  };
  this._resumeFrames?.();
};

proto._onDragStart = function(event) {
  ensureRuntime(this);
  if (this._dragJelly?.active) return;
  if (event.pointerType === 'touch' && event.isPrimary === false) return;
  return baseOnDragStart.call(this, event);
};

proto._onDragEnd = function(event) {
  const drag = this._dragJelly;
  if (!drag?.active || event.pointerId !== drag.pointerId) return;
  flushPointerWork(this);
  if (event.type === 'pointercancel') {
    clearDragGeometry(this, { preserveClick: false });
    return;
  }
  baseOnDragEnd.call(this, event);
  if (reducedMotion(this) && drag.returning) finishDragReturn(this, drag.pendingReaction);
};

proto._finishDragReturn = function(reaction) {
  finishDragReturn(this, reaction);
};

proto._resumeFrames = function() {
  if (!this.isConnected || this._runtimeDisconnecting) return;
  ensureRuntime(this);
  if (this._runtimeVisible === false) return;
  if (syncMotionPreference(this)) this._runtimeVisualDirty = true;
  return baseResumeFrames.call(this);
};

proto._draw = function(now) {
  syncMotionPreference(this);
  const result = baseDraw.call(this, now);
  this._runtimeVisualDirty = false;
  return result;
};

proto._canPauseFrames = function(now) {
  if (this._runtimeVisible === false) return true;
  const reduced = syncMotionPreference(this);
  if (!reduced) return baseCanPauseFrames.call(this, now);
  if (this._pendingPointerEvent || this._pendingDragEvent || this._runtimeVisualDirty) return false;
  return true;
};

function playNoOp(instance, canonical) {
  if (canonical === 'wake') return !instance._sleeping && instance._state !== 'sleep';
  if (canonical === 'sleep') return instance._sleeping === true;
  if (canonical === 'input') return instance._inputWanted || instance._state === 'input';
  return false;
}

function leaveSleepForAction(instance) {
  if (!instance._sleeping && instance._state !== 'sleep') return;
  instance._sleeping = false;
  instance.setState('idle', { duration: reducedMotion(instance) ? 0 : 120 });
}

function prepareReplacement(instance, canonical) {
  clearAutoSleep(instance);
  cancelActiveAction(instance);
  clearDragGeometry(instance, { preserveClick: true });
  instance._cancelPendingWaits?.();
  if (canonical !== 'sleep' && canonical !== 'wake' && canonical !== 'idle') {
    leaveSleepForAction(instance);
  }
}

proto.play = function(name) {
  ensureRuntime(this);
  const { raw, canonical } = normalizeAction(name);
  if (!canonical) throw new Error(`Unknown Agent Robot Avatar action: ${name}`);
  if (playNoOp(this, canonical)) return this;
  if (canonical === 'idle') return basePlay.call(this, raw);

  prepareReplacement(this, canonical);

  let result;
  this._runtimeInPlay = true;
  try {
    result = basePlay.call(this, raw);
  } finally {
    this._runtimeInPlay = false;
  }

  const record = beginAction(this, canonical, 'api', canonical === 'input');
  trackFiniteAction(this, record, result);
  if (reducedMotion(this)) queueMicrotask(() => cancelHeadAnimations(this));
  return result;
};

proto.input = function(active = true) {
  if (this._runtimeInPlay) return baseInput.call(this, active);
  ensureRuntime(this);
  if (active) {
    if (this._inputWanted || this._state === 'input') return this;
    prepareReplacement(this, 'input');
    const result = baseInput.call(this, true);
    beginAction(this, 'input', 'api', true);
    return result;
  }

  const record = this._activeActionState?.action === 'input' ? this._activeActionState : null;
  const result = baseInput.call(this, false);
  if (record) finishAction(this, record, 'end');
  return result;
};

proto.startWaiting = async function() {
  ensureRuntime(this);
  clearAutoSleep(this);
  const result = await baseStartWaiting.call(this);
  if (this._waitingRequested && this._waitingFx) beginAction(this, 'waiting', 'api', true);
  return result;
};

proto.stopWaiting = function() {
  ensureRuntime(this);
  const record = this._activeActionState?.action === 'waiting' ? this._activeActionState : null;
  this._runtimeEndingWaiting = Boolean(record);
  let result;
  try {
    result = baseStopWaiting.call(this);
  } finally {
    this._runtimeEndingWaiting = false;
  }
  if (record) finishAction(this, record, 'end');
  return result;
};

proto.sleep = function() {
  if (this._runtimeInPlay) return baseSleep.call(this);
  ensureRuntime(this);
  if (this._sleeping) return this;
  prepareReplacement(this, 'sleep');
  const source = this._runtimeActionSource || 'api';
  const result = baseSleep.call(this);
  const record = beginAction(this, 'sleep', source, false);
  trackFiniteAction(this, record, result);
  return result;
};

proto.wake = function() {
  if (this._runtimeInPlay) return baseWake.call(this);
  ensureRuntime(this);
  if (!this._sleeping && this._state !== 'sleep') return this;
  prepareReplacement(this, 'wake');
  const source = this._runtimeActionSource || 'api';
  const result = baseWake.call(this);
  const record = beginAction(this, 'wake', source, false);
  trackFiniteAction(this, record, result);
  return result;
};

proto._autoSleep = function() {
  // Auto-sleep is scheduled independently from drawing by scheduleAutoSleep().
};

proto._scheduleAutoSleep = function() {
  scheduleAutoSleep(this);
};

proto._teardownRuntime = function() {
  teardownRuntime(this);
};

function setMask(top, bottom, topY, bottomY, topAngle = 0, bottomAngle = 0) {
  if (top) {
    top.setAttribute('y', (topY - 90).toFixed(2));
    top.setAttribute('height', '90');
    top.setAttribute('transform', `rotate(${topAngle.toFixed(2)} 0 ${topY.toFixed(2)})`);
  }
  if (bottom) {
    bottom.setAttribute('y', bottomY.toFixed(2));
    bottom.setAttribute('height', '90');
    bottom.setAttribute('transform', `rotate(${bottomAngle.toFixed(2)} 0 ${bottomY.toFixed(2)})`);
  }
}

function setEye(eye, x, y = 126, sx = 1, sy = 1) {
  if (eye) eye.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${sx.toFixed(3)} ${sy.toFixed(3)})`);
}

function drawReducedState(instance) {
  if (!reducedMotion(instance)) return;
  if (instance._state === 'input') {
    instance._leftInputBase?.setAttribute('opacity', '1');
    instance._rightInputBase?.setAttribute('opacity', '1');
  }
  if (instance._antennaDot) instance._antennaDot.style.opacity = '1';

  if (instance._waitingFx) {
    setEye(instance._leftEye, 100, 126, 0.92, 1);
    setEye(instance._rightEye, 140, 126, 0.92, 1);
    return;
  }
  if (instance._inspectFx) {
    setEye(instance._leftEye, 86);
    setEye(instance._rightEye, 154);
    setMask(instance._leftTop, instance._leftBottom, -8, 8);
    setMask(instance._rightTop, instance._rightBottom, -8, 8);
    return;
  }
  if (instance._warningFx) {
    setEye(instance._leftEye, 100, 126, 1.16, 1.10);
    setEye(instance._rightEye, 172, 132, 0.84, 0.96);
    setMask(instance._leftTop, instance._leftBottom, -18, 35, 8, 0);
    setMask(instance._rightTop, instance._rightBottom, -20, 36, -7, 0);
    return;
  }
  if (instance._systemErrorShake) {
    setMask(instance._leftTop, instance._leftBottom, -5, 36, -15, 0);
    setMask(instance._rightTop, instance._rightBottom, -5, 36, 15, 0);
  }
}

for (const property of ['_waitingFx', '_inspectFx', '_failureFx', '_warningFx', '_systemErrorShake']) {
  const slot = Symbol(property);
  Object.defineProperty(proto, property, {
    configurable: true,
    get() { return this[slot]; },
    set(value) {
      this[slot] = value;
      this._runtimeVisualDirty = true;
      if (this.isConnected && !this._runtimeDisconnecting && syncMotionPreference(this)) {
        requestVisualCommit(this);
        queueMicrotask(() => {
          if (this.isConnected && !this._runtimeDisconnecting && syncMotionPreference(this)) {
            cancelContinuousMotion(this);
          }
        });
      }
    },
  });
}

registerAvatarExtension({
  name: 'runtime-policy',
  reset() {
    const silent = this._runtimeResetNotify === false;
    if (!this._runtimeEndingWaiting) cancelActiveAction(this, { silent });
    clearDragGeometry(this, { preserveClick: !silent });
    this._pendingPointerEvent = null;
  },
  draw() {
    ensureRuntime(this);
    drawReducedState(this);
  },
});

export {
  AgentRobotAvatar,
  ACTION_ALIASES,
  DEFAULT_SIZE,
};
export default AgentRobotAvatar;
