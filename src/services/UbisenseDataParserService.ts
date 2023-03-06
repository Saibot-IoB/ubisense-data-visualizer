import { TimeConverter } from "../util/Converters/TimeConverter";

export type ExtractedDataType = {
    time: string;
    tag: string;
    x: string;
    y: string;
};

export type TimeGapData = {
    firstDataPoint: ExtractedDataType;
    secondDataPoint: ExtractedDataType;
    timeGapSize: number;
};

export type BubbleChartDataType = {
    x: number;
    y: number;
    r: number;
    label?: string;
};

export type DatasetType = {
    label: string;
    data: BubbleChartDataType[];
    backgroundColor: string;
}[];

export const TagToEntityMap: Record<string, string> = {
    "00:11:CE:00:00:00:CB:34": "Participant 5",
    "00:11:CE:00:00:00:CB:23": "Participant 4",
    "00:11:CE:00:00:00:CB:2B": "Participant 3",
    "00:11:CE:00:00:00:CB:29": "Participant 2",
    "00:11:CE:00:00:00:CB:2E": "Participant 1",
    "00:11:CE:00:00:00:CB:35": "4701",
    "00:11:CE:00:00:00:CB:25": "4702",
    "00:11:CE:00:00:00:CB:2C": "4703",
    "00:11:CE:00:00:00:CB:33": "White",
};

export const EntityColors: string[] = [
    "rgba(233, 30, 99), 0.5)",
    "rgba(156, 39, 17, 0.5)",
    "rgba(3, 169, 24, 0.5)",
    "rgba(0, 150, 136, 0.5)",
    "rgba(255, 235, 59, 0.5)",
    "rgba(255, 152, 0, 0.5)",
    "rgba(255, 87, 34, 0.5)",
    "rgba(121, 85, 72, 0.5)",
    "rgba(96, 125, 13, 0.5)",
];

export class UbisenseDataParserService {
    public static dataCache: Map<string, ExtractedDataType[]> = new Map<string, ExtractedDataType[]>();
    public static participant5: BubbleChartDataType[] = [];
    public static participant4: BubbleChartDataType[] = [];
    public static robot1: BubbleChartDataType[] = [];

    public static parseData(data: string, valid: boolean) {
        const lines: string[] = data.split("\n");
        lines.shift();

        lines.forEach((line: string) => {
            line = line.replace(/\0/g, "");

            const time: string = line.substring(7, 15);
            const tag: string = line.substring(21, 44);
            const dataValid: string = line.substring(53, 55);
            const x: string = line.substring(63, 68).trim();
            const y: string = line.substring(71, 76).trim();
            // variance has index (90, 94)

            if (valid ? dataValid === "ok" : dataValid !== "ok") {
                if (!this.dataCache.has(tag)) {
                    this.dataCache.set(tag, []);
                }
                const dataList = this.dataCache.get(tag);
                if (dataList && !dataList.some(dataPoint => dataPoint.time === time)) {
                    dataList.push({ time, tag, x, y });
                }
            }
        });
    }

    public static findTimeGaps(timeGapThreshold: number): Map<string, TimeGapData[]> {
        const result: Map<string, TimeGapData[]> = new Map();
        this.GetParsedData().forEach((dataList, id) => {
            const timeGapDataList: TimeGapData[] = [];
            for (let i = 0; i < dataList.length - 1; i++) {
                const firstDataPoint = dataList[i];
                const secondDataPoint = dataList[i + 1];
                const timeGapSize =
                    TimeConverter.convertTimestampToSeconds(secondDataPoint.time) -
                    TimeConverter.convertTimestampToSeconds(firstDataPoint.time);

                if (timeGapSize > timeGapThreshold) {
                    timeGapDataList.push({ firstDataPoint, secondDataPoint, timeGapSize });
                }
            }
            if (timeGapDataList.length > 0) {
                result.set(TagToEntityMap[id], timeGapDataList);
            }
        });

        return result;
    }

    public static findAverageWithoutLargetsNGaps(filterNGaps: number): Map<string, [number, number]> {
        const result: Map<string, [number, number]> = new Map();
        this.GetParsedData().forEach((dataList, id) => {
            const timeGaps: number[] = [];

            for (let i = 0; i < dataList.length - 1; i++) {
                const firstDataPoint = dataList[i];
                const secondDataPoint = dataList[i + 1];
                const timeGapSize =
                    TimeConverter.convertTimestampToSeconds(secondDataPoint.time) -
                    TimeConverter.convertTimestampToSeconds(firstDataPoint.time);

                timeGaps.push(timeGapSize);
            }

            timeGaps.sort((a: number, b: number) => {
                return b - a;
            });

            if (timeGaps.length > filterNGaps) {
                result.set(
                    id, 
                    [
                        timeGaps.reduce((a, b) => a + b) / timeGaps.length,
                        timeGaps.slice(filterNGaps).reduce((a, b) => a + b) / (timeGaps.length - filterNGaps)
                    ]
                );
            } else {
                result.set(
                    id, 
                    [
                        timeGaps.reduce((a, b) => a + b) / timeGaps.length,
                        Infinity
                    ]
                );
            }
        
        });

        return result;
    }

    public static GetParsedData() {
        return new Map(this.dataCache);
    }

    public static GetExperimentDuration(): { start: number; end: number } | undefined {
        const timeArr: number[] = [];

        this.dataCache.forEach((value, key) => {
            value.forEach((e: ExtractedDataType) => {
                const timeArrStr = e.time.split(":");
                timeArr.push(
                    parseInt(timeArrStr[0]) * 60 * 60 +
                    parseInt(timeArrStr[1]) * 60 +
                    parseInt(timeArrStr[2])
                );
            });
        });

        if (timeArr.length === 0) return undefined;
        return { start: 0, end: Math.max(...timeArr) - Math.min(...timeArr) };
    }

    public static GetExperimentInterval(): { start: number; end: number } {
        const timeArr: number[] = [];

        this.dataCache.forEach((value, key) => {
            value.forEach((e: ExtractedDataType) => {
                const timeArrStr = e.time.split(":");
                timeArr.push(
                    parseInt(timeArrStr[0]) * 60 * 60 +
                    parseInt(timeArrStr[1]) * 60 +
                    parseInt(timeArrStr[2])
                );
            });
        });

        return { start: Math.min(...timeArr), end: Math.max(...timeArr) };
    }

    public static GetBubbleChartDatasets(rangeStart: number, rangeEnd: number): DatasetType {
        let index = 0;
        const datasets: DatasetType = [];

        this.dataCache.forEach((value, key) => {
            const currentArr: BubbleChartDataType[] = [];
            const experimentStart = this.GetExperimentInterval().start;

            value.forEach((extractedData: ExtractedDataType) => {
                const timeInSeconds = TimeConverter.convertTimestampToSeconds(extractedData.time);

                if (
                    timeInSeconds >= (rangeStart + experimentStart) &&
                    timeInSeconds <= (rangeEnd + experimentStart)
                ) {
                    currentArr.push({
                        x: parseFloat(extractedData.x),
                        y: parseFloat(extractedData.y),
                        r: 3
                    });
                }
            });

            datasets.push({
                label: TagToEntityMap[key],
                data: currentArr,
                backgroundColor: EntityColors[index],
            });

            index++;
        });

        return datasets;
    }
}
