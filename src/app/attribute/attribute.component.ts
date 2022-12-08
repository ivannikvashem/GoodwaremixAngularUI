import { Component, OnInit } from '@angular/core';
import {DataStateService} from "../shared/data-state.service";
import {Supplier} from "../models/supplier.model";
import {FormControl} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.css']
})
export class AttributeComponent implements OnInit {

  pageTitle:string = 'AttributeIndex'
  selectedSupplier: Supplier;
  searchQueryCtrl  = new FormControl<string>('');
  searchQuery: string = '';
  attributeFixedFilterState: boolean | null = null;

  private subscription: Subscription;

  constructor(private dss: DataStateService) { }

  ngOnInit(): void {
    this.subscription = this.dss.selectedSupplierState.subscribe(
      supplier => {
        console.log('sup from dss', supplier)
        this.selectedSupplier = supplier;
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
    this.subscription.unsubscribe();
  }
}
