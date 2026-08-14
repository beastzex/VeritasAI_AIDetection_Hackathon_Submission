import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { flushSync } from 'react-dom';

export default function ToggleTheme({
  className = '',
  duration = 450,
  animationType = 'swipe-down',
  ...props
}) {
  const [isDark, setIsDark] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let styleElement = document.getElementById('toggle-theme-vt-override');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'toggle-theme-vt-override';
      styleElement.textContent = `
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
          mix-blend-mode: normal;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, [animationType]);

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return;

    // If View Transitions API is not supported, fallback to immediate toggle
    if (!document.startViewTransition) {
      const newTheme = !isDark;
      setIsDark(newTheme);
      if (newTheme) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('veritas_tg_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('veritas_tg_theme', 'light');
      }
      return;
    }

    // Wait for the DOM update to complete within the View Transition
    await document.startViewTransition(() => {
      flushSync(() => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        if (newTheme) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('veritas_tg_theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('veritas_tg_theme', 'light');
        }
      });
    }).ready;

    const viewportHeight = window.innerHeight;

    // Execute the requested 'swipe-down' animation from Lightswind UI
    if (animationType === 'swipe-down') {
      document.documentElement.animate(
        {
          clipPath: [
            `inset(0 0 ${viewportHeight}px 0)`,
            `inset(0 0 0 0)`,
          ],
        },
        {
          duration,
          easing: 'cubic-bezier(0.2, 0, 0, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    }
  }, [isDark, duration, animationType]);

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className={`w-8 h-8 rounded-[4px] bg-[#f9f9f9] dark:bg-[#18181b] border border-[#ebebeb] dark:border-[#27272a] hover:border-black dark:hover:border-[#3f3f46] flex items-center justify-center text-black dark:text-white transition-colors ${className}`}
      {...props}
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5 text-[#fc4c02]" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-[#000000]" />
      )}
    </button>
  );
}
