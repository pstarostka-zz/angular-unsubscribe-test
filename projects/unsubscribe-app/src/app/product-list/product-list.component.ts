import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { Product } from '../product/product';
import { ProductService } from './../product/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private productService: ProductService) {}

  public vm$ = combineLatest([
    this.productService.productsWithAdd$,
    this.productService.selectedProduct$.pipe(startWith(null)),
  ]).pipe(
    map(([products, selectedProduct]) => ({ products, selectedProduct }))
  );

  public destroy$ = new Subject<void>();
  ngOnInit(): void {
    this.productService.productCreated$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        console.log('product created');
      });
  }

  ngAfterViewInit() {
    this.productService.getProducts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async create() {
    console.log('create');
    const prod: Product = {
      id: 5000,
      description: 'desc',
      productCode: 'asd',
      productName: 'asdsd',
      starRating: 5,
    };

    this.productService.createProduct(prod);
    // this.productService
    //   .createProduct(prod)
    //   .pipe(take(1))
    //   .subscribe((res) => console.log(res));
  }

  public getById(id: number | null) {
    this.productService.getProductById(id as number);
  }
}
