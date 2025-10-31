# Kanbada - Workload View

[![Linguagem](https://img.shields.io/badge/language-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![Framework](https://img.shields.io/badge/framework-React-61DAFB.svg)](https://reactjs.org/)
[![Estilização](https://img.shields.io/badge/styling-TailwindCSS-38B2AC.svg)](https://tailwindcss.com/)
[![Licença](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-ativo-brightgreen.svg)]()

Uma visão de carga de trabalho moderna para visualizar as atividades da equipe. Permite que os usuários visualizem tarefas por dia, semana ou mês com navegação detalhada (drill-down e drill-up).

## 📑 Tabela de Conteúdos

1.  [📌 Visão Geral](#visão-geral)
2.  [✨ Principais Funcionalidades](#principais-funcionalidades)
3.  [🧰 Stack de Tecnologia](#stack-de-tecnologia)
4.  [🗂️ Estrutura do Projeto](#estrutura-do-projeto)
5.  [🚀 Começando](#começando)
    * [Pré-requisitos](#pré-requisitos)
    * [Instalação e Execução](#instalação-e-execução)
6.  [⚙️ Configuração e Customização](#configuração-e-customização)
    * [Temas](#temas)
    * [Idiomas](#idiomas)
    * [Colunas do Kanban](#colunas-do-kanban)
    * [Prioridades](#prioridades)
7.  [🧠 Conceitos Principais](#conceitos-principais)
    * [Modelo de Dados](#modelo-de-dados)
    * [Gerenciamento de Estado](#gerenciamento-de-estado)
8.  [🤝 Contribuindo](#contribuindo)
9.  [🔨 Créditos](#créditos)
10. [📞 Suporte](#suporte)
11. [📄 Licença](#licença)


## 📌 Visão Geral

A aplicação **Workload View** oferece uma interface rica e interativa para gerenciar e visualizar a carga de trabalho de uma equipe. Ela é projetada para fornecer clareza sobre as tarefas alocadas, prazos e responsabilidades, ajudando na tomada de decisões e no planejamento de projetos.

A aplicação possui duas visualizações principais:
*   **Workload View**: Uma visualização de cronograma (timeline/Gantt) que exibe as tarefas distribuídas ao longo do tempo (dias, semanas ou meses) para cada membro da equipe.
*   **Kanban View**: Um quadro Kanban tradicional que mostra as tarefas dentro de um sprint semanal, organizadas por status (ex: A Fazer, Em Andamento, Concluído).

## ✨ Principais Funcionalidades

- **Visualizações Duplas**: Alterne facilmente entre a visão de Workload e Kanban.
- **Navegação Temporal**: Navegue para frente e para trás no tempo e alterne entre as visualizações de Dia, Semana e Mês.
- **Filtragem Avançada**: Filtre tarefas por nome do card/projeto, responsável ou prioridade.
- **Drag-and-Drop**: Mova tarefas entre colunas no quadro Kanban para atualizar seu status.
- **Totalmente Customizável**: Configure temas (claro/escuro), colunas do Kanban, prioridades, idioma e mais através de uma tela de configurações dedicada.
- **Detalhes da Tarefa**: Dê um duplo clique em qualquer tarefa para ver seus detalhes completos em um modal.
- **Internacionalização (i18n)**: Suporte para múltiplos idiomas (Inglês e Português por padrão).
- **Design Responsivo**: Interface funcional em diferentes tamanhos de tela.

## 🧰 Stack de Tecnologia

*   **React 19**: Biblioteca principal para a construção da interface de usuário.
*   **TypeScript**: Para tipagem estática, melhorando a robustez e a manutenibilidade do código.
*   **Tailwind CSS**: Framework CSS utility-first para estilização rápida e consistente.
*   **i18next & react-i18next**: Para a gestão da internacionalização e traduções.

## 🗂️ Estrutura do Projeto

O código-fonte está organizado da seguinte forma para garantir escalabilidade e clareza:

```
/src
├── components/      # Componentes React reutilizáveis (Toolbar, Modal, etc.)
├── config/          # Configurações da aplicação (i18n)
├── data/            # Dados estáticos/mock (membros da equipe, pacotes de trabalho)
├── hooks/           # Hooks React customizados (ex: useWorkload)
├── types/           # Definições de tipos TypeScript globais
├── utils/           # Funções utilitárias (manipulação de datas, estilos)
├── views/           # Componentes de tela principais (WorkloadView, KanbanView)
├── App.tsx          # Componente raiz que orquestra a aplicação
└── main.tsx         # Ponto de entrada da aplicação React
```

## 🚀 Começando

Siga estas instruções para obter uma cópia do projeto e executá-lo em sua máquina local para desenvolvimento e testes.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18.x ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Instalação e Execução

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/patrickmcruz/kanbada
    cd kanbada
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Execute a aplicação:**
    ```bash
    npm run dev
    # ou
    yarn dev
    ```
    A aplicação estará disponível em `http://localhost:5173` (ou outra porta disponível).

## ⚙️ Configuração e Customização

A maioria das configurações pode ser acessada clicando no ícone de engrenagem no canto superior direito da aplicação.

### Temas
Alterne entre os temas **Dark** (padrão) e **Light** na aba "Geral" das configurações.

### Idiomas
Mude o idioma entre **Inglês (EN)** e **Português (PT)** na aba "Geral". Para adicionar um novo idioma, edite o arquivo `src/config/i18n.ts`, adicionando um novo recurso de tradução.

### Colunas do Kanban
Na aba "Kanban", você pode:
- **Adicionar** novas colunas.
- **Renomear** colunas existentes com um duplo clique.
- **Reordenar** colunas arrastando-as.
- **Excluir** colunas (exceto a primeira), o que moverá todas as tarefas para a primeira coluna.

### Prioridades
Na aba "Geral", você pode gerenciar as prioridades:
- **Adicionar** novas prioridades com nome e cor.
- **Editar** o nome e a cor de prioridades existentes.
- **Reordenar** a ordem de importância das prioridades arrastando-as.
- **Excluir** prioridades que não estão em uso.

## 🧠 Conceitos Principais

### Modelo de Dados
A estrutura de dados principal está definida em `src/types/index.ts`. A entidade fundamental é o `TaskWorkPackage`, que representa uma tarefa agendável. As tarefas são agrupadas dentro de `PhaseWorkPackage` (para Projetos) ou diretamente em `DemandWorkPackage`.

### Gerenciamento de Estado
A lógica de negócio e o estado principal da aplicação são centralizados no hook customizado `useWorkload` (`src/hooks/useWorkload.ts`). Este hook é responsável por:
- Carregar os dados iniciais.
- Aplicar filtros.
- Processar atualizações de estado (ex: mudança de status de uma tarefa).
- Fornecer os dados computados (tarefas filtradas, opções de filtro) para os componentes da UI.

## 🔨 Créditos

**Criado por:** [Patrick Motin Cruz](https://github.com/patrickcruzutfpr)
**Pós-graduado:** Estudante de Ciência de Dados na Universidade Tecnológica Federal do Paraná (UTFPR).
**Desenvolvedor de Software de Aprendizado de Máquina** na Prefeitura Municipal de Curitiba. Tempo integral.

## 📞 Suporte

Para suporte e dúvidas:
- Crie uma issue no [GitHub Issues](https://github.com/patrickcruzutfpr/family-budget-app/issues)
- Consulte a documentação existente na pasta `/docs`
- Revise a seção de solução de problemas acima

## 📄 Licença

Este projeto está licenciado sob a **GNU Affero General Public License v3.0 (AGPL-3.0)**.
Você tem permissão para usar, modificar e distribuir este software sob os termos da licença AGPL-3.0. Se você executar uma versão modificada deste software em um servidor e permitir que usuários interajam com ele por meio de uma rede, você deverá disponibilizar o código-fonte da sua versão modificada para esses usuários.
Para mais detalhes, consulte o arquivo [LICENSE](LICENSE) ou visite [GNU AGPL v3.0](https://www.gnu.org/licenses/agpl-3.0.html).

## 🤝 Contribuindo

Contribuições são o que tornam a comunidade de código aberto um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será **muito apreciada**.

1.  Faça um Fork do Projeto
2.  Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Faça o Commit de suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4.  Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5.  Abra um Pull Request

---

© 2025 Patrick Motin Cruz. All rights reserved under AGPL-3.0.

