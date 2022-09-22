import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiClient} from "../../repo/httpClient";
import {Observable} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {Product} from "../../models/product.model";
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {SwapAttributeComponent} from "../shared/swap-attribute/swap-attribute.component";
import {Attribute} from "../../models/attribute.model";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NotificationService} from "../../service/notification-service";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})

export class ProductDetailsComponent implements OnInit {

  productId: string | any;
  product: Observable<Product> | any;

  displayedAttrColumns: string[] = ['name', 'value','unit','etim', 'action'];
  dataSource = new MatTableDataSource();
  safeVideoUrl: SafeResourceUrl;
  safeImg360Url: SafeResourceUrl | undefined
  safeImg360Test:any

  constructor(
    private api: ApiClient,
    private router: Router,
    public dialog: MatDialog,
    private _ActivatedRoute:ActivatedRoute,
    private _sanitizer: DomSanitizer,
    private _notyf: NotificationService
  ) { }

  ngOnInit(): void {
    this.productId = this._ActivatedRoute.snapshot.paramMap.get("id");
    this.api.getProductById(this.productId).subscribe(
      data => {
        this.product = data.body;
        if (this.product.videos.length > 0)
          this.safeVideoUrl = this._sanitizer.bypassSecurityTrustResourceUrl(this.product.videos[0]);
        this.dataSource = new MatTableDataSource(this.product.attributes);
        this.safeImg360Url = this._sanitizer.bypassSecurityTrustResourceUrl(this.product.image360)
        this.safeImg360Test = this._sanitizer.bypassSecurityTrustResourceUrl('https://api.systeme.ru/player/embed?ref=14910')
        console.log('360img',this.safeImg360Url)
        console.log('video',this.safeVideoUrl)

      }
    );
  }

  swapItem(nameAttribute: string, id: string) {
    console.log(nameAttribute, id)
    this.openDialog(nameAttribute, id);
  }

  openDialog(nameAttribute: string, id: string): void {
    const dialogRef = this.dialog.open(SwapAttributeComponent, {
      width: '900px',
      height: '380px',
      data: { oldAttributeId: id, oldAttribute: nameAttribute, newAttribute: new Attribute() },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.api.swapAttribute(result.oldAttributeId, result.newAttribute.id).subscribe({
        next: next => {
          this._notyf.onSuccess('Данные сохранены успешно');
        },
        error: error => {
          this._notyf.onError(error.message)
        },
      });
    });
  }

  // deleteAttr(attributeId: any) {
  //   this.api.deleteProductAttribute(attributeId).subscribe(result => {
  //     console.log(result)
  //   })
  // }
}
