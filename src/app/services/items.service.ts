import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ItemModel } from '../interfaces/interfaces';


@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  itemToAdd: Subject<ItemModel> = new Subject<ItemModel>()

  constructor(private http: HttpClient) { }

  createItem(item: ItemModel): Observable<ItemModel>{
    return this.http.post<ItemModel>("https://projekt-internship-default-rtdb.europe-west1.firebasedatabase.app/items.json",item)
  }

  getItems(): Observable<ItemModel[]>{
    return this.http.get<ItemModel[]>("https://projekt-internship-default-rtdb.europe-west1.firebasedatabase.app/items.json")
  }

  getItem(id: String):  Observable<ItemModel>{
    return this.http.get<ItemModel>("https://projekt-internship-default-rtdb.europe-west1.firebasedatabase.app/items/"+id+".json")
  }

  editItem(id: string, item: ItemModel): Observable<ItemModel>{
    return this.http.patch<ItemModel>("https://projekt-internship-default-rtdb.europe-west1.firebasedatabase.app/items/"+id+".json", 
    {
      'name': item.name,
      'runtime': item.runTime,
      'category': item.category,
      'description': item.description,
      'director': item.director,
      'photo': item.photo,
      'trailer': item.trailer,
      'year': item.year
    })
  }

  rateItem(id: string, rating: {id: string, rating: number}[]){
    return this.http.patch("https://projekt-internship-default-rtdb.europe-west1.firebasedatabase.app/items/"+id+".json", {'rating' :rating})
  }

  addComment(id: string, comment: {name: string, comment: string}[]){
    return this.http.patch("https://projekt-internship-default-rtdb.europe-west1.firebasedatabase.app/items/"+id+".json", {'comments' :comment})
  }

  delete(item: ItemModel): Observable<ItemModel>{
    return this.http.delete<ItemModel>("https://projekt-internship-default-rtdb.europe-west1.firebasedatabase.app/items/"+item.id+".json")
  }
}
