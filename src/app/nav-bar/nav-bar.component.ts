import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, fromEvent } from 'rxjs';
import {
  shareReplay,
  debounceTime,
  map,
  distinctUntilChanged,
  filter
} from "rxjs/operators";
import { Router, Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart } from '@angular/router';
import { FormControl } from '@angular/forms';
import { CharactersApiService } from '../services/characters/characters-api.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  @ViewChild('characterSearchInput', { static: true }) characterSearchInput: ElementRef;
  apiResponse: any;
  favoritesDisplayed = false;
  isSearching: boolean;
  sortedBy = "";
  loading = true;
  searchBarControl: FormControl = new FormControl('');

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  get isFavoritesDisplayed(): boolean {
    return this.favoritesDisplayed;
  }

  constructor(private breakpointObserver: BreakpointObserver,
    private router: Router,
    private characterService: CharactersApiService) {

    this.isSearching = false;
    this.apiResponse = [];


    router.events.subscribe((routerEvent: Event) => {
      this.checkRouterEvent(routerEvent);
    });
  }
  ngOnInit(): void {

    fromEvent(this.characterSearchInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , filter(res => res.length >= 0)
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      this.isSearching = true;
      this.searchGetCall(text);
    });

    if (this.favoritesDisplayed) {
      this.router.navigate([{
        outlets: {
          primary: ['home'],
          sideRouter: ['favorites']
        }
      }]);
    }
  }


  checkRouterEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      this.loading = true;
    }

    if (routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError) {
      this.loading = false;
    }
  }

  displayFavorites(): void {
    this.router.navigate([{ outlets: { sideRouter: ['favorites'] } }]);
    this.favoritesDisplayed = true;
  }

  getCharacters(): void {
    this.characterService.IS_LOADING=true;
    this.characterService.CHARACTERS = [];
    var allCharacters = [];
    this.characterService.getAllCharacters().subscribe(res => {
      res.forEach(element => {
        allCharacters = allCharacters.concat(element);
      });
      if (this.characterService.SEARCH_TEXT) {
        let searchText = this.characterService.SEARCH_TEXT;
        this.characterService.CHARACTERS = allCharacters.filter(function (item, i, array) {
          let arrayItem = item.name.toLowerCase();
          return arrayItem.includes(searchText);
        });
      }
      else {
        this.characterService.CHARACTERS = allCharacters;
      }
      this.characterService.IS_LOADING=false;
      console.log("service completed"), (error: any) => console.log(error)
      this.characterService.charactersChange();
    });
  }

  hideFavorites(): void {
    this.router.navigate([{ outlets: { sideRouter: null } }]);
    this.favoritesDisplayed = false;
  }

  onSelectChange(value: string): void {
    if (this.characterService.ORDER_BY != value) {
      this.characterService.ORDER_BY = value;
      this.sortedBy=value;
      this.getCharacters();
    }
  }

  searchGetCall(term: string): void {
    this.characterService.SEARCH_TEXT = term;
    this.getCharacters();
  }
}
