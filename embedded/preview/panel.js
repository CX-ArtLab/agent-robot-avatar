// Draws the core's low-resolution frame the way a small physical panel shows
// it: pixel grid, RGB sub-pixels, black level, panel glow and light bleed.
// Display only; it never changes the framebuffer the core produced.

const PANEL_VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * .5 + .5, .5 - aPos.y * .5);
  gl_Position = vec4(aPos, 0., 1.);
}`;

const PANEL_FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform float uScale;
uniform float uMode;
uniform vec3 uBlack;
uniform vec3 uGlass;
uniform float uSat, uGamma, uGapX, uGapY, uGlow, uPanelGlow, uGrid;
uniform float uRound, uCorner;
uniform vec3 uMonoA, uMonoB;
uniform float uSplit;

// Share of a device pixel (half-width s, in cell units) covered by the
// repeating band [c - h, c + h]. Box-filtered so fine grids do not shimmer.
float cover(float x, float c, float h, float s) {
  return clamp(min(x + s, c + h) - max(x - s, c - h), 0., 2. * s) / (2. * s);
}
float band(float x, float c, float h, float s) {
  return cover(x, c - 1., h, s) + cover(x, c, h, s) + cover(x, c + 1., h, s);
}
float lum(vec3 c) { return dot(c, vec3(.2126, .7152, .0722)); }

float shapeMask(vec2 p) {
  float aa = 1. / uScale;
  if (uRound > .5) {
    float d = length(p - uRes * .5) - uRes.x * .5;
    return clamp(.5 - d / aa, 0., 1.);
  }
  if (uCorner > 0.) {
    vec2 q = abs(p - uRes * .5) - (uRes * .5 - uCorner);
    float d = length(max(q, 0.)) + min(max(q.x, q.y), 0.) - uCorner;
    return clamp(.5 - d / aa, 0., 1.);
  }
  return 1.;
}

// Crisp pixels with a one-device-pixel soft edge, so non-integer zoom stays even.
vec3 sampleSharp(vec2 p) {
  vec2 c = floor(p);
  vec2 sp = c + .5 + clamp((p - c - .5) * uScale, -.5, .5);
  return texture2D(uTex, sp / uRes).rgb;
}

vec3 halo(vec2 p) {
  vec3 s = vec3(0.);
  for (int i = 0; i < 6; i++) {
    float a = float(i) * 1.0472;
    s += texture2D(uTex, (p + vec2(cos(a), sin(a)) * 2.4) / uRes).rgb;
  }
  return s / 6.;
}

void main() {
  vec2 p = vUv * uRes;
  float m = shapeMask(p);
  if (uMode > 1.5) {
    // Raw pixels: plain nearest-neighbour enlargement, no panel character.
    gl_FragColor = vec4(mix(uGlass, sampleSharp(p), m), 1.);
    return;
  }
  vec2 cell = floor(p);
  vec2 f = p - cell;
  float s = .5 / uScale;
  float kGrid = smoothstep(1.8, 4., uScale) * uGrid;
  float kSub = smoothstep(4.5, 9., uScale) * uGrid;
  vec3 col;

  if (uMode > .5) {
    float on = step(.5, lum(texture2D(uTex, (cell + .5) / uRes).rgb));
    vec3 tint = cell.y < uSplit ? uMonoA : uMonoB;
    float dot_ = band(f.x, .5, .5 - uGapX * .5, s) * band(f.y, .5, .5 - uGapY * .5, s);
    float lit = on * mix(1., dot_, kGrid);
    float h = lum(halo(p));
    col = uBlack + tint * lit + tint * h * uGlow;
  } else {
    vec3 c = sampleSharp(p);
    c = pow(c, vec3(uGamma));
    c = clamp(mix(vec3(lum(c)), c, uSat), 0., 1.);
    float grid = band(f.x, .5, .5 - uGapX * .5, s) * band(f.y, .5, .5 - uGapY * .5, s);
    vec3 lit = c * mix(1., grid, kGrid * .6);
    if (kSub > 0.) {
      float w = (1. / 3. - uGapX) * .5;
      float row = band(f.y, .5, .5 - uGapY * .5, s);
      vec3 sub = vec3(band(f.x, 1. / 6., w, s), band(f.x, .5, w, s), band(f.x, 5. / 6., w, s)) * row;
      lit = mix(lit, c * sub * 2.4 + c * .06, kSub);
    }
    col = uBlack + lit * (1. - uBlack);
    col += halo(p) * uGlow;
    vec2 d = vUv - .5;
    col += uBlack * uPanelGlow * dot(d, d) * 6.;
  }
  gl_FragColor = vec4(mix(uGlass, clamp(col, 0., 1.), m), 1.);
}`;

// Panel character. Values are tuned by eye against typical hobby panels.
const PANEL_LOOK = {
  ips: { black: [0.034, 0.036, 0.044], sat: 0.95, gamma: 1.0, gapX: 0.07, gapY: 0.1, glow: 0.045, panelGlow: 0.35 },
  tn: { black: [0.1, 0.104, 0.122], sat: 0.8, gamma: 1.2, gapX: 0.09, gapY: 0.15, glow: 0.035, panelGlow: 0.25 },
  amoled: { black: [0, 0, 0], sat: 1.12, gamma: 0.95, gapX: 0.18, gapY: 0.22, glow: 0.06, panelGlow: 0 },
  // Unlit OLED pixels are as dark as the surrounding glass.
  oled: { black: [0.026, 0.028, 0.032], sat: 1, gamma: 1, gapX: 0.17, gapY: 0.17, glow: 0.12, panelGlow: 0 },
};

const MONO_TINTS = {
  white: { a: [0.93, 0.97, 1], b: [0.93, 0.97, 1], split: 0, name: '白色' },
  blue: { a: [0.36, 0.78, 1], b: [0.36, 0.78, 1], split: 0, name: '蓝色' },
  'yellow-blue': { a: [1, 0.86, 0.2], b: [0.36, 0.78, 1], split: 16, name: '黄蓝双色' },
};

const PANEL_GLASS = [0.028, 0.03, 0.034];

class PanelRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: false });
    this.gl = gl;
    if (!gl) {
      this.ctx = canvas.getContext('2d');
      return;
    }
    const program = gl.createProgram();
    for (const [type, src] of [[gl.VERTEX_SHADER, PANEL_VERT], [gl.FRAGMENT_SHADER, PANEL_FRAG]]) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    gl.useProgram(program);
    this.program = program;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) {
      gl.texParameteri(gl.TEXTURE_2D, k, v);
    }
    this.u = {};
    for (const name of ['uRes', 'uScale', 'uMode', 'uBlack', 'uGlass', 'uSat', 'uGamma', 'uGapX', 'uGapY', 'uGlow', 'uPanelGlow', 'uGrid', 'uRound', 'uCorner', 'uMonoA', 'uMonoB', 'uSplit']) {
      this.u[name] = gl.getUniformLocation(program, name);
    }
  }

  upload(source) {
    const gl = this.gl;
    if (!gl) {
      this.source = source;
      return;
    }
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
    this.sourceSize = [source.width, source.height];
  }

  // o: { panel, plain (raw pixels), grid, glow, round, corner, mono }
  render(o) {
    const { canvas, gl } = this;
    if (!gl) {
      if (!this.source) return;
      this.ctx.imageSmoothingEnabled = false;
      this.ctx.drawImage(this.source, 0, 0, canvas.width, canvas.height);
      return;
    }
    if (!this.sourceSize) return;
    const [w, h] = this.sourceSize;
    const look = PANEL_LOOK[o.panel] || PANEL_LOOK.ips;
    const tint = MONO_TINTS[o.mono] || MONO_TINTS.white;
    const u = this.u;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u.uRes, w, h);
    gl.uniform1f(u.uScale, canvas.width / w);
    gl.uniform1f(u.uMode, o.plain ? 2 : o.panel === 'oled' ? 1 : 0);
    gl.uniform3fv(u.uBlack, look.black);
    gl.uniform3fv(u.uGlass, PANEL_GLASS);
    gl.uniform1f(u.uSat, look.sat);
    gl.uniform1f(u.uGamma, look.gamma);
    gl.uniform1f(u.uGapX, look.gapX);
    gl.uniform1f(u.uGapY, look.gapY);
    gl.uniform1f(u.uGlow, o.glow ? look.glow : 0);
    gl.uniform1f(u.uPanelGlow, o.glow ? look.panelGlow : 0);
    gl.uniform1f(u.uGrid, o.grid ? 1 : 0);
    gl.uniform1f(u.uRound, o.round ? 1 : 0);
    gl.uniform1f(u.uCorner, o.corner || 0);
    gl.uniform3fv(u.uMonoA, tint.a);
    gl.uniform3fv(u.uMonoB, tint.b);
    gl.uniform1f(u.uSplit, tint.split);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
