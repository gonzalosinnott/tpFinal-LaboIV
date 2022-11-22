import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appUserStyle]'
})
export class UserTypeStyleDirective {

  @Input() role = '';

    constructor(private readonly elementRef: ElementRef,
      private renderer: Renderer2) { }

    ngAfterViewInit(){
      const colors:any = {Patient: 'rgb(99 86 194)', Doctor:'rgb(194 99 86)', Admin:'rgb(86 194 99)'}
      this.renderer.setStyle(
        this.elementRef.nativeElement,
        'background-color',
        colors[this.role!],
      );
    }
}