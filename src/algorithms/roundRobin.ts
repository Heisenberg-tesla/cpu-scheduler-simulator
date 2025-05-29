import { Process, SchedulerResult, GanttChartBlock } from '../utils/types';

export const roundRobin = (processes: Process[], timeQuantum: number): SchedulerResult => {
    const processQueue = [...processes].map(p => ({ 
        ...p, 
        remainingTime: p.burstTime,
        startTime: undefined
    }));
    const ganttChart: GanttChartBlock[] = [];
    const completedProcesses: Process[] = [];
    let currentTime = 0;
    let readyQueue: Process[] = [];

    while (processQueue.length > 0 || readyQueue.length > 0) {
        // Move arrived processes to ready queue
        const newlyArrived = processQueue.filter(p => p.arrivalTime <= currentTime);
        readyQueue.push(...newlyArrived);
        processQueue.splice(0, newlyArrived.length);

        if (readyQueue.length === 0) {
            // No processes in ready queue, jump to next arrival
            if (processQueue.length > 0) {
                currentTime = Math.min(...processQueue.map(p => p.arrivalTime));
                continue;
            }
            break;
        }

        // Get next process from ready queue
        const currentProcess = readyQueue.shift()!;

        // Set start time if first execution
        if (currentProcess.startTime === undefined) {
            currentProcess.startTime = currentTime;
            currentProcess.responseTime = currentTime - currentProcess.arrivalTime;
        }

        // Calculate execution time for this quantum
        const executionTime = Math.min(timeQuantum, currentProcess.remainingTime!);

        // Add to Gantt chart
        ganttChart.push({
            processId: currentProcess.id,
            startTime: currentTime,
            endTime: currentTime + executionTime,
            color: currentProcess.color
        });

        // Update remaining time and current time
        currentProcess.remainingTime! -= executionTime;
        currentTime += executionTime;

        // Check if process is completed
        if (currentProcess.remainingTime === 0) {
            currentProcess.completionTime = currentTime;
            currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
            currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
            completedProcesses.push(currentProcess);
        } else {
            // Move arrived processes to ready queue before re-adding current process
            const newlyArrived = processQueue.filter(p => p.arrivalTime <= currentTime);
            readyQueue.push(...newlyArrived);
            processQueue.splice(0, newlyArrived.length);
            
            // Add process back to ready queue
            readyQueue.push(currentProcess);
        }
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
