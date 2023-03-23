import { TagToEntityMap } from "../common/constants/EntityConstants";
import { LocationChartType } from "../common/enums/LocationCharts";
import { BubbleDatasetType, LocationData } from "../common/types/Simple";
import { generateBubbleChartDataset } from "./ChartDataGenerators";

export class UbisenseDataParser {
    public static dataCache: Map<string, LocationData[]> = new Map<string, LocationData[]>();

    public static async parseData(valid: boolean) {
        const data = await (await fetch("/experiment1.txt")).text();

        const lines: string[] = data.split("\n");
        lines.shift();

        lines.forEach((line: string) => {
            line = line.replace(/\0/g, "");

            const time: string = line.substring(7, 15);
            const tag: string = TagToEntityMap[line.substring(21, 44)];
            const dataValid: string = line.substring(53, 55);
            const y: string = line.substring(63, 68).trim();
            const x: string = line.substring(71, 76).trim();
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

    public static GetParsedData() {
        return new Map(this.dataCache);
    }

    public static GetBubbleChartDatasets(rangeStart: number, rangeEnd: number): BubbleDatasetType {
        return generateBubbleChartDataset(this.dataCache, rangeStart, rangeEnd, LocationChartType.UBISENSE_DATA);
    }
}
