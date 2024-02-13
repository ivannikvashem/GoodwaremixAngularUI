import { Component, OnInit } from '@angular/core';
import {DataStateService} from "../../shared/data-state.service";
import {MatDialog} from "@angular/material/dialog";
import {Product} from "../../models/product.model";
import {MissingImageHandler} from "../MissingImageHandler";

@Component({
  selector: 'app-product-selected-list',
  templateUrl: './product-selected-list.component.html',
  styleUrls: ['./product-selected-list.component.scss']
})
export class ProductSelectedListComponent implements OnInit {

  selectedItems:any[] = []

  constructor(private dss:DataStateService, public dialog: MatDialog, private imgHandler:MissingImageHandler) { }

  ngOnInit(): void {
    this.dss.getSelectedProducts().subscribe((selection:Product[]) => {
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
    this.dss.clearSelectedProducts()
  }

  handleMissingImage($event: ErrorEvent) {
    this.imgHandler.checkImgStatus($event)
  }
}
