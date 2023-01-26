import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appSaveMovie]'
})
export class SaveMovieDirective {
  constructor(private el: ElementRef) {
    this.el.nativeElement.style.color = 'red';
   }

}
