import { LocationChartType } from "../common/enums/LocationCharts";
import { DatasetType, LocationData } from "../common/types/Simple";
import { generateBubbleChartDataset } from "./ChartDataGenerators";
import { UbisenseDataAnalyzer } from "./UbisenseDataAnalyzer";

export class TimeGapParser {
    public static dataCache: Map<string, LocationData[]> = new Map<string, LocationData[]>();

    public static async parseData() {
        const gapSizeThreshold = 60;
        let retryCount = 0;

        /**
         * Get data via exponential retries as the data
         * depends on the data being available from the
         * UbisenseDataAnalyzer
         */
        const getData = () => {
            this.dataCache = UbisenseDataAnalyzer.findTimeGaps(gapSizeThreshold);

            if (this.dataCache.size === 0 && retryCount < 5) {
                const delay = Math.pow(2, retryCount) * 200;
    
                setTimeout(() => {
                    retryCount++;
                    getData();
                }, delay);
            }
        }

        getData();
    }

    public static GetBubbleChartDatasets(rangeStart: number, rangeEnd: number): DatasetType {
        return generateBubbleChartDataset(this.dataCache, rangeStart, rangeEnd, LocationChartType.TIME_GAP_DATA, 6);
    }
}
