'use client';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} className="px-3 py-1.5 rounded-lg border hover:bg-white/70 dark:hover:bg-neutral-800">
      {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  );
}
