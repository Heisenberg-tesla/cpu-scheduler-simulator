import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface ComparisonChartProps {
    data: {
        algorithm: string;
        avgWaitingTime: number;
        avgTurnaroundTime: number;
        avgResponseTime: number;
    }[];
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ data }) => {
    const chartData = {
        labels: data.map(d => d.algorithm),
        datasets: [
            {
                label: 'Average Waiting Time',
                data: data.map(d => d.avgWaitingTime),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1
            },
            {
                label: 'Average Turnaround Time',
                data: data.map(d => d.avgTurnaroundTime),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                borderColor: 'rgb(53, 162, 235)',
                borderWidth: 1
            },
            {
                label: 'Average Response Time',
                data: data.map(d => d.avgResponseTime),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Algorithm Performance Comparison'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Time Units'
                }
            }
        }
    };

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow">
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default ComparisonChart;
