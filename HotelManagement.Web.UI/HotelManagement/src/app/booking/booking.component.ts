import {Component, OnInit} from '@angular/core';
import {PersonalBookingDetailModel} from '../models/PersonalBookingDetailModel';
import {GroupBookingDetailModel} from '../models/GroupBookingDetailModel';
import {ClientModel} from '../models/ClientModel';
import {RoomModel} from '../models/RoomModel';
import notify from 'devextreme/ui/notify';
import {BookedClientsListModel} from '../models/BookedClientsListModel';
import {ClientService} from '../services/client.service';
import {BookedClientsListService} from '../services/booked-clients-list.service';
import {FloorModel} from '../models/FloorModel';
import {RoomService} from '../services/room.service';
import {BookingService} from '../services/booking.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-booking',
    templateUrl: './booking.component.html',
    styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
    isVisibleGroupBookingPopup = false;
    isVisiblePersonalBookingPopup = false;
    updateBooking = false;
    client: ClientModel = new ClientModel();
    roomBooking: RoomModel = new RoomModel();
    roomsBooking: RoomModel[] = [];
    personalBookingDetail: PersonalBookingDetailModel = {
        room: this.roomBooking,
        prePay: 0,
        discount: 0,
        notes: '',
        clients: []
    };
    groupBookingDetail: GroupBookingDetailModel = {
        checkinTime: new Date(),
        checkoutTime: new Date(),
        prePay: 0,
        discount: 0,
        notes: '',
        clients: [],
        rooms: []
    };
    rooms: RoomModel[] = [];
    dateNow: Date;
    bookedClient: BookedClientsListModel = new BookedClientsListModel();
    bookedClientsList: BookedClientsListModel[] = [];
    bookingTitle: string;

    constructor(
        private clientService: ClientService,
        private bookedClientsListService: BookedClientsListService,
        private roomService: RoomService,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.dateNow = new Date();
        this.rooms = [];
        this.roomService.getRooms().subscribe(data => {
            this.rooms = data;
        });
        this.bookedClientsList = this.bookedClientsListService.getBookedClientsList();
    }

    onInit(roomBooking: RoomModel, roomsBooking: RoomModel[], bookedClient: BookedClientsListModel,
           bookedClientList: BookedClientsListModel[]) {
        if (roomBooking) {
            this.roomBooking = roomBooking;
            if (roomBooking.clients.length) {
                this.updateBooking = true;
                for (const client of roomBooking.clients) {
                    if (this.bookedClientsList.find(s => s.client === client)) {
                        this.bookedClient = this.bookedClientsList.find(s => s.client === client);
                    }
                }
            }
            this.bookingTitle = 'Booking room ' + roomBooking.name + ' (' + roomBooking.type + ')';
        }
        if (roomsBooking) {
            this.roomsBooking = roomsBooking;
            if (roomsBooking[0].clients.length) {
                this.updateBooking = true;
            }
        }
        if (bookedClient) {
            this.bookedClient = bookedClient;
        }
        if (bookedClientList) {
            this.bookedClientsList = bookedClientList;
            for (const bookedClient of bookedClientList) {
                this.groupBookingDetail.clients.push(bookedClient.client);
            }
            this.updateBooking = true;
            this.bookingTitle = 'Update booking';
        }
    }

    addClientInfoOfGroupBooking() {
        const clientTemp: ClientModel = Object.assign({}, this.client);
        this.groupBookingDetail.clients.push(clientTemp);
        // this.resetClientInput();
    }

    bookGroupRooms() {
        if (this.groupBookingDetail.clients.length > 0) {
            const code = Math.floor(Math.random() * 1000);
            notify('Code: ' + code, 'success');
            for (const roomBooking of this.roomsBooking) {
                roomBooking.status = 'Booking';
                roomBooking.clients = this.groupBookingDetail.clients;
                this.updateRoom(roomBooking);
            }
            this.isVisibleGroupBookingPopup = false;
            this.groupBookingDetail.rooms = this.roomsBooking;
            this.clientService.saveBookedClients(this.groupBookingDetail.clients);
            this.addBookedClientsList(null, this.groupBookingDetail.clients, this.groupBookingDetail.checkinTime,
                this.groupBookingDetail.checkoutTime, 'Group Booking', code.toString(), this.groupBookingDetail.prePay,
                this.roomsBooking, this.groupBookingDetail.discount);
            this.roomsBooking = [];
            this.groupBookingDetail.clients = [];
            this.router.navigate(['/booked-clients-list']);
        } else {
            notify('Please add client for this rooms!', 'error');
        }
    }

    cancelGroupBooking() {
        this.roomsBooking = [];
        this.groupBookingDetail = {
            checkinTime: new Date(),
            checkoutTime: new Date(),
            prePay: 0,
            discount: 0,
            notes: '',
            clients: [],
            rooms: []
        };
        this.isVisibleGroupBookingPopup = false;
    }

    cancelBooking() {
        this.roomBooking = new RoomModel();
        this.personalBookingDetail = {
            room: this.roomBooking,
            prePay: 0,
            discount: 0,
            notes: '',
            clients: []
        };
        this.isVisiblePersonalBookingPopup = false;
    }

    addClientInfoOfPersonalBooking() {
        if ((this.roomBooking.type === 'Single' && this.roomBooking.clients.length === 0) || this.roomBooking.type === 'Double') {
            const clientTemp: ClientModel = Object.assign({}, this.client);
            this.roomBooking.clients.push(clientTemp);
            // this.resetClientInput();
            // this.personalBookingDetail.clients.push(clientTemp);
        } else {
            notify('Can not add more than one client for Single room!', 'warning');
        }
    }

    resetClientInput() {
        this.client = {
            id: null,
            name: '',
            address: '',
            email: '',
            nationality: '',
            identityOrPassport: '',
            notes: '',
            roomName: '',
            bookedClientListId: 0,
            invoiceId: 0
        };
    }

    bookPersonalRoom() {
        if (this.roomBooking.clients.length > 0) {
            const code = Math.floor(Math.random() * 1000);
            notify('Code: ' + code, 'success');
            // this.bookingService.saveClients(this.personalBookingDetail.clients);
            this.isVisiblePersonalBookingPopup = false;
            this.roomBooking.status = 'Booking';
            this.updateRoom(this.roomBooking);
            const rooms: RoomModel[] = [];
            rooms.push(this.roomBooking);
            this.personalBookingDetail.room = this.roomBooking;
            this.clientService.saveBookedClients(this.personalBookingDetail.clients);
            this.addBookedClientsList(null, this.roomBooking.clients, this.roomBooking.checkinTime, this.roomBooking.checkoutTime,
                'Personal Booking', code.toString(), this.personalBookingDetail.prePay, rooms, this.personalBookingDetail.discount);
            this.personalBookingDetail.clients = [];
            this.roomBooking = {
                name: '',
                status: '',
                price: 0,
                type: '',
                clients: null,
                floor: null,
                checkinTime: new Date(),
                checkoutTime: new Date(),
            };
            this.router.navigate(['/booked-clients-list']);
        } else {
            notify('Please add client for this room!', 'error');
        }
    }

    addBookedClientsList(id: number, clients: ClientModel[], checkinTime: Date, checkoutTime: Date,
                         bookType, code, prePay, rooms, discount) {
        for (const client of clients) {
            const bookedClient: BookedClientsListModel = {
                id,
                client,
                checkinTime,
                checkoutTime,
                code,
                bookType,
                prePay,
                notes: client.notes,
                createdTime: new Date(),
                rooms,
                status: 'Booking',
                discount
            };
            if (this.bookedClient.id != null) {
                if (this.bookedClient.client === client) {
                    bookedClient.id = this.bookedClient.id;
                    this.bookedClientsListService.updateBookedClientList(bookedClient);
                } else {
                    bookedClient.id = null;
                    this.bookedClientsListService.addBookedClientList(bookedClient);
                }
            } else {
                bookedClient.id = null;
                this.bookedClientsListService.addBookedClientList(bookedClient);
            }
        }
    }

    updatePersonalBooking() {
        this.updateRoom(this.roomBooking);
        const rooms: RoomModel[] = [];
        rooms.push(this.roomBooking);
        this.addBookedClientsList(null, this.roomBooking.clients, this.roomBooking.checkinTime, this.roomBooking.checkoutTime,
            'Personal Booking', this.bookedClient.code, this.personalBookingDetail.prePay, rooms, this.personalBookingDetail.discount);
        notify('Update personal booking successfully!', 'success');
        this.isVisiblePersonalBookingPopup = false;
    }

    updateGroupBooking() {
        notify('update group');
        this.isVisibleGroupBookingPopup = false;
    }

    updateRoom(room: RoomModel) {
        this.roomService.updateRoom(room);
    }
}
