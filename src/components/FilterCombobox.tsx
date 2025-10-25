import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-text-secondary)]"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

interface FilterComboboxProps {
    value: string[];
    onChange: (value: string[]) => void;
    options: string[];
    placeholder: string;
    renderOption?: (option: string) => React.ReactNode;
    showSearch?: boolean;
}

export const FilterCombobox: React.FC<FilterComboboxProps> = ({ value, onChange, options, placeholder, renderOption, showSearch = true }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const handleToggleOption = (option: string) => {
        const newValue = value.includes(option)
            ? value.filter(item => item !== option)
            : [...value, option];
        onChange(newValue);
    };

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const displayValue = value.length > 0 ? value.join(', ') : '';

    return (
        <div className="relative w-1/3" ref={containerRef}>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <SearchIcon />
                </span>
                <input
                    type="text"
                    readOnly
                    onFocus={() => setIsOpen(true)}
                    onClick={() => setIsOpen(true)}
                    placeholder={placeholder}
                    value={displayValue}
                    className="w-full rounded-md border border-[var(--color-surface-3)] bg-[var(--color-surface-2)] py-2 pl-10 pr-10 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-main)] cursor-pointer truncate"
                />
                {value.length > 0 && (
                    <button
                        onClick={() => onChange([])}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                        aria-label={t('clearFilter') as string}
                    >
                        <XIcon />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute z-30 w-full mt-1 bg-[var(--color-surface-2)] border border-[var(--color-surface-3)] rounded-md shadow-lg">
                    {showSearch && (
                        <div className="p-2 border-b border-[var(--color-surface-3)]">
                            <input
                                type="text"
                                placeholder={t('searchInDropdown') as string}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-md border border-[var(--color-surface-3)] bg-[var(--color-back)] py-1.5 px-3 text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-main)]"
                                autoFocus
                            />
                        </div>
                    )}
                    <ul className="py-1 max-h-60 overflow-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li
                                    key={option}
                                    onClick={() => handleToggleOption(option)}
                                    className="px-3 py-2 text-sm text-[var(--color-text-primary)] cursor-pointer hover:bg-[var(--color-surface-3)] flex items-center gap-3"
                                >
                                    <input
                                        type="checkbox"
                                        checked={value.includes(option)}
                                        readOnly
                                        className="h-4 w-4 rounded bg-[var(--color-surface-1)] border-[var(--color-surface-3)] text-[var(--color-main)] focus:ring-[var(--color-main)]"
                                    />
                                    {renderOption ? renderOption(option) : <span>{option}</span>}
                                </li>
                            ))
                        ) : (
                            <li className="px-3 py-2 text-sm text-[var(--color-text-secondary)] italic">
                                {t('noOptionsFound')}
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};