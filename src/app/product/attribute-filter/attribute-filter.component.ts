import {Component, Inject, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Attribute} from "../../models/attribute.model";
import {debounceTime, distinctUntilChanged, finalize, Observable, of, switchMap, tap} from "rxjs";
import {ApiClient} from "../../service/httpClient";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";


export class Filter {
  attributeId:string;
  type:string;
  attributeValues:string[] = []
}

export class SelectedFiltersList {
  attributeSearchFilters:Filter[] = [];
}


@Component({
  selector: 'app-attribute-filter',
  templateUrl: './attribute-filter.component.html',
  styleUrls: ['./attribute-filter.component.css']
})
export class AttributeFilterComponent implements OnInit {

  attributeValueFilterCtrl =  new FormControl<string | Attribute>(null);
  attributesList: Attribute[] = [];

  attributesForFilter:Attribute[] = []
  selectedFilterAttributes:SelectedFiltersList[] = []
  filteredAttributeValues: Observable<string[]>;
  onFilterCancelData:string = '';

  selectedAttributes: SelectedFiltersList = new SelectedFiltersList()

  constructor(private api:ApiClient, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AttributeFilterComponent>) { }

  ngOnInit(): void {
    if (this.data.filter.attributeSearchFilters?.length > 0) {
      this.onFilterCancelData = JSON.stringify(this.data.filter);
      for (let i of this.data.filter.attributeSearchFilters) {
        this.api.getAttributeById(i.attributeId).subscribe(x => {
          this.attributesForFilter.push(x.body)
          this.selectedAttributes.attributeSearchFilters = this.data.filter.attributeSearchFilters
        })
      }
    }
    this.attributeValueFilterCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(100),
      tap(() => {
        // this.isLoading = true;
      }),
      switchMap(value => this.api.getAttributes(value, '', 0, 100, undefined, "rating", "desc")
        .pipe(
          finalize(() => {
            //this.isLoading = false
          }),
        )
      )
    ).subscribe((response: any) => {
      this.attributesList = response.body.data;
    });

    this.dialogRef.backdropClick().subscribe(() => {
      this.onFilterCancel();
    })
  }

   attributeAllValueSelected(value: string, attributeId: string) {
     let attribute = this.selectedAttributes.attributeSearchFilters.find(x => x.attributeId == attributeId).attributeValues.find(x => x == value)
     if (!attribute) {
       this.selectedAttributes.attributeSearchFilters.forEach(att => {
         if (att.attributeId == attributeId && !att.attributeValues.includes(value)) {
           att.attributeValues.push(value)
         }
       })
     }
   }

  onAttributeValueSelected(attribute:any) {
    if (!this.selectedAttributes.attributeSearchFilters.find(x => x.attributeId == (attribute.option.value as Attribute).id)) {
      this.selectedAttributes.attributeSearchFilters.push({attributeId: (attribute.option.value as Attribute).id, type: (attribute.option.value as Attribute).type, attributeValues: []});
      this.attributesForFilter.push(this.attributeValueFilterCtrl.value as Attribute);
    }
  }

  displayFn(attribute: Attribute): string {
    return attribute && attribute.nameAttribute ? attribute.nameAttribute : '';
  }

  removeFilter(i: number) {
    this.attributesForFilter.splice(i, 1);
    this.selectedAttributes.attributeSearchFilters.splice(i, 1)
  }

  addValue(id:string, valueOne:string, valueTwo?:string) {
    this.clearAllValue(id);
    this.selectedAttributes.attributeSearchFilters.find(x => x.attributeId == id).attributeValues.push(valueOne)
    if (valueTwo) {
      this.selectedAttributes.attributeSearchFilters.find(x => x.attributeId == id).attributeValues.push(valueTwo)
    }
  }

  selectedValues(id:string) {
     return this.selectedAttributes.attributeSearchFilters.find(x => x.attributeId == id)?.attributeValues;
  }

  removeSelectedValue(id: string, value: string) {
    this.selectedAttributes.attributeSearchFilters.find(x => x.attributeId == id).attributeValues = this.selectedAttributes.attributeSearchFilters.find(x => x.attributeId == id).attributeValues.filter(x => x !== value)
  }

  searchFilter(value: string, options: string[]): Observable<string[]> {
    const filterValue = value.toLowerCase();
    return of (options.filter(options => options.toLowerCase().includes(filterValue)).sort((a, b) => a.localeCompare(b, undefined, {
      numeric: true,
      sensitivity: 'base',
      ignorePunctuation: true
    })));
  }

  attributeAsync(attributes: Attribute[]) : Observable<Attribute[]> {
    return of (attributes)
  }

  clearAllValue(id:string) {
    this.selectedAttributes.attributeSearchFilters.find(x => x.attributeId == id).attributeValues = [];
  }

  onFilterApply() {
    for (let i of this.selectedAttributes.attributeSearchFilters) {
      if (i.attributeValues.length == 0) {
        this.selectedAttributes.attributeSearchFilters = this.selectedAttributes.attributeSearchFilters.filter(x => x.attributeId !== i.attributeId)
      }
    }
    this.dialogRef.close(this.selectedAttributes)
  }

  onFilterCancel() {
    this.dialogRef.close(this.onFilterCancelData.length > 0 ? JSON.parse(this.onFilterCancelData): {})
  }
}
