import {Component, Inject, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Attribute} from "../../models/attribute.model";
import {debounceTime, distinctUntilChanged, finalize, Observable, switchMap, tap} from "rxjs";
import {ApiClient} from "../../service/httpClient";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Category} from "../../models/category.model";

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
  styleUrls: ['./attribute-filter.component.scss']
})
export class AttributeFilterComponent implements OnInit {

  attributeValueFilterCtrl =  new FormControl<string | Attribute>(null);
  categoryValueFilterCtrl =  new FormControl<string | Category>(null);
  attributesList: Attribute[] = [];
  attributesForFilter:Attribute[] = []
  selectedFilterAttributes:SelectedFiltersList[] = []
  filteredAttributeValues: Observable<string[]>;
  private filterCaches = new Map<string, Map<string, string[]>>();
  withICFilter:boolean = false;
  isModerated:boolean = false;
  categoryList:Category[] = [];

  onFilterCancelData:string = '';
  isLoading:boolean;
  categoryId:number;
  selectedAttributes: SelectedFiltersList = new SelectedFiltersList()

  constructor(private api:ApiClient, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AttributeFilterComponent>) { }

  ngOnInit(): void {
    this.categoryId = this.data.categoryId;
    this.withICFilter = this.data.withICFilter;
    this.isModerated = this.data.isModerated;
    this.onFilterCancelData = JSON.stringify(this.data);
    if (this.data.filter.length > 0) {
      this.data = JSON.parse(this.data.filter)
    }
    if (this.categoryId) {
      this.api.getCategoryById(this.categoryId.toString()).subscribe((x:any) => {
        this.categoryValueFilterCtrl.setValue(x.body.result as Category)
      })
    }

    if (this.data.attributeSearchFilters?.length > 0) {
      this.isLoading = true;
      for (let i of this.data.attributeSearchFilters) {
        this.api.getAttributeById(i.attributeId).pipe(
          distinctUntilChanged(),
          debounceTime(100),
          tap(() => {
            this.isLoading = true;
          }),
          finalize( () => {
            this.isLoading = false;
          })
        ).subscribe(x => {
          this.attributesForFilter.push(x.body)
          this.selectedAttributes.attributeSearchFilters = this.data.attributeSearchFilters
        })
      }
    }
    this.attributeValueFilterCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(100),
      switchMap(value => this.api.getAttributes(value, '', 0, 100, undefined, "rating", "desc")
      )).subscribe((response: any) => {
      this.attributesList = response.body.data;
    });

    this.categoryValueFilterCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(100),
      switchMap(value => this.api.getCategories(value, 0, 100, undefined, "", "desc")
      )).subscribe((response: any) => {
      this.categoryList = response.body.data;
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

  onAttributeValueSelected(attribute: any) {
    const attributeId = (attribute.option.value as Attribute).id;
    if (!this.selectedAttributes.attributeSearchFilters.find(x => x.attributeId === attributeId)) {
      const newAttributeSearchFilter = {attributeId, type: (attribute.option.value as Attribute).type, attributeValues: [] as string[]};
      this.selectedAttributes.attributeSearchFilters = this.selectedAttributes.attributeSearchFilters.concat(newAttributeSearchFilter);
      this.attributesForFilter.push(this.attributeValueFilterCtrl.value as Attribute);
    }
  }

  displayFn(attribute: Attribute): string {
    return attribute && attribute.nameAttribute ? attribute.nameAttribute : '';
  }

  displayFnCategory(category: Category): string {
    return category && category.title;
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

  searchFilter(value: string, options: string[], field:string): string[] {
    const cache = this.getOrCreateCache(field);
    const cacheKey = value.toLowerCase();
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    const filterValue = cacheKey;
    const filteredOptions = options.filter(option => option.toLowerCase().includes(filterValue)).slice(0, 100)
      .sort((a, b) => a.localeCompare(b, undefined, {
        numeric: true,
        sensitivity: 'base',
        ignorePunctuation: true
      }));
    cache.set(cacheKey, filteredOptions);
    return filteredOptions;
  }

  private getOrCreateCache(key: string): Map<string, string[]> {
    let cache = this.filterCaches.get(key);
    if (!cache) {
      cache = new Map<string, string[]>();
      this.filterCaches.set(key, cache);
    }
    return cache;
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
    let filters = {selectedAttributes:this.selectedAttributes, withICFilter:this.withICFilter, isModerated: this.isModerated, categoryId: this.categoryId}
    this.dialogRef.close(filters)
  }

  onFilterCancel() {
    console.log(this.onFilterCancelData)
    this.dialogRef.close(this.onFilterCancelData.length > 0 ? JSON.parse(this.onFilterCancelData): {})
  }

  onICFilterChanged(state: boolean) {
    this.withICFilter = state;
  }

  onVerifiedChanged(state:boolean) {
    this.isModerated = state;
  }

  clearFilters() {
    this.dialogRef.close({isModerated: null, withICFilter: null, selectedAttributes:null});
  }

  onCategorySelected() {
    this.categoryId = +(this.categoryValueFilterCtrl.value as Category).id;
  }

  clearCategorySelection() {
    this.categoryValueFilterCtrl.setValue(null);
    this.categoryId = null;
  }
}
