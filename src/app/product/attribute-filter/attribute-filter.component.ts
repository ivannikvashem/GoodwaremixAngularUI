import {Component, Inject, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Attribute} from "../../models/attribute.model";
import {debounceTime, distinctUntilChanged, finalize, Observable, switchMap, tap} from "rxjs";
import {ApiClient} from "../../service/httpClient";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";


export class SelectedFilterAttributes {
  attributeId:string;
  type:string;
  attributeValues:string[] = []
}

export class SelectedFilterAttributes1 {
  attributeSearchFilters:SelectedFilterAttributes[] = [];
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
  selectedFilterAttributes:SelectedFilterAttributes[] = []
  filteredAttributeValues: Observable<string[]>;


  selectedAttributes: SelectedFilterAttributes1 = new SelectedFilterAttributes1()

  constructor(private api:ApiClient, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AttributeFilterComponent>) { }

  ngOnInit(): void {
    if (this.data.filter.attributeSearchFilters.length > 0) {
      console.log('push i guess')
      console.log('push i guess', this.data.filter.attributeSearchFilters)
      this.selectedAttributes.attributeSearchFilters = this.data.filter.attributeSearchFilters
    }

    this.dialogRef.backdropClick().subscribe(x => {
      this.dialogRef.close(this.selectedAttributes)
    })


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
      console.log(response)
    });
  }

 /* filtrationSearch(filterSearch: HTMLInputElement, attributeId:string) {
     this.attributesForFilter.find(attr => attr.id === attributeId).allValues = this.attributesForFilter.allValues.filter((value:any) => {
       return value.toLowerCase().includes(filterSearch.value.toLowerCase())
     })
  }
*/
   attributeValueChecked($event: any,attributeId: string, value: string) {
     if ($event.checked == true) {
       if (this.selectedAttributes.attributeSearchFilters.some(n => n.attributeId === attributeId)) {
         this.selectedAttributes.attributeSearchFilters.forEach(att => {
           if (att.attributeId == attributeId && !att.attributeValues.includes(value)) {
             att.attributeValues.push(value)
           }
         })
       }
     } else {
       if (this.selectedAttributes.attributeSearchFilters.some(n => n.attributeId === attributeId)) {
         this.selectedAttributes.attributeSearchFilters.forEach(att => {
           if (att.attributeId == attributeId) {
             att.attributeValues = att.attributeValues.filter(x => x !== value)
           }
         })
       }
     }
   }

  onAttributeValueSelected() {
    this.selectedAttributes.attributeSearchFilters.push({attributeId: (this.attributeValueFilterCtrl.value as Attribute).id, type: (this.attributeValueFilterCtrl.value as Attribute).type, attributeValues: []});
    this.attributesForFilter.push(this.attributeValueFilterCtrl.value as Attribute);
  }

  applyFilter() {
    for (let i of this.attributesForFilter) {
      let obj = new SelectedFilterAttributes()
      obj.attributeId = i.nameAttribute;
      obj.type = i.type;

      this.selectedAttributes.attributeSearchFilters.push(obj)
    }
  }

  displayFn(attribute: Attribute): string {
    return attribute && attribute.nameAttribute ? attribute.nameAttribute : '';
  }

  removeFilter(i: number) {
    this.attributesForFilter.splice(i, 1);
    this.selectedAttributes.attributeSearchFilters.splice(i, 1)
  }

  addRangeValues(min: string, max: string, nameAttribute: string) {
    let arr = [min,max]
    console.log(arr)
    this.selectedAttributes.attributeSearchFilters.find(x => x.attributeId == nameAttribute).attributeValues.push(min, max)
    //this.selectedAttributes.attributeSearchFilters.find(x => x.{attributeName: (this.attributeValueFilterCtrl.value as Attribute).nameAttribute, type: (this.attributeValueFilterCtrl.value as Attribute).type, attributeValues: []});
  }

  addNumberValue(value: string, nameAttribute:string) {
    this.selectedAttributes.attributeSearchFilters.find(x => x.attributeId == nameAttribute).attributeValues.push(value)

  }
}
