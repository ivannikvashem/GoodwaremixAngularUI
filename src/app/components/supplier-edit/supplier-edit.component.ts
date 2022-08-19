import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Supplier} from "../../models/supplier.model";
import {ApiClient} from "../../repo/httpClient";

@Component({
  selector: 'app-supplier-edit',
  templateUrl: './supplier-edit.component.html',
  styleUrls: ['./supplier-edit.component.css']
})
export class SupplierEditComponent implements OnInit {

  supplierName: string | any;
  //supplierId: string | any;
  supplier: Supplier | any;
  supplierForm: FormGroup | any;

  constructor(
    private _ActivatedRoute:ActivatedRoute,
    private fb: FormBuilder,
    public api: ApiClient,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.supplierName = this._ActivatedRoute.snapshot.paramMap.get("supplierName");
    console.log("init with params: " + this.supplierName);

    this.api.getSupplierByName(this.supplierName)
      .subscribe( s => {
        console.log("get data from: " + this.supplierName);
        this.supplier = s.body as Supplier;
        //this.filloutForm(this.supplier);
    });

    //this.initForm();
/*    this._ActivatedRoute.queryParams.subscribe(params => {
      this.supplierName = params['supplierName'];
      console.log("init with params: " + this.supplierName);
      if (this.supplierName) {
        this.api.getSupplierByName(this.supplierName).subscribe( s => {
          this.supplier = s.body as Supplier;
          this.filloutForm(this.supplier);
        })
      }
    });*/
  }

  initForm(): void {
    this.supplierForm = this.fb.group({
      supplierProfile: this.fb.group({
        //  id: this.fb.control(''),
        supplierName: this.fb.control('', Validators.required),
        comment: this.fb.control(''),
      }),
      sourceSettings: this.fb.group({
        fileName: this.fb.control(''),
        source: this.fb.control(''),
        urlList: this.fb.control(''),
        urlItem: this.fb.control(''),
        methodType: this.fb.control(''),
        header: this.fb.control(''),
        body: this.fb.control(''),
        countPage: this.fb.control(''),
        startPage: this.fb.control(''),
        multipart: this.fb.control(false),
      }),
      baseSuppConfig: this.fb.group({
        startTag: this.fb.control(''),
        vendorId: this.fb.control(''),
        title: this.fb.control(''),
        titleLong: this.fb.control(''),
        description: this.fb.control(''),
        brand: this.fb.control(''),
        image360: this.fb.control(''),
        videos: this.fb.control(''),
        country: this.fb.control(''),
        countryCode: this.fb.control(''),
        GTD: this.fb.control(''),
      }),
      attributeConfig: this.fb.group({
        attributesStartTag: this.fb.control(''),
        attributesURL: this.fb.control(''),
        attributeName: this.fb.control(''),
        etimFeature: this.fb.control(''),
        etimValue: this.fb.control(''),
        etimUnit: this.fb.control(''),
        unit: this.fb.control(''),
        type: this.fb.control(''),
        value: this.fb.control(''),
        productAttributeKeys: this.fb.group({
          attributeIdBD: this.fb.control(''),
          keySupplier: this.fb.control(''),
          attributeBDName: this.fb.control(''),
          multiplier: this.fb.control(''),
        }),
      }),
      supplierConfig: this.fb.group({
        type: this.fb.control(''),
        stripXMLNamespace: this.fb.control(false),
        fileEncoding: this.fb.control(''),
        prefix: this.fb.control(''),
        zippedFileName: this.fb.control(''),


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
  }

/*  filloutForm(s: Supplier): void {
    console.log("ok, filling out with supplier " + this.supplier.supplierName);
    this.supplierForm = this.fb.group({
      //  id: this.fb.control(''),
      supplierName: this.fb.control(s.supplierName, Validators.required),
      comment: this.fb.control(s.comment),
      SourceSettings: this.fb.group({
        FileName: this.fb.control(s.sourceSettings?.fileName),
        Source: this.fb.control(s.sourceSettings?.source),
        UrlList: this.fb.control(s.sourceSettings?.urlList),
        UrlItem: this.fb.control(s.sourceSettings?.urlItem),
        MethodType: this.fb.control(s.sourceSettings?.methodType),
        Header: this.fb.control(s.sourceSettings?.header),
        Body: this.fb.control(s.sourceSettings?.body),
        CountPage: this.fb.control(s.sourceSettings?.countPage),
        StartPage: this.fb.control(s.sourceSettings?.startPage),
        Multipart: this.fb.control(s.sourceSettings?.multipart),
      }),
      SupplierConfig: this.fb.group({
        Type: this.fb.control(s.supplierConfigs?.type),
        StripXMLNamespace: this.fb.control(s.supplierConfigs?.stripXMLNamespace),
        FileEncoding: this.fb.control(s.supplierConfigs?.fileEncoding),
        Prefix: this.fb.control(s.supplierConfigs?.prefix),
        ZippedFileName: this.fb.control(s.supplierConfigs?.zippedFileName),
        BaseConfig: this.fb.group({
          StartTag: this.fb.control(s.supplierConfigs?.baseConfig?.startTag),
          VendorId: this.fb.control(s.supplierConfigs?.baseConfig?.vendorId),
          Title: this.fb.control(s.supplierConfigs?.baseConfig?.title),
          TitleLong: this.fb.control(s.supplierConfigs?.baseConfig?.titleLong),
          Description: this.fb.control(s.supplierConfigs?.baseConfig?.description),
          Brand: this.fb.control(s.supplierConfigs?.baseConfig?.brand),
          Image360: this.fb.control(s.supplierConfigs?.baseConfig?.image360),
          Videos: this.fb.control(s.supplierConfigs?.baseConfig?.videos),
          Сountry: this.fb.control(s.supplierConfigs?.baseConfig?.country),
          СountryCode: this.fb.control(s.supplierConfigs?.baseConfig?.countryCode),
          GTD: this.fb.control(s.supplierConfigs?.baseConfig?.gtd),
        }),
        CategoryConfig: this.fb.control(null), //todo
        DocumentConfig: this.fb.control(null), //todo
        AttributeConfig: this.fb.control(null), //todo
        PackageConfig: this.fb.control(null), //todo
        Multipliers: this.fb.group({
          DimensionIndex: this.fb.control(1),
          VolumeIndex: this.fb.control(1),
          WeightIndex: this.fb.control(1),
        }),
        DateFormats: this.fb.array([]),
      }),
    });
  }*/

  onSubmit(): void{
    console.log('Form Submit: ', this.supplierForm.value);
    this.api.updateSupplier(this.supplier).subscribe( x => {
        console.log("updateSupplier: " +JSON.stringify(x) );
    },
    error => {
      console.log( "updateSupplierError: " + JSON.stringify(error));
    })
  }

  clearForm(): void{
    this.supplierForm.reset();
  }
}
