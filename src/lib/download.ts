export function download(fileName: string, textContent: string) {
  const el = document.createElement('a')
  el.setAttribute(
    'href',
    `data:application/json;charset=utf-8,${encodeURIComponent(textContent)}`
  )
  el.setAttribute('download', fileName)
  el.click()
}
