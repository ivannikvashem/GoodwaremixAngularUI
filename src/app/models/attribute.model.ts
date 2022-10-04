
export class Attribute {
  id: string
  supplierId: string
  supplierName: string
  unit: string
  type: string
  fixed: boolean
  nameAttribute: string
  etimFeature: string
  etimUnit: string
  rating: number
  allValue: string[] = []
  possibleAttributeName: string[] = []
  createdAt: Date
  updatedAt: Date
}
