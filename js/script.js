const form = document.getElementById("form")
const taskInput = document.getElementById("task")
const dateInput = document.getElementById("dueDate")
const tableBody = document.getElementById("todo-table")
const deleteAllBtn = document.getElementById("delete-all")

// Nampung state
let todos = getTodos()

function getTodos() {
  return JSON.parse(localStorage.getItem("todos")) || []
}

// Nyimpen state
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos))
}

// Telat apa nggak
function isLate(dueDate) {
  const today = new Date().toISOString().split("T")[0]
  return today > dueDate
}

// Render kalo todo masih kosong
function renderEmptyRow() {
  tableBody.innerHTML = '<tr><td colspan="4">No task found</td></tr>'
  // Ilangin tombol hapus semua kalo belum ada todo
  deleteAllBtn.style.display = "none"
}

// Buat tombol aksi hapus
function createActionButton(index) {
  const button = document.createElement("button")
  button.innerHTML = '<i class="fa-solid fa-trash"></i>'
  button.className = "delete-btn"
  button.onclick = () => deleteTodo(index)
  return button
}

// Render list todo
function renderTodoRow(todo, index) {
  const tr = document.createElement("tr")

  const tdTask = document.createElement("td")
  tdTask.textContent = todo.task

  const tdDate = document.createElement("td")
  tdDate.textContent = todo.dueDate

  const tdStatus = document.createElement("td")
  // Cek Deadline
  tdStatus.textContent = isLate(todo.dueDate) ? "Telat Woee" : "Masih Amannn"
  tdStatus.className = isLate(todo.dueDate) ? "status-late" : "status-ontime"

  const tdAction = document.createElement("td")
  tdAction.appendChild(createActionButton(index))

  tr.append(tdTask, tdDate, tdStatus, tdAction)
  return tr
}

// Render semua todo
function renderTodos() {
  tableBody.innerHTML = ""

  // Render kalo todo masih kosong
  if (todos.length === 0) {
    renderEmptyRow()
    return
  }

  // Munculin tombol hapus semua Kalo ada 1 todo / lebih
  deleteAllBtn.style.display = "block"

  // Tambahin tiap todo item ke table
  todos.forEach((todo, index) =>
    tableBody.appendChild(renderTodoRow(todo, index))
  )
}

// Tambahin todo
function addTodo(task, dueDate) {
  todos.push({ task, dueDate })
  // Janlup selalu render & save ulang tiap ada aksi
  saveTodos()
  renderTodos()
}

// Hapus todo
function deleteTodo(index) {
  todos.splice(index, 1)
  // Janlup selalu render & save ulang tiap ada aksi
  saveTodos()
  renderTodos()
}

// Hapus Semua todo
function deleteAllTodos() {
  // reset localStorage todos
  todos = []
  localStorage.removeItem("todos")
  // render ulang
  renderTodos()
}

// Logic pas di submit
form.addEventListener("submit", (e) => {
  e.preventDefault()

  const task = taskInput.value.trim()
  const dueDate = dateInput.value

  // Validasi Ulang
  if (!task || !dueDate) {
    alert("Silahkan isi nama tugas dan deadline")
    return
  }

  // Tambahin todo
  addTodo(task, dueDate)
  form.reset()
})

// Listener buat tombol hapus semua
deleteAllBtn.addEventListener("click", deleteAllTodos)

// Render Awal
renderTodos()
