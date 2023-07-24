// import '../socket.io/socket.io.js'

const taskTemplate = document.querySelector('#task-template')

// If taskTemplate is not present on the page, just ignore and do not listen for task messages.
if (taskTemplate) {
  await import('../socket.io/socket.io.js')

  // Create a socket connection using Socket.IO.

  // 👎 BAD PROGRAMMER, NO DONUT!
  // CAUSE: Does not work with subdirectories.
  // const socket = window.io()

  // 🎉 This should work with any subdirectory.
  const base = document.querySelector('base')
  const path = base
    ? (new URL('socket.io', base.href)).pathname
    : '/socket.io'
  const socket = window.io.connect('/', { path })

  // Listen for "tasks/create" message from the server.
  socket.on('tasks/create', (task) => insertTaskRow(task))
}

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
