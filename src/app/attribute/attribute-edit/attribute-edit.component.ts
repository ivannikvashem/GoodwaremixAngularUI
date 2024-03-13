import { Component, OnInit } from '@angular/core';
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Attribute} from "../../models/attribute.model";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, map} from "rxjs/operators";
import {BehaviorSubject, of} from "rxjs";
import {Supplier} from "../../models/supplier.model";
import {NotificationService} from "../../service/notification-service";
import {DataStateService} from "../../shared/data-state.service";
import {Title} from "@angular/platform-browser";
import {AttributesDataSource} from "../repo/AttributesDataSource";

interface AttributeType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-attribute-edit',
  templateUrl: './attribute-edit.component.html',
  styleUrls: ['./attribute-edit.component.scss']
})
export class AttributeEditComponent implements OnInit {

  public selectedSupplier:Supplier
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading:boolean = false;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  id: string | null | undefined;
  attribute: Attribute = new Attribute();
  attrType: AttributeType[] = [
    {value: 'L', viewValue: 'Бинарный'},
    {value: 'N', viewValue: 'Числовой'},
    {value: 'R', viewValue: 'Числовой диапазон'},
    {value: 'A', viewValue: 'Текстовый'},
  ];

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private router: Router,
    private _notyf: NotificationService,
    private dss:DataStateService,
    private attributeDS: AttributesDataSource,
    private titleService:Title) {}

  ngOnInit(): void {
    this.id = this._ActivatedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      this.loadingSubject.next(true)
      this.attributeDS.getAttributeById(this.id ?? "")
        .pipe(
          map(res => {
            return res.body;
          }),
          catchError(() => of([])),
          finalize(() => this.loadingSubject.next(false))
        )
        .subscribe({next: (data) => {
            this.attribute = data;
            this.dss.setSelectedSupplier(this.attribute.supplierId, this.attribute.supplierName)
            this.titleService.setTitle('Атрибут - ' + this.attribute.nameAttribute);
          }, error: () => {
            this.router.navigate(['page-not-found'])
          }});
    } else {
      this.attribute.rating = 0;
    }

    this.loadingSubject.subscribe(x => {
      this.isLoading = x;
    })
  }

  addPossibleValue(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const idx = this.attribute?.allValues?.indexOf(value);
    if (value && idx === -1) {
      this.attribute?.allValues?.push(value);
    }
    event.chipInput!.clear();
  }

  removePossibleValue(value: string): void {
    const index = this.attribute?.allValues?.indexOf(value);
    if (typeof (index) == "number" && index >= 0) {
      this.attribute?.allValues?.splice(index, 1);
    }
  }

  addPossibleName(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const idx = this.attribute?.altValues?.indexOf(value);
    if (value && idx === -1) {
      this.attribute?.altValues?.push(value);
    }
    event.chipInput!.clear();
  }

  removePossibleName(value: string): void {
    const index = this.attribute?.altValues?.indexOf(value);
    if (typeof (index) == "number" && index >= 0) {
      this.attribute?.altValues?.splice(index, 1);
    }
  }

  displayFn(supplier: Supplier): string {
    return supplier && supplier.supplierName ? supplier.supplierName : '';
  }

  saveAttribute() {
    if (!this.attribute.supplierId) {
      this._notyf.onWarning('Выберите поставщика')
      return;
    }
    if (!this.attribute.supplierId) {
      this.attribute.supplierId = this.selectedSupplier.id
      this.attribute.supplierName = this.selectedSupplier.supplierName
    }
    if (this.attribute.id == undefined) {
      this.attributeDS.insertAttribute(this.attribute).subscribe( {
        next:() => {
          this._notyf.onSuccess('Успешно добавлено')
        },
        error:ex => {
          this._notyf.onError('Ошибка ' + ex.error)
        }})
    } else {
      this.attributeDS.updateAttribute(this.attribute).subscribe( {
        next:() => {
          this._notyf.onSuccess('Успешно сохранено')
        },
        error:ex => {
          this._notyf.onError('Ошибка ' + ex.error)
        }})
    }
  }

  handleChangeSelectedSupplier(supplier: Supplier) {
    this.selectedSupplier = supplier;
    this.attribute.supplierId = supplier.id;
    this.attribute.supplierName = supplier.supplierName;
  }
}
