import { jsPDF } from 'jspdf';
import { Process, SchedulerResult, SchedulingAlgorithm } from './types';

export const exportResultsAsPDF = (
    result: SchedulerResult,
    algorithm: SchedulingAlgorithm,
    config: { timeQuantum?: number; isPreemptive?: boolean } = {}
) => {
    const doc = new jsPDF();
    let yPos = 20;
    const lineHeight = 10;

    // Title
    doc.setFontSize(16);
    doc.text('CPU Scheduler Simulation Results', 20, yPos);
    yPos += lineHeight * 2;

    // Algorithm Info
    doc.setFontSize(12);
    doc.text(`Algorithm: ${algorithm}`, 20, yPos);
    yPos += lineHeight;

    if (algorithm === 'RoundRobin' && config.timeQuantum) {
        doc.text(`Time Quantum: ${config.timeQuantum}`, 20, yPos);
        yPos += lineHeight;
    }

    if (algorithm === 'Priority') {
        doc.text(`Mode: ${config.isPreemptive ? 'Preemptive' : 'Non-preemptive'}`, 20, yPos);
        yPos += lineHeight;
    }

    yPos += lineHeight;

    // Average Metrics
    doc.text('Average Metrics:', 20, yPos);
    yPos += lineHeight;
    doc.text(`Waiting Time: ${result.averageWaitingTime.toFixed(2)}`, 30, yPos);
    yPos += lineHeight;
    doc.text(`Turnaround Time: ${result.averageTurnaroundTime.toFixed(2)}`, 30, yPos);
    yPos += lineHeight;
    doc.text(`Response Time: ${result.averageResponseTime.toFixed(2)}`, 30, yPos);
    yPos += lineHeight * 2;

    // Process Details
    doc.text('Process Details:', 20, yPos);
    yPos += lineHeight;

    // Table headers
    const headers = ['Process', 'AT', 'BT', 'CT', 'TAT', 'WT', 'RT'];
    const colWidth = 25;
    let xPos = 20;

    headers.forEach(header => {
        doc.text(header, xPos, yPos);
        xPos += colWidth;
    });
    yPos += lineHeight;

    // Table content
    result.processes.forEach(process => {
        xPos = 20;
        doc.text(process.id, xPos, yPos);
        xPos += colWidth;
        doc.text(process.arrivalTime.toString(), xPos, yPos);
        xPos += colWidth;
        doc.text(process.burstTime.toString(), xPos, yPos);
        xPos += colWidth;
        doc.text(process.completionTime?.toString() || '-', xPos, yPos);
        xPos += colWidth;
        doc.text(process.turnaroundTime?.toString() || '-', xPos, yPos);
        xPos += colWidth;
        doc.text(process.waitingTime?.toString() || '-', xPos, yPos);
        xPos += colWidth;
        doc.text(process.responseTime?.toString() || '-', xPos, yPos);
        yPos += lineHeight;

        // Add new page if needed
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
    });

    // Save the PDF
    doc.save(`cpu-scheduler-${algorithm.toLowerCase()}-results.pdf`);
};
