export interface ItemModel{
    name: string,
    runTime: number,
    category: string[],
    rating?: {id: string, rating: number}[],
    comments?: {name: string, comment: string}[],
    description: string,
    director: string,
    photo: string,
    trailer: string,
    year: number,
    id?: string
  } 

  export interface User{
    firstName: string
    lastName: string
    photo: string
    savedMovies: ItemModel[]
    role: 'user'
    email?: string
    uid?: string
  }
