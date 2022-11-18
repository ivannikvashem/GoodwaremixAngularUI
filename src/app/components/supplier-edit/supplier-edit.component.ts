import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormControl} from "@angular/forms";
import {Supplier, SupplierConfig} from "../../models/supplier.model";
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
import {ConfirmDialogComponent, ConfirmDialogModel} from "../shared/confirm-dialog/confirm-dialog.component";

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
  supplier: Supplier = new Supplier();
  dataToDisplay:any = [];
  attrDataSource = new ProdAttrDataSource(this.dataToDisplay);
  selectedConfig = new FormControl(0)
  isConfigTabsLoading:boolean = false

  attrTableColumns: string[] = ['idx', 'keySupplier', 'attributeBDName', 'actions'];
  attrSelectedRow: any;
  public attributeList: Attribute[] | undefined;
  attributesToAdd:Attribute[] = []
  attributeListCtrl = new FormControl<string | Attribute>('');
  selectedAttr: Attribute | undefined;
  headerTableColumns: string[] = ['headerKey', 'headerValue', 'headerAction'];

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
          this.supplier = s.body as Supplier;

          for (let config of this.supplier.supplierConfigs) {
            config.nettoConfig.dimensions = new Dimensions()
            config.packageConfig.dimensions = new Dimensions()
            config.multipliers = new Multipliers()
            this.attrDataSource.setData(config?.attributeConfig?.productAttributeKeys || [])
            if (config.sourceSettings.header) {
              config.sourceSettings.header = JSON.parse(config.sourceSettings.header) as HeaderModel
            }
          }
        });
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

  addSuppAttr(table:any,config:any) {
    //if already added -  skip
    // if (this.supplier.supplierConfigs.attributeConfig.productAttributeKeys.some( (x: ProductAttributeKey) => x == '')) {
    //   return;
    // }
    console.log('conf', config)

    let a: ProductAttributeKey = {keySupplier: '', attributeBDName: '', attributeIdBD: '', attributeValid: false, multiplier: ''};
    config.attributeConfig.productAttributeKeys.push(a);
    this.attrDataSource.setData(config?.attributeConfig?.productAttributeKeys);
    let row = config.attributeConfig?.productAttributeKeys[config?.attributeConfig?.productAttributeKeys.length - 1];
    this.attributeListCtrl.setValue(row.attributeBDName);
    this.attrSelectedRow = row;
    table.renderRows()
  }

  deleteSuppAttr(keySupplier: string, attributeBDName:string, config:any, table:any) {
    let idx = config.attributeConfig.productAttributeKeys.map((obj:ProductAttributeKey) => obj.keySupplier).indexOf(keySupplier);
    console.log('to del', attributeBDName)
    config.attributeConfig.productAttributeKeys.splice(idx, 1);
    table.renderRows()
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

  updateSelectedSuppAttr(i: number, row: any, config:any) {
    //validation
    // Add our value
    const idx = config.attributeConfig.productAttributeKeys.indexOf(row.attributeIdBD);
    console.log("idx: "+ idx);
    if (row.keySupplier == null && idx != i) {
      return;
    }
    //update
    //this.attrSelectedRow = (this.attributeListCtrl.value as Attribute).nameAttribute;

    this.attrSelectedRow.attributeBDName = this.selectedAttr?.nameAttribute;
    this.attrSelectedRow.attributeValid = true;
    config.attributeConfig.productAttributeKeys[i] = this.attrSelectedRow;
    console.log("upd: " + JSON.stringify(this.attrSelectedRow));

    //prepare for refresh
    this.clearAttrSelection();
    this.attrDataSource.setData(config.attributeConfig?.productAttributeKeys);
  }

  clearAttrSelection():void {
    this.attrSelectedRow = null;
  }
  addDateFormat(event: MatChipInputEvent, config:any): void {
    const value = (event.value || '').trim();
    const idx = config.dateFormats?.indexOf(value);
    if (value && idx === -1 ) {
      config.dateFormats?.push(value);
    }
    event.chipInput!.clear();
  }

  removeDateFormat(date: string, config:any): void {
    const index = config.dateFormats?.indexOf(date);
    if (typeof(index) == "number" && index >= 0) {
      config.dateFormats?.splice(index, 1);
    }
  }

  submitSupplier() {
    let supplier = this.supplier
    for (let config of supplier.supplierConfigs) {
      if (config.sourceSettings.header != undefined && config.sourceSettings.header.length > 0) {
        for (let header of config.sourceSettings.header) {
          delete header.isEditable
        }
        config.sourceSettings.header = JSON.stringify(config.sourceSettings.header)
      } else {
        config.sourceSettings.header = null
      }
    }
    this.api.updateSupplier(supplier).subscribe( x => {
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

      for (let config of supplier.supplierConfigs) {                                                //todo  <- shit way, need to be fixed
        config.sourceSettings.header = JSON.parse(config.sourceSettings.header) as HeaderModel
      }

  }

  addNewAttr() {
    this.openAttributeEditorDialog()
  }

  openAttributeEditorDialog(): void {
    const dialogRef = this.dialog.open(SupplierAttributeAddComponent, {
      data: { supplierName: this.supplier.supplierName, newAttribute: new Attribute() },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.attributesToAdd.push(result.newAttribute)
        this.selectedAttr = result.newAttribute
        this.attributeListCtrl.setValue(result.newAttribute as Attribute);
      }
    });
  }

  addHeader(table:any, config:any) {
    console.log('conf', config)
    if (config.sourceSettings.header == null) {config.sourceSettings.header = []}
    let newHeader = <HeaderModel> {HeaderName : '', HeaderValue : '', isEditable : true }
    config.sourceSettings.header.push(newHeader)
    table.renderRows()
  }

  deleteHeader(element:HeaderModel, config:any) {
    config.sourceSettings.header = config.sourceSettings.header.filter((value:any) => (value != element))
  }

  saveHeader(element:HeaderModel, config:any) {
    if (element.HeaderName != '' && element.HeaderValue != '')
      element.isEditable = false
    else
      this.deleteHeader(element, config)
  }

  addInn($event: MatChipInputEvent) {
    const value = ($event.value || '').trim();
    const idx = this.supplier.inn?.indexOf(value);
    if (value && idx === -1 ) {
      this.supplier.inn?.push(value);
    }
    $event.chipInput!.clear();
  }

  removeInn(inn: string) {
    const index = this.supplier.inn?.indexOf(inn);
    if (typeof(index) == "number" && index >= 0) {
      this.supplier.inn?.splice(index, 1);
    }
  }

  addBrand($event: MatChipInputEvent) {
    const value = ($event.value || '').trim();
    const idx = this.supplier.brands?.indexOf(value);
    if (value && idx === -1 ) {
      this.supplier.brands?.push(value);
    }
    $event.chipInput!.clear();
  }

  removeBrand(brand: string) {
    const index = this.supplier.brands?.indexOf(brand);
    if (typeof(index) == "number" && index >= 0) {
      this.supplier.brands?.splice(index, 1);
    }
  }

  addConfig() {
    const config = new SupplierConfig()
    config.name = 'Конфигурация'
    this.supplier.supplierConfigs.push(config)
    this.selectedConfig.setValue(this.supplier.supplierConfigs.length - 1);
  }

  deleteConfig(value: any) {
    const message = `Удалить конфигурацию «` + value.name + `»?`;
    const dialogData = new ConfirmDialogModel("Подтверждение", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        const index = this.supplier.supplierConfigs?.indexOf(value);
        if (typeof(index) == "number" && index >= 0) {
          this.supplier.supplierConfigs?.splice(index, 1);
        }
        this.selectedConfig.setValue(this.supplier.supplierConfigs.length - 1);
      }
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
