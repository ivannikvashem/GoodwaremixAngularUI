import {Category} from "./category.model";

export class CategoryTreeModel {
  categories:Category[];

  constructor(categories:Category[]) {
    this.categories = categories;
  }
}
