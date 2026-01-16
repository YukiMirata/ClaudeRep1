import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Calendar, Filter } from 'lucide-react';
import { useEventsStore } from '../stores/useEventsStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import EventCard from '../components/events/EventCard';
import EventForm from '../components/events/EventForm';
import { Event } from '../types/event';
import toast from 'react-hot-toast';

const pageVariants = {
  initial: { opacity: 0, x: -20, filter: 'blur(10px)' },
  animate: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  },
  exit: {
    opacity: 0,
    x: 20,
    filter: 'blur(10px)',
    transition: { duration: 0.3 }
  },
};

const EventManagement = () => {
  const events = useEventsStore((state) => state.events);
  const fetchEvents = useEventsStore((state) => state.fetchEvents);
  const deleteEvent = useEventsStore((state) => state.deleteEvent);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEnabled, setFilterEnabled] = useState<'all' | 'enabled' | 'disabled'>('all');

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Filter events based on search and status
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterEnabled === 'all' ||
      (filterEnabled === 'enabled' && event.isEnabled) ||
      (filterEnabled === 'disabled' && !event.isEnabled);

    return matchesSearch && matchesFilter;
  });

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleDeleteEvent = async (event: Event) => {
    if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
      try {
        await deleteEvent(event.id);
        toast.success('Event deleted successfully');
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEvent(null);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-full p-8 overflow-auto"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Manage Events</h2>
            <p className="text-slate-400">
              Create and organize your events • {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
            </p>
          </div>
          <Button onClick={handleCreateEvent} size="md">
            <Plus size={20} />
            <span>New Event</span>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11"
            />
          </div>

          {/* Filter buttons */}
          <div className="flex gap-2">
            <Button
              variant={filterEnabled === 'all' ? 'primary' : 'ghost'}
              size="md"
              onClick={() => setFilterEnabled('all')}
            >
              All
            </Button>
            <Button
              variant={filterEnabled === 'enabled' ? 'primary' : 'ghost'}
              size="md"
              onClick={() => setFilterEnabled('enabled')}
            >
              Active
            </Button>
            <Button
              variant={filterEnabled === 'disabled' ? 'primary' : 'ghost'}
              size="md"
              onClick={() => setFilterEnabled('disabled')}
            >
              Disabled
            </Button>
          </div>
        </div>

        {/* Event Grid */}
        {filteredEvents.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="p-6 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 mb-4">
              <Calendar className="text-blue-400" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchQuery || filterEnabled !== 'all' ? 'No events found' : 'No events yet'}
            </h3>
            <p className="text-slate-400 text-center max-w-md mb-6">
              {searchQuery || filterEnabled !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first event'}
            </p>
            {!searchQuery && filterEnabled === 'all' && (
              <Button onClick={handleCreateEvent} size="lg">
                <Plus size={20} />
                <span>Create Your First Event</span>
              </Button>
            )}
          </motion.div>
        )}
      </div>

      {/* Event Form Modal */}
      <EventForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        event={editingEvent}
      />
    </motion.div>
  );
};

export default EventManagement;
