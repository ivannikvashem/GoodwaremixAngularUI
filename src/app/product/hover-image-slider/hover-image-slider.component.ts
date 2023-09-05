import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {MissingImageHandler} from "../MissingImageHandler";
import {ImagePreviewDialogData} from "../models/ImagePreviewDialogData";

@Component({
  selector: 'app-hover-image-slider',
  templateUrl: './hover-image-slider.component.html',
  styleUrls: ['./hover-image-slider.component.css']
})
export class HoverImageSliderComponent implements OnInit {

  hoverImage = "";
  hoverRowId = "";
  imgIndex:number = 0;
  onHover:boolean = false;

  @Input() imgList:any = [];
  @Input() imgListThumb:any = [];
  @Output() onLoad = new EventEmitter<boolean>();

  constructor(
    public dialog: MatDialog,
    private imgHandler:MissingImageHandler
    ) { }

  ngOnInit(): void {
    this.hoverImage = this.imgListThumb?.length > 0 ? this.imgListThumb[0] : (this.imgList?.length > 0 ? this.imgList[0] : null);
  }

  changeImage(image: any, index:number) {
    this.imgIndex = index;
    this.hoverImage = image;
  }
  openDialog(image: string) {
    let img;
    img = typeof image === "object" ? img = image[0] : img = image;

    let dialogBoxSettings = {
      margin: '0 auto',
      hasBackdrop: true,
      data: { src: img }
    };
    this.dialog.open(ImageDialog, dialogBoxSettings);
  }

  handleMissingImage($event: Event) {
    this.imgHandler.checkImgStatus($event)
    this.onLoad.emit(true)
  }

  onImageLoaded() {
    this.onLoad.emit(true)
  }

  slideImage(index: number) {
    if (index >= 0) {
      this.imgIndex = index;
      this.changeImage([this.imgListThumb[index]], index);
    }
  }
}
@Component({
  selector: 'image-data-dialog',
  template: `
    <img (error)="handleMissingImage($event)" style="max-width: 800px;  max-height: 800px;" src='{{data.src}}'>`
})
export class ImageDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ImagePreviewDialogData, private imgHandler:MissingImageHandler) {}

  handleMissingImage($event: Event) {
    this.imgHandler.checkImgStatus($event)
  }
}
