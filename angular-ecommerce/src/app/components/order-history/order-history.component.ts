import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, CurrencyPipe, DatePipe } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { OrderHistory } from '../../common/order-history';
import { OrderHistoryService } from '../../service/order-history.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, DatePipe],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css',
})
export class OrderHistoryComponent implements OnInit {
  orderHistory: OrderHistory[] = [];
  email: string | undefined;

  constructor(
    private orderHistoryService: OrderHistoryService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      this.email = user?.email;
      this.handleOrderHistory();
    });
  }

  handleOrderHistory() {
    if (this.email) {
      this.orderHistoryService.getOrderHistory(this.email).subscribe((data) => {
        this.orderHistory = data._embedded.orders;
      });
    }
  }
}
