import { useEffect, useState } from "react";
import "./App.css";

import LocationChart from "./components/LocationChart";
import TimeGapChart from "./components/TimeGapChart";
import TimeSlider from "./components/TimeSlider";
import { TagToEntityMap, UbisenseDataParserService } from "./services/UbisenseDataParserService";

function App() {
  const [locationRange, setLocationRange] = useState<[number, number]>([0, 300]);
  const [timeGapRange, setTimeGapRange] = useState<[number, number]>([0, 300]);

  const handleLocationRangeChanged = (value: [number, number]) => {
    setLocationRange(value);
  };

  const handleTimeGapRangeChanged = (value: [number, number]) => {
    setTimeGapRange(value);
  }

  useEffect(() => {
    const filterNGaps = 10;

    UbisenseDataParserService.findAverageWithoutLargetsNGaps(filterNGaps).forEach((value, key) => {
      console.log(TagToEntityMap[key]);
      console.log(`Average with ${filterNGaps} largest gaps: ${value[0]}`);
      console.log(`Average without ${filterNGaps} largest gaps: ${value[1]}`);
      console.log("\n");
    });
  });

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
