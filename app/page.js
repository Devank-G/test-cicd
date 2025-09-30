'use client';
//test
import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { sendEmail } from './sendEmail';

// Ensure Chart.js scales and elements are registered.
// Chart.register();

const Dashboard = () => {
  // State to manage the WebSocket connection status
  const [status, setStatus] = useState('Connecting...');

  // Refs to hold the chart instances and canvas elements
  const cpuChartRef = useRef(null);
  const memoryChartRef = useRef(null);
  const networkChartRef = useRef(null);
  const cpuChartInstance = useRef(null);
  const memoryChartInstance = useRef(null);
  const networkChartInstance = useRef(null);

  const handleSendEmail = async () => {
    const result = await sendEmail({
      to: 'recipient@example.com',
      subject: 'Dashboard Alert',
      htmlContent: '<p>This is a test email from the dashboard.</p>',
    });
    console.log(result);
  };

  useEffect(() => {
    // ... existing useEffect code remains the same
    // --- Mock WebSocket Connection Simulation ---
    // Simulate a connection delay
    setTimeout(() => {
      setStatus('Connected');
    }, 1500);

    // --- Chart Configuration ---
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      layout: {
        padding: 20, // Added padding to prevent labels from being cut off
      },
      scales: {
        x: {
          display: false,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: '#9CA3AF',
          },
        },
        y: {
          beginAtZero: true,
          max: 100, // For CPU and Memory
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: '#9CA3AF',
          },
        },
      },
    };

    // Initialize charts and store instances in refs
    if (cpuChartRef.current) {
      cpuChartInstance.current = new Chart(cpuChartRef.current, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'CPU',
              data: [],
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              tension: 0.4,
              borderWidth: 2,
              fill: true,
            },
          ],
        },
        options: chartOptions,
      });
    }

    if (memoryChartRef.current) {
      memoryChartInstance.current = new Chart(memoryChartRef.current, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Memory',
              data: [],
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              tension: 0.4,
              borderWidth: 2,
              fill: true,
            },
          ],
        },
        options: chartOptions,
      });
    }

    if (networkChartRef.current) {
      networkChartInstance.current = new Chart(networkChartRef.current, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Network',
              data: [],
              borderColor: '#EF4444',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              tension: 0.4,
              borderWidth: 2,
              fill: true,
            },
          ],
        },
        options: {
          ...chartOptions,
          scales: {
            ...chartOptions.scales,
            y: {
              beginAtZero: true,
              max: 500,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
              },
              ticks: {
                color: '#9CA3AF',
              },
            },
          },
        },
      });
    }

    // --- Data Generation and Chart Update Loop ---
    const MAX_DATA_POINTS = 50;
    const interval = setInterval(() => {
      // Generate new random values
      const cpuValue = Math.floor(Math.random() * 100);
      const memoryValue = Math.floor(Math.random() * 100);
      const networkValue = Math.floor(Math.random() * 500);
      const timestamp = new Date().toLocaleTimeString();

      // Function to add data to a chart
      const addData = (chart, label, value) => {
        if (chart) {
          chart.data.labels.push(label);
          chart.data.datasets[0].data.push(value);
          if (chart.data.labels.length > MAX_DATA_POINTS) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
          }
          chart.update(); // Removed 'none' to enable smooth animation
        }
      };

      addData(cpuChartInstance.current, timestamp, cpuValue);
      addData(memoryChartInstance.current, timestamp, memoryValue);
      addData(networkChartInstance.current, timestamp, networkValue);
    }, 1000); // Update every 1 second

    // Cleanup function to destroy chart instances and clear the interval
    return () => {
      clearInterval(interval);
      if (cpuChartInstance.current) cpuChartInstance.current.destroy();
      if (memoryChartInstance.current) memoryChartInstance.current.destroy();
      if (networkChartInstance.current) networkChartInstance.current.destroy();
    };
  }, []); // Empty dependency array ensures this effect runs once on mount

  return (
    <div className="bg-gray-900 text-white p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-gray-200">Infrastructure Dashboard</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <button
              onClick={handleSendEmail}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
            >
              Send Email
            </button>
            <div className="flex items-center space-x-2">
              <span
                className={`w-3 h-3 rounded-full animate-pulse ${
                  status === 'Connected' ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></span>
              <span>
                WebSocket: <span className="font-semibold">{status}</span>
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* CPU Usage Chart Card */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 h-80">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">CPU Usage</h2>
            <canvas ref={cpuChartRef}></canvas>
          </div>

          {/* Memory Usage Chart Card */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 h-80">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">Memory Usage</h2>
            <canvas ref={memoryChartRef}></canvas>
          </div>

          {/* Network Traffic Chart Card */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 h-80">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">Network Traffic (Mbps)</h2>
            <canvas ref={networkChartRef}></canvas>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
