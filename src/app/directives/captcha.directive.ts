import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCaptcha]'
})
export class CaptchaDirective {

  @Input() captcha = '';

  constructor(private readonly elementRef: ElementRef,
    private renderer: Renderer2) { }

  ngAfterViewInit(){
    
  }
}