import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../models/product.model";
import {ImagePreviewDialogComponent} from "../image-preview-dialog/image-preview-dialog.component";
import {MissingImageHandler} from "../MissingImageHandler";
import {MatDialog} from "@angular/material/dialog";
import {NotificationService} from "../../service/notification-service";
import {Router} from "@angular/router";
import {Clipboard} from "@angular/cdk/clipboard";
import {DataStateService} from "../../shared/data-state.service";

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {

  hoverImage: string = "";
  hoverRowId: string = "";
  mouseOver:boolean = false;
  isImageLoaded:boolean = false;
  selected:boolean = false;
  @Input() product:Product
  constructor(
    private imgHandler:MissingImageHandler,
    public dialog: MatDialog,
    public router: Router,
    public _notyf: NotificationService,
    private clipboard:Clipboard,
    private dss: DataStateService
  ) { }

  ngOnInit(): void {
    this.dss.selectedProductsState.subscribe(selection => {
      this.selected = !!selection.find(item => item.id === this.product.id);
    })
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

  copyString(stringToCopy: string) {
    this.clipboard.copy(stringToCopy)
    this._notyf.onSuccess('Скопировано')
  }

  goToEditItem(id:string) {
    this.router.navigate([`product-edit/${id}`]);
  }

  imageLoaded(loadState: boolean) {
    this.isImageLoaded = loadState
  }

  onChecked(checkState:any) {
    if (checkState.checked) {
      this.dss.setSelectedProduct({id:this.product.id, vendorId:this.product.vendorId})
    } else {
      this.dss.removeSelectedProduct(this.product.id)
    }
  }
}
