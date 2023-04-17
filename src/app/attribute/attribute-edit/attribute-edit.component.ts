import { Component, OnInit } from '@angular/core';
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Attribute} from "../../models/attribute.model";
import {ApiClient} from "../../service/httpClient";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, map} from "rxjs/operators";
import {BehaviorSubject, of} from "rxjs";
import {Supplier} from "../../models/supplier.model";
import {NotificationService} from "../../service/notification-service";

interface AttributeType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-attribute-edit',
  templateUrl: './attribute-edit.component.html',
  styleUrls: ['./attribute-edit.component.css']
})
export class AttributeEditComponent implements OnInit {

  public selectedSupplier:Supplier
  private loadingSubject = new BehaviorSubject<boolean>(true);
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
    public api: ApiClient,
    private _ActivatedRoute: ActivatedRoute,
    private router: Router,
    private _notyf: NotificationService
  ) {}

  ngOnInit(): void {
    this.id = this._ActivatedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      this.api.getAttributeById(this.id ?? "")
        .pipe(
          map(res => {
            return res.body;
          }),
          catchError(() => of([])),
          finalize(() => this.loadingSubject.next(false))
        )
        .subscribe({next: (data) => {
            this.attribute = data;
          }, error: () => {
            this.router.navigate(['page-not-found'])
          }});
    } else {
      this.attribute.rating = 0;
    }
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
      this.attribute.supplierId = this.selectedSupplier.id
      this.attribute.supplierName = this.selectedSupplier.supplierName
    }
    if (this.attribute.id == undefined) {
      this.api.insertAttribute(this.attribute).subscribe( {
        next:() => {
          this._notyf.onSuccess('Успешно добавлено')
        },
        error:ex => {
          this._notyf.onError('Ошибка ' + ex.error)
        }})
    } else {
      this.api.updateAttribute(this.attribute).subscribe( {
        next:() => {
          this._notyf.onSuccess('Успешно сохранено')
        },
        error:ex => {
          this._notyf.onError('Ошибка ' + ex.error)
        }})
    }
  }

  handleChangeSelectedSupplier(supplier: Supplier) {
    this.selectedSupplier = supplier
  }
}
