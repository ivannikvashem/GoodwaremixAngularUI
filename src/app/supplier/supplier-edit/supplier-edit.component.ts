import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {Supplier, SupplierConfig} from "../../models/supplier.model";
import {ApiClient} from "../../service/httpClient";
import {ProductAttributeKey} from "../../models/productAttributeKey.model";
import { Attribute } from 'src/app/models/attribute.model';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {debounceTime, switchMap, tap} from "rxjs";
import {finalize} from "rxjs/operators";
import {NotificationService} from "../../service/notification-service";
import {MatDialog} from "@angular/material/dialog";
import {SupplierAttributeAddComponent} from "../../components/shared/supplier-attribute-add/supplier-attribute-add.component";
import {ConfirmDialogComponent, ConfirmDialogModel} from "../../components/shared/confirm-dialog/confirm-dialog.component";
import {Dimensions} from "../../models/dimensions.model";

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
    private router: Router,
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
            /*config.multipliers = new Multipliers()*/
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
    if (config.attributeConfig.productAttributeKeys.some( (x: ProductAttributeKey) => x.keySupplier == '')) {
       return;
    }
    let a: any = { id:config.attributeConfig.productAttributeKeys.length, keySupplier: '', attributeBDName: '', attributeIdBD: '', attributeValid: false, multiplier: ''};
    config.attributeConfig.productAttributeKeys.push(a);
    let row = config.attributeConfig?.productAttributeKeys[config?.attributeConfig?.productAttributeKeys.length - 1];
    this.attributeListCtrl.setValue(row.attributeBDName);
    this.attrSelectedRow = row;
    table.renderRows()
  }

  deleteSuppAttr(keySupplier: string, attributeBDName:string, config:any, table:any) {
    let idx = config.attributeConfig.productAttributeKeys.map((obj:ProductAttributeKey) => obj.keySupplier).indexOf(keySupplier);
    config.attributeConfig.productAttributeKeys.splice(idx, 1);
    table.renderRows()
  }

  onSelectRow(row: any, i:any, config:any) {
    if (config) {
      let at = new Attribute()
      at.nameAttribute = config.attributeConfig.productAttributeKeys[i].attributeBDName
      this.selectedAttr = at;
      this.attributeListCtrl.setValue(this.selectedAttr);
    }
    this.attrSelectedRow = row;
    this.attrSelectedRow.id = i;
  }

  displayFn(attr: Attribute): string {
    let res = attr && attr.nameAttribute
    if (attr?.etimFeature && attr?.supplierName) {res += " [" + attr?.etimFeature + "] от " + attr?.supplierName}
    return res
  }

  onDBAttrSelected() {
    this.selectedAttr = this.attributeListCtrl.value as Attribute;
  }

  updateSelectedSuppAttr(i: number, row: any, config:any) {
    //validation
    // Add our value
    const idx = config.attributeConfig.productAttributeKeys.indexOf(row.attributeIdBD);
    if (row.keySupplier == null && idx != i) {
      return;
    }
    //update
    this.attrSelectedRow.nameAttribute = (this.attributeListCtrl.value as Attribute).nameAttribute;
    this.attrSelectedRow.id = config.attributeConfig.productAttributeKeys.length;
    this.attrSelectedRow.attributeBDName = this.selectedAttr?.nameAttribute;
    this.attrSelectedRow.attributeValid = true;
    config.attributeConfig.productAttributeKeys[i] = this.attrSelectedRow;
    this.selectedAttr = null
    //prepare for refresh
    this.clearAttrSelection();
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
    if (supplier.id == undefined || supplier.id == null) {
      this.api.insertSupplier(supplier).subscribe( x => {
          this._notyf.onSuccess("Конфигурация добавлена");
          for (let i of this.attributesToAdd) {
            i.supplierId = x.body
            i.supplierName = this.supplier.supplierName
            this.api.updateAttribute(i).subscribe()
          }
          this.router.navigate([`supplier-edit/${x.body}`])
        },
        error => {
          this._notyf.onError("Ошибка: " + JSON.stringify(error));
        });
    } else {
      this.api.updateSupplier(supplier).subscribe( x => {
          this._notyf.onSuccess("Конфигурация сохранена");
          for (let i of this.attributesToAdd) {
            i.supplierId = this.supplier.id
            i.supplierName = this.supplier.supplierName
            this.api.updateAttribute(i).subscribe()
          }
        },
        error => {
          this._notyf.onError("Ошибка: " + JSON.stringify(error));
        });
    }
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
