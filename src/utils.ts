export function loadScript(src, onLoad) {
  let script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.defer = true
  script.onload = onLoad
  document.body.append(script);
}
