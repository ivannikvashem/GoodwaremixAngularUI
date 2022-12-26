import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {Supplier} from "../../models/supplier.model";
import {ApiClient} from "../../service/httpClient";
import {Product} from "../../models/product.model";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {AttributeProduct} from "../../models/attributeProduct.model";
import {DataSource} from "@angular/cdk/collections";
import {Observable, ReplaySubject, startWith} from "rxjs";
import {NotificationService} from "../../service/notification-service";
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ProductAttributeEditComponent} from "../product-attribute-edit/product-attribute-edit.component";
import {Package} from "../../models/package.model";
import {Document} from "../../models/document.model";
import {ProductDocumentEditComponent} from "../product-document-edit/product-document-edit.component";
import {ProductPackageEditComponent} from "../product-package-edit/product-package-edit.component";
import {Countries} from "../../../assets/countriesList"
import {map} from "rxjs/operators";
import {MissingImageHandler} from "../MissingImageHandler";
import {ImageDialog} from "../hover-image-slider/hover-image-slider.component";

interface Country {
  code?:string
  name?:string
}

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  // Supplier
  selectedSupplier: Supplier;
  //Product
  product:Product = new Product();
  productId:string = '';
  imagesToUpload:File[] = []
  imagesView:string[] =[]
  internalCodeFetching:boolean = true
  // Attr
  dataToDisplayAttr:any = [];
  attrDataSource = new AttrDataSource(this.dataToDisplayAttr)
  attributeColumns: string[] = ['attributeKey', 'attributeValue', 'action'];
  dataSource = new MatTableDataSource<any>()
  // Package
  dataToDisplayPck:any = [];
  packageColumns: string[] = ['package', 'action'];
  packDataSource = new PackDataSource(this.dataToDisplayPck);
  // Document
  dataToDisplayDoc:any = [];
  documentColumns:string[] = ['title', 'action']
  documentDataSource = new DocumentDataSource(this.dataToDisplayDoc)
  //Misc
  countriesList:Country[] = Countries
  searchCountryCtrl = new FormControl<string | any>('')
  filteredCountries: Observable<any[]>
  Math = Math;
  Eps = Number.EPSILON;

  constructor(private api:ApiClient,
              private _ActivatedRoute:ActivatedRoute,
              private router: Router,
              private _notyf:NotificationService,
              public dialog: MatDialog,
              private imgHandler:MissingImageHandler) {}

  ngOnInit(): void {

    this.productId = this._ActivatedRoute.snapshot.paramMap.get("id");
    if (this.productId) {
      this.api.getProductById(this.productId)
        .subscribe( (s:any) => {
          this.product = s.body as Product;
          if (this.product.netto == null) {
            this.product.netto = new Package()
          }
          if (this.product.country) {
            const productCountry = this.countriesList.find(option => option.name.toLowerCase().includes(this.product.country.toLowerCase()) as Country)
            this.searchCountryCtrl.setValue(productCountry as Country)
          }
          this.attrDataSource.setData(this.product.attributes || []);
          this.packDataSource.setData(this.product.packages || []);
          this.documentDataSource.setData(this.product.documents || []);
          if (this.product.images) {
            this.product.images.forEach((value) => {this.imagesView.unshift(value) })
          }
          if (this.product.thumbnails) {
            this.product.localImages.forEach((value) => {this.imagesView.unshift(value) })
          }
        });
    }
    this.filteredCountries = this.searchCountryCtrl.valueChanges.pipe(
      startWith(''),
      map(value => ( value ? this._filter(value) : this.countriesList.slice())),
      );
  }
  private _filter(value: any): any[] {
    let filterValue = ''
    try { filterValue = value.name.toLowerCase() }
    catch (ex) { filterValue = value.toLowerCase() }
    return this.countriesList.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  handleChangeSelectedSupplier(supplier: Supplier) {
    this.selectedSupplier = supplier
  }

  // Media
  onImageChange(event: any) {
    let files:File[] = event.target.files
    let errorCounter = 0;

    for (let file of files) {
      let reader = new FileReader();
      if (file.type.includes('image/')) {
        this.imagesToUpload.unshift(file)
        reader.onload = (event:any) => {
          this.imagesView.unshift(event.target.result);
        }
        reader.readAsDataURL(file);
      } else { errorCounter += 1;}
    }
    if (errorCounter > 0) {
      this._notyf.onError(`Неверный формат фото (${errorCounter})`)
    }
  }

  removeImage(url:any){
    this.imagesView = this.imagesView.filter(img => (img != url));
    this.product.images = this.product.images.filter(img => (img != url));
    this.product.localImages = this.product.localImages.filter(img => (img != url));
  }

  addVideo($event: MatChipInputEvent) {
    const value = ($event.value || '').trim()
    if (value) { this.product.videos.push(value)}
    $event.chipInput!.clear()
  }

  removeVideo(video:string) {
    const index = this.product.videos.indexOf(video)
    if (index >= 0) {
      this.product.videos.splice(index,1)
    }
  }

  // About product
  addGTD($event: MatChipInputEvent) {
    const value = ($event.value || '').trim()
    const idx = this.product?.gtd?.indexOf(value);
    if (value && idx === -1 ) {this.product.gtd.push(value);}
    $event.chipInput!.clear()
  }

  removeGTD(gtd:string) {
    const index = this.product.gtd.indexOf(gtd)
    if (index >= 0) {
      this.product.gtd.splice(index,1)
    }
  }

  displayCountryFn(country: any): string {
    return country && country.name + ' (Код '+country.code+')';
  }

  // Attribute
  AddNewRowAttribute() {
    this.openAttributeEditorDialog();
  }

  editAttrRow(row:any) {
    this.openAttributeEditorDialog(row);
  }

  deleteAttrRow(attribute: any) {
    this.product.attributes = this.product.attributes.filter(item => item.attributeId !== attribute.attributeId)
    this.attrDataSource.setData(this.product.attributes || []);
  }

  openAttributeEditorDialog(oldAttribute?:any): void {
    const dialogRef = this.dialog.open(ProductAttributeEditComponent, {
      width: '900px',
      data: { oldAttribute: oldAttribute, newAttribute: new AttributeProduct() },
      autoFocus:false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (this.product.attributes.filter(x => x.value !== result.newAttribute?.value)) {
          if (oldAttribute == undefined) {
            this.product.attributes.unshift(result.newAttribute as AttributeProduct)
            this.attrDataSource.setData(this.product.attributes || []);
          }
          else {
            if (oldAttribute !== result.newAttribute) {
              const target = this.product.attributes.find((obj) => obj.value === oldAttribute.value)
              Object.assign(target, result.newAttribute)
            }
          }
        }
      }
    });
  }

  // Package
  addNewPackage() {
    this.openPackageEditorDialog()
  }

  editPackageRow(row:any) {
    this.openPackageEditorDialog(row)
  }

  deletePackageRow(row:any) {
    this.product.packages = this.product.packages.filter(dc => (dc != row))
    this.packDataSource.setData(this.product.packages || []);
  }

  openPackageEditorDialog(oldPackage?:any): void {
    const dialogRef = this.dialog.open(ProductPackageEditComponent, {
      data: { oldPackage: oldPackage, newPackage: new Package() },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (this.product.packages.filter(x => x.barcode !== result.newPackage?.barcode)) {
          if (oldPackage == undefined) {
            this.product.packages.unshift(result.newPackage as Package)
            this.packDataSource.setData(this.product.packages || []);
          } else {
            if (oldPackage !== result.newPackage) {
              const target = this.product.packages.find((obj) => obj === oldPackage)
              Object.assign(target, result.newPackage)
            }
          }
        }
      }
    });
  }

  // Document
  AddNewDocument() {
    this.openDocumentEditorDialog()
  }

  editDocRow(row:any) {
    this.openDocumentEditorDialog(row)
  }

  deleteDocRow(row:any) {
    this.product.documents = this.product.documents.filter(dc => (dc != row))
    this.documentDataSource.setData(this.product.documents || []);
  }

  openDocumentEditorDialog(oldDocument?:any): void {
    const dialogRef = this.dialog.open(ProductDocumentEditComponent, {
      width: '900px',
      height: '600px',
      data: { oldDocument: oldDocument, newDocument: new Document() },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (this.product.documents.filter(x => x !== result?.newDocument)) {
          if (oldDocument == undefined) {
            this.product.documents.unshift(result.newDocument as Document)
            this.documentDataSource.setData(this.product.documents || []);
          }
          else {
            if (oldDocument !== result.newDocument) {
              const target = this.product.documents.find((obj) => obj === oldDocument)
              Object.assign(target, result.newDocument)
            }
          }
        }
      }
    });
  }

  submitProduct() {
    if (!this.product.title) {
      this._notyf.onError("Не задано наименование продукта");
      return;
    }
    if (!this.product.vendorId) {
      this._notyf.onError("Не задан артикул продукта поставщика");
      return;
    }

    if (!this.product.supplierId) { //адский оверхед с сокрытием поля
      if (this.selectedSupplier && this.selectedSupplier.id) {
        this.product.supplierId = this.selectedSupplier.id
        this.product.supplierName = this.selectedSupplier.supplierName
      } else {
        this._notyf.onError("Не задан поставщик");
        return;
      }
    }
    let date = new Date()

    this.product.updatedAt = date.toISOString();
    if (this.productId) {
      this.updateProduct(this.product, this.imagesToUpload)
    } else {
      this.product.createdAt = date.toISOString();
      this.insertProduct(this.product, this.imagesToUpload)
    }
   }

   updateProduct(product: Product, files:any) {
     this.api.updateProduct(product, files).subscribe(x => {
         this._notyf.onSuccess("Товар изменен");
       },
       error => {
         this._notyf.onError("Ошибка: " + JSON.stringify(error));
         //todo обработчик ошибок, сервер недоступен или еще чего..
       });
   }

   insertProduct(product: Product, files:any) {
     this.api.insertProduct(product, files)
       .subscribe(body => {
         console.warn(">>" + JSON.stringify(body));
         this._notyf.onSuccess("Товар добавлен");
         this.router.navigate([`product-edit/${body}`])
       },
       error => {
         this._notyf.onError("Ошибка: " + JSON.stringify(error));
       } );
   }

  onCountrySelected() {
    this.product.country = this.searchCountryCtrl.value.name
    this.product.countryCode = this.searchCountryCtrl.value.code
  }

  handleMissingImage($event: Event) {
    this.imgHandler.checkImgStatus($event)
  }

  RequestProductInternalCode(id: string) {
    this.internalCodeFetching = false
    this.api.bindProductInternalCodeById(id).subscribe(x => {
        this._notyf.onSuccess("Артикул успешно привязан");
        this.product.internalCode = x;
        this.internalCodeFetching = true
      },
      error => {
        console.log("updateSupplierError: " + JSON.stringify(error));
        this._notyf.onError("Ошибка: " + JSON.stringify(error.error));
        this.internalCodeFetching = true
      });
  }

  onCountryClearSelection() {
    this.searchCountryCtrl.setValue('')
    this.onCountrySelected()
  }

  openImageDialog(image: string) {
    let dialogBoxSettings = {
      margin: '0 auto',
      hasBackdrop: true,
      data: {
        src: image.replace("", ""),
      }
    };
    this.dialog.open(ImageDialog, dialogBoxSettings);
  }
}

// Service
class AttrDataSource extends DataSource<AttributeProduct> {
  private _dataStream = new ReplaySubject<AttributeProduct[]>();
  constructor(initialData: AttributeProduct[]) {
    super();
    this.setData(initialData);
  }
  connect(): Observable<AttributeProduct[]> {
    return this._dataStream;
  }
  disconnect() {}
  setData(data: AttributeProduct[]) {
    this._dataStream.next(data);
  }
}

class PackDataSource extends DataSource<Package> {
  private _dataStream = new ReplaySubject<Package[]>();
  constructor(initialData: Package[]) {
    super();
    this.setData(initialData);
  }
  connect(): Observable<Package[]> {
    return this._dataStream;
  }
  disconnect() {}
  setData(data: Package[]) {
    this._dataStream.next(data);
  }
}

class DocumentDataSource extends DataSource<Document> {
  private _dataStream = new ReplaySubject<Document[]>();
  constructor(initialData: Document[]) {
    super();
    this.setData(initialData);
  }
  connect(): Observable<Document[]> {
    return this._dataStream;
  }
  disconnect() {}
  setData(data: Document[]) {
    this._dataStream.next(data);
  }
}
