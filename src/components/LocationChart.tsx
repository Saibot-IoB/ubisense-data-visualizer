
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";
import { useEffect, useState } from "react";

import { Bubble } from "react-chartjs-2";
import { DatasetType, UbisenseDataParserService } from "../services/UbisenseDataParserService";

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
            max: 23,
            min: 0,
            type: "linear" as const,
            grid: {
                display: false
              }
        },
        x: {
            max: 11,
            min: 0,
            type: "linear" as const,
            grid: {
                display: false
            }
        },
    },
    animation: {
        duration: 0,
    },
    maintainAspectRatio: true,
    aspectRatio: 0.5
};

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

            setdata(
                UbisenseDataParserService.GetBubbleChartDatasets(range[0], range[1])
            );
        };

        start();
    }, []);

    // useEffect(() => {
    //     const analyzer = new UbisenseDataAnalyzerService();

    //     console.log(analyzer.GetExtremeGapInData(isGreater, 60));
    //     console.log(analyzer.GetExtremeGapInData(isSmaller, 60));
    //     console.log(analyzer.AverageGapInData(60));
    //     console.log(
    //         analyzer.countDataByInterval(
    //             120,
    //             UbisenseDataParserService.GetParsedData()
    //         )
    //     );
    // }, [data]);

    useEffect(() => {
        setdata(
            UbisenseDataParserService.GetBubbleChartDatasets(props.range[0], props.range[1])
        );
    }, [range]);

    return (
        <div id="chart-container">
            <Bubble options={ChartOptions} data={{ datasets: data }} />
        </div>
    );
}

export default LocationChart;
