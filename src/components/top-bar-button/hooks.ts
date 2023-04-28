import { useRef, useState } from 'react';

export function useTopBarButton() {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  function toggleMenu() {
    setMenuOpen((open) => !open);
  }

  return {
    ref,
    isMenuOpen,
    toggleMenu,
  };
}
