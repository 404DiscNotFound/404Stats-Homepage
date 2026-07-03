import { useState, useEffect, useCallback } from "react";

const STORAGE_PREFIX = "f0f_dashboard_";

export const DEFAULT_CARDS = [
  { id: "donuts", visible: true },
  { id: "funFacts", visible: true },
  { id: "trends", visible: true },
  { id: "topBlocks", visible: true },
  { id: "leaderboards", visible: true },
  { id: "rareBlocks", visible: true },
  { id: "achievements", visible: true },
];

function loadLayout(slug) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + slug);
    if (!raw) return DEFAULT_CARDS;
    const saved = JSON.parse(raw);
    // Merge: add any new cards not in saved, remove any that no longer exist
    const savedIds = new Set(saved.map(c => c.id));
    const defaultIds = new Set(DEFAULT_CARDS.map(c => c.id));
    const merged = [
      ...saved.filter(c => defaultIds.has(c.id)),
      ...DEFAULT_CARDS.filter(c => !savedIds.has(c.id)),
    ];
    return merged;
  } catch {
    return DEFAULT_CARDS;
  }
}

export function useDashboardLayout(slug) {
  const [layout, setLayout] = useState(() => loadLayout(slug));

  useEffect(() => {
    setLayout(loadLayout(slug));
  }, [slug]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + slug, JSON.stringify(layout));
    } catch { /* ignore */ }
  }, [slug, layout]);

  const toggleVisible = useCallback((cardId) => {
    setLayout(prev => prev.map(c => c.id === cardId ? { ...c, visible: !c.visible } : c));
  }, []);

  const reorder = useCallback((sourceIndex, destIndex) => {
    setLayout(prev => {
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(destIndex, 0, moved);
      return next;
    });
  }, []);

  const reset = useCallback(() => setLayout(DEFAULT_CARDS), []);

  const isVisible = useCallback((cardId) => {
    const card = layout.find(c => c.id === cardId);
    return card ? card.visible : true;
  }, [layout]);

  return { layout, toggleVisible, reorder, reset, isVisible };
}