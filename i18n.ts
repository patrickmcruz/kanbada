import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // App.tsx
      kanbanMatrix: "Kanban Matrix",
      teamActivityOverview: "Team Activity Overview",
      setup: "Setup",
      // Toolbar.tsx
      today: "Today",
      day: "Day",
      week: "Week",
      month: "Month",
      filterByResponsible: "Filter by Responsible",
      filterByProject: "Filter by Project ID",
      all: "All",
      // KanbanBoard.tsx
      responsible: "Responsible",
      unassigned: "Unassigned",
      // SetupScreen.tsx
      theme: "Theme",
      language: "Language",
      dark: "Dark",
      light: "Light",
      close: "Close",
      // TaskDetailModal.tsx
      taskDetails: "Task Details",
      project: "Project",
      title: "Title",
      startDate: "Start Date",
      endDate: "End Date",
      hours: "Hours",
      priority: "Priority",
    }
  },
  pt: {
    translation: {
      // App.tsx
      kanbanMatrix: "Matriz Kanban",
      teamActivityOverview: "Visão Geral da Atividade da Equipe",
      setup: "Configurações",
      // Toolbar.tsx
      today: "Hoje",
      day: "Dia",
      week: "Semana",
      month: "Mês",
      filterByResponsible: "Filtrar por Responsável",
      filterByProject: "Filtrar por Projeto",
      all: "Todos",
      // KanbanBoard.tsx
      responsible: "Responsável",
      unassigned: "Sem responsável",
      // SetupScreen.tsx
      theme: "Tema",
      language: "Idioma",
      dark: "Escuro",
      light: "Claro",
      close: "Fechar",
      // TaskDetailModal.tsx
      taskDetails: "Detalhes da Tarefa",
      project: "Projeto",
      title: "Título",
      startDate: "Data de Início",
      endDate: "Data de Fim",
      hours: "Horas",
      priority: "Prioridade",
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