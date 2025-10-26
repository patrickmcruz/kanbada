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
      defaultColumnSort: "Default Column Sort",
      sprintSettings: "Sprint Settings",
      sprintDuration: "Sprint Duration (in days)",
      general: "General",
      appearance: "Appearance",
      deleteColumnError: "Cannot delete a column that contains tasks.",
      renameColumnError: "A column with this name already exists.",
      deleteColumnConfirmTitle: "Confirm Deletion",
      deleteColumnConfirmMessage: "Are you sure you want to delete the '{{columnName}}' column? All tasks within will be moved to the '{{toDoColumnName}}' column.",
      confirm: "Confirm",
      cancel: "Cancel",
      defaultResponsibleSort: "Default Responsible Column Sort",
      az: "A-Z",
      za: "Z-A",
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
      backlog: "Backlog",
      toDo: "To Do",
      sprint: "Sprint",
      doing: "Doing",
      review: "Review",
      done: "Done",
      // KanbanView.tsx
      sort: "Sort",
      sortByPriority: "Sort by Priority",
      sortByTitle: "Sort by Title",
      sortByResponsible: "Sort by Responsible",
      // Priorities
      priority_urgent: "Urgent",
      priority_high: "High",
      priority_medium: "Medium",
      priority_low: "Low",
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
      defaultColumnSort: "Ordenação Padrão da Coluna",
      sprintSettings: "Configurações da Sprint",
      sprintDuration: "Duração da Sprint (em dias)",
      general: "Geral",
      appearance: "Aparência",
      deleteColumnError: "Não é possível excluir uma coluna que contém tarefas.",
      renameColumnError: "Já existe uma coluna com este nome.",
      deleteColumnConfirmTitle: "Confirmar Exclusão",
      deleteColumnConfirmMessage: "Tem certeza de que deseja excluir a coluna '{{columnName}}'? Todas as tarefas contidas nela serão movidas para a coluna '{{toDoColumnName}}'.",
      confirm: "Confirmar",
      cancel: "Cancelar",
      defaultResponsibleSort: "Ordenação Padrão da Coluna Responsável",
      az: "A-Z",
      za: "Z-A",
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
      backlog: "Backlog",
      toDo: "A Fazer",
      sprint: "Sprint",
      doing: "Em Andamento",
      review: "Homologação",
      done: "Feito",
      // KanbanView.tsx
      sort: "Ordenar",
      sortByPriority: "Ordenar por Prioridade",
      sortByTitle: "Ordenar por Título",
      sortByResponsible: "Ordenar por Responsável",
      // Priorities
      priority_urgent: "Urgente",
      priority_high: "Alta",
      priority_medium: "Média",
      priority_low: "Baixa",
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