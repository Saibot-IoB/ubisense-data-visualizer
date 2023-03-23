import { match, P } from "ts-pattern";
import { LocationChartType } from "../common/enums/LocationCharts";
import { LocationData } from "../common/types/Simple";
import { RobotDataParser } from "../services/RobotDataParser";
import { UbisenseDataParser } from "../services/UbisenseDataParser";

export const getExperimentInterval = (chart: LocationChartType): { start: number; end: number; } => {
    const timeArr: number[] = [];

    const dataCache = match(chart)
        .with(LocationChartType.ROBOT_DATA, () => RobotDataParser.dataCache)
        .with(LocationChartType.UBISENSE_DATA, () => UbisenseDataParser.dataCache)
        .with(LocationChartType.TIME_GAP_DATA, () => UbisenseDataParser.dataCache)
        .with(P._, () => undefined)
        .exhaustive();

    if (!dataCache) {
        alert("Could not calculate the experiment duration of the provided chart type");
        return { start: 0, end: 0 };
    }

    dataCache.forEach((value) => {
        value.forEach((e: LocationData) => {
            const timeArrStr = e.time.split(":");
            timeArr.push(
                parseInt(timeArrStr[0]) * 60 * 60 +
                parseInt(timeArrStr[1]) * 60 +
                parseInt(timeArrStr[2])
            );
        });
    });

    return { start: Math.min(...timeArr), end: Math.max(...timeArr) };
};

export const getExperimentDuration = (chart: LocationChartType): { start: number; end: number; } => {
    const interval = getExperimentInterval(chart);

    if ((interval && !(interval.start === Infinity || interval.end === -Infinity)) // If interval is valid
    ) {
        return { start: 0, end: interval.end - interval.start };
    }

    return { start: 0, end: 0 };
};

