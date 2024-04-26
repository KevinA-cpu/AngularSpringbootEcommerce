import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../../service/product.service';
import { CartService } from '../../service/cart.service';
import { Product } from '../../common/product';
import { CartItem } from '../../common/cart-item';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  product: Product = new Product(
    0,
    '',
    '',
    '',
    0,
    '',
    false,
    0,
    new Date(),
    new Date()
  );

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  handleProductDetails() {
    const productId: number = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(productId).subscribe((data) => {
      this.product = data;
    });
  }

  addToCart() {
    const theCartItem = new CartItem(
      this.product.id,
      this.product.name,
      this.product.imageUrl,
      this.product.unitPrice
    );
    this.cartService.addToCart(theCartItem);
  }
}
