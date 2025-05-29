import { Process, SchedulerResult, GanttChartBlock } from '../utils/types';

export const fcfs = (processes: Process[]): SchedulerResult => {
    // Sort processes by arrival time
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const ganttChart: GanttChartBlock[] = [];
    let currentTime = 0;
    
    // Process each job and store updated processes
    const updatedProcesses = sortedProcesses.map(process => {
        const p = { 
            ...process,
            startTime: 0,
            completionTime: 0,
            turnaroundTime: 0,
            waitingTime: 0,
            responseTime: 0
        };
        
        // If there's a gap between current time and process arrival
        if (currentTime < p.arrivalTime) {
            currentTime = p.arrivalTime;
        }
        
        // Set start time if not already set (for response time calculation)
        p.startTime = currentTime;
        p.responseTime = p.startTime - p.arrivalTime;
        
        // Add to Gantt chart
        ganttChart.push({
            processId: p.id,
            startTime: currentTime,
            endTime: currentTime + p.burstTime,
            color: p.color
        });
        
        // Update times
        currentTime += p.burstTime;
        p.completionTime = currentTime;
        p.turnaroundTime = p.completionTime - p.arrivalTime;
        p.waitingTime = p.turnaroundTime - p.burstTime;
        
        return p;
    });
    
    // Calculate averages using updated processes
    const avgWaitingTime = updatedProcesses.reduce((sum, p) => sum + p.waitingTime, 0) / processes.length;
    const avgTurnaroundTime = updatedProcesses.reduce((sum, p) => sum + p.turnaroundTime, 0) / processes.length;
    const avgResponseTime = updatedProcesses.reduce((sum, p) => sum + p.responseTime, 0) / processes.length;
    
    return {
        ganttChart,
        processes: updatedProcesses,
        averageWaitingTime: avgWaitingTime,
        averageTurnaroundTime: avgTurnaroundTime,
        averageResponseTime: avgResponseTime
    };
};
