import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuardGuard } from './core/guards/admin.guard';
import { HomeGuardGuard } from './core/guards/home.guard';
import { LayoutComponent } from './layout/layout.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginFormComponent },
  {
    path: '', component: LayoutComponent, children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        canActivate: [HomeGuardGuard]
      },
      {
        path: 'details/:id',
        loadChildren: () => import('./detailed-page/detailed-page.module').then(m => m.DetailedPageModule),
        canActivate: [HomeGuardGuard]
      },
      {
        path: 'userprofile',
        loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule),
        canActivate: [HomeGuardGuard]
      },
      {
        path: 'admin',
        loadChildren: () => import('./admin-page/admin-page.module').then(m => m.AdminPageModule),
        canActivate: [AdminGuardGuard]
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
