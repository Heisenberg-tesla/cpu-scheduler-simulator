import React from 'react';
import { Process } from '../utils/types';

interface ResultTableProps {
    processes: Process[];
    averageWaitingTime: number;
    averageTurnaroundTime: number;
    averageResponseTime: number;
}

const ResultTable: React.FC<ResultTableProps> = ({
    processes,
    averageWaitingTime,
    averageTurnaroundTime,
    averageResponseTime
}) => {
    const formatNumber = (num: number | undefined) => {
        if (num === undefined) return '-';
        return num.toFixed(1);
    };

    return (
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white p-4">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr className="bg-gradient-to-r from-indigo-500 to-indigo-600">
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Process ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Arrival Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Burst Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Completion Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Turnaround Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Waiting Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Response Time
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {processes.map((process, index) => (
                        <tr 
                            key={process.id}
                            className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                            style={{ transition: 'background-color 0.2s' }}
                        >
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: process.color }} />
                                    {process.id}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{formatNumber(process.arrivalTime)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{formatNumber(process.burstTime)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{formatNumber(process.completionTime)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{formatNumber(process.turnaroundTime)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{formatNumber(process.waitingTime)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-700">{formatNumber(process.responseTime)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-gray-100">
                        <td colSpan={7} className="px-6 py-4">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div className="bg-white p-3 rounded shadow-sm">
                                    <div className="text-gray-500 mb-1">Average Waiting Time</div>
                                    <div className="text-2xl font-semibold text-indigo-600">
                                        {averageWaitingTime.toFixed(2)}
                                    </div>
                                </div>
                                <div className="bg-white p-3 rounded shadow-sm">
                                    <div className="text-gray-500 mb-1">Average Turnaround Time</div>
                                    <div className="text-2xl font-semibold text-indigo-600">
                                        {averageTurnaroundTime.toFixed(2)}
                                    </div>
                                </div>
                                <div className="bg-white p-3 rounded shadow-sm">
                                    <div className="text-gray-500 mb-1">Average Response Time</div>
                                    <div className="text-2xl font-semibold text-indigo-600">
                                        {averageResponseTime.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default ResultTable;
