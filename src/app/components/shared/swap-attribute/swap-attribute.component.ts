import {Component, Inject, OnInit} from '@angular/core';
import {Attribute} from "../../../models/attribute.model";
import {FormControl, Validators} from "@angular/forms";
import {ApiClient} from "../../../service/httpClient";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {debounceTime, distinctUntilChanged, finalize, switchMap, tap} from "rxjs";
import {AttrDialogData} from "../../../attribute/attribute-index/attribute-index.component";

@Component({
  selector: 'app-swap-attribute',
  templateUrl: './swap-attribute.component.html',
  styleUrls: ['./swap-attribute.component.css']
})

export class SwapAttributeComponent implements OnInit {
  attributes: Array<Attribute> = new Array<Attribute>;
  attribute: Attribute = new Attribute;
  searchAttributeCtrl = new FormControl<string | Attribute>('', Validators.required);

  constructor(public api: ApiClient,
              public dialogRef: MatDialogRef<SwapAttributeComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: AttrDialogData,) { }

  ngOnInit(): void {
    this.api.getAttributeById(this.data.oldAttributeId).subscribe((response) => {
      this.attribute = response.body;
    });
    this.data.newAttribute.supplierName = this.data.oldAttribute;

    this.searchAttributeCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(100),
      tap(() => {
        // this.isLoading = true;
      }),
      switchMap(value => this.api.getAttributes(value, '' ,0, 10, undefined, "Rating", "desc")
        .pipe(
          finalize(() => {
            //this.isLoading = false
          }),
        )
      )
    ).subscribe((response: any) => { this.attributes = response.body.data; });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  diaplayFn(attribute: Attribute): string {
    return attribute && attribute.nameAttribute ? attribute.nameAttribute : '';
  }

  onAttributeSelected() {
    this.data.newAttribute = this.searchAttributeCtrl.value as Attribute;
  }
}
