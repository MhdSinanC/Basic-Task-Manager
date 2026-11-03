import type { Task } from "../types.ts";

type TaskListProps = {
    tasks: Task[];
    onTaskUpdate: (id: string, isCompleted: boolean) => void;
    onTaskDelete: (id: string) => void;
}


export default function TaskList({ tasks, onTaskUpdate, onTaskDelete }: TaskListProps) {


    return (
        <>

            {
                tasks.map((task) => {
                    return <div key={task.id}>
                        {task.title} - {task.isCompleted ? 'Completed' : 'Pending'}
                        <input
                            type="checkbox"
                            checked={task.isCompleted}
                            onChange={(e) => {
                                onTaskUpdate(task.id, e.target.checked);
                            }}
                        />
                        <button onClick={() => onTaskDelete(task.id)}>Delete</button>
                    </div>
                })
            }
        </>
    )
}