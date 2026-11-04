import { useState } from "react";
import type { Task } from "../types.ts";
import { API_BASE_URL } from "../config.ts";
import { getUserId } from "../user.ts";

type NewTaskProps = {
    onTaskCreated: (task: Task) => void;
};

export default function NewTask({ onTaskCreated }: NewTaskProps) {
    const [title, setTitle] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.SyntheticEvent) => {
        try {
            e.preventDefault();
            setError('');

            if (!title.trim()) {
                setError('Task title is required');
                return;
            }

            const newTask = {
                title: title.trim(),
                isCompleted
            };

            setIsSubmitting(true);

            const res = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': getUserId()
                },
                body: JSON.stringify(newTask)
            });

            if (!res.ok) {
                throw new Error(`HTTP Error: ${res.status}`);
            }

            const data: Task = await res.json();
            onTaskCreated(data);

            setTitle('');
            setIsCompleted(false);
        } catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
                setError(e.message);
            } else {
                setError('Something went wrong');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="relative p-6 sm:p-7 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-2xl backdrop-blur-xl">
                {/* Subtle top ambient glow */}
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent pointer-events-none" />

                <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-white tracking-tight">Create New Task</h2>
                        <p className="text-xs text-slate-400">Add a task and track your daily productivity</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm flex items-center gap-2.5">
                        <svg className="w-4 h-4 shrink-0 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="task-title" className="block text-xs font-medium text-slate-300 mb-1.5 tracking-wide">
                            Task Title
                        </label>
                        <input
                            id="task-title"
                            type="text"
                            placeholder="What needs to be done?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                        <label className="inline-flex items-center gap-2.5 cursor-pointer select-none group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isCompleted}
                                    onChange={(e) => setIsCompleted(e.target.checked)}
                                    className="peer sr-only"
                                />
                                <div className="w-4 h-4 rounded border border-slate-700 bg-slate-950/80 peer-checked:bg-indigo-600 peer-checked:border-indigo-500 transition-all duration-150 flex items-center justify-center group-hover:border-slate-500">
                                    <svg
                                        className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-150"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={3}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <span className="text-xs sm:text-sm text-slate-300 group-hover:text-slate-200 transition-colors">
                                Mark as completed
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Add Task</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
