import {Attribute} from "./attribute.model";

export class AttributeFiltration {
  attribute: Attribute
  value: string

  constructor() {
    this.attribute = new Attribute()
  }
}
