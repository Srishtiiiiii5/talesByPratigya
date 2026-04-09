/**
 * Frontend-level content deterrents.
 * NOTE: This is deterrence only — not real DRM.
 */

export function enableContentProtection() {
  // 1. Disable right-click
  const noCtxMenu = (e) => e.preventDefault()
  document.addEventListener('contextmenu', noCtxMenu)

  // 2. Disable copy shortcuts
  const noKeys = (e) => {
    const blocked = (e.ctrlKey || e.metaKey) && ['c', 'C', 'u', 'U', 'a', 'A', 's', 'S', 'p', 'P'].includes(e.key)
    if (blocked) e.preventDefault()
  }
  document.addEventListener('keydown', noKeys)

  // 3. Disable drag-start (prevents drag-to-copy)
  const noDrag = (e) => e.preventDefault()
  document.addEventListener('dragstart', noDrag)

  return () => {
    document.removeEventListener('contextmenu', noCtxMenu)
    document.removeEventListener('keydown', noKeys)
    document.removeEventListener('dragstart', noDrag)
  }
}

export function disableContentProtection() {
  // No-op — cleanup is returned by enableContentProtection
}

/** Apply no-select CSS class to an element */
export function applyProtectedClass(el) {
  if (el) {
    el.classList.add('protected-content')
    el.style.userSelect        = 'none'
    el.style.webkitUserSelect  = 'none'
  }
}

export const WATERMARK_TEXT = '© Tales by Pratigya  |  अनधिकृत उपयोग वर्जित है'
