import { useState } from "react";
import "./App.css";

import LocationChart from "./components/LocationChart";
import TimeSlider from "./components/TimeSlider";

function App() {
    const [locationRange, setLocationRange] = useState<[number, number]>([0, 300]);

    const handleLocationRangeChanged = (value: [number, number]) => {
        setLocationRange(value);
    };

    return (
        <div className="outer-wrapper">
            <LocationChart range={locationRange} />
            <TimeSlider onRangeChanged={handleLocationRangeChanged} />
        </div>
    );
}

export default App;
