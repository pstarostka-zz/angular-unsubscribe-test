import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { exhaustMap, scan, switchMap, tap } from 'rxjs/operators';
import { Product } from './product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  private productsUrl = 'api/products';

  private getProductsSubject = new Subject<void>();
  public products$ = this.getProductsSubject.asObservable().pipe(
    tap(() => console.log('get')),
    switchMap(() => this.http.get<Product[]>(this.productsUrl))
  );
  // createProduct = (product: Product) => {
  //   console.log('Im in!');
  //   return this.http
  //     .post<unknown>(this.productsUrl, product)
  //     .pipe(tap(() => console.log('Calling api...')));
  // };

  private createProductSubject = new Subject<Product>();
  public productCreated$ = this.createProductSubject
    .asObservable()
    .pipe(
      exhaustMap((product) =>
        this.http.post<Product>(this.productsUrl, product)
      )
    );

  private getProductByIdSubject = new Subject<number>();
  public selectedProduct$ = this.getProductByIdSubject
    .asObservable()
    .pipe(
      switchMap((id) => this.http.get<Product>(`${this.productsUrl}/${id}`))
    );

  public productsWithAdd$ = merge(this.products$, this.productCreated$).pipe(
    scan((acc: any value: any) => [...acc, value])
  );
  //  map(([prod]) => [...prod])
  //

  getProducts = () => {
    console.log('in');
    this.getProductsSubject.next();
  };

  createProduct = (product: Product) => this.createProductSubject.next(product);
  getProductById = (id: number) => this.getProductByIdSubject.next(id);
}
