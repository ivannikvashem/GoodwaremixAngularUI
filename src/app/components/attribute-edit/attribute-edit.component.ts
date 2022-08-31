import { Component, OnInit } from '@angular/core';
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Attribute} from "../../models/attribute.model";
import {ApiClient} from "../../repo/httpClient";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, finalize, map} from "rxjs/operators";
import {BehaviorSubject, of, pipe} from "rxjs";

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

  private loadingSubject = new BehaviorSubject<boolean>(true);
  id: string | null | undefined;
  attribute: Attribute | undefined;
  attrType: AttributeType[] = [
    {value: 'L', viewValue: 'Бинарный'},
    {value: 'N', viewValue: 'Числовой'},
    {value: 'R', viewValue: 'Числовой диапазон'},
    {value: 'A', viewValue: 'Текстовый'},
  ];

  constructor(
    public api: ApiClient,
    private _ActivatedRoute:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = this._ActivatedRoute.snapshot.paramMap.get("id");
    this.api.getAttributeById(this.id ?? "")
    .pipe(
        map(res => {
          //this.rowCount = res.body.count;
          return res.body;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      //.subscribe(data => this.AttributeSubject.next(data));
      .subscribe(data => {
        this.attribute = data;
        console.log(JSON.stringify(data));
      });
  }

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    const idx = this.attribute?.allValue?.indexOf(value);
    if (value && idx === -1 ) {
      this.attribute?.allValue?.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(fruit: string): void {
    const index = this.attribute?.allValue?.indexOf(fruit);

    if (typeof(index) == "number" && index >= 0) {
      this.attribute?.allValue?.splice(index, 1);
    }
  }
}
