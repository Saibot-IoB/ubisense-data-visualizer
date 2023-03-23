import {LocationData} from '../common/types/Simple';
import {TimeConverter} from './Converters/TimeConverter';
import {getExperimentInterval} from './ExperimentTimeUtil';
import {LocationChartType} from '../common/enums/LocationCharts';

const allRobots: [string, string, string, string] = [
    "4703",
    "4702",
    "4701",
    "White"
];

const FunctioningRobots: [string, string, string] = [
    "4702",
    "4701",
    "White"
];

export const calculateRobotHumanDistances = (entityData: Map<string, LocationData[]>, interval: number): Map<string, [string, [number, number | null]][]> => {
    const result = new Map<string, [string, [number, number | null]][]>();
    const allRobotsSet = new Set(allRobots);
    const startTime = getExperimentInterval(LocationChartType.UBISENSE_DATA).start;

    for (const entityId of FunctioningRobots) {
        const locationDataList = entityData.get(entityId);
        if (!locationDataList) {
            continue;
        }

        const participantEntities = Array.from(entityData.keys()).filter((id) => !allRobotsSet.has(id));

        const distances: [string, [number, number | null]][] = [];

        for (let i = 0; i < 3840; i += interval) {
            const locClosestTime = getClosestTimeStamp(
                TimeConverter.convertLocationDataTimestampsToSeconds(locationDataList),
                i
            );
            
            const locData = locationDataList.find((data) =>
                (TimeConverter.convertTimestampToSeconds(data.time) - startTime) === locClosestTime);

            for (const otherEntityId of participantEntities) {
                const otherLocationDataList = entityData.get(otherEntityId);
                if (!otherLocationDataList) {
                    continue;
                }
                
                const otherLocClosestTime = getClosestTimeStamp(
                    TimeConverter.convertLocationDataTimestampsToSeconds(otherLocationDataList),
                    i
                );
                
                let otherLocData: LocationData | undefined = otherLocationDataList.find((data) =>
                    TimeConverter.convertTimestampToSeconds(data.time) - startTime === otherLocClosestTime);
                
                let dist: number | null = null;

                if (locData && otherLocData) {
                    dist = calculateEuclideanDistance(
                        locData,
                        otherLocData
                    );
                }
                
                if (dist === null) {
                    distances.push([otherEntityId, [i, null]]);
                } else {
                    distances.push([otherEntityId, [i, dist]]);
                }
            }
        }

        result.set(entityId, distances);
    }

    return result;
}

const getClosestTimeStamp = (timestamps: number[], target: number): number => {
    const startTime = getExperimentInterval(LocationChartType.UBISENSE_DATA).start;
   
    for (let i = 0; i < timestamps.length; i++) {
        const ts = (timestamps[i] - startTime);
        
        if (ts > target) {
            if (ts > target + 3 || ts < target - 3) break;
            return timestamps[i - 1] - startTime;
        }
    }
    
    return -1;
}
    
const calculateEuclideanDistance = (a: LocationData, b: LocationData): number => {
    const ax = parseFloat(a.x);
    const ay = parseFloat(a.y);
    const bx = parseFloat(b.x);
    const by = parseFloat(b.y);

    return Math.sqrt(Math.pow((ax - bx), 2) + Math.pow((ay - by), 2));
}