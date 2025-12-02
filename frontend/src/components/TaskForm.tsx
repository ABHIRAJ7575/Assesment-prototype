import React, { useState, useEffect } from 'react';
import { Task } from '../types';

interface TaskFormProps {
    onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
    onCancel: () => void;
    initialTask?: Task;
    allTasks: Task[];
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel, initialTask, allTasks }) => {
    const [title, setTitle] = useState(initialTask?.title || '');
    const [description, setDescription] = useState(initialTask?.description || '');
    const [deadline, setDeadline] = useState(
        initialTask?.deadline ? new Date(initialTask.deadline).toISOString().split('T')[0] : ''
    );
    const [estimatedEffort, setEstimatedEffort] = useState(initialTask?.estimatedEffort || 5);
    const [impact, setImpact] = useState(initialTask?.impact || 5);
    const [dependencies, setDependencies] = useState<string[]>(initialTask?.dependencies || []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onSubmit({
            title,
            description,
            deadline: new Date(deadline).toISOString(),
            estimatedEffort,
            impact,
            dependencies
        });
    };

    const toggleDependency = (taskId: string) => {
        setDependencies(prev =>
            prev.includes(taskId)
                ? prev.filter(id => id !== taskId)
                : [...prev, taskId]
        );
    };

    const availableTasks = allTasks.filter(t => t.id !== initialTask?.id);

    return (
        <form onSubmit={handleSubmit} className="glass-card">
            <h2 className="section-title">{initialTask ? 'Edit Task' : 'Create New Task'}</h2>

            <div className="input-group">
                <label className="input-label">Task Title</label>
                <input
                    type="text"
                    className="input-field"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Enter task title"
                />
            </div>

            <div className="input-group">
                <label className="input-label">Description</label>
                <textarea
                    className="textarea-field"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    placeholder="Describe the task in detail"
                />
            </div>

            <div className="input-group">
                <label className="input-label">Deadline</label>
                <input
                    type="date"
                    className="input-field"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                />
            </div>

            <div className="input-group">
                <label className="input-label">Estimated Effort (1-10): {estimatedEffort}</label>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={estimatedEffort}
                    onChange={(e) => setEstimatedEffort(Number(e.target.value))}
                    style={{ width: '100%' }}
                />
            </div>

            <div className="input-group">
                <label className="input-label">Impact (1-10): {impact}</label>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={impact}
                    onChange={(e) => setImpact(Number(e.target.value))}
                    style={{ width: '100%' }}
                />
            </div>

            {availableTasks.length > 0 && (
                <div className="input-group">
                    <label className="input-label">Dependencies (tasks that must be completed first)</label>
                    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {availableTasks.map(task => (
                            <label
                                key={task.id}
                                style={{
                                    display: 'block',
                                    padding: '0.5rem',
                                    cursor: 'pointer',
                                    background: dependencies.includes(task.id) ? 'var(--bg-card)' : 'transparent',
                                    borderRadius: 'var(--radius-sm)',
                                    marginBottom: '0.25rem'
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={dependencies.includes(task.id)}
                                    onChange={() => toggleDependency(task.id)}
                                    style={{ marginRight: '0.5rem' }}
                                />
                                {task.title}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                    {initialTask ? 'Update Task' : 'Create Task'}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
