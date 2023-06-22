import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {debounceTime, distinctUntilChanged, Observable} from "rxjs";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map} from "rxjs/operators";
import {ApiClient} from "../../service/httpClient";
import {Supplier} from "../../models/supplier.model";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  userId: string = "";
  filteredSuppliers: Observable<Supplier[]>;
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

    this.loadFilteredSuppliersData('')

    this.suppliersSearchCtrl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(300)
    ).subscribe(()=> {
      this.loadFilteredSuppliersData(this.suppliersSearchCtrl.value);
    })

    if (this.userId) {
      this.loadUserData(this.userId);
    }
  }

  removeSupplierFromUser(item: any): void {
    const index = this.userForm.value.linkedSuppliers?.indexOf(item);
    if (typeof(index) == "number" && index >= 0) {
      this.userForm.value.linkedSuppliers?.splice(index, 1);
    }
  }

  supplierAutocompleteSelected(event: MatAutocompleteSelectedEvent): void {
    const value = (event.option.value.id || '').trim();
    const idx = this.userForm.value.linkedSuppliers.find(x => x.id == value);
    if (!idx) {
      this.userForm.value.linkedSuppliers.push({id: event.option.value.id, name: event.option.viewValue});
    }
    this.suppliersSearchInput.nativeElement.value = '';
    this.suppliersSearchCtrl.setValue(null);
  }

  onSubmit(): void {
    if (!this.userId) {
      console.log("submitting " + this.userForm.value.username + " by ID " + this.userId + " with data: " + JSON.stringify(this.userForm.value));
      this.api.addUser(this.userForm.value).subscribe(() => {
        this.router.navigate([`/users`]);
      });
    }
    console.log("submitting " + this.userForm.value.username + " by ID " + this.userId + " with data: " + JSON.stringify(this.userForm.value));
    this.api.updateUser(this.userId, this.userForm.value).subscribe(() => {
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
    this.filteredSuppliers = this.api.getSuppliers(searchQuery, 0, 100, "supplierName", "asc")
      .pipe(
        map(res => {
          return res.body.data;
        })
      );
  }

  selectAll() {
    this.filteredSuppliers.subscribe(x => {
      for (let i of x) {
        const idx = this.userForm.value.linkedSuppliers.find(x => x.id == i.id);
        if (!idx) {
          this.userForm.value.linkedSuppliers.push({id: i.id, name: i.supplierName});
        }
      }
    })
  }
}
