import React from 'react';
import { Task } from '../types';
import PriorityBadge from './PriorityBadge';

interface TaskListProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
    onDeleteTask: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskClick, onDeleteTask }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getDaysUntil = (deadline: string) => {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const days = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (days < 0) return `${Math.abs(days)} days overdue`;
        if (days === 0) return 'Due today';
        if (days === 1) return 'Due tomorrow';
        return `${days} days left`;
    };

    if (tasks.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">📋</div>
                <p>No tasks yet. Create your first task to get started!</p>
            </div>
        );
    }

    return (
        <div className="task-list">
            {tasks.map((task) => (
                <div key={task.id} className="task-card" onClick={() => onTaskClick(task)}>
                    <div className="task-header">
                        <div>
                            <h3 className="task-title">{task.title}</h3>
                            {task.priority && (
                                <PriorityBadge priority={task.priority} score={task.priorityScore} />
                            )}
                        </div>
                        <button
                            className="btn btn-secondary"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteTask(task.id);
                            }}
                            style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                        >
                            Delete
                        </button>
                    </div>

                    <p className="task-description">{task.description}</p>

                    <div className="task-meta">
                        <div className="task-meta-item">
                            <span>📅</span>
                            <span>{formatDate(task.deadline)}</span>
                        </div>
                        <div className="task-meta-item">
                            <span>⏱️</span>
                            <span>{getDaysUntil(task.deadline)}</span>
                        </div>
                        <div className="task-meta-item">
                            <span>💪</span>
                            <span>Effort: {task.estimatedEffort}/10</span>
                        </div>
                        <div className="task-meta-item">
                            <span>⭐</span>
                            <span>Impact: {task.impact}/10</span>
                        </div>
                        {task.dependencies.length > 0 && (
                            <div className="task-meta-item">
                                <span>🔗</span>
                                <span>{task.dependencies.length} dependencies</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TaskList;
