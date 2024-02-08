import {MatPaginatorIntl} from "@angular/material/paginator";

const ruRangeLabel = (page:number, pageSize:number, length:number) => {
  if (length == 0 || pageSize == 0) { return `0 из ${length}`; }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ?
    Math.min(startIndex + pageSize, length) :
    startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} из ${length}`;
}

export function getRuPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = '';
  paginatorIntl.nextPageLabel = 'Следующая';
  paginatorIntl.previousPageLabel = 'Предыдущая страница';
  paginatorIntl.firstPageLabel = 'В начало'
  paginatorIntl.lastPageLabel = 'В конец'
  paginatorIntl.getRangeLabel = ruRangeLabel;

  return paginatorIntl;
}
