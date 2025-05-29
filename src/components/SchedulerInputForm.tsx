import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { Process, SchedulingAlgorithm, SchedulerResult } from '../utils/types';
import { fcfs } from '../algorithms/fcfs';
import { sjf } from '../algorithms/sjf';
import { srtf } from '../algorithms/srtf';
import { priority } from '../algorithms/priority';
import { roundRobin } from '../algorithms/roundRobin';

interface SchedulerInputFormProps {
    onSimulationComplete: (result: SchedulerResult, algorithm: SchedulingAlgorithm) => void;
}

const SchedulerInputForm: React.FC<SchedulerInputFormProps> = ({ onSimulationComplete }) => {
    const [processes, setProcesses] = useState<Process[]>([]);
    const [algorithm, setAlgorithm] = useState<SchedulingAlgorithm>('FCFS');
    const [timeQuantum, setTimeQuantum] = useState<number>(2);
    const [isPreemptive, setIsPreemptive] = useState<boolean>(false);
    const [newProcess, setNewProcess] = useState<Partial<Process>>({
        id: '',
        arrivalTime: 0,
        burstTime: 1,
        priority: 1,
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
    });

    const addProcess = () => {
        if (newProcess.id && newProcess.arrivalTime !== undefined && newProcess.burstTime) {
            setProcesses([...processes, newProcess as Process]);
            setNewProcess({
                id: '',
                arrivalTime: 0,
                burstTime: 1,
                priority: 1,
                color: '#' + Math.floor(Math.random()*16777215).toString(16)
            });
        }
    };

    const removeProcess = (id: string) => {
        setProcesses(processes.filter(p => p.id !== id));
    };

    const handleSimulate = () => {
        let result: SchedulerResult;

        switch (algorithm) {
            case 'FCFS':
                result = fcfs(processes);
                break;
            case 'SJF':
                result = sjf(processes);
                break;
            case 'SRTF':
                result = srtf(processes);
                break;
            case 'Priority':
                result = priority(processes, isPreemptive);
                break;
            case 'RoundRobin':
                result = roundRobin(processes, timeQuantum);
                break;
            default:
                return;
        }

        onSimulationComplete(result, algorithm);
    };

    const handleExportProcesses = () => {
        const blob = new Blob([JSON.stringify(processes, null, 2)], { type: 'application/json' });
        saveAs(blob, 'processes.json');
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target?.result as string);
                    if (Array.isArray(data)) {
                        setProcesses(data);
                    }
                } catch (error) {
                    console.error('Error parsing JSON file:', error);
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">CPU Scheduler Simulator</h2>
            
            {/* Algorithm Selection */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                    Scheduling Algorithm
                    <select
                        value={algorithm}
                        onChange={(e) => setAlgorithm(e.target.value as SchedulingAlgorithm)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="FCFS">First Come First Serve (FCFS)</option>
                        <option value="SJF">Shortest Job First (SJF)</option>
                        <option value="SRTF">Shortest Remaining Time First (SRTF)</option>
                        <option value="Priority">Priority Scheduling</option>
                        <option value="RoundRobin">Round Robin</option>
                    </select>
                </label>
            </div>

            {/* Algorithm specific settings */}
            {algorithm === 'RoundRobin' && (
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Time Quantum
                        <input
                            type="number"
                            min="1"
                            value={timeQuantum}
                            onChange={(e) => setTimeQuantum(parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </label>
                </div>
            )}

            {algorithm === 'Priority' && (
                <div className="mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={isPreemptive}
                            onChange={(e) => setIsPreemptive(e.target.checked)}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Preemptive</span>
                    </label>
                </div>
            )}

            {/* Process Input Form */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 mb-4">
                <input
                    type="text"
                    placeholder="Process ID"
                    value={newProcess.id}
                    onChange={(e) => setNewProcess({ ...newProcess, id: e.target.value })}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <input
                    type="number"
                    placeholder="Arrival Time"
                    value={newProcess.arrivalTime}
                    onChange={(e) => setNewProcess({ ...newProcess, arrivalTime: parseInt(e.target.value) })}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <input
                    type="number"
                    placeholder="Burst Time"
                    value={newProcess.burstTime}
                    onChange={(e) => setNewProcess({ ...newProcess, burstTime: parseInt(e.target.value) })}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {algorithm === 'Priority' && (
                    <input
                        type="number"
                        placeholder="Priority"
                        value={newProcess.priority}
                        onChange={(e) => setNewProcess({ ...newProcess, priority: parseInt(e.target.value) })}
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                )}
                <button
                    onClick={addProcess}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Add Process
                </button>
            </div>

            {/* Process List */}
            <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Processes</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Burst Time</th>
                                {algorithm === 'Priority' && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                )}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {processes.map((process) => (
                                <tr key={process.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{process.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{process.arrivalTime}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{process.burstTime}</td>
                                    {algorithm === 'Priority' && (
                                        <td className="px-6 py-4 whitespace-nowrap">{process.priority}</td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="w-6 h-6 rounded" style={{ backgroundColor: process.color }} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => removeProcess(process.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Import/Export */}
            <div className="mb-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Import Processes (JSON)
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleFileUpload}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                    </label>
                </div>
                
                {processes.length > 0 && (
                    <button
                        onClick={handleExportProcesses}
                        className="w-full inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Export Processes as JSON
                    </button>
                )}
            </div>

            {/* Simulate Button */}
            <button
                onClick={handleSimulate}
                disabled={processes.length === 0}
                className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400"
            >
                Simulate
            </button>
        </div>
    );
};

export default SchedulerInputForm;
