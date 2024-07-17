import {Component, Input} from '@angular/core';
import {Supplier, SupplierConfig} from "../../models/supplier.model";
import {NotificationService} from "../../service/notification-service";
import {SuppliersDataSource} from "../repo/SuppliersDataSource";
import {HeaderModel} from "../supplier-edit/supplier-edit.component";

@Component({
  selector: 'app-supplier-product-previewer',
  templateUrl: './supplier-product-previewer.component.html',
  styleUrls: ['./supplier-product-previewer.component.scss']
})
export class SupplierProductPreviewerComponent {
  @Input() supplier: Supplier
  preloadedFile:any;
  isFileLoaded:boolean = false;

  mimeExt:any[] = [
    {type:'xml', mime:'application/xml'},
    {type:'json', mime:'application/json'},
    {type:'xlsx', mime:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'},
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
    this.supplierDS.preparseProduct(this.preloadedFile.fileContent, supplier).subscribe(x => {
      console.log(x)
    })
  }
}
