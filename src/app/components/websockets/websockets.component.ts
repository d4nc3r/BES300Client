import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderCreate } from 'src/app/models/order-create';
import { OrderEntity } from 'src/app/reducers/async.reducer';
import { CurbsideHubService } from 'src/app/services/curbside-hub.service';

@Component({
  selector: 'app-websockets',
  templateUrl: './websockets.component.html',
  styleUrls: ['./websockets.component.scss']
})
export class WebsocketsComponent implements OnInit {
  order$: Observable<OrderEntity>;
  item$: Observable<any>;
  constructor(private hubService: CurbsideHubService) {
    this.order$ = hubService.getOrder();
    this.item$ = hubService.getItem();
  }

  ngOnInit(): void {
  }

  placeOrder(order: OrderCreate): void {
     this.hubService.sendOrder(order);
  }

}
