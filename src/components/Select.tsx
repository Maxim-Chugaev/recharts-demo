import React from 'react';
import styles from '../styles/Select.module.css';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    label?: string;
    value: string | string[];
    options: SelectOption[];
    onChange: (value: string) => void;
    multiple?: boolean;
    prefix?: string;
}

export const Select: React.FC<SelectProps> = ({
    label,
    value,
    options,
    onChange,
    multiple = false,
    prefix,
}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOptionClick = (optionValue: string) => {
        onChange(optionValue);
        if (!multiple) {
            setIsOpen(false);
        }
    };

    const getDisplayValue = () => {
        if (multiple) {
            const selected = options.filter(o => (value as string[]).includes(o.value));
            if (selected.length === 0) return 'Select...';
            if (selected.length === options.length) return 'All Variations';
            return selected.map(o => o.label).join(', ');
        } else {
            const label = options.find(o => o.value === value)?.label || value;
            return prefix ? `${prefix}${label}` : label;
        }
    };

    return (
        <div className={styles.container} ref={containerRef}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.select} onClick={() => setIsOpen(!isOpen)}>
                <span className={styles.value}>{getDisplayValue()}</span>
                <ChevronDown size={14} color="#675D5E" strokeWidth={1.5} />
            </div>
            {isOpen && (
                <div className={styles.dropdown}>
                    {options.map((option) => {
                        const isSelected = multiple
                            ? (value as string[]).includes(option.value)
                            : value === option.value;

                        return (
                            <div
                                key={option.value}
                                className={`${styles.option} ${isSelected ? styles.selected : ''}`}
                                onClick={() => handleOptionClick(option.value)}
                            >
                                {multiple && (
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        readOnly
                                        className={styles.checkbox}
                                    />
                                )}
                                {option.label}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
