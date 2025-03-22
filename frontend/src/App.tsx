import './App.css';
import { useState } from 'react';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div
      className={`flex flex-col justify-center items-center gap-10 h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}
    >
      <div className="relative w-52 h-52 overflow-hidden">
        <img
          src="/portfolio.png"
          alt="Portfolio icon of rprakashdass"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="inline-flex items-center gap-2">
        <p>The template is made with ❤️ by</p>
        <a
          href="https://www.rprakashdass.in"
          className="text-blue-500 hover:text-blue-700 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          rprakashdass
        </a>

      </div>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="relative bg-purple-500 shadow px-4 py-2 rounded text-white"
      >
        Toggle {darkMode ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  );
}

export default App;
