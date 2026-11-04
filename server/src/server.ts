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
        const tasks = await TaskModel.find();
        res.json(tasks);
    } catch (e) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
})



//create a task
app.post('/tasks', async (req, res) => {
    try {

        if (!isValidTask(req.body)) {
            return res.status(400).json({ message: 'Task is invalid' })
        }

        const { title, isCompleted } = req.body;

        const newTask = await TaskModel.create({
            title: title.trim(),
            isCompleted: Boolean(isCompleted)
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

        const { id } = req.params;
        const { isCompleted } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        if (typeof isCompleted !== 'boolean') {
            return res.status(400).json({ message: "Bad Request" })
        }

        const updatedTask = await TaskModel.findByIdAndUpdate(
            id,
            { isCompleted },
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

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid task ID"
            });
        }

        const deletedTask = await TaskModel.findByIdAndDelete(id);

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