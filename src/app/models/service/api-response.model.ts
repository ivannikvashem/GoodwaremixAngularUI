import {Attribute} from "../attribute.model";
import {Supplier} from "../supplier.model";
import {Category} from "../category.model";
import {Log} from "../../log/models/log.model";
import {SchedulerTask} from "../schedulerTask.model";
import {UnitConverter} from "../unitConverter.model";

export class ApiResponseModel {
  pageNumber: number;
  pageSize: number;
  data: Attribute[] | Supplier[] | Category[] | Document[] | Log[] | SchedulerTask[] | UnitConverter[];
  totalRecords: number;

  constructor(pageNumber:number, pageSize:number, data:Attribute[] | Supplier[] | Category[] | Document[] | Log[] | SchedulerTask[] | UnitConverter[], totalRecords:number) {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.data = data;
    this.totalRecords = totalRecords;
  }
}
