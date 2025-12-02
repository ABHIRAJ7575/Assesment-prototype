import React from 'react';
import { PriorityLevel } from '../types';

interface PriorityBadgeProps {
    priority: PriorityLevel;
    score?: number;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, score }) => {
    const getPriorityIcon = () => {
        switch (priority) {
            case 'critical':
                return '🔴';
            case 'high':
                return '🟠';
            case 'medium':
                return '🔵';
            case 'low':
                return '🟢';
            default:
                return '⚪';
        }
    };

    return (
        <span className={`priority-badge priority-${priority}`}>
            <span>{getPriorityIcon()}</span>
            <span>{priority}</span>
            {score !== undefined && <span>({score})</span>}
        </span>
    );
};

export default PriorityBadge;
