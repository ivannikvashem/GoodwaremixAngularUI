import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Category} from "../../models/category.model";
import {CategoryTreeModel} from "../../models/categoryTree.model";
import {CategoryDataSource} from "../../category/repo/CategoryDataSource";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs";

@Component({
  selector: 'app-category-autocomplete',
  templateUrl: './category-autocomplete.component.html',
  styleUrls: ['./category-autocomplete.component.scss']
})
export class CategoryAutocompleteComponent {
  searchCategoryCtrl = new FormControl<string | Category>('')
  categoryListTree:CategoryTreeModel[] = []
  @Input() appearance:any = 'fill';
  @Input() selectedCategoryId:string;
  @Output() onCategorySelectedId:EventEmitter<string> = new EventEmitter();

  constructor(private categoryDS: CategoryDataSource) {
  }

  ngOnInit(): void {
    if (this.selectedCategoryId) {
      this.categoryDS.getCategoryById(this.selectedCategoryId).subscribe((category: Category) => {
        this.searchCategoryCtrl.setValue(category);
      })
    }

    this.searchCategoryCtrl.valueChanges.pipe(
      distinctUntilChanged(), debounceTime(300),
      switchMap(value => this.categoryDS.loadAutocompleteData(value ? value.toString() : '', 0, 50))
    ).subscribe((data: any) => {
      this.categoryListTree = data;
    });
  }

    onCategorySelected() {
    if (this.searchCategoryCtrl.value) {
      this.onCategorySelectedId.next((this.searchCategoryCtrl.value as Category).id);
    }
  }


  displayCategoryFn(category: any): string {
    return category && category.title;
  }

  clearSelection() {
    this.searchCategoryCtrl.setValue(null);
    this.onCategorySelectedId.next(null);
  }
}
