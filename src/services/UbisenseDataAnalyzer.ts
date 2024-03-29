import { UbisenseDataParser } from "./UbisenseDataParser";
import { TimeFormatter } from "../util/Formatters/TimeFormatter";
import { TimeConverter } from "../util/Converters/TimeConverter";
import { ComparisonFunction } from "../common/types/Unions";
import { LocationData, TagTimeGap } from "../common/types/Simple";

export class UbisenseDataAnalyzer {
    /**
     * Finds the most extreme data gap for each tag in the dataset.
     * The gap to be found is determined by the provided ComparisonFunction.
     * @param {ComparisonFunction} compareFunction The function that determines
     * if the smallest or the larget gap should be found.
     * @returns {TagTimeGap[]}
     */
    public GetExtremeGapInData(
        compareFunction: ComparisonFunction,
        threshold?: number
    ): TagTimeGap[] {
        return this.processTimeGapData((key, value) => {
            let currentGap: number =
                compareFunction.type === "isGreater" ? 0 : Infinity;

            // Iterate through each data point
            for (let i = 0; i < value.length; i++) {
                const currentDataPoint = value[i];

                // Break if the current data point is the last in the array
                if (i + 1 >= value.length) break;

                const nextDataPoint = value[i + 1];
                const timeGapCurrentAndNextDataPoints =
                    TimeConverter.convertTimestampToSeconds(nextDataPoint.time) -
                    TimeConverter.convertTimestampToSeconds(currentDataPoint.time);

                if (
                    compareFunction(timeGapCurrentAndNextDataPoints, currentGap) &&
                    (threshold === undefined || timeGapCurrentAndNextDataPoints <= threshold)
                ) {
                    currentGap = timeGapCurrentAndNextDataPoints;
                }
            }

            return { tagId: key, gap: currentGap };
        });
    }

    /**
     * Finds the average data gap for each tag in the dataset.
     * @returns {TagTimeGap[]}
     */
    public AverageGapInData(threshold?: number): TagTimeGap[] {
        return this.processTimeGapData((key, value) => {
            let timegapList: number[] = [];

            // Iterate through each data point
            for (let i = 0; i < value.length; i++) {
                const currentDataPoint = value[i];

                // Break if the current data point is the last in the array
                if (i + 1 >= value.length) break;

                const nextDataPoint = value[i + 1];
                const timeGapCurrentAndNextDataPoints =
                    TimeConverter.convertTimestampToSeconds(nextDataPoint.time) -
                    TimeConverter.convertTimestampToSeconds(currentDataPoint.time);

                if (
                    threshold === undefined ||
                    timeGapCurrentAndNextDataPoints <= threshold
                ) {
                    timegapList.push(timeGapCurrentAndNextDataPoints);
                }
            }

            // Calculate average
            const sum = timegapList.reduce((a, b) => a + b, 0);
            const average = sum / timegapList.length || 0;

            return { tagId: key, gap: parseFloat(average.toFixed(2)) };
        });
    }

    /**
     * Count the amount of data points that occurred during the
     * experiment in and aggregate separate the count into intervals.
     * @param {number} intervalSize the size of the intervals
     * @param {Map<string, LocationData[]>} data
     * @returns {Map<string, number>} A map where the key is an interval
     * and the value is the number of data points for that interval
     */
    public countDataByInterval(
        intervalSize: number,
        data: Map<string, LocationData[]>
    ): Map<string, number> {
        const result = new Map<string, number>();

        for (const [, value] of data) {
            const timestamps = value.map((item) =>
                TimeConverter.convertTimestampToSeconds(item.time)
            );
            const intervalStart =
                Math.floor(timestamps[0] / intervalSize) * intervalSize;

            let currentInterval = intervalStart;
            let intervalCount = 0;

            for (const timestamp of timestamps) {
                const intervalEnd = currentInterval + intervalSize;

                if (timestamp < intervalEnd) {
                    intervalCount++;
                } else {
                    const intervalKey = TimeFormatter.formatInterval(
                        currentInterval,
                        intervalEnd
                    );
                    result.set(
                        intervalKey,
                        (result.get(intervalKey) || 0) + intervalCount
                    );
                    currentInterval = intervalEnd;
                    intervalCount = 1;
                }
            }

            const lastIntervalKey = TimeFormatter.formatInterval(
                currentInterval,
                currentInterval + intervalSize
            );
            result.set(
                lastIntervalKey,
                (result.get(lastIntervalKey) || 0) + intervalCount
            );
        }

        return result;
    }

    /**
     * Processes the data in the data cache to extract information about time gaps.
     * @param {function(key: string, value: LocationData[]): TagTimeGap} processValues
     * Callback that specifies how the data should be processed
     * @returns {TagTimeGap} A list of TagTimeGaps where the type of gap is specified
     *  by the provided callback function
     */
    private processTimeGapData(
        processValues: (key: string, value: LocationData[]) => TagTimeGap
    ): TagTimeGap[] {
        const toReturn: TagTimeGap[] = [];

        // Process for each tag
        UbisenseDataParser.GetParsedData().forEach((value, key) => {
            const result = processValues(key, value);
            toReturn.push(result);
        });

        return toReturn;
    }

    /**
     * Find the location of entities before a time gap that is
     * greater than the provided threshold occured
     * @param {Map<string, LocationData[]>} timeGapThreshold 
     * @returns 
     */
    public static findTimeGaps(timeGapThreshold: number): Map<string, LocationData[]> {
        const foundGaps: Map<string, LocationData[]> = new Map();
        UbisenseDataParser.GetParsedData().forEach((dataList, id) => {
            const gapStartLocations: LocationData[] = [];

            for (let i = 0; i < dataList.length - 1; i++) {
                const firstDataPoint = dataList[i];
                const secondDataPoint = dataList[i + 1];
                const timeGapSize =
                    TimeConverter.convertTimestampToSeconds(secondDataPoint.time) -
                    TimeConverter.convertTimestampToSeconds(firstDataPoint.time);

                if (timeGapSize > timeGapThreshold) {
                    gapStartLocations.push(firstDataPoint);
                }
            }
            if (gapStartLocations.length > 0) {
                foundGaps.set(id, gapStartLocations);
            }
        });

        return foundGaps;
    }

    /**
     * Calculate the average time gap size for all entities
     * without the largest N gaps in the dataset. The function
     * is used to analyze how large time gaps affect the average time
     * gap size.
     * @param {number} filterNGaps 
     * The number of gaps that should be filtered out
     * @returns 
     */
    public static findAverageWithoutLargetsNGaps(filterNGaps: number): Map<string, [number, number]> {
        const result: Map<string, [number, number]> = new Map();
        UbisenseDataParser.GetParsedData().forEach((dataList, id) => {
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
}
