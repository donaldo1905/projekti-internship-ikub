import { Pipe, PipeTransform } from '@angular/core';
import { ItemModel } from '../core/interfaces/interfaces';

@Pipe({
  name: 'latest'
})
export class LatestPipe implements PipeTransform {

  transform(value: ItemModel[], ...args: any[]): ItemModel[] {
    return value.reverse();
  }

}
