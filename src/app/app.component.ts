import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'full-calendar';
  showNewEventDiv:boolean = false;
  // Define a FormGroup
  eventForm = new FormGroup({
    title: new FormControl(''),
    date:new FormGroup(''),
    startTime: new FormControl(''),
    endTime: new FormControl('')
  });

  //Calendar Plugins
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin,timeGridPlugin,listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    dateClick: (arg) => this.handleDateClick(arg),
    events: []
  };
  eventsPromise!: Promise<EventInput[]>;
  handleDateClick(arg:any) {
    console.log('date click! ' + arg.dateStr)
  }

  constructor(private changeDetector: ChangeDetectorRef) {
    this.eventsPromise = new Promise((resolve) => {
      const events = JSON.parse(localStorage.getItem('events') || '[]');
      console.log(events);
      this.calendarOptions.events = events;
      resolve(events);
    });
  }

  ngOnInit() {
    // Check events every minute
    setInterval(() => {
      this.checkEvents();
    }, 60000); // 60000 ms = 1 minute
  }

   // Check if any event is happening now
   checkEvents() {
    const currentTime = moment().format('YYYY-MM-DDTHH:mm:00');
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    events.forEach((event: any) => {
      if (moment(currentTime).isSame(event.startTime)) {
        alert(`Event '${event.title}' is happening now!`);
      }
    });
  }

  //Toggle Show Form Div
  toggleDiv(){
    this.showNewEventDiv =!this.showNewEventDiv;
  }

  // Method to handle eventForm submission
  onSubmit() {
    if (this.eventForm.valid) {
      const newEvent: EventInput = {
        title: this.eventForm.value.title || '',
        date: moment(this.eventForm.value.startTime).format('YYYY-MM-DD'),
        startTime: moment(this.eventForm.value.startTime).format('YYYY-MM-DDTHH:mm:ss'),
        endTime: moment(this.eventForm.value.endTime).format('YYYY-MM-DDTHH:mm:ss')
      };
      console.log(newEvent);
      this.calendarOptions.events = [...this.calendarOptions.events as [], newEvent];
      localStorage.setItem('events', JSON.stringify(this.calendarOptions.events));
      this.eventForm.reset();
      this.showNewEventDiv = false;
    } else {
      console.log('Form is invalid!');
    }
  }

  //Delete All Events from LocalStorage
  deleteAllEvents(){
      localStorage.setItem('events', JSON.stringify([]));
      this.calendarOptions.events = [];
  }
}
