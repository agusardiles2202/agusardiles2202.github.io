const dialog = document.querySelector('#media-dialog')
const dialogTitle = document.querySelector('#media-title')
const dialogImage = document.querySelector('#media-image')

if (typeof dialog.showModal === 'function') {
  document.querySelectorAll('a[data-title]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      event.preventDefault()
      dialogTitle.textContent = link.dataset.title
      dialogImage.alt = link.querySelector('img')?.alt || link.dataset.title
      dialogImage.src = link.href
      dialog.showModal()
    })
  })

  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close()
  })
}
