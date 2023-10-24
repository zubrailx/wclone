export function loadScript(src: string, onLoad: () => void) {
  let script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.defer = true
  script.onload = onLoad
  document.body.append(script);
}

export function matchesClassNames(pe: Element[], classNames: string[]) {
  let classNames_ = [...classNames]

  if (pe === null) {
    return false;
  }

  for (const elem of pe) {
    const iof = classNames_.indexOf(elem.className);
    if (iof != -1) {
      classNames_.splice(iof, 1);
    }
  }

  return classNames_.length == 0;
}
