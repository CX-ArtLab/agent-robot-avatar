// Paints the skins built from layered gradients: glass, acrylic, jelly, gems,
// gradients, printed patterns and balls. The public skin module decides which
// skin is shown and drives the light; this module only paints.
import AgentRobotAvatar from '../agent-robot-avatar-extension-host.js';
import { patternMarkup } from '../agent-robot-avatar-skin-patterns.js';

const NS = 'http://www.w3.org/2000/svg';
const runtimeWindow = typeof window !== 'undefined' ? window : null;
const baseApplyColor = AgentRobotAvatar.prototype._applyColor;

const SKINS={"glow-blue":{"base":["#90b9fe","#619bff","#4287ff","#5295ff"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"软糖","title":"软糖 · 蓝","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#90b9fe","#619bff","#5295ff"],"fixedTune":{"depth":0.6,"faceGlow":0.8,"faceX":0.43,"faceY":0.05,"faceSize":0.69,"bandWidth":46,"bandLight":0.41,"bandOpacity":0.77,"bandMiddle":1,"lineOpacity":0,"glintWidth":3.2,"glintUpper":0.84,"glintLower":0.85,"eyeTint":0.42,"shadowBlur":4,"shadowOpacity":0.89,"shadowDarkness":0.3,"gradient":"radial","centerX":0.32,"centerY":0.08,"radius":0.81,"stopMid":0.333,"stopEdge":0.667,"bandBlur":12,"glintInset":0.955,"glintBlur":2.7,"glintAngle":94,"glintDash":0,"upperStart":0.42,"upperEnd":0,"glintMiddle":0,"rimOpacity":0,"topGloss":1,"topReach":0.25,"topBlur":6.5,"sideThickness":0,"eyeLitPart":0.25,"shadowSpread":0,"shadowAngle":117,"antennaHighlight":1,"antennaHighlightSize":0.36,"antennaHighlightX":0.23,"antennaHighlightY":0.38,"colors":["#90b9fe","#619bff","#4287ff","#5295ff"],"antennaMid":"#70acff","antennaDark":"#9fc7fe"}},"glow-red":{"base":["#fe9590","#ff6961","#ff4c42","#ff5752"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"软糖","title":"软糖 · 红","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#fe9590","#ff6961","#ff5752"],"fixedTune":{"depth":0.6,"faceGlow":0.8,"faceX":0.43,"faceY":0.05,"faceSize":0.69,"bandWidth":46,"bandLight":0.41,"bandOpacity":0.77,"bandMiddle":1,"lineOpacity":0,"glintWidth":3.2,"glintUpper":0.84,"glintLower":0.85,"eyeTint":0.42,"shadowBlur":4,"shadowOpacity":0.89,"shadowDarkness":0.3,"gradient":"radial","centerX":0.32,"centerY":0.08,"radius":0.81,"stopMid":0.333,"stopEdge":0.667,"bandBlur":12,"glintInset":0.955,"glintBlur":2.7,"glintAngle":94,"glintDash":0,"upperStart":0.42,"upperEnd":0,"glintMiddle":0,"rimOpacity":0,"topGloss":1,"topReach":0.25,"topBlur":6.5,"sideThickness":0,"eyeLitPart":0.25,"shadowSpread":0,"shadowAngle":117,"antennaHighlight":1,"antennaHighlightSize":0.36,"antennaHighlightX":0.23,"antennaHighlightY":0.38,"colors":["#fe9590","#ff6961","#ff4c42","#ff5752"],"antennaMid":"#ff7070","antennaDark":"#fe9f9f"}},"custom-1793262923292":{"base":["#b9ff94","#92ec55","#72d232","#57c200"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"软糖","title":"亚克力 · 红 10","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#b9ff94","#92ec55","#57c200"],"fixedTune":{"colors":["#b9ff94","#92ec55","#72d232","#57c200"],"vertical":false,"depth":0.6,"faceGlow":0.8,"faceX":0.43,"faceY":0.05,"faceSize":0.69,"bandWidth":46,"bandLight":0.41,"bandOpacity":0.77,"bandMiddle":1,"edgeBlur":0.6,"lineOpacity":0,"glintWidth":3.2,"glintUpper":0.84,"glintLower":0.85,"eyeTint":0.42,"eyeSoftness":0,"shadowDistance":6,"shadowBlur":4,"shadowOpacity":0.89,"shadowDarkness":0.3,"gradient":"radial","angle":151,"centerX":0.32,"centerY":0.08,"radius":0.81,"stopMid":0.333,"stopEdge":0.667,"depthStart":0.59,"bandColor":"","bandBlur":12,"lineInset":0.905,"lineWidth":8,"lineBlur":6,"lineAngle":234,"lineOffsetX":0,"lineOffsetY":0,"line1Pos":0.64,"line1Color":"#ffffff","line1Opacity":0.29,"line2Pos":0.36,"line2Color":"","line2Opacity":0,"line3Pos":0,"line3Color":"","line3Opacity":0.67,"line4Pos":0.51,"line4Color":"","line4Opacity":0.95,"line5Pos":0.68,"line5Color":"","line5Opacity":0,"lineFollow":false,"glintInset":0.955,"glintBlur":2.7,"glintColor":"#ffffff","glintAngle":94,"glintFollow":0,"glintOffsetX":0,"glintOffsetY":0,"glintDash":0,"glintGap":14.5,"upperStart":0.42,"upperEnd":0,"lowerStart":0.81,"lowerEnd":1,"glintMiddle":0,"middleStart":1,"middleEnd":0.02,"rimOpacity":0,"rimWidth":0,"rimColor":"#ffffff","topGloss":1,"topReach":0.25,"topBlur":6.5,"sideThickness":0,"sideTone":0.45,"sideOpacity":0.75,"sideColor":"","sideLine":0.85,"sideLineTone":1,"sideLineColor":"","sideLineWidth":2.4,"sideLineScaleX":1,"sideLineScaleY":1,"sideLineX":0,"sideLineY":0,"sideLineFrom":0.7,"sideLineTo":1,"sideLineFade":0.12,"sideLineSideFade":0,"sideLineBlur":0,"sideLineDash":0,"sideLineGap":0,"sideLineCap":"round","eyeColor":"#ffffff","eyeOpacity":1,"eyeLitPart":0.25,"eyeRimWidth":0,"eyeRimOpacity":1,"shadowColor":"","shadowSpread":0,"shadowFollow":true,"shadowAngle":117,"antennaLight":"","antennaMid":"#b4ff42","antennaDark":"#b5e44e","antennaHighlight":1,"antennaHighlightSize":0.47,"antennaHighlightX":0.23,"antennaHighlightY":0.38,"antennaFollow":true,"antennaOpacity":1,"antennaSize":1,"antennaRimColor":"#ffffff","antennaRimWidth":0,"antennaRimOpacity":0.6,"eyeHighlight":0,"eyeHighlightSize":1,"eyeHighlightSoft":0.75,"eyeHighlightX":-9,"eyeHighlightY":-10,"eyeHighlightFollow":6,"eyeSpark":0,"eyeSparkSize":3.5,"eyeSparkX":8,"eyeSparkY":9}},"glow-purple":{"base":["#ca90fe","#b561ff","#a742ff","#ab52ff"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"软糖","title":"软糖 · 紫","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#ca90fe","#b561ff","#ab52ff"],"fixedTune":{"depth":0.6,"faceGlow":0.8,"faceX":0.43,"faceY":0.05,"faceSize":0.69,"bandWidth":46,"bandLight":0.41,"bandOpacity":0.77,"bandMiddle":1,"lineOpacity":0,"glintWidth":3.2,"glintUpper":0.84,"glintLower":0.85,"eyeTint":0.42,"shadowBlur":4,"shadowOpacity":0.89,"shadowDarkness":0.3,"gradient":"radial","centerX":0.32,"centerY":0.08,"radius":0.81,"stopMid":0.333,"stopEdge":0.667,"bandBlur":12,"glintInset":0.955,"glintBlur":2.7,"glintAngle":94,"glintDash":0,"upperStart":0.42,"upperEnd":0,"glintMiddle":0,"rimOpacity":0,"topGloss":1,"topReach":0.25,"topBlur":6.5,"sideThickness":0,"eyeLitPart":0.25,"shadowSpread":0,"shadowAngle":117,"antennaHighlight":1,"antennaHighlightSize":0.36,"antennaHighlightX":0.23,"antennaHighlightY":0.38,"colors":["#ca90fe","#b561ff","#a742ff","#ab52ff"],"antennaMid":"#b570ff","antennaDark":"#cd9ffe"}},"glow-pink":{"base":["#fe90c8","#ff61b0","#ff42a0","#ff52ac"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"软糖","title":"软糖 · 粉","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#fe90c8","#ff61b0","#ff52ac"],"fixedTune":{"depth":0.6,"faceGlow":0.8,"faceX":0.43,"faceY":0.05,"faceSize":0.69,"bandWidth":46,"bandLight":0.41,"bandOpacity":0.77,"bandMiddle":1,"lineOpacity":0,"glintWidth":3.2,"glintUpper":0.84,"glintLower":0.85,"eyeTint":0.42,"shadowBlur":4,"shadowOpacity":0.89,"shadowDarkness":0.3,"gradient":"radial","centerX":0.32,"centerY":0.08,"radius":0.81,"stopMid":0.333,"stopEdge":0.667,"bandBlur":12,"glintInset":0.955,"glintBlur":2.7,"glintAngle":94,"glintDash":0,"upperStart":0.42,"upperEnd":0,"glintMiddle":0,"rimOpacity":0,"topGloss":1,"topReach":0.25,"topBlur":6.5,"sideThickness":0,"eyeLitPart":0.25,"shadowSpread":0,"shadowAngle":117,"antennaHighlight":1,"antennaHighlightSize":0.36,"antennaHighlightX":0.23,"antennaHighlightY":0.38,"colors":["#fe90c8","#ff61b0","#ff42a0","#ff52ac"],"antennaMid":"#ff70bf","antennaDark":"#fe9fd3"}},"glow-orange":{"base":["#febb89","#ffa159","#ff8f39","#ff9449"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"软糖","title":"软糖 · 橙","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#febb89","#ffa159","#ff9449"],"fixedTune":{"depth":0.6,"faceGlow":0.8,"faceX":0.43,"faceY":0.05,"faceSize":0.69,"bandWidth":46,"bandLight":0.41,"bandOpacity":0.77,"bandMiddle":1,"lineOpacity":0,"glintWidth":3.2,"glintUpper":0.84,"glintLower":0.85,"eyeTint":0.42,"shadowBlur":4,"shadowOpacity":0.89,"shadowDarkness":0.3,"gradient":"radial","centerX":0.32,"centerY":0.08,"radius":0.81,"stopMid":0.333,"stopEdge":0.667,"bandBlur":12,"glintInset":0.955,"glintBlur":2.7,"glintAngle":94,"glintDash":0,"upperStart":0.42,"upperEnd":0,"glintMiddle":0,"rimOpacity":0,"topGloss":1,"topReach":0.25,"topBlur":6.5,"sideThickness":0,"eyeLitPart":0.25,"shadowSpread":0,"shadowAngle":117,"antennaHighlight":1,"antennaHighlightSize":0.36,"antennaHighlightX":0.23,"antennaHighlightY":0.38,"colors":["#febb89","#ffa159","#ff8f39","#ff9449"],"antennaMid":"#ffa268","antennaDark":"#febf98"}},"custom-1793262553386":{"base":["#90d4fe","#80d9ff","#4dc9ff","#38a9ff"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"软糖","title":"亚克力 · 红 8","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#90d4fe","#80d9ff","#38a9ff"],"fixedTune":{"colors":["#90d4fe","#80d9ff","#4dc9ff","#38a9ff"],"vertical":false,"depth":0.6,"faceGlow":0.8,"faceX":0.43,"faceY":0.05,"faceSize":0.69,"bandWidth":46,"bandLight":0.41,"bandOpacity":0.77,"bandMiddle":1,"edgeBlur":0.6,"lineOpacity":0,"glintWidth":3.2,"glintUpper":0.84,"glintLower":0.85,"eyeTint":0.42,"eyeSoftness":0,"shadowDistance":6,"shadowBlur":4,"shadowOpacity":0.89,"shadowDarkness":0.3,"gradient":"radial","angle":151,"centerX":0.32,"centerY":0.08,"radius":0.81,"stopMid":0.333,"stopEdge":0.667,"depthStart":0.59,"bandColor":"","bandBlur":12,"lineInset":0.905,"lineWidth":8,"lineBlur":6,"lineAngle":234,"lineOffsetX":0,"lineOffsetY":0,"line1Pos":0.64,"line1Color":"#ffffff","line1Opacity":0.29,"line2Pos":0.36,"line2Color":"","line2Opacity":0,"line3Pos":0,"line3Color":"","line3Opacity":0.67,"line4Pos":0.51,"line4Color":"","line4Opacity":0.95,"line5Pos":0.68,"line5Color":"","line5Opacity":0,"lineFollow":false,"glintInset":0.955,"glintBlur":2.7,"glintColor":"#ffffff","glintAngle":94,"glintFollow":0,"glintOffsetX":0,"glintOffsetY":0,"glintDash":0,"glintGap":14.5,"upperStart":0.42,"upperEnd":0,"lowerStart":0.81,"lowerEnd":1,"glintMiddle":0,"middleStart":1,"middleEnd":0.02,"rimOpacity":0,"rimWidth":0,"rimColor":"#ffffff","topGloss":1,"topReach":0.25,"topBlur":6.5,"sideThickness":0,"sideTone":0.45,"sideOpacity":0.75,"sideColor":"","sideLine":0.85,"sideLineTone":1,"sideLineColor":"","sideLineWidth":2.4,"sideLineScaleX":1,"sideLineScaleY":1,"sideLineX":0,"sideLineY":0,"sideLineFrom":0.7,"sideLineTo":1,"sideLineFade":0.12,"sideLineSideFade":0,"sideLineBlur":0,"sideLineDash":0,"sideLineGap":0,"sideLineCap":"round","eyeColor":"#ffffff","eyeOpacity":1,"eyeLitPart":0.25,"eyeRimWidth":0,"eyeRimOpacity":1,"shadowColor":"","shadowSpread":0,"shadowFollow":true,"shadowAngle":117,"antennaLight":"","antennaMid":"#94d6ff","antennaDark":"#7adeff","antennaHighlight":1,"antennaHighlightSize":0.47,"antennaHighlightX":0.23,"antennaHighlightY":0.38,"antennaFollow":true,"antennaOpacity":1,"antennaSize":1,"antennaRimColor":"#ffffff","antennaRimWidth":0,"antennaRimOpacity":0.6,"eyeHighlight":0,"eyeHighlightSize":1,"eyeHighlightSoft":0.75,"eyeHighlightX":-9,"eyeHighlightY":-10,"eyeHighlightFollow":6,"eyeSpark":0,"eyeSparkSize":3.5,"eyeSparkX":8,"eyeSparkY":9}},"custom-1793262790531":{"base":["#b9cad4","#9bb8c5","#8198a2","#8a959e"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"软糖","title":"亚克力 · 红 9","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#b9cad4","#9bb8c5","#8a959e"],"fixedTune":{"colors":["#b9cad4","#9bb8c5","#8198a2","#8a959e"],"vertical":false,"depth":0.6,"faceGlow":0.8,"faceX":0.43,"faceY":0.05,"faceSize":0.69,"bandWidth":46,"bandLight":0.41,"bandOpacity":0.77,"bandMiddle":1,"edgeBlur":0.6,"lineOpacity":0,"glintWidth":3.2,"glintUpper":0.84,"glintLower":0.85,"eyeTint":0.42,"eyeSoftness":0,"shadowDistance":6,"shadowBlur":4,"shadowOpacity":0.89,"shadowDarkness":0.3,"gradient":"radial","angle":151,"centerX":0.32,"centerY":0.08,"radius":0.81,"stopMid":0.333,"stopEdge":0.667,"depthStart":0.59,"bandColor":"","bandBlur":12,"lineInset":0.905,"lineWidth":8,"lineBlur":6,"lineAngle":234,"lineOffsetX":0,"lineOffsetY":0,"line1Pos":0.64,"line1Color":"#ffffff","line1Opacity":0.29,"line2Pos":0.36,"line2Color":"","line2Opacity":0,"line3Pos":0,"line3Color":"","line3Opacity":0.67,"line4Pos":0.51,"line4Color":"","line4Opacity":0.95,"line5Pos":0.68,"line5Color":"","line5Opacity":0,"lineFollow":false,"glintInset":0.955,"glintBlur":2.7,"glintColor":"#ffffff","glintAngle":94,"glintFollow":0,"glintOffsetX":0,"glintOffsetY":0,"glintDash":0,"glintGap":14.5,"upperStart":0.42,"upperEnd":0,"lowerStart":0.81,"lowerEnd":1,"glintMiddle":0,"middleStart":1,"middleEnd":0.02,"rimOpacity":0,"rimWidth":0,"rimColor":"#ffffff","topGloss":1,"topReach":0.25,"topBlur":6.5,"sideThickness":0,"sideTone":0.45,"sideOpacity":0.75,"sideColor":"","sideLine":0.85,"sideLineTone":1,"sideLineColor":"","sideLineWidth":2.4,"sideLineScaleX":1,"sideLineScaleY":1,"sideLineX":0,"sideLineY":0,"sideLineFrom":0.7,"sideLineTo":1,"sideLineFade":0.12,"sideLineSideFade":0,"sideLineBlur":0,"sideLineDash":0,"sideLineGap":0,"sideLineCap":"round","eyeColor":"#ffffff","eyeOpacity":1,"eyeLitPart":0.25,"eyeRimWidth":0,"eyeRimOpacity":1,"shadowColor":"","shadowSpread":0,"shadowFollow":true,"shadowAngle":117,"antennaLight":"","antennaMid":"#aec3d0","antennaDark":"#a1b0b5","antennaHighlight":1,"antennaHighlightSize":0.47,"antennaHighlightX":0.23,"antennaHighlightY":0.38,"antennaFollow":true,"antennaOpacity":1,"antennaSize":1,"antennaRimColor":"#ffffff","antennaRimWidth":0,"antennaRimOpacity":0.6,"eyeHighlight":0,"eyeHighlightSize":1,"eyeHighlightSoft":0.75,"eyeHighlightX":-9,"eyeHighlightY":-10,"eyeHighlightFollow":6,"eyeSpark":0,"eyeSparkSize":3.5,"eyeSparkX":8,"eyeSparkY":9}},"custom-1793263007260":{"base":["#ff94fb","#ff1f1f","#fe5881","#c20000"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"软糖","title":"亚克力 · 红 11","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#ff94fb","#ff1f1f","#c20000"],"fixedTune":{"colors":["#ff94fb","#ff1f1f","#fe5881","#c20000"],"vertical":false,"depth":0.6,"faceGlow":0.8,"faceX":0.43,"faceY":0.05,"faceSize":0.69,"bandWidth":46,"bandLight":0.41,"bandOpacity":0.77,"bandMiddle":1,"edgeBlur":0.6,"lineOpacity":0,"glintWidth":3.2,"glintUpper":0.84,"glintLower":0.85,"eyeTint":0.42,"eyeSoftness":0,"shadowDistance":6,"shadowBlur":4,"shadowOpacity":0.89,"shadowDarkness":0.3,"gradient":"radial","angle":151,"centerX":0.32,"centerY":0.08,"radius":0.81,"stopMid":0.333,"stopEdge":0.667,"depthStart":0.59,"bandColor":"","bandBlur":12,"lineInset":0.905,"lineWidth":8,"lineBlur":6,"lineAngle":234,"lineOffsetX":0,"lineOffsetY":0,"line1Pos":0.64,"line1Color":"#ffffff","line1Opacity":0.29,"line2Pos":0.36,"line2Color":"","line2Opacity":0,"line3Pos":0,"line3Color":"","line3Opacity":0.67,"line4Pos":0.51,"line4Color":"","line4Opacity":0.95,"line5Pos":0.68,"line5Color":"","line5Opacity":0,"lineFollow":false,"glintInset":0.955,"glintBlur":2.7,"glintColor":"#ffffff","glintAngle":94,"glintFollow":0,"glintOffsetX":0,"glintOffsetY":0,"glintDash":0,"glintGap":14.5,"upperStart":0.42,"upperEnd":0,"lowerStart":0.81,"lowerEnd":1,"glintMiddle":0,"middleStart":1,"middleEnd":0.02,"rimOpacity":0,"rimWidth":0,"rimColor":"#ffffff","topGloss":1,"topReach":0.25,"topBlur":6.5,"sideThickness":0,"sideTone":0.45,"sideOpacity":0.75,"sideColor":"","sideLine":0.85,"sideLineTone":1,"sideLineColor":"","sideLineWidth":2.4,"sideLineScaleX":1,"sideLineScaleY":1,"sideLineX":0,"sideLineY":0,"sideLineFrom":0.7,"sideLineTo":1,"sideLineFade":0.12,"sideLineSideFade":0,"sideLineBlur":0,"sideLineDash":0,"sideLineGap":0,"sideLineCap":"round","eyeColor":"#ffffff","eyeOpacity":1,"eyeLitPart":0.25,"eyeRimWidth":0,"eyeRimOpacity":1,"shadowColor":"","shadowSpread":0,"shadowFollow":true,"shadowAngle":117,"antennaLight":"","antennaMid":"#fe9a9a","antennaDark":"#ffadca","antennaHighlight":1,"antennaHighlightSize":0.47,"antennaHighlightX":0.23,"antennaHighlightY":0.38,"antennaFollow":true,"antennaOpacity":1,"antennaSize":1,"antennaRimColor":"#ffffff","antennaRimWidth":0,"antennaRimOpacity":0.6,"eyeHighlight":0,"eyeHighlightSize":1,"eyeHighlightSoft":0.75,"eyeHighlightX":-9,"eyeHighlightY":-10,"eyeHighlightFollow":6,"eyeSpark":0,"eyeSparkSize":3.5,"eyeSparkX":8,"eyeSparkY":9}},"custom-1793263221394":{"base":["#47c8ff","#27ecbb","#30cfb4","#0f4bff"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"软糖","title":"亚克力 · 红 12","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#47c8ff","#27ecbb","#0f4bff"],"fixedTune":{"colors":["#47c8ff","#27ecbb","#30cfb4","#0f4bff"],"vertical":false,"depth":0.6,"faceGlow":0.8,"faceX":0.43,"faceY":0.05,"faceSize":0.69,"bandWidth":46,"bandLight":0.41,"bandOpacity":0.77,"bandMiddle":1,"edgeBlur":0.6,"lineOpacity":0,"glintWidth":3.2,"glintUpper":0.84,"glintLower":0.85,"eyeTint":0.42,"eyeSoftness":0,"shadowDistance":6,"shadowBlur":4,"shadowOpacity":0.89,"shadowDarkness":0.3,"gradient":"radial","angle":151,"centerX":0.32,"centerY":0.08,"radius":0.81,"stopMid":0.333,"stopEdge":0.667,"depthStart":0.59,"bandColor":"","bandBlur":12,"lineInset":0.905,"lineWidth":8,"lineBlur":6,"lineAngle":234,"lineOffsetX":0,"lineOffsetY":0,"line1Pos":0.64,"line1Color":"#ffffff","line1Opacity":0.29,"line2Pos":0.36,"line2Color":"","line2Opacity":0,"line3Pos":0,"line3Color":"","line3Opacity":0.67,"line4Pos":0.51,"line4Color":"","line4Opacity":0.95,"line5Pos":0.68,"line5Color":"","line5Opacity":0,"lineFollow":false,"glintInset":0.955,"glintBlur":2.7,"glintColor":"#ffffff","glintAngle":94,"glintFollow":0,"glintOffsetX":0,"glintOffsetY":0,"glintDash":0,"glintGap":14.5,"upperStart":0.42,"upperEnd":0,"lowerStart":0.81,"lowerEnd":1,"glintMiddle":0,"middleStart":1,"middleEnd":0.02,"rimOpacity":0,"rimWidth":0,"rimColor":"#ffffff","topGloss":1,"topReach":0.25,"topBlur":6.5,"sideThickness":0,"sideTone":0.45,"sideOpacity":0.75,"sideColor":"","sideLine":0.85,"sideLineTone":1,"sideLineColor":"","sideLineWidth":2.4,"sideLineScaleX":1,"sideLineScaleY":1,"sideLineX":0,"sideLineY":0,"sideLineFrom":0.7,"sideLineTo":1,"sideLineFade":0.12,"sideLineSideFade":0,"sideLineBlur":0,"sideLineDash":0,"sideLineGap":0,"sideLineCap":"round","eyeColor":"#ffffff","eyeOpacity":1,"eyeLitPart":0.25,"eyeRimWidth":0,"eyeRimOpacity":1,"shadowColor":"","shadowSpread":0,"shadowFollow":true,"shadowAngle":117,"antennaLight":"","antennaMid":"#42d9ff","antennaDark":"#c2f3ff","antennaHighlight":1,"antennaHighlightSize":0.62,"antennaHighlightX":0.23,"antennaHighlightY":0.38,"antennaFollow":true,"antennaOpacity":1,"antennaSize":1,"antennaRimColor":"#ffffff","antennaRimWidth":0,"antennaRimOpacity":0.6,"eyeHighlight":0,"eyeHighlightSize":1,"eyeHighlightSoft":0.75,"eyeHighlightX":-9,"eyeHighlightY":-10,"eyeHighlightFollow":6,"eyeSpark":0,"eyeSparkSize":3.5,"eyeSparkX":8,"eyeSparkY":9}},"custom-1793263313834":{"base":["#ffe014","#ffd642","#ffbd2e","#ffd35c"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"软糖","title":"亚克力 · 红 13","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#ffe014","#ffd642","#ffd35c"],"fixedTune":{"colors":["#ffe014","#ffd642","#ffbd2e","#ffd35c"],"vertical":false,"depth":0.6,"faceGlow":0.8,"faceX":0.43,"faceY":0.05,"faceSize":0.69,"bandWidth":46,"bandLight":0.41,"bandOpacity":0.77,"bandMiddle":1,"edgeBlur":0.6,"lineOpacity":0,"glintWidth":3.2,"glintUpper":0.84,"glintLower":0.85,"eyeTint":0.42,"eyeSoftness":0,"shadowDistance":6,"shadowBlur":4,"shadowOpacity":0.89,"shadowDarkness":0.3,"gradient":"radial","angle":151,"centerX":0.32,"centerY":0.08,"radius":0.81,"stopMid":0.333,"stopEdge":0.667,"depthStart":0.59,"bandColor":"","bandBlur":12,"lineInset":0.905,"lineWidth":8,"lineBlur":6,"lineAngle":234,"lineOffsetX":0,"lineOffsetY":0,"line1Pos":0.64,"line1Color":"#ffffff","line1Opacity":0.29,"line2Pos":0.36,"line2Color":"","line2Opacity":0,"line3Pos":0,"line3Color":"","line3Opacity":0.67,"line4Pos":0.51,"line4Color":"","line4Opacity":0.95,"line5Pos":0.68,"line5Color":"","line5Opacity":0,"lineFollow":false,"glintInset":0.955,"glintBlur":2.7,"glintColor":"#ffffff","glintAngle":94,"glintFollow":0,"glintOffsetX":0,"glintOffsetY":0,"glintDash":0,"glintGap":14.5,"upperStart":0.42,"upperEnd":0,"lowerStart":0.81,"lowerEnd":1,"glintMiddle":0,"middleStart":1,"middleEnd":0.02,"rimOpacity":0,"rimWidth":0,"rimColor":"#ffffff","topGloss":1,"topReach":0.25,"topBlur":6.5,"sideThickness":0,"sideTone":0.45,"sideOpacity":0.75,"sideColor":"","sideLine":0.85,"sideLineTone":1,"sideLineColor":"","sideLineWidth":2.4,"sideLineScaleX":1,"sideLineScaleY":1,"sideLineX":0,"sideLineY":0,"sideLineFrom":0.7,"sideLineTo":1,"sideLineFade":0.12,"sideLineSideFade":0,"sideLineBlur":0,"sideLineDash":0,"sideLineGap":0,"sideLineCap":"round","eyeColor":"#ffffff","eyeOpacity":1,"eyeLitPart":0.25,"eyeRimWidth":0,"eyeRimOpacity":1,"shadowColor":"","shadowSpread":0,"shadowFollow":true,"shadowAngle":117,"antennaLight":"","antennaMid":"#ffe042","antennaDark":"#fffac2","antennaHighlight":1,"antennaHighlightSize":0.62,"antennaHighlightX":0.23,"antennaHighlightY":0.38,"antennaFollow":true,"antennaOpacity":1,"antennaSize":1,"antennaRimColor":"#ffffff","antennaRimWidth":0,"antennaRimOpacity":0.6,"eyeHighlight":0,"eyeHighlightSize":1,"eyeHighlightSoft":0.75,"eyeHighlightX":-9,"eyeHighlightY":-10,"eyeHighlightFollow":6,"eyeSpark":0,"eyeSparkSize":3.5,"eyeSparkX":8,"eyeSparkY":9}},"glow-green":{"base":["#90d89e","#61c876","#42bd5b","#52c267"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"软糖","title":"软糖 · 绿","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#90d89e","#61c876","#52c267"],"fixedTune":{"depth":0.6,"faceGlow":0.8,"faceX":0.43,"faceY":0.05,"faceSize":0.69,"bandWidth":46,"bandLight":0.41,"bandOpacity":0.77,"bandMiddle":1,"lineOpacity":0,"glintWidth":3.2,"glintUpper":0.84,"glintLower":0.85,"eyeTint":0.42,"shadowBlur":4,"shadowOpacity":0.89,"shadowDarkness":0.3,"gradient":"radial","centerX":0.32,"centerY":0.08,"radius":0.81,"stopMid":0.333,"stopEdge":0.667,"bandBlur":12,"glintInset":0.955,"glintBlur":2.7,"glintAngle":94,"glintDash":0,"upperStart":0.42,"upperEnd":0,"glintMiddle":0,"rimOpacity":0,"topGloss":1,"topReach":0.25,"topBlur":6.5,"sideThickness":0,"eyeLitPart":0.25,"shadowSpread":0,"shadowAngle":117,"antennaHighlight":1,"antennaHighlightSize":0.36,"antennaHighlightX":0.23,"antennaHighlightY":0.38,"colors":["#90d89e","#61c876","#42bd5b","#52c267"],"antennaMid":"#70cd7e","antennaDark":"#9fdda8"}},"gem-blue":{"base":["#2e7bff","#337aff","#0056f5","#023bca"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"糖果玻璃","title":"糖果玻璃 · 蓝","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#2e7bff","#337aff","#023bca"],"fixedTune":{"faceGlow":0.67,"bandWidth":20,"lineOpacity":0.41,"glintUpper":1,"glintLower":0.43,"eyeTint":0.2,"shadowOpacity":0.8,"shadowDarkness":0.34,"glintMiddle":0,"rimOpacity":0,"topGloss":0,"sideThickness":0,"shadowAngle":117,"antennaHighlight":1,"antennaHighlightSize":0.5,"antennaRimOpacity":1,"eyeHighlight":1,"eyeHighlightSize":26.5,"eyeHighlightSoft":0.98,"eyeHighlightX":-1,"eyeHighlightY":-9,"eyeHighlightFollow":11.5,"eyeSpark":0,"colors":["#2e7bff","#337aff","#0056f5","#023bca"]}},"gem-red":{"base":["#ff312e","#ff3a33","#f50700","#ca1502"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"糖果玻璃","title":"糖果玻璃 · 红","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#ff312e","#ff3a33","#ca1502"],"fixedTune":{"faceGlow":0.67,"bandWidth":20,"lineOpacity":0.41,"glintUpper":1,"glintLower":0.43,"eyeTint":0.2,"shadowOpacity":0.8,"shadowDarkness":0.34,"glintMiddle":0,"rimOpacity":0,"topGloss":0,"sideThickness":0,"shadowAngle":117,"antennaHighlight":1,"antennaHighlightSize":0.5,"antennaRimOpacity":1,"eyeHighlight":1,"eyeHighlightSize":26.5,"eyeHighlightSoft":0.98,"eyeHighlightX":-1,"eyeHighlightY":-9,"eyeHighlightFollow":11.5,"eyeSpark":0,"colors":["#ff312e","#ff3a33","#f50700","#ca1502"]}},"gem-green":{"base":["#14ce29","#15d42e","#0f9620","#0d7621"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"糖果玻璃","title":"糖果玻璃 · 绿","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#14ce29","#15d42e","#0d7621"],"fixedTune":{"faceGlow":0.67,"bandWidth":20,"lineOpacity":0.41,"glintUpper":1,"glintLower":0.43,"eyeTint":0.2,"shadowOpacity":0.8,"shadowDarkness":0.34,"glintMiddle":0,"rimOpacity":0,"topGloss":0,"sideThickness":0,"shadowAngle":117,"antennaHighlight":1,"antennaHighlightSize":0.5,"antennaRimOpacity":1,"eyeHighlight":1,"eyeHighlightSize":26.5,"eyeHighlightSoft":0.98,"eyeHighlightX":-1,"eyeHighlightY":-9,"eyeHighlightFollow":11.5,"eyeSpark":0,"colors":["#14ce29","#15d42e","#0f9620","#0d7621"]}},"gem-purple":{"base":["#992eff","#a033ff","#8200f5","#7902ca"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"糖果玻璃","title":"糖果玻璃 · 紫","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#992eff","#a033ff","#7902ca"],"fixedTune":{"faceGlow":0.67,"bandWidth":20,"lineOpacity":0.41,"glintUpper":1,"glintLower":0.43,"eyeTint":0.2,"shadowOpacity":0.8,"shadowDarkness":0.34,"glintMiddle":0,"rimOpacity":0,"topGloss":0,"sideThickness":0,"shadowAngle":117,"antennaHighlight":1,"antennaHighlightSize":0.5,"antennaRimOpacity":1,"eyeHighlight":1,"eyeHighlightSize":26.5,"eyeHighlightSoft":0.98,"eyeHighlightX":-1,"eyeHighlightY":-9,"eyeHighlightFollow":11.5,"eyeSpark":0,"colors":["#992eff","#a033ff","#8200f5","#7902ca"]}},"gem-pink":{"base":["#ff2e94","#ff3392","#f50073","#ca0253"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"糖果玻璃","title":"糖果玻璃 · 粉红","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#ff2e94","#ff3392","#ca0253"],"fixedTune":{"faceGlow":0.67,"bandWidth":20,"lineOpacity":0.41,"glintUpper":1,"glintLower":0.43,"eyeTint":0.2,"shadowOpacity":0.8,"shadowDarkness":0.34,"glintMiddle":0,"rimOpacity":0,"topGloss":0,"sideThickness":0,"shadowAngle":117,"antennaHighlight":1,"antennaHighlightSize":0.5,"antennaRimOpacity":1,"eyeHighlight":1,"eyeHighlightSize":26.5,"eyeHighlightSoft":0.98,"eyeHighlightX":-1,"eyeHighlightY":-9,"eyeHighlightFollow":11.5,"eyeSpark":0,"colors":["#ff2e94","#ff3392","#f50073","#ca0253"]}},"gem-orange":{"base":["#ff7f25","#ff862a","#eb6500","#c16102"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"糖果玻璃","title":"糖果玻璃 · 橙","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#ff7f25","#ff862a","#c16102"],"fixedTune":{"faceGlow":0.67,"bandWidth":20,"lineOpacity":0.41,"glintUpper":1,"glintLower":0.43,"eyeTint":0.2,"shadowOpacity":0.8,"shadowDarkness":0.34,"glintMiddle":0,"rimOpacity":0,"topGloss":0,"sideThickness":0,"shadowAngle":117,"antennaHighlight":1,"antennaHighlightSize":0.5,"antennaRimOpacity":1,"eyeHighlight":1,"eyeHighlightSize":26.5,"eyeHighlightSoft":0.98,"eyeHighlightX":-1,"eyeHighlightY":-9,"eyeHighlightFollow":11.5,"eyeSpark":0,"colors":["#ff7f25","#ff862a","#eb6500","#c16102"]}},"gleam-blue":{"base":["#5a9dff","#2f7cf6","#286fea","#1c5ed8"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"亮光亚克力","title":"亮光亚克力 · 蓝","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#5a9dff","#2f7cf6","#1c5ed8"],"fixedTune":{"depth":0.12,"faceGlow":0,"bandWidth":26,"bandLight":0.4,"bandOpacity":0.6,"bandMiddle":0.24,"lineOpacity":1,"glintWidth":3.6,"glintUpper":1,"glintLower":0.85,"eyeTint":0.6,"shadowDistance":8,"shadowBlur":6,"shadowOpacity":0.8,"gradient":"radial","centerX":0.5,"centerY":-0.28,"radius":0.92,"stopMid":0.84,"stopEdge":0.85,"bandBlur":1.1,"lineInset":0.87,"lineWidth":1.9,"lineAngle":218,"glintInset":0.95,"glintBlur":0.5,"glintAngle":44,"glintDash":0,"upperEnd":0.2,"lowerStart":0.73,"glintMiddle":0,"rimOpacity":0,"topGloss":0.75,"topReach":0.58,"topBlur":12,"sideThickness":0,"eyeLitPart":0.38,"colors":["#5a9dff","#2f7cf6","#286fea","#1c5ed8"]}},"gleam-red":{"base":["#ff5c5a","#f6362f","#ea3328","#d8291c"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"亮光亚克力","title":"亮光亚克力 · 红","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#ff5c5a","#f6362f","#d8291c"],"fixedTune":{"depth":0.12,"faceGlow":0,"bandWidth":26,"bandLight":0.4,"bandOpacity":0.6,"bandMiddle":0.24,"lineOpacity":1,"glintWidth":3.6,"glintUpper":1,"glintLower":0.85,"eyeTint":0.6,"shadowDistance":8,"shadowBlur":6,"shadowOpacity":0.8,"gradient":"radial","centerX":0.5,"centerY":-0.28,"radius":0.92,"stopMid":0.84,"stopEdge":0.85,"bandBlur":1.1,"lineInset":0.87,"lineWidth":1.9,"lineAngle":218,"glintInset":0.95,"glintBlur":0.5,"glintAngle":44,"glintDash":0,"upperEnd":0.2,"lowerStart":0.73,"glintMiddle":0,"rimOpacity":0,"topGloss":0.75,"topReach":0.58,"topBlur":12,"sideThickness":0,"eyeLitPart":0.38,"colors":["#ff5c5a","#f6362f","#ea3328","#d8291c"]}},"gleam-green":{"base":["#2cea41","#1bbf31","#20a434","#1e8630"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"亮光亚克力","title":"亮光亚克力 · 绿","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#2cea41","#1bbf31","#1e8630"],"fixedTune":{"depth":0.12,"faceGlow":0,"bandWidth":26,"bandLight":0.4,"bandOpacity":0.6,"bandMiddle":0.24,"lineOpacity":1,"glintWidth":3.6,"glintUpper":1,"glintLower":0.85,"eyeTint":0.6,"shadowDistance":8,"shadowBlur":6,"shadowOpacity":0.8,"gradient":"radial","centerX":0.5,"centerY":-0.28,"radius":0.92,"stopMid":0.84,"stopEdge":0.85,"bandBlur":1.1,"lineInset":0.87,"lineWidth":1.9,"lineAngle":218,"glintInset":0.95,"glintBlur":0.5,"glintAngle":44,"glintDash":0,"upperEnd":0.2,"lowerStart":0.73,"glintMiddle":0,"rimOpacity":0,"topGloss":0.75,"topReach":0.58,"topBlur":12,"sideThickness":0,"eyeLitPart":0.38,"colors":["#2cea41","#1bbf31","#20a434","#1e8630"]}},"gleam-yellow":{"base":["#ffe35a","#f6d82f","#ead128","#d8c31c"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"亮光亚克力","title":"亮光亚克力 · 黄","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#ffe35a","#f6d82f","#d8c31c"],"fixedTune":{"depth":0.12,"faceGlow":0,"bandWidth":26,"bandLight":0.4,"bandOpacity":0.6,"bandMiddle":0.24,"lineOpacity":1,"glintWidth":3.6,"glintUpper":1,"glintLower":0.85,"eyeTint":0.6,"shadowDistance":8,"shadowBlur":6,"shadowOpacity":0.8,"gradient":"radial","centerX":0.5,"centerY":-0.28,"radius":0.92,"stopMid":0.84,"stopEdge":0.85,"bandBlur":1.1,"lineInset":0.87,"lineWidth":1.9,"lineAngle":218,"glintInset":0.95,"glintBlur":0.5,"glintAngle":44,"glintDash":0,"upperEnd":0.2,"lowerStart":0.73,"glintMiddle":0,"rimOpacity":0,"topGloss":0.75,"topReach":0.58,"topBlur":12,"sideThickness":0,"eyeLitPart":0.38,"colors":["#ffe35a","#f6d82f","#ead128","#d8c31c"]}},"gleam-purple":{"base":["#af5aff","#992ff6","#9428ea","#871cd8"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"亮光亚克力","title":"亮光亚克力 · 紫","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#af5aff","#992ff6","#871cd8"],"fixedTune":{"depth":0.12,"faceGlow":0,"bandWidth":26,"bandLight":0.4,"bandOpacity":0.6,"bandMiddle":0.24,"lineOpacity":1,"glintWidth":3.6,"glintUpper":1,"glintLower":0.85,"eyeTint":0.6,"shadowDistance":8,"shadowBlur":6,"shadowOpacity":0.8,"gradient":"radial","centerX":0.5,"centerY":-0.28,"radius":0.92,"stopMid":0.84,"stopEdge":0.85,"bandBlur":1.1,"lineInset":0.87,"lineWidth":1.9,"lineAngle":218,"glintInset":0.95,"glintBlur":0.5,"glintAngle":44,"glintDash":0,"upperEnd":0.2,"lowerStart":0.73,"glintMiddle":0,"rimOpacity":0,"topGloss":0.75,"topReach":0.58,"topBlur":12,"sideThickness":0,"eyeLitPart":0.38,"colors":["#af5aff","#992ff6","#9428ea","#871cd8"]}},"gleam-pink":{"base":["#ff5ab0","#f62f92","#ea2885","#d81c73"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"亮光亚克力","title":"亮光亚克力 · 粉","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#ff5ab0","#f62f92","#d81c73"],"fixedTune":{"depth":0.12,"faceGlow":0,"bandWidth":26,"bandLight":0.4,"bandOpacity":0.6,"bandMiddle":0.24,"lineOpacity":1,"glintWidth":3.6,"glintUpper":1,"glintLower":0.85,"eyeTint":0.6,"shadowDistance":8,"shadowBlur":6,"shadowOpacity":0.8,"gradient":"radial","centerX":0.5,"centerY":-0.28,"radius":0.92,"stopMid":0.84,"stopEdge":0.85,"bandBlur":1.1,"lineInset":0.87,"lineWidth":1.9,"lineAngle":218,"glintInset":0.95,"glintBlur":0.5,"glintAngle":44,"glintDash":0,"upperEnd":0.2,"lowerStart":0.73,"glintMiddle":0,"rimOpacity":0,"topGloss":0.75,"topReach":0.58,"topBlur":12,"sideThickness":0,"eyeLitPart":0.38,"colors":["#ff5ab0","#f62f92","#ea2885","#d81c73"]}},"clear-blue":{"base":["#75acff","#428eff","#337aff","#001442"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"清透亚克力","title":"清透亚克力 · 蓝","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#75acff","#428eff","#001442"],"fixedTune":{"depth":0.4,"faceGlow":0.8,"faceX":0.24,"faceY":0.01,"faceSize":0.94,"bandWidth":18,"bandOpacity":0.64,"bandMiddle":0,"lineOpacity":0.81,"glintWidth":3.2,"glintUpper":0.95,"glintLower":0.85,"eyeTint":0.38,"shadowDistance":5,"shadowBlur":1.9,"shadowOpacity":0.8,"gradient":"radial","centerX":0.32,"centerY":0.17,"radius":0.95,"stopMid":0.333,"stopEdge":0.67,"depthStart":0.66,"bandBlur":2.6,"lineInset":0.865,"lineWidth":8,"lineBlur":4.4,"lineAngle":243,"glintInset":0.955,"glintBlur":2.6,"glintAngle":89,"glintDash":0,"glintMiddle":0,"rimOpacity":0,"topGloss":0,"sideThickness":0,"eyeLitPart":0.38,"shadowSpread":0,"colors":["#75acff","#428eff","#337aff","#001442"]}},"clear-red":{"base":["#ff7a75","#ff4842","#ff4533","#420900"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"清透亚克力","title":"清透亚克力 · 红","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#ff7a75","#ff4842","#420900"],"fixedTune":{"depth":0.4,"faceGlow":0.8,"faceX":0.24,"faceY":0.01,"faceSize":0.94,"bandWidth":18,"bandOpacity":0.64,"bandMiddle":0,"lineOpacity":0.81,"glintWidth":3.2,"glintUpper":0.95,"glintLower":0.85,"eyeTint":0.38,"shadowDistance":5,"shadowBlur":1.9,"shadowOpacity":0.8,"gradient":"radial","centerX":0.32,"centerY":0.17,"radius":0.95,"stopMid":0.333,"stopEdge":0.67,"depthStart":0.66,"bandBlur":2.6,"lineInset":0.865,"lineWidth":8,"lineBlur":4.4,"lineAngle":243,"glintInset":0.955,"glintBlur":2.6,"glintAngle":89,"glintDash":0,"glintMiddle":0,"rimOpacity":0,"topGloss":0,"sideThickness":0,"eyeLitPart":0.38,"shadowSpread":0,"colors":["#ff7a75","#ff4842","#ff4533","#420900"]}},"clear-green":{"base":["#48ed5f","#16e332","#15d439","#010d04"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"清透亚克力","title":"清透亚克力 · 绿","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#48ed5f","#16e332","#010d04"],"fixedTune":{"depth":0.4,"faceGlow":0.8,"faceX":0.24,"faceY":0.01,"faceSize":0.94,"bandWidth":18,"bandOpacity":0.64,"bandMiddle":0,"lineOpacity":0.81,"glintWidth":3.2,"glintUpper":0.95,"glintLower":0.85,"eyeTint":0.38,"shadowDistance":5,"shadowBlur":1.9,"shadowOpacity":0.8,"gradient":"radial","centerX":0.32,"centerY":0.17,"radius":0.95,"stopMid":0.333,"stopEdge":0.67,"depthStart":0.66,"bandBlur":2.6,"lineInset":0.865,"lineWidth":8,"lineBlur":4.4,"lineAngle":243,"glintInset":0.955,"glintBlur":2.6,"glintAngle":89,"glintDash":0,"glintMiddle":0,"rimOpacity":0,"topGloss":0,"sideThickness":0,"eyeLitPart":0.38,"shadowSpread":0,"colors":["#48ed5f","#16e332","#15d439","#010d04"]}},"clear-purple":{"base":["#bf75ff","#a742ff","#ab33ff","#2a0042"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"清透亚克力","title":"清透亚克力 · 紫","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#bf75ff","#a742ff","#2a0042"],"fixedTune":{"depth":0.4,"faceGlow":0.8,"faceX":0.24,"faceY":0.01,"faceSize":0.94,"bandWidth":18,"bandOpacity":0.64,"bandMiddle":0,"lineOpacity":0.81,"glintWidth":3.2,"glintUpper":0.95,"glintLower":0.85,"eyeTint":0.38,"shadowDistance":5,"shadowBlur":1.9,"shadowOpacity":0.8,"gradient":"radial","centerX":0.32,"centerY":0.17,"radius":0.95,"stopMid":0.333,"stopEdge":0.67,"depthStart":0.66,"bandBlur":2.6,"lineInset":0.865,"lineWidth":8,"lineBlur":4.4,"lineAngle":243,"glintInset":0.955,"glintBlur":2.6,"glintAngle":89,"glintDash":0,"glintMiddle":0,"rimOpacity":0,"topGloss":0,"sideThickness":0,"eyeLitPart":0.38,"shadowSpread":0,"colors":["#bf75ff","#a742ff","#ab33ff","#2a0042"]}},"clear-pink":{"base":["#ff75b5","#ff429a","#ff3387","#420018"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"清透亚克力","title":"清透亚克力 · 粉红","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#ff75b5","#ff429a","#420018"],"fixedTune":{"depth":0.4,"faceGlow":0.8,"faceX":0.24,"faceY":0.01,"faceSize":0.94,"bandWidth":18,"bandOpacity":0.64,"bandMiddle":0,"lineOpacity":0.81,"glintWidth":3.2,"glintUpper":0.95,"glintLower":0.85,"eyeTint":0.38,"shadowDistance":5,"shadowBlur":1.9,"shadowOpacity":0.8,"gradient":"radial","centerX":0.32,"centerY":0.17,"radius":0.95,"stopMid":0.333,"stopEdge":0.67,"depthStart":0.66,"bandBlur":2.6,"lineInset":0.865,"lineWidth":8,"lineBlur":4.4,"lineAngle":243,"glintInset":0.955,"glintBlur":2.6,"glintAngle":89,"glintDash":0,"glintMiddle":0,"rimOpacity":0,"topGloss":0,"sideThickness":0,"eyeLitPart":0.38,"shadowSpread":0,"colors":["#ff75b5","#ff429a","#ff3387","#420018"]}},"clear-orange":{"base":["#ffad6d","#ff8f39","#ff922a","#3c2000"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"清透亚克力","title":"清透亚克力 · 橙","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#ffad6d","#ff8f39","#3c2000"],"fixedTune":{"depth":0.4,"faceGlow":0.8,"faceX":0.24,"faceY":0.01,"faceSize":0.94,"bandWidth":18,"bandOpacity":0.64,"bandMiddle":0,"lineOpacity":0.81,"glintWidth":3.2,"glintUpper":0.95,"glintLower":0.85,"eyeTint":0.38,"shadowDistance":5,"shadowBlur":1.9,"shadowOpacity":0.8,"gradient":"radial","centerX":0.32,"centerY":0.17,"radius":0.95,"stopMid":0.333,"stopEdge":0.67,"depthStart":0.66,"bandBlur":2.6,"lineInset":0.865,"lineWidth":8,"lineBlur":4.4,"lineAngle":243,"glintInset":0.955,"glintBlur":2.6,"glintAngle":89,"glintDash":0,"glintMiddle":0,"rimOpacity":0,"topGloss":0,"sideThickness":0,"eyeLitPart":0.38,"shadowSpread":0,"colors":["#ffad6d","#ff8f39","#ff922a","#3c2000"]}},"slab-blue":{"base":["#3cabec","#2a67d0","#1e3cb4","#12228a"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"厚果冻","title":"厚果冻 · 蓝","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#3cabec","#2a67d0","#12228a"],"fixedTune":{"depth":0.79,"faceGlow":0.18,"faceX":0.24,"faceY":0,"faceSize":0.83,"bandWidth":66,"bandOpacity":0.42,"bandMiddle":0.46,"lineOpacity":1,"glintWidth":10.5,"glintUpper":1,"glintLower":0.46,"eyeTint":0.32,"shadowDistance":5.5,"shadowBlur":0,"shadowOpacity":0.78,"angle":45,"stopMid":0.51,"stopEdge":1,"depthStart":0.29,"bandBlur":9.8,"lineInset":0.98,"lineWidth":5.5,"lineAngle":22,"lineOffsetX":-2.1,"lineOffsetY":0.4,"line1Pos":0.28,"line1Opacity":0.82,"line2Pos":0.44,"line2Opacity":0.69,"line3Pos":0.7,"line3Opacity":0.6,"line4Pos":0.44,"line4Opacity":0.47,"line5Pos":0.32,"line5Opacity":0.71,"glintInset":0.8,"glintAngle":87,"glintDash":0,"upperEnd":0.24,"glintMiddle":0,"rimOpacity":0,"topGloss":0.78,"topReach":0.5,"topBlur":5.2,"sideThickness":16.5,"sideTone":1,"sideOpacity":0.69,"sideLine":1,"sideLineWidth":3.2,"sideLineScaleX":0.94,"sideLineScaleY":1.045,"sideLineX":0.5,"sideLineY":-4.5,"sideLineFrom":0.72,"sideLineFade":0.13,"eyeLitPart":0.3,"shadowSpread":0,"colors":["#3cabec","#2a67d0","#1e3cb4","#12228a"],"sideColor":"#5ccbff","sideLineColor":"#cceeff"}},"slab-red":{"base":["#ec3c64","#d0302a","#b43c1e","#8a3212"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"厚果冻","title":"厚果冻 · 红","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#ec3c64","#d0302a","#8a3212"],"fixedTune":{"depth":0.79,"faceGlow":0.18,"faceX":0.24,"faceY":0,"faceSize":0.83,"bandWidth":66,"bandOpacity":0.42,"bandMiddle":0.46,"lineOpacity":1,"glintWidth":10.5,"glintUpper":1,"glintLower":0.46,"eyeTint":0.32,"shadowDistance":5.5,"shadowBlur":0,"shadowOpacity":0.78,"angle":45,"stopMid":0.51,"stopEdge":1,"depthStart":0.29,"bandBlur":9.8,"lineInset":0.98,"lineWidth":5.5,"lineAngle":22,"lineOffsetX":-2.1,"lineOffsetY":0.4,"line1Pos":0.28,"line1Opacity":0.82,"line2Pos":0.44,"line2Opacity":0.69,"line3Pos":0.7,"line3Opacity":0.6,"line4Pos":0.44,"line4Opacity":0.47,"line5Pos":0.32,"line5Opacity":0.71,"glintInset":0.8,"glintAngle":87,"glintDash":0,"upperEnd":0.24,"glintMiddle":0,"rimOpacity":0,"topGloss":0.78,"topReach":0.5,"topBlur":5.2,"sideThickness":16.5,"sideTone":1,"sideOpacity":0.69,"sideLine":1,"sideLineWidth":3.2,"sideLineScaleX":0.94,"sideLineScaleY":1.045,"sideLineX":0.5,"sideLineY":-4.5,"sideLineFrom":0.72,"sideLineFade":0.13,"eyeLitPart":0.3,"shadowSpread":0,"colors":["#ec3c64","#d0302a","#b43c1e","#8a3212"],"sideColor":"#ff5c8a","sideLineColor":"#ffccda"}},"slab-green":{"base":["#a6ec3c","#62d02a","#38b41e","#1e8a12"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"厚果冻","title":"厚果冻 · 绿","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#a6ec3c","#62d02a","#1e8a12"],"fixedTune":{"depth":0.79,"faceGlow":0.18,"faceX":0.24,"faceY":0,"faceSize":0.83,"bandWidth":66,"bandOpacity":0.42,"bandMiddle":0.46,"lineOpacity":1,"glintWidth":10.5,"glintUpper":1,"glintLower":0.46,"eyeTint":0.32,"shadowDistance":5.5,"shadowBlur":0,"shadowOpacity":0.78,"angle":45,"stopMid":0.51,"stopEdge":1,"depthStart":0.29,"bandBlur":9.8,"lineInset":0.98,"lineWidth":5.5,"lineAngle":22,"lineOffsetX":-2.1,"lineOffsetY":0.4,"line1Pos":0.28,"line1Opacity":0.82,"line2Pos":0.44,"line2Opacity":0.69,"line3Pos":0.7,"line3Opacity":0.6,"line4Pos":0.44,"line4Opacity":0.47,"line5Pos":0.32,"line5Opacity":0.71,"glintInset":0.8,"glintAngle":87,"glintDash":0,"upperEnd":0.24,"glintMiddle":0,"rimOpacity":0,"topGloss":0.78,"topReach":0.5,"topBlur":5.2,"sideThickness":16.5,"sideTone":1,"sideOpacity":0.69,"sideLine":1,"sideLineWidth":3.2,"sideLineScaleX":0.94,"sideLineScaleY":1.045,"sideLineX":0.5,"sideLineY":-4.5,"sideLineFrom":0.72,"sideLineFade":0.13,"eyeLitPart":0.3,"shadowSpread":0,"colors":["#a6ec3c","#62d02a","#38b41e","#1e8a12"],"sideColor":"#c6ff5c","sideLineColor":"#edffcc"}},"slab-purple":{"base":["#6b3cec","#832ad0","#871eb4","#6e128a"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"厚果冻","title":"厚果冻 · 紫","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#6b3cec","#832ad0","#6e128a"],"fixedTune":{"depth":0.79,"faceGlow":0.18,"faceX":0.24,"faceY":0,"faceSize":0.83,"bandWidth":66,"bandOpacity":0.42,"bandMiddle":0.46,"lineOpacity":1,"glintWidth":10.5,"glintUpper":1,"glintLower":0.46,"eyeTint":0.32,"shadowDistance":5.5,"shadowBlur":0,"shadowOpacity":0.78,"angle":45,"stopMid":0.51,"stopEdge":1,"depthStart":0.29,"bandBlur":9.8,"lineInset":0.98,"lineWidth":5.5,"lineAngle":22,"lineOffsetX":-2.1,"lineOffsetY":0.4,"line1Pos":0.28,"line1Opacity":0.82,"line2Pos":0.44,"line2Opacity":0.69,"line3Pos":0.7,"line3Opacity":0.6,"line4Pos":0.44,"line4Opacity":0.47,"line5Pos":0.32,"line5Opacity":0.71,"glintInset":0.8,"glintAngle":87,"glintDash":0,"upperEnd":0.24,"glintMiddle":0,"rimOpacity":0,"topGloss":0.78,"topReach":0.5,"topBlur":5.2,"sideThickness":16.5,"sideTone":1,"sideOpacity":0.69,"sideLine":1,"sideLineWidth":3.2,"sideLineScaleX":0.94,"sideLineScaleY":1.045,"sideLineX":0.5,"sideLineY":-4.5,"sideLineFrom":0.72,"sideLineFade":0.13,"eyeLitPart":0.3,"shadowSpread":0,"colors":["#6b3cec","#832ad0","#871eb4","#6e128a"],"sideColor":"#805cff","sideLineColor":"#d7ccff"}},"slab-pink":{"base":["#ec3cc3","#d02a7d","#b41e50","#8a1232"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"厚果冻","title":"厚果冻 · 粉","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#ec3cc3","#d02a7d","#8a1232"],"fixedTune":{"depth":0.79,"faceGlow":0.18,"faceX":0.24,"faceY":0,"faceSize":0.83,"bandWidth":66,"bandOpacity":0.42,"bandMiddle":0.46,"lineOpacity":1,"glintWidth":10.5,"glintUpper":1,"glintLower":0.46,"eyeTint":0.32,"shadowDistance":5.5,"shadowBlur":0,"shadowOpacity":0.78,"angle":45,"stopMid":0.51,"stopEdge":1,"depthStart":0.29,"bandBlur":9.8,"lineInset":0.98,"lineWidth":5.5,"lineAngle":22,"lineOffsetX":-2.1,"lineOffsetY":0.4,"line1Pos":0.28,"line1Opacity":0.82,"line2Pos":0.44,"line2Opacity":0.69,"line3Pos":0.7,"line3Opacity":0.6,"line4Pos":0.44,"line4Opacity":0.47,"line5Pos":0.32,"line5Opacity":0.71,"glintInset":0.8,"glintAngle":87,"glintDash":0,"upperEnd":0.24,"glintMiddle":0,"rimOpacity":0,"topGloss":0.78,"topReach":0.5,"topBlur":5.2,"sideThickness":16.5,"sideTone":1,"sideOpacity":0.69,"sideLine":1,"sideLineWidth":3.2,"sideLineScaleX":0.94,"sideLineScaleY":1.045,"sideLineX":0.5,"sideLineY":-4.5,"sideLineFrom":0.72,"sideLineFade":0.13,"eyeLitPart":0.3,"shadowSpread":0,"colors":["#ec3cc3","#d02a7d","#b41e50","#8a1232"],"sideColor":"#ff5ce1","sideLineColor":"#ffccf5"}},"slab-orange":{"base":["#f1856f","#de9259","#dc962e","#b68218"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"厚果冻","title":"厚果冻 · 橙","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#f1856f","#de9259","#b68218"],"fixedTune":{"depth":0.79,"faceGlow":0.18,"faceX":0.24,"faceY":0,"faceSize":0.83,"bandWidth":66,"bandOpacity":0.42,"bandMiddle":0.46,"lineOpacity":1,"glintWidth":10.5,"glintUpper":1,"glintLower":0.46,"eyeTint":0.32,"shadowDistance":5.5,"shadowBlur":0,"shadowOpacity":0.78,"angle":45,"stopMid":0.51,"stopEdge":1,"depthStart":0.29,"bandBlur":9.8,"lineInset":0.98,"lineWidth":5.5,"lineAngle":22,"lineOffsetX":-2.1,"lineOffsetY":0.4,"line1Pos":0.28,"line1Opacity":0.82,"line2Pos":0.44,"line2Opacity":0.69,"line3Pos":0.7,"line3Opacity":0.6,"line4Pos":0.44,"line4Opacity":0.47,"line5Pos":0.32,"line5Opacity":0.71,"glintInset":0.8,"glintAngle":87,"glintDash":0,"upperEnd":0.24,"glintMiddle":0,"rimOpacity":0,"topGloss":0.78,"topReach":0.5,"topBlur":5.2,"sideThickness":16.5,"sideTone":1,"sideOpacity":0.69,"sideLine":1,"sideLineWidth":3.2,"sideLineScaleX":0.94,"sideLineScaleY":1.045,"sideLineX":0.5,"sideLineY":-4.5,"sideLineFrom":0.72,"sideLineFade":0.13,"eyeLitPart":0.3,"shadowSpread":0,"colors":["#f1856f","#de9259","#dc962e","#b68218"],"sideColor":"#ff9c8e","sideLineColor":"#fff2f1"}},"prism-indigo":{"base":["#3f81f0","#4034c9","#bb30e8","#ff1f8b"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"渐变果冻","title":"渐变果冻 · 靛","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#3f81f0","#4034c9","#ff1f8b"],"fixedTune":{"faceGlow":0,"bandWidth":0,"lineOpacity":1,"glintUpper":1,"glintLower":0.61,"eyeTint":0.44,"shadowDistance":8,"shadowBlur":0,"shadowOpacity":1,"shadowDarkness":0,"angle":0,"depthStart":0.54,"lineInset":0.93,"lineWidth":1.9,"lineAngle":293,"lineOffsetY":-10,"line1Pos":0.44,"line1Opacity":1,"line2Pos":0.28,"line3Pos":1,"line4Opacity":0.49,"line5Pos":0.57,"glintInset":0.8,"glintAngle":90,"glintOffsetY":-4.4,"glintDash":0,"upperEnd":0.22,"lowerStart":1,"glintMiddle":0.29,"middleEnd":0.43,"rimOpacity":0,"topGloss":0.81,"topReach":0.54,"topBlur":10.1,"sideThickness":15,"sideTone":-0.24,"sideOpacity":1,"sideLine":1,"sideLineTone":0.88,"sideLineWidth":2.7,"sideLineScaleX":0.925,"sideLineScaleY":0.935,"sideLineFrom":0.77,"sideLineFade":0.28,"eyeLitPart":0.25,"shadowSpread":0.1,"antennaHighlight":1,"antennaHighlightSize":0.65,"antennaHighlightX":0.25,"antennaHighlightY":0.26,"eyeHighlight":0.76,"eyeHighlightSize":27,"eyeHighlightSoft":0.98,"eyeHighlightX":-5,"eyeHighlightY":5.5,"eyeHighlightFollow":12.5,"eyeSpark":0,"colors":["#3f81f0","#4034c9","#bb30e8","#ff1f8b"],"shadowColor":"#341a9e","antennaMid":"#748cd8","antennaDark":"#fba7f2","line2Color":"#ffffff","line3Color":"#ffffff"}},"prism-red":{"base":["#f03f8a","#c93934","#e8b230","#97ff1f"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"渐变果冻","title":"渐变果冻 · 红","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#f03f8a","#c93934","#97ff1f"],"fixedTune":{"faceGlow":0,"bandWidth":0,"lineOpacity":1,"glintUpper":1,"glintLower":0.61,"eyeTint":0.44,"shadowDistance":8,"shadowBlur":0,"shadowOpacity":1,"shadowDarkness":0,"angle":0,"depthStart":0.54,"lineInset":0.93,"lineWidth":1.9,"lineAngle":293,"lineOffsetY":-10,"line1Pos":0.44,"line1Opacity":1,"line2Pos":0.28,"line3Pos":1,"line4Opacity":0.49,"line5Pos":0.57,"glintInset":0.8,"glintAngle":90,"glintOffsetY":-4.4,"glintDash":0,"upperEnd":0.22,"lowerStart":1,"glintMiddle":0.29,"middleEnd":0.43,"rimOpacity":0,"topGloss":0.81,"topReach":0.54,"topBlur":10.1,"sideThickness":15,"sideTone":-0.24,"sideOpacity":1,"sideLine":1,"sideLineTone":0.88,"sideLineWidth":2.7,"sideLineScaleX":0.925,"sideLineScaleY":0.935,"sideLineFrom":0.77,"sideLineFade":0.28,"eyeLitPart":0.25,"shadowSpread":0.1,"antennaHighlight":1,"antennaHighlightSize":0.65,"antennaHighlightX":0.25,"antennaHighlightY":0.26,"eyeHighlight":0.76,"eyeHighlightSize":27,"eyeHighlightSoft":0.98,"eyeHighlightX":-5,"eyeHighlightY":5.5,"eyeHighlightFollow":12.5,"eyeSpark":0,"colors":["#f03f8a","#c93934","#e8b230","#97ff1f"],"shadowColor":"#9e2d1a","antennaMid":"#d87491","antennaDark":"#f6fba7","line2Color":"#ffffff","line3Color":"#ffffff"}},"prism-lime":{"base":["#cfe537","#6ab237","#29dc57","#18eff3"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"渐变果冻","title":"渐变果冻 · 青柠","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#cfe537","#6ab237","#18eff3"],"fixedTune":{"faceGlow":0,"bandWidth":0,"lineOpacity":1,"glintUpper":1,"glintLower":0.61,"eyeTint":0.44,"shadowDistance":8,"shadowBlur":0,"shadowOpacity":1,"shadowDarkness":0,"angle":0,"depthStart":0.54,"lineInset":0.93,"lineWidth":1.9,"lineAngle":293,"lineOffsetY":-10,"line1Pos":0.44,"line1Opacity":1,"line2Pos":0.28,"line3Pos":1,"line4Opacity":0.49,"line5Pos":0.57,"glintInset":0.8,"glintAngle":90,"glintOffsetY":-4.4,"glintDash":0,"upperEnd":0.22,"lowerStart":1,"glintMiddle":0.29,"middleEnd":0.43,"rimOpacity":0,"topGloss":0.81,"topReach":0.54,"topBlur":10.1,"sideThickness":15,"sideTone":-0.24,"sideOpacity":1,"sideLine":1,"sideLineTone":0.88,"sideLineWidth":2.7,"sideLineScaleX":0.925,"sideLineScaleY":0.935,"sideLineFrom":0.77,"sideLineFade":0.28,"eyeLitPart":0.25,"shadowSpread":0.1,"antennaHighlight":1,"antennaHighlightSize":0.65,"antennaHighlightX":0.25,"antennaHighlightY":0.26,"eyeHighlight":0.76,"eyeHighlightSize":27,"eyeHighlightSoft":0.98,"eyeHighlightX":-5,"eyeHighlightY":5.5,"eyeHighlightFollow":12.5,"eyeSpark":0,"colors":["#cfe537","#6ab237","#29dc57","#18eff3"],"shadowColor":"#3e891d","antennaMid":"#b5cf6c","antennaDark":"#9ff6d4","line2Color":"#ffffff","line3Color":"#ffffff"}},"prism-rose":{"base":["#f03fbc","#c93459","#e87e30","#d6ff1f"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"渐变果冻","title":"渐变果冻 · 玫红","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#f03fbc","#c93459","#d6ff1f"],"fixedTune":{"faceGlow":0,"bandWidth":0,"lineOpacity":1,"glintUpper":1,"glintLower":0.61,"eyeTint":0.44,"shadowDistance":8,"shadowBlur":0,"shadowOpacity":1,"shadowDarkness":0,"angle":0,"depthStart":0.54,"lineInset":0.93,"lineWidth":1.9,"lineAngle":293,"lineOffsetY":-10,"line1Pos":0.44,"line1Opacity":1,"line2Pos":0.28,"line3Pos":1,"line4Opacity":0.49,"line5Pos":0.57,"glintInset":0.8,"glintAngle":90,"glintOffsetY":-4.4,"glintDash":0,"upperEnd":0.22,"lowerStart":1,"glintMiddle":0.29,"middleEnd":0.43,"rimOpacity":0,"topGloss":0.81,"topReach":0.54,"topBlur":10.1,"sideThickness":15,"sideTone":-0.24,"sideOpacity":1,"sideLine":1,"sideLineTone":0.88,"sideLineWidth":2.7,"sideLineScaleX":0.925,"sideLineScaleY":0.935,"sideLineFrom":0.77,"sideLineFade":0.28,"eyeLitPart":0.25,"shadowSpread":0.1,"antennaHighlight":1,"antennaHighlightSize":0.65,"antennaHighlightX":0.25,"antennaHighlightY":0.26,"eyeHighlight":0.76,"eyeHighlightSize":27,"eyeHighlightSoft":0.98,"eyeHighlightX":-5,"eyeHighlightY":5.5,"eyeHighlightFollow":12.5,"eyeSpark":0,"colors":["#f03fbc","#c93459","#e87e30","#d6ff1f"],"shadowColor":"#9e1a2c","antennaMid":"#d874ad","antennaDark":"#fbe8a7","line2Color":"#ffffff","line3Color":"#ffffff"}},"prism-sky":{"base":["#3ff0da","#3497c9","#3130e8","#cb1fff"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"渐变果冻","title":"渐变果冻 · 天蓝","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#3ff0da","#3497c9","#cb1fff"],"fixedTune":{"faceGlow":0,"bandWidth":0,"lineOpacity":1,"glintUpper":1,"glintLower":0.61,"eyeTint":0.44,"shadowDistance":8,"shadowBlur":0,"shadowOpacity":1,"shadowDarkness":0,"angle":0,"depthStart":0.54,"lineInset":0.93,"lineWidth":1.9,"lineAngle":293,"lineOffsetY":-10,"line1Pos":0.44,"line1Opacity":1,"line2Pos":0.28,"line3Pos":1,"line4Opacity":0.49,"line5Pos":0.57,"glintInset":0.8,"glintAngle":90,"glintOffsetY":-4.4,"glintDash":0,"upperEnd":0.22,"lowerStart":1,"glintMiddle":0.29,"middleEnd":0.43,"rimOpacity":0,"topGloss":0.81,"topReach":0.54,"topBlur":10.1,"sideThickness":15,"sideTone":-0.24,"sideOpacity":1,"sideLine":1,"sideLineTone":0.88,"sideLineWidth":2.7,"sideLineScaleX":0.925,"sideLineScaleY":0.935,"sideLineFrom":0.77,"sideLineFade":0.28,"eyeLitPart":0.25,"shadowSpread":0.1,"antennaHighlight":1,"antennaHighlightSize":0.65,"antennaHighlightX":0.25,"antennaHighlightY":0.26,"eyeHighlight":0.76,"eyeHighlightSize":27,"eyeHighlightSoft":0.98,"eyeHighlightX":-5,"eyeHighlightY":5.5,"eyeHighlightFollow":12.5,"eyeSpark":0,"colors":["#3ff0da","#3497c9","#3130e8","#cb1fff"],"shadowColor":"#1a639e","antennaMid":"#74d7d8","antennaDark":"#c5a7fb","line2Color":"#ffffff","line3Color":"#ffffff"}},"prism-purple":{"base":["#9a3ff0","#c534c9","#e83071","#ff7a1f"],"sheen":"slab","acrylic":true,"faithful":true,"plain":true,"set":"渐变果冻","title":"渐变果冻 · 紫","eye":"#ffffff","rim":"#ffffff","shine":0,"shade":0,"antenna":["#9a3ff0","#c534c9","#ff7a1f"],"fixedTune":{"faceGlow":0,"bandWidth":0,"lineOpacity":1,"glintUpper":1,"glintLower":0.61,"eyeTint":0.44,"shadowDistance":8,"shadowBlur":0,"shadowOpacity":1,"shadowDarkness":0,"angle":0,"depthStart":0.54,"lineInset":0.93,"lineWidth":1.9,"lineAngle":293,"lineOffsetY":-10,"line1Pos":0.44,"line1Opacity":1,"line2Pos":0.28,"line3Pos":1,"line4Opacity":0.49,"line5Pos":0.57,"glintInset":0.8,"glintAngle":90,"glintOffsetY":-4.4,"glintDash":0,"upperEnd":0.22,"lowerStart":1,"glintMiddle":0.29,"middleEnd":0.43,"rimOpacity":0,"topGloss":0.81,"topReach":0.54,"topBlur":10.1,"sideThickness":15,"sideTone":-0.24,"sideOpacity":1,"sideLine":1,"sideLineTone":0.88,"sideLineWidth":2.7,"sideLineScaleX":0.925,"sideLineScaleY":0.935,"sideLineFrom":0.77,"sideLineFade":0.28,"eyeLitPart":0.25,"shadowSpread":0.1,"antennaHighlight":1,"antennaHighlightSize":0.65,"antennaHighlightX":0.25,"antennaHighlightY":0.26,"eyeHighlight":0.76,"eyeHighlightSize":27,"eyeHighlightSoft":0.98,"eyeHighlightX":-5,"eyeHighlightY":5.5,"eyeHighlightFollow":12.5,"eyeSpark":0,"colors":["#9a3ff0","#c534c9","#e83071","#ff7a1f"],"shadowColor":"#9e1a93","antennaMid":"#b574d8","antennaDark":"#fba7a7","line2Color":"#ffffff","line3Color":"#ffffff"}},"ocean":{"base":["#7ff0e4","#3cc3e0","#2b7fd4","#3b3fb0"],"eye":"#132a4a","rim":"#e8fffd","shine":0.8,"shade":0.3,"antenna":["#e8fffd","#3cc3e0","#3b3fb0"],"linear":true},"forest":{"base":["#d9f99d","#7bd389","#2f9e7a","#1e5f6b"],"eye":"#12302a","rim":"#f4ffe8","shine":0.75,"shade":0.3,"antenna":["#f4ffe8","#7bd389","#1e5f6b"],"linear":true},"gradient-yellow":{"base":["#f0bf7f","#e0c73c","#b6d42b","#65b03b"],"eye":"#3c4a13","rim":"#fff5e8","shine":0.8,"shade":0.3,"antenna":["#fff5e8","#e0c73c","#65b03b"],"linear":true,"title":"渐变 · 黄"},"gradient-purple":{"base":["#a29aeb","#c592f1","#eb95cf","#e7c49b"],"eye":"#522d51","rim":"#fff6f4","shine":0.82,"shade":0.3,"antenna":["#efedff","#e99bec","#a5567e"],"linear":true,"title":"渐变 · 紫"},"candy":{"base":["#ffe1f0","#ff9cc8","#b18cff","#7fd4ff"],"eye":"#3a2152","rim":"#fff4fb","shine":0.85,"shade":0.26,"antenna":["#fff4fb","#ff9cc8","#7f6bd6"],"linear":true},"aurora":{"base":["#9aebea","#92c9f1","#a795eb","#e79bc7"],"eye":"#2d3052","rim":"#fff4fe","shine":0.82,"shade":0.3,"antenna":["#edffff","#9ba7ec","#7456a5"],"linear":true},"pearl":{"base":["#ffffff","#eaf2ff","#f4e9ff","#e2f6ee"],"eye":"#3b3a4a","rim":"#ffffff","shine":0.92,"shade":0.16,"antenna":["#ffffff","#ece6fb","#b9b4cf"],"linear":true},"sakura":{"base":["#ffffff","#fdeaf0","#f3c7d4","#d697ab"],"eye":"#4b2f3b","rim":"#ffffff","shine":0.9,"shade":0.2,"antenna":["#ffffff","#f7d3de","#cf8ea3"]},"lavender":{"base":["#ffffff","#ece6ff","#cbbcf2","#9c88d6"],"eye":"#33294d","rim":"#ffffff","shine":0.9,"shade":0.2,"antenna":["#ffffff","#ddd3fb","#9c88d6"]},"lemon":{"base":["#fffef0","#fff2a8","#f5d757","#c9a21d"],"eye":"#3d3510","rim":"#fffbe0","shine":0.9,"shade":0.22,"antenna":["#ffffff","#fbe58a","#c9a21d"]},"sky":{"base":["#ffffff","#dff1ff","#a9d6f7","#5ea4d8"],"eye":"#1d3a52","rim":"#ffffff","shine":0.9,"shade":0.22,"antenna":["#ffffff","#c7e6fb","#5ea4d8"]},"mint":{"base":["#f5fffb","#cdf3e5","#93dcc3","#52ad90"],"eye":"#1f3f36","rim":"#f2fffa","shine":0.85,"shade":0.24,"antenna":["#ffffff","#b5ead6","#4fa88b"]},"obsidian":{"base":["#7b8796","#313a47","#101722","#05080e"],"eye":"#f0f7ff","rim":"#c1d5f4","shine":0.57,"shade":0.68,"antenna":["#c3cfdf","#384452","#080e19"]},"midnight":{"base":["#7f98d4","#2c4381","#111e4a","#060b22"],"eye":"#eaf2ff","rim":"#a9c2ff","shine":0.55,"shade":0.62,"antenna":["#c9d7ff","#33498a","#070d26"]},"jade":{"base":["#7fb5a3","#2f6d5b","#123e33","#06201a"],"eye":"#ecfff7","rim":"#aee8d3","shine":0.5,"shade":0.6,"antenna":["#c8f0e2","#2f6d5b","#05201a"]},"amber":{"base":["#ffe2a6","#f2a73c","#c46812","#6b3005"],"eye":"#fff7e8","rim":"#ffdba0","shine":0.6,"shade":0.5,"antenna":["#fff0cc","#e08c22","#6b3005"]},"ruby":{"base":["#ff8a9a","#d0243f","#7a0d22","#3a0410"],"eye":"#fff0f2","rim":"#ffb3bf","shine":0.7,"shade":0.6,"antenna":["#ffd0d8","#d0243f","#3a0410"]},"sapphire":{"base":["#8fc0ff","#2a6fd6","#103f8c","#071d44"],"eye":"#eef6ff","rim":"#bcd8ff","shine":0.7,"shade":0.6,"antenna":["#d4e7ff","#2a6fd6","#071d44"]},"emerald":{"base":["#8ff0c0","#1fae74","#0b6a45","#033321"],"eye":"#effff7","rim":"#b8f7d9","shine":0.7,"shade":0.55,"antenna":["#d2fbe6","#1fae74","#033321"]},"soccer-grooves":{"base":["#4a4d55","#24262b","#131417","#060607"],"ball":true,"eye":"#ffffff","rim":"#e8eef8","shine":0.7,"shade":0.5,"antenna":["#4a4d55","#24262b","#060607"],"pattern":{"kind":"grooves","colors":["#c6ff2e","#000000"]}},"basketball":{"base":["#ffb066","#f07a1e","#c95a0e","#7a3305"],"ball":true,"eye":"#fff3e6","ring":"#2a1408","rim":"#ffffff","shine":0.55,"shade":0.45,"antenna":["#ffb066","#f07a1e","#7a3305"],"pattern":{"kind":"basketball","colors":["#2a1408","#7a3305"]}},"football":{"base":["#c07a4a","#8f4a22","#6a3112","#3a1606"],"ball":true,"eye":"#fff3e6","ring":"#2a1004","rim":"#e8eef8","shine":0.5,"shade":0.5,"antenna":["#c07a4a","#8f4a22","#3a1606"],"pattern":{"kind":"football","colors":["#ffffff","#3a1606","#2a1004"]}},"tennis":{"base":["#f4ff8a","#d7f43a","#aacb10","#66800a"],"ball":true,"eye":"#2f3a08","rim":"#ffffff","shine":0.6,"shade":0.3,"antenna":["#f4ff8a","#d7f43a","#66800a"],"pattern":{"kind":"tennis","colors":["#ffffff","#6a8a00"]}},"baseball":{"base":["#fffdf7","#f6f1e6","#e2d9c7","#b5a98f"],"ball":true,"eye":"#2a2a2e","rim":"#ffffff","shine":0.8,"shade":0.28,"antenna":["#fffdf7","#f6f1e6","#b5a98f"],"pattern":{"kind":"baseball","colors":["#c9a9a0","#d6333a"]}},"softball":{"base":["#fbff9a","#eef55a","#cfd61f","#8a8f0a"],"ball":true,"eye":"#3a3a10","rim":"#ffffff","shine":0.75,"shade":0.3,"antenna":["#fbff9a","#eef55a","#8a8f0a"],"pattern":{"kind":"baseball","colors":["#b8a640","#d6333a"]}},"cricket":{"base":["#e05a4f","#b52a22","#851812","#470806"],"ball":true,"eye":"#fff3ee","rim":"#e8eef8","shine":0.6,"shade":0.5,"antenna":["#e05a4f","#b52a22","#470806"],"pattern":{"kind":"cricket","colors":["#5a0c08","#f6ead6"]}},"golf":{"base":["#ffffff","#f6f6f4","#e2e2de","#acaca6"],"ball":true,"eye":"#2a2f36","rim":"#ffffff","shine":0.95,"shade":0.25,"antenna":["#ffffff","#f6f6f4","#acaca6"],"pattern":{"kind":"golf","colors":["#c3c9d2","#ffffff"]}},"tartan":{"base":["#d04848","#a82d30","#7d1c20","#4a0e12"],"eye":"#fff6e8","ring":"#2a0b0e","rim":"#e8eef8","shine":0.5,"shade":0.55,"antenna":["#d04848","#a82d30","#4a0e12"],"pattern":{"kind":"tartan","colors":["#1b2a4a","#f2d36b","#0f3d2a"]}},"marble":{"base":["#ffffff","#f6f6f4","#e6e6e2","#bcbcb6"],"eye":"#2a2a2e","rim":"#ffffff","shine":0.8,"shade":0.28,"antenna":["#ffffff","#f6f6f4","#bcbcb6"],"pattern":{"kind":"marble","colors":["#8d8d93","#c7a76b"]}},"black-marble":{"base":["#4a4a4f","#25252a","#141417","#050506"],"eye":"#f7f2e6","rim":"#e8eef8","shine":0.5,"shade":0.55,"antenna":["#4a4a4f","#25252a","#050506"],"pattern":{"kind":"marble","colors":["#d9b46a","#f2f2f2"],"seed":33}},"leaves":{"base":["#f0fbe6","#cfeeb2","#97d37b","#4f9a45"],"eye":"#173a17","rim":"#ffffff","shine":0.8,"shade":0.28,"antenna":["#f0fbe6","#cfeeb2","#4f9a45"],"pattern":{"kind":"scatter","shapes":["leaf"],"colors":["#3e8a3a","#7cc46a"],"count":18,"k":[6,10]}},"blossoms":{"base":["#fffafd","#ffeaf2","#ffd0e0","#f0a3c0"],"eye":"#4b2032","rim":"#ffffff","shine":0.8,"shade":0.28,"antenna":["#fffafd","#ffeaf2","#f0a3c0"],"pattern":{"kind":"scatter","shapes":["blossom"],"colors":["#ff9fbf","#ffe1ec"],"count":12,"k":[6,9]}},"neon":{"base":["#5b3df5","#2a1673","#120a3a","#06041a"],"eye":"#7ff9ff","rim":"#7ff9ff","shine":0.45,"shade":0.6,"antenna":["#c9fbff","#5b3df5","#06041a"]},"polka":{"base":["#ff9db2","#ff5d84","#e03a64","#9b1c3e"],"eye":"#ffffff","ring":"#7a1430","rim":"#ffffff","shine":0.8,"shade":0.28,"antenna":["#ff9db2","#ff5d84","#9b1c3e"],"pattern":{"kind":"dots","colors":["#ffffff"],"r":6,"size":30,"opacity":0.9}},"confetti":{"base":["#ffffff","#fbfaf7","#efece6","#c9c4bb"],"eye":"#2a2a35","rim":"#ffffff","shine":0.8,"shade":0.28,"antenna":["#ffffff","#fbfaf7","#c9c4bb"],"pattern":{"kind":"confetti","colors":["#ff5d8a","#3da9fc","#ffd23f","#2cb67d","#7f5af0"]}},"halftone":{"base":["#ffe6ee","#ffb3c7","#ff7aa0","#d6406c"],"eye":"#4a1428","rim":"#ffffff","shine":0.8,"shade":0.28,"antenna":["#ffe6ee","#ffb3c7","#d6406c"],"pattern":{"kind":"halftone","colors":["#ffffff"]}},"terrazzo":{"base":["#ffffff","#fbfaf7","#efece6","#c9c4bb"],"eye":"#2d2a26","rim":"#ffffff","shine":0.8,"shade":0.28,"antenna":["#ffffff","#fbfaf7","#c9c4bb"],"pattern":{"kind":"terrazzo","colors":["#e46a4f","#2e7d6b","#f2b33d","#3d5aa8","#9aa0a6"]}},"pixel":{"base":["#3a3a4a","#24242f","#16161d","#0a0a10"],"eye":"#ffffff","ring":"#16161a","rim":"#e8eef8","shine":0.5,"shade":0.55,"antenna":["#3a3a4a","#24242f","#0a0a10"],"pattern":{"kind":"pixel","colors":["#7f5af0","#2cb67d","#ff8906","#f25f4c","#3da9fc"]}}};
const SHEENS = Object.freeze({
  gloss: { top: .78, reach: .36, bottom: .3 },
  slab: { top: .26, reach: .3, bottom: 0, slab: true },
});

// Glass jelly, after photographic references: a deep saturated top face, a
// darker refraction ring just inside the rim, crisp white light on the rim, a
// broad bright gloss over the top, and a paler side wall visible along the
// bottom with a sharp bright line where it meets the top face.
function paintGlassJelly(skin, look) {
  const p = skin.sheenParts;
  const [band] = p.bevel.children;
  const replace = (id, tag, attrs, stops) => {
    skin.defs.querySelector(`#${id}`)?.remove();
    return gradient(skin.defs, tag, id, attrs, stops);
  };
  replace('skin-sheen-band', 'linearGradient', { x1: '0', y1: '0', x2: '0', y2: '1' },
    [[0, look.base[3], .2], [.5, look.base[3], .38], [1, look.base[3], .2]]);
  band.setAttribute('stroke-width', '24');
  replace('skin-sheen-glint', 'linearGradient', { x1: '0', y1: '0', x2: '1', y2: '1' },
    [[0, '#ffffff', 1], [.38, '#ffffff', .95], [.55, '#ffffff', .35], [.75, '#ffffff', .3], [.92, '#ffffff', .9], [1, '#ffffff', 1]]);
  replace('skin-sheen-top', 'linearGradient', { x1: '0', y1: '0', x2: '0', y2: '1' },
    [[0, '#ffffff', .92], [.1, '#ffffff', .62], [.24, '#ffffff', .18], [.34, '#ffffff', 0], [1, '#ffffff', 0]]);
  const wall = mixHex(look.base[3], '#ffffff', .45);
  replace('skin-side-fill', 'linearGradient', { x1: '0', y1: '0', x2: '1', y2: '0' },
    [[0, mixHex(look.base[0], '#ffffff', .4), .75], [.5, wall, .7], [1, mixHex(look.base[3], '#ffffff', .35), .8]]);
  replace('skin-side-line', 'linearGradient', { x1: '0', y1: '0', x2: '0', y2: '1' },
    [[0, '#ffffff', 0], [.7, '#ffffff', 0], [.82, '#ffffff', .85], [1, '#ffffff', .95]]);
  p.side.style.display = '';
  p.bottom.style.display = 'none';
  p.top.removeAttribute('filter');
  p.top.setAttribute('filter', 'url(#skin-crisp-top)');
  skin.defs.querySelector('#skin-crisp-top')?.remove();
  skin.defs.insertAdjacentHTML('beforeend', '<filter id="skin-crisp-top" filterUnits="userSpaceOnUse" x="-20" y="-20" width="280" height="280"><feGaussianBlur stdDeviation="1.4"/></filter>');
  skin.defs.querySelector('#skin-soft-edge feGaussianBlur')?.setAttribute('stdDeviation', '4');
}

// Live tuning for the faithful acrylic, read each time the skin is painted. A
// tuner page can set window.AgentRobotAvatarAcrylicConfig and repaint.
// Defaults are the look tuned by hand in demo/acrylic-tuner.html.
const ACRYLIC_DEFAULTS = Object.freeze({
  colors: null,          // [top, middle, edge, shadow] to override the skin's own colours
  vertical: false,       // colour runs top to bottom instead of corner to corner
  depth: 0.8,              // darkening toward the edge
  faceGlow: 0.67,         // soft light on the face
  faceX: 0.25, faceY: 0.03, faceSize: 0.66,
  bandWidth: 20,         // width of the bevel band along the edge
  bandLight: 0,        // how much lighter the bevel is than the colour
  bandOpacity: 1,       // bevel strength at the top and bottom
  bandMiddle: 0.98,       // bevel strength along the sides
  edgeBlur: 0.6,          // softness of the bevel and glints
  lineOpacity: 0.41,        // inner bevel line
  glintWidth: 12,       // white glint lines
  glintUpper: 1,       // glint on the upper right
  glintLower: 0.21,        // glint along the bottom
  eyeTint: 0.37,           // colour picked up by the eyes' shaded side
  eyeSoftness: 0,       // blur of the eyes seen through the acrylic
  shadowDistance: 6,
  shadowBlur: 0.6,
  shadowOpacity: 0.8,
  shadowDarkness: 0.25,   // 0 = middle colour, 1 = the shadow colour
  // Finer controls, applied by applyAcrylicTuning() after the skin is painted.
  gradient: 'linear',      // 'auto' keeps the skin's own; 'radial' or 'linear'
  angle: 80,             // linear direction in degrees, 90 = top to bottom
  centerX: 0.75, centerY: 0.46, radius: 1.11,
  stopMid: 0.71, stopEdge: 0.96,
  depthStart: 0.59,       // where the edge darkening begins, 0..1 from the middle
  bandColor: '',         // bevel colour; empty = a lighter version of the top colour
  bandBlur: 6.2,
  lineInset: 0.855, lineWidth: 4.4, lineBlur: 0, lineAngle: 250, lineOffsetX: 0, lineOffsetY: 0,
  // Five colour stops along the inner line; an empty colour is a light tint of
  // the skin, never a dark one.
  line1Pos: 0.64, line1Color: '#ffffff', line1Opacity: 0.29,
  line2Pos: 0.36, line2Color: '', line2Opacity: 0,
  line3Pos: 0.43, line3Color: '', line3Opacity: 0.67,
  line4Pos: 0.51, line4Color: '', line4Opacity: 0.95,
  line5Pos: 0.68, line5Color: '', line5Opacity: 0,
  lineFollow: false,     // turn the line's bright end toward the light
  glintInset: 0.82, glintBlur: 0, glintColor: '#ffffff', glintAngle: 40, glintFollow: 0,
  glintOffsetX: 0, glintOffsetY: 0, glintDash: 30.5, glintGap: 14.5,
  upperStart: 0, upperEnd: 0.19, lowerStart: 0.81, lowerEnd: 1,
  glintMiddle: 0, middleStart: 1, middleEnd: 0.02,
  rimOpacity: 0, rimWidth: 0, rimColor: '#ffffff',
  topGloss: 0, topReach: 0.32, topBlur: 3.4,
  // sideTone: positive lightens the side wall, negative darkens it.
  sideThickness: 0, sideTone: 0.45, sideOpacity: 0.75, sideColor: '',
  // sideLineTone: 1 = white, 0 = the skin colour, -1 = the darkest tone.
  sideLine: 0.85, sideLineTone: 1, sideLineColor: '', sideLineWidth: 2.4,
  // The edge line is a copy of the head outline: scale and move it freely,
  // choose where along the edge it shows, and fade its ends.
  sideLineScaleX: 1, sideLineScaleY: 1, sideLineX: 0, sideLineY: 0,
  sideLineFrom: .7, sideLineTo: 1, sideLineFade: .12, sideLineSideFade: 0,
  sideLineBlur: 0, sideLineDash: 0, sideLineGap: 0, sideLineCap: 'round',
  eyeColor: '#ffffff', eyeOpacity: 1, eyeLitPart: 0.34, eyeRimWidth: 0, eyeRimOpacity: 1,
  shadowColor: '', shadowSpread: 0.3, shadowFollow: true, shadowAngle: 135,
  // Antenna sphere.
  antennaLight: '', antennaMid: '', antennaDark: '',   // empty = from the skin colours
  antennaHighlight: .9, antennaHighlightSize: .22,     // white spot on the sphere
  antennaHighlightX: .3, antennaHighlightY: .25, antennaFollow: true,
  antennaOpacity: 1, antennaSize: 1,
  antennaRimColor: '#ffffff', antennaRimWidth: 0, antennaRimOpacity: .6,
  // Highlight on the eyes, in each eye's own units (the eye is about 54 wide).
  // Eyes stay plain unless a look adds its own highlight.
  eyeHighlight: 0, eyeHighlightSize: 7, eyeHighlightSoft: .75,
  eyeHighlightX: -9, eyeHighlightY: -10, eyeHighlightFollow: 6,
  eyeSpark: 0, eyeSparkSize: 3.5, eyeSparkX: 8, eyeSparkY: 9,
});
function tunedAcrylic(look, own) {
  // An avatar with its own tuning is fixed: the page-wide config (the tuner's
  // live sliders) never reaches it, so editing one look leaves the others alone.
  const tune = { ...ACRYLIC_DEFAULTS, ...own };
  const base = Array.isArray(tune.colors) && tune.colors.length === 4 ? tune.colors : look.base;
  return { ...look, base, antenna: [base[0], base[1], base[3]], linear: tune.vertical ? 'vertical' : look.linear, shade: tune.depth, tune };
}

// Applies the fine acrylic controls on top of the painted skin.
function applyAcrylicTuning(skin, look) {
  const t = look.tune, base = look.base, p = skin.sheenParts, defs = skin.defs;
  const white = '#ffffff';
  const replace = (id, tag, attrs, stops) => {
    defs.querySelector(`#${id}`)?.remove();
    return gradient(defs, tag, id, attrs, stops.sort((a, b) => a[0] - b[0]).map(([o, c, a]) => [Math.min(1, Math.max(0, o)), c, a]));
  };
  // Layers and filters that would not change the picture are left out, so a
  // look only pays for what it actually uses.
  const softly = (node, id, std) => {
    defs.querySelector(`#${id}`)?.remove();
    if (!(std > 0)) { node.removeAttribute('filter'); return; }
    defs.insertAdjacentHTML('beforeend', `<filter id="${id}" filterUnits="userSpaceOnUse" x="-30" y="-30" width="300" height="300"><feGaussianBlur stdDeviation="${std}"/></filter>`);
    node.setAttribute('filter', `url(#${id})`);
  };
  const show = (node, on) => { node.style.display = on ? '' : 'none'; };
  const inset = k => `translate(${120 * (1 - k)} ${120 * (1 - k)}) scale(${k}) ${skin.headTransform}`;

  // Body colour.
  if (t.gradient !== 'auto') {
    const stops = [[0, base[0]], [t.stopMid, base[1]], [t.stopEdge, base[2]], [1, base[2]]];
    if (t.gradient === 'linear') {
      const a = t.angle * Math.PI / 180, dx = Math.cos(a) / 2, dy = Math.sin(a) / 2;
      skin.parts.base = replace('skin-base', 'linearGradient', { x1: .5 - dx, y1: .5 - dy, x2: .5 + dx, y2: .5 + dy }, stops);
    } else {
      skin.parts.base = replace('skin-base', 'radialGradient', { cx: t.centerX, cy: t.centerY, r: t.radius }, stops);
    }
    skin.tunedBase = true;
  }
  skin.parts.volume = replace('skin-volume', 'radialGradient', { cx: '.43', cy: '.30', r: '.76' },
    [[0, base[3], 0], [t.depthStart, base[3], 0], [1, base[3], t.depth]]);
  show(skin.layers.children[1], t.depth > 0);
  show(p.face, t.faceGlow > 0);

  // Bevel band.
  const [band, line, glint] = p.bevel.children;
  const bandColor = t.bandColor || mixHex(base[0], white, t.bandLight);
  const bandTop = t.bandColor || mixHex(base[0], white, Math.min(1, t.bandLight * 2));
  replace('skin-sheen-band', 'linearGradient', { x1: '0', y1: '0', x2: '0', y2: '1' },
    [[0, bandTop, t.bandOpacity * 1.2], [.06, bandColor, t.bandOpacity], [.5, bandColor, t.bandMiddle], [.94, bandColor, t.bandOpacity], [1, bandTop, t.bandOpacity * 1.3]]);
  p.bevel.removeAttribute('filter');
  band.setAttribute('stroke-width', String(t.bandWidth));
  softly(band, 'skin-band-blur', t.bandBlur);
  show(band, t.bandWidth > 0 && (t.bandOpacity > 0 || t.bandMiddle > 0));

  // Inner bevel line.
  // A gradient axis through the middle of the head at the given angle; k keeps
  // 135 degrees running exactly from the top-right corner to the bottom-left.
  const axis = degrees => {
    const a = degrees * Math.PI / 180, k = Math.SQRT1_2;
    return { x1: .5 - Math.cos(a) * k, y1: .5 - Math.sin(a) * k, x2: .5 + Math.cos(a) * k, y2: .5 + Math.sin(a) * k };
  };
  const tint = mixHex(base[0], white, .5);
  skin.lineGradient = replace('skin-sheen-line', 'linearGradient', axis(t.lineAngle),
    [1, 2, 3, 4, 5].map(i => [t[`line${i}Pos`], t[`line${i}Color`] || tint, t[`line${i}Opacity`]]));
  skin.lineFollow = t.lineFollow;
  line.style.display = t.lineOpacity > 0 ? '' : 'none';
  line.setAttribute('transform', `translate(${t.lineOffsetX} ${t.lineOffsetY}) ${inset(t.lineInset)}`);
  line.setAttribute('stroke-width', String(t.lineWidth));
  line.setAttribute('opacity', String(t.lineOpacity));
  softly(line, 'skin-line-blur', t.lineBlur);
  if (t.lineWidth <= 0 || [1, 2, 3, 4, 5].every(i => !(t[`line${i}Opacity`] > 0))) show(line, false);

  // White glints: one stretch on the upper right, one along the bottom.
  // Up to three stretches of glint along the gradient axis: upper, middle, lower.
  const g = t.glintColor;
  const stretch = (start, end, bright) => bright > 0 && end > start
    ? [[start, g, 0], [Math.min(end, start + .06), g, bright], [Math.max(start + .06, end - .06), g, bright * .9], [end, g, 0]]
    : [];
  replace('skin-sheen-glint', 'linearGradient', axis(t.glintAngle), [
    [0, g, 0], ...stretch(t.upperStart, t.upperEnd, t.glintUpper), ...stretch(t.middleStart, t.middleEnd, t.glintMiddle),
    ...stretch(t.lowerStart, t.lowerEnd, t.glintLower), [1, g, 0],
  ]);
  skin.glintTransform = `translate(${t.glintOffsetX} ${t.glintOffsetY}) ${inset(t.glintInset)}`;
  skin.glintFollow = t.glintFollow;
  glint.setAttribute('transform', skin.glintTransform);
  glint.setAttribute('stroke-width', String(t.glintWidth));
  softly(glint, 'skin-glint-blur', t.glintBlur);
  show(glint, t.glintWidth > 0 && (t.glintUpper > 0 || t.glintMiddle > 0 || t.glintLower > 0));
  if (t.glintDash > 0) glint.setAttribute('stroke-dasharray', `${t.glintDash} ${t.glintGap}`);
  else glint.removeAttribute('stroke-dasharray');

  // Outer rim line.
  const rim = skin.layers.children[3];
  rim.style.display = t.rimOpacity > 0 ? '' : 'none';
  rim.setAttribute('stroke', t.rimColor);
  rim.setAttribute('stroke-width', String(t.rimWidth));
  rim.setAttribute('opacity', String(t.rimOpacity));

  // Gloss band across the top.
  p.top.style.display = t.topGloss > 0 ? '' : 'none';
  replace('skin-sheen-top', 'linearGradient', { x1: '0', y1: '0', x2: '0', y2: '1' },
    [[0, white, t.topGloss], [t.topReach * .5, white, t.topGloss * .45], [t.topReach, white, 0], [1, white, 0]]);
  softly(p.top, 'skin-top-blur', t.topBlur);

  // Side wall along the bottom.
  p.side.style.display = t.sideThickness > 0 ? '' : 'none';
  const lifted = `translate(0 ${-t.sideThickness}) ${skin.headTransform}`;
  skin.sideMaskShape.setAttribute('transform', lifted);
  // Scale the line about the head centre, then move it.
  const sx = t.sideLineScaleX, sy = t.sideLineScaleY;
  skin.sideLine.setAttribute('transform', `translate(${t.sideLineX} ${t.sideLineY - t.sideThickness}) translate(${120 * (1 - sx)} ${120 * (1 - sy)}) scale(${sx} ${sy}) ${skin.headTransform}`);
  skin.sideLine.setAttribute('stroke-width', String(t.sideLineWidth / Math.sqrt(sx * sy)));
  skin.sideLine.setAttribute('stroke-linecap', t.sideLineCap);
  if (t.sideLineDash > 0) skin.sideLine.setAttribute('stroke-dasharray', `${t.sideLineDash} ${t.sideLineGap}`);
  else skin.sideLine.removeAttribute('stroke-dasharray');
  softly(skin.sideLine, 'skin-sideline-blur', t.sideLineBlur);
  show(skin.sideLine, t.sideLine > 0 && t.sideLineWidth > 0);
  const black = '#000000';
  // Older saved looks used sideLight (always lighter).
  const tone = t.sideTone ?? t.sideLight ?? .45;
  const shade = (color, k) => tone >= 0 ? mixHex(color, white, tone * k) : mixHex(color, black, -tone * k);
  const wall = t.sideColor ? [t.sideColor, t.sideColor, t.sideColor] : [shade(base[0], 1), shade(base[2], 1), shade(base[3], .8)];
  replace('skin-side-fill', 'linearGradient', { x1: '0', y1: '0', x2: '1', y2: '0' },
    [[0, wall[0], t.sideOpacity], [.5, wall[1], t.sideOpacity * .93], [1, wall[2], Math.min(1, t.sideOpacity * 1.07)]]);
  const lt = t.sideLineTone;
  const lineColor = t.sideLineColor || (lt >= 0 ? mixHex(base[1], white, lt) : mixHex(base[1], mixHex(base[3], black, .4), -lt));
  // Vertical range: visible from sideLineFrom to sideLineTo (0 = top, 1 = bottom),
  // fading in over sideLineFade.
  const from = Math.min(t.sideLineFrom, t.sideLineTo), to = Math.max(t.sideLineFrom, t.sideLineTo);
  const fade = Math.min(t.sideLineFade, (to - from) / 2);
  replace('skin-side-line', 'linearGradient', { x1: '0', y1: '0', x2: '0', y2: '1' },
    [[0, lineColor, 0], [from, lineColor, 0], [from + fade, lineColor, t.sideLine], [to - fade, lineColor, t.sideLine], [to, lineColor, 0], [1, lineColor, 0]]);
  // Fade toward the left and right sides with a mask.
  defs.querySelector('#skin-sideline-mask')?.remove();
  defs.querySelector('#skin-sideline-mask-grad')?.remove();
  if (t.sideLineSideFade > 0) {
    const f = Math.min(.5, t.sideLineSideFade);
    gradient(defs, 'linearGradient', 'skin-sideline-mask-grad', { x1: '0', y1: '0', x2: '1', y2: '0' },
      [[0, white, 0], [f, white, 1], [1 - f, white, 1], [1, white, 0]]);
    defs.insertAdjacentHTML('beforeend', '<mask id="skin-sideline-mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="-20" y="-20" width="280" height="280"><rect x="20" y="-20" width="200" height="280" fill="url(#skin-sideline-mask-grad)"/></mask>');
    skin.sideLine.setAttribute('mask', 'url(#skin-sideline-mask)');
  } else skin.sideLine.removeAttribute('mask');

  // Eyes.
  skin.parts.eyeGlass = replace('skin-eye-glass', 'linearGradient', { x1: '1', y1: '0', x2: '0', y2: '1' },
    [[0, t.eyeColor], [t.eyeLitPart, t.eyeColor], [1, mixHex(t.eyeColor, base[1], t.eyeTint)]]);
  skin.style.textContent += `
    #leftBase,#rightBase,#leftInputBase,#rightInputBase{fill-opacity:${t.eyeOpacity};${t.eyeRimWidth > 0 ? `stroke:rgba(255,255,255,${t.eyeRimOpacity});stroke-width:${t.eyeRimWidth}px;` : ''}}`;

  // Eye shadow.
  defs.querySelector('#skin-eye-sink')?.remove();
  const shadowColor = t.shadowColor || mixHex(base[2], base[3], t.shadowDarkness);
  defs.insertAdjacentHTML('beforeend', `<filter id="skin-eye-sink" filterUnits="userSpaceOnUse" x="-90" y="-90" width="180" height="180">`
    + `<feMorphology in="SourceAlpha" operator="dilate" radius="${t.shadowSpread}" result="m"/>`
    + `<feOffset id="skin-eye-sink-offset" in="m" dx="0" dy="0" result="o"/><feGaussianBlur in="o" stdDeviation="${t.shadowBlur}" result="b"/>`
    + `<feFlood flood-color="${shadowColor}" flood-opacity="${t.shadowOpacity}"/><feComposite in2="b" operator="in" result="s"/>`
    + `<feGaussianBlur in="SourceGraphic" stdDeviation="${t.eyeSoftness}" result="g"/><feMerge><feMergeNode in="s"/><feMergeNode in="g"/></feMerge></filter>`);
  skin.parts.eyeSink = defs.querySelector('#skin-eye-sink-offset');
  if (!(t.shadowOpacity > 0) && !(t.eyeSoftness > 0)) {
    for (const group of skin.eyeGroups) group.removeAttribute('filter');
    skin.parts.eyeSink = null;
  }
  skin.fixedShadowAngle = t.shadowFollow ? null : t.shadowAngle;
  skin.shadowDistance = t.shadowDistance;

  // Eye highlight and a smaller spark, both drifting toward the light.
  const showHighlight = t.eyeHighlight > 0 || t.eyeSpark > 0;
  for (const layer of skin.eyeHighlights) layer.style.display = showHighlight ? '' : 'none';
  if (showHighlight) {
    const highlight = replace('skin-eye-hl', 'radialGradient', { gradientUnits: 'userSpaceOnUse', cx: t.eyeHighlightX, cy: t.eyeHighlightY, r: t.eyeHighlightSize },
      [[0, white, t.eyeHighlight], [t.eyeHighlightSoft, white, t.eyeHighlight], [1, white, 0]]);
    const spark = replace('skin-eye-spark', 'radialGradient', { gradientUnits: 'userSpaceOnUse', cx: t.eyeSparkX, cy: t.eyeSparkY, r: t.eyeSparkSize },
      [[0, white, t.eyeSpark], [.4, white, t.eyeSpark], [1, white, 0]]);
    skin.eyeHighlight = { highlight, spark, t };
  }

  // Antenna sphere.
  const sphere = [t.antennaLight || base[0], t.antennaMid || base[1], t.antennaDark || base[3]];
  skin.parts.antenna = replace('skin-antenna', 'radialGradient', { cx: t.antennaHighlightX, cy: t.antennaHighlightY, r: '.85' },
    [[0, white, t.antennaHighlight], [t.antennaHighlightSize * .5, mixHex(sphere[0], white, t.antennaHighlight * .6), 1], [t.antennaHighlightSize, sphere[0], 1], [.5, sphere[1], 1], [1, sphere[2], 1]]);
  skin.antennaFixed = !t.antennaFollow;
  skin.style.textContent += `
    #antennaDot{fill:url(#skin-antenna);fill-opacity:${t.antennaOpacity};${t.antennaRimWidth > 0 ? `stroke:${t.antennaRimColor};stroke-width:${t.antennaRimWidth}px;stroke-opacity:${t.antennaRimOpacity};` : 'stroke:none;'}${t.antennaSize !== 1 ? `transform-box:fill-box;transform-origin:center;scale:${t.antennaSize};` : ''}}`;
}

// Mixes two #rrggbb colours; t = 0 keeps the first.
function mixHex(a, b, t) {
  const channel = (hex, i) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  return '#' + [0, 1, 2].map(i => Math.round(channel(a, i) * (1 - t) + channel(b, i) * t).toString(16).padStart(2, '0')).join('');
}
function saturation(hex) {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(...c), min = Math.min(...c);
  return max === 0 ? 0 : (max - min) / max;
}
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

// The eyelids are rectangles painted in the head color over the eyes. A skin
// paints the head with gradients, so a flat lid would show as a patch. Moving
// the lids into a mask lets them cut the eyes instead, and the skin shows
// through. With a flat head color this looks exactly like the original.
export function maskEyelids(instance) {
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

  const defs = svg('g', { id: 'skinDefs' });
  root.querySelector('defs').append(defs);
  const layers = svg('g', { 'pointer-events': 'none', 'aria-hidden': 'true' });
  const shape = { href: '#headShape', transform: head.getAttribute('transform') };
  // A printed pattern sits on the base paint, under the shine and shading.
  const pattern = svg('use', { ...shape, fill: 'url(#skin-pattern)', 'pointer-events': 'none' });
  head.after(pattern, layers);
  for (const paint of ['shine', 'volume', 'edge']) svg('use', { ...shape, fill: `url(#skin-${paint})` }, layers);
  svg('use', { ...shape, fill: 'none', stroke: 'url(#skin-rim)', 'stroke-width': 1.25 }, layers);
  // Balls get extra round shading: darker toward the edge and a small hot spot.
  const ball = svg('g', {}, layers);
  for (const paint of ['ball-shade', 'ball-hot']) svg('use', { ...shape, fill: `url(#skin-${paint})` }, ball);
  // Glossy sheen: copies of the head outline drawn a little inside it, faded so
  // only a band under the top edge and a faint one above the bottom remain. They
  // are the head's own shape, so they bend with every squeeze and drag.
  const sheen = svg('g', { 'clip-path': 'url(#headClip)' }, layers);
  const inset = scale => `translate(${120 * (1 - scale)} ${120 * (1 - scale)}) scale(${scale}) ${shape.transform}`;
  const glow = svg('use', { href: '#headShape', transform: shape.transform, fill: 'url(#skin-sheen-glow)' }, sheen);
  const face = svg('use', { href: '#headShape', transform: shape.transform, fill: 'url(#skin-sheen-face)' }, sheen);
  // Slab bevel: a light band just inside the edge, a bevel line, and glints.
  const bevel = svg('g', {}, sheen);
  svg('use', { href: '#headShape', transform: shape.transform, fill: 'none', stroke: 'url(#skin-sheen-band)', 'stroke-width': 26 }, bevel);
  const bevelLine = svg('use', { href: '#headShape', transform: inset(.865), fill: 'none', stroke: 'url(#skin-sheen-line)', 'stroke-width': 1.6 }, bevel);
  svg('use', { href: '#headShape', transform: inset(.955), fill: 'none', stroke: 'url(#skin-sheen-glint)', 'stroke-width': 3.2, 'stroke-linecap': 'round' }, bevel);
  // Side wall of a thick slab: the strip between the head outline and the same
  // outline lifted a little, so its upper edge follows the curve of the face.
  const lifted = `translate(0 -13) ${shape.transform}`;
  const sideMask = svg('mask', { id: 'skin-side-mask', maskUnits: 'userSpaceOnUse', maskContentUnits: 'userSpaceOnUse', x: -20, y: -20, width: 280, height: 280 }, root.querySelector('defs'));
  svg('rect', { x: -20, y: -20, width: 280, height: 280, fill: '#fff' }, sideMask);
  const sideMaskShape = svg('use', { href: '#headShape', transform: lifted, fill: '#000' }, sideMask);
  const side = svg('g', {}, sheen);
  svg('use', { href: '#headShape', transform: shape.transform, fill: 'url(#skin-side-fill)', mask: 'url(#skin-side-mask)' }, side);
  const sideLine = svg('use', { href: '#headShape', transform: lifted, fill: 'none', stroke: 'url(#skin-side-line)', 'stroke-width': 2.4 }, side);
  // The reflections drift with the light inside the head's clip.
  const moving = svg('g', {}, sheen);
  const sheenParts = {
    glow,
    face,
    bevel,
    bevelLine,
    side,
    moving,
    top: svg('use', { href: '#headShape', transform: inset(.9), fill: 'url(#skin-sheen-top)' }, moving),
    bottom: svg('use', { href: '#headShape', transform: inset(.93), fill: 'url(#skin-sheen-bottom)' }, moving),
  };

  const style = document.createElement('style');
  root.append(style);

  // The sink shadow goes on the whole eye group, outside the eyelid mask, so
  // the lids never cut it off.
  const eyeGroups = ['left', 'right'].map(side => root.getElementById(`${side}Eye`)).filter(Boolean);
  // Eye highlights: a highlight layer cut to each eye's own shape, so it follows
  // blinks and expressions and the eyelids still close over it.
  const eyeHighlights = ['left', 'right'].map(side => {
    const paint = root.querySelector(`[mask="url(#skin-${side}-lids)"]`);
    const mask = svg('mask', { id: `skin-${side}-eye-shape`, maskUnits: 'userSpaceOnUse', maskContentUnits: 'userSpaceOnUse', x: -90, y: -90, width: 180, height: 180, style: 'mask-type:alpha' }, root.querySelector('defs'));
    svg('use', { href: `#${side}Base` }, mask);
    const layer = svg('g', { mask: `url(#skin-${side}-eye-shape)`, 'pointer-events': 'none' }, paint);
    svg('rect', { x: -90, y: -90, width: 180, height: 180, fill: 'url(#skin-eye-hl)' }, layer);
    svg('rect', { x: -90, y: -90, width: 180, height: 180, fill: 'url(#skin-eye-spark)' }, layer);
    layer.style.display = 'none';
    return layer;
  });
  // Tuned looks restyle these shared layers; every paint starts from this state.
  const pristine = [pattern, layers, sideMask, ...eyeHighlights].flatMap(node => [node, ...node.querySelectorAll('*')])
    .map(node => [node, [...node.attributes].map(({ name, value }) => [name, value])]);
  return { instance, defs, layers, pattern, ball, sheen, sheenParts, sideMaskShape, sideLine, headTransform: shape.transform, eyeGroups, eyeHighlights, style, pristine, name: null, parts: null, light: { ...REST_LIGHT }, shown: {}, nodes: {}, offsets: {} };
}

function restorePristine(skin) {
  for (const [node, attributes] of skin.pristine) {
    for (const name of node.getAttributeNames()) if (!attributes.some(([n]) => n === name)) node.removeAttribute(name);
    for (const [name, value] of attributes) if (node.getAttribute(name) !== value) node.setAttribute(name, value);
  }
}

function paintSkin(skin, name) {
  const look = SKINS[name].faithful ? tunedAcrylic(SKINS[name], SKINS[name].fixedTune) : SKINS[name];
  const tune = look.tune;
  restorePristine(skin);
  skin.defs.replaceChildren();
  // Balls shade and reflect in their own colours, so a warm ball never picks up
  // a cool grey cast at its edge.
  const dark = look.ball || look.sheen ? look.base[3] : '#091126';
  const reflect = look.ball ? look.base[0] : look.rim;
  skin.parts = {
    base: gradient(skin.defs, look.linear ? 'linearGradient' : 'radialGradient', 'skin-base',
      look.linear === 'vertical' ? { x1: '0', y1: '0', x2: '0', y2: '1' } : look.linear ? { x1: '.05', y1: '.05', x2: '.85', y2: '.98' } : { cx: '.32', cy: '.17', r: '.95' },
      // Faithful acrylic keeps its colour clear right to the edge; the darkest
      // tone is only used for the eye shadow, so the bevel never turns muddy.
      (look.faithful ? [...look.base.slice(0, 3), look.base[2]] : look.base).map((color, index) => [index / 3, color])),
    // A glossy skin narrows the shine into a small, bright specular spot; it is
    // still a fill of the head, so it bends and squashes with it.
    shine: look.spec
      ? gradient(skin.defs, 'radialGradient', 'skin-shine', { cx: '.30', cy: '.12', r: String(look.spec) },
        [[0, '#fff', 1], [.22, '#fff', .9], [.5, '#fff', .28], [.78, '#fff', .05], [1, '#fff', 0]])
      : gradient(skin.defs, 'radialGradient', 'skin-shine', { cx: '.30', cy: '.12', r: '.70' },
        [[0, '#fff', look.shine], [.23, '#fff', look.shine * .30], [.65, '#fff', .035], [1, '#fff', 0]]),
    volume: gradient(skin.defs, 'radialGradient', 'skin-volume', { cx: '.43', cy: '.30', r: '.76' },
      [[0, dark, 0], [.58, dark, 0], [.82, dark, look.shade * .27], [1, dark, look.shade]]),
    rim: gradient(skin.defs, 'linearGradient', 'skin-rim', { x1: '0', y1: '0', x2: '1', y2: '1' },
      [[0, '#fff', .95], [.28, look.rim, .60], [.52, look.rim, .06], [.82, look.rim, .13], [1, look.rim, .65]]),
    edge: gradient(skin.defs, 'radialGradient', 'skin-edge', { cx: '.88', cy: '.83', r: '.5' },
      [[0, reflect, look.spec ? .7 : .5], [.45, reflect, look.spec ? .24 : .16], [1, reflect, 0]]),
    antenna: gradient(skin.defs, 'radialGradient', 'skin-antenna', { cx: '.28', cy: '.20', r: '.85' },
      [[0, look.antenna[0]], [.43, look.antenna[1]], [1, look.antenna[2]]]),
  };
  if (look.ball) {
    gradient(skin.defs, 'radialGradient', 'skin-ball-shade', { cx: '.46', cy: '.4', r: '.74' },
      [[0, dark, 0], [.55, dark, 0], [.84, dark, .2], [1, dark, .5]]);
    skin.parts.hot = gradient(skin.defs, 'radialGradient', 'skin-ball-hot', { cx: '.32', cy: '.22', r: '.2' },
      [[0, '#ffffff', .62], [.45, '#ffffff', .22], [1, '#ffffff', 0]]);
  }
  skin.ball.style.display = look.ball ? '' : 'none';
  // A plain skin keeps only the base paint and its shading, with no highlight,
  // reflection or rim, as a clean starting point for hand-drawn highlights.
  const [shineLayer, , edgeLayer, rimLayer] = skin.layers.children;
  for (const node of [shineLayer, edgeLayer, rimLayer]) node.style.display = look.plain ? 'none' : '';
  if (look.plain && skin.parts.hot) skin.ball.lastElementChild.style.display = 'none';
  else if (skin.ball.lastElementChild) skin.ball.lastElementChild.style.display = '';

  const sheen = look.sheen ? SHEENS[look.sheen] : null;
  if (sheen) {
    // Pure white over a strong colour washes it toward grey, so coloured skins
    // reflect a light tint of their own colour; neutral ones stay white.
    const tinted = saturation(look.base[1]) > .35;
    const light = tinted ? mixHex('#ffffff', look.base[0], .28) : '#ffffff';
    const topAlpha = look.wet ? .62 : look.bright ? .5 : sheen.top;
    const bounce = tinted ? mixHex('#ffffff', look.base[0], .5) : '#ffffff';
    gradient(skin.defs, 'linearGradient', 'skin-sheen-top', { x1: '0', y1: '0', x2: '0', y2: '1' },
      [[0, light, topAlpha], [sheen.reach * .6, light, topAlpha * .45], [sheen.reach * .93, light, topAlpha * .2], [sheen.reach, light, 0], [1, light, 0]]);
    gradient(skin.defs, 'linearGradient', 'skin-sheen-bottom', { x1: '0', y1: '0', x2: '0', y2: '1' },
      [[0, bounce, 0], [.8, bounce, 0], [.94, bounce, sheen.bottom * .6], [1, bounce, sheen.bottom]]);
    if (sheen.slab) {
      // The bevel is lighter at the top and bottom, where the edge turns toward
      // the light and toward the bright floor; glints sit on the upper left and
      // the right side.
      const edge = look.metal ? '#ffffff' : mixHex('#ffffff', look.base[0], .45);
      // Metal is a mirror: the top of the bevel catches the sky, the lower bevel
      // falls into a dark band, and its very lip reflects the bright floor.
      gradient(skin.defs, 'linearGradient', 'skin-sheen-band', { x1: '0', y1: '0', x2: '0', y2: '1' }, look.metal
        ? [[0, '#ffffff', .95], [.07, '#ffffff', .7], [.16, '#ffffff', .12], [.5, '#ffffff', 0], [.8, look.base[3], .2], [.9, look.base[3], .75], [.955, look.base[3], .5], [.985, '#ffffff', .9], [1, '#ffffff', .95]]
        : [[0, edge, .55], [.3, edge, .22], [.7, edge, .16], [1, edge, .48]]);
      if (look.acrylic) {
        // Acrylic: a deep colour whose edges are lit through the material, with a
        // bright lip along the bottom; the middle sits a little darker.
        const lit = mixHex('#ffffff', look.base[0], .4);
        gradient(skin.defs, 'linearGradient', 'skin-sheen-band', { x1: '0', y1: '0', x2: '0', y2: '1' },
          look.faithful
            // Pale white over a strong colour reads as grey, so the bevel is lit
            // with a lighter, still saturated version of the colour itself.
            ? [[0, mixHex(look.base[0], '#ffffff', tune.bandLight * 2), tune.bandOpacity * 1.2], [.06, mixHex(look.base[0], '#ffffff', tune.bandLight), tune.bandOpacity], [.5, mixHex(look.base[0], '#ffffff', tune.bandLight * .8), tune.bandMiddle], [.94, mixHex(look.base[0], '#ffffff', tune.bandLight), tune.bandOpacity], [1, mixHex(look.base[0], '#ffffff', tune.bandLight * 2), tune.bandOpacity * 1.3]]
            : look.wet
              ? [[0, mixHex(look.base[0], '#ffffff', .6), .75], [.15, mixHex(look.base[0], '#ffffff', .45), .55], [.5, mixHex(look.base[1], '#ffffff', .4), .45], [.85, mixHex(look.base[2], '#ffffff', .45), .55], [1, mixHex(look.base[3], '#ffffff', .6), .8]]
              : look.bright
              ? [[0, '#ffffff', .75], [.1, lit, .5], [.3, lit, .22], [.7, lit, .26], [.9, '#ffffff', .75], [1, '#ffffff', .95]]
              : [[0, lit, .55], [.12, lit, .25], [.5, lit, .08], [.8, lit, .16], [.93, lit, .7], [1, lit, .9]]);
        if (look.wet) {
          gradient(skin.defs, 'radialGradient', 'skin-sheen-face', { cx: '.5', cy: '.55', r: '.5' },
            [[0, look.base[3], .32], [.6, look.base[3], .16], [1, look.base[3], 0]]);
        } else if (look.faithful) {
          gradient(skin.defs, 'radialGradient', 'skin-sheen-face', { cx: String(tune.faceX), cy: String(tune.faceY), r: String(tune.faceSize) },
            [[0, '#ffffff', tune.faceGlow], [1, '#ffffff', 0]]);
        } else {
          gradient(skin.defs, 'radialGradient', 'skin-sheen-face', { cx: '.5', cy: '.48', r: '.6' },
            [[0, look.base[3], .14], [.7, look.base[3], .05], [1, look.base[3], 0]]);
        }
        // The eyes sit under the acrylic: a soft coloured shadow falls to the
        // lower left, and their lower edge picks up a tint of the colour.
        skin.parts.eyeGlass = gradient(skin.defs, 'linearGradient', 'skin-eye-glass', { x1: '1', y1: '0', x2: '0', y2: '1' },
          look.wet
            ? [[0, '#ffffff'], [.3, mixHex('#ffffff', look.base[1], .1)], [.75, mixHex('#ffffff', look.base[1], .32)], [1, mixHex('#ffffff', look.base[1], .5)]]
            : look.faithful
            ? [[0, '#ffffff'], [.55, '#ffffff'], [1, mixHex('#ffffff', look.base[1], tune.eyeTint)]]
            : [[0, '#ffffff'], [.38, '#ffffff'], [.72, mixHex('#ffffff', look.base[1], .25)], [1, mixHex('#ffffff', look.base[1], .6)]]);
        skin.defs.insertAdjacentHTML('beforeend', `<filter id="skin-soft-edge" filterUnits="userSpaceOnUse" x="-20" y="-20" width="280" height="280"><feGaussianBlur stdDeviation="${look.wet ? 6 : look.faithful ? tune.edgeBlur : look.bright ? 1.1 : 2.6}"/></filter>`);
        skin.defs.insertAdjacentHTML('beforeend', '<filter id="skin-soft-top" filterUnits="userSpaceOnUse" x="-20" y="-20" width="280" height="280"><feGaussianBlur stdDeviation="4"/></filter>');
        skin.defs.insertAdjacentHTML('beforeend', `<filter id="skin-eye-sink" filterUnits="userSpaceOnUse" x="-90" y="-90" width="180" height="180"><feOffset id="skin-eye-sink-offset" in="SourceAlpha" dx="-6" dy="8" result="o"/><feGaussianBlur in="o" stdDeviation="${look.faithful ? tune.shadowBlur : look.wet ? 3 : 6}" result="b"/><feFlood flood-color="${look.faithful ? mixHex(look.base[2], look.base[3], tune.shadowDarkness) : look.base[3]}" flood-opacity="${look.faithful ? tune.shadowOpacity : look.wet ? .45 : .8}"/><feComposite in2="b" operator="in" result="s"/><feGaussianBlur in="SourceGraphic" stdDeviation="${look.faithful ? tune.eyeSoftness : 0}" result="g"/><feMerge><feMergeNode in="s"/><feMergeNode in="g"/></feMerge></filter>`);
        skin.parts.eyeSink = skin.defs.querySelector('#skin-eye-sink-offset');
      }
      if (look.metal) {
        // A directional face: bright at the upper left, darker toward the lower right.
        gradient(skin.defs, 'linearGradient', 'skin-sheen-face', { x1: '.15', y1: '.05', x2: '.85', y2: '.95' },
          [[0, '#ffffff', .75], [.35, '#ffffff', .18], [.6, look.base[3], .12], [1, look.base[3], .42]]);
      }
      gradient(skin.defs, 'linearGradient', 'skin-sheen-line', { x1: '0', y1: '0', x2: '0', y2: '1' },
        [[0, '#ffffff', .55], [.5, look.faithful ? look.base[2] : look.base[3], .25], [1, look.faithful ? mixHex(look.base[0], '#ffffff', .5) : '#ffffff', .35]]);
      gradient(skin.defs, 'linearGradient', 'skin-sheen-glint', look.wet ? { x1: '0', y1: '0', x2: '1', y2: '1' } : look.faithful ? { x1: '1', y1: '0', x2: '0', y2: '1' } : { x1: '0', y1: '0', x2: '1', y2: '1' }, look.wet
        ? [[0, '#ffffff', 1], [.3, '#ffffff', .95], [.44, '#ffffff', .5], [.52, '#ffffff', 0], [.8, '#ffffff', 0], [.9, '#ffffff', .7], [1, '#ffffff', .95]]
        : look.faithful
        ? [[0, '#ffffff', 0], [.05, '#ffffff', tune.glintUpper], [.3, '#ffffff', tune.glintUpper * .9], [.4, '#ffffff', 0], [.55, '#ffffff', 0], [.65, '#ffffff', tune.glintLower], [.85, '#ffffff', tune.glintLower * .85], [.95, '#ffffff', 0], [1, '#ffffff', 0]]
        : [[0, '#ffffff', 0], [.08, '#ffffff', .95], [.3, '#ffffff', .9], [.42, '#ffffff', 0], [.6, '#ffffff', 0], [.72, '#ffffff', .85], [.82, '#ffffff', 0], [1, '#ffffff', 0]]);
      if (look.glow) {
        gradient(skin.defs, 'radialGradient', 'skin-sheen-glow', { cx: '.5', cy: '1.02', r: '.62' },
          [[0, look.glow, .85], [.55, look.glow, .3], [1, look.glow, 0]]);
      }
    }
    const p = skin.sheenParts;
    p.bottom.style.display = sheen.bottom ? '' : 'none';
    p.bevel.style.display = sheen.slab ? '' : 'none';
    // Acrylic has no crisp edges: its rim light is soft and has no bevel line.
    p.bevelLine.style.display = look.acrylic && !look.faithful ? 'none' : '';
    p.top.style.display = look.faithful ? 'none' : '';
    const [band] = p.bevel.children;
    if (look.wet) {
      p.bevel.removeAttribute('filter');
      band.setAttribute('filter', 'url(#skin-soft-edge)');
      band.setAttribute('stroke-width', '40');
      p.top.setAttribute('filter', 'url(#skin-soft-top)');
    } else {
      band.removeAttribute('filter');
      band.setAttribute('stroke-width', String(look.faithful ? tune.bandWidth : 26));
      p.bevel.children[2].setAttribute('stroke-width', String(look.faithful ? tune.glintWidth : 3.2));
      p.bevelLine.setAttribute('opacity', String(look.faithful ? tune.lineOpacity : 1));
      p.top.removeAttribute('filter');
      if (look.acrylic) p.bevel.setAttribute('filter', 'url(#skin-soft-edge)');
      else p.bevel.removeAttribute('filter');
    }
    p.glow.style.display = sheen.slab && look.glow ? '' : 'none';
    p.face.style.display = sheen.slab && (look.metal || (look.acrylic && !look.bright)) ? '' : 'none';
    p.side.style.display = 'none';
    if (look.wet) paintGlassJelly(skin, look);

  }
  skin.sheen.style.display = sheen ? '' : 'none';
  skin.shadowDistance = look.faithful ? tune.shadowDistance : 8;
  if (look.pattern) skin.defs.insertAdjacentHTML('beforeend', patternMarkup('skin-pattern', look.pattern));
  skin.pattern.style.display = look.pattern ? '' : 'none';
  skin.shown = {};
  skin.nodes = {};
  skin.offsets = {};
  // On busy patterns a thin ring keeps the eyes readable.
  const ring = look.ring ? `stroke:${look.ring};stroke-width:3px;` : '';
  // The sink shadow goes on each eye's group: WebKit clips a filter set on the
  // eye shape itself to a rectangle.
  for (const group of skin.eyeGroups) {
    if (look.acrylic) group.setAttribute('filter', 'url(#skin-eye-sink)');
    else group.removeAttribute('filter');
  }
  skin.tunedBase = false;
  skin.fixedShadowAngle = null;
  skin.glintFollow = 0;
  skin.lineFollow = false;
  skin.antennaFixed = false;
  skin.eyeHighlight = null;
  for (const layer of skin.eyeHighlights) layer.style.display = 'none';
  skin.style.textContent = `
    #leftBase,#rightBase,#leftInputBase,#rightInputBase{fill:${look.acrylic ? 'url(#skin-eye-glass)' : look.eye};${ring}${look.wet ? 'fill-opacity:.8;stroke:rgba(255,255,255,.95);stroke-width:1.6px;' : ''}}
    #antennaDot{fill:url(#skin-antenna);${look.plain ? '' : `stroke:${look.rim};stroke-width:.7px`}}`;
  if (look.faithful) applyAcrylicTuning(skin, look);
}

// Light-driven attributes are written only when they change. A tuned skin can
// shift any of them by a fixed amount (skin.offsets), which then moves with the
// light instead of being overwritten by it.
function set(skin, node, key, attribute, value) {
  const id = `${key}.${attribute}`;
  skin.nodes[id] = node;
  const text = (value + (skin.offsets[id] || 0)).toFixed(3);
  if (skin.shown[id] === text) return;
  skin.shown[id] = text;
  node.setAttribute(attribute, text);
}

function applyLight(skin, x, y) {
  const { parts } = skin;
  const cx = .5 + x * .30;
  const cy = .30 + y * .17;
  if (!SKINS[skin.name].linear && !skin.tunedBase) {
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
  if (!skin.antennaFixed) {
    set(skin, parts.antenna, 'antenna', 'cx', cx);
    set(skin, parts.antenna, 'antenna', 'cy', Math.max(.1, cy));
  }
  // Eyes set into acrylic: the lit side faces the light and the shaded side and
  // the shadow fall opposite it, so they turn as the pointer moves around.
  if (parts.eyeGlass) {
    // Direction only; how far the pointer is changes nothing. A fixed shadow
    // angle points the shadow one way regardless of the light.
    const len = Math.hypot(x, y) || 1;
    const fixed = skin.fixedShadowAngle;
    const ux = fixed == null ? x / len : -Math.cos(fixed * Math.PI / 180);
    const uy = fixed == null ? y / len : -Math.sin(fixed * Math.PI / 180);
    set(skin, parts.eyeGlass, 'eyeGlass', 'x1', .5 + ux * .5);
    set(skin, parts.eyeGlass, 'eyeGlass', 'y1', .5 + uy * .5);
    set(skin, parts.eyeGlass, 'eyeGlass', 'x2', .5 - ux * .5);
    set(skin, parts.eyeGlass, 'eyeGlass', 'y2', .5 - uy * .5);
    if (parts.eyeSink) {
      set(skin, parts.eyeSink, 'eyeSink', 'dx', -ux * (skin.shadowDistance ?? 8));
      set(skin, parts.eyeSink, 'eyeSink', 'dy', -uy * (skin.shadowDistance ?? 8));
    }
  }
  // Eye highlights slide toward the light; the spark sits opposite.
  if (skin.eyeHighlight) {
    const { highlight, spark, t } = skin.eyeHighlight;
    const dx = (x - REST_LIGHT.x) * t.eyeHighlightFollow, dy = (y - REST_LIGHT.y) * t.eyeHighlightFollow;
    set(skin, highlight, 'eyeHl', 'cx', t.eyeHighlightX + dx);
    set(skin, highlight, 'eyeHl', 'cy', t.eyeHighlightY + dy);
    set(skin, spark, 'eyeSpark', 'cx', t.eyeSparkX - dx);
    set(skin, spark, 'eyeSpark', 'cy', t.eyeSparkY - dy);
  }
  // A following inner line keeps its bright end toward the light.
  if (skin.lineFollow && skin.lineGradient) {
    const len = Math.hypot(x, y) || 1, k = Math.SQRT1_2;
    set(skin, skin.lineGradient, 'line', 'x1', .5 + x / len * k);
    set(skin, skin.lineGradient, 'line', 'y1', .5 + y / len * k);
    set(skin, skin.lineGradient, 'line', 'x2', .5 - x / len * k);
    set(skin, skin.lineGradient, 'line', 'y2', .5 - y / len * k);
  }
  // Tuned glints can slide toward the light.
  if (skin.glintFollow) {
    const glint = skin.sheenParts.bevel.children[2];
    const t = `translate(${((x - REST_LIGHT.x) * skin.glintFollow).toFixed(2)} ${((y - REST_LIGHT.y) * skin.glintFollow).toFixed(2)}) ${skin.glintTransform}`;
    if (skin.shown.glint !== t) { skin.shown.glint = t; glint.setAttribute('transform', t); }
  }
  // The sheen drifts a little with the light.
  if (SKINS[skin.name].sheen) {
    const t = `translate(${((x - REST_LIGHT.x) * 7).toFixed(2)} ${((y - REST_LIGHT.y) * 4).toFixed(2)})`;
    if (skin.shown.sheen !== t) { skin.shown.sheen = t; skin.sheenParts.moving.setAttribute('transform', t); }
  }
  // The hot spot sits in the middle of the shine, so the two read as one highlight.
  if (parts.hot) {
    set(skin, parts.hot, 'hot', 'cx', cx);
    set(skin, parts.hot, 'hot', 'cy', cy - .10);
  }
}

// Shows the named skin, or none, on an avatar. The layers are built on first use
// and kept, so switching skins only repaints them.
export function showNative(instance, name) {
  if (!name && !instance._nativeSkin) return null;
  if (!instance._nativeSkin) instance._nativeSkin = build(instance);
  const skin = instance._nativeSkin;
  if (!skin || skin.name === name) return skin;
  skin.name = name;
  const head = instance._head;
  if (name) {
    paintSkin(skin, name);
    head.setAttribute('fill', 'url(#skin-base)');
    skin.layers.style.display = '';
    applyLight(skin, skin.light.x, skin.light.y);
  } else {
    skin.style.textContent = '';
    for (const group of skin.eyeGroups) group.removeAttribute('filter');
    for (const layer of skin.eyeHighlights) layer.style.display = 'none';
    skin.eyeHighlight = null;
    skin.layers.style.display = 'none';
    skin.pattern.style.display = 'none';
    baseApplyColor.call(instance, instance.getAttribute('color'));
  }
  return skin;
}

export function lightNative(instance, x, y) {
  const skin = instance._nativeSkin;
  if (!skin?.name) return;
  skin.light.x = x;
  skin.light.y = y;
  applyLight(skin, x, y);
}

export { SKINS as NATIVE_SKINS, REST_LIGHT };
