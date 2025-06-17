
import type { Task } from "../App";

import "bootstrap-icons/font/bootstrap-icons.css";
import "./TaskItem.css";
import { useState } from "react";

type TaskItemProps = {
  task: Task;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, newTitle: string) => Promise<void>;
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleEdit = () => {
    if (isEditing && editedTitle.trim() && editedTitle !== task.title) {
      onEdit(task.id, editedTitle);
    }
    setIsEditing(!isEditing);
  };

  return (
    <li
      className={`list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-sm-center shadow-sm rounded task-item border border-2 ${
        task.completed ? "bg-success-subtle text-success" : "bg-body text-dark"
      }`}
    >
      <div className="form-check d-flex align-items-center mb-2 mb-sm-0 w-100">
        <input
          type="checkbox"
          className="form-check-input animated-checkbox"
          id={`task-${task.id}`}
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="form-control ms-2 border-primary"
            style={{ maxWidth: "100%" }}
            title="Edytuj nazwę zadania"
          />
        ) : (
          <label
            className={`form-check-label ms-2 ${
              task.completed ? "text-decoration-line-through text-muted" : "fw-semibold"
            }`}
            htmlFor={`task-${task.id}`}
          >
            <i className={`bi ${task.completed ? "bi-check-circle-fill me-1" : "bi-circle me-1"}`}></i>
            {task.title}
            <br />
            <small className="text-muted">
              📅 {new Date(task.createdAt).toLocaleString()}
              {task.dueDate && ` | ⏰ Termin: ${new Date(task.dueDate).toLocaleDateString()}`}
            </small>
          </label>
        )}
      </div>
      <div className="d-flex gap-2">
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={handleEdit}
          title={isEditing ? "Zapisz zmiany" : "Edytuj zadanie"}
        >
          <i className={`bi ${isEditing ? "bi-check-lg" : "bi-pencil"}`}></i>
        </button>
        <button
          className="btn btn-sm btn-outline-danger rounded-circle"
          onClick={() => onDelete(task.id)}
          title="Usuń zadanie"
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
