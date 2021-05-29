# [Launch LCH curved palette tool](https://thure.github.io/cielab-curved-palette/)

A tool which generates accessible sRGB color palettes by drawing bézier curves through CIELAB color space. You supply a key color, and the tool will draw a configurable curve between `#ffffff` and `#000000` that intersects the key color.

## Roadmap

The tool will eventually help to visualize:

- The accessibility of parts of the palette for certain types of content according to WCAG

## Getting started

1. Run `yarn install`
1. Run `yarn dev`
1. Open your browser to [`localhost:1234`](http://localhost:1234/)

## Development

Add a script `.git/hooks/pre-commit` that runs `./scripts/pre-commit.sh` or links to it, and give it execute access.
