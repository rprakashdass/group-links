# React Tailwind Template

This is a minimal, production-ready template for React projects using **Vite**, **TypeScript**, **Tailwind CSS**, and **pnpm**. The template is optimized for fast builds and modern web development workflows.

## Features

- **Vite**: A blazing-fast build tool for modern web projects.
- **React 18**: The latest version of React for building user interfaces.
- **TypeScript**: Type-safe development for scalable applications.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **SWC**: A super-fast compiler for modern JavaScript and TypeScript.
- **pnpm**: A fast, disk-space-efficient package manager.

---

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16.14 or later recommended)
- [pnpm](https://pnpm.io/) (v7 or later)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/rprakashdass/react-tailwind-template.git
cd react-tailwind-template
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Run the Development Server

```bash
pnpm dev
```

The development server will start, and the app will be accessible at [http://localhost:5173](http://localhost:5173).

---

## Project Structure

```
react-tailwind-template/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, fonts, and other static resources
│   ├── components/     # Reusable React components
│   ├── pages/          # Page components
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Entry point for React
│   ├── styles/         # Tailwind CSS configuration and global styles
│   └── vite-env.d.ts   # TypeScript definitions for Vite
├── .eslintrc.cjs       # ESLint configuration
├── .prettierrc         # Prettier configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── package.json        # Project metadata
```

---

## Scripts

- **`pnpm dev`**: Start the development server.
- **`pnpm build`**: Build the application for production.
- **`pnpm preview`**: Preview the production build.
- **`pnpm lint`**: Lint the codebase using ESLint.
- **`pnpm format`**: Format the codebase using Prettier.

---

## Styling with Tailwind CSS

Tailwind CSS is pre-configured and ready to use. Add your custom styles in `src/styles/tailwind.css` or extend the configuration in `tailwind.config.js`.

### Example:

```tsx
export default function ExampleComponent() {
  return <div className="p-4 bg-blue-500 text-white">Hello, Tailwind!</div>;
}
```

---

## TypeScript

TypeScript is enabled for type safety and better developer experience. Use `.ts` or `.tsx` files for your components and logic.

---

## Deployment

1. Build the project:
   ```bash
   pnpm build
   ```

2. Deploy the `dist/` folder to your hosting provider.

---

## Contributing

Feel free to open issues or create pull requests to improve this template. Contributions are welcome!

---

## License

This project is licensed under the [MIT License](LICENSE).

---