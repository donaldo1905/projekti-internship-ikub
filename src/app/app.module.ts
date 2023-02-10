import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginFormComponent } from './core/authentication/login-form/login-form.component';
import {MatButtonModule} from  '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatInputModule} from  '@angular/material/input';
import {MatCardModule} from  '@angular/material/card'; 
import {MatSliderModule} from  '@angular/material/slider';
import {MatIconModule} from '@angular/material/icon'
import { HomeComponent } from './home/home.component';
import { AngularFireModule } from '@angular/fire/compat';
import {  HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './core/authentication/auth-interceptor.service';
import {MatSelectModule} from '@angular/material/select';
import { LatestPipe } from './shared/pipes/latest.pipe';
import { AddOrEditFormComponent } from './shared/components/add-or-edit-form/add-or-edit-form.component';
import { DetailedPageComponent } from './home/detailed-page/detailed-page.component';
import { SafePipe } from './shared/pipes/safe-pipe.pipe';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { MatTableModule } from '@angular/material/table';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { NavbarComponent } from './layout/navbar/navbar.component'
import { environment } from 'src/environments/environment';
import { ToastrModule } from 'ngx-toastr';
import { LayoutComponent } from './layout/layout.component';
import { SaveMovieDirective } from './shared/directives/save-movie.directive';
import { CommonModule } from '@angular/common';
import { FilterFormComponent } from './home/filter-form/filter-form.component';
import { CardComponent } from './shared/components/card/card.component';
import { AdminPageModule } from "./admin-page/admin-page.module";
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
    declarations: [
        AppComponent,
        LoginFormComponent,
        HomeComponent,
        LatestPipe,
        AddOrEditFormComponent,
        DetailedPageComponent,
        SafePipe,
        UserProfileComponent,
        AdminPageComponent,
        NotFoundComponent,
        NavbarComponent,
        LayoutComponent,
        SaveMovieDirective,
        FilterFormComponent,
        CardComponent
    ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MatButtonModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatCardModule,
        MatDialogModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatTableModule,
        MatIconModule,
        MatSelectModule,
        CommonModule,
        ToastrModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebase),
        AdminPageModule
    ]
})
export class AppModule { }
 