import React from "react";
import type{ Task } from "../App"; // ✅ Poprawiona ścieżka importu

import "bootstrap-icons/font/bootstrap-icons.css";
import "./TaskItem.css";

type TaskItemProps = {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <li
      className={`list-group-item d-flex justify-content-between align-items-center shadow-sm rounded task-item ${
        task.completed ? "bg-light done" : "fade-in"
      }`}
    >
      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input animated-checkbox"
          id={`task-${task.id}`}
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <label
          className={`form-check-label ms-2 ${
            task.completed ? "text-decoration-line-through text-muted" : "fw-bold"
          }`}
          htmlFor={`task-${task.id}`}
        >
          {task.title}
          <br />
          <small className="text-muted">📅 {new Date(task.createdAt).toLocaleString()}</small>
        </label>
      </div>
      <button
        className="btn btn-sm btn-outline-danger rounded-circle"
        onClick={() => onDelete(task.id)}
        title="Usuń zadanie"
      >
        <i className="bi bi-trash"></i>
      </button>
    </li>
  );
};

export default TaskItem;
