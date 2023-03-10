import "./App.css";

import { useEffect, useState } from "react";
import { TagToEntityMap } from "./common/constants/EntityConstants";

import LocationChart from "./components/LocationChart";
import TimeGapChart from "./components/TimeGapChart";
import TimeSlider from "./components/TimeSlider";
import { UbisenseDataParserService } from "./services/UbisenseDataParserService";
import { TablePrinter } from "./util/Formatters/TablePrinter";

function App() {
    const [locationRange, setLocationRange] = useState<[number, number]>([0, 300]);
    const [timeGapRange, setTimeGapRange] = useState<[number, number]>([0, 300]);

    const handleLocationRangeChanged = (value: [number, number]) => {
        setLocationRange(value);
    };

    const handleTimeGapRangeChanged = (value: [number, number]) => {
        setTimeGapRange(value);
    }

    /**
     * Print the average time gap size without N largests gaps.
     * The data is not available on the first render, so the
     * data is fetched using exponential retries.
     */
    useEffect(() => {
        const filterNGaps = 10;
        let retryCount = 0;

        const attemptFetchData = (): void => {
            const data = UbisenseDataParserService.findAverageWithoutLargetsNGaps(filterNGaps);

            if (data.size === 0 && retryCount < 5) {
                const delay = Math.pow(2, retryCount) * 100;

                setTimeout(() => {
                    retryCount++;
                    attemptFetchData();
                }, delay);
            } else if (data.size > 0) {
                const tablePrinter = new TablePrinter();
                for (const [key, value] of data) {
                    tablePrinter.addDataRow([
                        tablePrinter.writeColumn("Entity Name", TagToEntityMap[key]),
                        tablePrinter.writeColumn("Average gap size with all gaps", value[0]),
                        tablePrinter.writeColumn(`Average gap size without the ${filterNGaps} largest gaps`, value[1])
                    ]);
                }

                tablePrinter.printTable(0);
            } else {
                console.error("Failed to fetch data after multiple retries.");
            }
        };

        attemptFetchData();
    }, []);

    return (
        <div className="outer-wrapper">
            <div className="view-container">
                <LocationChart range={locationRange} />
                <TimeSlider onRangeChanged={handleLocationRangeChanged} initialRange={[0, 300]} />
            </div>
            <div className="view-container">
                <TimeGapChart range={timeGapRange} />
                <TimeSlider onRangeChanged={handleTimeGapRangeChanged} initialRange={[0, 3810]} />
            </div>
        </div>
    );
}

export default App;
