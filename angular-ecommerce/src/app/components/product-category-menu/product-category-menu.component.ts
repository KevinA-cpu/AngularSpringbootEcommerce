import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProductCategory } from '../../common/product-category';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-product-category-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor],
  templateUrl: './product-category-menu.component.html',
  styleUrl: './product-category-menu.component.css',
})
export class ProductCategoryMenuComponent {
  productCategories: ProductCategory[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.listProductCategories();
  }

  listProductCategories() {
    this.productService
      .getProductCategories()
      .subscribe((data: ProductCategory[]) => {
        this.productCategories = data;
      });
  }
}
