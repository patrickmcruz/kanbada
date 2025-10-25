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
      filterPlaceholder: "Search by responsible, project, or title...",
      all: "All",
      // KanbanBoard.tsx
      responsible: "Responsible",
      unassigned: "Unassigned",
      // SetupScreen.tsx & FilterModal.tsx
      theme: "Theme",
      language: "Language",
      dark: "Dark",
      light: "Light",
      close: "Close",
      advancedFilters: "Advanced Filters",
      applyFilters: "Apply Filters",
      clearFilters: "Clear Filters",
      // TaskDetailModal.tsx
      taskDetails: "Work Package Details",
      project: "Project",
      phase: "Phase",
      title: "Title",
      startDate: "Start Date",
      endDate: "End Date",
      duration: "Duration",
      // FIX: Renamed 'day' to 'day_singular' to avoid duplicate key error.
      day_singular: "day",
      days: "days",
      hours: "Hours",
      priority: "Priority",
      tasks: "Tasks",
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
      filterPlaceholder: "Buscar por responsável, projeto ou título...",
      all: "Todos",
      // KanbanBoard.tsx
      responsible: "Responsável",
      unassigned: "Sem responsável",
      // SetupScreen.tsx & FilterModal.tsx
      theme: "Tema",
      language: "Idioma",
      dark: "Escuro",
      light: "Claro",
      close: "Fechar",
      advancedFilters: "Filtros Avançados",
      applyFilters: "Aplicar Filtros",
      clearFilters: "Limpar Filtros",
      // TaskDetailModal.tsx
      taskDetails: "Detalhes do Pacote de Trabalho",
      project: "Projeto",
      phase: "Fase",
      title: "Título",
      startDate: "Data de Início",
      endDate: "Data de Fim",
      duration: "Duração",
      // FIX: Renamed 'day' to 'day_singular' to avoid duplicate key error.
      day_singular: "dia",
      days: "dias",
      hours: "Horas",
      priority: "Prioridade",
      tasks: "Tarefas",
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