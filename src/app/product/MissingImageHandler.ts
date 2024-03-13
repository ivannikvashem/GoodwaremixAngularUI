import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class MissingImageHandler {
  constructor(private http:HttpClient) {
  }

  checkImgStatus($event:Event) {
    this.http.get(($event.target as HTMLImageElement).src).subscribe(() => { }, error => {
      if (error.status == 200) {
        ($event.target as HTMLImageElement).src='./assets/imgPlaceholder.png'
      }
      else {
        ($event.target as HTMLImageElement).alt = ($event.target as HTMLImageElement).src
      }
    })
  }
}
