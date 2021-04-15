export const isVisible = (target) => {
  if (typeof target === 'string') target = document.querySelector(target)
  const rect = target.getBoundingClientRect()
  target = null
  return (rect.top <= window.innerHeight / 4 * 3) && (rect.bottom >= window.innerHeight / 4)
}

export const isIE = () => {
  const ua = navigator.userAgent
  return /MSIE|Trident/.test(ua)
}

export const dispatchCustomEvent = (evtName, root = document) => {
  let event
  if (typeof (Event) === 'function') {
    event = new Event(evtName)
  } else {
    event = document.createEvent('Event')
    event.initEvent(evtName, true, true)
  }
  root.dispatchEvent(event)
}
