import "./TimeSlider.scss"

import React from "react";

interface ThumbLabelProps {
    position: number;
    labelText: string;
    type: "start" | "end";
}

const ThumbLabel: React.FC<ThumbLabelProps> = ({ position, labelText, type }) => {
    return (
        <div
            className={`thumb-label ${type}-thumb-label`} // Add the appropriate class
            style={{ position: "absolute", top: -18, left: position }}
        >
            {labelText}
        </div>
    );
};

export default ThumbLabel;
