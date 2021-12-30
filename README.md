# [Launch LAB curved color system tool ↗︎](https://thure.github.io/cielab-curved-palette/)

A tool which generates accessible sRGB color palettes and themes by drawing bézier curves through CIELAB color space, using an interface based in the LCH cylindrical model.

The tool organizes ‘palettes’ and ‘themes’ into a comprehensive and configurable color system of your design.

## Palettes

In this tool, one color palette is represented as a continuous curve through LAB space.

The tool will draw a configurable curve between `#ffffff` and `#000000` that intersects the key color you provide. The ‘hue torsion’ parameter lets you create a single palette moves through different hues.

## Themes

Multiple curves can be grouped into a theme, where you can set which ranges of your curves to use as backgrounds or foregrounds, and the number of shades to use for each.

The theme page inclues a preview of how foreground shades look against background shades, including information on WCAG contrast ratios and the contrast standard each foreground shade meets on the ranges of backgrounds for a theme.

## Development

1. Run `yarn install`
1. Run `yarn dev`
1. Open your browser to [`localhost:1234`](http://localhost:1234/)
