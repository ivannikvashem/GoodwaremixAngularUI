import {Injectable} from "@angular/core";
import {LocalStorageRefService} from "./local-storage-ref.service";
import {BehaviorSubject} from "rxjs";

interface MyData {
  name: string
  age: number
}

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private _localStorage: Storage;

  private _myData$ = new BehaviorSubject<any>(null)
  public myData$ = this._myData$.asObservable()

  constructor(private _localStorageRefService: LocalStorageRefService) {
    this._localStorage = _localStorageRefService.localStorage
  }

/*  setInfo(data: MyData) {
    const jsonData = JSON.stringify(data)
    this._localStorage.setItem('myData', jsonData)
    this._myData$.next(data)
  }*/

/*  loadInfo() {
    const data = JSON.parse(this._localStorage.getItem('myData'))
    this._myData$.next(data)
  }*/

  getDataByPageName(name: string): any {
    const data = JSON.parse(this._localStorage.getItem(name));
    this._myData$.next(data);
    //console.log("got cookie: " + JSON.stringify(data));
  }

  setDataByPageName(pageName: string, data: any) {
    const jsonData = JSON.stringify(data)
    console.log('set data', jsonData)
    this._localStorage.setItem(pageName, jsonData)
    this._myData$.next(data)
    //console.log("set cookie: " + JSON.stringify(data));
    console.log('storage', this._localStorage)
    console.log('page name', pageName)
  }

  clearInfo() {
    this._localStorage.removeItem('myData')
    this._myData$.next(null)
  }

  clearAllLocalStorage() {
    this._localStorage.clear()
    this._myData$.next(null)
  }
}
