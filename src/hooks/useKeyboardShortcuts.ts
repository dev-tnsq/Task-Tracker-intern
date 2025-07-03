import { useEffect, useState } from 'react';

export function useKeyboardShortcuts(handlers: Record<string, () => void>) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const newPressedKeys = new Set(pressedKeys);
      newPressedKeys.add(event.key.toLowerCase());
      setPressedKeys(newPressedKeys);

      // Handle individual key shortcuts
      if (event.key === '/') {
        event.preventDefault();
        handlers.focusSearch?.();
        return;
      }

      if (event.key === 'n' && !event.metaKey && !event.ctrlKey) {
        const target = event.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          event.preventDefault();
          handlers.newTask?.();
        }
        return;
      }

      // Handle Cmd/Ctrl + Enter
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        handlers.saveTask?.();
        return;
      }

      // Handle Escape
      if (event.key === 'Escape') {
        event.preventDefault();
        handlers.escape?.();
        return;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const newPressedKeys = new Set(pressedKeys);
      newPressedKeys.delete(event.key.toLowerCase());
      setPressedKeys(newPressedKeys);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handlers, pressedKeys]);

  return { pressedKeys };
}