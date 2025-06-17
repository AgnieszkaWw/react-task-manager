import { useEffect, useState } from "react";
import TaskList from "./components/TaskList";
import 'bootstrap/dist/css/bootstrap.min.css';

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

type Filter = "all" | "completed" | "incomplete";

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    fetch("http://localhost:3001/tasks")
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

    const res = await fetch("http://localhost:3001/tasks", {
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
      await fetch(`http://localhost:3001/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
    }
  };

  const deleteTask = async (id: number) => {
    await fetch(`http://localhost:3001/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  return (
    <div className="container mt-5">
      <h1 className="mb-4">📝 Lista zadań</h1>

      <div className="input-group mb-3">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Dodaj nowe zadanie"
          className="form-control"
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

      <TaskList tasks={filteredTasks} toggleTask={toggleTask} deleteTask={deleteTask} />
    </div>
  );
};

export default App;