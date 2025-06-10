const fs = require('fs');
const path = require('path');
const readline = require('readline');

class Task {
  constructor(id, title, status = 'pending') {
    this.id = id;
    this.title = title;
    this.status = status;
  }
  markCompleted() {
    this.status = 'completed';
  }
}

const DATA_FILE = path.join(__dirname, '..', 'data', 'tasks.json');
let nextId = 1;

function loadTasks() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  if (!raw) return [];
  const arr = JSON.parse(raw);
  nextId = arr.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  return arr.map((t) => Object.assign(new Task(t.id, t.title, t.status)));
}

function saveTasks(tasks) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

function showMenu() {
  console.log('\n1. Listar tareas');
  console.log('2. Crear tarea');
  console.log('3. Completar tarea');
  console.log('4. Eliminar tarea');
  console.log('0. Salir');
}

function list(tasks) {
  if (tasks.length === 0) console.log('No hay tareas');
  tasks.forEach((t) => console.log(`${t.id}. ${t.title} [${t.status}]`));
}

function create(tasks, rl) {
  rl.question('Título: ', (title) => {
    tasks.push(new Task(nextId++, title.trim()));
    console.log('Tarea creada');
    menu(tasks, rl);
  });
}

function complete(tasks, rl) {
  rl.question('ID a completar: ', (id) => {
    const task = tasks.find((t) => t.id === parseInt(id));
    if (task) task.markCompleted();
    menu(tasks, rl);
  });
}

function remove(tasks, rl) {
  rl.question('ID a eliminar: ', (id) => {
    const idx = tasks.findIndex((t) => t.id === parseInt(id));
    if (idx >= 0) tasks.splice(idx, 1);
    menu(tasks, rl);
  });
}

function menu(tasks, rl) {
  showMenu();
  rl.question('Opción: ', (ans) => {
    switch (ans.trim()) {
      case '1':
        list(tasks);
        menu(tasks, rl);
        break;
      case '2':
        create(tasks, rl);
        break;
      case '3':
        complete(tasks, rl);
        break;
      case '4':
        remove(tasks, rl);
        break;
      case '0':
        saveTasks(tasks);
        rl.close();
        break;
      default:
        console.log('Opción inválida');
        menu(tasks, rl);
    }
  });
}

function main() {
  const tasks = loadTasks();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  menu(tasks, rl);
  rl.on('close', () => saveTasks(tasks));
}

main();
