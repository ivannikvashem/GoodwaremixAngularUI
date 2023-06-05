
export class AttributeProduct {
  attributeId: string;
  attributeName: string;
  etimFeature: string;
  etimValue: any;
  etimUnit: string;
  unit: string;
  type: string;
  objectValue:any = {} as AttributeProductValueLogic | {} as AttributeProductValueNumber | {} as AttributeProductValueRange | {} as AttributeProductValueText;

  constructor() {
    this.objectValue = new AttributeProductValueLogic()
  }
}

export class AttributeProductValueLogic {
  value: boolean;
  constructor() {
    this.value = false;
  }
}


export class AttributeProductValueNumber {
  value: number;
  constructor() {
    this.value = 0;
  }
}


export class AttributeProductValueRange {
  maxValue:number;
  minValue:number;
  constructor() {
    this.maxValue = 1;
    this.minValue = 0;
  }
}


export class AttributeProductValueText {
  value:string;
  constructor() {
    this.value = '';
  }
}

