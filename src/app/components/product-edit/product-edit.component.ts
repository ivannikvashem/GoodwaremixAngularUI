import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {Supplier} from "../../models/supplier.model";
import {ApiClient} from "../../repo/httpClient";
import {Product} from "../../models/product.model";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {AttributeProduct} from "../../models/attributeProduct.model";
import {ProductAttributeKey} from "../../models/productAttributeKey.model";
import {DataSource} from "@angular/cdk/collections";
import {Observable, ReplaySubject} from "rxjs";
import {Attribute} from "../../models/attribute.model";

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  // Supplier
  searchSuppliersCtrl = new FormControl<string | Supplier>('');
  public supplierList: Supplier[];  // public filteredSupplierList: Observable<Supplier[]> | undefined;
  selectedSupplier: Supplier;
  //Product
  product:Product;
  // Attributes
  dataToDisplay:Attribute[] = []
  public attributeList:Attribute[]
  attrTableColumns: string[] = ['idx', 'attributeKey', 'attributeValue', 'actions'];
  attrSelectedRow: any;
  attributeListCtrl = new FormControl<string | Attribute>('');
  selectedAttr: Attribute


  constructor(public api:ApiClient) { }

  ngOnInit(): void {

    this.api.getSuppliers('', 0 ,100, "SupplierName", "asc").subscribe( (r:any) => {
      this.supplierList = r.body.data
    });

    this.product = new Product()
    console.log(this.product)
  }

  addGTD($event: MatChipInputEvent) {
    const value = ($event.value || '').trim()
    if (value) { this.product.gtd.push(value)}
    $event.chipInput!.clear()
  }

  removeGTD(gtd:string) {
    const index = this.product.gtd.indexOf(gtd)
    if (index >= 0) {
      this.product.gtd.splice(index,1)
    }
  }

  updateSelectedSuppAttr(i: number, row: any) {
    console.log("updateSuppAttr attr dict!");
    //validation
    // Add our value
    const idx = this.product.attributes.indexOf(row.keySupplier);
    console.log("idx: "+ idx);
    if (row.keySupplier == null && idx != i) {
      return;
    }

    //update
    //this.attrSelectedRow = (this.attributeListCtrl.value as Attribute).nameAttribute;
    // this.attrSelectedRow.attributeBDName = this.selectedAttr?.nameAttribute;
    // this.attrSelectedRow.attributeValid = true;
    // this.supplier.supplierConfigs.attributeConfig.productAttributeKeys[i] = this.attrSelectedRow;
    // console.log("upd: " + JSON.stringify(this.attrSelectedRow));
    //
    // //prepare for refresh
    // this.clearAttrSelection();
    // this.attrDataSource.setData(this.supplier.supplierConfigs?.attributeConfig?.productAttributeKeys);
  }

  onSelectRow(row: any) {
    console.log("onSelectRow clear");
    this.selectedAttr = undefined;
    this.attributeListCtrl.setValue(row.attributeBDName);
    this.attrSelectedRow = row;
  }

  displayFn(attr: Attribute): string {
    return attr && attr.nameAttribute ? attr.nameAttribute + " [" + attr.etimFeature + "] от " + attr.supplierName : '';
  }

  onDBAttrSelected() {
    this.selectedAttr = this.attributeListCtrl.value as Attribute;
  }


}

class AttrDataSource extends DataSource<Attribute> {
  private _dataStream = new ReplaySubject<Attribute[]>();

  constructor(initialData: Attribute[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<Attribute[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: Attribute[]) {
    this._dataStream.next(data);
  }
}

