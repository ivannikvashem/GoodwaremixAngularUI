import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiClient } from 'src/app/repo/httpClient';
import { ActivatedRoute } from "@angular/router";
import { catchError, map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-supplier-edit',
  templateUrl: './supplier-edit-mw.component.html',
  styleUrls: ['./supplier-edit-mw.component.css']
})
export class SupplierEditMwComponent implements OnInit {

  filteredOptions?: Observable<string[]>;
  attr: Array<Object> | undefined;
  myControl = new FormControl('');
  supplierName: string | any;
  substitute: Object | any;
  attrWithSupp: string[];
  helper: helper | any;
  errorMessage: string;
  searchQuery: string;
  pageNumber: number;
  pageSize: number;
  attributes: any;
  fixed: boolean;
  body: any;

  //Для чекбоксов
  connectionCheck: boolean;
  dictionaryCheck: boolean;
  nettParamCheck: boolean;
  suppcodeCheck: boolean;
  productCheck: boolean;
  categCheck: boolean;
  attrCheck: boolean;
  docsCheck: boolean;
  packCheck: boolean;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    public api: ApiClient,
    private snackBar: MatSnackBar,
  ) {
    this.errorMessage = '';
    this.attrWithSupp = [];
    this.searchQuery = '';
    this.attributes = [];
    this.pageNumber = 0;
    this.pageSize = 10;
    this.fixed = true;

    //Для чекбоксов
    this.connectionCheck = true;
    this.dictionaryCheck = true;
    this.nettParamCheck = true;
    this.suppcodeCheck = true;
    this.productCheck = true;
    this.categCheck = true;
    this.attrCheck = true;
    this.docsCheck = true;
    this.packCheck = true;
  }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngOnInit(): void {
    this.supplierName = this._ActivatedRoute.snapshot.paramMap.get("supplierName");
    this.api.getSupplierByName(this.supplierName)
      .subscribe((response) => {
        this.body = response.body;
        this.attr = this.body.supplierConfigs.attributeConfig.productAttributeKeys;
      });
  }

  PostData() {
    this.body.supplierConfigs.productAttributeKeys = this.attr;
    this.api.postSupplier(this.body).subscribe({
      next: (next: any) => {
        this.snackBarMessage('Данные сохранены успешно');
      },
      error: (error: any) => {
        this.errorMessage = error.message;
        this.snackBarMessage(error.message);
      },
    }
    );
  }

  OnDelete(index: number) {
    this.attr?.splice(index, 1);
  }

  OnAdd() {
    this.substitute = new Object();
    this.attr?.push(this.substitute);
  }

  UpdateAutocomplete(searchQuery: string) {
    this.api.getAttributes(searchQuery, '', this.pageNumber, this.pageSize, this.fixed, 'Rating', 'desc')
      .subscribe((response) => {
        this.attributes = response.body.data;
      });
  }


  FillAutoComplete() {
    this.api.getAttributes("", '', this.pageNumber, this.pageSize, this.fixed, 'Rating', 'desc')
      .subscribe((response) => {
        this.attributes = response.body.data;
      });
  }

  snackBarMessage(message: string) {
    this.snackBar.open(message, 'Ок', {
      duration: 6000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
    this.snackBar._openedSnackBarRef?.onAction().subscribe(() => {
      window.location.reload();
    });
    setTimeout(() => { window.location.reload() }, 6000)

  }
}

interface helper {
  nameAttribute: string;
  supplierName: string;
  rating: number;
  fixed: string;
}
