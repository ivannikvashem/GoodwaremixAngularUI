import {Component, OnInit, ViewChild} from '@angular/core';
import {Supplier, SupplierConfig} from "../../../models/supplier.model";
import {Attribute} from "../../../models/attribute.model";
import {FormControl} from "@angular/forms";
import {MatTable} from "@angular/material/table";
import {DataSource} from "@angular/cdk/collections";
import {ProductAttributeKey} from "../../../models/productAttributeKey.model";
import {debounceTime, Observable, ReplaySubject, switchMap, tap} from "rxjs";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {ActivatedRoute} from "@angular/router";
import {NotificationService} from "../../../service/notification-service";
import {MatDialog} from "@angular/material/dialog";
import {ApiClient} from "../../../service/httpClient";
import {finalize} from "rxjs/operators";
import {MatChipInputEvent} from "@angular/material/chips";
import {SupplierAttributeAddComponent} from "../supplier-attribute-add/supplier-attribute-add.component";

export class HeaderModel {
  HeaderName:string
  HeaderValue:string
  isEditable:boolean = false
}

@Component({
  selector: 'app-supplier-config-edit',
  templateUrl: './supplier-config-edit.component.html',
  styleUrls: ['./supplier-config-edit.component.css']
})
export class SupplierConfigEditComponent implements OnInit {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  supplierConfig = new SupplierConfig()
  supplier = new Supplier()

  dataToDisplay:any = [];
  attrDataSource = new ProdAttrDataSource(this.dataToDisplay);
  attrTableColumns: string[] = ['idx', 'keySupplier', 'attributeBDName', 'actions'];
  attrSelectedRow: any;
  public attributeList: Attribute[] | undefined;
  attributesToAdd:Attribute[] = []
  attributeListCtrl = new FormControl<string | Attribute>('');
  selectedAttr: Attribute | undefined;
  headerList:HeaderModel[] = []
  headerTableColumns: string[] = ['headerKey', 'headerValue', 'headerAction'];
  @ViewChild(MatTable) headerTable: MatTable<any>;

  obj:any

  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private _notyf: NotificationService,
    public dialog: MatDialog,
    public api: ApiClient,
  ) { }

  ngOnInit(): void {
    console.log('config - ',JSON.stringify(this._ActivatedRoute.snapshot.paramMap.get("config")))
    this.obj = this._ActivatedRoute.snapshot.paramMap.get("config")
    console.log(this.obj.type)
/*
    this.supplierConfig = JSON.parse(this._ActivatedRoute.snapshot.paramMap.get("config")) as SupplierConfig;
*/
    console.log('conf', this.supplierConfig)
    /*if (this.supplierConfig) {
      this.headerList = JSON.parse(this.supplierConfig.sourceSettings.header)
      this.headerList.forEach(value => {value.isEditable = false})
      this.attrDataSource.setData(this.supplierConfig.attributeConfig?.productAttributeKeys || []);
    }
    else {*/
      this.supplierConfig = new SupplierConfig()
    //}

    this.attributeListCtrl.valueChanges.pipe(
      debounceTime(100),
      tap(() => {

      }),
      switchMap(value => this.api.getAttributes(value, '' ,0, 10, undefined, "Rating", "desc")
        .pipe(
          finalize(() => {

          }),
        )
      )
    ).subscribe((data: any) => { this.attributeList = data.body.data; });
  }

  addSuppAttr() {
    //if already added -  skip
    // if (this.supplierConfig.attributeConfig.productAttributeKeys.some( (x: ProductAttributeKey) => x == '')) {
    //   return;
    // }

    let a: ProductAttributeKey = {keySupplier: '', attributeBDName: '', attributeIdBD: '', attributeValid: false, multiplier: ''};
    this.supplierConfig.attributeConfig.productAttributeKeys.push(a);

    this.attrDataSource.setData(this.supplierConfig?.attributeConfig?.productAttributeKeys);
    let row = this.supplierConfig?.attributeConfig?.productAttributeKeys[this.supplierConfig?.attributeConfig?.productAttributeKeys.length - 1];
    this.attributeListCtrl.setValue(row.attributeBDName);
    this.attrSelectedRow = row;
  }

  deleteSuppAttr(keySupplier: string, attributeBDName:string) {
    let idx = this.supplierConfig.attributeConfig.productAttributeKeys.map((obj:ProductAttributeKey) => obj.keySupplier).indexOf(keySupplier);
    console.log('to del', attributeBDName)
    this.supplierConfig.attributeConfig.productAttributeKeys.splice(idx, 1);
    this.attrDataSource.setData(this.supplierConfig?.attributeConfig?.productAttributeKeys);
  }

  onSelectRow(row: any) {
    console.log("onSelectRow clear");
    this.selectedAttr = this.attributeListCtrl.value as Attribute;
    this.attributeListCtrl.setValue(this.selectedAttr);
    this.attrSelectedRow = row;
  }

  displayFn(attr: Attribute): string {
    return attr && attr.nameAttribute ? attr.nameAttribute + " [" + attr?.etimFeature + "] от " + attr?.supplierName : '';
  }

  onDBAttrSelected() {
    this.selectedAttr = this.attributeListCtrl.value as Attribute;
  }

  updateSelectedSuppAttr(i: number, row: any) {
    //validation
    // Add our value
    // const idx = this.supplierConfig.attributeConfig.productAttributeKeys.indexOf(row.attributeIdBD);
    // console.log("idx: "+ idx);
    // if (row.keySupplier == null && idx != i) {
    //   return;
    // }

    //update
    //this.attrSelectedRow = (this.attributeListCtrl.value as Attribute).nameAttribute;
    this.attrSelectedRow.attributeBDName = this.selectedAttr?.nameAttribute;
    this.attrSelectedRow.attributeValid = true;
    this.supplierConfig.attributeConfig.productAttributeKeys[i] = this.attrSelectedRow;
    console.log("upd: " + JSON.stringify(this.attrSelectedRow));

    //prepare for refresh
    this.clearAttrSelection();
    this.attrDataSource.setData(this.supplierConfig?.attributeConfig?.productAttributeKeys);
  }

  clearAttrSelection():void {
    this.attrSelectedRow = null;
  }
  addDateFormat(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const idx = this.supplierConfig.dateFormats?.indexOf(value);
    if (value && idx === -1 ) {
      this.supplierConfig.dateFormats?.push(value);
    }
    event.chipInput!.clear();
  }

  removeDateFormat(date: string): void {
    const index = this.supplierConfig.dateFormats?.indexOf(date);
    if (typeof(index) == "number" && index >= 0) {
      this.supplierConfig.dateFormats?.splice(index, 1);
    }
  }

  addNewAttr(element: any) {
    this.openAttributeEditorDialog()
  }

  openAttributeEditorDialog(): void {
    const dialogRef = this.dialog.open(SupplierAttributeAddComponent, {
      data: { supplierName: this.supplier.supplierName, newAttribute: new Attribute() },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.attributesToAdd.push(result.newAttribute)
      this.selectedAttr = result.newAttribute
      this.attributeListCtrl.setValue(result.newAttribute as Attribute);
    });
  }

  addHeader() {
    let newHeader = <HeaderModel> {HeaderName : '', HeaderValue : '', isEditable : true }
    this.headerList.push(newHeader)
    this.headerTable.renderRows()
  }

  deleteHeader(element:HeaderModel) {
    this.headerList = this.headerList.filter(value => (value != element))
  }

  saveHeader(element:HeaderModel) {
    if (element.HeaderName != '' && element.HeaderValue != '')
      element.isEditable = false
    else
      this.deleteHeader(element)
  }
}

class ProdAttrDataSource extends DataSource<ProductAttributeKey> {
  private _dataStream = new ReplaySubject<ProductAttributeKey[]>();

  constructor(initialData: ProductAttributeKey[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<ProductAttributeKey[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: ProductAttributeKey[]) {
    this._dataStream.next(data);
  }
}
