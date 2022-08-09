import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiClient} from "../../repo/httpClient";
import {Observable} from "rxjs";

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  productId: string | any;
  product: Observable<any> | any;

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
      }
    );
  }

}
