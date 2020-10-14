import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrderCreate } from '../models/order-create';
import { OrderEntity } from '../reducers/async.reducer';

@Injectable()
export class CurbsideHubService {
    private hubConnection: signalR.HubConnection;
    private order$: BehaviorSubject<OrderEntity>;
    private processedItem$: BehaviorSubject<any>;

    constructor() {
        this.hubConnection = new signalR.HubConnectionBuilder().withUrl('http://localhost:3000/curbsidehub').build();
        this.hubConnection.start()
            .then(c => console.log('hub connection started'))
            .catch(err => console.error('hub connection failed', err));

        this.order$ = new BehaviorSubject<OrderEntity>(null);
        this.processedItem$ = new BehaviorSubject<any>(null);
        this.hubConnection.on('OrderPlaced', data => this.order$.next(data));
        this.hubConnection.on('ItemProcessed', data => this.processedItem$.next(data.message));
        this.hubConnection.on('OrderProcessed', data => this.order$.next(data));
    }

    sendOrder(request: OrderCreate): void {
        this.hubConnection.send('PlaceOrder', request);
    }

    getOrder(): Observable<OrderEntity> {
        return this.order$.asObservable();
    }

    getItem(): Observable<any> {
        return this.processedItem$.asObservable();
    }
}
