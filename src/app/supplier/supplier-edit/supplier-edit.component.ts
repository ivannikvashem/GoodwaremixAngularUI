import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {Supplier, SupplierConfig} from "../../models/supplier.model";
import {ApiClient} from "../../service/httpClient";
import {ProductAttributeKey} from "../../models/productAttributeKey.model";
import { Attribute } from 'src/app/models/attribute.model';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {BehaviorSubject} from "rxjs";
import {finalize} from "rxjs/operators";
import {NotificationService} from "../../service/notification-service";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent, ConfirmDialogModel} from "../../components/shared/confirm-dialog/confirm-dialog.component";

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
  dataToDisplay: any = [];
  selectedConfig = new FormControl(0)
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading: boolean = false;

  public attributeList: Attribute[] | undefined;
  attributesToAdd: Attribute[] = []
  headerTableColumns: string[] = ['headerKey', 'headerValue', 'headerAction'];

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private router: Router,
    private _notyf: NotificationService,
    public dialog: MatDialog,
    public api: ApiClient,
  ) {
  }

  ngOnInit(): void {
    this.supplierId = this._ActivatedRoute.snapshot.paramMap.get("supplierId");
    if (this.supplierId) {
      this.loadingSubject.next(true)
      this.api.getSupplierById(this.supplierId)
        .pipe(
          finalize(() => this.loadingSubject.next(false))
        ).subscribe({
        next: (s) => {
          this.supplier = s.body as Supplier;
          for (let config of this.supplier.supplierConfigs) {
            if (config.sourceSettings.header) {
              config.sourceSettings.header = JSON.parse(config.sourceSettings.header) as HeaderModel
            }
          }
        }, error: () => {
          this.router.navigate(['page-not-found'])
        }
      });
    }

    this.loadingSubject.subscribe(x => {
      this.isLoading = x;
    })
  }

  addDateFormat(event: MatChipInputEvent, config: any): void {
    const value = (event.value || '').trim();
    const idx = config.dateFormats?.indexOf(value);
    if (value && idx === -1) {
      config.dateFormats?.push(value);
    }
    event.chipInput!.clear();
  }

  removeDateFormat(date: string, config: any): void {
    const index = config.dateFormats?.indexOf(date);
    if (typeof (index) == "number" && index >= 0) {
      config.dateFormats?.splice(index, 1);
    }
  }

  submitSupplier() {
    let supplier = JSON.parse(JSON.stringify(this.supplier))

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

    if (supplier.id == undefined) {
      this.api.insertSupplier(supplier).subscribe(x => {
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
      this.api.updateSupplier(supplier).subscribe(() => {
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
  }

  addHeader(table: any, config: any) {
    if (config.sourceSettings.header == null) {
      config.sourceSettings.header = []
    }
    let newHeader = <HeaderModel>{HeaderName: '', HeaderValue: '', isEditable: true}
    config.sourceSettings.header.push(newHeader)
    table.renderRows()
  }

  deleteHeader(element: HeaderModel, config: any) {
    config.sourceSettings.header = config.sourceSettings.header.filter((value: any) => (value != element))
  }

  saveHeader(element: HeaderModel, config: any) {
    if (element.HeaderName != '' && element.HeaderValue != '')
      element.isEditable = false
    else
      this.deleteHeader(element, config)
  }

  addInn($event: MatChipInputEvent) {
    const value = ($event.value || '').trim();
    const idx = this.supplier.inn?.indexOf(value);
    if (value && idx === -1) {
      this.supplier.inn?.push(value);
    }
    $event.chipInput!.clear();
  }

  removeInn(inn: string) {
    const index = this.supplier.inn?.indexOf(inn);
    if (typeof (index) == "number" && index >= 0) {
      this.supplier.inn?.splice(index, 1);
    }
  }

  addBrand($event: MatChipInputEvent) {
    const value = ($event.value || '').trim();
    const idx = this.supplier.brands?.indexOf(value);
    if (value && idx === -1) {
      this.supplier.brands?.push(value);
    }
    $event.chipInput!.clear();
  }

  removeBrand(brand: string) {
    const index = this.supplier.brands?.indexOf(brand);
    if (typeof (index) == "number" && index >= 0) {
      this.supplier.brands?.splice(index, 1);
    }
  }

  addConfig() {
    const config = new SupplierConfig()
    this.supplier.supplierConfigs.push(config)
    this.selectedConfig.setValue(this.supplier.supplierConfigs.length - 1);
  }

  deleteConfig(value: any) {
    const message = `Удалить конфигурацию «` + value.name  + `»?`;
    const dialogData = new ConfirmDialogModel("Подтверждение", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: "400px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        const index = this.supplier.supplierConfigs?.indexOf(value);
        if (typeof (index) == "number" && index >= 0) {
          this.supplier.supplierConfigs?.splice(index, 1);
        }
        this.selectedConfig.setValue(this.supplier.supplierConfigs.length - 1);
      }
    });
  }

  fetchSupplierProducts() {
    this.api.fetchDataFromSupplier(this.supplier.id).subscribe(() => {
        this._notyf.onSuccess('Сбор данных ' + this.supplier.supplierName + ' начат')
      },
      err => {
        this._notyf.onError("Ошибка: " + JSON.stringify(err));
      })

    this.router.navigate(['suppliers'])
  }

  onDictionaryChanged(productAttributeKeys: ProductAttributeKey[], config: SupplierConfig) {
    config.attributeConfig.productAttributeKeys = productAttributeKeys
  }
}
