import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appSaveMovie]'
})
export class SaveMovieDirective {
@Input() color!: string;
  constructor(private el: ElementRef) {
    this.el.nativeElement.style.color = this.color;
   }

}
