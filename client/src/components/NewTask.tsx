import { useState } from "react"
import type { Task } from "../types.ts";

type NewTaskProps = {
    onTaskCreated: (task: Task) => void;
}

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
            }

            setIsSubmitting(true);

            const res = await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask)
            })
            if (!res.ok) {
                throw new Error(`HTTP Error: ${res.status}`)
            }
            
            const data: Task = await res.json();
            onTaskCreated(data);

            setTitle('');
            setIsCompleted(false);
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
                setError(e.message);
            }
            else {
                setError('Something went wrong');
            }
        }
        finally {
            setIsSubmitting(false)
        }
    }


    return (
        <form onSubmit={handleSubmit}>
            {error && <p>{error}</p>}
            <br />
            <input
                type="text"
                placeholder="task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <br />

            <label>Completed
                <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={(e) => setIsCompleted(e.target.checked)}
                />
            </label>
            <br />
            <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting..' : 'Submit'}</button>
        </form>
    )
}