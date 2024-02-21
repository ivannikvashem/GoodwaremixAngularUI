import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../models/product.model";
import {MissingImageHandler} from "../MissingImageHandler";
import {MatDialog} from "@angular/material/dialog";
import {NotificationService} from "../../service/notification-service";
import {Router} from "@angular/router";
import {Clipboard} from "@angular/cdk/clipboard";
import {DataStateService} from "../../shared/data-state.service";
import {AuthService} from "../../auth/service/auth.service";

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  hoverImage: string = "";
  hoverRowId: string = "";
  isImageLoaded:boolean = false;
  selected:boolean = false;
  roles:string[] = []
  @Input() product:Product
  constructor(
    private imgHandler:MissingImageHandler,
    public dialog: MatDialog,
    public router: Router,
    public _notyf: NotificationService,
    private clipboard:Clipboard,
    private dss: DataStateService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.roles = this.auth.getRoles();
    this.dss.getSelectedProducts().subscribe((selection:Product[]) => {
      this.selected = !!selection.find(item => item.id === this.product.id);
    })
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

  onChecked() {
    if (this.selected) {
      this.dss.setSelectedProduct({id:this.product.id, vendorId:this.product.vendorId, internalCode:this.product.internalCode, title:this.product.title, image:this.product.thumbnails ? this.product.thumbnails : this.product.images})
    } else {
      this.dss.removeSelectedProduct(this.product.id)
    }
  }

  editProduct(routeLink: string, event:any) {
    if (event.which == 1 || event.which == 2) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree([routeLink])
      )
      window.open(url, event.which == 1 ? '_self' : '_blank')
    }
  }
}
