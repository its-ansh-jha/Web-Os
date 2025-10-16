import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCalendarEvents, useCreateCalendarEvent, useDeleteCalendarEvent } from '@/hooks/useData';
import * as Icons from 'lucide-react';
import { format } from 'date-fns';

export function CalendarApp() {
  const { data: calendarEvents = [], isLoading } = useCalendarEvents();
  const createEvent = useCreateCalendarEvent();
  const deleteEvent = useDeleteCalendarEvent();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', time: '12:00' });

  const eventsOnDate = calendarEvents.filter(
    (e) => format(new Date(e.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const handleAddEvent = () => {
    if (!newEvent.title) return;
    
    createEvent.mutate({
      title: newEvent.title,
      description: newEvent.description,
      date: selectedDate.toISOString(),
      time: newEvent.time,
      category: 'general',
      color: '#3b82f6',
    });

    setNewEvent({ title: '', description: '', time: '12:00' });
    setShowEventDialog(false);
  };

  return (
    <div className="flex h-full">
      {/* Calendar */}
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        <Calendar
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate}
          className="border-0 bg-transparent"
        />
        <Button
          className="mt-4"
          onClick={() => setShowEventDialog(true)}
          data-testid="button-add-event"
        >
          <Icons.Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Events Panel */}
      <div className="w-80 border-l border-border/50 p-4 flex flex-col">
        <h3 className="text-lg font-semibold mb-4">
          {format(selectedDate, 'MMMM d, yyyy')}
        </h3>

        <div className="flex-1 overflow-auto space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Icons.Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : eventsOnDate.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Icons.Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No events</p>
            </div>
          ) : (
            eventsOnDate.map((event) => (
              <div
                key={event.id}
                className="p-3 rounded-lg bg-card border border-card-border"
                data-testid={`event-${event.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground">{event.time}</div>
                    {event.description && (
                      <div className="text-sm mt-1">{event.description}</div>
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => deleteEvent.mutate(event.id)}
                    data-testid={`button-delete-${event.id}`}
                  >
                    <Icons.X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Event Dialog */}
      {showEventDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="bg-card border border-card-border rounded-lg p-6 w-96 space-y-4">
            <h3 className="text-lg font-semibold">New Event</h3>
            <Input
              placeholder="Event title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              data-testid="input-event-title"
            />
            <Input
              type="time"
              value={newEvent.time}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              data-testid="input-event-time"
            />
            <Textarea
              placeholder="Description (optional)"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              data-testid="textarea-event-description"
            />
            <div className="flex gap-2">
              <Button onClick={handleAddEvent} className="flex-1" data-testid="button-save-event">
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowEventDialog(false);
                  setNewEvent({ title: '', description: '', time: '12:00' });
                }}
                data-testid="button-cancel-event"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
