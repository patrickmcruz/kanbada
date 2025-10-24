import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Task, TeamMember } from '../types';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  teamMembers: TeamMember[];
}

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const DetailRow: React.FC<{ label: string; value: string | React.ReactNode }> = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</dt>
        <dd className="mt-1 text-md text-[var(--color-text-primary)]">{value}</dd>
    </div>
);


export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, teamMembers }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';

  const responsible = teamMembers.find(m => m.id === (task.ownerId ?? 'unassigned'));
  const responsibleName = responsible ? (responsible.id === 'unassigned' ? t('unassigned') : responsible.name) : 'N/A';
  
  const formatDate = (date: Date) => {
      return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  };

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
          <h2 id="task-detail-title" className="text-xl font-bold">{t('taskDetails')}</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text-primary)]"
            aria-label={t('close')}
          >
            <XIcon />
          </button>
        </header>
        
        <main className="p-6">
            <dl className="space-y-4">
                <DetailRow label={t('project')} value={task.projectId || 'N/A'} />
                <DetailRow label={t('title')} value={task.title} />
                <DetailRow label={t('responsible')} value={responsibleName} />
                {task.priority && <DetailRow label={t('priority')} value={task.priority} />}
                <DetailRow label={t('startDate')} value={formatDate(task.startDate)} />
                <DetailRow label={t('endDate')} value={formatDate(task.endDate)} />
                <DetailRow label={t('hours')} value={`${task.hours}h`} />
            </dl>
        </main>
      </div>
    </div>
  );
};