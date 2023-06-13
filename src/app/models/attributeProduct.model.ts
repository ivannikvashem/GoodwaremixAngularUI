
export class AttributeProduct {
  attributeId: string;
  attributeName: string;
  etimFeature: string;
  etimValue: any;
  etimUnit: string;
  unit: string;
  type: string;
  objectValue:any = {} as AttributeProductValueLogic | {} as AttributeProductValueNumber | {} as AttributeProductValueRange | {} as AttributeProductValueText;
}

export class AttributeProductValueLogic {
  value: boolean;
}


export class AttributeProductValueNumber {
  value: number;
}


export class AttributeProductValueRange {
  maxValue:number;
  minValue:number;
}


export class AttributeProductValueText {
  value:string;
}

