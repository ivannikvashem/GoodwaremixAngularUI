import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {SourceSettings, Supplier, SupplierConfig} from "../../models/supplier.model";
import {ApiClient} from "../../repo/httpClient";
import {ProductAttributeKey} from "../../models/productAttributeKey.model";
import {DataSource} from "@angular/cdk/collections";
import { Attribute } from 'src/app/models/attribute.model';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Dimensions} from "../../models/dimensions.model";
import {Multipliers} from "../../models/multipliers.model";
import {debounceTime, Observable, ReplaySubject, switchMap, tap} from "rxjs";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-supplier-edit',
  templateUrl: './supplier-edit.component.html',
  styleUrls: ['./supplier-edit.component.css']
})
export class SupplierEditComponent implements OnInit {

  supplierId: string = '';
  supplier: Supplier;

  dataToDisplay:any = [];
  attrDataSource = new ProdAttrDataSource(this.dataToDisplay);
  attrTableColumns: string[] = ['idx', 'keySupplier', 'attributeBDName', 'actions'];
  attrSelectedRow: any;

  public attributeList: Attribute[] | undefined;
  attributeListCtrl = new FormControl<string | Attribute>('');
  selectedAttr: Attribute | undefined;

  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private _snackBar: MatSnackBar,
    public api: ApiClient,
  ) { }

  ngOnInit(): void {
    this.supplierId = this._ActivatedRoute.snapshot.paramMap.get("supplierId");


    //this.fetchSupplier()
    // this.supplierId = this._ActivatedRoute.snapshot.paramMap.get("supplierId");
    // console.log("init with params: " + this.supplierId);
    //
    if (this.supplierId) {
      this.api.getSupplierById(this.supplierId)
        .subscribe( (s:any) => {
          console.log("get data by " + this.supplierId + ": " + JSON.stringify(s));
          if (s?.body.supplierConfigs?.nettoConfig?.dimensions == null) {
            s.body.supplierConfigs.nettoConfig.dimensions = new Dimensions();
          }
          if (s?.body.supplierConfigs?.packageConfig?.dimensions == null) {
            s.body.supplierConfigs.packageConfig.dimensions = new Dimensions();
          }
          if (s?.body.supplierConfigs?.multipliers == null) {
            s.body.supplierConfigs.multipliers = new Multipliers();
          }
/*          if (s?.body.sourceSettings?.multipart == null) {
            s.body.sourceSettings.multipart = false;
          }*/


           this.supplier = s.body as Supplier;
          console.log("inited data :" + JSON.stringify( this.supplier));
          this.attrDataSource.setData(this.supplier.supplierConfigs?.attributeConfig?.productAttributeKeys || []);
        });
    }
    else {
      this.supplier = new Supplier();
    }

    this.attributeListCtrl.valueChanges.pipe(
      //distinctUntilChanged(),
      debounceTime(100),
      tap(() => {

      }),
      switchMap(value => this.api.getAttributes(value, '' ,0, 10, undefined, "Rating", "desc")
        .pipe(
          finalize(() => {

          }),
        )
      )
    )
    .subscribe((data: any) => {
      this.attributeList = data.body.data;
    });
  }

  /*initForm(s: Supplier): void {
    this.attrDataSource.setData(s.supplierConfigs?.attributeConfig?.productAttributeKeys || []);

    this.supplierForm = this.fb.group({
      supplierProfile: this.fb.group({
        //  id: this.fb.control(''),
        supplierName: this.fb.control(s.supplierName, Validators.required),
        comment: this.fb.control(s.comment),
      }),
      sourceSettings: this.fb.group({
        //fileName: this.fb.control(s.sourceSettings?.fileName),
        source: this.fb.control(s.sourceSettings?.source),
        urlList: this.fb.control(s.sourceSettings?.urlList),
        urlItem: this.fb.control(s.sourceSettings?.urlItem),
        methodType: this.fb.control(s.sourceSettings?.methodType),
        header: this.fb.control(s.sourceSettings?.header),
        body: this.fb.control(s.sourceSettings?.body),
        countPage: this.fb.control(s.sourceSettings?.countPage),
        startPage: this.fb.control(s.sourceSettings?.startPage),
        multipart: this.fb.control(s.sourceSettings?.multipart),
      }),
      baseSuppConfig: this.fb.group({
        startTag: this.fb.control(s.supplierConfigs?.baseConfig?.startTag),
        vendorId: this.fb.control(s.supplierConfigs?.baseConfig?.vendorId),
        title: this.fb.control(s.supplierConfigs?.baseConfig?.title),
        titleLong: this.fb.control(s.supplierConfigs?.baseConfig?.titleLong),
        description: this.fb.control(s.supplierConfigs?.baseConfig?.description),
        brand: this.fb.control(s.supplierConfigs?.baseConfig?.brand),
        image360: this.fb.control(s.supplierConfigs?.baseConfig?.image360),
        videos: this.fb.control(s.supplierConfigs?.baseConfig?.videos),
        country: this.fb.control(s.supplierConfigs?.baseConfig?.country),
        countryCode: this.fb.control(s.supplierConfigs?.baseConfig?.countryCode),
        GTD: this.fb.control(s.supplierConfigs?.baseConfig?.gtd),
        prefix: this.fb.control(s.supplierConfigs?.prefix),
      }),
      attributeConfig: this.fb.group({
        attributesStartTag: this.fb.control(s.supplierConfigs?.attributeConfig?.attributesStartTag),
        attributesURL: this.fb.control(s.supplierConfigs?.attributeConfig?.attributesURL),
        attributeName: this.fb.control(s.supplierConfigs?.attributeConfig?.attributeName),
        etimFeature: this.fb.control(s.supplierConfigs?.attributeConfig?.etimFeature),
        etimValue: this.fb.control(s.supplierConfigs?.attributeConfig?.etimValue),
        etimUnit: this.fb.control(s.supplierConfigs?.attributeConfig?.etimUnit),
        unit: this.fb.control(s.supplierConfigs?.attributeConfig?.unit),
        attrType: this.fb.control(s.supplierConfigs?.attributeConfig?.type),
        value: this.fb.control(s.supplierConfigs?.attributeConfig?.value),
      }),
      productAttributeKeys: this.fb.group({
        attributeIdBD: this.fb.control(''),
        keySupplier: this.fb.control(''),
        attributeBDName: this.fb.control(''),
        multiplier: this.fb.control(''),
      }),
      supplierConfig: this.fb.group({

        type: this.fb.control(s.supplierConfigs?.type),
        stripXMLNamespace: this.fb.control(s.supplierConfigs?.stripXMLNamespace),
        fileEncoding: this.fb.control(s.supplierConfigs?.fileEncoding),

        zippedFileName: this.fb.control(s.supplierConfigs?.zippedFileName),

        documentConfig: this.fb.control(null), //todo
        packageConfig: this.fb.control(null), //todo
        multipliers: this.fb.group({
          dimensionIndex: this.fb.control(1),
          volumeIndex: this.fb.control(1),
          weightIndex: this.fb.control(1),
        }),
        dateFormats: this.fb.array([]),
      }),
    });
  }*/

  // fetchSupplier() {
  //   if (this.supplierId != null) {
  //     this.api.getSupplierById(this.supplierId).subscribe(resp => {
  //       console.log( 'actual resp',resp)
  //       this.supplier = resp
  //     })
  //   }
  //   else {
  //     this.supplier = {} as Supplier
  //   }
  //
  // }


  onSubmit(): void{
    console.log('Submitting: ', JSON.stringify(this.supplier));
    this.api.updateSupplier(this.supplier).subscribe( x => {
        console.log("updateSupplier: " +JSON.stringify(x) );
    },
    error => {
      console.log( "updateSupplierError: " + JSON.stringify(error));
    })
  }

  addSuppAttr() {
    //if already added -  skip
    if (this.supplier.supplierConfigs.attributeConfig.productAttributeKeys.some( (x: ProductAttributeKey) => x.keySupplier == '')) {
      return;
    }

    let a = new ProductAttributeKey ();
    this.supplier.supplierConfigs.attributeConfig.productAttributeKeys.push(a);

    this.attrDataSource.setData(this.supplier.supplierConfigs?.attributeConfig?.productAttributeKeys);
    let row = this.supplier.supplierConfigs?.attributeConfig?.productAttributeKeys[this.supplier.supplierConfigs?.attributeConfig?.productAttributeKeys.length - 1];

    this.attributeListCtrl.setValue(row.attributeBDName);
    this.attrSelectedRow = row;
  }

  deleteSuppAttr(keySupplier: string) {
    let idx = this.supplier.supplierConfigs.attributeConfig.productAttributeKeys.map((obj:ProductAttributeKey) => obj.keySupplier).indexOf(keySupplier);
    console.log(idx);

    this.supplier.supplierConfigs.attributeConfig.productAttributeKeys.splice(idx, 1);
    this.attrDataSource.setData(this.supplier.supplierConfigs?.attributeConfig?.productAttributeKeys);
  }

  onSelectRow(row: any) {
    console.log("onSelectRow clear");
    this.selectedAttr = undefined;
    this.attributeListCtrl.setValue(row.attributeBDName);
    this.attrSelectedRow = row;
  }

  displayFn(attr: Attribute): string {
    return attr && attr.nameAttribute ? attr.nameAttribute + " [" + attr.etimFeature + "] от " + attr.supplierName : '';
  }

  onDBAttrSelected() {
    this.selectedAttr = this.attributeListCtrl.value as Attribute;
  }

  updateSelectedSuppAttr(i: number, row: any) {
    console.log("updateSuppAttr attr dict!");
    //validation
    // Add our value
    const idx = this.supplier.supplierConfigs.attributeConfig.productAttributeKeys.indexOf(row.keySupplier);
    console.log("idx: "+ idx);
    if (row.keySupplier == null && idx != i) {
      return;
    }

    //update
    //this.attrSelectedRow = (this.attributeListCtrl.value as Attribute).nameAttribute;
    this.attrSelectedRow.attributeBDName = this.selectedAttr?.nameAttribute;
    this.attrSelectedRow.attributeValid = true;
    this.supplier.supplierConfigs.attributeConfig.productAttributeKeys[i] = this.attrSelectedRow;
    console.log("upd: " + JSON.stringify(this.attrSelectedRow));

    //prepare for refresh
    this.clearAttrSelection();
    this.attrDataSource.setData(this.supplier.supplierConfigs?.attributeConfig?.productAttributeKeys);
  }

  saveUpdatedSupplierAttr(){

  }

  clearAttrSelection():void {
    this.attrSelectedRow = null;
  }

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  addDateFormat(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our value
    const idx = this.supplier.supplierConfigs.dateFormats?.indexOf(value);
    if (value && idx === -1 ) {
      this.supplier.supplierConfigs.dateFormats?.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  removeDateFormat(fruit: string): void {
    const index = this.supplier.supplierConfigs.dateFormats?.indexOf(fruit);

    if (typeof(index) == "number" && index >= 0) {
      this.supplier.supplierConfigs.dateFormats?.splice(index, 1);
    }
  }

  submitSupplier() {
    this.api.updateSupplier(this.supplier).subscribe( x => {
        //console.log("updateSupplier: " +JSON.stringify(x) );
        this._snackBar.open("Конфигурация сохранена","OK",{ duration: 1000});
      },
      error => {
        //console.log("updateSupplierError: " + JSON.stringify(error));
        this._snackBar.open("Ошибка: " + JSON.stringify(error),undefined,{ duration: 5000});
        //todo обработчик ошибок, сервер недоступен или еще чего..
      });
  }
}

class ProdAttrDataSource extends DataSource<ProductAttributeKey> {
  private _dataStream = new ReplaySubject<ProductAttributeKey[]>();

  constructor(initialData: ProductAttributeKey[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<ProductAttributeKey[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: ProductAttributeKey[]) {
    this._dataStream.next(data);
  }
}
