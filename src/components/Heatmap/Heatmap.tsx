import 'chartjs-chart-matrix';

import React, {useEffect, useRef, useState} from 'react';
import {CategoryScale, Chart, LinearScale, Title, Tooltip } from 'chart.js';
import {LocationDataAll} from '../../common/types/Simple';
import {UbisenseDataParser} from '../../services/UbisenseDataParser';
import { MatrixElement, MatrixController } from 'chartjs-chart-matrix';
import HeatmapLegend from './HeatmapLegend';

Chart.register(Tooltip, CategoryScale, LinearScale, Title, MatrixElement, MatrixController);

interface HeatmapData {
    [key: string]: {
        x: number;
        y: number;
        count: number;
        validCount: number;
    };
}

const Heatmap = () => {
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
        let chartInstance: Chart | null = null;
        
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
            

            const heatmapArray = Object.values(heatmapData).map((loc: any) => {
                let backgroundColor: string = "";
                let validRation: number = loc.validCount / loc.count;
                
                if (validRation <= 0.1)       { backgroundColor = "darkred" }
                else if (validRation <= 0.25) { backgroundColor = "red" }
                else if (validRation <= 0.5)  { backgroundColor = "orange" }
                else if (validRation <= 0.75) { backgroundColor = "lightgreen" }
                else                          { backgroundColor = "green" }
                
                return ({
                    x: loc.x,
                    y: loc.y,
                    count: loc.count,
                    validCount: loc.validCount,
                    value: loc.validCount / loc.count,
                    backgroundColor: backgroundColor
                })
            });
            
            chartInstance = new Chart(ctx, {
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
                    animation: {
                        duration: 0,
                    },
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
                        legend: {
                            display: false
                        },
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

        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [data]);
    

    return (
        <div id="chart-container-bg" className={"heatmap-bg"}>
            <HeatmapLegend
                items={[
                    { color: 'darkred', text: '0-10% valid'},
                    { color: 'red', text: '11-25% valid'},
                    { color: 'orange', text: '26-50% valid' },
                    { color: 'lightgreen', text: '51-75% valid' },
                    { color: 'green', text: '76-100% valid' },
                ]}
            />
           <canvas ref={canvasRef} id={"HeatMap"} />
        </div>
    );
};

export default Heatmap;
