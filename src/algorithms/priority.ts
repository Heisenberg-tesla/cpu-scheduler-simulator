import { Process, SchedulerResult, GanttChartBlock } from '../utils/types';

export const priority = (processes: Process[], isPreemptive: boolean): SchedulerResult => {
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
        // Get available processes
        const availableProcesses = processQueue.filter(p => p.arrivalTime <= currentTime);

        // Find highest priority process
        let highestPriorityProcess: Process | null = currentProcess;
        for (const process of availableProcesses) {
            if (!highestPriorityProcess || 
                (process.priority! < highestPriorityProcess.priority!) || 
                (process.priority === highestPriorityProcess.priority && 
                 process.arrivalTime < highestPriorityProcess.arrivalTime)) {
                if (isPreemptive || !currentProcess) {
                    highestPriorityProcess = process;
                }
            }
        }

        // Process context switch if needed
        if (highestPriorityProcess && highestPriorityProcess.id !== lastProcessId) {
            if (lastProcessId !== null) {
                // Add previous process block to Gantt chart
                const lastGanttBlock = ganttChart[ganttChart.length - 1];
                if (lastGanttBlock) {
                    lastGanttBlock.endTime = currentTime;
                }
            }

            // Start new process block
            if (highestPriorityProcess.startTime === undefined) {
                highestPriorityProcess.startTime = currentTime;
                highestPriorityProcess.responseTime = currentTime - highestPriorityProcess.arrivalTime;
            }

            ganttChart.push({
                processId: highestPriorityProcess.id,
                startTime: currentTime,
                endTime: currentTime + 1, // Will be updated in next iteration
                color: highestPriorityProcess.color
            });
        }

        // Update current process and time
        if (highestPriorityProcess) {
            highestPriorityProcess.remainingTime!--;
            lastProcessId = highestPriorityProcess.id;

            // Check if process is completed
            if (highestPriorityProcess.remainingTime === 0) {
                const processIndex = processQueue.findIndex(p => p.id === highestPriorityProcess!.id);
                if (processIndex !== -1) {
                    processQueue.splice(processIndex, 1);
                }

                highestPriorityProcess.completionTime = currentTime + 1;
                highestPriorityProcess.turnaroundTime = highestPriorityProcess.completionTime - highestPriorityProcess.arrivalTime;
                highestPriorityProcess.waitingTime = highestPriorityProcess.turnaroundTime - highestPriorityProcess.burstTime;
                completedProcesses.push(highestPriorityProcess);
                currentProcess = null;
            } else {
                currentProcess = highestPriorityProcess;
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
