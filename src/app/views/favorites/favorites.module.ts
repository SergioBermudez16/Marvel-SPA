import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FavoritesComponent } from './favorites.component'
import { CommonModule } from '@angular/common';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
  imports: [
    CommonModule,
    MDBBootstrapModule,
    RouterModule.forChild([
      {
        path: 'favorites',
        component: FavoritesComponent,
        outlet: 'sideRouter'
      }
    ])
  ],
  declarations: [
    FavoritesComponent
  ]
})
export class FavoritesModule { }
