import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {Injectable} from "@angular/core";
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end'
  verticalPosition: MatSnackBarVerticalPosition = 'top'
  durationInSeconds = 3;

  constructor(private _snackBar: MatSnackBar) {
  }

  onSuccess(message:string) {
    this._snackBar.open(message,'', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition:this.verticalPosition,
      duration: 3000
    })
  }

  onWarning(message:string) {
    this._snackBar.open(message,'', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition:this.verticalPosition,
      duration: 5000
    })
  }

  onError(message:string) {
    this._snackBar.open(message,'', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition:this.verticalPosition,
      duration: 5000
    })
  }
}
