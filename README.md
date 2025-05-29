# CPU Scheduler Simulator

An interactive web application that demonstrates various CPU scheduling algorithms with real-time visualization using Gantt charts.

## Features

- Support for multiple scheduling algorithms:
  - First Come First Serve (FCFS)
  - Shortest Job First (SJF)
  - Shortest Remaining Time First (SRTF)
  - Priority Scheduling (Preemptive/Non-preemptive)
  - Round Robin
- Interactive process input form
- Real-time Gantt chart visualization using D3.js
- Detailed metrics calculation:
  - Completion Time
  - Turnaround Time
  - Waiting Time
  - Response Time
- Process import/export functionality
- Modern UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
\`\`\`bash
git clone  https://github.com/Heisenberg-tesla/cpu-scheduler-simulator.git
cd cpu-scheduler-simulator
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm start
\`\`\`

The application will be available at http://localhost:3000

## Usage

1. Select a scheduling algorithm from the dropdown menu
2. Add processes by filling in the process details:
   - Process ID
   - Arrival Time
   - Burst Time
   - Priority (for Priority Scheduling)
3. Set additional parameters if required:
   - Time Quantum (for Round Robin)
   - Preemptive mode (for Priority Scheduling)
4. Click "Simulate" to run the scheduler
5. View the results in the Gantt chart and metrics table

## Built With

- React.js
- TypeScript
- D3.js
- Tailwind CSS

## License

This project is licensed under the MIT License - see the LICENSE file for details.
