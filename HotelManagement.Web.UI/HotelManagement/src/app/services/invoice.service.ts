import {Injectable} from '@angular/core';
import {InvoiceModel} from '../models/InvoiceModel';
import {Observable} from 'rxjs';
import {ApiService} from './api.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class InvoiceService {
    apiUrl = ApiService.apiUrl + 'invoice/';

    constructor(
        private http: HttpClient,
    ) {
    }

    addInvoice(invoice: InvoiceModel): Observable<InvoiceModel> {
        return this.http.post<InvoiceModel>(this.apiUrl, invoice);
    }

    updateInvoice(invoice: InvoiceModel): Observable<InvoiceModel> {
        return this.http.put<InvoiceModel>(this.apiUrl, invoice);
    }

    getInvoices(): Observable<InvoiceModel[]> {
        return this.http.get<InvoiceModel[]>(this.apiUrl);
    }

    getInvoiceByRoomName(roomName: string): Observable<InvoiceModel> {
        return this.http.get<InvoiceModel>(this.apiUrl + 'roomname/' + roomName);
    }

    exportInvoice(invoice: InvoiceModel): Observable<any> {
        return this.http.post(ApiService.apiUrl + 'report/invoice', invoice, {
            responseType: 'blob'
        });
    }

    getMaxId(): Observable<number> {
        return this.http.get<number>(this.apiUrl + 'getmaxid');
    }

    delete(invoiceId: number): Observable<InvoiceModel> {
        return this.http.delete<InvoiceModel>(this.apiUrl + invoiceId);
    }
}
