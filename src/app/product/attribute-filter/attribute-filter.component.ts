import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {Attribute} from "../../models/attribute.model";
import {Observable} from "rxjs";

export class SelectedFilterAttributes {
  attributeName:string
  selectedValues:string[] = []
}

@Component({
  selector: 'app-attribute-filter',
  templateUrl: './attribute-filter.component.html',
  styleUrls: ['./attribute-filter.component.css']
})
export class AttributeFilterComponent implements OnInit {

  attributeValueFilterCtrl = new FormControl('');
  attributesForFilter:Attribute[]
  selectedFilterAttributes:SelectedFilterAttributes[] = []
  filteredAttributeValues: Observable<string[]>;

  constructor() { }

  ngOnInit(): void {
  }

  // filtrationSearch(filterSearch: HTMLInputElement, attributeId:string) {
  //   this.api.getAttributeById(attributeId).subscribe((r:any) => {
  //     this.attributesForFilter.find(attr => attr.id === attributeId).allValue = r.body.allValue.filter((value:any) => {
  //       return value.toLowerCase().includes(filterSearch.value.toLowerCase())
  //     })
  //   })
  // }
  //
  // attributeValueChecked($event: any,nameAttribute: string, value: string) {
  //   console.log($event.source._selected)
  //   const isChecked = $event.source._selected
  //   const selectedAttribute:SelectedFilterAttributes = new SelectedFilterAttributes()
  //   if (isChecked) {
  //     if (this.selectedFilterAttributes.some(n => n.attributeName === nameAttribute)) {
  //       this.selectedFilterAttributes.forEach(att => {
  //         if (att.attributeName == nameAttribute) {
  //           att.selectedValues.push(value)
  //         }
  //       })
  //     }
  //     else {
  //       selectedAttribute.attributeName = nameAttribute
  //       selectedAttribute.selectedValues.push(value)
  //       this.selectedFilterAttributes.push(selectedAttribute)
  //     }
  //   }
  //   else {
  //
  //   }
  //
  //   this.onQueryChanged();
  //   console.log('selected', selectedAttribute)
  //   console.log('selected list',this.selectedFilterAttributes)
  // }
}
