import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {FormControl} from "@angular/forms";
import {Supplier} from "../../models/supplier.model";
import {ApiClient} from "../../repo/httpClient";
import {ProductAttributeKey} from "../../models/productAttributeKey.model";
import {DataSource} from "@angular/cdk/collections";
import { Attribute } from 'src/app/models/attribute.model';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {Dimensions} from "../../models/dimensions.model";
import {Multipliers} from "../../models/multipliers.model";
import {debounceTime, Observable, ReplaySubject, switchMap, tap} from "rxjs";
import {finalize} from "rxjs/operators";
import {NotificationService} from "../../service/notification-service";
import {MatDialog} from "@angular/material/dialog";
import {SupplierAttributeAddComponent} from "../shared/supplier-attribute-add/supplier-attribute-add.component";
import {MatTable} from "@angular/material/table";

export class HeaderModel {
  HeaderName:string
  HeaderValue:string
  isEditable:boolean = false
}

@Component({
  selector: 'app-supplier-edit',
  templateUrl: './supplier-edit.component.html',
  styleUrls: ['./supplier-edit.component.css']
})
export class SupplierEditComponent implements OnInit {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  supplierId: string = '';
  supplier: Supplier;
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

  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private _notyf: NotificationService,
    public dialog: MatDialog,
    public api: ApiClient,
  ) { }

  ngOnInit(): void {
    this.supplierId = this._ActivatedRoute.snapshot.paramMap.get("supplierId");
    if (this.supplierId) {
      this.api.getSupplierById(this.supplierId)
        .subscribe( (s:any) => {
          if (s?.body.supplierConfigs?.nettoConfig?.dimensions == null) {
            s.body.supplierConfigs.nettoConfig.dimensions = new Dimensions();
          }
          if (s?.body.supplierConfigs?.packageConfig?.dimensions == null) {
            s.body.supplierConfigs.packageConfig.dimensions = new Dimensions();
          }
          if (s?.body.supplierConfigs?.multipliers == null) {
            s.body.supplierConfigs.multipliers = new Multipliers();
          }
          this.supplier = s.body as Supplier;
          this.headerList = JSON.parse(this.supplier.sourceSettings.header)
          this.headerList.forEach(value => {value.isEditable = false})
          this.attrDataSource.setData(this.supplier.supplierConfigs?.attributeConfig?.productAttributeKeys || []);
        });
    }
    else {
      this.supplier = new Supplier();
    }
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
    // if (this.supplier.supplierConfigs.attributeConfig.productAttributeKeys.some( (x: ProductAttributeKey) => x == '')) {
    //   return;
    // }

    let a: ProductAttributeKey = {keySupplier: '', attributeBDName: '', attributeIdBD: '', attributeValid: false, multiplier: ''};
    this.supplier.supplierConfigs.attributeConfig.productAttributeKeys.push(a);

    this.attrDataSource.setData(this.supplier.supplierConfigs?.attributeConfig?.productAttributeKeys);
    let row = this.supplier.supplierConfigs?.attributeConfig?.productAttributeKeys[this.supplier.supplierConfigs?.attributeConfig?.productAttributeKeys.length - 1];
    this.attributeListCtrl.setValue(row.attributeBDName);
    this.attrSelectedRow = row;
  }

  deleteSuppAttr(keySupplier: string, attributeBDName:string) {
    let idx = this.supplier.supplierConfigs.attributeConfig.productAttributeKeys.map((obj:ProductAttributeKey) => obj.keySupplier).indexOf(keySupplier);
    console.log('to del', attributeBDName)
    this.supplier.supplierConfigs.attributeConfig.productAttributeKeys.splice(idx, 1);
    this.attrDataSource.setData(this.supplier.supplierConfigs?.attributeConfig?.productAttributeKeys);
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
    // const idx = this.supplier.supplierConfigs.attributeConfig.productAttributeKeys.indexOf(row.attributeIdBD);
    // console.log("idx: "+ idx);
    // if (row.keySupplier == null && idx != i) {
    //   return;
    // }

    //update
    //this.attrSelectedRow = (this.attributeListCtrl.value as Attribute).nameAttribute;
    this.attrSelectedRow.attributeBDName = this.selectedAttr?.nameAttribute;
    this.attrSelectedRow.attributeValid = true;
    this.supplier.supplierConfigs.attributeConfig.productAttributeKeys[i] = this.attrSelectedRow;
    console.log("upd: " + JSON.stringify(this.attrSelectedRow));

    //prepare for refresh
    this.clearAttrSelection();
    this.attrDataSource.setData(this.supplier.supplierConfigs?.attributeConfig?.productAttributeKeys);
  }

  clearAttrSelection():void {
    this.attrSelectedRow = null;
  }
  addDateFormat(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const idx = this.supplier.supplierConfigs.dateFormats?.indexOf(value);
    if (value && idx === -1 ) {
      this.supplier.supplierConfigs.dateFormats?.push(value);
    }
    event.chipInput!.clear();
  }

  removeDateFormat(date: string): void {
    const index = this.supplier.supplierConfigs.dateFormats?.indexOf(date);
    if (typeof(index) == "number" && index >= 0) {
      this.supplier.supplierConfigs.dateFormats?.splice(index, 1);
    }
  }

  submitSupplier() {
    for (let i of this.headerList) { delete i.isEditable }
    this.supplier.sourceSettings.header = JSON.stringify(this.headerList)
    this.api.updateSupplier(this.supplier).subscribe( x => {
      this._notyf.onSuccess("Конфигурация сохранена");
        for (let i of this.attributesToAdd) {
          i.supplierId = x.body.id
          i.supplierName = x.body.supplierName
          this.api.updateAttribute(i).subscribe()
        }
      },
      error => {
        this._notyf.onError("Ошибка: " + JSON.stringify(error));
        //todo обработчик ошибок, сервер недоступен или еще чего..
      });
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
