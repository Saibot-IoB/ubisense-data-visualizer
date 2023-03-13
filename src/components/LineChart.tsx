import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { LineDatasetType } from '../common/types/Simple';
import { defaultLineChartConfig } from '../common/config/ChartConfigs';

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

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [1, 2, 3, 4, 5, 6, 7, 66, 4, 6, 2, 1, 2],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: [1, 2, 3, 4, 5, 6, 7, 66, 4, 6, 2, 1, 2],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

const LineChart = (props: LineChartProps) => {
  const { range } = props;
  const [data, setdata] = useState<LineDatasetType>([]);

  useEffect(() => {
    const start = async () => {
      // Get the data to plot

      // const ubiData = await fetch("/experiment1.txt");
      // UbisenseDataParserService.parseData(await ubiData.text(), true);
    };

    start();
  }, []);

  useEffect(() => {
    // Update data when range changes

    // setdata(

    // );

  }, [range]);

  return (
    <div id="chart-container">
      <Line width={"1000px"} options={defaultLineChartConfig} data={{ datasets: data }} />
    </div>
  );
}

export default LineChart;
