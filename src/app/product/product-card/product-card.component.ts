import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../models/product.model";
import {ImagePreviewDialogComponent} from "../image-preview-dialog/image-preview-dialog.component";
import {MissingImageHandler} from "../MissingImageHandler";
import {MatDialog} from "@angular/material/dialog";
import {NotificationService} from "../../service/notification-service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {

  hoverImage: string = "";
  hoverRowId: string = "";
  mouseOver:boolean = false;
  @Input() product:Product
  constructor(
    private imgHandler:MissingImageHandler,
    public dialog: MatDialog,
    public router: Router,
    public _notyf: NotificationService
  ) { }

  ngOnInit(): void {
  }


  changeImage(row: any, image: any) {
    this.hoverRowId = row.id;
    this.hoverImage = image;
  }

  openDialog(image: string) {
    let dialogBoxSettings = {
      margin: '0 auto',
      hasBackdrop: true,
      data: {
        src: image.replace("", ""),
      }
    };
    this.dialog.open(ImagePreviewDialogComponent, dialogBoxSettings);
  }

  handleMissingImage($event: Event) {
    this.imgHandler.checkImgStatus($event);
  }

  copyVendorId(vendorId: string) {
    navigator.clipboard.writeText(vendorId);
    this._notyf.onSuccess('Артикул поставщика скопирован')
  }

  goToEditItem(id:string) {
    this.router.navigate([`product-edit/${id}`]);
  }
}
