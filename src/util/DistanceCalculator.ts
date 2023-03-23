import { LocationData } from "../common/types/Simple";

const allRobots: [string, string, string, string] = [
    "00:11:CE:00:00:00:CB:2C",
    "00:11:CE:00:00:00:CB:35",
    "00:11:CE:00:00:00:CB:25",
    "00:11:CE:00:00:00:CB:33"
];

const FunctioningRobots: [string, string, string] = [
    "00:11:CE:00:00:00:CB:35",
    "00:11:CE:00:00:00:CB:25",
    "00:11:CE:00:00:00:CB:33"
];

export const calculateRobotHumanDistances = (entityData: Map<string, LocationData[]>): Map<string, [string, number]> => {
    const returnMap: Map<string, [string, number]> = new Map();

    for (const [key, values] of entityData) {
        for (const [innerKey, innerValues] of entityData) {
            if (allRobots.includes(innerKey)) continue;

            for (const innerValue of innerValues) {
                const valuesAtSameTime = values.filter(v => v.time === innerValue.time);

                if (!valuesAtSameTime) continue;

                if (returnMap.has(key)) {
                    //returnMap.set(key, [innerKey, calculateEuclideanDistance(valuesAtSameTime[0],)])
                } else {

                }
            }
        }
    }


    return returnMap;
}

const calculateEuclideanDistance = (a: LocationData, b: LocationData) => {
    const ax = parseFloat(a.x);
    const ay = parseFloat(a.y);
    const bx = parseFloat(b.x);
    const by = parseFloat(b.y);

    return Math.sqrt(Math.pow((ax - bx), 2) + Math.pow((ay - by), 2));
}