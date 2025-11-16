// add item to todo list
function addTaskToList(task) {
  const taskList = document.getElementById('task-list');
  const li = document.createElement('li');
  const titleHtml = `<span onclick="toggleTask(${task.id})">${task.title}</span>`;
  const removeButtonHtml = ` <a href="#" id="task-${task.id}" class="remove-btn" onclick="removeTask(${task.id})">🗑️</a>`;
  li.innerHTML = titleHtml + removeButtonHtml;
  taskList.appendChild(li);
}

// submit new task to API
const taskForm = document.getElementById('task-form');
taskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const taskInput = document.getElementById('new-task');
  const taskTitle = taskInput.value.trim();

  if (taskTitle) {
    fetch('/api/v1/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: taskTitle })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Task added:', data);
        taskInput.value = ''; // Clear the input
        addTaskToList(data.task); // Add the new task to the list
      });
  }
});

// Fetch and display tasks
function loadTasks() {
  fetch('/api/v1/tasks')
    .then(response => response.json())
    .then(data => {
      data.tasks.forEach(task => {
        addTaskToList(task);
      });
    });
}

// remove task function
function removeTask(taskId) {
  console.log(`Removing task with ID: ${taskId}`);
  fetch(`/api/v1/tasks/${taskId}`, { method: 'DELETE' })
    .then(response => {
      if (response.ok) {
        document.getElementById(`task-${taskId}`).closest('li').remove();
      }
    });
}

// toggle task function
function toggleTask(taskId) {
  console.log(`Toggling task with ID: ${taskId}`);
  fetch(`/api/v1/tasks/${taskId}`, { method: 'POST' })
    .then(response => {
      if (response.ok) {
        document.getElementById(`task-${taskId}`).closest('li').classList.toggle('completed');
      }
    });
}

// main function calls
loadTasks();