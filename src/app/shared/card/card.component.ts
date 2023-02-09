import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemModel } from 'src/app/core/interfaces/interfaces';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() item!: ItemModel;
  @Input() show!: boolean;
  @Input() removeIcon!: boolean
  @Output() emitItem: EventEmitter<string>= new EventEmitter<string>()
constructor(){}

addToRemove(parameter: string){
this.emitItem.emit(parameter)
}
}
