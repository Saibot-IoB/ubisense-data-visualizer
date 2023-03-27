import './Styles/HeatmapLegend.scss';

interface HeatmapLegendProps {
    items: { color: string; text: string }[];
}

const HeatmapLegend = (props: HeatmapLegendProps) => {
    return (
        <ul className="heatmap-legend">
            {props.items.map((item, index) => (
                <li key={index} className="heatmap-legend-item">
                    <div className="heatmap-legend-color" style={{ backgroundColor: item.color }}></div>
                    <span>{item.text}</span>
                </li>
            ))}
        </ul>
    );
};

export default HeatmapLegend;