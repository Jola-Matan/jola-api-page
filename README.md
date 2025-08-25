# Jola API Integration Page

A React application for securely collecting and managing API keys for various SEO tools.

## Features

- Collect API keys for multiple SEO services:
  - Semrush
  - Ahrefs
  - Similarweb
  - Keyword Planner
  - Rank Ranger
  - Screaming Frog

- Secure transmission of API keys
- User authentication integration
- Simple, clean user interface+ TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Technical Stack

- React
- TypeScript
- Tailwind CSS
- React Router
- Authentication using JWT tokens

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/jola-api-page.git

# Navigate to the project directory
cd jola-api-page

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Development

This project uses Vite as its build tool. The development server will start at `http://localhost:5173`.

## Security

- API keys are Base64 encoded before transmission
- JWT authentication for secure user sessions
- No API keys are stored in localStorage

## License

MIT
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
