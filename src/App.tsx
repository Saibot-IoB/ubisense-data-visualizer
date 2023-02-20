import './App.css';

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';

import { useEffect, useRef, useState } from 'react';
import { DatasetType, UbisenseDataParserService } from './services/UbisenseDataParserService';
import { RangeSlider } from '@mantine/core';

import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa';
import { UbisenseDataAnalyzerService } from './services/UbisenseDataAnalyzerService';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export const options = {
  plugins: {
    legend: {
      display: true,
      position: 'right' as const,

    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 25,
      min: 0,
      type: 'linear' as const,
    },
    x: {
      max: 16,
      min: 0,
      type: 'linear' as const,
    }
  },
  animation: {
    duration: 0
  },
  maintainAspectRatio: false,
};

function App() {
  const [data, setdata] = useState<DatasetType>([]);
  const [range, setrange] = useState<[number, number]>([0, 300]);
  const [duration, setDuration] = useState<{ start: number, end: number }>({ start: 0, end: 0 });
  const intervalInputElement = useRef<HTMLInputElement>(null);

  const formatSecondsToTimeString = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    console.log(seconds);
    return date.toISOString().substring(11, 19);
  }

  useEffect(() => {
    const start = async () => {
      const ubiData = await fetch('/experiment1.txt');
      UbisenseDataParserService.parseData(await ubiData.text(), true);

      setdata(UbisenseDataParserService.GetBubbleChartDatasets(range[0], range[1]));
      setDuration(UbisenseDataParserService.GetExperimentDuration())
    }

    start();
  }, []);

  useEffect(() => {
    const analyzer = new UbisenseDataAnalyzerService();

    console.log(analyzer.LargestGapInData());
    console.log(analyzer.SmallestGapInData());
    console.log(analyzer.AverageGapInData());
    console.log(analyzer.countDataByInterval(120, UbisenseDataParserService.GetParsedData()));
  }, [data])


  useEffect(() => {
    setdata(UbisenseDataParserService.GetBubbleChartDatasets(range[0], range[1]));
  }, [range]);

  const handleDecrementInterval = () => {
    if ((range[0] - parseInt(intervalInputElement.current!.value)) >= 0) {
      setrange([
        range[0] -= parseInt(intervalInputElement.current!.value),
        range[1] -= parseInt(intervalInputElement.current!.value)
      ]);
    } else {
      setrange([
        range[0] = 0,
        range[1]
      ]);
    }
  }

  const handleIncrementInterval = () => {
    if ((range[0] + parseInt(intervalInputElement.current!.value)) <= duration.end) {
      setrange([
        range[0] += parseInt(intervalInputElement.current!.value),
        range[1] += parseInt(intervalInputElement.current!.value)
      ]);
    } else {
      setrange([
        range[0],
        range[1] = duration.end
      ]);

    }
  }

  return (
    <div className='outer-wrapper'>
      <div id='chart-container'>
        <Bubble options={options} data={{ datasets: data }} />
      </div>
      <div className='slider-container'>
        <RangeSlider
          thumbSize={20}
          label={formatSecondsToTimeString(range[0]) + " ---" + formatSecondsToTimeString(range[1])}
          min={duration.start}
          max={duration.end}
          mt="xl"
          defaultValue={range}
          onChangeEnd={e => setrange(e)}
          value={range}
        />
      </div>
      <div className='timeLabel-container'>
        <p>{formatSecondsToTimeString(duration.start)}</p>
        <p>{formatSecondsToTimeString(duration.end)}</p>
      </div>
      <div id='intervalButtons-container'>
        <p>{formatSecondsToTimeString(range[0]) + " ---" + formatSecondsToTimeString(range[1])}</p>
        <div className='intervalButtons-innerContainer'>
          <FaChevronCircleLeft className='pointer' size={30} onClick={handleDecrementInterval} />
          <input type="number" defaultValue={5} ref={intervalInputElement} />
          <FaChevronCircleRight className='pointer' size={30} onClick={handleIncrementInterval} />
        </div>
      </div>
    </div>
  )
}

export default App;
