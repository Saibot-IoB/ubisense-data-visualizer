import { applyToPoint, compose, flipY, toString, translate } from 'transformation-matrix';
import { EntityColors } from "../common/constants/EntityConstants";
import { BubbleChartDataType, DatasetType, ExtractedDataType } from "../common/types/Simple";
import { TimeConverter } from "../util/Converters/TimeConverter";
import { TimeFormatter } from "../util/Formatters/TimeFormatter";

const matrix = compose(
    translate(22, 1),
    flipY()
);

export class RobotDataTransformationService {
    private static dataCache: Map<string, ExtractedDataType[]> = new Map<string, ExtractedDataType[]>();

    public static async parseData() {

        const robotData = await fetch("/robot_pose.csv");
        const data = await robotData.text();

        const lines: string[] = data.split("\n");
        lines.shift();

        lines.forEach((line: string) => {
            const lineSegments: string[] = line.replace(/\0/g, "").split(",");

            let time: string = lineSegments[0];
            const x: number = parseFloat(lineSegments[2]);
            const y: number = parseFloat(lineSegments[3]);

            const formattedTime = TimeFormatter.formatEpochNanosecondsToTimestamp(time);
            const tag: string = "White";

            if (!this.dataCache.has(tag)) {
                this.dataCache.set(tag, []);
            }
            const dataList = this.dataCache.get(tag);
            if (dataList && !dataList.some(dataPoint => dataPoint.time === formattedTime)) {
                const { tx, ty } = this.transformPoint({ x, y });
                dataList.push({ time: formattedTime, tag, x: tx.toString(), y: ty.toString() });
            }
        });

        console.log(toString(matrix));
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
                label: "White",
                data: currentArr,
                backgroundColor: EntityColors[index],
            });

            index++;
        });

        return datasets;
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

    private static transformPoint(dataPoint: { x: number, y: number }): { tx: number, ty: number } {
        const { x, y } = applyToPoint(matrix, dataPoint);
        return { tx: x, ty: y };
    }
}
