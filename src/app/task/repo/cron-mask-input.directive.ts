import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appMaskInput]'
})
export class CronMaskInputDirective {

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const input = event.target;
    const inputValue = input.value;
    input.value = this.applyMask(inputValue);
  }

  applyMask(value: string): string {
    const cleanedValue = value.replace(/\s/g, '');
    const groups = cleanedValue.match(/.{1}/g);
    return groups ? groups.join(' ') : '';
  }
}
