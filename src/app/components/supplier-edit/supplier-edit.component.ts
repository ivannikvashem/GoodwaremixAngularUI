import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-supplier-edit',
  templateUrl: './supplier-edit.component.html',
  styleUrls: ['./supplier-edit.component.css']
})
export class SupplierEditComponent implements OnInit {

  supplierName: string | any;
  baseFormGroup = this._formBuilder.group({
    supplierNameCtrl: ['', Validators.required],
    vendorIdCtrl: ['', Validators.required],
    titleCtrl: ['', Validators.required],
  });
  fetcherFormGroup = this._formBuilder.group({
    secondCtrl: [''],
  });


  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.supplierName = this._ActivatedRoute.snapshot.paramMap.get("supplierName");
  }

}
