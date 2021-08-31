import { CalendarEventAction } from 'angular-calendar';
import { startOfDay, endOfDay } from 'date-fns';

export class CalendarEventModel
{
    id: number;
    start: Date;
    end?: Date;
    title: string;
    color: {
        primary: string;
        secondary: string;
    };
    actions?: CalendarEventAction[];
    allDay?: boolean;
    cssClass?: string;
    resizable?: {
        beforeStart?: boolean;
        afterEnd?: boolean;
    };
    draggable?: boolean;
    meta?: {
        location: string,
        notes: string
    };
    public: boolean;
    _product_menu: {}
    available_date: any;
    product_menu_inventories:any[];

    /**
     * Constructor
     *
     * @param data
     */
    constructor(data?)
    {
        data = data || {};
        console.log(data)

        this.id = data.id && data.id || 0;
        this.start = new Date(data.available_date) || startOfDay(new Date());
        this.end = new Date(data.available_date) || endOfDay(new Date());;
        this.title = data._product_menu.name || '';
        this.color = {
            primary  : data.color && data.color.primary || '#1e90ff',
            secondary: data.color && data.color.secondary || '#D1E8FF'
        };
        this.draggable = data.draggable;
        this.resizable = {
            beforeStart: data.resizable && data.resizable.beforeStart || true,
            afterEnd   : data.resizable && data.resizable.afterEnd || true
        };
        this.actions = data.actions || [];
        this.allDay = data.allDay || false;
        this.cssClass = data.cssClass || '';
        this.meta = {
            location: data.meta && data.meta.location || '',
            notes   : data.meta && data.meta.notes || ''
        };
    
        this.public = data.public && data.public || true;
        this._product_menu = data._product_menu && data._product_menu ||{};
        this.available_date = data.available_date && data.available_date;
        this.product_menu_inventories = data.product_menu_inventories;
    }
    deserialize(data: any) {
        // Assign input to our object BEFORE deserialize our cars to prevent already deserialized cars from being overwritten.
        Object.assign(this, data);

        data = data || {};
        console.log(data)

        this.id = data.id && data.id || 0;
        this.start = new Date(data.available_date) || startOfDay(new Date());
        this.end = new Date(data.available_date) || endOfDay(new Date());;
        this.title = data._product_menu.name || '';
        this.color = {
            primary  : data.color && data.color.primary || '#1e90ff',
            secondary: data.color && data.color.secondary || '#D1E8FF'
        };
        this.draggable = data.draggable;
        this.resizable = {
            beforeStart: data.resizable && data.resizable.beforeStart || true,
            afterEnd   : data.resizable && data.resizable.afterEnd || true
        };
        this.actions = data.actions || [];
        this.allDay = data.allDay || false;
        this.cssClass = data.cssClass || '';
        this.meta = {
            location: data.meta && data.meta.location || '',
            notes   : data.meta && data.meta.notes || ''
        };
    
        this.public = data.public && data.public || true;
        this._product_menu = data._product_menu && data._product_menu ||{};
        this.available_date = data.available_date && data.available_date;
        this.product_menu_inventories = data.product_menu_inventories;

        return this;
    }
   
}
