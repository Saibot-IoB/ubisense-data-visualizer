import "./TimeSlider.scss";

import { RangeSlider } from "@mantine/core";
import { useEffect, useRef, useState, useCallback } from "react";
import ThumbLabel from "./ThumbLabel";
import { getExperimentDuration } from "../../util/ExperimentTimeUtil";
import { TimeFormatter } from "../../util/Formatters/TimeFormatter";
import { LocationChartType } from "../../common/enums/LocationCharts";
import TimeIntervalButtons from "./TimeIntervalButtons";

interface TimeSliderProps {
    onRangeChanged(value: [number, number]): void;
    initialRange: [number, number];
    locationChartType: LocationChartType;
}

const TimeSlider = (props: TimeSliderProps) => {
    const { onRangeChanged, initialRange, locationChartType } = props;
    const [range, setRange] = useState<[number, number]>([...initialRange]);
    const [tempRange, setTempRange] = useState<[number, number]>([...initialRange]);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [duration, setDuration] = useState<{ start: number; end: number }>({
        start: 0,
        end: 0,
    });

    const initialRangeRef = useRef(initialRange);

    const calculateThumbPosition = (value: number, min: number, max: number, width: number) => {
        const ratio = (value - min) / (max - min);
        return ratio * width;
    };

    const sliderWidth = sliderRef.current?.clientWidth || 0;
    const startPosition = !isNaN(tempRange[0]) ? calculateThumbPosition(tempRange[0], duration.start, duration.end, sliderWidth) : 0;
    const endPosition = !isNaN(tempRange[1]) ? calculateThumbPosition(tempRange[1], duration.start, duration.end, sliderWidth) : 0;


    useEffect(() => {
        setTempRange(range);
    }, [range]);

    useEffect(() => {
        let retryCount = 0;

        const attemptFetchDuration = (): void => {
            const fetchedDuration = getExperimentDuration(locationChartType);

            if (
                (!fetchedDuration ||
                    (fetchedDuration.start === 0 && fetchedDuration.end === 0)) &&
                retryCount < 5
            ) {
                const delay = Math.pow(2, retryCount) * 200;

                setTimeout(() => {
                    retryCount++;
                    attemptFetchDuration();
                }, delay);
            } else if (fetchedDuration) {
                setDuration(fetchedDuration);
                if (initialRangeRef.current[0] === 0 && initialRangeRef.current[1] === 0) {
                    setRange([0, fetchedDuration.end]);
                } else {
                    setRange([...initialRangeRef.current]);
                }
            } else {
                alert("Experiment duration could not be calculated");
            }
        };

        attemptFetchDuration();
    }, [locationChartType]);

    useEffect(() => {
        onRangeChanged(range);
    }, [range, onRangeChanged]);

    const handleIntervalChange = useCallback(
        (direction: "increment" | "decrement", intervalValue: number) => {
            const adjustedValue = direction === "increment" ? intervalValue : -intervalValue;

            // Prevent moving the slider when the start is at the beginning and direction is "decrement"
            if (direction === "decrement" && range[0] === 0) {
                return;
            }

            // Prevent moving the slider when the end is at the maximum value and direction is "increment"
            if (direction === "increment" && range[1] === duration.end) {
                return;
            }

            const newRange: [number, number] = [
                Math.max(0, range[0] + adjustedValue),
                Math.min(duration.end, range[1] + adjustedValue),
            ];

            setRange(newRange);
        },
        [range, duration.end]
    );



    return (
        <>
            <div className={`slider-container${isDragging ? " dragging" : ""}`}>
                <RangeSlider
                    thumbSize={20}
                    min={duration.start}
                    max={duration.end}
                    mt="xl"
                    value={tempRange}
                    onChange={(e) => {
                        setTempRange(e);
                        setIsDragging(true);
                    }}
                    onChangeEnd={(e) => {
                        setRange(e);
                        setIsDragging(false);
                    }}
                    ref={sliderRef}
                    label=""
                />
                <ThumbLabel
                    type="start"
                    position={isNaN(startPosition) ? 0 : startPosition + 30}
                    labelText={TimeFormatter.formatTimestamp(tempRange[0])}
                />
                <ThumbLabel
                    type="end"
                    position={isNaN(endPosition) ? 0 : endPosition + 15}
                    labelText={TimeFormatter.formatTimestamp(tempRange[1])}
                />
            </div>
            <TimeIntervalButtons
                durationStart={duration.start}
                durationEnd={duration.end}
                range={range}
                handleIntervalChange={handleIntervalChange}
            />
        </>
    );

}

export default TimeSlider;
