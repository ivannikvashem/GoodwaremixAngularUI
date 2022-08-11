import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiClient} from "../../repo/httpClient";
import {Observable} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})

export class ProductDetailsComponent implements OnInit {

  productId: string | any;
  product: Observable<any> | any;

  displayedAttrColumns: string[] = ['name', 'value'];
  dataSource = new MatTableDataSource();

  constructor(
    private api: ApiClient,
    private _ActivatedRoute:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.productId = this._ActivatedRoute.snapshot.paramMap.get("id");
    this.api.getProductById(this.productId).subscribe(
      data => {
        console.log(JSON.stringify(data));
        this.product = data.body;
        this.dataSource = new MatTableDataSource(this.product.attributes);
      }
    );
  }

}
