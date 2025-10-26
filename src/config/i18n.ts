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
      sortResponsibleTooltip: "Click to sort",
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
      priorities: "Priorities",
      addPriority: "Add Priority",
      priorityName: "Priority Name",
      priorityColor: "Color",
      deletePriorityError: "This priority is in use and cannot be deleted.",
      delete: "Delete",
      deleteFirstColumnError: "The first column cannot be deleted.",
      // TaskDetailModal.tsx
      taskDetails: "Work Package Details",
      project: "Project",
      phase: "Phase",
      title: "Title",
      startDate: "Start Date",
      endDate: "End Date",
      creationDate: "Creation Date",
      duration: "Duration",
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
      sortByPriority: "Priority",
      sortByTitle: "Title",
      sortByResponsible: "Responsible",
      sortByStartDate: "Start Date",
      sortByEndDate: "End Date",
      sortByCreationDate: "Creation Date",
      // Default priority names
      urgent: "Urgent",
      high: "High",
      medium: "Medium",
      low: "Low",
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
      sortResponsibleTooltip: "Ordenar",
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
      priorities: "Prioridades",
      addPriority: "Adicionar Prioridade",
      priorityName: "Nome da Prioridade",
      priorityColor: "Cor",
      deletePriorityError: "Esta prioridade está em uso e não pode ser excluída.",
      delete: "Excluir",
      deleteFirstColumnError: "A primeira coluna não pode ser excluída.",
      // TaskDetailModal.tsx
      taskDetails: "Detalhes do Pacote de Trabalho",
      project: "Projeto",
      phase: "Fase",
      title: "Título",
      startDate: "Data de Início",
      endDate: "Data de Fim",
      creationDate: "Data de Criação",
      duration: "Duração",
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
      sortByPriority: "Prioridade",
      sortByTitle: "Título",
      sortByResponsible: "Responsável",
      sortByStartDate: "Data de Início",
      sortByEndDate: "Data de Fim",
      sortByCreationDate: "Data de Criação",
      // Default priority names
      urgent: "Urgente",
      high: "Alta",
      medium: "Média",
      low: "Baixa",
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