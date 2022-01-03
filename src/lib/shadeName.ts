import camelcase from 'camelcase'

function stdName(name: string): string {
  return camelcase(name || 'Untitled')
}

export function defaultShadeName({
  systemName,
  themeName,
  themeKey,
  paletteName,
  shade,
}) {
  return `${stdName(systemName)}--${stdName(themeName)}__${themeKey}--${stdName(
    paletteName
  )}--${shade}`
}
