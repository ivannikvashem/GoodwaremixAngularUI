import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {MissingImageHandler} from "../MissingImageHandler";
import {ImagePreviewDialogComponent} from "../image-preview-dialog/image-preview-dialog.component";

@Component({
  selector: 'app-hover-image-slider',
  templateUrl: './hover-image-slider.component.html',
  styleUrls: ['./hover-image-slider.component.scss']
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
    if (image) {
      let selectedImageIndex;
      if (this.imgList?.length > 0) {
        selectedImageIndex = this.imgList.findIndex((x:any) => x === (typeof image === "object" ? image[0] : image))
      } else if (this.imgListThumb?.length > 0) {
        selectedImageIndex = this.imgListThumb.findIndex((x:any) => x === (typeof image === "object" ? image[0] : image))
      }
      let dialogBoxSettings = {
        hasBackdrop: true,
        maxHeight: '800px',
        backdropClass: 'dialog-dark-backdrop',
        data: { selectedIndex: selectedImageIndex, imgList: this.imgList?.length > 0 ? this.imgList : this.imgListThumb }
      };
      this.dialog.open(ImagePreviewDialogComponent, dialogBoxSettings);
    }
  }

  handleMissingImage($event: Event) {
    this.imgHandler.checkImgStatus($event)
    this.onLoad.emit(true)
  }

  onImageLoaded() {
    this.onLoad.emit(true)
  }

  slideImage(index: number) {
    if (index >= 0 || index <= this.imgList.length - 1) {
      if (this.imgList?.length >= 1) {
        this.changeImage([this.imgList[index]], index);
      } else {
        this.changeImage([this.imgListThumb[index]], index);
      }
    }
  }
}
