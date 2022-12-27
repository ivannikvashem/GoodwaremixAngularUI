import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ObjectFormDataConverterService {
  formData:FormData = new FormData();
  constructor() {
  }

  productEntriesIteration(object:object, j:number, nestedKey:string) {
    Object.entries(object).forEach(([key, value], i)=> {
      if (value) {
        if (typeof value == "string") {
          this.appendSingleField(key, nestedKey,j,value);
        }
        else if (typeof value == "number") {
          if ( Number(value) === Number(value) && Number(value) !== (Number(value) | 0)) {
            value = value.toString().replace(".", ',')
          }
          this.appendSingleField(key,nestedKey,j,value)
        }
        else if (typeof value.getMonth === 'function') {
          this.appendSingleField(key, nestedKey, j, value.toISOString())
        }
        else if (Array.isArray(value)) {
          for (let val in value) {
            if (typeof value[val] == "object") {
              this.productEntriesIteration(value[val],  Number(val), key)
            }
            else if (typeof value[val] == "number"){
              this.appendSingleField(key, nestedKey, j, value[val])
            }
            else {
              this.appendSingleField(key, nestedKey, j, value[val])
            }
          }
        } else if (typeof value == "object") {
          this.productEntriesIteration(value, -1, key)
        }
      }
    })
    return this.formData
  }

  appendSingleField(key:string, nestedKey:string, i:number, value:any) {
    if (i == null) {
      this.formData.append('product.'+key+'',value)
    } else if (i == -1) {
      this.formData.append('product.'+nestedKey+'.'+key,value)
    } else {
      this.formData.append('product.'+nestedKey+'['+i+'].'+key,value)
    }
  }
}
