import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CharactersApiService } from 'src/app/services/characters/characters-api.service';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit {

  isLoading = true;
  character: any;
  characterComics: any[] = [];
  constructor(
    private characterService: CharactersApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.characterService.CHARACTER_ID = params['id'];
      this.characterService.getCharacter().subscribe(res => {
        this.character = res;
        console.log(res);
        if (this.character.comics.items.length > 0) {
          this.character.comics.items.forEach(element => {
            this.characterService.COMIC_ID = element.resourceURI.substring(element.resourceURI.lastIndexOf('/') + 1);
            this.characterService.getComic().subscribe(res => {
              this.characterComics.push(res);
            })
          });
        }
        this.isLoading = false;
      });
    });
  }

}
