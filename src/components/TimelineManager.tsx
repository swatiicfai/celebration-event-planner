'use client';

import React, { useState } from 'react';
import { CheckCircle2, Clock, Plus, Trash2 } from 'lucide-react';
import { TimelineMilestone, TimelinePhase } from '@/types/event';
import { calculateTimelineProgress } from '@/lib/planUtils';

interface TimelineManagerProps {
  timeline: TimelineMilestone[];
  onUpdateTimeline: (newTimeline: TimelineMilestone[]) => void;
}

const PHASES: TimelinePhase[] = [
  'Planning Phase (Months Before)',
  'Vendor Locking (Weeks Before)',
  'Final Preparations (Week Of)',
  'Day-of Event (Run of Show)',
];

export const TimelineManager: React.FC<TimelineManagerProps> = ({ timeline, onUpdateTimeline }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'phases' | 'day_of'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New milestone state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPhase, setNewPhase] = useState<TimelinePhase>('Planning Phase (Months Before)');
  const [newTimeframe, setNewTimeframe] = useState('');
  const [newPriority, setNewPriority] = useState<TimelineMilestone['priority']>('medium');
  const [newTimeSlot, setNewTimeSlot] = useState('');

  const progress = calculateTimelineProgress(timeline);

  const handleToggleComplete = (id: string) => {
    onUpdateTimeline(
      timeline.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  const handleDeleteMilestone = (id: string) => {
    onUpdateTimeline(timeline.filter((m) => m.id !== id));
  };

  const handleAddMilestone = (e: React.FormEvent) => {
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

  const displayedMilestones = timeline.filter((m) => {
    if (activeTab === 'day_of') return m.phase === 'Day-of Event (Run of Show)';
    if (activeTab === 'phases') return m.phase !== 'Day-of Event (Run of Show)';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-rose-600" />
              <h3 className="text-xl font-bold text-slate-900">Interactive Timeline & Run of Show</h3>
              <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                {progress.percentComplete}% Done ({progress.completedMilestones}/{progress.totalMilestones})
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              From long-range preparation milestones down to minute-by-minute day-of execution.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Milestone / Run-of-Show</span>
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 pt-4">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'all'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Milestones ({timeline.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('phases')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'phases'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Countdown Phases ({timeline.filter((m) => m.phase !== 'Day-of Event (Run of Show)').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('day_of')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'day_of'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ⚡ Day-of Run-of-Show ({timeline.filter((m) => m.phase === 'Day-of Event (Run of Show)').length})
          </button>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <form onSubmit={handleAddMilestone} className="bg-white rounded-3xl p-6 border-2 border-rose-300 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-900">Add Timeline Milestone or Event Schedule</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Milestone Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. First Dance & Cake Cutting"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phase</label>
              <select
                value={newPhase}
                onChange={(e) => setNewPhase(e.target.value as TimelinePhase)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
              >
                {PHASES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as TimelineMilestone['priority'])}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            {newPhase === 'Day-of Event (Run of Show)' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Time Slot (e.g. 07:00 PM)</label>
                <input
                  type="text"
                  placeholder="e.g. 07:00 PM"
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Target Timeframe</label>
                <input
                  type="text"
                  placeholder="e.g. 2 months out"
                  value={newTimeframe}
                  onChange={(e) => setNewTimeframe(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                />
              </div>
            )}
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
              <input
                type="text"
                placeholder="Brief details"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm"
            >
              Save Milestone
            </button>
          </div>
        </form>
      )}

      {/* Timeline List / Phase Groupings */}
      <div className="space-y-6">
        {PHASES.map((phase) => {
          const itemsInPhase = displayedMilestones.filter((m) => m.phase === phase);
          if (itemsInPhase.length === 0) return null;

          const isDayOf = phase === 'Day-of Event (Run of Show)';

          return (
            <div key={phase} className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${isDayOf ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'}`} />
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    {phase}
                  </h4>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {itemsInPhase.filter((i) => i.completed).length}/{itemsInPhase.length} Done
                </span>
              </div>

              <div className="space-y-3">
                {itemsInPhase.map((milestone) => (
                  <div
                    key={milestone.id}
                    className={`flex items-start justify-between gap-3 p-3.5 rounded-2xl border transition ${
                      milestone.completed
                        ? 'bg-slate-50/70 border-slate-200 text-slate-400'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <button
                        type="button"
                        onClick={() => handleToggleComplete(milestone.id)}
                        className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition ${
                          milestone.completed
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 hover:border-rose-500 text-transparent'
                        }`}
                        aria-label={`Mark "${milestone.title}" as ${milestone.completed ? 'incomplete' : 'complete'}`}
                      >
                        <CheckCircle2 className="w-4 h-4 fill-current" />
                      </button>

                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          {isDayOf && milestone.timeSlot && (
                            <span className="px-2 py-0.5 text-2xs font-mono font-bold rounded-md bg-amber-100 text-amber-900">
                              {milestone.timeSlot}
                            </span>
                          )}
                          <span
                            className={`text-sm font-semibold ${
                              milestone.completed ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}
                          >
                            {milestone.title}
                          </span>
                          {!isDayOf && (
                            <span className="text-2xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              {milestone.targetTimeframe}
                            </span>
                          )}
                          <span
                            className={`text-2xs font-bold px-1.5 py-0.5 rounded ${
                              milestone.priority === 'high'
                                ? 'bg-rose-100 text-rose-700'
                                : milestone.priority === 'medium'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {milestone.priority}
                          </span>
                        </div>
                        {milestone.description && (
                          <p className={`text-xs ${milestone.completed ? 'text-slate-400' : 'text-slate-600'}`}>
                            {milestone.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteMilestone(milestone.id)}
                      className="text-slate-300 hover:text-rose-500 p-1 rounded-md transition no-print"
                      title="Delete milestone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

