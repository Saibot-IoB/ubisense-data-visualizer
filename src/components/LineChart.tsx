import {useEffect, useState} from 'react';
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
import {Line} from 'react-chartjs-2';
import {DefaultLineChartConfig} from '../common/config/ChartConfigs';
import {EntityDistanceResult, LineDatasetType} from '../common/types/Simple';
import {EntityColors, EntityToTagMap} from '../common/constants/EntityConstants';
import {TimeConverter} from '../util/Converters/TimeConverter';

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
    distanceData: EntityDistanceResult | null
}

let minTimestamp = Infinity;

const LineChart = (props: LineChartProps) => {
    const { range, distanceData } = props;
    const [data, setData] = useState<{ labels: string[]; datasets: LineDatasetType[] }>({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        if (distanceData) {
            const labels = extractAdjustedTimestamps(distanceData);
            const datasets = generateDataset(distanceData);

            setData({ labels, datasets });
        }
    }, [distanceData, range]);


    const extractAdjustedTimestamps = (distanceData: EntityDistanceResult): string[] => {
        const timestampSet = new Set<string>();

        distanceData.entityDistances.forEach((entityDistance) => {
            entityDistance.distances.forEach((distance) => {
                timestampSet.add(distance.time);
            });
        });
        
        const timestamps = Array.from(timestampSet);
        minTimestamp = Math.min(...timestamps.map(TimeConverter.timeStrToSeconds));
        
        return timestamps.map((time) => TimeConverter.secondsToTimeStr(
            TimeConverter.timeStrToSeconds(time) - minTimestamp)
        ).filter((time) => {
            const seconds = TimeConverter.timeStrToSeconds(time);
            return seconds >= range[0] && seconds <= range[1];
        });
    };

    const generateDataset = (distanceData: EntityDistanceResult): LineDatasetType[] => {
        const datasets: LineDatasetType[] = [];

        distanceData.entityDistances.forEach((entityDistance) => {
            const label = entityDistance.entityId;
            const borderColor = EntityColors[EntityToTagMap[entityDistance.entityId]];
            const backgroundColor = borderColor;

            const data = entityDistance.distances
                .filter((distance) => {
                    const seconds = TimeConverter.timeStrToSeconds(distance.time) - minTimestamp;
                    return seconds >= range[0] && seconds <= range[1];
                })
                .map((distance) => distance.distance);

            datasets.push({
                label,
                data,
                borderColor,
                backgroundColor,
            });
        });

        return datasets;
    };

    return (
        <div id="chart-container">
            <Line width={"1000px"} options={DefaultLineChartConfig} data={data} />
        </div>
    );
}

export default LineChart;
