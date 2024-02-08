import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent} from "@angular/material/legacy-autocomplete";
import {ApiClient} from "../../service/httpClient";
import {Supplier} from "../../models/supplier.model";
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from "@angular/material/legacy-dialog";
import {DataStateService} from "../../shared/data-state.service";
import {NotificationService} from "../../service/notification-service";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  supplierList: Supplier[] = [];
  suppliersSearchCtrl = new FormControl();
  @ViewChild('suppliersSearchInput') suppliersSearchInput: ElementRef;

  userForm = this.fb.group({
    id: [''],
    username: [''],
    name: [''],
    email: [''],
    phone: [''],
    role: ['goodware-users'],
    linkedSuppliers: [],
    isDeleted: [false],
    lastLogin: [''],
    token: ['']
  });

  constructor(private fb: FormBuilder,
              private api: ApiClient,
              private router: Router,
              private dss: DataStateService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private _notyf: NotificationService,
              public dialogRef: MatDialogRef<UserDetailsComponent>) { }

  ngOnInit(): void {
    if (this.data?.id) {
      this.userForm.setValue(this.data);
    }

    if (this.dss.getSupplierList().length == 0) {
      this.api.getSuppliers("", 0 ,100, "supplierName", "asc").subscribe( (r:any) => {
        this.supplierList = r.body.data
        this.dss.setSupplierList(this.supplierList)
      });
    } else {
      this.supplierList = this.dss.getSupplierList();
    }
  }

  searchFilter(supplierList: Supplier[], search:string) {
    return supplierList.filter(option => option.supplierName.toLowerCase().includes(search.toLowerCase()));
  }

  removeSupplierFromUser(item: any): void {
    const index = this.userForm.value.linkedSuppliers?.indexOf(item);
    if (typeof(index) == "number" && index >= 0) {
      this.userForm.value.linkedSuppliers?.splice(index, 1);
    }
  }

  supplierAutocompleteSelected(event: MatAutocompleteSelectedEvent): void {
    const value = (event.option.value.id || '').trim();
    const idx = this.userForm.value.linkedSuppliers.find((x:any) => x.id == value);
    if (!idx) {
      this.userForm.value.linkedSuppliers.push({id: event.option.value.id, name: event.option.viewValue});
    }
    this.suppliersSearchInput.nativeElement.value = '';
    this.suppliersSearchCtrl.setValue(null);
  }

  onSubmit(): void {
    if (!this.data?.id) {
      console.log("submitting " + this.userForm.value.username + " by ID " + this.data?.id + " with data: " + JSON.stringify(this.userForm.value));
      this.api.addUser(this.userForm.value).subscribe(() => {
        this.dialogRef.close(this.userForm.value)
      },error => {
        this._notyf.onError(error)
      });
    } else {
      console.log("submitting " + this.userForm.value.username + " by ID " + this.data?.id + " with data: " + JSON.stringify(this.userForm.value));
      this.api.updateUser(this.data.id, this.userForm.value).subscribe(() => {
        this.dialogRef.close(this.userForm.value)
      } ,error => {
        this._notyf.onError(error)
      });
    }
    return;
  }

  selectAll() {
    for (let i of this.supplierList) {
      const idx = this.userForm.value.linkedSuppliers.find((x:any) => x.id == i.id);
      if (!idx) {
        this.userForm.value.linkedSuppliers.push({id: i.id, name: i.supplierName});
      }
    }
  }
}
