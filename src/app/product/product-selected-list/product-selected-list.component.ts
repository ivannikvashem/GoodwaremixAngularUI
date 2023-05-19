import { Component, OnInit } from '@angular/core';
import {DataStateService} from "../../shared/data-state.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-product-selected-list',
  templateUrl: './product-selected-list.component.html',
  styleUrls: ['./product-selected-list.component.css']
})
export class ProductSelectedListComponent implements OnInit {

  selectedItems:any[] = []

  constructor(private dss:DataStateService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.dss.selectedProductsState.subscribe(selection => {
      this.selectedItems = selection;
      if (selection.length == 0) {
        this.dialog.closeAll()
      }
    })
  }

  deleteSelectItem(id:string) {
    this.dss.removeSelectedProduct(id)
  }

  clearAll() {
    this.dss.clearSelectProducts()
  }
}
