import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import ColorPicker from './ColorPicker';
import RecurrenceEditor from './RecurrenceEditor';
import SoundPicker from './SoundPicker';
import { Event, CreateEventData } from '../../types/event';
import { useEventsStore } from '../../stores/useEventsStore';
import { RECURRENCE_PRESETS } from '../../lib/recurrence';
import toast from 'react-hot-toast';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event | null;
}

const EventForm = ({ isOpen, onClose, event }: EventFormProps) => {
  const createEvent = useEventsStore((state) => state.createEvent);
  const updateEvent = useEventsStore((state) => state.updateEvent);

  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    color: '#3b82f6',
    recurrenceRule: '',
    startDate: Date.now(),
    soundVolume: 1.0,
    isEnabled: true,
    priority: 0,
    tags: [],
  });

  const [loading, setLoading] = useState(false);

  // Initialize form with event data if editing
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        color: event.color,
        recurrenceRule: event.recurrenceRule,
        startDate: event.startDate,
        soundFile: event.soundFile,
        soundVolume: event.soundVolume,
        isEnabled: event.isEnabled,
        priority: event.priority,
        tags: event.tags,
      });
    } else {
      // Reset for new event
      const startDate = new Date();
      setFormData({
        title: '',
        description: '',
        color: '#3b82f6',
        recurrenceRule: RECURRENCE_PRESETS.daily(startDate),
        startDate: startDate.getTime(),
        soundVolume: 1.0,
        isEnabled: true,
        priority: 0,
        tags: [],
      });
    }
  }, [event, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter an event title');
      return;
    }

    if (!formData.recurrenceRule) {
      toast.error('Please select a recurrence pattern');
      return;
    }

    setLoading(true);

    try {
      if (event) {
        // Update existing event
        await updateEvent(event.id, formData);
        toast.success('Event updated successfully!');
      } else {
        // Create new event
        await createEvent(formData);
        toast.success('Event created successfully!');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save event');
      console.error('Error saving event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? 'Edit Event' : 'Create New Event'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <Input
          label="Event Title"
          placeholder="Enter event name..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        {/* Description */}
        <Textarea
          label="Description (Optional)"
          placeholder="Add event details..."
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />

        {/* Color Picker */}
        <ColorPicker
          label="Event Color"
          value={formData.color}
          onChange={(color) => setFormData({ ...formData, color })}
        />

        {/* Start Date */}
        <Input
          label="Start Date & Time"
          type="datetime-local"
          value={new Date(formData.startDate).toISOString().slice(0, 16)}
          onChange={(e) =>
            setFormData({ ...formData, startDate: new Date(e.target.value).getTime() })
          }
          required
        />

        {/* Recurrence Editor */}
        <RecurrenceEditor
          label="Recurrence Pattern"
          value={formData.recurrenceRule}
          startDate={new Date(formData.startDate)}
          onChange={(rule) => setFormData({ ...formData, recurrenceRule: rule })}
        />

        {/* Sound Picker */}
        <SoundPicker
          label="Notification Sound"
          value={formData.soundFile}
          onChange={(soundFile) => setFormData({ ...formData, soundFile })}
        />

        {/* Sound Volume */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Notification Volume: {Math.round(formData.soundVolume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={formData.soundVolume}
            onChange={(e) => setFormData({ ...formData, soundVolume: parseFloat(e.target.value) })}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
            <Save size={18} />
            <span>{loading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}</span>
          </Button>
          <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
            <X size={18} />
            <span>Cancel</span>
          </Button>
        </div>
      </form>

      {/* Custom slider styles */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
      `}</style>
    </Modal>
  );
};

export default EventForm;
