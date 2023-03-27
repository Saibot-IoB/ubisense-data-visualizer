import "./App.scss";

import { useEffect, useState } from "react";

import LocationChart from "./components/LocationChart";
import { LocationChartType } from "./common/enums/LocationCharts";
import TimeSlider from "./components/TimeSlider/TimeSlider";
import LineChart from "./components/LineChart";
import {UbisenseDataParser} from './services/UbisenseDataParser';
import {findEntityDistances} from './util/DistanceCalculator';
import {EntityDistanceResult} from './common/types/Simple';
import Heatmap from './components/Heatmap/Heatmap';

function App() {
    const [locationRange, setLocationRange] = useState<[number, number]>([0, 0]);
    const [timeGapRange, setTimeGapRange] = useState<[number, number]>([0, 0]);
    const [robot4701DistanceRange, setRobot4701DistanceRange] = useState<[number, number]>([0, 0]);
    const [robot4702DistanceRange, setRobot4702DistanceRange] = useState<[number, number]>([0, 0]);
    const [robotWhiteDistanceRange, setRobotWhiteDistanceRange] = useState<[number, number]>([0, 0]);
    const [robotLocationRange, setRobotLocationRange] = useState<[number, number]>([0, 0]);
    const [distanceData4701, setDistanceData4701] = useState<EntityDistanceResult | null>(null);
    const [distanceData4702, setDistanceData4702] = useState<EntityDistanceResult | null>(null);
    const [distanceDataWhite, setDistanceDataWhite] = useState<EntityDistanceResult | null>(null);

    const handleLocationRangeChanged = (value: [number, number]) => {
        setLocationRange(value);
    };

    const handleTimeGapRangeChanged = (value: [number, number]) => {
        setTimeGapRange(value);
    }

    const handleRobotLocationRangeChanged = (value: [number, number]) => {
        setRobotLocationRange(value);
    };

    const handleDistanceRangeChanged4701 = (value: [number, number]) => {
        setRobot4701DistanceRange(value);
    }
    const handleDistanceRangeChanged4702 = (value: [number, number]) => {
        setRobot4702DistanceRange(value);
    }
    const handleDistanceRangeChangedWhite = (value: [number, number]) => {
        setRobotWhiteDistanceRange(value);
    }

    /**
     * Print the average time gap size without N-largest gaps.
     * The data is not available on the first render, so the
     * data is fetched using exponential retries.
     */
    useEffect(() => {
        const tryGetData = () => {
            if (UbisenseDataParser.GetParsedData().size === 0) {
                setTimeout(tryGetData, 1000);
            } else {
                const locationData = UbisenseDataParser.GetParsedData();
                setDistanceData4701(findEntityDistances("4701", locationData));
                setDistanceData4702(findEntityDistances("4702", locationData));
                setDistanceDataWhite(findEntityDistances("White", locationData));
            }
        }

        tryGetData();
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
                <LineChart range={robot4701DistanceRange} distanceData={distanceData4701} />
                <TimeSlider
                    onRangeChanged={handleDistanceRangeChanged4701}
                    initialRange={[0, 0]}
                    locationChartType={LocationChartType.TIME_GAP_DATA}
                />
            </div>
            <div className="view-container">
                <h1>Robot 4702 distance to persons</h1>
                <LineChart range={robot4702DistanceRange} distanceData={distanceData4702} />
                <TimeSlider
                    onRangeChanged={handleDistanceRangeChanged4702}
                    initialRange={[0, 0]}
                    locationChartType={LocationChartType.TIME_GAP_DATA}
                />
            </div>
            <div className="view-container">
                <h1>Robot White distance to persons</h1>
                <LineChart range={robotWhiteDistanceRange} distanceData={distanceDataWhite} />
                <TimeSlider
                    onRangeChanged={handleDistanceRangeChangedWhite}
                    initialRange={[0, 0]}
                    locationChartType={LocationChartType.TIME_GAP_DATA}
                />
            </div>
            <div className="view-container heatmap-container">
                <h1>Ubisense - Data Validity Heatmap</h1>
                <Heatmap />
            </div>
        </div>
    );
}

export default App;
