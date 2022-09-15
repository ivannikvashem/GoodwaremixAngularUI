import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiClient} from "../../repo/httpClient";
import {Observable} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {Product} from "../../models/product.model";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})

export class ProductDetailsComponent implements OnInit {

  productId: string | any;
  product: Observable<Product> | any;

  displayedAttrColumns: string[] = ['name', 'value','etim', 'action'];
  dataSource = new MatTableDataSource();
  safeVideoUrl: SafeResourceUrl | undefined;

  constructor(
    private api: ApiClient,
    private router: Router,
    private _ActivatedRoute:ActivatedRoute,
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.productId = this._ActivatedRoute.snapshot.paramMap.get("id");
    this.api.getProductById(this.productId).subscribe(
      data => {
        this.product = data.body;
        if (this.product.videos.length > 0)
          this.safeVideoUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this.product.videos[0]);
        this.dataSource = new MatTableDataSource(this.product.attributes);
      }
    );
  }

  goToEdit(id:string) {
    this.router.navigate([`attribute-edit/${id}`]);
  }
}
