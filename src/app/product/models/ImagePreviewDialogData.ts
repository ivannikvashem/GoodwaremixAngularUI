import {Inject} from "@angular/core";
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from "@angular/material/legacy-dialog";
import {MissingImageHandler} from "../MissingImageHandler";

export interface ImagePreviewDialogData {
  selectedIndex:number;
  imgList:string[]
}
export class DialogDataDialog {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ImagePreviewDialogData, private imgHandler:MissingImageHandler) {}

  handleMissingImage($event: Event) {
    this.imgHandler.checkImgStatus($event)
  }
}
