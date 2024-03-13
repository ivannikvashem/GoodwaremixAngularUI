export class SettingsModel {
  scrollPageToTop:boolean;
  menuState:boolean;
  isPaginatorFixed:boolean;

  constructor(scrollPageToTop:boolean, menuState:boolean, isPaginatorFixed:boolean) {
    this.scrollPageToTop = scrollPageToTop;
    this.menuState = menuState;
    this.isPaginatorFixed = isPaginatorFixed;
  }
}
