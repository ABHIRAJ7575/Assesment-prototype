export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface Task {
    id: string;
    title: string;
    description: string;
    deadline: string;
    estimatedEffort: number;
    impact: number;
    dependencies: string[];
    priority?: PriorityLevel;
    priorityScore?: number;
    createdAt: string;
    completedAt?: string;
}

export interface PriorityCalculation {
    taskId: string;
    priority: PriorityLevel;
    score: number;
    factors: {
        deadlineUrgency: number;
        dependencyWeight: number;
        impactScore: number;
        effortRatio: number;
    };
    recommendation: string;
}
