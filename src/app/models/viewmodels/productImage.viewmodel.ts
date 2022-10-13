import {Product} from "../product.model";
import {AttributeProduct} from "../attributeProduct.model";

export class ProductImageViewmodel {
  product: Product
  files: File[]

  constructor() {
    this.product = new Product()
    this.files = [] as File[]

  }
}
