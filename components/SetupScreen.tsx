import React from 'react';
import { useTranslation } from 'react-i18next';

interface SetupScreenProps {
  onClose: () => void;
  currentTheme: 'dark' | 'light';
  onChangeTheme: (theme: 'dark' | 'light') => void;
  currentLang: string;
  onChangeLang: (lang: string) => void;
}

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export const SetupScreen: React.FC<SetupScreenProps> = ({ onClose, currentTheme, onChangeTheme, currentLang, onChangeLang }) => {
  const { t } = useTranslation();

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="setup-title"
    >
      <div 
        className="bg-[var(--color-surface-1)] text-[var(--color-text-primary)] rounded-lg shadow-2xl w-full max-w-md m-4"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-[var(--color-surface-2)]">
          <h2 id="setup-title" className="text-xl font-bold">{t('setup')}</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]"
            aria-label={t('close')}
          >
            <XIcon />
          </button>
        </header>
        
        <main className="p-6 space-y-6">
          {/* Theme Selection */}
          <fieldset>
            <legend className="text-lg font-medium text-[var(--color-text-primary)] mb-3">{t('theme')}</legend>
            <div className="flex gap-4">
              <button
                onClick={() => onChangeTheme('dark')}
                className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${currentTheme === 'dark' ? 'bg-[var(--color-main)] text-white' : 'bg-[var(--color-surface-2)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)]'}`}
                aria-pressed={currentTheme === 'dark'}
              >
                {t('dark')}
              </button>
              <button
                onClick={() => onChangeTheme('light')}
                className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${currentTheme === 'light' ? 'bg-[var(--color-main)] text-white' : 'bg-[var(--color-surface-2)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)]'}`}
                aria-pressed={currentTheme === 'light'}
              >
                {t('light')}
              </button>
            </div>
          </fieldset>

          {/* Language Selection */}
          <fieldset>
            <legend className="text-lg font-medium text-[var(--color-text-primary)] mb-3">{t('language')}</legend>
            <div className="flex gap-4">
              <button
                onClick={() => onChangeLang('en')}
                className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${currentLang === 'en' ? 'bg-[var(--color-main)] text-white' : 'bg-[var(--color-surface-2)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)]'}`}
                aria-pressed={currentLang === 'en'}
              >
                EN
              </button>
              <button
                onClick={() => onChangeLang('pt')}
                className={`flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${currentLang.startsWith('pt') ? 'bg-[var(--color-main)] text-white' : 'bg-[var(--color-surface-2)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-3)]'}`}
                aria-pressed={currentLang.startsWith('pt')}
              >
                PT
              </button>
            </div>
          </fieldset>
        </main>
      </div>
    </div>
  );
};
