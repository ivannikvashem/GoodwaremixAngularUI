import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
  ],
  exports: [
  ],
  imports: [
    SharedModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ]
})
export class SettingsModule { }
