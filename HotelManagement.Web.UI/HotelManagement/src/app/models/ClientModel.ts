import {InvoiceModel} from './InvoiceModel';

export class ClientModel {
    id: number;
    name: string;
    address: string;
    email: string;
    identityOrPassport: string;
    nationality: string;
    notes: string;
    roomName: string;
    invoiceId: number;
    checkinTime: Date;
    checkoutTime: Date;
    code: number;
    bookType: string;
    prepay: number;
    status: string; // booking or checkin
    discount: number;
    invoice: InvoiceModel;

    constructor(init?: Partial<ClientModel>) {
        if (init) {
            Object.assign(this, init);
        }
    }

}
