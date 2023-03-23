import { EntityColors, EntityToTagMap } from "../common/constants/EntityConstants";
import { LocationChartType } from "../common/enums/LocationCharts";
import { BubbleChartDataType, BubbleDatasetType, LocationData } from "../common/types/Simple";
import { TimeConverter } from "../util/Converters/TimeConverter";
import { getExperimentInterval } from "../util/ExperimentTimeUtil";
import {calculateRobotHumanDistances} from '../util/DistanceCalculator';

export const generateBubbleChartDataset = (locationData: Map<string, LocationData[]>, rangeStart: number, rangeEnd: number, chart: LocationChartType, bubbleRadius?: number) =>  {
    const datasets: BubbleDatasetType = [];
    const experimentStart = getExperimentInterval(chart).start;
    
    console.log(calculateRobotHumanDistances(locationData, 20));

    locationData.forEach((value, key) => {
        const currentArr: BubbleChartDataType[] = [];

        value.forEach((extractedData: LocationData) => {
            const timeInSeconds = TimeConverter.convertTimestampToSeconds(extractedData.time);

            if (
                timeInSeconds >= (rangeStart + experimentStart) &&
                timeInSeconds <= (rangeEnd + experimentStart)
            ) {
                currentArr.push({
                    x: parseFloat(extractedData.x),
                    y: parseFloat(extractedData.y),
                    r: bubbleRadius || 3
                });
            }
        });

        datasets.push({
            label: key,
            data: currentArr,
            backgroundColor: EntityColors[EntityToTagMap[key]],
        });
    });

    return datasets;
}

