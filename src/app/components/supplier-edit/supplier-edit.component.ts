import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-supplier-edit',
  templateUrl: './supplier-edit.component.html',
  styleUrls: ['./supplier-edit.component.css']
})
export class SupplierEditComponent implements OnInit {

  supplierName: string | any;

  constructor(
    private _ActivatedRoute:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.supplierName = this._ActivatedRoute.snapshot.paramMap.get("supplierName");
  }

}
