import {Component, OnInit, ViewChild} from '@angular/core';
import {RoomModel} from '../models/RoomModel';
import {FloorModel} from '../models/FloorModel';
import {BookingService} from '../services/booking.service';
import notify from 'devextreme/ui/notify';
import {RoomService} from '../services/room.service';
import {CheckInComponent} from '../check-in/check-in.component';
import {BookingComponent} from '../booking/booking.component';
import {RoomInfoComponent} from '../room-info/room-info.component';
import {ClientService} from '../services/client.service';
import {UpdateServiceComponent} from '../update-service/update-service.component';
import {InvoiceService} from '../services/invoice.service';
import {InvoiceModel} from '../models/InvoiceModel';

@Component({
    selector: 'app-room-list',
    templateUrl: './room-list.component.html',
    styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {
    @ViewChild(CheckInComponent, {static: false}) checkinComponent;
    @ViewChild(BookingComponent, {static: false}) bookingComponent;
    @ViewChild(RoomInfoComponent, {static: false}) roomInfoComponent;
    @ViewChild(UpdateServiceComponent, {static: false}) updateServiceComponent;
    floors: FloorModel[] = [];
    rooms: RoomModel[] = [];
    rightClickText = [];
    availableAndCheckedinRoomsName: string[] = [];
    bookedRoomsName: string[] = [];
    updateBookingText = [];
    searchKey = '';
    isVisibleSearchPopover = false;
    roomsResult: RoomModel[] = [];
    popoverTitle = '';

    constructor(
        private bookingService: BookingService,
        private roomService: RoomService,
        private clientService: ClientService,
        private invoiceService: InvoiceService,
    ) {}

    async ngOnInit() {
        this.rooms = [];
        this.floors = [];
        await this.roomService.getRooms().toPromise().then(data => {
            this.rooms = data;
            this.floors = this.getFloors();
            this.getRoomsName();
            for (const room of this.rooms) {
                if (room.status === 'Checked in') {
                    this.invoiceService.getInvoiceByRoomName(room.name).toPromise().then(data => {
                        room.clients[0].invoice = data;
                    });
                }
            }
        });

        this.rightClickText = [
            {text: 'Checkin'},
            {text: 'Update Service'},
            {text: 'Checkout'},
        ];
        this.updateBookingText = [
            {text: 'Update booking'},
        ];
    }

    getFloors() {
        const floors: FloorModel[] = [];
        for (const room of this.rooms) {
            if (floors.find(_ => _.name === room.floor)) {
                floors.find(_ => _.name === room.floor).rooms.push(room);
            } else {
                const rooms: RoomModel[] = [];
                rooms.push(room);
                const floor: FloorModel = {name: room.floor, rooms};
                floors.push(floor);
            }
        }
        return floors;
    }

    getRoomsName() {
        this.availableAndCheckedinRoomsName = [];
        for (const room of this.rooms) {
            if (room.status === 'Available' || room.status === 'Checked in') {
                this.availableAndCheckedinRoomsName.push(room.name);
            }
            if (room.status === 'Booked') {
                this.bookedRoomsName.push(room.name);
            }
        }
    }

    rightClick(e, roomName) {
        const room = this.rooms.find(s => s.name === roomName.replace('R', ''));
        if (e.itemData.text === 'Checkin') {
            if (room.status === 'Booked') {
                this.checkinComponent.onInit(room);
                this.checkinComponent.isVisiblePersonalCheckinPopup = true;
            } else if (room.status === 'Available') {
                this.checkinComponent.onInit(room);
                this.checkinComponent.isVisiblePersonalCheckinPopup = true;
            }
        } else if (e.itemData.text === 'Update Service' && room.status === 'Checked in') {
            this.updateServiceComponent.isVisibleUpdateServicePopup = true;
            this.updateServiceComponent.onInit(room);
        } else if (e.itemData.text === 'Checkout' && room.status === 'Checked in') {
            this.roomInfoComponent.onInit(room);
            this.roomInfoComponent.isVisiblePersonalCheckoutPopup = true;
        }
    }

    openRoomInfo(room: RoomModel) {
        if (room.status === 'Checked in') {
            this.roomInfoComponent.onInit(room);
            this.roomInfoComponent.isVisiblePersonalCheckoutPopup = true;
        } else if (room.status === 'Booked') {
            this.checkinComponent.onInit(room);
            this.checkinComponent.isVisiblePersonalCheckinPopup = true;
        } else {
            this.bookingComponent.isVisiblePersonalBookingPopup = true;
            this.bookingComponent.onInit(room, null, null, null);
        }
    }
}
