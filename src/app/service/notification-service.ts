import {MatLegacySnackBar as MatSnackBar, MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition} from "@angular/material/legacy-snack-bar";
import {Injectable} from "@angular/core";
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end'
  verticalPosition: MatSnackBarVerticalPosition = 'top'

  constructor(private _snackBar: MatSnackBar) {}

  onSuccess(message:string) {
    this._snackBar.open(message,'', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition:this.verticalPosition,
      duration: 3000,
      panelClass: ['success-snackbar']
    })
  }

  onWarning(message:string) {
    this._snackBar.open(message,'', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition:this.verticalPosition,
      duration: 5000,
      panelClass: ['warning-snackbar']
    })
  }

  onError(message:string) {
    this._snackBar.open(message,'', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition:this.verticalPosition,
      duration: 5000,
      panelClass: ['error-snackbar']
    })
  }
}
