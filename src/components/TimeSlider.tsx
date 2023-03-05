import { RangeSlider } from "@mantine/core";
import { useEffect, useRef, useState } from "react";

import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { UbisenseDataParserService } from "../services/UbisenseDataParserService";
import { TimeFormatter } from "../util/Formatters/TimeFormatter";

interface TimeSliderProps {
    onRangeChanged(value: [number, number]): void;
}

const TimeSlider = (props: TimeSliderProps) => {
    const { onRangeChanged } = props;
    const [range, setrange] = useState<[number, number]>([0, 300]);
    const intervalInputElement = useRef<HTMLInputElement>(null);
    const [duration, setDuration] = useState<{ start: number; end: number }>({
        start: 0,
        end: 0,
    });

    /**
     * Load and set the duration of the experiment.
     * The duration is received from the UbisenseDataParserService,
     * so the data is loaded using exponential retries, in case
     * the data is not available yet.
     */
    useEffect(() => {
        let retryCount = 0;

        const attemptFetchDuration = (): void => {
            const fetchedDuration = UbisenseDataParserService.GetExperimentDuration();
            if (!fetchedDuration && retryCount < 5) {
                const delay = Math.pow(2, retryCount) * 200;

                setTimeout(() => {
                    retryCount++;
                    attemptFetchDuration();
                }, delay);
            } else if (fetchedDuration) {
                setDuration(fetchedDuration);
            } else {
                alert("Experiment duration could not be calculated");
            }
        }

        attemptFetchDuration();
    }, []);

    useEffect(() => {
        onRangeChanged(range);
    }, [range, onRangeChanged]);

    const handleDecrementInterval = () => {
        if (range[0] - parseInt(intervalInputElement.current!.value) >= 0) {
            setrange([
                (range[0] -= parseInt(intervalInputElement.current!.value)),
                (range[1] -= parseInt(intervalInputElement.current!.value)),
            ]);
        } else {
            setrange([(range[0] = 0), range[1]]);
        }
    };

    const handleIncrementInterval = () => {
        if (
            range[1] + parseInt(intervalInputElement.current!.value) <=
            duration.end
        ) {
            setrange([
                (range[0] += parseInt(intervalInputElement.current!.value)),
                (range[1] += parseInt(intervalInputElement.current!.value)),
            ]);
        } else {
            setrange([range[0], (range[1] = duration.end)]);
        }
    };

    return (
        <>
            <div className="slider-container">
                <RangeSlider
                    thumbSize={20}
                    label={
                        TimeFormatter.formatTimestamp(range[0]) +
                        " ---" +
                        TimeFormatter.formatTimestamp(range[1])
                    }
                    min={duration.start}
                    max={duration.end}
                    mt="xl"
                    defaultValue={range}
                    onChangeEnd={(e) => setrange(e)}
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
                        " ---" +
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
