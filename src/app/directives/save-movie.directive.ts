import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSaveMovie]'
})
export class SaveMovieDirective {
 
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseOver(){
    this.renderer.setStyle(this.el.nativeElement, 'color', 'rgba(0,0,0,0.7)')
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'color 0.3s')
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer')
  }

  @HostListener('mouseleave') onMouseLeave(){
    this.renderer.setStyle(this.el.nativeElement, 'font-size', 'x-large')
    this.renderer.setStyle(this.el.nativeElement, 'color', 'rgba(0, 0, 0, 0.3)')
  }
}
