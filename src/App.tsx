import "./App.scss";

import { useEffect, useState } from "react";

import LocationChart from "./components/LocationChart";
import { TablePrinter } from "./util/Formatters/TablePrinter";
import { LocationChartType } from "./common/enums/LocationCharts";
import { UbisenseDataAnalyzer } from "./services/UbisenseDataAnalyzer";
import TimeSlider from "./components/TimeSlider/TimeSlider";
import LineChart from "./components/LineChart";
import {UbisenseDataParser} from './services/UbisenseDataParser';
import {calculateRobotHumanDistances} from './util/DistanceCalculator';

function App() {
    const [locationRange, setLocationRange] = useState<[number, number]>([0, 0]);
    const [timeGapRange, setTimeGapRange] = useState<[number, number]>([0, 0]);
    const [robot4001DistanceRange, setrobot4001DistanceRange] = useState<[number, number]>([0, 0]);
    const [robot4002DistanceRange, setrobot4002DistanceRange] = useState<[number, number]>([0, 0]);
    const [robotWhiteDistanceRange, setrobotWhiteDistanceRange] = useState<[number, number]>([0, 0]);
    const [robotLocationRange, setRobotLocationRange] = useState<[number, number]>([0, 0]);
    const [distanceData, setDistanceData] = useState<Map<string, [string, [number, (number | null)]][]>| null>(null);

    const handleLocationRangeChanged = (value: [number, number]) => {
        setLocationRange(value);
    };

    const handleTimeGapRangeChanged = (value: [number, number]) => {
        setTimeGapRange(value);
    }

    const handleRobotLocationRangeChanged = (value: [number, number]) => {
        setRobotLocationRange(value);
    };

    const handleDistanceRangeChanged_4001 = (value: [number, number]) => {
            setrobot4001DistanceRange(value);
    }
    const handleDistanceRangeChanged_4002 = (value: [number, number]) => {
        setrobot4002DistanceRange(value);
    }
    const handleDistanceRangeChanged_White = (value: [number, number]) => {
        setrobotWhiteDistanceRange(value);
    }

    /**
     * Print the average time gap size without N largests gaps.
     * The data is not available on the first render, so the
     * data is fetched using exponential retries.
     */
    useEffect(() => {
        const tryGetData = () => {
            if (UbisenseDataParser.GetParsedData().size === 0) {
                setTimeout(tryGetData, 1000);
            } else {
                const locationData = UbisenseDataParser.GetParsedData();
                setDistanceData(calculateRobotHumanDistances(locationData , 20));
            }
        }

        tryGetData();
        
        /*const filterNGaps = 10;
        let retryCount = 0;

        const attemptFetchData = (): void => {
            const data = UbisenseDataAnalyzer.findAverageWithoutLargetsNGaps(filterNGaps);

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
                        tablePrinter.writeColumn("Entity Name", key),
                        tablePrinter.writeColumn("Average gap size with all gaps", value[0]),
                        tablePrinter.writeColumn(`Average gap size without the ${filterNGaps} largest gaps`, value[1])
                    ]);
                }

                tablePrinter.printTable(0);
            } else {
                alert("Failed to fetch data after multiple retries.");
            }
        };*/

        //attemptFetchData();
    }, []);

    return (
        <div className="outer-wrapper">
            <div className="view-container">
                <h1>Robot Locations (Robot Data)</h1>
                <LocationChart range={robotLocationRange} locationChartType={LocationChartType.ROBOT_DATA} />
                <TimeSlider
                    onRangeChanged={handleRobotLocationRangeChanged}
                    initialRange={[0, 0]}
                    locationChartType={LocationChartType.ROBOT_DATA}
                />
            </div>
            <div className="view-container">
                <h1>Ubisense Locations</h1>
                <LocationChart range={locationRange} locationChartType={LocationChartType.UBISENSE_DATA} />
                <TimeSlider
                    onRangeChanged={handleLocationRangeChanged}
                    initialRange={[0, 0]}
                    locationChartType={LocationChartType.UBISENSE_DATA}
                />
            </div>
            <div className="view-container">
                <h1>Start Locations of time gaps larger than 60 seconds</h1>
                <LocationChart range={timeGapRange} locationChartType={LocationChartType.TIME_GAP_DATA} />
                <TimeSlider
                    onRangeChanged={handleTimeGapRangeChanged}
                    initialRange={[0, 0]}
                    locationChartType={LocationChartType.TIME_GAP_DATA}
                />
            </div>
            <div className="view-container">
                <h1>Robot 4701 distance to persons</h1>
                <LineChart range={robot4001DistanceRange} distanceData={distanceData} robotId={"4701"} />
                {/*<TimeSlider
                    onRangeChanged={handleDistanceRangeChanged_4001}
                    initialRange={[0, 0]}
                    locationChartType={LocationChartType.TIME_GAP_DATA}
                />*/}
            </div>
            <div className="view-container">
                <h1>Robot 4702 distance to persons</h1>
                <LineChart range={robot4001DistanceRange} distanceData={distanceData} robotId={"4702"} />
                {/*<TimeSlider
                    onRangeChanged={handleDistanceRangeChanged_4002}
                    initialRange={[0, 0]}
                    locationChartType={LocationChartType.TIME_GAP_DATA}
                />*/}
            </div>
            <div className="view-container">
                <h1>Robot White distance to persons</h1>
                <LineChart range={robot4001DistanceRange} distanceData={distanceData} robotId={"White"} />
                {/*<TimeSlider
                    onRangeChanged={handleDistanceRangeChanged_White}
                    initialRange={[0, 0]}
                    locationChartType={LocationChartType.TIME_GAP_DATA}
                />*/}
            </div>
        </div>
    );
}

export default App;
