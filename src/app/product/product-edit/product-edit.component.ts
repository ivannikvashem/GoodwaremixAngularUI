import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {Supplier} from "../../models/supplier.model";
import {ApiClient} from "../../service/httpClient";
import {Product} from "../../models/product.model";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {AttributeProduct} from "../../models/attributeProduct.model";
import {DataSource} from "@angular/cdk/collections";
import {debounceTime, distinctUntilChanged, finalize, Observable, ReplaySubject, startWith, switchMap, tap} from "rxjs";
import {NotificationService} from "../../service/notification-service";
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ProductAttributeEditComponent} from "../product-attribute-edit/product-attribute-edit.component";
import {Package} from "../../models/package.model";
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
  isSupplierSingle:boolean = false;
  //Product
  product:Product = new Product();
  productId:string = '';
  imagesToUpload:File[] = []
  preloadImagesView:any[] =[]
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

  countriesList:Country[] = Countries
  searchCountryCtrl = new FormControl<string | any>('')
  filteredCountries: Observable<any[]>
  brandsList:string[] = []
  searchBrandCtrl = new FormControl<string>('')
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
      this.api.getProductById(this.productId).subscribe( (s:any) => {
          this.product = s.body as Product;
          if (this.product.thumbnails) {
            this.product.localImages.forEach((value) => {this.preloadImagesView.push({id: null, file:value})})
          }
          if (this.product.netto == null) {
            this.product.netto = new Package()
          }
          if (this.product.country) {
            this.searchCountryCtrl.setValue(this.countriesList.find(option => option.name.toLowerCase().includes(this.product.country.toLowerCase()) as Country))
          }
          if (this.product.vendor) {
            this.searchBrandCtrl.setValue(this.product.vendor)
          }
          this.attrDataSource.setData(this.product.attributes || []);
          this.packDataSource.setData(this.product.packages || []);
        });
    }
    this.filteredCountries = this.searchCountryCtrl.valueChanges.pipe(
      startWith(''),
      map(value => ( value ? this.countryFilter(value) : this.countriesList.slice())));

    this.searchBrandCtrl.valueChanges.pipe(
      distinctUntilChanged(), debounceTime(300),
      switchMap(value => this.api.getBrands(value))).subscribe((data: any) => {this.brandsList = data.body; });
  }
  private countryFilter(value: any): any[] {
    let filterValue = ''
    try { filterValue = value.name.toLowerCase() }
    catch (ex) { filterValue = value.toLowerCase() }
    return this.countriesList.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  handleChangeSelectedSupplier(supplier: Supplier) {
    this.selectedSupplier = supplier
    this.product.supplierId = supplier.id
  }

  // Media
  onImageChange(event: any) {
    let files:any[] = Array.from(event.target.files);
    let errorCounter = 0;
    for (let i in files) {
      let reader = new FileReader();
      if (files[i].type.includes('image/')) {
        files[i] = new File([files[i]], crypto.randomUUID()+ '.' + files[i].type.split('image/')[1], {type:files[i].type});
        reader.onload = (fl:any) => {
          this.preloadImagesView.push({id: Number(i), file:fl.target.result})
        }
        this.imagesToUpload.push(files[i])
        this.product.localImages.push(files[i].name)
        this.product.thumbnails.push(files[i].name)
        reader.readAsDataURL(files[i]);
      } else { errorCounter += 1;}
    }
    if (errorCounter > 0) {
      this._notyf.onError(`Неверный формат фото (${errorCounter})`)
    }
  }

  removeImage(index:any, loadedImgIndex:any){
    this.product.localImages.splice(index,1);
    this.product.thumbnails.splice(index,1);
    this.product.images.splice(index, 1);
    this.imagesView.splice(index, 1);
    this.imagesToUpload.splice(index, 1);

    if (loadedImgIndex) {
      this.preloadImagesView.splice(loadedImgIndex, 1)
    } else {
      this.preloadImagesView.splice(index, 1)
    }
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
  openAttributeEditorDialog(oldAttribute?:any): void {
    const dialogRef = this.dialog.open(ProductAttributeEditComponent, {
      width: '900px',
      height: '315px',
      data: { oldAttribute: oldAttribute, newAttribute: new AttributeProduct() },
      autoFocus:false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (this.product.attributes.filter(x => x.value !== result.newAttribute?.value)) {
          if (oldAttribute == undefined) {
            this.product.attributes.push(result.newAttribute as AttributeProduct)
            this.attrDataSource.setData(this.product.attributes || []);
          } else {
            if (oldAttribute !== result.newAttribute) {
              const target = this.product.attributes.find((obj) => obj.value === oldAttribute.value)
              Object.assign(target, result.newAttribute)
            }
          }
        }
      }
    });
  }

  deleteAttrRow(attrIndex: any) {
    if (attrIndex >= 0) {
      this.product.attributes.splice(attrIndex,1)
    }
    this.attrDataSource.setData(this.product.attributes || []);
  }

  // Package
  openPackageEditorDialog(oldPackage?:any): void {
    const dialogRef = this.dialog.open(ProductPackageEditComponent, {
      data: {oldPackage: oldPackage, newPackage: new Package() },
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

  deletePackageRow(row:any) {
    this.product.packages = this.product.packages.filter(dc => (dc != row))
    this.packDataSource.setData(this.product.packages || []);
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
    console.log(this.imagesToUpload.length)
    if (this.imagesToUpload.length > 0) {
      this.uploadPhotos(this.imagesToUpload, this.product.supplierId)
    }
    this.product.updatedAt = new Date().toISOString();
    this.product.vendor = this.searchBrandCtrl.value
    console.log(this.product)
    if (this.product.id != null) {
      this.updateProduct(this.product)
    }
    else if (this.product.id == null) {
      this.product.createdAt = new Date().toISOString();
      this.insertProduct(this.product)
    }
   }

   uploadPhotos(photos:File[], supplierId:string) {
    this.api.uploadPhoto(photos, supplierId).subscribe()
   }

   updateProduct(product: Product) {
    this.api.updateProduct(product).subscribe(x => {
        this._notyf.onSuccess("Товар изменен");
      },
      error => {
        this._notyf.onError("Ошибка: " + JSON.stringify(error));
      });
   }

   insertProduct(product: Product) {
     this.api.insertProduct(product).subscribe(x => {
         this._notyf.onSuccess("Товар добавлен");
         this.router.navigate([`product-edit/${x.body}`])
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
        this._notyf.onError("Ошибка: " + JSON.stringify(error.error));
        this.internalCodeFetching = true
      });
  }

  onCountryClearSelection() {
    this.searchCountryCtrl.setValue('')
    this.onCountrySelected()
  }

  openImageDialog(image: string) {
    let dialogBoxSettings = {margin: '0 auto', hasBackdrop: true, data: { src: image.replace("", "")}};
    this.dialog.open(ImageDialog, dialogBoxSettings);
  }

  onDocumentsChanged(documents: string[]) {
    console.log(documents)
    this.product.documents = documents
    console.log(this.product.documents)
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
