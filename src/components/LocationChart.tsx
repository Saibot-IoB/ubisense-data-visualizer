import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";
import { useEffect, useState } from "react";

import { Bubble } from "react-chartjs-2";
import { UbisenseDataParser } from "../services/UbisenseDataParser";
import { DefaultBubbleChartConfig } from "../common/config/ChartConfigs"
import { BubbleDatasetType } from "../common/types/Simple";
import { LocationChartType } from "../common/enums/LocationCharts";
import { match, P } from "ts-pattern";
import { RobotDataParser } from "../services/RobotDataParser";
import { TimeGapParser } from "../services/TimeGapParser";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

interface LocationChartProps {
    range: [number, number]
    locationChartType: LocationChartType
}

const LocationChart = (props: LocationChartProps) => {
    const { range, locationChartType } = props;
    const [data, setdata] = useState<BubbleDatasetType>([]);

    useEffect(() => {
        const start = async () => {
            match(locationChartType)
                .with(LocationChartType.ROBOT_DATA, async () => await RobotDataParser.parseData())
                .with(LocationChartType.TIME_GAP_DATA, async () => await TimeGapParser.parseData())
                .with(LocationChartType.UBISENSE_DATA, async () => await UbisenseDataParser.parseData(true))
                .with(P._, () => undefined)
                .exhaustive();
        };

        start();
    }, [locationChartType]);

    useEffect(() => {
        match(locationChartType)
            .with(LocationChartType.ROBOT_DATA, async () => {
                setdata(RobotDataParser.GetBubbleChartDatasets(range[0], range[1]));
            })
            .with(LocationChartType.TIME_GAP_DATA, async () => {
                setdata(TimeGapParser.GetBubbleChartDatasets(range[0], range[1]));
            })
            .with(LocationChartType.UBISENSE_DATA, async () => {
                setdata(UbisenseDataParser.GetBubbleChartDatasets(range[0], range[1]));
            })
            .with(P._, () => alert("The proovided location chart type is not valid"))
            .exhaustive();
    }, [range, locationChartType]);

    return (
        <div id="chart-container">
            <Bubble width={"1000px"} options={DefaultBubbleChartConfig} data={{ datasets: data }} />
        </div>
    );
}

export default LocationChart;
