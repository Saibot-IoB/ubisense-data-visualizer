import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";
import { useEffect, useState } from "react";

import { Bubble } from "react-chartjs-2";
import { BubbleChartDataType, DatasetType, EntityColors, UbisenseDataParserService } from "../services/UbisenseDataParserService";
import { TimeConverter } from "../util/Converters/TimeConverter";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export const ChartOptions = {
    plugins: {
        legend: {
            display: true,
            position: "right" as const,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            max: 25,
            min: 0,
            type: "linear" as const,
        },
        x: {
            max: 16,
            min: 0,
            type: "linear" as const,
        },
    },
    animation: {
        duration: 0,
    },
    maintainAspectRatio: false,
};

interface TimeGapChartProps {
    range: [number, number]
}

const TimeGapChart = (props: TimeGapChartProps) => {
    const { range } = props;
    const [data, setdata] = useState<DatasetType>([]);
    const [gapSizeThreshold, setGapSizeThreshold] = useState<number>(60);

    useEffect(() => {
        const start = async () => {
            const ubiData = await fetch("/experiment1.txt");
            UbisenseDataParserService.parseData(await ubiData.text(), true);

            setdata(convertTimeGapDataToChartData);
        };
        
        start();
    }, []);

    useEffect(() => {
        setdata(convertTimeGapDataToChartData);
    }, [props.range]);

    const convertTimeGapDataToChartData = (): DatasetType => {
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
    }

    return (
        <div id="chart-container">
            <Bubble options={ChartOptions} data={{ datasets: data }} />
        </div>
    );
}

export default TimeGapChart;
