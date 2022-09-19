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
import {debounceTime, Observable, ReplaySubject, switchMap, tap} from "rxjs";
import {Attribute} from "../../models/attribute.model";
import {AttributesDataSource} from "../../repo/AttributesDataSource";
import {finalize} from "rxjs/operators";

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
  dataToDisplay:any = []
  attrDataSource = new AttrDataSource(this.dataToDisplay)
  public attributeList:Attribute[] | undefined
  attributeListCtrl = new FormControl<string | Attribute>('');
  selectedAttr: Attribute | undefined

  // Attribute Value
  dataToDisplayValues:string[] = []
  attrValDataSource = new AttrValuesDataSource(this.dataToDisplayValues)
  public attributeValues:string[]
  attributeValuesCtrl = new FormControl<string>('');


  // Other
  imagesToUpload:string[] = []
  attrTableColumns: string[] = ['idx', 'attributeKey', 'attributeValue', 'actions'];
  attrSelectedRow: any;


  constructor(public api:ApiClient) { }

  ngOnInit(): void {

    this.api.getSuppliers('', 0 ,100, "SupplierName", "asc").subscribe( (r:any) => {
      this.supplierList = r.body.data
    });

    this.attributeListCtrl.valueChanges.pipe(
      //distinctUntilChanged(),
      debounceTime(100),
      tap(() => {

      }),
      switchMap(value => this.api.getAttributes(value, '' ,0, 10, undefined, "Rating", "desc")
        .pipe(
          finalize(() => {

          }),
        )
      )
    )
      .subscribe((data: any) => {
        this.attributeList = data.body.data;
      });

    this.product = new Product()
    //this.dataToDisplay
    console.log(this.product)
  }

  addProductAttr() {
    //if already added -  skip
    if (this.dataToDisplay.some((x: Attribute) => x.nameAttribute == '')) {
      return;
    }

    let a = new Attribute();
    this.dataToDisplay.push(a)

    this.attrDataSource.setData(this.dataToDisplay);

    let row = this.dataToDisplay[this.dataToDisplay.length - 1];
    console.log('row', JSON.stringify(this.dataToDisplay.length - 1))
    console.log('rowdata', row.nameAttribute)
    //
    // this.attributeListCtrl.setValue(row.nameAttribute);
    // this.attributeValuesCtrl.setValue(row.allValue[]);
    this.attrSelectedRow = row;
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
    console.log("updateSuppAttr", JSON.stringify(row));
    console.log(this.dataToDisplay)
    //validation
    // Add our value
    const idx = this.dataToDisplay.indexOf(row.keySupplier);
    console.log("idx: "+ idx);
    if (row.keySupplier == null && idx != i) {
      return;
    }

    //update
    this.attrSelectedRow = (this.attributeListCtrl.value as Attribute).nameAttribute;
    console.log(this.attrSelectedRow)
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
    this.attributeValuesCtrl.setValue(row.value);
    this.attrSelectedRow = row;
  }

  displayFn(attr: Attribute): string {
    return attr && attr.nameAttribute ? attr.nameAttribute + " [" + attr.etimFeature + "] от " + attr.supplierName : '';
  }

  onDBAttrSelected() {
    this.selectedAttr = this.attributeListCtrl.value as Attribute;
    this.attrDataSource.setData(this.dataToDisplay);
    this.attributeValues = this.selectedAttr.allValue;

    console.log(this.selectedAttr)
  }


  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event:any) => {
          // Push Base64 string
          this.imagesToUpload.push(event.target.result);
        }
        console.log(this.imagesToUpload)
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  // Remove Image
  removeImage(url:any){
    console.log(this.imagesToUpload,url);
    this.imagesToUpload = this.imagesToUpload.filter(img => (img != url));
  }

  // submitProduct() {
  //   this.api.add(this.supplier).subscribe( x => {
  //       //console.log("updateSupplier: " +JSON.stringify(x) );
  //       this._notyf.onSuccess("Конфигурация сохранена");
  //     },
  //     error => {
  //       //console.log("updateSupplierError: " + JSON.stringify(error));
  //       this._notyf.onError("Ошибка: " + JSON.stringify(error));
  //       //todo обработчик ошибок, сервер недоступен или еще чего..
  //     });
  // }
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

class AttrValuesDataSource extends DataSource<string> {
  private _dataStream = new ReplaySubject<string[]>();

  constructor(initialData: string[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<string[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: string[]) {
    this._dataStream.next(data);
  }
}
