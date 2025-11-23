import React from 'react';
import type { Variation, TimeFrame } from '../utils/dataProcessing';
import { Select } from './Select';
import { Download } from 'lucide-react';
import styles from '../styles/Controls.module.css';

export type LineStyle = 'monotone' | 'linear' | 'step' | 'area';

interface ControlsProps {
    variations: Variation[];
    selectedVariations: string[];
    onToggleVariation: (id: string) => void;
    timeFrame: TimeFrame;
    onSetTimeFrame: (tf: TimeFrame) => void;
    lineStyle: LineStyle;
    onSetLineStyle: (style: LineStyle) => void;
    onExport: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
    variations,
    selectedVariations,
    onToggleVariation,
    timeFrame,
    onSetTimeFrame,
    lineStyle,
    onSetLineStyle,
    onExport,
}) => {
    const variationOptions = variations.map(v => ({ value: v.id, label: v.name }));
    const timeFrameOptions = [
        { value: 'day', label: 'Day' },
        { value: 'week', label: 'Week' },
    ];
    const lineStyleOptions = [
        { value: 'monotone', label: 'Smooth' },
        { value: 'linear', label: 'Linear' },
        { value: 'step', label: 'Step' },
        { value: 'area', label: 'Area' },
    ];

    return (
        <div className={styles.controls}>
            <div className={styles.group}>
                <Select
                    value={selectedVariations}
                    options={variationOptions}
                    onChange={onToggleVariation}
                    multiple
                />
                <Select
                    value={timeFrame}
                    options={timeFrameOptions}
                    onChange={(val) => onSetTimeFrame(val as TimeFrame)}
                />
            </div>

            <div className={styles.section}>
                <Select
                    value={lineStyle}
                    options={lineStyleOptions}
                    onChange={(val) => onSetLineStyle(val as LineStyle)}
                    prefix="Line style: "
                />
                <button className={styles.exportButton} onClick={onExport}>
                    <Download size={16} color="#675D5E" strokeWidth={1.5} />
                </button>
            </div>
        </div>
    );
};
