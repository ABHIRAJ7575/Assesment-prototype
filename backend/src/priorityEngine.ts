import { Task, PriorityLevel, PriorityCalculation } from './types';

export class PriorityEngine {
    private calculateDeadlineUrgency(deadline: string): number {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const daysUntilDeadline = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

        if (daysUntilDeadline < 0) return 100;
        if (daysUntilDeadline <= 1) return 90;
        if (daysUntilDeadline <= 3) return 75;
        if (daysUntilDeadline <= 7) return 50;
        if (daysUntilDeadline <= 14) return 30;
        return 10;
    }

    private calculateDependencyWeight(task: Task, allTasks: Task[]): number {
        const blockingTasks = allTasks.filter(t =>
            task.dependencies.includes(t.id) && !t.completedAt
        );

        const blockedByTasks = allTasks.filter(t =>
            t.dependencies.includes(task.id) && !t.completedAt
        );

        if (blockingTasks.length > 0) return 20;
        if (blockedByTasks.length > 0) return 80;
        return 50;
    }

    private calculateImpactScore(impact: number): number {
        return Math.min(100, impact * 10);
    }

    private calculateEffortRatio(effort: number, impact: number): number {
        if (effort === 0) return 100;
        const ratio = impact / effort;
        return Math.min(100, ratio * 20);
    }

    private calculateOverallScore(factors: {
        deadlineUrgency: number;
        dependencyWeight: number;
        impactScore: number;
        effortRatio: number;
    }): number {
        return (
            factors.deadlineUrgency * 0.35 +
            factors.dependencyWeight * 0.25 +
            factors.impactScore * 0.25 +
            factors.effortRatio * 0.15
        );
    }

    private scoreToPriority(score: number): PriorityLevel {
        if (score >= 75) return 'critical';
        if (score >= 55) return 'high';
        if (score >= 35) return 'medium';
        return 'low';
    }

    private generateRecommendation(task: Task, factors: any, score: number): string {
        const recommendations: string[] = [];

        if (factors.deadlineUrgency > 70) {
            recommendations.push('Urgent deadline approaching');
        }

        if (factors.dependencyWeight > 70) {
            recommendations.push('Other tasks depend on this');
        }

        if (factors.impactScore > 70 && factors.effortRatio > 60) {
            recommendations.push('High impact with good effort ratio');
        }

        if (task.dependencies.length > 0) {
            recommendations.push('Has dependencies to resolve first');
        }

        if (recommendations.length === 0) {
            if (score >= 55) {
                return 'Important task to prioritize';
            }
            return 'Schedule when capacity allows';
        }

        return recommendations.join('. ');
    }

    public calculatePriority(task: Task, allTasks: Task[]): PriorityCalculation {
        const factors = {
            deadlineUrgency: this.calculateDeadlineUrgency(task.deadline),
            dependencyWeight: this.calculateDependencyWeight(task, allTasks),
            impactScore: this.calculateImpactScore(task.impact),
            effortRatio: this.calculateEffortRatio(task.estimatedEffort, task.impact)
        };

        const score = this.calculateOverallScore(factors);
        const priority = this.scoreToPriority(score);
        const recommendation = this.generateRecommendation(task, factors, score);

        return {
            taskId: task.id,
            priority,
            score: Math.round(score),
            factors,
            recommendation
        };
    }

    public calculateAllPriorities(tasks: Task[]): PriorityCalculation[] {
        return tasks
            .filter(t => !t.completedAt)
            .map(task => this.calculatePriority(task, tasks))
            .sort((a, b) => b.score - a.score);
    }
}
