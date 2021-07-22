import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Comic } from '../../views/favorites/favorite';

@Injectable({
  providedIn: 'root'
})
export class CharactersApiService {

  CHARACTERS: any[] = [];
  CHARACTER_ID = '';
  COMIC_ID = '';
  FAVORITE_COMICS: Comic[] = [];
  HASH = '5dd77d4c4846e5ac22a107796c3f5a1b';
  IS_LOADING = true;
  OBSERVABLE_CHARACTERS;
  OBSERVABLE_FAVORITE_COMICS;
  OFFSET = 0;
  ORDER_BY = "";
  PUBLIC_KEY = 'e9921ab8ade8beabec531dc4991b8d72';
  SEARCH_TEXT = '';
  URL_API = "https://gateway.marvel.com:443/v1/public/";

  constructor(
    private http: HttpClient
  ) {
    this.OBSERVABLE_CHARACTERS = new BehaviorSubject<any[]>(this.CHARACTERS);
    this.OBSERVABLE_FAVORITE_COMICS = new BehaviorSubject<Comic[]>(this.FAVORITE_COMICS);
  }

  charactersChange() {
    this.OBSERVABLE_CHARACTERS.next(this.CHARACTERS);
  }

  comicsChange() {
    this.OBSERVABLE_FAVORITE_COMICS.next(this.FAVORITE_COMICS);
  }

  getAllCharacters(): Observable<any> {
    var allCharacters = [];
    var characters;
    for (let i = 0; i < 1500; i += 100) {
      this.OFFSET = i;
      characters = this.http.get<any>(this.URL_API + "characters?" +
        (this.ORDER_BY != "" ? "orderBy=" + this.ORDER_BY + "&" : "") +
        "limit=100&offset=" + this.OFFSET + "&apikey=" + this.PUBLIC_KEY +
        "&hash=" + this.HASH)
        .pipe(map((data: any) => data.data.results));
      allCharacters = allCharacters.concat(characters);
    }
    return forkJoin(allCharacters);
  }

  getCharacter(): Observable<any> {
    return this.http.get<any>(this.URL_API + "characters/" + this.CHARACTER_ID +
      "?&apikey=" + this.PUBLIC_KEY + "&hash=" + this.HASH)
      .pipe(map((data: any) => data.data.results[0]));
  }

  getComic(): Observable<any> {
    return this.http.get<any>(this.URL_API + "comics/" + this.COMIC_ID + "?&apikey=" +
      this.PUBLIC_KEY + "&hash=" + this.HASH)
      .pipe(map((data: any) => data.data.results[0]));
  }
}
