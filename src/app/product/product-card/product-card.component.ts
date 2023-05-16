import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Product} from "../../models/product.model";
import {ImagePreviewDialogComponent} from "../image-preview-dialog/image-preview-dialog.component";
import {MissingImageHandler} from "../MissingImageHandler";
import {MatDialog} from "@angular/material/dialog";
import {NotificationService} from "../../service/notification-service";
import {Router} from "@angular/router";
import {Clipboard} from "@angular/cdk/clipboard";
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from "../../components/shared/confirm-dialog/confirm-dialog.component";

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
  @Output() selectedProduct = new EventEmitter<any>();
  @Output() deletedProduct = new EventEmitter<any>();
  constructor(
    private imgHandler:MissingImageHandler,
    public dialog: MatDialog,
    public router: Router,
    public _notyf: NotificationService,
    private clipboard:Clipboard
  ) { }

  ngOnInit(): void {}

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

  confirmDeleteDialog(id: string, name: string): void {
    const message = `Удалить товар ` + name + `?`;
    const dialogData = new ConfirmDialogModel("Подтверждение", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: "300px",
      maxWidth: "500px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deletedProduct.emit(id);
      }
    });
  }

  onChecked() {
    this.selectedProduct.emit({id:this.product.id, isSelected:this.selected} )
  }
}
