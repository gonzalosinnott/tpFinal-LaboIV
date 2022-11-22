import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMouseOver]'
})
export class MouseOverDirective {

    constructor(private readonly elementRef: ElementRef,
      private renderer: Renderer2) { }

      @HostListener('mouseenter') mouseover(){
        this.renderer.setStyle(this.elementRef.nativeElement, 'transform', 'scale(1.75)');
  
      }
  
      @HostListener('mouseleave') mouseleave(){
        this.renderer.setStyle(this.elementRef.nativeElement, 'transform', 'scale(1)');
      }
}