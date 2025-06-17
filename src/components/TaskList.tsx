import React from "react";
import TaskItem from "./TaskItem";
import type { Task } from "../App";

type Props = {
  tasks: Task[];
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
};

const TaskList: React.FC<Props> = ({ tasks, toggleTask, deleteTask }) => {
  return (
    <ul className="list-group">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={toggleTask}   
          onDelete={deleteTask}
        />
      ))}
    </ul>
  );
};

export default TaskList;
