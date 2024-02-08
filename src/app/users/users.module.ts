import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserIndexComponent } from './user-index/user-index.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatLegacyPaginatorModule as MatPaginatorModule} from "@angular/material/legacy-paginator";
import {ReactiveFormsModule} from "@angular/forms";
import {MatLegacyTableModule as MatTableModule} from "@angular/material/legacy-table";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatIconModule} from "@angular/material/icon";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import {MatLegacyChipsModule as MatChipsModule} from "@angular/material/legacy-chips";
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from "@angular/material/legacy-autocomplete";
import {MatLegacyTooltipModule as MatTooltipModule} from "@angular/material/legacy-tooltip";
import {MatLegacyDialogModule as MatDialogModule} from "@angular/material/legacy-dialog";
import {UserComponent} from "./user.component";

@NgModule({
  declarations: [
    UserComponent,
    UserIndexComponent,
    UserDetailsComponent,
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatDialogModule
  ]
})
export class UsersModule { }
