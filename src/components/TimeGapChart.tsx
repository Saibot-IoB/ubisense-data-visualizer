import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useCallback, useEffect, useState } from "react";

import { Bubble } from "react-chartjs-2";
import { UbisenseDataParserService } from "../services/UbisenseDataParserService";
import { TimeConverter } from "../util/Converters/TimeConverter";
import { DefaultBubbleChartConfig } from "../common/config/ChartConfigs"
import { BubbleChartDataType, DatasetType } from "../common/types/Simple";
import { EntityColors } from "../common/constants/EntityConstants";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

interface TimeGapChartProps {
  range: [number, number]
}

const TimeGapChart = (props: TimeGapChartProps) => {
  const { range } = props;
  const [data, setdata] = useState<DatasetType>([]);
  const [gapSizeThreshold] = useState<number>(60);

  useEffect(() => {
    const start = async () => {
      const ubiData = await fetch("/experiment1.txt");
      UbisenseDataParserService.parseData(await ubiData.text(), true);
    };

    start();
  }, []);

  const convertTimeGapDataToChartData = useCallback((): DatasetType => {
    const timeGapsData = UbisenseDataParserService.findTimeGaps(gapSizeThreshold);
    const experimentStart = UbisenseDataParserService.GetExperimentInterval().start;
    const returnData: DatasetType = [];
    let index = 0;

    timeGapsData.forEach((gapData, key) => {
      const bubbleChartData: BubbleChartDataType[] = [];

      gapData.forEach(value => {
        if (
          TimeConverter.convertTimestampToSeconds(value.firstDataPoint.time) >= (range[0] + experimentStart) &&
          TimeConverter.convertTimestampToSeconds(value.firstDataPoint.time) <= (range[1] + experimentStart)
        ) {
          bubbleChartData.push({
            x: +value.firstDataPoint.x,
            y: +value.firstDataPoint.y,
            r: 6,
            label: `Entity: ${key} - Time Gap: ${value.timeGapSize} seconds`
          });
        }
      });

      returnData.push({
        label: key,
        data: bubbleChartData,
        backgroundColor: EntityColors[index]
      });

      index++;
    });

    return returnData;
  }, [gapSizeThreshold, range]);

  useEffect(() => {
    setdata(() => convertTimeGapDataToChartData());
  }, [props.range, convertTimeGapDataToChartData]);

  return (
    <div id="chart-container">
      <Bubble options={DefaultBubbleChartConfig} data={{ datasets: data }} />
    </div>
  );
};

export default TimeGapChart;
