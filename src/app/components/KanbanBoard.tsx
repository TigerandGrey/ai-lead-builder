"use client";

import { FC, useEffect, useState } from "react";
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragOverEvent, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ColumnProps, ColumnType, KanbanProps, statusType, SupabaseLeadProps, SupabaseLeadType } from "@/lib/types";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const Column: FC<ColumnProps> = ({ id, title, supabaseLeads }) => {
  const { setNodeRef, transform, transition } = useSortable({
    id: id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg flex flex-col min-w-[300px]">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <span className="bg-indigo-100 text-indigo-800 text-sm font-semibold px-2.5 py-0.5 rounded-full">{supabaseLeads.length}</span>
      </div>

      <div className="flex-1 min-h-[300px] space-y-4">
        <SortableContext items={supabaseLeads.map((supabaseLead) => supabaseLead.id)} strategy={verticalListSortingStrategy}>
          {supabaseLeads.map((supabaseLead) => (
            <SupabaseLead key={supabaseLead.id} supabaseLead={supabaseLead} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

// supabaseLead component
const SupabaseLead: FC<SupabaseLeadProps> = ({ supabaseLead }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: supabaseLead.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`bg-white p-4 rounded-lg shadow transition-shadow hover:shadow-md cursor-grab ${isDragging ? "ring-2 ring-indigo-500" : ""}`} {...attributes} {...listeners}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xs font-semibold px-2 py-1 rounded-full bg-pink-100 text-pink-800">{supabaseLead.name}</h3>
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800">{supabaseLead.role}</span>
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-800">{supabaseLead.company}</span>
      </div>
      <p className="text-sm text-gray-600 mb-3">{supabaseLead.linkedin_url}</p>
      <p className="text-sm text-gray-600 mb-3">{supabaseLead.generated_message}</p>
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-500">{supabaseLead.updated_at?.split("T")[0]}</span>
        <div className="flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-800 w-6 h-6 rounded-full flex items-center justify-center font-medium">{supabaseLead.updated_id?.slice(0, 2)}</span>
        </div>
      </div>
    </div>
  );
};

// Main Kanban Board Component
const KanbanBoard: FC<KanbanProps> = ({ supabaseLeads, setSupabaseLeads, refreshKey }) => {
  const [columns, setColumns] = useState<ColumnType[]>([
    { id: "Draft", title: "Draft" },
    { id: "Sent", title: "Sent" },
    { id: "Approved", title: "Approved" },
  ]);

  useEffect(() => {
    setSupabaseLeads(supabaseLeads);
  }, [refreshKey]);

  const [activeSupabaseLead, setActiveSupabaseLead] = useState<SupabaseLeadType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getSupabaseLeadsByStatus = (status: statusType) => {
    return supabaseLeads.filter((supabaseLead) => supabaseLead.status === status);
  };

  const handleSave = async (activeLead: SupabaseLeadType) => {
    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const updatedLead = {
        ...activeLead,
        updated_id: user!.id,
        updated_at: new Date().toISOString(),
      };

      // Update to DB
      const response = await fetch(`/api/leads/${activeLead.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedLead),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save lead");
      }

      toast.success("Lead updated successfully!");
    } catch (error) {
      toast.error("Failed to update lead");
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const supabaseLead = supabaseLeads.find((t) => t.id === active.id);
    if (supabaseLead) {
      setActiveSupabaseLead(supabaseLead);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveASupabaseLead = supabaseLeads.some((supabaseLead) => supabaseLead.id === activeId);
    const isOverASupabaseLead = supabaseLeads.some((supabaseLead) => supabaseLead.id === overId);
    const isOverAColumn = columns.some((column) => column.id === overId);

    if (!isActiveASupabaseLead) return;

    // If dragging over a supabaseLead
    if (isOverASupabaseLead) {
      const overSupabaseLead = supabaseLeads.find((supabaseLead) => supabaseLead.id === overId);
      const activeSupabaseLead = supabaseLeads.find((supabaseLead) => supabaseLead.id === activeId);

      if (overSupabaseLead && activeSupabaseLead && activeSupabaseLead.status !== overSupabaseLead.status) {
        setSupabaseLeads((supabaseLeads) => supabaseLeads.map((supabaseLead) => (supabaseLead.id === activeId ? { ...supabaseLead, status: overSupabaseLead.status } : supabaseLead)));
      }
    }

    // If dragging over a column
    if (isOverAColumn) {
      setSupabaseLeads((supabaseLeads) => supabaseLeads.map((supabaseLead) => (supabaseLead.id === activeId ? { ...supabaseLead, status: overId as statusType } : supabaseLead)));
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveSupabaseLead(null);
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    // Find the updated lead after drag operation
    const activeLead = supabaseLeads.find((lead) => lead.id === activeId);

    if (activeId !== overId) {
      setSupabaseLeads((items) => {
        const oldIndex = items.findIndex((item) => item.id === activeId);
        const newIndex = items.findIndex((item) => item.id === overId);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    // Save the updated lead to database if it exists
    if (activeLead) {
      await handleSave(activeLead);
    }

    setActiveSupabaseLead(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="text-center py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">LinkedIn DMs Kanban</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Drag and drop status between columns</p>
      </header>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <Column key={column.id} id={column.id} title={column.title} supabaseLeads={getSupabaseLeadsByStatus(column.title)} />
          ))}
        </div>

        <DragOverlay>
          {activeSupabaseLead ? (
            <div className="bg-white p-4 rounded-lg shadow-lg w-64 cursor-grabbing">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">{activeSupabaseLead.name}</h3>
                <div className="font-semibold text-gray-800">{activeSupabaseLead.role}</div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full`}>{activeSupabaseLead.company}</span>
              </div>
              <p className="text-sm text-gray-600">{activeSupabaseLead.linkedin_url}</p>
              <p className="text-sm text-gray-600">{activeSupabaseLead.generated_message}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="mt-12 bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">How to Use This Kanban Board</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <li className="flex items-start gap-2">
            <span className="bg-indigo-100 text-indigo-800 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </span>
            <div>
              <h3 className="font-medium text-gray-800">Drag & Drop</h3>
              <p className="text-gray-600 text-sm">Move SupabaseLeads between columns or reorder them within a column</p>
            </div>
          </li>
          {/* <li className="flex items-start gap-2">
            <span className="bg-indigo-100 text-indigo-800 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </span>
            <div>
              <h3 className="font-medium text-gray-800">Add GeneratedLeads</h3>
              <p className="text-gray-600 text-sm">Click [Add GeneratedLead] at the bottom of any column to create a new generatedLead</p>
            </div>
          </li> */}
          <li className="flex items-start gap-2">
            <span className="bg-indigo-100 text-indigo-800 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </span>
            <div>
              <h3 className="font-medium text-gray-800">Organize</h3>
              <p className="text-gray-600 text-sm">Use the three columns to track your workflow: Draft, Sent, Approved</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-indigo-100 text-indigo-800 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </span>
            <div>
              <h3 className="font-medium text-gray-800">Updated By</h3>
              <p className="text-gray-600 text-sm">See who is responsible for each generatedLead at a glance</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default KanbanBoard;
