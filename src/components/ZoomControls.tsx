import React from 'react';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import styles from '../styles/ZoomControls.module.css';
import clsx from 'clsx';

interface ZoomControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onReset: () => void;
    isPanning: boolean;
    onTogglePan: () => void;
}

const MoveCursorIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.75,0 L2.75,0.6875 L0.859375,0.6875 C0.764451064,0.6875 0.6875,0.764451064 0.6875,0.859375 L0.6875,2.75 L0,2.75 L0,0.343750082 C0,0.15390221 0.153902128,0 0.34375,0 L2.75,0 Z M5.5,0.6875 L5.5,0 L7.90625,0 C8.09609771,0 8.25,0.153902128 8.25,0.34375 L8.25,2.75 L7.5625,2.75 L7.5625,0.859375 C7.5625,0.764451064 7.48554885,0.6875 7.390625,0.6875 L5.5,0.6875 Z M0,7.90625 C0,8.09609771 0.15390221,8.25 0.343750082,8.25 L2.75,8.25 L2.75,7.5625 L0.859375,7.5625 C0.764451064,7.5625 0.6875,7.48554885 0.6875,7.390625 L0.6875,5.5 L0,5.5 L0,7.90625 Z M5.98788112,11 L7.73018342,8.24386442 L11,7.33280838 L4.125,3.4375 L5.98788112,11 Z" fill="currentColor" />
    </svg>
);

export const ZoomControls: React.FC<ZoomControlsProps> = ({
    onZoomIn,
    onZoomOut,
    onReset,
    isPanning,
    onTogglePan,
}) => {
    return (
        <div className={styles.zoomControls}>
            <button
                className={clsx(styles.panButton, isPanning && styles.active)}
                onClick={onTogglePan}
                title="Toggle Pan"
            >
                <MoveCursorIcon size={16} />
            </button>

            <div className={styles.group}>
                <button className={styles.button} onClick={onZoomIn} title="Zoom In">
                    <Plus size={14} />
                </button>
                <button className={styles.button} onClick={onZoomOut} title="Zoom Out">
                    <Minus size={14} />
                </button>
            </div>

            <button className={styles.resetButton} onClick={onReset} title="Reset Zoom">
                <RotateCcw size={16} />
            </button>
        </div>
    );
};
