import { Process, SchedulerResult, GanttChartBlock } from '../utils/types';

export const sjf = (processes: Process[]): SchedulerResult => {
    const processQueue = [...processes].map(p => ({ ...p }));
    const ganttChart: GanttChartBlock[] = [];
    const completedProcesses: Process[] = [];
    let currentTime = 0;

    while (processQueue.length > 0) {
        // Find all processes that have arrived by current time
        const availableProcesses = processQueue.filter(p => p.arrivalTime <= currentTime);

        if (availableProcesses.length === 0) {
            // No processes available, jump to next arrival time
            currentTime = Math.min(...processQueue.map(p => p.arrivalTime));
            continue;
        }

        // Find process with shortest burst time among available processes
        const shortestJob = availableProcesses.reduce((prev, curr) => 
            prev.burstTime < curr.burstTime ? prev : curr
        );

        // Remove the process from queue
        const processIndex = processQueue.findIndex(p => p.id === shortestJob.id);
        processQueue.splice(processIndex, 1);

        // Set start time if not already set (for response time)
        shortestJob.startTime = currentTime;
        shortestJob.responseTime = shortestJob.startTime - shortestJob.arrivalTime;

        // Add to Gantt chart
        ganttChart.push({
            processId: shortestJob.id,
            startTime: currentTime,
            endTime: currentTime + shortestJob.burstTime,
            color: shortestJob.color
        });

        // Update times
        currentTime += shortestJob.burstTime;
        shortestJob.completionTime = currentTime;
        shortestJob.turnaroundTime = shortestJob.completionTime - shortestJob.arrivalTime;
        shortestJob.waitingTime = shortestJob.turnaroundTime - shortestJob.burstTime;

        completedProcesses.push(shortestJob);
    }

    // Calculate averages
    const avgWaitingTime = completedProcesses.reduce((sum, p) => sum + p.waitingTime!, 0) / processes.length;
    const avgTurnaroundTime = completedProcesses.reduce((sum, p) => sum + p.turnaroundTime!, 0) / processes.length;
    const avgResponseTime = completedProcesses.reduce((sum, p) => sum + p.responseTime!, 0) / processes.length;

    return {
        ganttChart,
        processes: completedProcesses,
        averageWaitingTime: avgWaitingTime,
        averageTurnaroundTime: avgTurnaroundTime,
        averageResponseTime: avgResponseTime
    };
};
