import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";

import { Bubble } from "react-chartjs-2";
import { DefaultBubbleChartConfig } from "../common/config/ChartConfigs"
import { DatasetType } from "../common/types/Simple";
import { RobotDataTransformationService } from "../services/RobotDataTransformationService";


ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

interface RobotLocationChartProps {
  range: [number, number]
}

const RobotLocationChart = (props: RobotLocationChartProps) => {
  const { range } = props;
  const [data, setdata] = useState<DatasetType>([]);

  useEffect(() => {
    const start = async () => {
      RobotDataTransformationService.parseData();
    };

    start();
  }, []);

  useEffect(() => {
    setdata(
      RobotDataTransformationService.GetBubbleChartDatasets(range[0], range[1])
    );
  }, [range]);

  return (
    <div id="chart-container">
      <Bubble width={"1000px"} options={DefaultBubbleChartConfig} data={{ datasets: data }} />
    </div>
  );
}

export default RobotLocationChart;
