import { Component, OnInit, TemplateRef } from '@angular/core';
import { CharactersApiService } from 'src/app/services/characters/characters-api.service';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { Comic } from '../favorites/favorite';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  characters: any[] = [];
  comicModalRef: BsModalRef;
  count = 0;
  favoriteComics: Comic[] = [];
  isComicListDisplayed=false;
  isLoading = true;
  selectedComic: Comic;
  pageSize = 10;
  pageNumber = 1;
  pageSizeOptions = [10];

  private subscription: Subscription;
  constructor(
    private modalService: BsModalService,
    private router: Router,
    public characterService: CharactersApiService,

  ) {
    this.characterService.getAllCharacters().subscribe(res => {
      res.forEach(element => {
        this.characters=this.characters.concat(element);
      });
      this.characterService.IS_LOADING=false;
      this.isLoading = characterService.IS_LOADING;
    });
  }

  public config: PaginationInstance = {
    itemsPerPage: 10,
    currentPage: 1
  };

  ngOnInit(): void {
    this.characterService.IS_LOADING=true;
    this.resetComic();

    this.subscription = this.characterService.OBSERVABLE_CHARACTERS
      .subscribe(item => {
        this.characters = item;
        console.log(this.characters);
      });
  }

  favoriteToogle(): void {
    if (this.selectedComic.isFavorite) {
      this.selectedComic.isFavorite = false;
      this.characterService.FAVORITE_COMICS = this.characterService.FAVORITE_COMICS.filter(t => t.id != this.selectedComic.id);
    }
    else {
      this.selectedComic.isFavorite = true;
      this.characterService.FAVORITE_COMICS.push(this.selectedComic);
    }
    this.characterService.comicsChange();
  }

  resetComic(): void {
    this.selectedComic = {
      id: 0,
      description: '',
      isFavorite: false,
      thumbnail: [],
      title: ''
    }
  }

  showCharacterDetails(id: number): void {
    this.characterService.CHARACTER_ID = id.toString();
    this.router.navigate(["/home/characters/" + id]);
  }

  showComicModal(template: TemplateRef<any>, comic: any): void {
    this.characterService.COMIC_ID = comic.resourceURI.substring(comic.resourceURI.lastIndexOf('/') + 1);
    this.characterService.getComic().subscribe(res => {
      this.selectedComic = {
        id: res.id,
        description: res.description,
        thumbnail: res.thumbnail,
        title: res.title,
        isFavorite: this.characterService.FAVORITE_COMICS.find(t => t.id == res.id) != undefined
      }
      this.comicModalRef = this.modalService.show(template,{class: 'modal-width'}),
        (error: any) => console.log(error)
    });
  }
}
