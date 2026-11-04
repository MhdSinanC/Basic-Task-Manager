import mongoose, { Schema, Document } from 'mongoose';

export interface Task extends Document {
    title: string;
    isCompleted: boolean;
    userId: string;
}

const taskSchema = new Schema<Task>({
    userId: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    }
},
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_doc, ret: any) => {
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    });

export const TaskModel = mongoose.model<Task>('Task', taskSchema);