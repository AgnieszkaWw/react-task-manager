
import { useEffect, useState } from "react";
import TaskList from "./components/TaskList";
import 'bootstrap/dist/css/bootstrap.min.css';

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
};

type Filter = "all" | "completed" | "incomplete";

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch("https://685270d80594059b23cd89b7.mockapi.io/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Błąd ładowania zadań:", err));
  }, []);

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;

    const newTask = {
      title: newTaskTitle,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const res = await fetch("https://685270d80594059b23cd89b7.mockapi.io/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });

    const saved = await res.json();
    setTasks([...tasks, saved]);
    setNewTaskTitle("");
  };

  const toggleTask = async (id: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    const updatedTask = updatedTasks.find((task) => task.id === id);
    if (updatedTask) {
      await fetch(`https://685270d80594059b23cd89b7.mockapi.io/tasks${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
    }
  };

  const deleteTask = async (id: number) => {
    await fetch(`https://685270d80594059b23cd89b7.mockapi.io/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const editTask = async (id: number, newTitle: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, title: newTitle } : task
    );
    setTasks(updatedTasks);

    const updatedTask = updatedTasks.find((task) => task.id === id);
    if (updatedTask) {
      await fetch(`https://685270d80594059b23cd89b7.mockapi.io/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
    }
  };

  const markAllDone = () => {
    const updated = tasks.map(task => ({ ...task, completed: true }));
    setTasks(updated);
  };

  const clearAll = async () => {
  const confirmed = window.confirm("Czy na pewno chcesz usunąć wszystkie zadania?");
  if (!confirmed) return;

  for (const task of tasks) {
    await fetch(`https://685270d80594059b23cd89b7.mockapi.io/tasks/${task.id}`, {
      method: "DELETE",
    });
  }

  setTasks([]);
};
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className={`container mt-5 ${darkMode ? "bg-dark text-light" : "bg-white text-dark"}`}>
      <h1 className="mb-4">📝 Lista zadań</h1>

      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="darkModeSwitch"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
        <label className="form-check-label" htmlFor="darkModeSwitch">
          🌙 Tryb ciemny
        </label>
      </div>

      <div className="input-group mb-3">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Np. Ugotuj obiad, zadzwoń do mamy..."
          className="form-control"
          title="Wpisz nazwę zadania i kliknij Dodaj"
        />
        <button className="btn btn-primary" onClick={addTask}>
          Dodaj
        </button>
      </div>

      <div className="btn-group mb-3">
        <button className="btn btn-outline-secondary" onClick={() => setFilter("all")}>Wszystkie</button>
        <button className="btn btn-outline-secondary" onClick={() => setFilter("completed")}>Zrobione</button>
        <button className="btn btn-outline-secondary" onClick={() => setFilter("incomplete")}>Niezrobione</button>
      </div>

      <p><strong>Zrobione:</strong> {completedCount} z {tasks.length}</p>

      <TaskList
        tasks={filteredTasks}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
        editTask={editTask}
        markAllDone={markAllDone}
        clearAll={clearAll}
      />
    </div>
  );
};

export default App;
