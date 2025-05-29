import { Process, SchedulerResult, GanttChartBlock } from '../utils/types';

export const srtf = (processes: Process[]): SchedulerResult => {
    const processQueue = [...processes].map(p => ({ 
        ...p, 
        remainingTime: p.burstTime,
        startTime: undefined
    }));
    const ganttChart: GanttChartBlock[] = [];
    const completedProcesses: Process[] = [];
    let currentTime = 0;
    let currentProcess: Process | null = null;
    let lastProcessId: string | null = null;

    while (processQueue.length > 0 || currentProcess) {
        // Add newly arrived processes
        const arrivedProcesses = processQueue.filter(p => p.arrivalTime <= currentTime);

        // Find process with shortest remaining time
        let shortestJob: Process | null = currentProcess;
        for (const process of arrivedProcesses) {
            if (!shortestJob || process.remainingTime! < shortestJob.remainingTime!) {
                shortestJob = process;
            }
        }

        // Process context switch if needed
        if (shortestJob && shortestJob.id !== lastProcessId) {
            if (lastProcessId !== null) {
                // Add previous process block to Gantt chart
                const lastGanttBlock = ganttChart[ganttChart.length - 1];
                if (lastGanttBlock) {
                    lastGanttBlock.endTime = currentTime;
                }
            }

            // Start new process block
            if (shortestJob.startTime === undefined) {
                shortestJob.startTime = currentTime;
                shortestJob.responseTime = currentTime - shortestJob.arrivalTime;
            }

            ganttChart.push({
                processId: shortestJob.id,
                startTime: currentTime,
                endTime: currentTime + 1, // Will be updated in next iteration
                color: shortestJob.color
            });
        }

        // Update current process and time
        if (shortestJob) {
            shortestJob.remainingTime!--;
            lastProcessId = shortestJob.id;

            // Check if process is completed
            if (shortestJob.remainingTime === 0) {
                const processIndex = processQueue.findIndex(p => p.id === shortestJob!.id);
                if (processIndex !== -1) {
                    processQueue.splice(processIndex, 1);
                }

                shortestJob.completionTime = currentTime + 1;
                shortestJob.turnaroundTime = shortestJob.completionTime - shortestJob.arrivalTime;
                shortestJob.waitingTime = shortestJob.turnaroundTime - shortestJob.burstTime;
                completedProcesses.push(shortestJob);
                currentProcess = null;
            } else {
                currentProcess = shortestJob;
            }
        }

        currentTime++;
    }

    // Update last Gantt chart block
    if (ganttChart.length > 0) {
        ganttChart[ganttChart.length - 1].endTime = currentTime;
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
