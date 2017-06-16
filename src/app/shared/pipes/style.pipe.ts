import {Pipe, PipeTransform, Component, NgModule} from '@angular/core'
import {BrowserModule, DomSanitizer} from '@angular/platform-browser'

@Pipe({ name: 'style' })
export class StylePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(style) {
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }
}
