import {Component, Input} from '@angular/core';
import {Supplier} from "../../models/supplier.model";
import {NotificationService} from "../../service/notification-service";
import {SuppliersDataSource} from "../repo/SuppliersDataSource";

@Component({
  selector: 'app-supplier-product-previewer',
  templateUrl: './supplier-product-previewer.component.html',
  styleUrls: ['./supplier-product-previewer.component.scss']
})
export class SupplierProductPreviewerComponent {
  @Input() supplier: Supplier
  preloadedFile:any;
  isFileLoaded:boolean = false;
  previewedProducts:any[] = []
  productIndex:number = 0;

  mimeExt:any[] = [
    {type:'xml', mime:'application/xml'},
    {type:'xml', mime:'text/xml'},
    {type:'json', mime:'application/json'},
    {type:'xlsx', mime:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
    {type:'xls', mime:'application/vnd.ms-excel'},
  ]

  constructor(private _notyf: NotificationService, private supplierDS: SuppliersDataSource) {
  }

  onFileChange(event: any, isDropped:boolean) {
    let file:File;
    if (isDropped) {
      event.preventDefault()
      file = event.dataTransfer.files[0]
    } else {
      file = event.target.files[0];
    }
    let reader = new FileReader()
    if (this.mimeExt.some(x => x.mime == file.type) && file.type != '') {
      //const oldFileName = file.name
      //file = new File([file], this.generateUUID()+ '.' + this.mimeExt.find(x => x.mime == file.type).type, {type:file.type});

      reader.onload = (e: any) => {
        this.preloadedFile = {fileContent:file, fileName:file.name.split('.').slice(0, -1).join('.'), fileType: file.name.split('.').pop(), size:file.size}
        this.isFileLoaded = true;
        this.getPreloadOfProducts()
      }
      reader.readAsDataURL(file);
    } else {
      this._notyf.onError(`Неверный формат файла`)
    }
  }

  onDragOver($event: DragEvent) {
    $event.stopPropagation()
    $event.preventDefault()
  }

  getPreloadOfProducts() {
    let supplier = JSON.parse(JSON.stringify(this.supplier))

    for (let config of supplier.supplierConfigs) {
      if (config.sourceSettings.header != undefined && config.sourceSettings.header.length > 0) {
        for (let header of config.sourceSettings.header) {
          delete header.isEditable
        }
        config.sourceSettings.header = JSON.stringify(config.sourceSettings.header)
      } else {
        config.sourceSettings.header = null
      }
    }
    this.supplierDS.preparseProduct(this.preloadedFile.fileContent, supplier).subscribe(products => {
      console.log(products);
      this.previewedProducts = products;

    })
  }

  swipeLeftPreview() {
    if (this.productIndex > 0)
      this.productIndex = this.productIndex - 1;
    else
      this.productIndex = this.previewedProducts.length -1;
  }
  swipeRightPreview() {
    if (this.productIndex < this.previewedProducts.length - 1)
      this.productIndex = this.productIndex + 1;
    else
      this.productIndex = 0;
  }
}
