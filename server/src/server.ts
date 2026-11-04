import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { isValidTask } from './task.js';
import { TaskModel } from './models/Task.js';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || '';

const allowedOrigins = [
    'http://localhost:5173',
    process.env.CLIENT_URL
].filter((origin): origin is string => Boolean(origin));

app.use(cors({
    origin: allowedOrigins
}))
app.use(express.json());




//get tasks
app.get('/tasks', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'] as string;

        if (!userId) {
            return res.status(400).json({ message: 'User ID required' });
        }

        const tasks = await TaskModel.find({ userId });
        return res.json(tasks);

    } catch (e) {
        return res.status(500).json({ message: 'Error fetching tasks' });
    }
})



//create a task
app.post('/tasks', async (req, res) => {
    try {

        if (!isValidTask(req.body)) {
            return res.status(400).json({ message: 'Task is invalid' })
        }

        const userId = req.headers['x-user-id'] as string;

        if (!userId) {
            return res.status(400).json({ message: 'User ID required' });
        }

        const { title, isCompleted } = req.body;

        const newTask = await TaskModel.create({
            title: title.trim(),
            isCompleted: Boolean(isCompleted),
            userId: userId
        })

        return res.status(201).json(newTask);

    } catch (e) {
        return res.status(500).json({ message: 'Error creating task' })
    }
})



//update task completion status
app.patch('/tasks/:id', async (req, res) => {

    try {

        if (req.body == null) {
            return res.status(400).json({
                message: "Request body is required"
            });
        }

        const userId = req.headers['x-user-id'] as string;
        const { id } = req.params;
        const { isCompleted } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID required' });
        }

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        if (typeof isCompleted !== 'boolean') {
            return res.status(400).json({ message: "Bad Request" })
        }

        const updatedTask = await TaskModel.findOneAndUpdate(
            { _id: id, userId },
            { isCompleted: isCompleted },
            { new: true }  //returns the updated document
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task doesnt exist' })
        }

        return res.status(200).json(updatedTask);

    }
    catch (e) {
        return res.status(500).json({ message: 'Error updating task' })
    }

})



//delete a task
app.delete('/tasks/:id', async (req, res) => {

    try {

        const { id } = req.params;
        const userId = req.headers['x-user-id'] as string;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        if (!userId) {
            return res.status(400).json({ message: 'User ID required' });
        }

        const deletedTask = await TaskModel.findOneAndDelete({ _id: id, userId });

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        return res.json({ message: 'Successfully deleted' })

    } catch (e) {
        return res.status(500).json({ message: 'Error deleting task' })
    }
})





async function startServer() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MONGODB Atlas');

        app.listen(PORT, () => {
            console.log(`Server running on PORT: ${PORT}`)
        });

    } catch (e) {
        console.error('Failed to connect to MongoDB:', e);
        process.exit(1);
    }
}

startServer();