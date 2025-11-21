# LetsNote — Gerenciador de Tarefas e Projetos com Exportação CSV

<p align="center">
  <img src="https://img.shields.io/badge/Expo-50.0.0-000020?style=for-the-badge&logo=expo" />
  <img src="https://img.shields.io/badge/React_Native-Mobile-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/NativeWind-Tailwind-38BDF8?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/PNPM-Fast-F69220?style=for-the-badge&logo=pnpm" />
</p>

O **LetsNote** é um aplicativo criado com **Expo + React Native + TypeScript + NativeWind**, projetado para organizar tarefas e projetos.
Ele permite criar listas de tarefas, registrar projetos e **exportar tudo em CSV**, facilitando o compartilhamento e o backup.

---

## 🚀 Tecnologias Utilizadas:

| Tecnologia                   | Descrição                             |
| ---------------------------- | ------------------------------------- |
| **Expo**                     | Plataforma de desenvolvimento e build |
| **React Native**             | Interface mobile                      |
| **TypeScript**               | Tipagem forte e segurança             |
| **NativeWind / TailwindCSS** | Estilização com utilitários           |
| **Zustand / Context API**    | Estado global                         |
| **CSV Utils**                | Exportação de dados                   |

---

## 📋 Funcionalidades:

### ✔️ Tarefas

* Criar, editar e excluir tarefas
* Agrupamento por projeto
* Marcar tarefas concluídas

### ✔️ Projetos

* Criar projetos com facilidade
* Associar tarefas por projeto
* Visualizar progresso

### ✔️ Exportação CSV

* Exportar todas as tarefas
* Exportar por projetos
* Compartilhar pelo WhatsApp, e-mail, Drive, etc.

### ✔️ UI Moderna

* Interface estilizada com **NativeWind (Tailwind)**
* Design responsivo, rápido e minimalista

---

## 🛠️ Como Rodar o Projeto:

### Instalar dependências:

```bash
pnpm install
```

### Iniciar o app:

```bash
pnpm start
```

### Abrir no Android (emulador ou físico):

```bash
pnpm run android
```

---

## 📤 Exportação CSV:

É possível exportar:

* Todas as tarefas
* Tarefas por projeto
* Listas personalizadas

O arquivo CSV pode ser **compartilhado** ou **salvo localmente**.

---

## 📦 Gerar APK (Build):

```bash
npx expo install eas-cli
npx eas build -p android --profile preview
```

---

## 📄 Licença

Este projeto é disponibilizado para **uso pessoal e educacional**.
