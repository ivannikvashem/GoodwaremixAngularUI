import {Component, Inject, OnInit} from '@angular/core';
import {Attribute} from "../../../models/attribute.model";
import {FormControl, Validators} from "@angular/forms";
import {ApiClient} from "../../../service/httpClient";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {debounceTime, distinctUntilChanged, switchMap, tap} from "rxjs";
import {UnitConverter} from "../../../models/unitConverter.model";
import {AttributesDataSource} from "../../../attribute/repo/AttributesDataSource";
import {UnitConvertersDataSource} from "../../../unit-converter/repo/UnitConvertersDataSource";

@Component({
  selector: 'app-swap-attribute',
  templateUrl: './swap-attribute.component.html',
  styleUrls: ['./swap-attribute.component.css']
})

export class SwapAttributeComponent implements OnInit {
  attributes: Array<Attribute> = new Array<Attribute>;
  attribute: Attribute = new Attribute;
  searchAttributeCtrl = new FormControl<string | Attribute>('', Validators.required);
  unitConverterListCtrl = new FormControl<string | UnitConverter>('');
  public unitConverterList: UnitConverter[] | undefined;


  constructor(public api: ApiClient,
              public dialogRef: MatDialogRef<SwapAttributeComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: any, private attributeDS:AttributesDataSource, private unitConverterDS: UnitConvertersDataSource) { }

  ngOnInit(): void {
    this.attributeDS.getAttributeById(this.data.oldAttributeId).subscribe((response) => {
      this.attribute = response.body;
    });
    this.data.newAttribute.supplierName = this.data.oldAttribute;

    this.searchAttributeCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(100),
      tap(() => {
        // this.isLoading = true;
      }),
      switchMap(value => this.attributeDS.loadAutocompleteData(value.toString(), '' ,1, 500, "rating", "desc", null)
      )
    ).subscribe((response: Attribute[]) => {
      this.attributes = response;
    });

    this.unitConverterListCtrl.valueChanges.pipe(
      debounceTime(100),
      switchMap(value => this.unitConverterDS.loadPagedData(value.toString(), 0, 100))
    ).subscribe((data: any) => {
      this.unitConverterList = data.body.data;
    });
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

  onUnitConverterSelected(unit: any) {
    this.data.newAttribute.convertId = unit.option.value.id;
  }

  displayFnUnit(unit: UnitConverter): string {
    return unit && unit.multiplier + ' ' +  unit.sourceUnit + ' --> ' + unit.targetUnit
  }
}
