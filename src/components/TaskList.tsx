

import TaskItem from "./TaskItem";
import type{ Task } from "../App";

type TaskListProps = {
  tasks: Task[];
  toggleTask: (id: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  editTask: (id: number, newTitle: string) => Promise<void>;
  markAllDone: () => void;
  clearAll: () => void;
};

const TaskList: React.FC<TaskListProps> = ({ tasks, toggleTask, deleteTask, editTask, markAllDone, clearAll }) => {
  return (
    <>
      <div className="d-flex justify-content-end gap-2 mb-2">
        <button className="btn btn-outline-success btn-sm" onClick={markAllDone}>✅ Zaznacz wszystkie</button>
        <button className="btn btn-outline-danger btn-sm" onClick={clearAll}>🗑️ Usuń wszystkie</button>
      </div>
      <ul className="list-group">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={editTask}
          />
        ))}
      </ul>
    </>
  );
};

export default TaskList;