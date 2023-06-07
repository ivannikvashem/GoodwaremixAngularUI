import {Component, Inject, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Attribute} from "../../models/attribute.model";
import {debounceTime, distinctUntilChanged, finalize, Observable, switchMap, tap} from "rxjs";
import {ApiClient} from "../../service/httpClient";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";


export class SelectedFilterAttributes {
  attributeName:string;
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

  constructor(private api:ApiClient, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
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

  filtrationSearch(filterSearch: HTMLInputElement, attributeId:string) {
     this.api.getAttributeById(attributeId).subscribe((r:any) => {
       this.attributesForFilter.find(attr => attr.id === attributeId).allValues = r.body.allValue.filter((value:any) => {
         return value.toLowerCase().includes(filterSearch.value.toLowerCase())
       })
     })
  }

   attributeValueChecked($event: any,nameAttribute: string, value: string) {
     console.log($event.checked)
     const isChecked = $event.checked;

     if (isChecked == true) {
       if (this.selectedAttributes.attributeSearchFilters.some(n => n.attributeName === nameAttribute)) {

         this.selectedAttributes.attributeSearchFilters.forEach(att => {
           console.log(att)
           if (att.attributeName == nameAttribute && !att.attributeValues.includes(value)) {
             att.attributeValues.push(value)
           }
           /* if (att.nameAttribute == nameAttribute) {
              att.allValues.push(value)
            }*/
         })
       }
     }
     else {
       console.log('delete')
       if (this.selectedAttributes.attributeSearchFilters.some(n => n.attributeName === nameAttribute)) {

         this.selectedAttributes.attributeSearchFilters.forEach(att => {
           console.log(att)
           if (att.attributeName == nameAttribute) {
             att.attributeValues = att.attributeValues.filter(x => x !== value)
           }
           /* if (att.nameAttribute == nameAttribute) {
              att.allValues.push(value)
            }*/
         })
       }
     }



     console.log('selected list', this.selectedAttributes.attributeSearchFilters)
   }

  onAttributeValueSelected() {
    this.selectedAttributes.attributeSearchFilters.push({attributeName: (this.attributeValueFilterCtrl.value as Attribute).nameAttribute, type: (this.attributeValueFilterCtrl.value as Attribute).type, attributeValues: []});
    this.attributesForFilter.push(this.attributeValueFilterCtrl.value as Attribute);
  }

  applyFilter() {
    for (let i of this.attributesForFilter) {
      let obj = new SelectedFilterAttributes()
      obj.attributeName = i.nameAttribute;
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
}
