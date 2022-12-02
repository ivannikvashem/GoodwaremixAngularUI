import {Component, Inject, Input, OnInit} from '@angular/core';
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

  @Input() imgList:any = [];
  constructor(
    public dialog: MatDialog,
    private imgHandler:MissingImageHandler
    ) { }

  ngOnInit(): void {
    if (this.imgList.length > 0) {
      this.hoverImage = this.imgList[0];
    }
  }

  changeImage(image: any) {
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
    this.dialog.open(ImageDialog, dialogBoxSettings);
  }

  handleMissingImage($event: Event) {
    this.imgHandler.checkImgStatus($event)
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
