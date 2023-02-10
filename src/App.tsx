import './App.css';

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';

import { useEffect } from 'react';
import { UbisenseDataParserService } from './services/UbisenseDataParserService';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export const options = {
  plugins: {
    legend: {
      display: true,
      position: 'right' as const
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    }
  },
  maintainAspectRatio: false,
};

export const data = {
  datasets: [
    {
      label: 'Participant 5',
      data: UbisenseDataParserService.participant5,
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Participant 4',
      data: UbisenseDataParserService.participant4,
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
    {
      label: 'Robot 1 ',
      data: UbisenseDataParserService.robot1,
      backgroundColor: 'rgba(50, 245, 111, 0.5)',
    },
  ],
};

function App() {
  useEffect(() => {
    const start = async () => {
      const ubiData = await fetch('/experiment1.txt');
      UbisenseDataParserService.parseData(await ubiData.text());
    }

    start();
  }, []);

  return (
    <div id='chart-container'>
      <Bubble options={options} data={data} />;
    </div>
  )
}

export default App;
