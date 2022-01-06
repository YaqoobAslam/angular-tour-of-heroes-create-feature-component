import { Injectable } from '@angular/core';
import {Hero} from './hero';
import {HEROES} from './mock-heroes';
import {  Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private messageService: MessageService, private http: HttpClient) { }

  private heroesUrl = 'api/heroes';  // URL to web api

 // getHeroes with RxJs 'of() method

  // getHeroes(): Observable<Hero[]>{
  //  const heroes =  of( HEROES);
  //  this.messageService.add('HeroService: fetched heroes');
  //  return heroes;
  // }

  getHero(id: number): Observable<Hero> {

 

    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.

    // const hero = HEROES.find(h => h.id === id)!;
    // this.messageService.add(`HeroService: fetched hero id=${id}`);
    // return of(hero);

    /** GET hero by id. Will 404 if id not found */
    const url=`${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    )
  }
  private log(message: string){
    this.messageService.add(`HeroService: ${message}`);
  }

  /** GET heroes from the server */
   getHeroes(): Observable<Hero[]>{
      return  this.http.get<Hero[]>(this.heroesUrl)
     .pipe(
       tap(_ => this.log('fetched heroes')),
       catchError(this.handleError<Hero[]>('getHeroes', []))
     )
   }
 
/** PUT: update the hero on the server */
updateHero(hero: Hero): Observable<any> {
  return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
    tap(_ => this.log(`updated hero id=${hero.id}`)),
    catchError(this.handleError<any>('updateHero'))
  );
}

httpOptions ={
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

   /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
}
