import React, { useState, useMemo, useEffect } from 'react';
import { LineChart } from './LineChart';
import { Controls } from './Controls';
import type { LineStyle } from './Controls';
import { ZoomControls } from './ZoomControls';
import { getChartData, variations } from '../utils/dataProcessing';
import type { TimeFrame } from '../utils/dataProcessing';
import styles from '../styles/ChartContainer.module.css';
import { Sun, Moon } from 'lucide-react';

import html2canvas from 'html2canvas';

export const ChartContainer: React.FC = () => {
    const [timeFrame, setTimeFrame] = useState<TimeFrame>('day');
    const [selectedVariations, setSelectedVariations] = useState<string[]>(
        variations.map((v) => v.id)
    );
    const [lineStyle, setLineStyle] = useState<LineStyle>('monotone');
    const [isPanning, setIsPanning] = useState(false);

    // Zoom state
    const [leftIndex, setLeftIndex] = useState<number | null>(null);
    const [rightIndex, setRightIndex] = useState<number | null>(null);

    // Theme state
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const savedTheme = localStorage.getItem('theme');
        return (savedTheme as 'light' | 'dark') || 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const data = useMemo(() => getChartData(timeFrame), [timeFrame]);

    // Reset zoom when data changes
    useEffect(() => {
        setLeftIndex(0);
        setRightIndex(data.length - 1);
    }, [data]);

    const handleToggleVariation = (id: string) => {
        setSelectedVariations((prev) => {
            if (prev.includes(id)) {
                if (prev.length === 1) return prev;
                return prev.filter((v) => v !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const getCurrentRange = () => {
        const start = leftIndex ?? 0;
        const end = rightIndex ?? data.length - 1;
        return { start, end, length: end - start + 1 };
    };

    const handleZoomIn = () => {
        const { start, end, length } = getCurrentRange();
        if (length <= 2) return; // Minimum zoom level

        const zoomFactor = Math.max(1, Math.floor(length * 0.2)); // Zoom in by 20%
        const newStart = Math.min(start + zoomFactor, end - 1);
        const newEnd = Math.max(end - zoomFactor, start + 1);

        setLeftIndex(newStart);
        setRightIndex(newEnd);
    };

    const handleZoomOut = () => {
        const { start, end } = getCurrentRange();
        const length = data.length;

        // If already at full range, do nothing
        if (start === 0 && end === length - 1) return;

        const currentLen = end - start + 1;
        const zoomFactor = Math.max(1, Math.floor(currentLen * 0.2));

        const newStart = Math.max(0, start - zoomFactor);
        const newEnd = Math.min(length - 1, end + zoomFactor);

        setLeftIndex(newStart);
        setRightIndex(newEnd);
    };

    const handleResetZoom = () => {
        setLeftIndex(0);
        setRightIndex(data.length - 1);
        setIsPanning(false);
        // Reset all settings to initial values
        setTimeFrame('day');
        setSelectedVariations(variations.map((v) => v.id));
        setLineStyle('monotone');
    };

    const handleExport = async () => {
        const element = document.querySelector(`.${styles.card}`) as HTMLElement;
        if (element) {
            const canvas = await html2canvas(element);
            const link = document.createElement('a');
            link.download = 'chart-export.png';
            link.href = canvas.toDataURL();
            link.click();
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Conversion Rate Statistics</h1>
            </header>

            <div className={styles.card}>
                <div className={styles.controlsRow}>
                    <Controls
                        variations={variations}
                        selectedVariations={selectedVariations}
                        onToggleVariation={handleToggleVariation}
                        timeFrame={timeFrame}
                        onSetTimeFrame={setTimeFrame}
                        lineStyle={lineStyle}
                        onSetLineStyle={setLineStyle}
                        onExport={handleExport}
                    />
                    <div className={styles.rightControls}>
                        <ZoomControls
                            onZoomIn={handleZoomIn}
                            onZoomOut={handleZoomOut}
                            onReset={handleResetZoom}
                            isPanning={isPanning}
                            onTogglePan={() => setIsPanning(!isPanning)}
                        />
                        <button
                            className={styles.themeToggle}
                            onClick={toggleTheme}
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                        >
                            {theme === 'light' ? (
                                <Moon size={16} color="currentColor" strokeWidth={1.5} />
                            ) : (
                                <Sun size={16} color="currentColor" strokeWidth={1.5} />
                            )}
                        </button>
                    </div>
                </div>
                <LineChart
                    data={data}
                    variations={variations}
                    selectedVariations={selectedVariations}
                    lineStyle={lineStyle}
                    startIndex={leftIndex}
                    endIndex={rightIndex}
                    isPanning={isPanning}
                    onChangeRange={(start: number, end: number) => {
                        setLeftIndex(start);
                        setRightIndex(end);
                    }}
                />
            </div>
        </div>
    );
};
