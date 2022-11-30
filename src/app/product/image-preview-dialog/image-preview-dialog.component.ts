import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ImagePreviewDialogData} from "../models/ImagePreviewDialogData";
import {MissingImageHandler} from "../MissingImageHandler";

@Component({
  selector: 'app-image-preview-dialog',
  template: `
    <img (error)="handleMissingImage($event)" style="max-width: 800px;  max-height: 800px;" src='{{data.src}}'>
`
})
export class ImagePreviewDialogComponent{

  constructor(@Inject(MAT_DIALOG_DATA) public data: ImagePreviewDialogData, private imgHandler:MissingImageHandler) {}

  handleMissingImage($event: Event) {
    this.imgHandler.checkImgStatus($event)
  }
}
