import { RangeSlider } from "@mantine/core";
import { useEffect, useRef, useState } from "react";

import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { LocationChartType } from "../common/enums/LocationCharts";
import { getExperimentDuration } from "../util/ExperimentTimeUtil";
import { TimeFormatter } from "../util/Formatters/TimeFormatter";

interface TimeSliderProps {
    onRangeChanged(value: [number, number]): void;
    initialRange: [number, number];
    locationChartType: LocationChartType;
}

const TimeSlider = (props: TimeSliderProps) => {
    const { onRangeChanged, initialRange, locationChartType } = props;
    const [range, setRange] = useState<[number, number]>([...initialRange]);
    const intervalInputElement = useRef<HTMLInputElement>(null);
    const [duration, setDuration] = useState<{ start: number; end: number }>({
        start: 0,
        end: 0,
    });

    const initialRangeRef = useRef(initialRange);

    /**
     * Load and set the interval of the experiment.
     * The data is loaded using exponential retries, in case
     * the data is not available yet.
     */
    useEffect(() => {
        let retryCount = 0;

        const attemptFetchDuration = (): void => {
            const fetchedDuration = getExperimentDuration(locationChartType);

            if (
                (!fetchedDuration || (fetchedDuration.start === 0 && fetchedDuration.end === 0)) // If duration is invalid
                && retryCount < 5 // and retires are less than 5
            ) {
                const delay = Math.pow(2, retryCount) * 200;

                setTimeout(() => {
                    retryCount++;
                    attemptFetchDuration();
                }, delay);
            } else if (fetchedDuration) {
                setDuration(fetchedDuration);
                // If the initial range of the slider is [0, 0], set it from 0 to max
                if (initialRangeRef.current[0] === 0 && initialRangeRef.current[1] === 0) {
                    setRange([0, fetchedDuration.end]);
                } else {
                    setRange([...initialRangeRef.current]);
                }
            } else {
                alert("Experiment duration could not be calculated");
            }
        }

        attemptFetchDuration();
    }, [locationChartType]);

    useEffect(() => {
        onRangeChanged(range);
    }, [range, onRangeChanged]);

    const handleDecrementInterval = () => {
        if (range[0] - parseInt(intervalInputElement.current!.value) >= 0) {
            setRange([
                (range[0] -= parseInt(intervalInputElement.current!.value)),
                (range[1] -= parseInt(intervalInputElement.current!.value)),
            ]);
        } else {
            setRange([(range[0] = 0), range[1]]);
        }
    };

    const handleIncrementInterval = () => {
        if (
            range[1] + parseInt(intervalInputElement.current!.value) <=
            duration.end
        ) {
            setRange([
                (range[0] += parseInt(intervalInputElement.current!.value)),
                (range[1] += parseInt(intervalInputElement.current!.value)),
            ]);
        } else {
            setRange([range[0], (range[1] = duration.end)]);
        }
    };

    return (
        <>
            <div className="slider-container">
                <RangeSlider
                    thumbSize={20}
                    label={
                        TimeFormatter.formatTimestamp(range[0]) +
                        " --- " +
                        TimeFormatter.formatTimestamp(range[1])
                    }
                    min={duration.start}
                    max={duration.end}
                    mt="xl"
                    defaultValue={range}
                    onChangeEnd={(e) => setRange(e)}
                    value={range}
                />
            </div>
            <div className="timeLabel-container">
                <p>{TimeFormatter.formatTimestamp(duration.start)}</p>
                <p>{TimeFormatter.formatTimestamp(duration.end)}</p>
            </div>
            <div id="intervalButtons-container">
                <p>
                    {TimeFormatter.formatTimestamp(range[0]) +
                        " --- " +
                        TimeFormatter.formatTimestamp(range[1])}
                </p>
                <div className="intervalButtons-innerContainer">
                    <FaChevronCircleLeft
                        className="pointer"
                        size={30}
                        onClick={handleDecrementInterval}
                    />
                    <input type="number" defaultValue={5} ref={intervalInputElement} />
                    <FaChevronCircleRight
                        className="pointer"
                        size={30}
                        onClick={handleIncrementInterval}
                    />
                </div>
            </div>
        </>
    );
}

export default TimeSlider;
