import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { DetailedPageComponent } from './detailed-page/detailed-page.component';
import { AdminGuardGuard } from './core/guards/admin.guard';
import { HomeGuardGuard } from './core/guards/home.guard';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { SavedMoviesComponent } from './saved-movies/saved-movies.component';
import { AddOrEditFormComponent } from './shared/add-or-edit-form/add-or-edit-form.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginFormComponent },
  {
    path: '', component: LayoutComponent, children: [
      { path: 'home', component: HomeComponent , canActivate: [HomeGuardGuard]},
      { path: 'details/:id', component: DetailedPageComponent },
      { path: 'savedmovies', component: SavedMoviesComponent },
        {
    path: 'admin', component: AdminPageComponent, canActivate: [AdminGuardGuard], children: [
      {
        path: 'addoredit/:id', component: AddOrEditFormComponent
      },
    ]
  }
    ]
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
