import React, {useEffect, useRef, useState} from 'react';
import {CategoryScale, Chart, LinearScale, Title, Tooltip } from 'chart.js';
import 'chartjs-chart-matrix';
import {LocationDataAll} from '../common/types/Simple';
import {UbisenseDataParser} from '../services/UbisenseDataParser';
import { MatrixElement, MatrixController } from 'chartjs-chart-matrix';

Chart.register(Tooltip, CategoryScale, LinearScale, Title, MatrixElement, MatrixController);

interface HeatmapData {
    [key: string]: {
        x: number;
        y: number;
        count: number;
        validCount: number;
    };
}

interface HeatmapProps {
}

const Heatmap = (props: HeatmapProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [data, setData] = useState<LocationDataAll[]>([]);
    
    useEffect(() => {
        const getData = async () => {
            const allData = await UbisenseDataParser.getAllData();
            setData(allData);
        }
        
        getData();
    }, []);

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx == null || data.length == 0) return;
            
            const heatmapData = data.reduce<HeatmapData>((acc, loc) => {
                const x = Math.floor(parseFloat(loc.x));
                const y = Math.floor(parseFloat(loc.y));
                const key = `${x}-${y}`;

                acc[key] = acc[key] || { x, y, count: 0, validCount: 0 };
                acc[key].count++;
                if (loc.valid) acc[key].validCount++;

                return acc;
            }, {});

            const heatmapArray = Object.values(heatmapData).map((loc: any) => ({
                x: loc.x,
                y: loc.y,
                count: loc.count,
                validCount: loc.validCount,
                value: loc.validCount / loc.count,
                backgroundColor:
                    loc.count === 0
                        ? 'blue'
                        : loc.validCount / loc.count > 0.5
                            ? 'green'
                            : 'red',
            }));
            
            new Chart(ctx, {
                type: 'matrix',
                data: {
                    datasets: [
                        {
                            data: heatmapArray,
                            backgroundColor: (context) =>
                                heatmapArray[context.dataIndex].backgroundColor,
                        },
                    ],
                },
                options: {
                    scales: {
                        x: {
                            beginAtZero: true,
                            max: 23,
                            min: 0,
                            type: 'linear'
                        },
                        y: {
                            reverse: true,
                            beginAtZero: true,
                            max: 11,
                            min: 0,
                            type: 'linear'
                        },
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const loc = heatmapArray[context.dataIndex];
                                    return `Valid: ${loc.validCount}/${loc.count}`;
                                },
                            },
                        },
                    },
                },
            });
        }
    }, [data]);

    return <canvas ref={canvasRef} id={"HeatMap"} />;
};

export default Heatmap;
