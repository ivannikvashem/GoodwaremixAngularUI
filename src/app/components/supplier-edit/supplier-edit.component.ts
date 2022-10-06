import {Component, OnInit} from '@angular/core';
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
import {ProductAttributeEditComponent} from "../shared/product-attribute-edit/product-attribute-edit.component";
import {AttributeProduct} from "../../models/attributeProduct.model";
import {MatDialog} from "@angular/material/dialog";
import {SupplierAttributeAddComponent} from "../shared/supplier-attribute-add/supplier-attribute-add.component";

@Component({
  selector: 'app-supplier-edit',
  templateUrl: './supplier-edit.component.html',
  styleUrls: ['./supplier-edit.component.css']
})
export class SupplierEditComponent implements OnInit {

  supplierId: string = '';
  supplier: Supplier;
  dataToDisplay:any = [];
  attrDataSource = new ProdAttrDataSource(this.dataToDisplay);
  attrTableColumns: string[] = ['idx', 'keySupplier', 'attributeBDName', 'actions'];
  attrSelectedRow: any;
  public attributeList: Attribute[] | undefined;
  attributeListCtrl = new FormControl<string | Attribute>('');
  selectedAttr: Attribute | undefined;

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
          console.log("get data by " + this.supplierId + ": " + JSON.stringify(s));
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
    console.log('row', JSON.stringify(this.supplier.supplierConfigs?.attributeConfig?.productAttributeKeys.length -1))
    console.log('row data', JSON.stringify(row.attributeIdBD))
    this.attributeListCtrl.setValue(row.attributeBDName);
    this.attrSelectedRow = row;
  }

  deleteSuppAttr(keySupplier: string) {
    let idx = this.supplier.supplierConfigs.attributeConfig.productAttributeKeys.map((obj:ProductAttributeKey) => obj.keySupplier).indexOf(keySupplier);
    console.log(idx);

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
    return attr && attr.nameAttribute ? attr.nameAttribute + " [" + attr.etimFeature + "] от " + attr.supplierName : '';
  }

  onDBAttrSelected() {
    this.selectedAttr = this.attributeListCtrl.value as Attribute;
  }

  updateSelectedSuppAttr(i: number, row: any) {
    console.log("updateSuppAttr attr dict!");
    console.log(JSON.stringify(this.dataToDisplay))

    //validation
    // Add our value
    const idx = this.supplier.supplierConfigs.attributeConfig.productAttributeKeys.indexOf(row.attributeIdBD);
    console.log("idx: "+ idx);
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

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  addDateFormat(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our value
    const idx = this.supplier.supplierConfigs.dateFormats?.indexOf(value);
    if (value && idx === -1 ) {
      this.supplier.supplierConfigs.dateFormats?.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  removeDateFormat(fruit: string): void {
    const index = this.supplier.supplierConfigs.dateFormats?.indexOf(fruit);
    if (typeof(index) == "number" && index >= 0) {
      this.supplier.supplierConfigs.dateFormats?.splice(index, 1);
    }
  }

  submitSupplier() {
    this.api.updateSupplier(this.supplier).subscribe( x => {
        this._notyf.onSuccess("Конфигурация сохранена");
      },
      error => {
        this._notyf.onError("Ошибка: " + JSON.stringify(error));
        //todo обработчик ошибок, сервер недоступен или еще чего..
      });
  }

  addNewAttr(element: any) {
    console.log("el: " + JSON.stringify(element) );
    this.openAttributeEditorDialog()
  }


  openAttributeEditorDialog(supplierName?:any): void {
    const dialogRef = this.dialog.open(SupplierAttributeAddComponent, {
      data: { oldAttribute: supplierName, newAttribute: new Attribute() },
    });

    dialogRef.afterClosed().subscribe(result => {
      // if (this.product.attributes.filter(x => x.value !== result.newAttribute?.value)) {
      //   if (result.newAttribute?.value !== undefined) {
      //     if (oldAttribute == undefined) {
      //       this.product.attributes.unshift(result.newAttribute as AttributeProduct)
      //       this.attrDataSource.setData(this.product.attributes || []);
      //     }
      //     else {
      //       if (oldAttribute !== result.newAttribute) {
      //         const target = this.product.attributes.find((obj) => obj.value === oldAttribute.value)
      //         const a = this.product.attributes.find(x => x.value).value == result.newAttribute.value
      //         Object.assign(target, result.newAttribute)
      //       }
      //     }
      //   }
      // }
    });
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
