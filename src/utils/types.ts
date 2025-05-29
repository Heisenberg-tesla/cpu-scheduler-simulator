export interface Process {
    id: string;
    arrivalTime: number;
    burstTime: number;
    priority?: number;
    color: string;
    remainingTime?: number;
    startTime?: number;
    completionTime?: number;
    turnaroundTime?: number;
    waitingTime?: number;
    responseTime?: number;
}

export interface GanttChartBlock {
    processId: string;
    startTime: number;
    endTime: number;
    color: string;
}

export interface SchedulerResult {
    ganttChart: GanttChartBlock[];
    processes: Process[];
    averageWaitingTime: number;
    averageTurnaroundTime: number;
    averageResponseTime: number;
}

export type SchedulingAlgorithm = 'FCFS' | 'SJF' | 'SRTF' | 'Priority' | 'RoundRobin';

export interface SchedulerConfig {
    algorithm: SchedulingAlgorithm;
    timeQuantum?: number;
    isPriority?: boolean;
    isPreemptive?: boolean;
}
