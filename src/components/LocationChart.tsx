import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";

import { Bubble } from "react-chartjs-2";
import { UbisenseDataParserService } from "../services/UbisenseDataParserService";
import { DefaultBubbleChartConfig } from "../common/config/ChartConfigs"
import { DatasetType } from "../common/types/Simple";


ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

interface LocationChartProps {
  range: [number, number]
}

const LocationChart = (props: LocationChartProps) => {
  const { range } = props;
  const [data, setdata] = useState<DatasetType>([]);

  useEffect(() => {
    const start = async () => {
      const ubiData = await fetch("/experiment1.txt");
      UbisenseDataParserService.parseData(await ubiData.text(), true);
    };

    start();
  }, []);

  useEffect(() => {
    setdata(
      UbisenseDataParserService.GetBubbleChartDatasets(range[0], range[1])
    );
  }, [range]);

  return (
    <div id="chart-container">
      <Bubble width={"1000px"} options={DefaultBubbleChartConfig} data={{ datasets: data }} />
    </div>
  );
}

export default LocationChart;
