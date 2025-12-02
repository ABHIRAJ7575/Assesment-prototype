import { Request, Response } from 'express';
import { Task, ApiResponse } from '../types';
import { PriorityEngine } from '../priorityEngine';

let tasks: Task[] = [
    {
        id: '1',
        title: 'Complete project proposal',
        description: 'Draft and finalize the Q1 project proposal document',
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedEffort: 5,
        impact: 9,
        dependencies: [],
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        title: 'Review team feedback',
        description: 'Analyze and incorporate team feedback from last sprint',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedEffort: 3,
        impact: 6,
        dependencies: ['1'],
        createdAt: new Date().toISOString()
    },
    {
        id: '3',
        title: 'Update documentation',
        description: 'Update API documentation with new endpoints',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedEffort: 4,
        impact: 5,
        dependencies: [],
        createdAt: new Date().toISOString()
    }
];

const priorityEngine = new PriorityEngine();

export const getAllTasks = (req: Request, res: Response) => {
    const priorities = priorityEngine.calculateAllPriorities(tasks);

    const tasksWithPriorities = tasks.map(task => {
        const priorityCalc = priorities.find(p => p.taskId === task.id);
        return {
            ...task,
            priority: priorityCalc?.priority,
            priorityScore: priorityCalc?.score
        };
    });

    const response: ApiResponse<Task[]> = {
        success: true,
        data: tasksWithPriorities
    };

    res.json(response);
};

export const getTaskById = (req: Request, res: Response) => {
    const task = tasks.find(t => t.id === req.params.id);

    if (!task) {
        const response: ApiResponse<null> = {
            success: false,
            error: 'Task not found'
        };
        return res.status(404).json(response);
    }

    const response: ApiResponse<Task> = {
        success: true,
        data: task
    };

    res.json(response);
};

export const createTask = (req: Request, res: Response) => {
    const newTask: Task = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);

    const response: ApiResponse<Task> = {
        success: true,
        data: newTask
    };

    res.status(201).json(response);
};

export const updateTask = (req: Request, res: Response) => {
    const index = tasks.findIndex(t => t.id === req.params.id);

    if (index === -1) {
        const response: ApiResponse<null> = {
            success: false,
            error: 'Task not found'
        };
        return res.status(404).json(response);
    }

    tasks[index] = {
        ...tasks[index],
        ...req.body,
        id: tasks[index].id,
        createdAt: tasks[index].createdAt
    };

    const response: ApiResponse<Task> = {
        success: true,
        data: tasks[index]
    };

    res.json(response);
};

export const deleteTask = (req: Request, res: Response) => {
    const index = tasks.findIndex(t => t.id === req.params.id);

    if (index === -1) {
        const response: ApiResponse<null> = {
            success: false,
            error: 'Task not found'
        };
        return res.status(404).json(response);
    }

    tasks.splice(index, 1);

    const response: ApiResponse<null> = {
        success: true
    };

    res.json(response);
};

export const getPriorities = (req: Request, res: Response) => {
    const priorities = priorityEngine.calculateAllPriorities(tasks);

    const response: ApiResponse<any> = {
        success: true,
        data: priorities
    };

    res.json(response);
};
