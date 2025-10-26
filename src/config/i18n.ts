import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // App.tsx
      workloadView: "Workload View",
      teamActivityOverview: "Team Activity Overview",
      setup: "Setup",
      // Toolbar.tsx
      today: "Today",
      day: "Day",
      week: "Week",
      month: "Month",
      cardNamePlaceholder: "Card...",
      responsiblePlaceholder: "Responsible...",
      priorityPlaceholder: "Priority...",
      clearFilter: "Clear filter",
      noOptionsFound: "No options found",
      searchInDropdown: "Search options...",
      workload: "Workload",
      kanban: "Kanban",
      // WorkloadView.tsx
      responsible: "Responsible",
      unassigned: "Unassigned",
      // SetupScreen.tsx
      theme: "Theme",
      language: "Language",
      dark: "Dark",
      light: "Light",
      close: "Close",
      kanbanColumns: "Kanban Columns",
      addColumn: "Add column",
      columnNamePlaceholder: "Column name...",
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
      // Default Kanban Columns
      toDo: "To Do",
      sprint: "Sprint",
      doing: "Doing",
      done: "Done",
      // KanbanView.tsx
      sort: "Sort",
      sortByPriority: "Sort by Priority",
      sortByTitle: "Sort by Title",
      sortByResponsible: "Sort by Responsible",
    }
  },
  pt: {
    translation: {
      // App.tsx
      workloadView: "Visão de Carga de Trabalho",
      teamActivityOverview: "Visão Geral da Atividade da Equipe",
      setup: "Configurações",
      // Toolbar.tsx
      today: "Hoje",
      day: "Dia",
      week: "Semana",
      month: "Mês",
      cardNamePlaceholder: "Card/Projeto...",
      responsiblePlaceholder: "Responsável...",
      priorityPlaceholder: "Prioridade...",
      clearFilter: "Limpar filtro",
      noOptionsFound: "Nenhuma opção encontrada",
      searchInDropdown: "Buscar opções...",
      workload: "Carga de Trabalho",
      kanban: "Kanban",
      // WorkloadView.tsx
      responsible: "Responsável",
      unassigned: "Sem responsável",
      // SetupScreen.tsx
      theme: "Tema",
      language: "Idioma",
      dark: "Escuro",
      light: "Claro",
      close: "Fechar",
      kanbanColumns: "Colunas do Kanban",
      addColumn: "Adicionar coluna",
      columnNamePlaceholder: "Nome da coluna...",
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
      // Default Kanban Columns
      toDo: "A Fazer",
      sprint: "Sprint",
      doing: "Em Andamento",
      done: "Feito",
      // KanbanView.tsx
      sort: "Ordenar",
      sortByPriority: "Ordenar por Prioridade",
      sortByTitle: "Ordenar por Título",
      sortByResponsible: "Ordenar por Responsável",
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