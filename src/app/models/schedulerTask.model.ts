import {Time} from "@angular/common";

export class SchedulerTask {
  id:string
  supplierId:string
  nameTask:string
  description:string
  takeConfig:string
  startAt:Date
  nextDateTask:Date
  hours:number
  minutes:number
  seconds:number
  isEnable:boolean
}
