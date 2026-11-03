import type { Task } from "../types.ts";

type TaskListProps = {
    tasks: Task[];
    onTaskUpdate: (id: string, isCompleted: boolean) => void;
    onTaskDelete: (id: string) => void;
};

export default function TaskList({ tasks, onTaskUpdate, onTaskDelete }: TaskListProps) {
    if (tasks.length === 0) {
        return (
            <div className="w-full max-w-2xl mx-auto p-10 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 backdrop-blur-md">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-sm font-medium text-slate-200 mb-1">No tasks yet</h3>
                <p className="text-xs text-slate-500">Add a new task using the form above.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-2.5">
            {tasks.map((task) => {
                return (
                    <div
                        key={task.id}
                        className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 backdrop-blur-xl ${
                            task.isCompleted
                                ? "bg-slate-900/40 border-slate-800/60 opacity-75"
                                : "bg-slate-900/80 border-slate-800 hover:border-slate-700/80 hover:shadow-lg hover:shadow-indigo-500/5"
                        }`}
                    >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-3">
                            {/* Checkbox */}
                            <label className="relative flex items-center cursor-pointer shrink-0">
                                <input
                                    type="checkbox"
                                    checked={task.isCompleted}
                                    onChange={(e) => {
                                        onTaskUpdate(task.id, e.target.checked);
                                    }}
                                    className="peer sr-only"
                                />
                                <div className="w-5 h-5 rounded-md border border-slate-700 bg-slate-950/80 peer-checked:bg-emerald-600 peer-checked:border-emerald-500 transition-all duration-150 flex items-center justify-center hover:border-slate-500">
                                    <svg
                                        className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={3}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </label>

                            {/* Title */}
                            <div className="min-w-0 flex-1">
                                <span
                                    className={`block text-sm sm:text-base font-medium truncate transition-all duration-200 ${
                                        task.isCompleted
                                            ? "line-through text-slate-500"
                                            : "text-slate-100 group-hover:text-white"
                                    }`}
                                >
                                    {task.title}
                                </span>
                            </div>

                            {/* Status Badge */}
                            <span
                                className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium tracking-wide border ${
                                    task.isCompleted
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                        : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                                }`}
                            >
                                {task.isCompleted ? "Completed" : "Pending"}
                            </span>
                        </div>

                        {/* Delete Button */}
                        <button
                            onClick={() => onTaskDelete(task.id)}
                            className="shrink-0 p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all duration-150 cursor-pointer"
                            title="Delete task"
                            aria-label="Delete task"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
