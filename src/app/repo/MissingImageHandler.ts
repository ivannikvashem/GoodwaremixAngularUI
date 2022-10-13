import {ApiClient} from "./httpClient";
import {Injectable} from "@angular/core";
@Injectable({
  providedIn: 'root'
})
export class MissingImageHandler {
  constructor(public api:ApiClient) {
  }

  checkImgStatus($event:Event) {
    this.api.checkImageStatusCode(($event.target as HTMLImageElement).src).subscribe(resp => { }, error => {
      if (error.status == 200) {
        ($event.target as HTMLImageElement).src='./assets/imgPlaceholder.png'
      }
      else {
        ($event.target as HTMLImageElement).alt = ($event.target as HTMLImageElement).src
      }
    })
  }
}
