⚙️ CPU Scheduler Simulator
An interactive web application that demonstrates various CPU scheduling algorithms through real-time Gantt chart visualization. Ideal for learning and teaching OS concepts.


🚀 Features:
🧠 Multiple CPU Scheduling Algorithms:

⏱️ First Come First Serve (FCFS)
📏 Shortest Job First (SJF)
⏲️ Shortest Remaining Time First (SRTF)
🎯 Priority Scheduling (Preemptive & Non-preemptive)
🔄 Round Robin
📝 Interactive Process Input Form
📊 Real-Time Gantt Chart Visualization (via D3.js)
📈 Detailed Metrics Calculation:
✅ Completion Time
🔁 Turnaround Time
⌛ Waiting Time
🚦 Response Time
📥 Import/Export Process Data
🧑‍🎨 Modern UI with Tailwind CSS

🛠️ Getting Started
📋 Prerequisites
Node.js v14+

npm v6+

📦 Installation
bash
git clone https://github.com/Heisenberg-tesla/cpu-scheduler-simulator.git
cd cpu-scheduler-simulator

bash
npm install

bash
npm start
💡 The app runs locally at http://localhost:3000

🎮 Usage
🎛️ Select a scheduling algorithm from the dropdown menu
➕ Add process details:
🆔 Process ID
🚪 Arrival Time
🔧 Burst Time
🏷️ Priority (for Priority Scheduling)

⚙️ Set additional options:

⏱️ Time Quantum (for Round Robin)
🔃 Preemptive mode toggle
🧪 Click Simulate to visualize the scheduling
📊 Analyze results via Gantt Chart & Metrics Table

🧰 Built With
⚛️ React.js
🟦 TypeScript
📉 D3.js
🎨 Tailwind CSS


📄 License
This project is licensed under the MIT License — see the LICENSE file for details.

