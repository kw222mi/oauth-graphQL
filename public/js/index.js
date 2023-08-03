
const URL_PARAMS = new URLSearchParams(window.location.search)
const TOKEN = URL_PARAMS.get('token')

// Show an element
const show = (selector) => {
  document.querySelector(selector).style.display = 'block'
}

// Hide an element
const hide = (selector) => {
  document.querySelector(selector).style.display = 'none'
}

if (TOKEN) {
  hide('.content.unauthorized')
  show('.content.authorized')
}

const taskTemplate = document.querySelector('#task-template')



/**
 * Inserts a task row at the end of the task table.
 *
 * @param {object} task - The task to add.
 */
function insertTaskRow (task) {
  const taskList = document.querySelector('#task-list')

  // Only add a task if it's not already in the list.
  if (!taskList.querySelector(`[data-id="${task.id}"]`)) {
    const taskNode = taskTemplate.content.cloneNode(true)

    const taskRow = taskNode.querySelector('tr')
    const doneCheck = taskNode.querySelector('input[type=checkbox]')
    const descriptionCell = taskNode.querySelector('td:nth-child(2)')
    const [updateLink, deleteLink] = taskNode.querySelectorAll('a')

    taskRow.setAttribute('data-id', task.id)

    if (task.done) {
      doneCheck.setAttribute('checked', '')
      descriptionCell.classList.add('text-muted')
    } else {
      doneCheck.removeAttribute('checked')
      descriptionCell.classList.remove('text-muted')
    }

    descriptionCell.textContent = task.description

    updateLink.href = `./tasks/${task.id}/update`
    deleteLink.href = `./tasks/${task.id}/delete`

    taskList.append(taskNode)
  }
}
