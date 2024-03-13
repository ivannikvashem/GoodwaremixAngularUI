import {Component, OnInit,} from '@angular/core';
import {UsersDataSource} from "../repo/UsersDataSource";
import {Router} from "@angular/router";
import {ConfirmDialogComponent, ConfirmDialogModel} from "../../components/shared/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ApiClient} from "../../service/httpClient";
import {UserDetailsComponent} from "../user-details/user-details.component";
import {UserInterface} from "../type/user.interface";

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
    this.api.deleteRequest(`users/${id}`).subscribe( () => {
      this.loadUsersList();
    });
  }

  goToAddUser() {
    this.router.navigate([`user-add/`]);
  }

  goToEditUser(user?:UserInterface) {
    //this.router.navigate([`user-edit/${id}`]);

    const dialogRef = this.dialog.open(UserDetailsComponent,  {
      minWidth: "600px",
      data: user
    })
    dialogRef.afterClosed().subscribe( result => {
      this.dataSource.onUserListUpdate(result)
    })
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
        this.deleteUser(id)
      }
    });
  }

  onPaginatorChange(page: any) {
    this.dataSource.loadPagedData(page.pageIndex, page.pageSize, '','')
  }
}
