import { LocationChartType } from '../common/enums/LocationCharts';
import { BubbleDatasetType, LocationData } from '../common/types/Simple';
import { RobotToUbiLocationConverter } from '../util/Converters/RobotToUbiLocationConverter';
import { TimeFormatter } from "../util/Formatters/TimeFormatter";
import { generateBubbleChartDataset } from './ChartDataGenerators';

export class RobotDataParser {
    public static dataCache: Map<string, LocationData[]> = new Map<string, LocationData[]>();

    public static async parseData() {
        const robotData: Map<string, string> = new Map();

        const robotWhiteData = await fetch("/robot-data/robot_pose_white.csv");
        const robot4701Data = await fetch("/robot-data/robot_pose_4701.csv");
        const robot4702Data = await fetch("/robot-data/robot_pose_4702.csv");

        const dataWhite = await robotWhiteData.text();
        const data4701 = await robot4701Data.text();
        const data4702 = await robot4702Data.text();

        robotData.set("White", dataWhite);
        robotData.set("4701", data4701);
        robotData.set("4702", data4702);

        for (const [key, value] of robotData) {
            const lines: string[] = value.split("\n");
            lines.shift();
    
            lines.forEach((line: string) => {
                const lineSegments: string[] = line.replace(/\0/g, "").split(",");
    
                let time: string = lineSegments[0];
                const x: number = parseFloat(lineSegments[2]);
                const y: number = parseFloat(lineSegments[3]);
    
                const formattedTime = TimeFormatter.formatEpochNanosecondsToTimestamp(time);
                const tag: string = key;
    
                if (!this.dataCache.has(tag)) {
                    this.dataCache.set(tag, []);
                }
                const dataList = this.dataCache.get(tag);
                if (dataList && !dataList.some(dataPoint => dataPoint.time === formattedTime)) {
                    const { tx, ty } = RobotToUbiLocationConverter.transformPoint({ x, y });
                    dataList.push({ time: formattedTime, tag, x: tx.toString(), y: ty.toString() });
                }
            });
        }
    }

    public static GetBubbleChartDatasets(rangeStart: number, rangeEnd: number): BubbleDatasetType {
        return generateBubbleChartDataset(this.dataCache, rangeStart, rangeEnd, LocationChartType.ROBOT_DATA);
    }
}
