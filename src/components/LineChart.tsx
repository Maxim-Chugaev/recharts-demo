import React, { useRef, useState, useEffect } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Brush,
} from 'recharts';
import type { ChartDataPoint, Variation } from '../utils/dataProcessing';
import styles from '../styles/LineChart.module.css';

import type { LineStyle } from './Controls';

interface LineChartProps {
    data: ChartDataPoint[];
    variations: Variation[];
    selectedVariations: string[];
    lineStyle: LineStyle;
    startIndex: number | null;
    endIndex: number | null;
    isPanning: boolean;
    onChangeRange: (start: number, end: number) => void;
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
};

import { Calendar, Trophy } from 'lucide-react';

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        // Filter out hidden items (like the glow effect)
        const filteredPayload = payload.filter((entry: any) => entry.name !== '__hide__');
        // Sort payload by value in descending order
        const sortedPayload = [...filteredPayload].sort((a: any, b: any) => b.value - a.value);

        return (
            <div className={styles.tooltip}>
                <div className={styles.tooltipDateRow}>
                    <Calendar size={16} color="var(--text-secondary)" strokeWidth={1.5} />
                    <span className={styles.tooltipDate}>{formatDate(label)}</span>
                </div>
                <ul className={styles.tooltipList}>
                    {sortedPayload.map((entry: any, index: number) => (
                        <li key={entry.name}>
                            <div className={styles.tooltipNameRow}>
                                <span
                                    className={styles.colorDot}
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className={styles.tooltipName}>{entry.name}:</span>
                                {index === 0 && <Trophy size={18} color="var(--text-secondary)" strokeWidth={1.5} />}
                            </div>
                            <span className={styles.tooltipValue}>{entry.value?.toFixed(2)}%</span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
    return null;
};

const CustomYAxisTick: React.FC<any> = ({ x, y, payload }) => {
    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                dy={-2}
                textAnchor="end"
                fill="var(--axis-text)"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
                fontSize={11}
            >
                {payload.value}
            </text>
            <text
                x={0}
                y={0}
                dy={10}
                textAnchor="end"
                fill="var(--axis-text)"
                fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
                fontSize={11}
            >
                %
            </text>
        </g >
    );
};

export const LineChart: React.FC<LineChartProps> = ({
    data,
    variations,
    selectedVariations,
    lineStyle,
    startIndex,
    endIndex,
    isPanning,
    onChangeRange
}) => {
    // Filter variations to only show selected ones
    const activeVariations = variations.filter(v => selectedVariations.includes(v.id));

    const chartRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [lastX, setLastX] = useState<number | null>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isPanning) {
            setIsDragging(true);
            setLastX(e.clientX);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && lastX !== null && startIndex !== null && endIndex !== null) {
            const deltaX = lastX - e.clientX;
            // Sensitivity factor - how many pixels move one data point
            // This is a rough approximation. For better precision we'd need chart width / visible points.
            const sensitivity = 10;

            if (Math.abs(deltaX) > sensitivity) {
                const moveCount = Math.sign(deltaX) * Math.floor(Math.abs(deltaX) / sensitivity);

                const currentLength = endIndex - startIndex;
                let newStart = startIndex + moveCount;
                let newEnd = endIndex + moveCount;

                // Bounds check
                if (newStart < 0) {
                    newStart = 0;
                    newEnd = currentLength;
                }
                if (newEnd >= data.length) {
                    newEnd = data.length - 1;
                    newStart = newEnd - currentLength;
                }

                if (newStart !== startIndex || newEnd !== endIndex) {
                    onChangeRange(newStart, newEnd);
                    setLastX(e.clientX);
                }
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setLastX(null);
    };

    // Reset drag state if panning is disabled
    useEffect(() => {
        if (!isPanning) {
            setIsDragging(false);
            setLastX(null);
        }
    }, [isPanning]);

    // Force cursor style on body during drag to ensure it doesn't flicker or revert
    useEffect(() => {
        if (isDragging) {
            document.body.style.cursor = 'grabbing';
        } else {
            document.body.style.cursor = '';
        }

        return () => {
            document.body.style.cursor = '';
        };
    }, [isDragging]);

    const isArea = lineStyle === 'area';
    const chartType = isArea ? 'monotone' : lineStyle;

    return (
        <div
            className={styles.chartContainer}
            ref={chartRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isPanning ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 60,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: 'var(--axis-text)', dy: 10 }}
                        tickLine={false}
                        axisLine={{ stroke: 'var(--border-color)' }}
                        minTickGap={30}
                    />
                    <YAxis
                        tick={<CustomYAxisTick />}
                        tickLine={false}
                        axisLine={false}
                        domain={['auto', 'auto']}
                    />
                    {!isPanning && (
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: 'var(--border-color)', strokeWidth: 1, strokeDasharray: '5 5' }}
                        />
                    )}
                    {activeVariations.map((v) => {
                        const colorVar = `var(--color-${v.id})`;
                        return (
                            <React.Fragment key={v.id}>
                                <Area
                                    type={chartType as any}
                                    dataKey={v.id}
                                    name={v.name}
                                    stroke={colorVar}
                                    strokeWidth={2}
                                    fill={colorVar}
                                    fillOpacity={isArea ? 0.2 : 0}
                                    dot={false}
                                    activeDot={isPanning ? false : { r: 6, strokeWidth: 0 }}
                                    connectNulls
                                />
                            </React.Fragment>
                        );
                    })}
                    <Brush
                        dataKey="date"
                        height={30}
                        y={400}
                        stroke="var(--brush-stroke)"
                        fill="var(--brush-fill)"
                        travellerWidth={10}
                        startIndex={startIndex ?? undefined}
                        endIndex={endIndex ?? undefined}
                        onChange={(range) => {
                            if (range.startIndex !== undefined && range.endIndex !== undefined) {
                                onChangeRange(range.startIndex, range.endIndex);
                            }
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
