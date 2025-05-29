import React, { useState } from 'react';
import SchedulerInputForm from './components/SchedulerInputForm';
import GanttChart from './components/GanttChart';
import ResultTable from './components/ResultTable';
import ComparisonChart from './components/ComparisonChart';
import { SchedulerResult, SchedulingAlgorithm } from './utils/types';
import { exportResultsAsPDF } from './utils/exportUtils';

const App: React.FC = () => {
    const [simulationResult, setSimulationResult] = useState<SchedulerResult | null>(null);
    const [currentAlgorithm, setCurrentAlgorithm] = useState<SchedulingAlgorithm>('FCFS');
    const [comparisonData, setComparisonData] = useState<{
        algorithm: string;
        avgWaitingTime: number;
        avgTurnaroundTime: number;
        avgResponseTime: number;
    }[]>([]);

    const handleSimulationComplete = (result: SchedulerResult, algorithm: SchedulingAlgorithm) => {
        setSimulationResult(result);
        setCurrentAlgorithm(algorithm);
        
        // Add to comparison data
        setComparisonData(prev => {
            // Remove previous result for this algorithm if it exists
            const filtered = prev.filter(d => d.algorithm !== algorithm);
            
            // Add new result
            return [...filtered, {
                algorithm,
                avgWaitingTime: result.averageWaitingTime,
                avgTurnaroundTime: result.averageTurnaroundTime,
                avgResponseTime: result.averageResponseTime
            }];
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-7xl sm:mx-auto">
                <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
                    <div className="max-w-full mx-auto">
                        <div className="divide-y divide-gray-200">
                            <SchedulerInputForm onSimulationComplete={handleSimulationComplete} />
                            
                            {simulationResult && (
                                <div className="pt-6 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-medium">Simulation Results</h3>
                                        <button
                                            onClick={() => exportResultsAsPDF(simulationResult, currentAlgorithm)}
                                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Export as PDF
                                        </button>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <h4 className="text-md font-medium mb-2">Gantt Chart</h4>
                                        <GanttChart data={simulationResult.ganttChart} />
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-md font-medium mb-2">Process Metrics</h4>
                                        <ResultTable 
                                            processes={simulationResult.processes}
                                            averageWaitingTime={simulationResult.averageWaitingTime}
                                            averageTurnaroundTime={simulationResult.averageTurnaroundTime}
                                            averageResponseTime={simulationResult.averageResponseTime}
                                        />
                                    </div>

                                    {comparisonData.length > 1 && (
                                        <div>
                                            <h4 className="text-md font-medium mb-2">Algorithm Comparison</h4>
                                            <ComparisonChart data={comparisonData} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
