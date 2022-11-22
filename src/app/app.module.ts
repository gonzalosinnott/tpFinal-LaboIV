import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { ToastrModule } from 'ngx-toastr';
import { SpinnerModule } from './components/spinner/spinner.module';
import { VerificationComponent } from './components/verification/verification.component';
import { SharedModule } from './components/common-module/common.module';
import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    VerificationComponent,
    NotFoundComponent,
    
  ],
  imports: [    
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    AngularFireModule.initializeApp(environment.firebase),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    ToastrModule.forRoot(),
    SpinnerModule,
    SharedModule,
  ],
  exports: [
    
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
