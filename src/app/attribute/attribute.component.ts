import { Component, OnInit } from '@angular/core';
import {DatastateService} from "../shared/datastate.service";
import {Supplier} from "../models/supplier.model";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.css']
})
export class AttributeComponent implements OnInit {

  pageTitle:string = 'AttributeIndex'
  selectedSupplier: Supplier;
  searchQueryCtrl  = new FormControl<string>('');
  searchQuery:string = '';
  attributeFixedFilterState: boolean | null = null;

  private subscription: any;

  constructor(private dss: DatastateService) { }

  ngOnInit(): void {
    this.dss.selectedSupplierState.subscribe(x => {
      this.selectedSupplier = x;
    });

    this.subscription = this.dss.selectedSupplierState.subscribe(
      id => {
        console.log('sup from dss', id)
        this.selectedSupplier = id;
      }
    )
  }

  handleChangeSelectedSupplier(supplier: Supplier) {
    this.dss.setSelectedSupplier(supplier.id, supplier.supplierName)
  }

  searchQueryChanged() {
    this.searchQuery = this.searchQueryCtrl.value
  }

  searchQueryClear() {
    this.searchQueryCtrl.setValue('');
    this.searchQuery = ''
  }

  onAttributeStateFilterChanged($event: boolean) {
    this.attributeFixedFilterState = $event;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); //crutch to dispose subs
  }
}
