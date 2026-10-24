import AgentRobotAvatar, { registerAvatarExtension } from './agent-robot-avatar-extension-host.js';
import { patternMarkup } from './agent-robot-avatar-skin-patterns.js';

const NS = 'http://www.w3.org/2000/svg';
const proto = AgentRobotAvatar.prototype;
const baseApplyColor = proto._applyColor;

// Each skin is a base paint plus how it answers the light: a soft shine on the
// lit side, a darker edge for volume, a reflected glow on the far side, a thin
// rim, the eye color, and the antenna sphere.
const SKINS = Object.freeze({
  obsidian: Object.freeze({
    base: ['#7b8796', '#313a47', '#101722', '#05080e'],
    eye: '#f0f7ff', rim: '#c1d5f4', shine: 0.57, shade: 0.68,
    antenna: ['#c3cfdf', '#384452', '#080e19'],
  }),
  porcelain: Object.freeze({
    base: ['#ffffff', '#f5f4ec', '#d9dad3', '#a3aaab'],
    eye: '#343b3c', rim: '#ffffff', shine: 0.95, shade: 0.18,
    antenna: ['#ffffff', '#e7e9df', '#a6afb0'],
  }),
  aurora: Object.freeze({
    base: ['#9aebea', '#92c9f1', '#a795eb', '#e79bc7'],
    eye: '#2d3052', rim: '#fff4fe', shine: 0.82, shade: 0.30,
    antenna: ['#edffff', '#9ba7ec', '#7456a5'],
    linear: true,
  }),
  midnight: Object.freeze({
    base: ['#7f98d4', '#2c4381', '#111e4a', '#060b22'],
    eye: '#eaf2ff', rim: '#a9c2ff', shine: 0.55, shade: 0.62,
    antenna: ['#c9d7ff', '#33498a', '#070d26'],
  }),
  graphite: Object.freeze({
    base: ['#a3a9b0', '#61676e', '#35393e', '#1b1d20'],
    eye: '#f4f6f8', rim: '#d3d8de', shine: 0.32, shade: 0.5,
    antenna: ['#d9dde2', '#5d6369', '#191b1e'],
  }),
  jade: Object.freeze({
    base: ['#7fb5a3', '#2f6d5b', '#123e33', '#06201a'],
    eye: '#ecfff7', rim: '#aee8d3', shine: 0.5, shade: 0.6,
    antenna: ['#c8f0e2', '#2f6d5b', '#05201a'],
  }),
  amber: Object.freeze({
    base: ['#ffe2a6', '#f2a73c', '#c46812', '#6b3005'],
    eye: '#fff7e8', rim: '#ffdba0', shine: 0.6, shade: 0.5,
    antenna: ['#fff0cc', '#e08c22', '#6b3005'],
  }),
  sakura: Object.freeze({
    base: ['#ffffff', '#fdeaf0', '#f3c7d4', '#d697ab'],
    eye: '#4b2f3b', rim: '#ffffff', shine: 0.9, shade: 0.2,
    antenna: ['#ffffff', '#f7d3de', '#cf8ea3'],
  }),
  mint: Object.freeze({
    base: ['#f5fffb', '#cdf3e5', '#93dcc3', '#52ad90'],
    eye: '#1f3f36', rim: '#f2fffa', shine: 0.85, shade: 0.24,
    antenna: ['#ffffff', '#b5ead6', '#4fa88b'],
  }),
  'rose-gold': Object.freeze({
    base: ['#ffeee6', '#e8b8a6', '#bb7f6c', '#7a4a3f'],
    eye: '#3a2420', rim: '#fff2ec', shine: 0.85, shade: 0.34,
    antenna: ['#fff4ef', '#d89c88', '#7a4a3f'],
  }),
  pearl: Object.freeze({
    base: ['#ffffff', '#eaf2ff', '#f4e9ff', '#e2f6ee'],
    eye: '#3b3a4a', rim: '#ffffff', shine: 0.92, shade: 0.16,
    antenna: ['#ffffff', '#ece6fb', '#b9b4cf'],
    linear: true,
  }),
  sunset: Object.freeze({
    base: ['#ffd36e', '#ff9e6b', '#ff6f91', '#a26cf5'],
    eye: '#3a2140', rim: '#fff4e8', shine: 0.8, shade: 0.3,
    antenna: ['#fff3d6', '#ff8f7a', '#8a55d6'],
    linear: true,
  }),
  gold: Object.freeze({
    base: ['#fff4c2', '#f2c94c', '#c08a1e', '#6e4a08'],
    eye: '#3a2a08', rim: '#fff1b8', shine: 0.9, shade: 0.4,
    antenna: ['#fffbe6', '#e8b93a', '#6e4a08'],
  }),
  silver: Object.freeze({
    base: ['#ffffff', '#d7dce2', '#9aa3ad', '#5c646d'],
    eye: '#1c2228', rim: '#ffffff', shine: 0.95, shade: 0.3,
    antenna: ['#ffffff', '#c3c9d0', '#5c646d'],
  }),
  copper: Object.freeze({
    base: ['#ffd2b0', '#d9814a', '#a04d22', '#55230b'],
    eye: '#fff1e6', rim: '#ffc9a3', shine: 0.75, shade: 0.5,
    antenna: ['#ffe6d4', '#d9814a', '#55230b'],
  }),
  titanium: Object.freeze({
    base: ['#c9d3dc', '#7f8d9b', '#4b5763', '#232a31'],
    eye: '#eef4f9', rim: '#e6eef6', shine: 0.6, shade: 0.5,
    antenna: ['#e6edf3', '#7f8d9b', '#232a31'],
  }),
  ruby: Object.freeze({
    base: ['#ff8a9a', '#d0243f', '#7a0d22', '#3a0410'],
    eye: '#fff0f2', rim: '#ffb3bf', shine: 0.7, shade: 0.6,
    antenna: ['#ffd0d8', '#d0243f', '#3a0410'],
  }),
  sapphire: Object.freeze({
    base: ['#8fc0ff', '#2a6fd6', '#103f8c', '#071d44'],
    eye: '#eef6ff', rim: '#bcd8ff', shine: 0.7, shade: 0.6,
    antenna: ['#d4e7ff', '#2a6fd6', '#071d44'],
  }),
  emerald: Object.freeze({
    base: ['#8ff0c0', '#1fae74', '#0b6a45', '#033321'],
    eye: '#effff7', rim: '#b8f7d9', shine: 0.7, shade: 0.55,
    antenna: ['#d2fbe6', '#1fae74', '#033321'],
  }),
  lavender: Object.freeze({
    base: ['#ffffff', '#ece6ff', '#cbbcf2', '#9c88d6'],
    eye: '#33294d', rim: '#ffffff', shine: 0.9, shade: 0.2,
    antenna: ['#ffffff', '#ddd3fb', '#9c88d6'],
  }),
  lemon: Object.freeze({
    base: ['#fffef0', '#fff2a8', '#f5d757', '#c9a21d'],
    eye: '#3d3510', rim: '#fffbe0', shine: 0.9, shade: 0.22,
    antenna: ['#ffffff', '#fbe58a', '#c9a21d'],
  }),
  sky: Object.freeze({
    base: ['#ffffff', '#dff1ff', '#a9d6f7', '#5ea4d8'],
    eye: '#1d3a52', rim: '#ffffff', shine: 0.9, shade: 0.22,
    antenna: ['#ffffff', '#c7e6fb', '#5ea4d8'],
  }),
  peach: Object.freeze({
    base: ['#fffaf5', '#ffe1cf', '#ffbf9c', '#e88c6a'],
    eye: '#4a2a20', rim: '#ffffff', shine: 0.9, shade: 0.22,
    antenna: ['#ffffff', '#ffd2b8', '#e88c6a'],
  }),
  terracotta: Object.freeze({
    base: ['#f2b49a', '#d0754f', '#a14f30', '#5e2814'],
    eye: '#fff3ea', rim: '#f7c9b5', shine: 0.3, shade: 0.45,
    antenna: ['#f8d3c3', '#d0754f', '#5e2814'],
  }),
  ocean: Object.freeze({
    base: ['#7ff0e4', '#3cc3e0', '#2b7fd4', '#3b3fb0'],
    eye: '#132a4a', rim: '#e8fffd', shine: 0.8, shade: 0.3,
    antenna: ['#e8fffd', '#3cc3e0', '#3b3fb0'],
    linear: true,
  }),
  forest: Object.freeze({
    base: ['#d9f99d', '#7bd389', '#2f9e7a', '#1e5f6b'],
    eye: '#12302a', rim: '#f4ffe8', shine: 0.75, shade: 0.3,
    antenna: ['#f4ffe8', '#7bd389', '#1e5f6b'],
    linear: true,
  }),
  candy: Object.freeze({
    base: ['#ffe1f0', '#ff9cc8', '#b18cff', '#7fd4ff'],
    eye: '#3a2152', rim: '#fff4fb', shine: 0.85, shade: 0.26,
    antenna: ['#fff4fb', '#ff9cc8', '#7f6bd6'],
    linear: true,
  }),
  neon: Object.freeze({
    base: ['#5b3df5', '#2a1673', '#120a3a', '#06041a'],
    eye: '#7ff9ff', rim: '#7ff9ff', shine: 0.45, shade: 0.6,
    antenna: ['#c9fbff', '#5b3df5', '#06041a'],
  }),
  bee: Object.freeze({
    base: ['#fff4b8', '#ffd23f', '#e3a812', '#8a6200'],
    eye: '#ffffff', ring: '#1d1d1f', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#fff4b8', '#ffd23f', '#8a6200'],
    pattern: { kind: 'stripes', colors: ['#1f1d1a'], width: 13, gap: 13, angle: 45 },
  }),
  'candy-cane': Object.freeze({
    base: ['#ffffff', '#fbf6f6', '#efe3e3', '#c9b5b5'],
    eye: '#3b1f24', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#ffffff', '#fbf6f6', '#c9b5b5'],
    pattern: { kind: 'stripes', colors: ['#e8344e'], width: 12, gap: 12, angle: -40 },
  }),
  sailor: Object.freeze({
    base: ['#ffffff', '#fbfaf7', '#efece6', '#c9c4bb'],
    eye: '#14213d', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#ffffff', '#fbfaf7', '#c9c4bb'],
    pattern: { kind: 'stripes', colors: ['#1d3a8a'], width: 7, gap: 9, angle: 90 },
  }),
  gingham: Object.freeze({
    base: ['#ffffff', '#fbfaf7', '#efece6', '#c9c4bb'],
    eye: '#3a1d24', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#ffffff', '#fbfaf7', '#c9c4bb'],
    pattern: { kind: 'gingham', colors: ['#e2445c'], size: 22, opacity: 0.45 },
  }),
  tartan: Object.freeze({
    base: ['#d04848', '#a82d30', '#7d1c20', '#4a0e12'],
    eye: '#fff6e8', ring: '#2a0b0e', rim: '#e8eef8', shine: 0.5, shade: 0.55,
    antenna: ['#d04848', '#a82d30', '#4a0e12'],
    pattern: { kind: 'tartan', colors: ['#1b2a4a', '#f2d36b', '#0f3d2a'] },
  }),
  polka: Object.freeze({
    base: ['#ff9db2', '#ff5d84', '#e03a64', '#9b1c3e'],
    eye: '#ffffff', ring: '#7a1430', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#ff9db2', '#ff5d84', '#9b1c3e'],
    pattern: { kind: 'dots', colors: ['#ffffff'], r: 6, size: 30, opacity: 0.9 },
  }),
  stars: Object.freeze({
    base: ['#4a5ba8', '#26357a', '#141f52', '#0a1030'],
    eye: '#ffffff', rim: '#e8eef8', shine: 0.5, shade: 0.55,
    antenna: ['#4a5ba8', '#26357a', '#0a1030'],
    pattern: { kind: 'stars', colors: ['#ffe27a', '#ffffff'], count: 13 },
  }),
  hearts: Object.freeze({
    base: ['#fff6f9', '#ffe0ea', '#ffc2d4', '#f095b2'],
    eye: '#4b2032', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#fff6f9', '#ffe0ea', '#f095b2'],
    pattern: { kind: 'hearts', colors: ['#ff5d8a', '#ff8fb0'] },
  }),
  waves: Object.freeze({
    base: ['#eaf7ff', '#bfe6ff', '#7cc6f2', '#3a8fc7'],
    eye: '#123049', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#eaf7ff', '#bfe6ff', '#3a8fc7'],
    pattern: { kind: 'waves', colors: ['#ffffff'] },
  }),
  chevron: Object.freeze({
    base: ['#fff3e6', '#ffd9b0', '#f4b16e', '#c87a2e'],
    eye: '#4a2a10', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#fff3e6', '#ffd9b0', '#c87a2e'],
    pattern: { kind: 'chevron', colors: ['#ffffff'] },
  }),
  honeycomb: Object.freeze({
    base: ['#ffe9a3', '#f7c948', '#d99a12', '#8a5a00'],
    eye: '#3a2600', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#ffe9a3', '#f7c948', '#8a5a00'],
    pattern: { kind: 'honeycomb', colors: ['#fff4c4'] },
  }),
  terrazzo: Object.freeze({
    base: ['#ffffff', '#fbfaf7', '#efece6', '#c9c4bb'],
    eye: '#2d2a26', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#ffffff', '#fbfaf7', '#c9c4bb'],
    pattern: { kind: 'terrazzo', colors: ['#e46a4f', '#2e7d6b', '#f2b33d', '#3d5aa8', '#9aa0a6'] },
  }),
  camo: Object.freeze({
    base: ['#a8b07a', '#7d8655', '#5a6138', '#33381e'],
    eye: '#f6f3e6', ring: '#1d2012', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#a8b07a', '#7d8655', '#33381e'],
    pattern: { kind: 'camo', colors: ['#4a5230', '#2f331d', '#c2b98a'] },
  }),
  leopard: Object.freeze({
    base: ['#f8dfa6', '#e8b867', '#c98d3a', '#7a4f17'],
    eye: '#fff8e8', ring: '#2b1a0d', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#f8dfa6', '#e8b867', '#7a4f17'],
    pattern: { kind: 'leopard', colors: ['#2b1a0d', '#a8692a'] },
  }),
  tiger: Object.freeze({
    base: ['#ffc27a', '#f28c28', '#d06a10', '#7a3a05'],
    eye: '#fff6e6', ring: '#1d1410', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#ffc27a', '#f28c28', '#7a3a05'],
    pattern: { kind: 'tiger', colors: ['#1d1410'] },
  }),
  watermelon: Object.freeze({
    base: ['#ff9a9a', '#ff5a64', '#e0343f', '#9b1621'],
    eye: '#ffffff', ring: '#2a1515', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#ff9a9a', '#ff5a64', '#9b1621'],
    pattern: { kind: 'seeds', colors: ['#2a1515'] },
  }),
  marble: Object.freeze({
    base: ['#ffffff', '#f6f6f4', '#e6e6e2', '#bcbcb6'],
    eye: '#2a2a2e', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#ffffff', '#f6f6f4', '#bcbcb6'],
    pattern: { kind: 'marble', colors: ['#8d8d93', '#c7a76b'] },
  }),
  'black-marble': Object.freeze({
    base: ['#4a4a4f', '#25252a', '#141417', '#050506'],
    eye: '#f7f2e6', rim: '#e8eef8', shine: 0.5, shade: 0.55,
    antenna: ['#4a4a4f', '#25252a', '#050506'],
    pattern: { kind: 'marble', colors: ['#d9b46a', '#f2f2f2'], seed: 33 },
  }),
  wood: Object.freeze({
    base: ['#e9c08c', '#c9935a', '#a0683a', '#5e3a1c'],
    eye: '#fff4e6', ring: '#3a2210', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#e9c08c', '#c9935a', '#5e3a1c'],
    pattern: { kind: 'wood', colors: ['#6e3f1c'] },
  }),
  contour: Object.freeze({
    base: ['#f2fbf6', '#d7f0e2', '#a9dcc1', '#5fa883'],
    eye: '#173b2a', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#f2fbf6', '#d7f0e2', '#5fa883'],
    pattern: { kind: 'contour', colors: ['#2f7a57'] },
  }),
  circuit: Object.freeze({
    base: ['#2fae6a', '#167a46', '#0b5230', '#03281a'],
    eye: '#eafff2', ring: '#03281a', rim: '#e8eef8', shine: 0.5, shade: 0.55,
    antenna: ['#2fae6a', '#167a46', '#03281a'],
    pattern: { kind: 'circuit', colors: ['#b8f5c8', '#f2d36b'] },
  }),
  pixel: Object.freeze({
    base: ['#3a3a4a', '#24242f', '#16161d', '#0a0a10'],
    eye: '#ffffff', ring: '#16161a', rim: '#e8eef8', shine: 0.5, shade: 0.55,
    antenna: ['#3a3a4a', '#24242f', '#0a0a10'],
    pattern: { kind: 'pixel', colors: ['#7f5af0', '#2cb67d', '#ff8906', '#f25f4c', '#3da9fc'] },
  }),
  confetti: Object.freeze({
    base: ['#ffffff', '#fbfaf7', '#efece6', '#c9c4bb'],
    eye: '#2a2a35', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#ffffff', '#fbfaf7', '#c9c4bb'],
    pattern: { kind: 'confetti', colors: ['#ff5d8a', '#3da9fc', '#ffd23f', '#2cb67d', '#7f5af0'] },
  }),
  flowers: Object.freeze({
    base: ['#fffaf0', '#fff1d6', '#ffe0b0', '#e8b56a'],
    eye: '#4a2a20', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#fffaf0', '#fff1d6', '#e8b56a'],
    pattern: { kind: 'flowers', colors: ['#ff8fa8', '#ffd23f'] },
  }),
  clouds: Object.freeze({
    base: ['#d9f0ff', '#9fd4fb', '#5fb0ef', '#2d7cc4'],
    eye: '#123049', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#d9f0ff', '#9fd4fb', '#2d7cc4'],
    pattern: { kind: 'clouds', colors: ['#ffffff'] },
  }),
  rainbow: Object.freeze({
    base: ['#ffffff', '#fbfaf7', '#efece6', '#c9c4bb'],
    eye: '#ffffff', ring: '#2a2a35', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#ffffff', '#fbfaf7', '#c9c4bb'],
    pattern: { kind: 'rainbow', colors: ['#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#4dabf7', '#9775fa'] },
  }),
  denim: Object.freeze({
    base: ['#6f8fd6', '#3e5fae', '#24407e', '#0f2148'],
    eye: '#f3f6ff', rim: '#e8eef8', shine: 0.5, shade: 0.55,
    antenna: ['#6f8fd6', '#3e5fae', '#0f2148'],
    pattern: { kind: 'denim', colors: ['#ffffff'] },
  }),
  knit: Object.freeze({
    base: ['#ffb3c1', '#ff8fa3', '#e86b85', '#a83a55'],
    eye: '#ffffff', ring: '#6e1f33', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#ffb3c1', '#ff8fa3', '#a83a55'],
    pattern: { kind: 'knit', colors: ['#ffffff'] },
  }),
  scales: Object.freeze({
    base: ['#9ff2e5', '#3cc9b3', '#1b8f7f', '#0a4d45'],
    eye: '#073833', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#9ff2e5', '#3cc9b3', '#0a4d45'],
    pattern: { kind: 'scales', colors: ['#e8fffb'] },
  }),
  argyle: Object.freeze({
    base: ['#3d5c94', '#24406e', '#152a4d', '#081428'],
    eye: '#ffffff', ring: '#081428', rim: '#e8eef8', shine: 0.5, shade: 0.55,
    antenna: ['#3d5c94', '#24406e', '#081428'],
    pattern: { kind: 'argyle', colors: ['#f2c94c', '#ffffff'] },
  }),
  checker: Object.freeze({
    base: ['#ffffff', '#fbfaf7', '#efece6', '#c9c4bb'],
    eye: '#ffd23f', ring: '#1d1d1f', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#ffffff', '#fbfaf7', '#c9c4bb'],
    pattern: { kind: 'checker', colors: ['#1d1d1f'] },
  }),
  houndstooth: Object.freeze({
    base: ['#ffffff', '#fbfaf7', '#efece6', '#c9c4bb'],
    eye: '#ffffff', ring: '#1d1d1f', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#ffffff', '#fbfaf7', '#c9c4bb'],
    pattern: { kind: 'houndstooth', colors: ['#1d1d1f'] },
  }),
  grid: Object.freeze({
    base: ['#fffdf6', '#fbf7ea', '#efe8d4', '#c9bf9f'],
    eye: '#1d2b4a', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#fffdf6', '#fbf7ea', '#c9bf9f'],
    pattern: { kind: 'grid', colors: ['#4d8fd6'] },
  }),
  ripple: Object.freeze({
    base: ['#e7f6ff', '#b9e2fb', '#7cc0ec', '#3a85c2'],
    eye: '#123049', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#e7f6ff', '#b9e2fb', '#3a85c2'],
    pattern: { kind: 'concentric', colors: ['#ffffff'] },
  }),
  sunburst: Object.freeze({
    base: ['#fff1a8', '#ffd34d', '#f5a623', '#b86a00'],
    eye: '#3a2600', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#fff1a8', '#ffd34d', '#b86a00'],
    pattern: { kind: 'sunburst', colors: ['#ffffff'] },
  }),
  bubbles: Object.freeze({
    base: ['#c9f1ff', '#7dd8f5', '#3aaed8', '#1a6f99'],
    eye: '#0f3550', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#c9f1ff', '#7dd8f5', '#1a6f99'],
    pattern: { kind: 'bubbles', colors: ['#ffffff'] },
  }),
  halftone: Object.freeze({
    base: ['#ffe6ee', '#ffb3c7', '#ff7aa0', '#d6406c'],
    eye: '#4a1428', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#ffe6ee', '#ffb3c7', '#d6406c'],
    pattern: { kind: 'halftone', colors: ['#ffffff'] },
  }),
  lightning: Object.freeze({
    base: ['#4b4f7a', '#2c2f55', '#181a36', '#0b0c1d'],
    eye: '#ffffff', rim: '#e8eef8', shine: 0.5, shade: 0.55,
    antenna: ['#4b4f7a', '#2c2f55', '#0b0c1d'],
    pattern: { kind: 'scatter', shapes: ['bolt'], colors: ['#ffe04a'], count: 11 },
  }),
  music: Object.freeze({
    base: ['#fff8ef', '#fde9cf', '#f7cf9f', '#d99a5a'],
    eye: '#2c1f3a', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#fff8ef', '#fde9cf', '#d99a5a'],
    pattern: { kind: 'scatter', shapes: ['note'], colors: ['#3a2a55', '#e05a7a'], count: 11 },
  }),
  paws: Object.freeze({
    base: ['#fff4ea', '#ffe2c6', '#f6c08e', '#cf8a4c'],
    eye: '#3a2412', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#fff4ea', '#ffe2c6', '#cf8a4c'],
    pattern: { kind: 'scatter', shapes: ['paw'], colors: ['#8a5a32'], count: 10, k: [6, 9] },
  }),
  snowflakes: Object.freeze({
    base: ['#e9f4ff', '#bcdcfb', '#86b9ef', '#4a7fc6'],
    eye: '#14294a', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#e9f4ff', '#bcdcfb', '#4a7fc6'],
    pattern: { kind: 'scatter', shapes: ['snowflake'], colors: ['#ffffff'], count: 12, k: [5, 9] },
  }),
  leaves: Object.freeze({
    base: ['#f0fbe6', '#cfeeb2', '#97d37b', '#4f9a45'],
    eye: '#173a17', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#f0fbe6', '#cfeeb2', '#4f9a45'],
    pattern: { kind: 'scatter', shapes: ['leaf'], colors: ['#3e8a3a', '#7cc46a'], count: 14, k: [6, 10] },
  }),
  blossoms: Object.freeze({
    base: ['#fffafd', '#ffeaf2', '#ffd0e0', '#f0a3c0'],
    eye: '#4b2032', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#fffafd', '#ffeaf2', '#f0a3c0'],
    pattern: { kind: 'scatter', shapes: ['blossom'], colors: ['#ff9fbf', '#ffe1ec'], count: 12, k: [6, 9] },
  }),
  brick: Object.freeze({
    base: ['#e88a6a', '#c8603f', '#9a4228', '#5a2010'],
    eye: '#fff6ee', ring: '#3a160a', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#e88a6a', '#c8603f', '#5a2010'],
    pattern: { kind: 'brick', colors: ['#f4dccd'] },
  }),
  moonlight: Object.freeze({
    base: ['#3a4a8a', '#1f2b63', '#111a42', '#070c24'],
    eye: '#ffffff', rim: '#e8eef8', shine: 0.5, shade: 0.55,
    antenna: ['#3a4a8a', '#1f2b63', '#070c24'],
    pattern: { kind: 'scatter', shapes: ['moon', 'star', 'star'], colors: ['#ffe9a6'], count: 12, k: [4, 8] },
  }),
  zebra: Object.freeze({
    base: ['#ffffff', '#fbfaf7', '#efece6', '#c9c4bb'],
    eye: '#1d1d1f', ring: '#ffffff', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#ffffff', '#fbfaf7', '#c9c4bb'],
    pattern: { kind: 'tiger', colors: ['#1d1d1f'], count: 14, thickness: 0.7, seed: 59 },
  }),
  dalmatian: Object.freeze({
    base: ['#ffffff', '#fbfaf7', '#efece6', '#c9c4bb'],
    eye: '#1d1d1f', ring: '#ffffff', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#ffffff', '#fbfaf7', '#c9c4bb'],
    pattern: { kind: 'spots', colors: ['#1d1d1f'] },
  }),
  cow: Object.freeze({
    base: ['#ffffff', '#fbfaf7', '#efece6', '#c9c4bb'],
    eye: '#5a3a2a', ring: '#ffffff', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#ffffff', '#fbfaf7', '#c9c4bb'],
    pattern: { kind: 'camo', colors: ['#1d1d1f'], size: 220, scale: 1.6, seed: 61 },
  }),
  'rainbow-stripes': Object.freeze({
    base: ['#ffffff', '#fbfaf7', '#efece6', '#c9c4bb'],
    eye: '#ffffff', ring: '#2a2a35', rim: '#ffffff', shine: 0.8, shade: 0.28,
    antenna: ['#ffffff', '#fbfaf7', '#c9c4bb'],
    pattern: { kind: 'bands', colors: ['#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#4dabf7', '#9775fa'] },
  }),
});
const SKIN_NAMES = Object.freeze(Object.keys(SKINS));
const REST_LIGHT = Object.freeze({ x: -0.5, y: -0.5 });

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function svg(tag, attributes = {}, parent) {
  const element = document.createElementNS(NS, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
  parent?.append(element);
  return element;
}

function gradient(parent, tag, id, attributes, stops) {
  const element = svg(tag, { id, ...attributes }, parent);
  for (const [offset, color, opacity = 1] of stops) {
    svg('stop', { offset, 'stop-color': color, 'stop-opacity': opacity }, element);
  }
  return element;
}

function normalizeSkin(value) {
  const name = String(value ?? '').trim().toLowerCase();
  if (!name || name === 'none') return null;
  return Object.hasOwn(SKINS, name) ? name : undefined;
}

// The eyelids are rectangles painted in the head color over the eyes. A skin
// paints the head with gradients, so a flat lid would show as a patch. Moving
// the lids into a mask lets them cut the eyes instead, and the skin shows
// through. With a flat head color this looks exactly like the original.
function maskEyelids(instance) {
  const root = instance.shadowRoot;
  const defs = root.querySelector('defs');
  for (const side of ['left', 'right']) {
    const eye = root.getElementById(`${side}Eye`);
    const lids = root.getElementById(`${side}Top`)?.parentElement;
    if (!eye || !lids || lids.parentElement?.tagName === 'mask') continue;
    const mask = svg('mask', {
      id: `skin-${side}-lids`, maskUnits: 'userSpaceOnUse', maskContentUnits: 'userSpaceOnUse',
      x: -180, y: -240, width: 360, height: 480,
    }, defs);
    svg('rect', { x: -180, y: -240, width: 360, height: 480, fill: '#fff' }, mask);
    for (const lid of lids.children) lid.style.fill = '#000';
    mask.append(lids);
    const paint = svg('g', { mask: `url(#skin-${side}-lids)` });
    paint.append(...eye.children);
    eye.append(paint);
  }
}

function build(instance) {
  const root = instance.shadowRoot;
  const head = root?.getElementById('head');
  const drag = root?.getElementById('dragMotion');
  if (!head || !drag) return null;
  maskEyelids(instance);

  const svgRoot = root.querySelector('svg');
  const defs = svg('g', { id: 'skinDefs' });
  root.querySelector('defs').append(defs);
  const ground = svg('ellipse', { cx: 120, cy: 221, rx: 85, ry: 14, fill: 'url(#skin-ground)', 'pointer-events': 'none' });
  svgRoot.insertBefore(ground, drag);
  const layers = svg('g', { 'pointer-events': 'none', 'aria-hidden': 'true' });
  const shape = { href: '#headShape', transform: head.getAttribute('transform') };
  // A printed pattern sits on the base paint, under the shine and shading.
  const pattern = svg('use', { ...shape, fill: 'url(#skin-pattern)', 'pointer-events': 'none' });
  head.after(pattern, layers);
  for (const paint of ['shine', 'volume', 'edge']) svg('use', { ...shape, fill: `url(#skin-${paint})` }, layers);
  svg('use', { ...shape, fill: 'none', stroke: 'url(#skin-rim)', 'stroke-width': 1.25 }, layers);
  const style = document.createElement('style');
  root.append(style);

  return { defs, ground, layers, pattern, style, name: null, parts: null, light: { ...REST_LIGHT }, shown: {} };
}

function paintSkin(skin, name) {
  const look = SKINS[name];
  skin.defs.replaceChildren();
  skin.parts = {
    base: gradient(skin.defs, look.linear ? 'linearGradient' : 'radialGradient', 'skin-base',
      look.linear ? { x1: '.05', y1: '.05', x2: '.85', y2: '.98' } : { cx: '.32', cy: '.17', r: '.95' },
      look.base.map((color, index) => [index / 3, color])),
    shine: gradient(skin.defs, 'radialGradient', 'skin-shine', { cx: '.30', cy: '.12', r: '.70' },
      [[0, '#fff', look.shine], [.23, '#fff', look.shine * .30], [.65, '#fff', .035], [1, '#fff', 0]]),
    volume: gradient(skin.defs, 'radialGradient', 'skin-volume', { cx: '.43', cy: '.30', r: '.76' },
      [[0, '#091126', 0], [.58, '#091126', 0], [.82, '#091126', look.shade * .27], [1, '#091126', look.shade]]),
    rim: gradient(skin.defs, 'linearGradient', 'skin-rim', { x1: '0', y1: '0', x2: '1', y2: '1' },
      [[0, '#fff', .95], [.28, look.rim, .60], [.52, look.rim, .06], [.82, look.rim, .13], [1, look.rim, .65]]),
    edge: gradient(skin.defs, 'radialGradient', 'skin-edge', { cx: '.88', cy: '.83', r: '.55' },
      [[0, look.rim, .25], [.65, look.rim, .035], [1, look.rim, 0]]),
    antenna: gradient(skin.defs, 'radialGradient', 'skin-antenna', { cx: '.28', cy: '.20', r: '.85' },
      [[0, look.antenna[0]], [.43, look.antenna[1]], [1, look.antenna[2]]]),
  };
  gradient(skin.defs, 'radialGradient', 'skin-ground', {},
    [[0, '#0a1020', .27], [.5, '#0a1020', .10], [1, '#0a1020', 0]]);
  if (look.pattern) skin.defs.insertAdjacentHTML('beforeend', patternMarkup('skin-pattern', look.pattern));
  skin.pattern.style.display = look.pattern ? '' : 'none';
  skin.shown = {};
  // On busy patterns a thin ring keeps the eyes readable.
  const ring = look.ring ? `stroke:${look.ring};stroke-width:3px;` : '';
  skin.style.textContent = `
    #leftBase,#rightBase,#leftInputBase,#rightInputBase{fill:${look.eye};${ring}}
    #antennaDot{fill:url(#skin-antenna);stroke:${look.rim};stroke-width:.7px}`;
}

function set(skin, node, key, attribute, value) {
  const text = value.toFixed(3);
  const id = `${key}.${attribute}`;
  if (skin.shown[id] === text) return;
  skin.shown[id] = text;
  node.setAttribute(attribute, text);
}

function applyLight(skin, x, y) {
  const { parts, ground } = skin;
  const cx = .5 + x * .30;
  const cy = .30 + y * .17;
  if (!SKINS[skin.name].linear) {
    set(skin, parts.base, 'base', 'cx', cx);
    set(skin, parts.base, 'base', 'cy', cy);
  }
  set(skin, parts.shine, 'shine', 'cx', cx);
  set(skin, parts.shine, 'shine', 'cy', cy - .10);
  set(skin, parts.volume, 'volume', 'cx', .5 + x * .12);
  set(skin, parts.volume, 'volume', 'cy', .35 + y * .08);
  set(skin, parts.edge, 'edge', 'cx', .5 - x * .42);
  set(skin, parts.edge, 'edge', 'cy', .75 - y * .12);
  set(skin, parts.rim, 'rim', 'x1', .5 + x * .5);
  set(skin, parts.rim, 'rim', 'x2', .5 - x * .5);
  set(skin, parts.antenna, 'antenna', 'cx', cx);
  set(skin, parts.antenna, 'antenna', 'cy', Math.max(.1, cy));
  set(skin, ground, 'ground', 'cx', 120 - x * 11);
}

function render(instance) {
  const name = instance._skinName ?? null;
  if (!name && !instance._skin) return;
  if (!instance._skin) instance._skin = build(instance);
  const skin = instance._skin;
  if (!skin || skin.name === name) return;
  skin.name = name;
  const head = instance._head;
  if (name) {
    paintSkin(skin, name);
    head.setAttribute('fill', 'url(#skin-base)');
    skin.layers.style.display = '';
    skin.ground.style.display = '';
    applyLight(skin, skin.light.x, skin.light.y);
  } else {
    skin.style.textContent = '';
    skin.layers.style.display = 'none';
    skin.ground.style.display = 'none';
    skin.pattern.style.display = 'none';
    baseApplyColor.call(instance, instance.getAttribute('color'));
  }
}

// The light follows the pointer the same way the eyes do, and rests at the
// upper left when the pointer is away, following is off, or motion is reduced.
function updateLight(instance) {
  const skin = instance._skin;
  if (!skin?.name) return;
  const pointer = instance._pointer;
  const follows = instance._pointerFollowEnabled !== false && !instance._isReducedMotion?.()
    && pointer?.active && pointer.lastMove > 0;
  const pull = follows ? Math.pow(clamp(pointer.influence || 0, 0, 1), .7) : 0;
  // Tuning pages can pin the light with _skinFixedLight = { x, y } in [-1, 1].
  const fixed = instance._skinFixedLight;
  const tx = fixed ? fixed.x : REST_LIGHT.x + (clamp(pointer?.x / 48, -1, 1) - REST_LIGHT.x) * pull;
  const ty = fixed ? fixed.y : REST_LIGHT.y + (clamp(pointer?.y / 34, -1, 1) - REST_LIGHT.y) * pull;
  if (instance._isReducedMotion?.()) {
    skin.light.x = tx;
    skin.light.y = ty;
  } else {
    skin.light.x += ((Number.isFinite(tx) ? tx : REST_LIGHT.x) - skin.light.x) * .18;
    skin.light.y += ((Number.isFinite(ty) ? ty : REST_LIGHT.y) - skin.light.y) * .18;
  }
  applyLight(skin, skin.light.x, skin.light.y);
}

// The runtime's attribute observer calls this when the skin attribute changes
// and once on connect. An unknown name in markup falls back to no skin with a
// console notice, so an invalid attribute never breaks the page; setSkin()
// throws instead.
proto._applySkinAttribute = function() {
  const value = this.getAttribute('skin');
  if (normalizeSkin(value) === undefined) {
    console.warn(`agent-robot-avatar: unknown skin "${value}". Use ${SKIN_NAMES.join(', ')} or none.`);
    this.setSkin(null);
  } else {
    this.setSkin(value);
  }
};

proto.setSkin = function(value = null) {
  const name = normalizeSkin(value);
  if (name === undefined) throw new Error(`Unknown Agent Robot Avatar skin: ${value}`);
  this._skinName = name;
  render(this);
  this._resumeFrames?.();
  return this;
};

proto.getSkin = function() {
  return this._skinName ?? null;
};

// A skin keeps the head paint even when the color attribute changes; removing
// the skin brings the color back.
proto._applyColor = function(value) {
  baseApplyColor.call(this, value);
  if (this._skinName && this._head) {
    this._head.setAttribute('fill', 'url(#skin-base)');
  }
};

registerAvatarExtension({
  name: 'skins',
  draw() {
    updateLight(this);
  },
});

export { AgentRobotAvatar, SKINS, SKIN_NAMES };
export default AgentRobotAvatar;
