import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {DialogData} from "../../product-index/product-index.component";
import {Package} from "../../../models/package.model";

@Component({
  selector: 'app-hover-image-slider',
  templateUrl: './hover-image-slider.component.html',
  styleUrls: ['./hover-image-slider.component.css']
})
export class HoverImageSliderComponent implements OnInit {

  hoverImage = "";
  hoverRowId = "";

  @Input() imgList = [];

  constructor(
    public dialog: MatDialog,
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
    console.log(image);
    let dialogBoxSettings = {
      maxWidth: '60%',
      margin: '0 auto',
      hasBackdrop: true,
      data: {
        src: image.replace("", ""),
      }
    };
    this.dialog.open(DialogDataExampleDialog2, dialogBoxSettings);
  }
}
@Component({
  selector: 'dialog-data-example-dialog',
  template: `
    <!--<img style="max-width: 800px;  max-height: 800px;" src='{{data.src}}'>-->
    <img style="max-width: 95%;  max-height: 95%; margin: 0 auto; display: flex" src='{{data.src}}'>
`
})
export class DialogDataExampleDialog2 {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
