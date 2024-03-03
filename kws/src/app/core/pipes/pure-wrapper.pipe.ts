import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'pure',
  standalone: true,
  pure: true,
})
export class PureWrapperPipe implements PipeTransform {
  transform(callback: Function, ...args: any[]): string {
    return callback(...args);
  }
}
