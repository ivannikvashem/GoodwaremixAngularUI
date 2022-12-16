import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {debounceTime, distinctUntilChanged, Observable, of} from "rxjs";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {catchError, finalize, map} from "rxjs/operators";
import {ApiClient} from "../../service/httpClient";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  userId: string = "";
  filteredSuppliers: Observable<any[]>;
  suppliersSearchCtrl = new FormControl();
  @ViewChild('suppliersSearchInput') suppliersSearchInput: ElementRef;

  userForm = this.fb.group({
    id: [''],
    username: [''],
    name: [''],
    email: [''],
    phone: [''],
    role: ['goodware-users'],
    linkedSuppliers: [[]],
    isDeleted: [false],
    lastLogin: [''],
    token: ['']
  });

  constructor(private fb: FormBuilder,
              private _ActivatedRoute:ActivatedRoute,
              private api: ApiClient,
              private router: Router) { }

  ngOnInit(): void {
    this.userId = this._ActivatedRoute.snapshot.paramMap.get("id");

    this.suppliersSearchCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300)
    ).subscribe(()=> {
      this.loadFilteredSuppliersData(this.suppliersSearchCtrl.value);
    })

    this.loadUserData(this.userId);
  }

  removeSupplierFromUser(item: any): void {
/*    const index = this.userForm.value.linkedSuppliers?.indexOf(item);
    if (typeof(index) == "number" && index >= 0) {
      this.userForm.value.linkedSuppliers?.splice(index, 1);
    }*/
  }

  supplierAutocompleteSelected(event: MatAutocompleteSelectedEvent): void {
    console.log(event.option.value.id);
    this.userForm.value.linkedSuppliers.push({id: event.option.value.id, name: event.option.viewValue});
    //this.userForm.value.linkedSuppliers.set(event.option.value.id, event.option.viewValue);
    this.suppliersSearchInput.nativeElement.value = '';
    this.suppliersSearchCtrl.setValue(null);
  }

  onSubmit(): void {
    if (!this.userId) {
      console.log("submitting " + this.userForm.value.username + " by ID " + this.userId + " with data: " + JSON.stringify(this.userForm.value));
      this.api.addUser(this.userForm.value).subscribe(x => {
        this.router.navigate([`/users`]);
      });
    }
    console.log("submitting " + this.userForm.value.username + " by ID " + this.userId + " with data: " + JSON.stringify(this.userForm.value));
    this.api.updateUser(this.userId, this.userForm.value).subscribe(x => {
      this.router.navigate([`/users`]);
    });
    return;
  }

  private loadUserData(userId: string) {
    this.api.getUserById(userId).subscribe( x => {
        const user = x.body;
        this.userForm.setValue(user);
    })
  }

  private loadFilteredSuppliersData(searchQuery: string) {
    console.log("querying: " + searchQuery);
    this.filteredSuppliers = this.api.getSuppliers(searchQuery, 0, 15, "SupplierName", "asc")
      .pipe(
        map(res => {
          return res.body.data;
        })
      );
  }
}
