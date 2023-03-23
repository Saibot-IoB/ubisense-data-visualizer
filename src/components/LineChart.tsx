import { useEffect, useState } from 'react';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { defaultLineChartConfig } from '../common/config/ChartConfigs';
import { LineDataType } from "../common/types/Simple";
import {calculateRobotHumanDistances} from "../util/DistanceCalculator";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  range: [number, number]
}

const LineChart = (props: LineChartProps) => {
  const { range } = props;
  const [data, setdata] = useState<LineDataType | []>([]);

  //  TOOOOOOOOO BE REPLACE

  const start = range[0];
  const end = range[1];
  const diff = Math.abs(start - end);
  const timeStampLabelGenerator = (startTime: number, endTime: number) => {
    const labels: string[] = [];

    for (let i = startTime; i <= endTime; i += 20) {
      const hours = Math.floor(i / 3600);
      const minutes = Math.floor((i - (hours * 3600)) / 60);
      const seconds = i % 60;

      const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
      const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

      let label = `${minutesStr}:${secondsStr}`;
      if (hours > 0) {
        label = `${hoursStr}:${label}`;
      }

      labels.push(label);
    }
    return labels;
  }
  const labels = timeStampLabelGenerator(start, end);

  const GenerateRandomNumberArr = (duration: number) => {
    const numbers = [];

    for (let i = 0; i < (duration / 20); i++) {
      const randomNum = Math.floor(Math.random() * 80) + 1;
      numbers.push(randomNum);
    }
    return numbers;
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Person 1',
        data: GenerateRandomNumberArr(diff),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Person 2',
        hidden: true,
        data: GenerateRandomNumberArr(diff),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Person 3',
        hidden: true,
        data: GenerateRandomNumberArr(diff),
        borderColor: 'rgb(238, 115, 4)',
        backgroundColor: 'rgba(238, 115, 4, 0.5)',
      },
      {
        label: 'Person 4',
        hidden: true,
        data: GenerateRandomNumberArr(diff),
        borderColor: 'rgb(40, 175, 123)',
        backgroundColor: 'rgba(40, 175, 123, 0.5)',
      },
      {
        label: 'Person 5',
        hidden: true,
        data: GenerateRandomNumberArr(diff),
        borderColor: 'rgb(69, 53, 181)',
        backgroundColor: 'rgba(69, 53, 181, 0.5)',
      },
    ],
  };

  //  TOOOOOOOOO BE REPLACE STOP

  useEffect(() => {
    const start = async () => {
      
      console.log(calculateRobotHumanDistances(locationData , 20));
      
    setdata(chartData);
     };

    start();
  }, []);

  useEffect(() => {
    setdata(chartData);
  }, [range]);

  return (
    <div id="chart-container">
      <Line width={"1000px"} options={defaultLineChartConfig} data={chartData} />
    </div>
  );
}

export default LineChart;
