import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ProductAttributeKey} from "../../models/productAttributeKey.model";
import {Attribute} from "../../models/attribute.model";
import {FormControl} from "@angular/forms";
import {debounceTime, switchMap, tap} from "rxjs";
import {finalize} from "rxjs/operators";
import {ApiClient} from "../../service/httpClient";

@Component({
  selector: 'app-supplier-dictionary',
  templateUrl: './supplier-dictionary.component.html',
  styleUrls: ['./supplier-dictionary.component.css']
})
export class SupplierDictionaryComponent implements OnInit {

  constructor(private api:ApiClient) { }

  @Input() configDictionary: ProductAttributeKey[]
  @Output() configDictionaryOut:EventEmitter<ProductAttributeKey[]> = new EventEmitter();
  @ViewChild('scrollable') private scrollable: ElementRef;


  attrTableColumns: string[] = ['idx', 'keySupplier', 'attributeBDName', 'action'];
  selectedAttr: Attribute | undefined;
  attributeListCtrl = new FormControl<string | Attribute>('');
  attrSelectedRow: any;
  public attributeList: Attribute[] | undefined;

  ngOnInit(): void {
    this.attributeListCtrl.valueChanges.pipe(
      debounceTime(100),
      tap(() => {

      }),
      switchMap(value => this.api.getAttributes(value, '', 0, 100, undefined, "rating", "desc")
        .pipe(
          finalize(() => {

          }),
        )
      )
    ).subscribe((data: any) => {
      this.attributeList = data.body.data;
    });
  }

  onDictionaryChanged() {
    this.configDictionaryOut.emit(this.configDictionary)
  }

  addSuppAttr(table: any) {
    //if already added -  skip
    if (this.configDictionary.some((x: ProductAttributeKey) => x.keySupplier == '')) {
      return;
    }
    let a: any = {
      id: this.configDictionary.length,
      keySupplier: '',
      attributeBDName: '',
      attributeIdBD: '',
      attributeValid: false,
      multiplier: ''
    };
    this.configDictionary.push(a);
    let row = this.configDictionary[this.configDictionary.length - 1];
    this.attributeListCtrl.setValue(row.attributeBDName);
    this.attrSelectedRow = row;
    table.renderRows();
    this.scrollToBottom();
  }

  onSelectRow(row: any, i: any) {
    let at = new Attribute()
    at.nameAttribute = this.configDictionary[i].attributeBDName
    this.selectedAttr = at;
    this.attributeListCtrl.setValue(this.selectedAttr);
    this.attrSelectedRow = row;
    this.attrSelectedRow.id = i;
  }

  deleteSuppAttr(index: number, table: any) {
    this.configDictionary.splice(index, 1);
    this.onDictionaryChanged()
    table.renderRows()
  }


  onSelectedRowClose(row: any, i: any, table: any) {
    if (row.keySupplier == '' && row.attributeBDName == '') {
      this.deleteSuppAttr(i, table)
    }
    this.clearAttrSelection();
  }

  displayFn(attr: Attribute): string {
    let res = attr && attr.nameAttribute
    if (attr?.etimFeature && attr?.supplierName) {
      res += " [" + attr?.etimFeature + "] от " + attr?.supplierName
    }
    return res
  }

  onDBAttrSelected() {
    this.selectedAttr = this.attributeListCtrl.value as Attribute;
  }

  updateSelectedSuppAttr(i: number, row: any) {
    //validation
    // Add our value
    const idx = this.configDictionary.indexOf(row.attributeIdBD);
    if (row.keySupplier == null && idx != i) {
      return;
    }
    //update
    this.attrSelectedRow.nameAttribute = (this.attributeListCtrl.value as Attribute).nameAttribute;
    this.attrSelectedRow.id = this.configDictionary.length;
    this.attrSelectedRow.attributeBDName = this.selectedAttr?.nameAttribute;
    this.attrSelectedRow.attributeValid = true;
    this.attrSelectedRow.attributeIdBD = this.selectedAttr?.id || this.attrSelectedRow.attributeIdBD;
    this.configDictionary[i] = this.attrSelectedRow;
    this.selectedAttr = null;
    //prepare for refresh
    this.onDictionaryChanged();
    this.clearAttrSelection();
  }

  clearAttrSelection(): void {
    this.attrSelectedRow = null;
    this.attributeListCtrl.setValue(null)
  }

  // if add new attribute will be needed
 /* addNewAttr() {
    this.openAttributeEditorDialog()
  }

  openAttributeEditorDialog(): void {
    const dialogRef = this.dialog.open(SupplierAttributeAddComponent, {
      data: {supplierName: this.supplier.supplierName, newAttribute: new Attribute()},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.attributesToAdd.push(result.newAttribute)
        this.selectedAttr = result.newAttribute
        this.attributeListCtrl.setValue(result.newAttribute as Attribute);
      }
    });
  }*/

  scrollToBottom(): void {
    try {
      this.scrollable.nativeElement.scrollTop = this.scrollable.nativeElement.scrollHeight;
    } catch (e) {
      console.error(e);
    }
  }
}

