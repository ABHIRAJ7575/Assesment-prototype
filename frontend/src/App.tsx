import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import InsightPanel from './components/InsightPanel';
import { Task, PriorityCalculation } from './types';

const API_URL = 'http://localhost:3000/api';

const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [priorities, setPriorities] = useState<PriorityCalculation[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${API_URL}/tasks`);
            if (response.data.success) {
                setTasks(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const fetchPriorities = async () => {
        try {
            const response = await axios.get(`${API_URL}/priorities`);
            if (response.data.success) {
                setPriorities(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching priorities:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchPriorities();
    }, []);

    const handleCreateTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
        try {
            const response = await axios.post(`${API_URL}/tasks`, taskData);
            if (response.data.success) {
                await fetchTasks();
                await fetchPriorities();
                setShowForm(false);
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const handleUpdateTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
        if (!editingTask) return;

        try {
            const response = await axios.put(`${API_URL}/tasks/${editingTask.id}`, taskData);
            if (response.data.success) {
                await fetchTasks();
                await fetchPriorities();
                setEditingTask(null);
                setShowForm(false);
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async (id: string) => {
        try {
            const response = await axios.delete(`${API_URL}/tasks/${id}`);
            if (response.data.success) {
                await fetchTasks();
                await fetchPriorities();
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleTaskClick = (task: Task) => {
        setEditingTask(task);
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingTask(null);
    };

    if (loading) {
        return (
            <div className="app-container">
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <h2>Loading...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <header className="app-header">
                <h1 className="app-title">Smart Task Prioritizer</h1>
                <p className="app-subtitle">AI-powered intelligent task management</p>
            </header>

            <div className="main-grid">
                <div>
                    {!showForm && (
                        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowForm(true)}
                                style={{ width: '100%', padding: 'var(--spacing-md)' }}
                            >
                                + Create New Task
                            </button>
                        </div>
                    )}

                    {showForm ? (
                        <TaskForm
                            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                            onCancel={handleCancelForm}
                            initialTask={editingTask || undefined}
                            allTasks={tasks}
                        />
                    ) : (
                        <TaskList
                            tasks={tasks}
                            onTaskClick={handleTaskClick}
                            onDeleteTask={handleDeleteTask}
                        />
                    )}
                </div>

                <InsightPanel priorities={priorities} />
            </div>
        </div>
    );
};

export default App;
