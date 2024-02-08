import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-unit-converter-edit',
  templateUrl: './unit-converter-edit.component.html'
})
export class UnitConverterEditComponent implements OnInit {

  form:FormGroup
  constructor(public dialogRef: MatDialogRef<UnitConverterEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = new FormGroup<any>({
      "sourceUnit": new FormControl<string>('', Validators.required),
      "targetUnit": new FormControl<string>('', Validators.required),
      "multiplier": new FormControl<number>(0, Validators.required),
    })
  }

  ngOnInit(): void {
    if (this.data.oldUnit) {
      this.form.get("sourceUnit").setValue(this.data.oldUnit.sourceUnit)
      this.form.get("targetUnit").setValue(this.data.oldUnit.targetUnit)
      this.form.get("multiplier").setValue(this.data.oldUnit.multiplier)
    }
  }

  onSubmitClick() {
    if (this.form.valid) {
      this.data.newUnit.sourceUnit = this.form.get("sourceUnit").value
      this.data.newUnit.targetUnit = this.form.get("targetUnit").value
      this.data.newUnit.multiplier = this.form.get("multiplier").value
      this.dialogRef.close(this.data)
    }
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}
