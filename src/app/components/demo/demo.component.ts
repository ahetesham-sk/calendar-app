import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid'; // For day grid view
import timeGridPlugin from '@fullcalendar/timegrid'; // For time grid view
import interactionPlugin from '@fullcalendar/interaction'; // For interactivity like clicking


@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})
export class DemoComponent implements OnInit {

  calendarEvents = [
    { id: '1', title: 'Meeting', start: '2024-09-12T10:00:00', end: '2024-09-12T11:00:00' },
    { id: '2', title: 'Lunch Break', start: '2024-09-13T12:00:00', end: '2024-09-13T13:00:00' },
    { id: '3', title: 'Conference', start: '2024-09-14T09:00:00', end: '2024-09-14T10:00:00' }
  ];

  ngOnInit(): void {
    localStorage.setItem('events', JSON.stringify(this.calendarEvents));
  }

  calendarOptions: any = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    events: this.calendarEvents,
    eventClick: this.handleEventClick.bind(this) // Bind the event click handler
  };

  addEvent(){
    const newEvent = { id: '4', title: 'Conference', start: '2024-09-14T09:00:00', end: '2024-09-14T10:00:00' }
    this.calendarEvents.push(newEvent);
    localStorage.setItem('events', JSON.stringify(this.calendarEvents));
  }

  handleEventClick(clickInfo: any) {
    // Confirm deletion
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
      // Remove the event from calendarEvents array
      this.calendarEvents = this.calendarEvents.filter(event => event.id !== clickInfo.event.id);

      // Update the events in the calendar
      clickInfo.event.remove(); // This removes the event from the calendar UI
    }
  }


}
