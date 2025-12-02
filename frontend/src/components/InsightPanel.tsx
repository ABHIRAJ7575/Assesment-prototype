import React from 'react';
import { PriorityCalculation } from '../types';

interface InsightPanelProps {
    priorities: PriorityCalculation[];
}

const InsightPanel: React.FC<InsightPanelProps> = ({ priorities }) => {
    const topPriorities = priorities.slice(0, 5);

    const getInsightColor = (priority: string) => {
        switch (priority) {
            case 'critical':
                return 'var(--priority-critical)';
            case 'high':
                return 'var(--priority-high)';
            case 'medium':
                return 'var(--priority-medium)';
            case 'low':
                return 'var(--priority-low)';
            default:
                return 'var(--text-muted)';
        }
    };

    const getOverallInsight = () => {
        const criticalCount = priorities.filter(p => p.priority === 'critical').length;
        const highCount = priorities.filter(p => p.priority === 'high').length;

        if (criticalCount > 0) {
            return `⚠️ You have ${criticalCount} critical task${criticalCount > 1 ? 's' : ''} requiring immediate attention`;
        }
        if (highCount > 2) {
            return `📊 ${highCount} high-priority tasks detected. Consider delegating or breaking them down`;
        }
        if (priorities.length === 0) {
            return `✅ All clear! No pending tasks`;
        }
        return `💡 Workload is balanced. Focus on high-impact tasks first`;
    };

    return (
        <div className="insight-panel">
            <div className="insight-card">
                <h3 className="insight-title">AI Insights</h3>
                <div className="insight-item" style={{ borderLeftColor: 'var(--primary-gradient)' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {getOverallInsight()}
                    </p>
                </div>
            </div>

            {topPriorities.length > 0 && (
                <div className="insight-card">
                    <h3 className="section-title" style={{ fontSize: '1.125rem' }}>
                        Top Priorities
                    </h3>
                    {topPriorities.map((priority, index) => (
                        <div
                            key={priority.taskId}
                            className="insight-item"
                            style={{ borderLeftColor: getInsightColor(priority.priority) }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.25rem'
                            }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: 'var(--text-muted)'
                                }}>
                                    #{index + 1}
                                </span>
                                <span style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: getInsightColor(priority.priority)
                                }}>
                                    Score: {priority.score}
                                </span>
                            </div>
                            <p style={{
                                fontSize: '0.8125rem',
                                color: 'var(--text-secondary)',
                                lineHeight: 1.4
                            }}>
                                {priority.recommendation}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            <div className="insight-card">
                <h3 className="section-title" style={{ fontSize: '1.125rem' }}>
                    Priority Distribution
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {['critical', 'high', 'medium', 'low'].map(level => {
                        const count = priorities.filter(p => p.priority === level).length;
                        const percentage = priorities.length > 0
                            ? (count / priorities.length) * 100
                            : 0;

                        return (
                            <div key={level}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.25rem',
                                    fontSize: '0.8125rem'
                                }}>
                                    <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
                                        {level}
                                    </span>
                                    <span style={{ color: 'var(--text-muted)' }}>{count}</span>
                                </div>
                                <div style={{
                                    height: '6px',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: '3px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${percentage}%`,
                                        background: getInsightColor(level),
                                        transition: 'width 0.3s ease'
                                    }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default InsightPanel;
