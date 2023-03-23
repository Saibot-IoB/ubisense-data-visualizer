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
import {LineDataType, LineDatasetType} from '../common/types/Simple';
import {EntityColors, EntityToTagMap} from '../common/constants/EntityConstants';

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
  range: [number, number],
  distanceData: Map<string, [string, [number, (number | null)]][]> | null,
  robotId: string,
}

const LineChart = (props: LineChartProps) => {
  const { range, distanceData, robotId } = props;
  const [data, setdata] = useState<LineDataType>({labels: [], datasets: []});

  useEffect(() => {
    if (distanceData) {
        const entity = distanceData.get(robotId);
        
        if (entity) {
            const data: LineDataType = {
                labels: timeStampLabelGenerator(0, 3840),
                datasets: generateDataset(entity)
            }

            setdata(data);
        }
    }
  }, [distanceData]);

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
  //const labels = timeStampLabelGenerator(start, end);

  const GenerateRandomNumberArr = (duration: number) => {
    const numbers = [];

    for (let i = 0; i < (duration / 20); i++) {
      const randomNum = Math.floor(Math.random() * 80) + 1;
      numbers.push(randomNum);
    }
    return numbers;
  }
  
  const generateDataset = (data: [string, [number, (number | null)]][]): LineDatasetType  => {
    const p1: {label: string, hidden?: boolean, data: number[], borderColor: string, backgroundColor: string} = {
        label: 'Participant 1',
        data: [],
        borderColor: EntityColors[EntityToTagMap['Participant 1']],
        backgroundColor: EntityColors[EntityToTagMap['Participant 1']],
    };
    const p2: {label: string, hidden?: boolean, data: number[], borderColor: string, backgroundColor: string} = {
      label: 'Participant 2',
      data: [],
      borderColor: EntityColors[EntityToTagMap['Participant 2']],
      backgroundColor: EntityColors[EntityToTagMap['Participant 2']],
    };
    const p3: {label: string, hidden?: boolean, data: number[], borderColor: string, backgroundColor: string} = {
      label: 'Participant 3',
      data: [],
      borderColor: EntityColors[EntityToTagMap['Participant 3']],
      backgroundColor: EntityColors[EntityToTagMap['Participant 3']],
    };
    const p4: {label: string, hidden?: boolean, data: number[], borderColor: string, backgroundColor: string} = {
      label: 'Participant 4',
      data: [],
      borderColor: EntityColors[EntityToTagMap['Participant 4']],
      backgroundColor: EntityColors[EntityToTagMap['Participant 4']],
    };
    const p5: {label: string, hidden?: boolean, data: number[], borderColor: string, backgroundColor: string} = {
      label: 'Participant 5',
      data: [],
      borderColor: EntityColors[EntityToTagMap['Participant 5']],
      backgroundColor: EntityColors[EntityToTagMap['Participant 5']],
    };
    
    for (let i = 0; i < data.length; i++) {
      switch (data[i][0]) {
        case 'Participant 1':
          // @ts-ignore
          p1.data.push(data[i][1][1]);
          break;
        case 'Participant 2':
          // @ts-ignore
          p2.data.push(data[i][1][1]);
          break;
        case 'Participant 3':
            // @ts-ignore// @ts-ignore
            p3.data.push(data[i][1][1]);
          break;
        case 'Participant 4':
            // @ts-ignore
            p4.data.push(data[i][1][1]);
          break;
        case 'Participant 5':
            // @ts-ignore
            p5.data.push(data[i][1][1]);
          break;
      }
    }
    
    return [p1, p2, p3, p4, p5];
  }

 /* const chartData = {
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
  };*/

  /*useEffect(() => {
    setdata(chartData);
  }, [range]);*/

  return (
    <div id="chart-container">
      <Line width={"1000px"} options={defaultLineChartConfig} data={data} />
    </div>
  );
}

export default LineChart;
