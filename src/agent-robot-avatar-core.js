(() => {
  const EASE = {
    outQuint: t => 1 - Math.pow(1 - t, 5),
    inOutCubic: t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2,
  };

  const POSES = {
    idle: {
      w: 54, h: 58, rx: 27,
      topY: -36, bottomY: 36,
      topAL: 0, topAR: 0, bottomAL: 0, bottomAR: 0,
      scale: 1,
    },
    happy: {
      w: 58, h: 58, rx: 29,
      topY: -36, bottomY: 0,
      topAL: 0, topAR: 0, bottomAL: 0, bottomAR: 0,
      scale: 1,
    },
    sad: {
      w: 58, h: 58, rx: 29,
      topY: -5, bottomY: 36,
      topAL: -16, topAR: 16, bottomAL: 0, bottomAR: 0,
      scale: 1,
    },
    angry: {
      w: 58, h: 58, rx: 29,
      topY: -5, bottomY: 36,
      topAL: 16, topAR: -16, bottomAL: 0, bottomAR: 0,
      scale: 1,
    },
    sleepy: {
      w: 58, h: 56, rx: 28,
      topY: 0, bottomY: 36,
      topAL: 0, topAR: 0, bottomAL: 0, bottomAR: 0,
      scale: 1,
    },
    input: {
      w: 12, h: 78, rx: 2,
      topY: -44, bottomY: 44,
      topAL: 0, topAR: 0, bottomAL: 0, bottomAR: 0,
      scale: 1,
    },
    sleep: {
      w: 62, h: 10, rx: 2,
      topY: -20, bottomY: 20,
      topAL: 0, topAR: 0, bottomAL: 0, bottomAR: 0,
      scale: 1,
    },
    surprise: {
      w: 68, h: 68, rx: 34,
      topY: -40, bottomY: 40,
      topAL: 0, topAR: 0, bottomAL: 0, bottomAR: 0,
      scale: 1,
    },
  };

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const clonePose = p => ({...p});

  class AgentFace extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode: 'open'});
      this._state = 'idle';
      this._pose = clonePose(POSES.idle);
      this._fromPose = clonePose(this._pose);
      this._toPose = clonePose(this._pose);
      this._morphStart = performance.now();
      this._morphDuration = 0;
      this._morphEase = EASE.outQuint;

      this._wander = {x:0, y:0};
      this._wanderTarget = {x:0, y:0};
      this._nextWanderAt = performance.now() + 500;
      this._pointer = {x:0, y:0, active:false, lastMove:0};
      this._look = {x:0, y:0};
      this._headFollowPose = {x:0,y:0,rot:0};
      this._headFollowVel = {x:0,y:0,rot:0};
      this._headCenteringUntil = 0;
      this._eyeMicro = {lX:0,lY:0,rX:0,rY:0};
      this._blink = 1;
      this._blinkAnim = null;
      this._nextBlinkAt = performance.now() + 1800 + Math.random()*1800;
      this._inputPhase = 0;
      this._eyeNod = null;
      this._eyeBob = null;
      this._angryEyeDrop = null;
      this._surpriseShake = null;
      this._expressionLock = false;
      this._transitionToken = 0;
      this._inputWanted = false;
      this._sleeping = false;
      this._idleTimer = null;
      this._boredRoutine = null;
      this._boredLookSpeed = null;
      this._autoSleepMs = Number(this.getAttribute('auto-sleep')) || 0;
      this._lastActivity = performance.now();
      this._running = true;
      this._lastFrame = 0;
      this._raf = 0;
      this._dragJelly = {
        active:false, returning:false, snapped:false, moved:false, pointerId:null,
        startX:0, startY:0, hotX:120, hotY:120, targetX:0, targetY:0, x:0, y:0, vx:0, vy:0,
        targetStretch:0, stretch:0, stretchVel:0, angle:0, threshold:52,
        ux:0, uy:0, anchorX:50, anchorY:50, shear:0, targetShear:0, shearVel:0,
        targetPullX:0, targetPullY:0, pullX:0, pullY:0, pullVX:0, pullVY:0,
        maxDist:0, angryThreshold:32, pendingReaction:null, intent:'angry'
      };
      this._suppressClick = false;
      this._boundPointer = e => this._onPointerMove(e);
      this._boundDragStart = e => this._onDragStart(e);
      this._boundDragMove = e => this._onDragMove(e);
      this._boundDragEnd = e => this._onDragEnd(e);
      this._boundClickCapture = e => this._onClickCapture(e);
      this._boundVisibility = () => this._onVisibility();
      this._boundActivity = () => this.noteActivity();
      this._renderShell();
    }

    connectedCallback() {
      window.addEventListener('pointermove', this._boundPointer, {passive:true});
      window.addEventListener('pointerdown', this._boundActivity, {passive:true});
      window.addEventListener('keydown', this._boundActivity, {passive:true});
      window.addEventListener('pointermove', this._boundDragMove, {passive:true});
      window.addEventListener('pointerup', this._boundDragEnd, {passive:true});
      window.addEventListener('pointercancel', this._boundDragEnd, {passive:true});
      this.addEventListener('pointerdown', this._boundDragStart);
      this.addEventListener('click', this._boundClickCapture, true);
      document.addEventListener('visibilitychange', this._boundVisibility);
      this._running = !document.hidden;
      this._loop();
    }

    disconnectedCallback() {
      window.removeEventListener('pointermove', this._boundPointer);
      window.removeEventListener('pointerdown', this._boundActivity);
      window.removeEventListener('keydown', this._boundActivity);
      window.removeEventListener('pointermove', this._boundDragMove);
      window.removeEventListener('pointerup', this._boundDragEnd);
      window.removeEventListener('pointercancel', this._boundDragEnd);
      this.removeEventListener('pointerdown', this._boundDragStart);
      this.removeEventListener('click', this._boundClickCapture, true);
      document.removeEventListener('visibilitychange', this._boundVisibility);
      cancelAnimationFrame(this._raf);
    }

    static get observedAttributes() { return ['color','size','auto-sleep']; }
    attributeChangedCallback(name, oldV, newV) {
      if (oldV === newV) return;
      if (name === 'color' && this._head) this._head.setAttribute('fill', newV || '#08090b');
      if (name === 'size') this.style.setProperty('--face-size', `${Number(newV)||112}px`);
      if (name === 'auto-sleep') this._autoSleepMs = Number(newV) || 0;
    }

    _renderShell() {
      this.shadowRoot.innerHTML = `
        <style>
          :host{display:inline-block;width:var(--face-size,112px);height:var(--face-size,112px);contain:layout style;overflow:visible;cursor:pointer;user-select:none;-webkit-user-select:none;touch-action:manipulation}
          svg{display:block;width:100%;height:100%;overflow:visible}
          #dragMotion{transform-box:view-box;transform-origin:120px 120px;will-change:transform}
          #headFollow{will-change:transform}
          #headMotion{transform-origin:120px 120px;will-change:transform}
          #inputL,#inputR{opacity:1}
        </style>
        <svg viewBox="0 0 240 240" role="img" aria-label="Agent robot avatar">
          <defs>
            <path id="headShape" d="M 120.00 20.00 L 132.80 20.05 L 139.87 20.20 L 145.68 20.44 L 150.79 20.78 L 155.43 21.22 L 159.71 21.76 L 163.69 22.40 L 167.44 23.14 L 170.99 23.97 L 174.34 24.90 L 177.53 25.93 L 180.57 27.07 L 183.46 28.30 L 186.22 29.63 L 188.85 31.06 L 191.36 32.59 L 193.75 34.22 L 196.03 35.96 L 198.19 37.80 L 200.25 39.75 L 202.20 41.81 L 204.04 43.97 L 205.78 46.25 L 207.41 48.64 L 208.94 51.15 L 210.37 53.78 L 211.70 56.54 L 212.93 59.43 L 214.07 62.47 L 215.10 65.66 L 216.03 69.01 L 216.86 72.56 L 217.60 76.31 L 218.24 80.29 L 218.78 84.57 L 219.22 89.21 L 219.56 94.32 L 219.80 100.13 L 219.95 107.20 L 220.00 120.00 L 219.95 132.80 L 219.80 139.87 L 219.56 145.68 L 219.22 150.79 L 218.78 155.43 L 218.24 159.71 L 217.60 163.69 L 216.86 167.44 L 216.03 170.99 L 215.10 174.34 L 214.07 177.53 L 212.93 180.57 L 211.70 183.46 L 210.37 186.22 L 208.94 188.85 L 207.41 191.36 L 205.78 193.75 L 204.04 196.03 L 202.20 198.19 L 200.25 200.25 L 198.19 202.20 L 196.03 204.04 L 193.75 205.78 L 191.36 207.41 L 188.85 208.94 L 186.22 210.37 L 183.46 211.70 L 180.57 212.93 L 177.53 214.07 L 174.34 215.10 L 170.99 216.03 L 167.44 216.86 L 163.69 217.60 L 159.71 218.24 L 155.43 218.78 L 150.79 219.22 L 145.68 219.56 L 139.87 219.80 L 132.80 219.95 L 120.00 220.00 L 107.20 219.95 L 100.13 219.80 L 94.32 219.56 L 89.21 219.22 L 84.57 218.78 L 80.29 218.24 L 76.31 217.60 L 72.56 216.86 L 69.01 216.03 L 65.66 215.10 L 62.47 214.07 L 59.43 212.93 L 56.54 211.70 L 53.78 210.37 L 51.15 208.94 L 48.64 207.41 L 46.25 205.78 L 43.97 204.04 L 41.81 202.20 L 39.75 200.25 L 37.80 198.19 L 35.96 196.03 L 34.22 193.75 L 32.59 191.36 L 31.06 188.85 L 29.63 186.22 L 28.30 183.46 L 27.07 180.57 L 25.93 177.53 L 24.90 174.34 L 23.97 170.99 L 23.14 167.44 L 22.40 163.69 L 21.76 159.71 L 21.22 155.43 L 20.78 150.79 L 20.44 145.68 L 20.20 139.87 L 20.05 132.80 L 20.00 120.00 L 20.05 107.20 L 20.20 100.13 L 20.44 94.32 L 20.78 89.21 L 21.22 84.57 L 21.76 80.29 L 22.40 76.31 L 23.14 72.56 L 23.97 69.01 L 24.90 65.66 L 25.93 62.47 L 27.07 59.43 L 28.30 56.54 L 29.63 53.78 L 31.06 51.15 L 32.59 48.64 L 34.22 46.25 L 35.96 43.97 L 37.80 41.81 L 39.75 39.75 L 41.81 37.80 L 43.97 35.96 L 46.25 34.22 L 48.64 32.59 L 51.15 31.06 L 53.78 29.63 L 56.54 28.30 L 59.43 27.07 L 62.47 25.93 L 65.66 24.90 L 69.01 23.97 L 72.56 23.14 L 76.31 22.40 L 80.29 21.76 L 84.57 21.22 L 89.21 20.78 L 94.32 20.44 L 100.13 20.20 L 107.20 20.05 Z"/>
            <clipPath id="headClip"><use href="#headShape" transform="translate(7.2 7.2) scale(.94)"/></clipPath>
            <clipPath id="eyeMaskClip" clipPathUnits="userSpaceOnUse"><rect x="-40" y="-54" width="80" height="108"/></clipPath>
          </defs>
          <g id="dragMotion">
            <g id="headFollow">
              <g id="headMotion">
              <use id="head" href="#headShape" fill="#08090b" transform="translate(7.2 7.2) scale(.94)"/>
              <g clip-path="url(#headClip)">
                <g id="leftEye" transform="translate(86 126)">
                  <ellipse id="leftBase" cx="0" cy="0" rx="27" ry="29" fill="#fff"/>
                  <rect id="leftInputBase" x="-6" y="-39" width="12" height="78" rx="3" fill="#fff" opacity="0"/>
                  <g clip-path="url(#eyeMaskClip)">
                    <rect id="leftTop" x="-70" y="-96" width="140" height="60" fill="#08090b"/>
                    <rect id="leftBottom" x="-70" y="36" width="140" height="60" fill="#08090b"/>
                  </g>
                </g>
                <g id="rightEye" transform="translate(154 126)">
                  <ellipse id="rightBase" cx="0" cy="0" rx="27" ry="29" fill="#fff"/>
                  <rect id="rightInputBase" x="-6" y="-39" width="12" height="78" rx="3" fill="#fff" opacity="0"/>
                  <g clip-path="url(#eyeMaskClip)">
                    <rect id="rightTop" x="-70" y="-96" width="140" height="60" fill="#08090b"/>
                    <rect id="rightBottom" x="-70" y="36" width="140" height="60" fill="#08090b"/>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
        </svg>`;
      this._headShape = this.shadowRoot.getElementById('headShape');
      this._dragMotion = this.shadowRoot.getElementById('dragMotion');
      this._headFollow = this.shadowRoot.getElementById('headFollow');
      this._headMotion = this.shadowRoot.getElementById('headMotion');
      this._head = this.shadowRoot.getElementById('head');
      this._leftEye = this.shadowRoot.getElementById('leftEye');
      this._rightEye = this.shadowRoot.getElementById('rightEye');
      this._leftBase = this.shadowRoot.getElementById('leftBase');
      this._rightBase = this.shadowRoot.getElementById('rightBase');
      this._leftInputBase = this.shadowRoot.getElementById('leftInputBase');
      this._rightInputBase = this.shadowRoot.getElementById('rightInputBase');
      this._leftTop = this.shadowRoot.getElementById('leftTop');
      this._rightTop = this.shadowRoot.getElementById('rightTop');
      this._leftBottom = this.shadowRoot.getElementById('leftBottom');
      this._rightBottom = this.shadowRoot.getElementById('rightBottom');
      const c = this.getAttribute('color') || '#08090b';
      this._head.setAttribute('fill', c);
      [this._leftTop,this._rightTop,this._leftBottom,this._rightBottom].forEach(el=>el.setAttribute('fill',c));
      this.style.setProperty('--face-size', `${Number(this.getAttribute('size'))||112}px`);
      this._baseHeadPathD = this._headShape.getAttribute('d');
      this._baseHeadPoints = this._parseHeadPoints(this._baseHeadPathD);
    }

    _parseHeadPoints(d) {
      const nums = (d.match(/-?\d*\.?\d+/g) || []).map(Number);
      const pts = [];
      for (let i = 0; i < nums.length - 1; i += 2) pts.push({x: nums[i], y: nums[i+1]});
      return pts;
    }

    _pointsToPath(points) {
      if (!points.length) return this._baseHeadPathD || '';
      let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
      for (let i = 1; i < points.length; i++) d += ` L ${points[i].x.toFixed(2)} ${points[i].y.toFixed(2)}`;
      return `${d} Z`;
    }

    _clientToLocal(clientX, clientY) {
      const r = this.getBoundingClientRect();
      return {
        x: clamp(((clientX - r.left) / Math.max(1, r.width)) * 240, 0, 240),
        y: clamp(((clientY - r.top) / Math.max(1, r.height)) * 240, 0, 240),
      };
    }

    _applyHeadDeform() {
      const j = this._dragJelly;
      if (!this._headShape || !this._baseHeadPoints?.length) return;
      const amount = Math.hypot(j.pullX, j.pullY);
      if (amount < 0.015) {
        this._headShape.setAttribute('d', this._baseHeadPathD);
        return;
      }
      const radius = (50 + amount * 0.8) * 0.92;
      const pts = this._baseHeadPoints.map(p => {
        const dx = p.x - j.hotX;
        const dy = p.y - j.hotY;
        const w = Math.exp(-(dx*dx + dy*dy) / (2 * radius * radius));
        return {x:p.x + j.pullX * w, y:p.y + j.pullY * w};
      });
      this._headShape.setAttribute('d', this._pointsToPath(pts));
    }

    _onVisibility() {
      this._running = !document.hidden;
      if (this._running) {
        this._lastFrame = performance.now();
        cancelAnimationFrame(this._raf);
        this._loop();
      }
    }

    _onClickCapture(e) {
      if (!this._suppressClick) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      this._suppressClick = false;
    }

    _onPointerMove(e) {
      const r = this.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const near = Math.max(r.width, r.height) * 2.55;
      const dist = Math.hypot(dx, dy);
      const influence = clamp(1 - dist / near, 0, 1);
      this._pointer.x = clamp(dx * .42, -48, 48);
      this._pointer.y = clamp(dy * .38, -34, 34);
      this._pointer.active = influence > 0.001;
      this._pointer.influence = influence;
      this._pointer.lastMove = performance.now();
      if ((this._pointer.influence||0) > 0.65 && this._boredRoutine) { this._boredRoutine = null; this._boredLookSpeed = null; }
    }

    _onDragStart(e) {
      if (e.button != null && e.button !== 0) return;
      const r = this.getBoundingClientRect();
      const j = this._dragJelly;
      j.active = true;
      j.returning = false;
      j.snapped = false;
      j.moved = false;
      j.pointerId = e.pointerId;
      j.startX = e.clientX;
      j.startY = e.clientY;
      const local = this._clientToLocal(e.clientX, e.clientY);
      j.hotX = local.x;
      j.hotY = local.y;
      j.targetX = j.x;
      j.targetY = j.y;
      j.targetStretch = j.stretch;
      j.targetShear = j.shear;
      j.targetPullX = j.pullX;
      j.targetPullY = j.pullY;
      j.threshold = clamp(r.width * 0.40, 24, 46);
      j.maxDist = 0;
      j.pendingReaction = null;
      j.intent = 'angry';
      j.angryThreshold = Math.max(j.threshold * 0.76, 22);
      this._suppressClick = false;
      this._boredRoutine = null;
      this._boredLookSpeed = null;
      this._wanderTarget.x = this._wanderTarget.y = 0;
      try { this.setPointerCapture(e.pointerId); } catch (_) {}
    }

    _onDragMove(e) {
      const j = this._dragJelly;
      if (!j.active || e.pointerId !== j.pointerId) return;
      const dx = e.clientX - j.startX;
      const dy = e.clientY - j.startY;
      const dist = Math.hypot(dx, dy);
      j.maxDist = Math.max(j.maxDist, dist);
      if (dist > 2.5) {
        j.moved = true;
        this._suppressClick = true;
      }
      const r = this.getBoundingClientRect();
      const size = Math.max(1, Math.max(r.width, r.height));
      const localScale = 240 / size;
      const pdx = dx * localScale;
      const pdy = dy * localScale;
      const cx = 120, cy = 120;
      const rx = j.hotX - cx;
      const ry = j.hotY - cy;
      const rl = Math.max(1, Math.hypot(rx, ry));
      const rux = rx / rl;
      const ruy = ry / rl;
      const radial = pdx * rux + pdy * ruy;
      const tangent = -pdx * ruy + pdy * rux;
      const motionLen = Math.max(1, Math.hypot(pdx, pdy));
      j.ux = pdx / motionLen;
      j.uy = pdy / motionLen;
      j.angle = Math.atan2(j.uy, j.ux);
      j.intent = radial < -6 ? 'success' : 'angry';
      const gain = dist > j.threshold * .60 ? 0.24 : 0.19;
      j.targetPullX = clamp(pdx * gain, -25, 25);
      j.targetPullY = clamp(pdy * gain, -25, 25);
      j.targetX = clamp(dx * 0.065, -5.2, 5.2);
      j.targetY = clamp(dy * 0.065, -5.2, 5.2);
      j.targetStretch = clamp((radial / 240) * .08, -.028, .052);
      j.targetShear = clamp((tangent / 240) * .050, -.022, .022);
      j.anchorX = clamp(50 - (rux * 31), 15, 85);
      j.anchorY = clamp(50 - (ruy * 31), 15, 85);
    }

    _onDragEnd(e) {
      const j = this._dragJelly;
      if (!j.active || e.pointerId !== j.pointerId) return;
      j.active = false;
      try { this.releasePointerCapture(e.pointerId); } catch (_) {}
      j.pointerId = null;
      const reactionThreshold = Math.max(j.angryThreshold, 22);
      j.pendingReaction = j.maxDist >= reactionThreshold ? j.intent : null;
      j.returning = true;
      j.targetX = 0;
      j.targetY = 0;
      j.targetStretch = 0;
      j.targetShear = 0;
      j.targetPullX = 0;
      j.targetPullY = 0;
    }

    _finishDragReturn(reaction) {
      const j = this._dragJelly;
      j.returning = false;
      j.pendingReaction = null;
      j.x = j.y = j.vx = j.vy = 0;
      j.stretch = j.stretchVel = 0;
      j.shear = j.shearVel = 0;
      j.pullX = j.pullY = j.pullVX = j.pullVY = 0;
      if (this._dragMotion) this._dragMotion.style.transform = '';
      if (this._headShape) this._headShape.setAttribute('d', this._baseHeadPathD);
      if (reaction === 'angry') this.angry({fromDrag:true});
      else if (reaction === 'success') this.success({fromDrag:true});
    }

    _updateDragJelly(dt) {
      const j = this._dragJelly;
      const dtS = Math.min(dt, 34) / 1000;
      if (j.active) {
        const fast = Math.min(1, dt / 14);
        const k = 0.36 + 0.30 * fast;
        j.x = lerp(j.x, j.targetX, k);
        j.y = lerp(j.y, j.targetY, k);
        j.stretch = lerp(j.stretch, j.targetStretch, k*.85);
        j.shear = lerp(j.shear, j.targetShear, k*.80);
        j.pullX = lerp(j.pullX, j.targetPullX, k*.95);
        j.pullY = lerp(j.pullY, j.targetPullY, k*.95);
      } else if (j.returning) {
        const kx = 135, dx = 8.2;
        const ax = -j.x * kx - j.vx * dx;
        const ay = -j.y * kx - j.vy * dx;
        j.vx += ax * dtS;
        j.vy += ay * dtS;
        j.x += j.vx * dtS;
        j.y += j.vy * dtS;
        const ks = 128, ds = 7.5;
        const as = -j.stretch * ks - j.stretchVel * ds;
        j.stretchVel += as * dtS;
        j.stretch += j.stretchVel * dtS;
        const kh = 118, dh = 7.2;
        const ah = -j.shear * kh - j.shearVel * dh;
        j.shearVel += ah * dtS;
        j.shear += j.shearVel * dtS;
        const kp = 118, dp = 7.1;
        const apx = -j.pullX * kp - j.pullVX * dp;
        const apy = -j.pullY * kp - j.pullVY * dp;
        j.pullVX += apx * dtS;
        j.pullVY += apy * dtS;
        j.pullX += j.pullVX * dtS;
        j.pullY += j.pullVY * dtS;

        const visuallyRecovered = Math.abs(j.x) < 0.34 && Math.abs(j.y) < 0.34 && Math.abs(j.stretch) < 0.008 && Math.abs(j.shear) < 0.0035 && Math.abs(j.pullX) < 0.40 && Math.abs(j.pullY) < 0.40;
        if (j.pendingReaction && visuallyRecovered) {
          this._finishDragReturn(j.pendingReaction);
        } else if (Math.abs(j.x) < 0.02 && Math.abs(j.y) < 0.02 && Math.abs(j.vx) < 0.04 && Math.abs(j.vy) < 0.04 && Math.abs(j.stretch) < 0.001 && Math.abs(j.stretchVel) < 0.003 && Math.abs(j.shear) < 0.0005 && Math.abs(j.shearVel) < 0.002 && Math.abs(j.pullX) < 0.03 && Math.abs(j.pullY) < 0.03 && Math.abs(j.pullVX) < 0.06 && Math.abs(j.pullVY) < 0.06) {
          this._finishDragReturn(null);
        }
      }
      j.stretch = clamp(j.stretch, -0.035, 0.055);
      j.shear = clamp(j.shear, -0.026, 0.026);
      j.pullX = clamp(j.pullX, -26, 26);
      j.pullY = clamp(j.pullY, -26, 26);
      this._applyHeadDeform();
      if (this._dragMotion) {
        const sx = 1 + j.stretch;
        const sy = 1 - j.stretch * 0.30;
        const shearDeg = j.shear * 180 / Math.PI;
        this._dragMotion.style.transformOrigin = `${j.anchorX.toFixed(2)}% ${j.anchorY.toFixed(2)}%`;
        this._dragMotion.style.transform = `translate(${j.x.toFixed(2)}px, ${j.y.toFixed(2)}px) rotate(${j.angle.toFixed(4)}rad) scale(${sx.toFixed(4)}, ${sy.toFixed(4)}) skewY(${shearDeg.toFixed(3)}deg) rotate(${(-j.angle).toFixed(4)}rad)`;
      }
    }

    noteActivity(wake=true) {
      this._lastActivity = performance.now();
      if (wake && this._sleeping) this.wake();
    }

    play(name) {
      const action = String(name || '').trim().toLowerCase();
      switch (action) {
        case 'idle': return this.reset();
        case 'bored': return this.bored();
        case 'input': return this.input(true);
        case 'send': return this.send();
        case 'success': return this.success();
        case 'error': return this.error();
        case 'angry': return this.angry();
        case 'surprise': return this.surprise();
        case 'sleep': return this.sleep();
        case 'wake': return this.wake();
        default: throw new Error(`Unknown Agent Robot Avatar action: ${name}`);
      }
    }

    reset() {
      this._inputWanted = false;
      ++this._transitionToken;
      this._boredRoutine = null;
      this._boredLookSpeed = null;
      this._sleeping = false;
      this._eyeNod = null;
      this._eyeBob = null;
      this._angryEyeDrop = null;
      this._surpriseShake = null;
      this.setState('idle');
      return this;
    }

    setState(name, opts={}) {
      if (!POSES[name]) throw new Error(`Unknown AgentFace state: ${name}`);
      this._state = name;
      this._sleeping = name === 'sleep';
      if (name === 'idle' && !opts.keepGazeLock) this._releaseExpressionLock();
      this._startMorph(POSES[name], opts.duration ?? (name==='surprise'?170:320), opts.ease || EASE.outQuint);
      this.dispatchEvent(new CustomEvent('face-state', {detail:{state:name}}));
      return this;
    }

    _startMorph(target, duration, ease) {
      this._fromPose = clonePose(this._pose);
      this._toPose = clonePose(target);
      this._morphStart = performance.now();
      this._morphDuration = Math.max(0, duration);
      this._morphEase = ease;
    }

    async success(opts={}) {
      const fromDrag = !!opts.fromDrag;
      this.noteActivity();
      this._inputWanted = false;
      if (fromDrag) {
        ++this._transitionToken;
        this._expressionLock = true;
        this._eyeMicro.lX = this._eyeMicro.lY = 0;
        this._eyeMicro.rX = this._eyeMicro.rY = 0;
        this._wanderTarget.x = this._wanderTarget.y = 0;
        this._headCenteringUntil = performance.now() + 120;
        this._look.x = 0;
        this._look.y = 0;
      } else {
        if (!(await this._prepareExpression({normalizePose:true, duration:180, pause:320}))) return;
      }
      this.setState('happy', {duration: fromDrag ? 180 : 220, keepGazeLock:true});
      this._eyeBob = {start: performance.now(), duration: 620, amp: 8};
      this._animateHead([
        {transform:'translateY(0px)'},
        {transform:'translateY(-2.4px)', offset:.42},
        {transform:'translateY(0px)'}
      ], 760);
      await this._wait(980);
      this._eyeBob = null;
      if (this._state==='happy') await this._returnToIdle(520);
    }

    async error() {
      this.noteActivity();
      this._inputWanted = false;
      if (!(await this._prepareExpression({normalizePose:true, duration:180, pause:320}))) return;
      this.setState('sad', {duration:320, keepGazeLock:true});
      this._eyeBob = {start: performance.now(), duration: 700, amp: 7};
      this._animateHead([
        {transform:'translateY(0px)'},
        {transform:'translateY(2.6px)', offset:.46},
        {transform:'translateY(0px)'}
      ], 820);
      await this._wait(1180);
      this._eyeBob = null;
      if (this._state==='sad') {
        await this._returnToIdle(560);
      }
    }

    async angry(opts={}) {
      const fromDrag = !!opts.fromDrag;
      this.noteActivity();
      this._inputWanted = false;
      if (fromDrag) {
        ++this._transitionToken;
        this._expressionLock = true;
        this._eyeMicro.lX = this._eyeMicro.lY = 0;
        this._eyeMicro.rX = this._eyeMicro.rY = 0;
        this._wanderTarget.x = this._wanderTarget.y = 0;
        this._headCenteringUntil = performance.now() + 120;
        this._look.x = 0;
        this._look.y = 0;
      } else {
        if (!(await this._prepareExpression({normalizePose:true, duration:180, pause:320}))) return;
      }
      this.setState('angry', {duration: fromDrag ? 180 : 280, keepGazeLock:true});
      this._angryEyeDrop = {start: performance.now(), duration:680, amount:4.8};
      this._animateHead([
        {transform:'translateY(0px)'},
        {transform:'translateY(2.6px)', offset:.46},
        {transform:'translateY(0px)'}
      ], 820);
      await this._wait(980);
      this._angryEyeDrop = null;
      if (this._state==='angry') await this._returnToIdle(500);
    }

    async surprise() {
      this.noteActivity();
      this._inputWanted = false;
      if (!(await this._prepareExpression({normalizePose:true, duration:180, pause:320}))) return;
      this._surpriseShake = null;
      const pre = {...POSES.idle, w:34, h:36, rx:18};
      this._startMorph(pre, 235, EASE.inOutCubic);
      await this._wait(235);
      if (this._state!=='idle') return;
      this.setState('surprise', {duration:175, ease:EASE.outQuint, keepGazeLock:true});
      this._animateHead([{transform:'scale(1)'},{transform:'scale(1.035)'}], 175);
      await this._wait(175);
      if (this._state!=='surprise') return;
      this._surpriseShake = {start: performance.now(), duration:420};
      await this._wait(420);
      this._surpriseShake = null;
      if (this._state==='surprise') {
        this._animateHead([{transform:'scale(1.035)'},{transform:'scale(1)'}], 430);
        await this._returnToIdle(430, EASE.inOutCubic);
      }
    }

    async send() {
      this.noteActivity();
      this._inputWanted = false;
      if (!(await this._prepareExpression({normalizePose:true, duration:180, pause:320}))) return;
      this._eyeNod = {start: performance.now(), duration: 760};
      this._animateHead([
        {transform:'translateY(0px)'},
        {transform:'translateY(5px)', offset:.52},
        {transform:'translateY(0px)'}
      ], 920);
      await this._wait(860);
      this._eyeNod = null;
      this._releaseExpressionLock();
    }

    async sleep() {
      if (this._sleeping) return;
      if (!(await this._prepareExpression({normalizePose:true, duration:160}))) return;
      this._blinkAnim = null;
      this._blink = 1;
      this._nextBlinkAt = performance.now() + 10000;
      this.setState('sleepy', {duration:940, ease:EASE.inOutCubic, keepGazeLock:true});
      await this._wait(980);
      if (this._state !== 'sleepy') return;
      const reopen = {...POSES.idle, topY:-22, bottomY:36};
      this._startMorph(reopen, 105, EASE.outQuint);
      await this._wait(120);
      if (this._state !== 'sleepy') return;
      this.setState('sleepy', {duration:820, ease:EASE.inOutCubic, keepGazeLock:true});
      await this._wait(870);
      if (this._state !== 'sleepy') return;
      await this._wait(120);
      if (this._state !== 'sleepy') return;
      this._animateHead([{transform:'translateY(0)'},{transform:'translateY(4px)'}],980);
      this._startMorph(POSES.sleep, 980, EASE.inOutCubic);
      this._state = 'sleep';
      this.dispatchEvent(new CustomEvent('face-state', {detail:{state:'sleep'}}));
      this._sleeping = true;
      this._nextBlinkAt = performance.now() + 3200 + Math.random()*2200;
    }

    async wake() {
      if (!this._sleeping && this._state!=='sleep') return;
      this._expressionLock = true;
      this._sleeping = false;
      this._animateHead([
        {transform:'translateY(4px) scale(1)'},
        {transform:'translateY(-2px) scale(1.015)', offset:.55},
        {transform:'translateY(0) scale(1)'}
      ], 500);
      this.setState('sleepy', {duration:240, keepGazeLock:true});
      await this._wait(260);
      this.setState('surprise', {duration:120, keepGazeLock:true});
      await this._wait(190);
      await this._returnToIdle(300);
      this._lastActivity = performance.now();
    }

    async input(active=true) {
      this.noteActivity();
      if (active) {
        if (this._inputWanted || this._state==='input') return;
        this._inputWanted = true;
        if (!(await this._prepareExpression({normalizePose:true, duration:140}))) return;
        if (!this._inputWanted) return;
        this.setState('input', {duration:210, keepGazeLock:true});
      } else {
        this._inputWanted = false;
        ++this._transitionToken;
        if (this._state==='input') this.setState('idle', {duration:260});
        else this._releaseExpressionLock();
      }
    }

    _animateHead(frames, duration) {
      if (!this._headMotion.animate) return;
      const anim = this._headMotion.animate(frames, {duration, easing:'cubic-bezier(.16,1,.3,1)', fill:'forwards'});
      anim.onfinish = () => { this._headMotion.style.transform = frames[frames.length-1].transform || ''; };
      return anim;
    }

    _wait(ms) { return new Promise(r=>setTimeout(r,ms)); }

    async _returnToIdle(duration=320, ease=EASE.outQuint) {
      this.setState('idle', {duration, ease, keepGazeLock:true});
      this._headCenteringUntil = Math.max(this._headCenteringUntil || 0, performance.now() + duration);
      await this._wait(duration);
      if (this._state === 'idle') this._releaseExpressionLock();
    }

    async _prepareExpression({normalizePose=true, duration=180, pause=320}={}) {
      const token = ++this._transitionToken;
      this._expressionLock = true;
      this._eyeMicro.lX = this._eyeMicro.lY = 0;
      this._eyeMicro.rX = this._eyeMicro.rY = 0;
      this._wanderTarget.x = this._wanderTarget.y = 0;
      this._headCenteringUntil = performance.now() + duration + pause;
      if (normalizePose && this._state !== 'idle') {
        this.setState('idle', {duration:Math.min(140, duration), keepGazeLock:true});
      }
      await this._wait(duration);
      if (token !== this._transitionToken) return false;
      if (pause > 0) await this._wait(pause);
      return token === this._transitionToken;
    }

    async bored() {
      this.noteActivity();
      this._inputWanted = false;
      this._sleeping = false;
      if (!(await this._prepareExpression({normalizePose:true, duration:180, pause:620}))) return;
      this._expressionLock = false;
      this._look.x = 0;
      this._look.y = 0;
      this._wander.x = 0;
      this._wander.y = 0;
      this._startBoredRoutine(performance.now());
    }

    _startBoredRoutine(now) {
      this._boredRoutine = {
        index: 0,
        nextAt: now,
        steps: [
          {x:-18,y:-11,hold:1400,lookSpeed:2},
          {x:18,y:-11,hold:1400,lookSpeed:2},
          {x:0,y:0,hold:320,lookSpeed:2},
        ]
      };
    }

    _updateBored(now) {
      if (!this._boredRoutine) return false;
      if (now < this._boredRoutine.nextAt) return true;
      const step = this._boredRoutine.steps[this._boredRoutine.index];
      if (!step) {
        this._boredRoutine = null;
        this._boredLookSpeed = null;
        this._wanderTarget.x = this._wanderTarget.y = 0;
        return false;
      }
      this._wanderTarget.x = step.x;
      this._wanderTarget.y = step.y;
      this._boredLookSpeed = step.lookSpeed ?? null;
      this._boredRoutine.index += 1;
      this._boredRoutine.nextAt = now + step.hold;
      return true;
    }

    _releaseExpressionLock() {
      this._expressionLock = false;
      this._headCenteringUntil = 0;
    }

    _updateMorph(now) {
      if (!this._morphDuration) {
        this._pose = clonePose(this._toPose);
        return;
      }
      const t = clamp((now - this._morphStart) / this._morphDuration, 0, 1);
      const k = this._morphEase(t);
      const p = {};
      for (const key of Object.keys(this._toPose)) p[key] = lerp(this._fromPose[key], this._toPose[key], k);
      this._pose = p;
      if (t >= 1) this._morphDuration = 0;
    }

    _updateBlink(now) {
      if (this._sleeping || this._state === 'input') return;
      if (this._blinkAnim) {
        const t = clamp((now - this._blinkAnim.start) / this._blinkAnim.duration, 0, 1);
        this._blink = t < .5 ? lerp(1,.08,t*2) : lerp(.08,1,(t-.5)*2);
        if (t >= 1) {
          this._blinkAnim = null;
          this._blink = 1;
          this._nextBlinkAt = now + 1900 + Math.random()*2600;
        }
      } else if (!this._expressionLock && now >= this._nextBlinkAt) {
        this._blinkAnim = {start:now,duration:150+Math.random()*70};
      }
    }

    _updateLook(now, dt) {
      this._updateBored(now);
      const pointerFresh = (now - this._pointer.lastMove) < 900;
      if (!this._expressionLock && !this._boredRoutine && !this._sleeping && this._state!=='input' && now >= this._nextWanderAt) {
        const ampX = 12 + Math.random()*13;
        const ampY = 5 + Math.random()*9;
        this._wanderTarget.x = (Math.random()*2-1)*ampX;
        this._wanderTarget.y = (Math.random()*2-1)*ampY;
        this._nextWanderAt = now + 1150 + Math.random()*1900;
      }
      const draggingJelly = this._dragJelly.active || this._dragJelly.returning;
      const pointerMix = (!this._expressionLock && !this._boredRoutine && pointerFresh && this._pointer.active && !this._sleeping && this._state!=='input')
        ? Math.pow(this._pointer.influence || 0, 1.6)
        : 0;
      const targetX = this._expressionLock ? 0 : lerp(this._wanderTarget.x, this._pointer.x, pointerMix);
      const targetY = this._expressionLock ? 0 : lerp(this._wanderTarget.y, this._pointer.y, pointerMix);
      const lookSpeed = this._expressionLock ? 0.40 : (draggingJelly ? 0.42 : (this._boredRoutine && this._boredLookSpeed != null ? this._boredLookSpeed : (pointerMix > 0.05 ? 0.28 : 0.16)));
      const kL = 1 - Math.pow(1 - clamp(lookSpeed,0.02,.9), dt/16.67);
      this._look.x = lerp(this._look.x, targetX, kL);
      this._look.y = lerp(this._look.y, targetY, kL);
      if (this._sleeping) {
        this._look.x *= .92;
        this._look.y *= .92;
      }
    }

    _autoSleep(now) {
      if (!this._autoSleepMs || this._sleeping || ['input','happy','sad','surprise'].includes(this._state)) return;
      if (now - this._lastActivity > this._autoSleepMs) this.sleep();
    }

    _updateHeadFollow(now, dt) {
      const pointerFresh = (now - this._pointer.lastMove) < 900;
      const pointerInRange = pointerFresh && this._pointer.active && (this._pointer.influence || 0) > 0.03;
      const headCentering = now < (this._headCenteringUntil || 0);
      const jellyBusy = this._dragJelly.active || this._dragJelly.returning;
      const canFollowPointer = pointerInRange && !jellyBusy && !this._sleeping && !this._boredRoutine && !headCentering && !this._expressionLock;
      const srcX = canFollowPointer ? this._pointer.x : this._look.x;
      const srcY = canFollowPointer ? this._pointer.y : this._look.y;
      const nx = clamp(srcX / 48, -1, 1);
      const ny = clamp(srcY / 34, -1, 1);
      const diag = clamp(nx * ny, -1, 1);
      const targetRot = diag * 8;
      const targetX = canFollowPointer ? nx * 4.2 : 0;
      const targetY = canFollowPointer ? ny * 4.2 : 0;

      const dtS = Math.min(dt, 34) / 1000;
      const rotStiffness = canFollowPointer ? 70 : 56;
      const rotDamping = canFollowPointer ? 15 : 13;
      const aRot = (targetRot - this._headFollowPose.rot) * rotStiffness - this._headFollowVel.rot * rotDamping;
      this._headFollowVel.rot += aRot * dtS;
      this._headFollowPose.rot += this._headFollowVel.rot * dtS;
      const stiffness = canFollowPointer ? 95 : 80;
      const damping = canFollowPointer ? 16 : 14;
      const ax = (targetX - this._headFollowPose.x) * stiffness - this._headFollowVel.x * damping;
      const ay = (targetY - this._headFollowPose.y) * stiffness - this._headFollowVel.y * damping;
      this._headFollowVel.x += ax * dtS;
      this._headFollowVel.y += ay * dtS;
      this._headFollowPose.x += this._headFollowVel.x * dtS;
      this._headFollowPose.y += this._headFollowVel.y * dtS;

      if (!canFollowPointer) {
        if (Math.abs(this._headFollowPose.x) < 0.01 && Math.abs(this._headFollowVel.x) < 0.01) { this._headFollowPose.x = 0; this._headFollowVel.x = 0; }
        if (Math.abs(this._headFollowPose.y) < 0.01 && Math.abs(this._headFollowVel.y) < 0.01) { this._headFollowPose.y = 0; this._headFollowVel.y = 0; }
        if (Math.abs(this._headFollowPose.rot) < 0.01 && Math.abs(this._headFollowVel.rot) < 0.01) { this._headFollowPose.rot = 0; this._headFollowVel.rot = 0; }
      }

      if (this._headFollow) {
        const a = this._headFollowPose.rot.toFixed(2);
        const tx = this._headFollowPose.x.toFixed(2);
        const ty = this._headFollowPose.y.toFixed(2);
        this._headFollow.setAttribute('transform', `translate(${tx} ${ty}) translate(120 120) rotate(${a}) translate(-120 -120)`);
      }
    }

    _draw(now) {
      const p = this._pose;
      let nodY = 0;
      let nodScaleY = 1;
      if (this._eyeNod) {
        const elapsed = now - this._eyeNod.start;
        let depth = 0;
        if (elapsed < 150) depth = elapsed / 150;
        else if (elapsed < 300) depth = 1 - (elapsed - 150) / 150;
        else if (elapsed < 450) depth = (elapsed - 300) / 150;
        else if (elapsed < 760) depth = 1 - (elapsed - 450) / 310;
        else { depth = 0; this._eyeNod = null; }
        depth = clamp(depth, 0, 1);
        nodY = 31 * depth;
        nodScaleY = 1 - .30 * depth;
      }

      let angryDropY = 0;
      if (this._angryEyeDrop) {
        const t = clamp((now - this._angryEyeDrop.start) / this._angryEyeDrop.duration, 0, 1);
        const settle = 1 - Math.exp(-5.2 * t) * Math.cos(8.6 * t);
        angryDropY = this._angryEyeDrop.amount * settle;
        if (t >= 1) angryDropY = this._angryEyeDrop.amount;
      }

      let emotionBobY = 0;
      if (this._eyeBob) {
        const t = clamp((now - this._eyeBob.start) / this._eyeBob.duration, 0, 1);
        const cycles = 2;
        emotionBobY = Math.sin(t * Math.PI * cycles * 2) * this._eyeBob.amp * (1 - 0.38*t);
        if (t >= 1) this._eyeBob = null;
      }

      let surpriseScale = 1;
      if (this._surpriseShake) {
        const t = clamp((now - this._surpriseShake.start) / this._surpriseShake.duration, 0, 1);
        surpriseScale = 1 + 0.022 * Math.sin(t * Math.PI * 8) * (1 - 0.18*t);
        if (t >= 1) this._surpriseShake = null;
      }

      const blinkH = Math.max(2.6, p.h * this._blink * nodScaleY * surpriseScale);
      const yAdjust = (p.h - blinkH) * 0.02;
      const cursorPeriod = 530;
      const inputBlinkOn = this._state==='input' ? ((Math.floor(now / (cursorPeriod/2)) % 2) === 0) : true;
      const inputPulseL = this._state==='input' ? (inputBlinkOn ? 1 : 0) : 1;
      const inputPulseR = inputPulseL;

      const jellyEyeOffset = (cx, cy) => {
        const j = this._dragJelly;
        const amount = Math.hypot(j.pullX, j.pullY);
        if (amount < 0.05) return {x:0, y:0};
        const radius = (50 + amount * 0.8) * 0.92;
        const dx = cx - j.hotX;
        const dy = cy - j.hotY;
        const w = Math.exp(-(dx*dx + dy*dy) / (2 * radius * radius)) * 0.24;
        return {x: j.pullX * w, y: j.pullY * w};
      };

      const setEye = (base, inputBase, top, bottom, side, cx, microX, microY, opacity) => {
        const isInput = this._state === 'input';
        const projectedX = cx + this._look.x + microX;
        const edgeDistance = side==='L' ? (projectedX - 32) : (208 - projectedX);
        const edgeFactor = clamp(1 - edgeDistance / 58, 0, 1);
        const baseW = p.w * surpriseScale;
        const baseH = blinkH;
        const w = baseW * (1 - 0.22 * edgeFactor * edgeFactor);
        const h = baseH * (1 - 0.08 * edgeFactor * edgeFactor);
        const inwardShift = ((baseW - w) * 0.58) * (side==='L' ? 1 : -1);

        if (isInput) {
          base.setAttribute('opacity', '0');
          inputBase.setAttribute('x', (-p.w/2).toFixed(2));
          inputBase.setAttribute('y', (-p.h/2 + yAdjust).toFixed(2));
          inputBase.setAttribute('width', p.w.toFixed(2));
          inputBase.setAttribute('height', p.h.toFixed(2));
          inputBase.setAttribute('rx', '3');
          inputBase.setAttribute('opacity', opacity.toFixed(3));
        } else {
          inputBase.setAttribute('opacity', '0');
          base.setAttribute('cx', '0');
          base.setAttribute('cy', yAdjust.toFixed(2));
          base.setAttribute('rx', (w/2).toFixed(2));
          base.setAttribute('ry', (h/2).toFixed(2));
          base.setAttribute('opacity', opacity.toFixed(3));
        }
        const topY = p.topY;
        const bottomY = p.bottomY;
        const ta = side==='L' ? p.topAL : p.topAR;
        const ba = side==='L' ? p.bottomAL : p.bottomAR;
        top.setAttribute('y', (topY-90).toFixed(2));
        top.setAttribute('height', '90');
        top.setAttribute('transform', `rotate(${ta.toFixed(2)} 0 ${topY.toFixed(2)})`);
        bottom.setAttribute('y', bottomY.toFixed(2));
        bottom.setAttribute('height', '90');
        bottom.setAttribute('transform', `rotate(${ba.toFixed(2)} 0 ${bottomY.toFixed(2)})`);
        const jelly = jellyEyeOffset(cx, 126);
        return `translate(${(cx + this._look.x + microX + jelly.x + (isInput ? 0 : inwardShift)).toFixed(2)} ${(126 + this._look.y + microY + jelly.y + nodY + angryDropY + emotionBobY).toFixed(2)})`;
      };

      const inputCenter = this._state==='input';
      const surpriseSpread = this._state==='surprise' ? 3.4 * EASE.outQuint(clamp((p.w - 34) / (POSES.surprise.w - 34), 0, 1)) : 0;
      const leftCX = inputCenter ? 120 : 86 - surpriseSpread;
      const rightCX = inputCenter ? 120 : 154 + surpriseSpread;
      this._leftEye.setAttribute('transform', setEye(this._leftBase,this._leftInputBase,this._leftTop,this._leftBottom,'L',leftCX,this._eyeMicro.lX,this._eyeMicro.lY,inputPulseL));
      this._rightEye.setAttribute('transform', setEye(this._rightBase,this._rightInputBase,this._rightTop,this._rightBottom,'R',rightCX,this._eyeMicro.rX,this._eyeMicro.rY,inputPulseR));
    }

    _loop = (ts=performance.now()) => {
      if (!this._running || !this.isConnected) return;
      if (ts - this._lastFrame >= 33) {
        const dt = Math.min(66, ts - (this._lastFrame || ts-33));
        this._lastFrame = ts;
        this._updateMorph(ts);
        this._updateBlink(ts);
        this._updateLook(ts, dt);
        this._updateHeadFollow(ts, dt);
        this._updateDragJelly(dt);
        this._autoSleep(ts);
        this._draw(ts);
      }
      this._raf = requestAnimationFrame(this._loop);
    };
  }

  if (!customElements.get('agent-robot-avatar')) customElements.define('agent-robot-avatar', AgentFace);
  window.AgentRobotAvatar = AgentFace;
})();
