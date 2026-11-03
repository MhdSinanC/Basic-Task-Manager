import { useEffect, useState } from 'react';
import NewTask from './components/NewTask.tsx'
import TaskList from './components/TaskList.tsx'
import type { Task } from './types.ts';

function App() {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);


  const handleTaskCreated = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask])
  }

  const handleTaskUpdate = async (id: string, isCompleted: boolean) => {
    try {
      const res = await fetch(`http://localhost:3000/tasks/${id}`, {
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
    }
    catch (e) {
      console.error(e);
    }
  }


  const handleTaskDeleted = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== id)
      );
    }
    catch (e) {
      console.error(e);
    }
  };




  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setError(null);
        const res = await fetch('http://localhost:3000/tasks');

        if (!res.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data: Task[] = await res.json();
        setTasks(data);
      }
      catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong')
        console.error(e);
      }
      finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);



  return (
    <>
      <NewTask onTaskCreated={handleTaskCreated} />
      <br />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {
        !loading && !error &&
        <TaskList tasks={tasks} onTaskUpdate={handleTaskUpdate} onTaskDelete={handleTaskDeleted} />
      }
    </>
  )
}

export default App;
