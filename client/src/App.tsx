import { useEffect, useState } from 'react';
import NewTask from './components/NewTask.tsx';
import TaskList from './components/TaskList.tsx';
import type { Task } from './types.ts';
import { API_BASE_URL } from './config.ts';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleTaskUpdate = async (id: string, isCompleted: boolean) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isCompleted })
      });

      if (!res.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask: Task = await res.json();

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? updatedTask : task
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleTaskDeleted = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== id)
      );
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setError(null);
        const res = await fetch(`${API_BASE_URL}/tasks`);

        if (!res.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data: Task[] = await res.json();
        setTasks(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.isCompleted).length;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-162.5 h-87.5 bg-indigo-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/3 -right-40 w-100 h-87.5 bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-10 -left-40 w-87.5 h-75 bg-blue-600/10 blur-[110px] rounded-full" />
      </div>

      <div className="relative z-10 flex-1 px-4 sm:px-6 py-10 sm:py-14 max-w-3xl mx-auto w-full">
        {/* Header / Brand */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Task Management System
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Focus &amp; Accomplish
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Organize your daily responsibilities, prioritize tasks, and keep momentum effortlessly.
          </p>

          {/* Quick Stats Bar */}
          {!loading && !error && (
            <div className="mt-5 inline-flex items-center gap-4 sm:gap-6 px-5 py-2 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Total:</span>
                <span className="font-semibold text-white">{totalCount}</span>
              </div>
              <div className="w-px h-3.5 bg-slate-800" />
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">Done:</span>
                <span className="font-semibold text-emerald-300">{completedCount}</span>
              </div>
              <div className="w-px h-3.5 bg-slate-800" />
              <div className="flex items-center gap-2">
                <span className="text-amber-400">Pending:</span>
                <span className="font-semibold text-amber-300">{totalCount - completedCount}</span>
              </div>
            </div>
          )}
        </header>

        {/* Task Creation Form */}
        <NewTask onTaskCreated={handleTaskCreated} />

        {/* Loading State */}
        {loading && (
          <div className="w-full max-w-2xl mx-auto py-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <p className="text-sm text-slate-400">Loading your tasks...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="w-full max-w-2xl mx-auto p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 text-rose-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Task List */}
        {!loading && !error && (
          <TaskList
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDeleted}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-5 text-center text-xs text-slate-600 border-t border-slate-900/80">
        Task Manager &bull; Built with React, MongoDB &amp; Tailwind CSS
      </footer>
    </div>
  );
}

export default App;
