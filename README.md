# LAB curved color system tool

A tool which helps generate accessible sRGB color system by drawing bézier curves through CIELAB color space and organizing them into palettes and themes.

## [Open LAB curved color system tool ↗︎](https://thure.github.io/cielab-curved-palette/)

The tool organizes ‘palettes’ and ‘themes’ into a configurable color system of your design.

## Palettes

In this tool, a palette is represented as a continuous curve through
LAB space.

![Screenshot of palette editor](https://i.ibb.co/chhTNnS/ss1.png)

The curve is made of two bézier curves that start at
0L (black) and 100L (white) and meet at the LAB value of the key
color you provide.

You can configure the position of each bézier curve’s control point in
LAB space with the C*CP sliders.

The ‘hue torsion’ parameter lets you create a single palette that moves gradually
through different hues by rotating the control points in LAB space.

## Themes

In this tool, a theme is two collections of palette segments, one for backgrounds and one for foregrounds.

For each palette in a collection there are two controls: one for setting the range of
lightness (L) values in the palette to use, and one for setting the number
of shades. For foreground shades, the minimum assured WCAG contrast
ratio standard that the shade has against all backgrounds in the theme
is shown below the shade.

![Screenshot of theme editor palette selection](https://i.ibb.co/Z60Cwd5/ss2.png)

The theme page also inclues a preview of how foreground shades look against background shades.

![Screenshot of theme editor preview matrix](https://i.ibb.co/0VD8bbm/ss3.png)

## Development

1. Run `yarn install`
1. Run `yarn dev`
1. Open your browser to [`localhost:1234`](http://localhost:1234/)
