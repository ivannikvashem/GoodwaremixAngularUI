import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ImagePreviewDialogData} from "../models/ImagePreviewDialogData";
import {MissingImageHandler} from "../MissingImageHandler";

@Component({
  selector: 'app-image-preview-dialog',
  templateUrl: './image-preview-dialog.component.html',
  styleUrls: ['./image-preview-dialog.component.css']
})
export class ImagePreviewDialogComponent{

  imageIndex:number = 0;
  imgList:string[];
  selectedImage:string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ImagePreviewDialogData, private imgHandler:MissingImageHandler) {
    this.selectedImage = this.data.imgList[this.data.selectedIndex]
    this.imageIndex = this.data.selectedIndex;
    this.imgList = this.data.imgList;

    document.onkeydown = (keyEvent:any) => {
      if (keyEvent.keyCode === 37 || keyEvent.keyCode === 65) {
        this.slideImage(this.imageIndex - 1);
      } else if (keyEvent.keyCode === 39 || keyEvent.keyCode === 68) {
        this.slideImage(this.imageIndex + 1);
      }
    };
  }
  handleMissingImage($event: Event) {
    this.imgHandler.checkImgStatus($event)
  }

  slideImage(index: number) {
    if (index >= 0 && index <= this.imgList.length - 1) {
      this.imageIndex = index;
      this.selectedImage = this.imgList[index];
    }
  }
}
