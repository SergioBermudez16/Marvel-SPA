import { Component, OnInit } from '@angular/core';
import { CharactersApiService } from 'src/app/services/characters/characters-api.service';
import { Subscription } from 'rxjs';
import { Comic } from './favorite';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  favoriteComics: Comic[] = [];
  isLoading=true;
  private subscription: Subscription;

  constructor(
    private characterService: CharactersApiService
  ) { }

  ngOnInit(): void {
    this.subscription = this.characterService.OBSERVABLE_FAVORITE_COMICS
      .subscribe(item => {
        this.favoriteComics = item;
        this.isLoading=false;
      });
  }

  deleteFromFavorites(id:number): void {
    this.characterService.FAVORITE_COMICS = this.characterService.FAVORITE_COMICS.filter(t => t.id != id);
    this.characterService.comicsChange();
  }
}
