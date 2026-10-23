# Reference module artwork

These project-authored SVG front views replace the generic display housing. Each screen preset selects a specific reference module, not just a driver chip. Manufacturer photos and dimension diagrams were checked on 2026-10-23. Product photos are linked for reference and are not bundled or traced as raster images.

The `viewBox`, board envelope and active-area sizes use millimetres. Active-area offsets, glass edges, flex cables and silkscreen positions are visually reconstructed from the front photographs; they are approximate, not fabrication tolerances or CAD models. Small parts and reflections are simplified. A driver's name alone does not identify the PCB: other suppliers and PCB revisions can look different.

| Frame | Reference module | PCB envelope, mm | Active area, mm | Manufacturer reference |
| --- | --- | --- | --- | --- |
| `waveshare-1.3` | Waveshare 1.3inch LCD Module, SKU 15867 | 45 × 31 | 23.4 × 23.4 | [Product](https://www.waveshare.net/shop/1.3inch-LCD-Module.htm), [outline](https://www.waveshare.net/photo/LCD/1.3inch-LCD-Module/1.3inch-LCD-Module-size.jpg) |
| `waveshare-1.8` | Waveshare 1.8inch LCD Module, SKU 13892 | 56.5 × 34 | 34.5 × 28.3, landscape orientation | [Product](https://www.waveshare.net/shop/1.8inch-LCD-Module.htm), [outline](https://www.waveshare.net/photo/LCD/1.8inch-LCD-Module/1.8inch-LCD-Module-size.jpg) |
| `waveshare-2` | Waveshare 2inch LCD Module, SKU 17344 | 58 × 35 | 40.8 × 30.6, landscape orientation | [Product](https://www.waveshare.net/shop/2inch-LCD-Module.htm), [outline](https://www.waveshare.net/photo/LCD/2inch-LCD-Module/2inch-LCD-Module-size_960.jpg) |
| `waveshare-1.28` | Waveshare 1.28inch LCD Module, SKU 19192 | Ø37.5 body, 40.4 overall height | Ø32.4 | [Product](https://www.waveshare.net/shop/1.28inch-LCD-Module.htm), [outline](https://www.waveshare.net/photo/LCD/1.28inch-LCD-Module/1.28inch-LCD-Module-details-size.jpg) |
| `waveshare-1.14` | Waveshare 1.14inch LCD Module, SKU 18231 | 35 × 32 | 24.91 × 14.86 | [Product](https://www.waveshare.net/shop/1.14inch-LCD-Module.htm), [outline](https://www.waveshare.net/photo/LCD/1.14inch-LCD-Module/1.14inch-LCD-Module-details-size.jpg) |
| `adafruit-326` | Adafruit 0.96-inch 128×64 OLED, PID 326, STEMMA QT PCB | 29.2 × 26.7 | 21.744 × 10.864 | [Product and photographs](https://www.adafruit.com/product/326), [panel specification](https://www.adafruit.com/datasheets/UG-2864HSWEG01.pdf) |
| `adafruit-931` | Adafruit 0.91-inch 128×32 I²C OLED, PID 931, original PCB | 35 × 20 | 22.384 × 5.584 | [Product and photographs](https://www.adafruit.com/product/931), [panel specification](https://cdn-shop.adafruit.com/datasheets/UG-2832HSWEG02.pdf) |

The mini TFT preset rotates the 1.8-inch module 90°. The portrait TFT preset rotates the same 2-inch module used by the landscape preset, including its PCB, holes, glass and labels. The framebuffer itself is rendered in the selected orientation; a frame change never rotates or resamples the native pixels. Custom resolutions use an explicitly generic housing, and the raw eyes canvas has no hardware model.

The viewer scales the entire module together, including the screen opening. Display zoom is a browser preview scale, not a physical-size calibration. Framebuffer resolution, layout, animation and sensor behaviour are unchanged. A module appearance is not a claim of new display-driver support or physical-board verification. Brand/model names identify the references; no manufacturer logo artwork is bundled.

## Generic housings

Presets without a reference module (the boards and kits added after the list above) carry a `board` description in `presets.json`: outline, glass, active-area offset and decorations in millimetres. `board.js` draws them at runtime in the same viewBox convention as these SVG files. Their dimensions are typical values for such boards, not measurements of a specific supplier's PCB, and the viewer labels them as generic outlines.
