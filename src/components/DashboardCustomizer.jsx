import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Settings2, GripVertical, RotateCcw, Eye, EyeOff } from "lucide-react";
import { useT } from "@/lib/i18n";

const CARD_LABELS = {
  donuts: "customizer.card.donuts",
  funFacts: "customizer.card.funFacts",
  trends: "customizer.card.trends",
  topBlocks: "customizer.card.topBlocks",
  leaderboards: "customizer.card.leaderboards",
  rareBlocks: "customizer.card.rareBlocks",
  achievements: "customizer.card.achievements",
};

export default function DashboardCustomizer({ layout, onToggle, onReorder, onReset }) {
  const [open, setOpen] = useState(false);
  const t = useT();

  const handleDragEnd = (result) => {
    if (!result.destination || result.destination.index === result.source.index) return;
    onReorder(result.source.index, result.destination.index);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#1A1A24] bg-[#0A0A0F] px-3 py-2 text-xs font-bold text-gray-400 transition-all hover:border-[#00F5FF]/30 hover:text-[#00F5FF]"
      >
        <Settings2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t("customizer.button")}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-md rounded-2xl border border-[#1A1A24] bg-[#0A0A0F] p-5 shadow-[0_0_30px_rgba(0,245,255,0.1)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-1 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white">
                <Settings2 className="h-4 w-4 text-[#00F5FF]" />
                {t("customizer.title")}
              </h2>
              <button
                onClick={onReset}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold text-gray-500 transition-colors hover:text-[#FF0055]"
              >
                <RotateCcw className="h-3 w-3" />
                {t("customizer.reset")}
              </button>
            </div>
            <p className="mb-4 text-xs text-gray-600">{t("customizer.hint")}</p>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="cards">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-1.5">
                    {layout.map((card, index) => (
                      <Draggable key={card.id} draggableId={card.id} index={index}>
                        {(prov, snapshot) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            className={`flex items-center gap-3 rounded-lg border p-2.5 transition-all ${
                              snapshot.isDragging
                                ? "border-[#00F5FF]/50 bg-[#0F0F18] shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                                : card.visible
                                  ? "border-[#1A1A24] bg-[#0A0A0F]"
                                  : "border-[#1A1A24] bg-[#0A0A0F] opacity-50"
                            }`}
                          >
                            <span {...prov.dragHandleProps} className="cursor-grab text-gray-600 hover:text-[#00F5FF]">
                              <GripVertical className="h-4 w-4" />
                            </span>
                            <span className="flex-1 text-xs font-bold text-white">
                              {t(CARD_LABELS[card.id] || card.id)}
                            </span>
                            <button
                              onClick={() => onToggle(card.id)}
                              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold transition-colors ${
                                card.visible
                                  ? "text-[#00F5FF] hover:bg-[#00F5FF]/10"
                                  : "text-gray-500 hover:bg-[#FF0055]/10 hover:text-[#FF0055]"
                              }`}
                            >
                              {card.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                              {card.visible ? t("customizer.visible") : t("customizer.hidden")}
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-lg bg-[#00F5FF]/10 py-2 text-xs font-bold text-[#00F5FF] transition-colors hover:bg-[#00F5FF]/20"
            >
              {t("customizer.done")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}