import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // App.tsx
      kanbanMatrix: "Kanban Matrix",
      teamActivityOverview: "Team Activity Overview",
      // Toolbar.tsx
      today: "Today",
      day: "Day",
      week: "Week",
      month: "Month",
      // KanbanBoard.tsx
      responsible: "Responsible",
      unassigned: "Unassigned",
    }
  },
  pt: {
    translation: {
      // App.tsx
      kanbanMatrix: "Matriz Kanban",
      teamActivityOverview: "Visão Geral da Atividade da Equipe",
      // Toolbar.tsx
      today: "Hoje",
      day: "Dia",
      week: "Semana",
      month: "Mês",
      // KanbanBoard.tsx
      responsible: "Responsável",
      unassigned: "Sem responsável",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
