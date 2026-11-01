'use client';

import React, { useState, useMemo, memo } from 'react';
import { CheckCircle2, Clock, Plus, Trash2 } from 'lucide-react';
import { TimelineMilestone, TimelinePhase } from '@/types/event';
import { calculateTimelineProgress } from '@/lib/planUtils';

interface TimelineManagerProps {
  timeline: TimelineMilestone[];
  onUpdateTimeline: (newTimeline: TimelineMilestone[]) => void;
}

const PHASES: readonly TimelinePhase[] = [
  'Planning Phase (Months Before)',
  'Vendor Locking (Weeks Before)',
  'Final Preparations (Week Of)',
  'Day-of Event (Run of Show)',
] as const;

/**
 * Dynamic Timeline & Day-of Run of Show manager providing dual planning modes
 * for long-range milestones and minute-by-minute day-of execution.
 */
export const TimelineManager: React.FC<TimelineManagerProps> = memo(function TimelineManager({
  timeline,
  onUpdateTimeline,
}): React.ReactElement {
  const [activeTab, setActiveTab] = useState<'all' | 'phases' | 'day_of'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New milestone state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPhase, setNewPhase] = useState<TimelinePhase>('Planning Phase (Months Before)');
  const [newTimeframe, setNewTimeframe] = useState('');
  const [newPriority, setNewPriority] = useState<TimelineMilestone['priority']>('medium');
  const [newTimeSlot, setNewTimeSlot] = useState('');

  const progress = useMemo(() => calculateTimelineProgress(timeline), [timeline]);

  const filteredTimeline = useMemo(() => {
    if (activeTab === 'day_of') {
      return timeline.filter((m) => m.phase === 'Day-of Event (Run of Show)');
    }
    if (activeTab === 'phases') {
      return timeline.filter((m) => m.phase !== 'Day-of Event (Run of Show)');
    }
    return timeline;
  }, [timeline, activeTab]);

  const handleToggleComplete = (id: string): void => {
    onUpdateTimeline(
      timeline.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  const handleDeleteMilestone = (id: string): void => {
    onUpdateTimeline(timeline.filter((m) => m.id !== id));
  };

  const handleAddMilestone = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newMilestone: TimelineMilestone = {
      id: `milestone-${Date.now()}`,
      phase: newPhase,
      title: newTitle.trim(),
      description: newDescription.trim(),
      targetTimeframe: newTimeframe.trim() || (newPhase === 'Day-of Event (Run of Show)' ? newTimeSlot : 'TBD'),
      completed: false,
      priority: newPriority,
      timeSlot: newPhase === 'Day-of Event (Run of Show)' ? newTimeSlot : undefined,
    };

    onUpdateTimeline([...timeline, newMilestone]);
    setNewTitle('');
    setNewDescription('');
    setNewTimeframe('');
    setNewTimeSlot('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-600" aria-hidden="true" />
            <h2 className="text-xl font-extrabold text-slate-900">
              Interactive Timeline & Run of Show
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Seamlessly toggle between long-range milestone countdowns and day-of execution agendas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          aria-haspopup="dialog"
          aria-expanded={showAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-xs self-start sm:self-auto focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Progress Metric Bar */}
      <div>
        <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-2">
          <span>Overall Schedule Completion</span>
          <span className="font-bold text-slate-900">
            {progress.completedMilestones} of {progress.totalMilestones} Completed ({progress.percentComplete}%)
          </span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress.percentComplete} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="h-full bg-rose-600 transition-all duration-300"
            style={{ width: `${progress.percentComplete}%` }}
          />
        </div>
      </div>

      {/* Timeline Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600" role="group" aria-label="Timeline view mode">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-1.5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-rose-500 ${
            activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          All Milestones ({timeline.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('phases')}
          className={`flex-1 py-1.5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-rose-500 ${
            activeTab === 'phases' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          Planning Phases
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('day_of')}
          className={`flex-1 py-1.5 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-rose-500 ${
            activeTab === 'day_of' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          ⚡ Day-of Run of Show
        </button>
      </div>

      {/* Timeline Milestone List */}
      <div className="space-y-3">
        {filteredTimeline.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center italic">
            No milestones found for this filter view.
          </p>
        ) : (
          filteredTimeline.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 sm:p-4 rounded-2xl border transition flex items-start gap-3.5 ${
                item.completed
                  ? 'bg-slate-50/60 border-slate-200/60 opacity-75'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <button
                type="button"
                onClick={() => handleToggleComplete(item.id)}
                aria-label={`Mark milestone "${item.title}" as ${item.completed ? 'incomplete' : 'completed'}`}
                className="mt-0.5 text-slate-300 hover:text-emerald-600 transition shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-full"
              >
                <CheckCircle2
                  className={`w-5 h-5 ${
                    item.completed ? 'text-emerald-600 fill-emerald-50' : 'text-slate-300'
                  }`}
                  aria-hidden="true"
                />
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span
                    className={`text-xs sm:text-sm font-bold ${
                      item.completed ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </span>

                  {item.timeSlot && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      {item.timeSlot}
                    </span>
                  )}

                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.priority === 'high'
                        ? 'bg-rose-50 text-rose-700'
                        : item.priority === 'medium'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.priority}
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-2">
                  {item.description}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium">
                  <span>📅 {item.targetTimeframe}</span>
                  <span>•</span>
                  <span>{item.phase}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteMilestone(item.id)}
                aria-label={`Delete milestone ${item.title}`}
                className="text-slate-300 hover:text-rose-600 transition p-1 focus:outline-none focus:ring-2 focus:ring-rose-400 rounded"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Milestone Modal */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-milestone-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
        >
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-xl space-y-4">
            <h3 id="add-milestone-title" className="text-base font-extrabold text-slate-900">
              Add Timeline Milestone
            </h3>

            <form onSubmit={handleAddMilestone} className="space-y-3 text-xs">
              <div>
                <label htmlFor="milestone-title" className="font-semibold text-slate-700 block mb-1">
                  Title *
                </label>
                <input
                  id="milestone-title"
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Rehearsal Dinner & Speeches"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label htmlFor="milestone-phase" className="font-semibold text-slate-700 block mb-1">
                  Phase *
                </label>
                <select
                  id="milestone-phase"
                  value={newPhase}
                  onChange={(e) => setNewPhase(e.target.value as TimelinePhase)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {PHASES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {newPhase === 'Day-of Event (Run of Show)' ? (
                <div>
                  <label htmlFor="milestone-timeslot" className="font-semibold text-slate-700 block mb-1">
                    Time Slot (e.g. 04:30 PM) *
                  </label>
                  <input
                    id="milestone-timeslot"
                    type="text"
                    required
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    placeholder="04:30 PM"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="milestone-timeframe" className="font-semibold text-slate-700 block mb-1">
                    Target Timeframe (e.g. 2 months out)
                  </label>
                  <input
                    id="milestone-timeframe"
                    type="text"
                    value={newTimeframe}
                    onChange={(e) => setNewTimeframe(e.target.value)}
                    placeholder="e.g. 3 weeks before"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              )}

              <div>
                <label htmlFor="milestone-priority" className="font-semibold text-slate-700 block mb-1">
                  Priority
                </label>
                <select
                  id="milestone-priority"
                  value={newPriority}
                  onChange={(e) =>
                    setNewPriority(e.target.value as TimelineMilestone['priority'])
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div>
                <label htmlFor="milestone-desc" className="font-semibold text-slate-700 block mb-1">
                  Description / Action Items
                </label>
                <textarea
                  id="milestone-desc"
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Key deliverables and coordination notes..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-xs"
                >
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
});
