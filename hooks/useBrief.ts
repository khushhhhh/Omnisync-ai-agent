import { useState } from "react";

export interface ActionTask {
  id: string;
  task: string;
  source: "github" | "whatsapp" | "gmail" | "outlook" | "telegram";
  done: boolean;
  priority: "High" | "Medium" | "Low";
  details: string;
  importance: "Priority" | "Important" | "Normal";
  suggestedDraft?: string;
  extractedEmail?: string;
  subject?: string;
}

export interface DailyInsight {
  id: string;
  text: string;
  type: "success" | "warning" | "info";
}

export function useBrief() {
  const [tasks, setTasks] = useState<ActionTask[]>([
    {
      id: "task-1",
      task: "Review backend PR #42 (API Gateway Migration)",
      source: "github",
      done: false,
      priority: "High",
      importance: "Priority",
      details: "PR #42 implements the Sent.dm REST WhatsApp gateway. Check if process.env validation and error handling blocks comply with standard security requirements.",
    },
    {
      id: "task-2",
      task: "Reply to project lead regarding WhatsApp API block",
      source: "whatsapp",
      done: false,
      priority: "High",
      importance: "Priority",
      details: "Raghav requested a status update on why the Baileys pairing code flow threw a 428 Precondition Required. Confirm transition to Sent.dm REST APIs is complete.",
    },
    {
      id: "task-3",
      task: "Audit Outlook calendar scheduling collision for tomorrow",
      source: "outlook",
      done: false,
      priority: "Medium",
      importance: "Important",
      details: "Outlook Sync auto-rescheduled double bookings for tomorrow at 3:30 PM. Verify that meeting rooms and Zoom links were updated properly.",
    },
    {
      id: "task-4",
      task: "Draft Q3 launch brief email for stakeholder review",
      source: "gmail",
      done: false,
      priority: "Low",
      importance: "Normal",
      details: "Compose a summary of active integrations, current webhook listener status, and webhook API response times for the leadership deck.",
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, done: !task.done } : task))
    );
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return {
    tasks,
    toggleTask,
    removeTask,
    setTasks,
  };
}

export function generateDailyInsights(tasks: ActionTask[]): DailyInsight[] {
  const insights: DailyInsight[] = [];
  const incompleteTasks = tasks.filter(t => !t.done);
  
  if (incompleteTasks.some(t => t.id === "task-1")) {
    insights.push({
      id: "insight-1",
      text: "Merging backend PR #42 will save 2 hours of deployment time and resolve staging webhook discrepancies.",
      type: "success",
    });
  }
  
  if (incompleteTasks.some(t => t.id === "task-2")) {
    insights.push({
      id: "insight-2",
      text: "Unblocking Raghav on the WhatsApp REST migration prevents downstream blocker delays for the CRM webhook sprint.",
      type: "warning",
    });
  }

  if (incompleteTasks.some(t => t.id === "task-3")) {
    insights.push({
      id: "insight-3",
      text: "Rescheduling tomorrow's collision now prevents double-bookings on shared executive Zoom channels.",
      type: "info",
    });
  }

  // Fallback insights if all are done
  if (insights.length === 0) {
    insights.push({
      id: "insight-complete",
      text: "All critical daily actions completed. Neural command pathways are running at peak efficiency.",
      type: "success",
    });
  }

  return insights.slice(0, 3);
}
