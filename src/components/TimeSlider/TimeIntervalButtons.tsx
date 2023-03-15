import React from "react";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import { TimeFormatter } from "../../util/Formatters/TimeFormatter";

interface TimeIntervalButtonsProps {
    durationStart: number;
    durationEnd: number;
    range: [number, number];
    handleIntervalChange: (direction: "increment" | "decrement", intervalValue: number) => void;
}

const TimeIntervalButtons: React.FC<TimeIntervalButtonsProps> = ({
    durationStart,
    durationEnd,
    range,
    handleIntervalChange,
}) => {
    const intervalInputElement = React.useRef<HTMLInputElement>(null);

    const handleButtonClick = (direction: "increment" | "decrement") => {
        const intervalValue = parseInt(intervalInputElement.current!.value);
        handleIntervalChange(direction, intervalValue);
    };

    return (
        <>
            <div className="timeLabel-container">
                <p>{TimeFormatter.formatTimestamp(durationStart)}</p>
                <p>{TimeFormatter.formatTimestamp(durationEnd)}</p>
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
                        onClick={() => handleButtonClick("decrement")}
                    />
                    <input
                        type="number"
                        min="1"
                        defaultValue="10"
                        ref={intervalInputElement}
                        className="interval-input"
                    />
                    <FaChevronCircleRight
                        className="pointer"
                        size={30}
                        onClick={() => handleButtonClick("increment")}
                    />
                </div>
            </div>
        </>
    );
};

export default TimeIntervalButtons;
