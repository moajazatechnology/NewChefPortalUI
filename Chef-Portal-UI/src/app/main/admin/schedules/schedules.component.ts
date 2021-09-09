import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay } from 'angular-calendar';
import { Subject } from 'rxjs';
import { startOfDay, isSameDay, isSameMonth} from 'date-fns';
import { FormGroup } from '@angular/forms';
// import { CalendarEventFormDialogComponent } from './event-form/event-form.component';
import { CalendarService } from 'src/app/_services/calender.service';
import { fuseAnimations } from 'src/app/animations';
import { CalendarEventModel } from 'src/app/_models/event.model';
import { DataService } from 'src/app/_services/dataservice';
import { ConfirmDialogComponent } from 'src/app/main/shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { CalendarEventFormDialogComponent } from '../../chefs/schedules/event-form/event-form.component';
import { ActivatedRoute } from '@angular/router';
import { id } from 'date-fns/locale';
import { CalendarEventFormDialogComponent } from './event-form/event-form.component';


@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations,
  styleUrls: ['./schedules.component.scss']
})
export class SchedulesComponent implements OnInit {

  actions: CalendarEventAction[];
  activeDayIsOpen: boolean;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  dialogRef: any;
  events: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();
  selectedDay: any;
  view: string;
  viewDate: Date;
  id:any;
  public showLoader: boolean = true;
  userInfo :any = {};


  constructor(
      private _matDialog: MatDialog,
      private _calendarService: CalendarService,
      private _dataService: DataService,
      private _matSnackBar: MatSnackBar,
      private route:ActivatedRoute
  )
  {
      // Set the defaults
      this.view = 'month';
      this.viewDate = new Date();
      this.activeDayIsOpen = true;
      this.selectedDay = {date: startOfDay(new Date())};

    //   this.actions = [
    //       {
    //           label  : '<i class="material-icons s-16">edit</i>',
    //           onClick: ({event}: { event: CalendarEvent }): void => {
    //               this.editEvent('edit', event);
    //           }
    //       },
    //       {
    //           label  : '<i class="material-icons s-16">delete</i>',
    //           onClick: ({event}: { event: CalendarEvent }): void => {
    //               this.deleteEvent(event);
    //           }
    //       }
    //   ];

      /**
       * Get events from service/server
       */
      // this.setEvents();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
      /**
       * Watch re-render-refresh for updating db
       */
      this.id = this.route.snapshot.params.id;
    //   sessionStorage.removeItem("chef_Id");
      sessionStorage.setItem("chef_Id",this.id);
      this.refresh.subscribe(updateDB => {
          if ( updateDB )
          {
              this._calendarService.getEvents();
          }
      });

      this._calendarService.onEventsUpdated.subscribe(events => {
          this.setEvents();
          this.refresh.next();
      });
      this.setEvents();
      

    //   Schedule Delete
      this.actions = [
        {
            label  : '<i class="material-icons s-16">edit</i>',
            onClick: ({event}: { event: CalendarEvent }): void => {
                this.editEvent('edit', event);
            }
        },
        {
            label  : '<i class="material-icons s-16">delete</i>',
            onClick: ({event}: { event: CalendarEvent }): void => {
                this.deleteEvent(event);
            }
        }
    ];


    this.getCurrentChefInfo();


  }
  getCurrentChefInfo() {

    this._dataService.getChefInfo({url:'chef?chef_id=' + this.id , isLoader:true})
    .subscribe(response => {
      this.userInfo = response;
      this.showLoader = false;
    });
  }


  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Set events
   */
  setEvents(): void
  {
      this.events = this._calendarService.events.map(item => {
          item.actions = this.actions;
          return new CalendarEventModel(item);
      });
      this.showLoader = false;
      console.log(this.events);
  }

  /**
   * Before View Renderer
   *
   * @param {any} header
   * @param {any} body
   */
  beforeMonthViewRender({header, body}): void
  {
      /**
       * Get the selected day
       */
      const _selectedDay = body.find((_day) => {
          return _day.date.getTime() === this.selectedDay.date.getTime();
      });

      if ( _selectedDay )
      {
          /**
           * Set selected day style
           * @type {string}
           */
          _selectedDay.cssClass = 'cal-selected';
      }

  }

  /**
   * Day clicked
   *
   * @param {MonthViewDay} day
   */
  dayClicked(day: CalendarMonthViewDay): void
  {
      const date: Date = day.date;
      const events: CalendarEvent[] = day.events;

      if ( isSameMonth(date, this.viewDate) )
      {
          if ( (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0 )
          {
              this.activeDayIsOpen = false;
          }
          else
          {
              this.activeDayIsOpen = true;
              this.viewDate = date;
          }
      }
      this.selectedDay = day;
      this.refresh.next();
  }

  /**
   * Event times changed
   * Event dropped or resized
   *
   * @param {CalendarEvent} event
   * @param {Date} newStart
   * @param {Date} newEnd
   */
  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void
  {
      event.start = newStart;
      event.end = newEnd;
      // console.warn('Dropped or resized', event);
      this.refresh.next(true);
  }

  /**
   * Delete Event
   *
   * @param event
   */
  deleteEvent(event): void
  {
      let confirmMessage = 'Are you sure you want to delete?';
      this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, { width: '400px', data: confirmMessage,
          disableClose: false
      });

      console.log(event);

      this.confirmDialogRef.afterClosed().subscribe(result => {
        console.log(result);
          if ( result !== 'N')
          {
              this.showLoader = true;
              this.deleteData(event);
          }
          this.confirmDialogRef = null;
      });

  }

  deleteData(id) {

    console.log(id.id);
    
    this._dataService.delete({ url: 'schedule/delete/' + id.id+'?chef_id='+this.id, isLoader: true })
    .subscribe((response: any) => {
     
         this.showLoader = false;
         this._matSnackBar.open('Schedule deleted successfully', 'CLOSE', {
           verticalPosition: 'bottom',
           horizontalPosition:'center',
           duration        : 2000
         });
        //  this.refresh.next(true);
        this.setEvents();
     
   });

    // this._dataService.delete({ url: 'schedule/delete/' + id, isLoader: true })
    //   .subscribe((response: any) => {
    //    //  if(response === {}){
    //        // Show the success message
    //        this.showLoader = false;
    //        this._matSnackBar.open('Schedule deleted successfully', 'CLOSE', {
    //          verticalPosition: 'bottom',
    //          horizontalPosition:'center',
    //          duration        : 2000
    //        });
    //        this.refresh.next(true);
    //    //  }
    //  });
  }

  /**
   * Edit Event
   *
   * @param {string} action
   * @param {CalendarEvent} event
   */
  editEvent(action: string, event: CalendarEvent): void
  {
      const eventIndex = this.events.indexOf(event);
      console.log(this.events);
      console.log(event);

      this.dialogRef = this._matDialog.open(CalendarEventFormDialogComponent, {
          panelClass: 'event-form-dialog',
          data      : event,
          width:'500px',
          disableClose: true
      });

      this.dialogRef.afterClosed()
          .subscribe(response => {
            
              if ( response !=='N')
              {
                // this.refresh.next(true);
                this.setEvents();
              }
          });
  }

  /**
   * Add Event
   */
  addEvent(): void
  {
      this.dialogRef = this._matDialog.open(CalendarEventFormDialogComponent, {
          panelClass: 'event-form-dialog',
          data      :   null,
          disableClose: true,
          width:'500px'
      });
      this.dialogRef.afterClosed()
          .subscribe((response: FormGroup) => {
            //   this.refresh.next(true);
            this.setEvents();
          });
  }


}
