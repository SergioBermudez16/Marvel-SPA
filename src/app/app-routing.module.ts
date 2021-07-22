import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CharacterComponent } from './views/character/character.component';
import { HomeComponent } from './views/home/home.component';
import { PageNotFoundComponent } from './page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, runGuardsAndResolvers: "always", data: { preload: false } },
  {
    path: 'character',
    children: [
      { path: '', component: PageNotFoundComponent },
      { path: ':id', component: CharacterComponent }
    ]
  },
  { path: '**', component: PageNotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
