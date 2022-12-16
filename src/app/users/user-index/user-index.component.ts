import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {UsersDataSource} from "../repo/UsersDataSource";
import {Router} from "@angular/router";
import {
  ConfirmDialogComponent,
  ConfirmDialogModel
} from "../../components/shared/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ApiClient} from "../../service/httpClient";

@Component({
  selector: 'app-user-index',
  templateUrl: './user-index.component.html',
  styleUrls: ['./user-index.component.css']
})
export class UserIndexComponent implements OnInit {

  displayedColumns: string[] = ['username', 'name', 'role', 'linkedSuppliers', 'actions'];
  dataSource: UsersDataSource;

  constructor(private api: ApiClient,
              private router: Router,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.dataSource = new UsersDataSource(this.api);
    this.dataSource.loadPagedData(0,10, 'date', 'asc');
  }

  loadUsersList(): any {
    this.dataSource.loadPagedData( 0,  10);
  }

  deleteUser(id: string) {
    this.api.deleteUser(id).subscribe( x => {
      this.loadUsersList();
    });
  }

  goToAddUser() {
    this.router.navigate([`user-edit/`]);
  }

  goToEditUser(id:string) {
    this.router.navigate([`user-edit/${id}`]);
  }

  confirmDeleteDialog(id: any, title: string) {
    const message = `Удалить пользователя ` + title + `?`;
    const dialogData = new ConfirmDialogModel("Подтверждение", message);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "500px",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        console.log("Confirm deleting " + id);
        this.deleteUser(id)
      }
    });
  }
}
