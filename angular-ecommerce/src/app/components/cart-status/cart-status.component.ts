import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../service/cart.service';

@Component({
  selector: 'app-cart-status',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.css',
})
export class CartStatusComponent {
  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus() {
    this.cartService.totalPrice.subscribe((data) => (this.totalPrice = data));

    this.cartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data)
    );
  }
}
