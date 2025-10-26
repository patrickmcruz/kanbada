import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TaskWorkPackage, TeamMember, PriorityDefinition } from '../types';
import { daysBetween } from '../utils/dateUtils';
import { getPriorityStyles } from '../utils/styleUtils';

interface WorkPackageDetailModalProps {
  workPackage: TaskWorkPackage;
  phaseTitle: string;
  projectTitle: string;
  onClose: () => void;
  teamMembers: TeamMember[];
  priorities: PriorityDefinition[];
}

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const DetailRow: React.FC<{ label: string; value: string | React.ReactNode }> = ({ label, value }) => (
    <div className="flex flex-col">
        <dt className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</dt>
        <dd className="mt-1 text-md text-[var(--color-text-primary)]">{value}</dd>
    </div>
);

export const WorkPackageDetailModal: React.FC<WorkPackageDetailModalProps> = ({ workPackage, phaseTitle, projectTitle, onClose, teamMembers, priorities }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';

  const responsible = teamMembers.find(m => m.id === (workPackage.ownerId ?? 'unassigned'));
  const responsibleName = responsible ? (responsible.id === 'unassigned' ? t('unassigned') : responsible.name) : 'N/A';
  
  const formatDate = (date: Date) => {
      return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const duration = daysBetween(workPackage.startDate, workPackage.endDate);
  const priorityStyles = getPriorityStyles(workPackage.priority, priorities);
  const priorityInfo = priorities.find(p => p.key === workPackage.priority);

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-modal-in" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-detail-title"
    >
      <div 
        className="bg-[var(--color-surface-1)] text-[var(--color-text-primary)] rounded-lg shadow-2xl w-full max-w-lg m-4"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-[var(--color-surface-2)]">
          <h2 className="text-xl font-bold">{t('taskDetails')}</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)] cursor-pointer"
            aria-label={t('close')}
          >
            <XIcon />
          </button>
        </header>
        
        <main className="p-6">
            <div className="pb-4 border-b border-[var(--color-surface-2)]">
                <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                    {projectTitle} / {phaseTitle}
                </p>
                <h3 id="task-detail-title" className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">
                    [{workPackage.projectId}] {workPackage.title}
                </h3>
            </div>
            <dl className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <DetailRow label={t('responsible')} value={responsibleName} />
                
                {priorityInfo && (
                    <DetailRow 
                        label={t('priority')} 
                        value={
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={priorityStyles.dot}></span>
                                <span className="font-medium" style={priorityStyles.text}>{priorityInfo.name}</span>
                            </div>
                        } 
                    />
                )}
                
                <DetailRow label={t('startDate')} value={formatDate(workPackage.startDate)} />
                <DetailRow label={t('endDate')} value={formatDate(workPackage.endDate)} />

                <DetailRow label={t('duration')} value={`${duration} ${duration > 1 ? t('days') : t('day_singular')}`} />
                <DetailRow label={t('hours')} value={`${workPackage.hours}h`} />
            </dl>
        </main>
      </div>
    </div>
  );
};