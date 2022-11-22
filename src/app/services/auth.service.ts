import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, signInWithEmailAndPassword, updateProfile, UserCredential } from "firebase/auth";
import { Auth } from '@angular/fire/auth';
import { User } from '../models/user';
import { StorageService } from './storage.service';
import { FirestoreService } from './firestore.service';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userCredential: UserCredential | any;
  userData: any; 

  constructor(public afauth: AngularFireAuth, 
              private router: Router, 
              private readonly auth: Auth,
              private firestoreService: FirestoreService,
              private storage: StorageService,
              private toastr: ToastrService,
              private spinnerService: SpinnerService) { 

   this.setLocalStorage();
  }

  setLocalStorage() {
    this.afauth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('userData', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('userData')!);        
      } else {
        localStorage.setItem('userData', 'null');
        JSON.parse(localStorage.getItem('userData')!);
      }
    });
  
  }

  async sendEmail() {
    this.userCredential = this.auth.currentUser;
    return await sendEmailVerification(this.userCredential).then((res) => { 
        this.toastr.success("Envio de correo de verificación exitoso");
      })
      .catch(e => { 
        this.toastr.error(e.message);
      })
      .finally(() => { });
  }

  async login(email: string, password: string) {
    this.spinnerService.show();
    return await signInWithEmailAndPassword(this.auth, email, password)
    .then(res => {
      if (res.user.emailVerified) {
        this.setLocalStorage();
        this.getUserRole(this.auth.currentUser.uid);
        this.firestoreService.getUserData(this.auth.currentUser.uid)
        .then((user) => {
          this.firestoreService.logUser(user);            
        })
      } else {
        this.userCredential = res;
        this.router.navigate(['verification'])
      }
    })
    .catch(error => {
      switch (error.code) {
        case 'auth/invalid-email':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/internal-error':
          throw new Error('Credenciales Inválidas');
        default:
          throw new Error(error.message);
      }
    })
    .finally(() => { 
      this.spinnerService.hide();
    });
  }

  getUserRole(uid:any) {
    this.spinnerService.show();
    new Promise((resolve, reject) => {
      this.firestoreService.getUserRole(uid).then((data) => {
        resolve(data);
      });
    })
    .then((data) => {
      this.redirect(data);
    })
    .catch((e) => {
      this.toastr.error(e.message);
    })
  }

  redirect(role: any) {
    if (role === 'Patient') {
      this.router.navigate(['patient']);
    }
    
    if (role === 'Doctor') {
      this.router.navigate(['doctor']);
    }
   
    if (role === 'Admin') {
      this.router.navigate(['admin']);
    }
    this.spinnerService.hide(); 
  }

  async loginWithGoogle(email: string, password: string) {
    return await this.afauth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(res => this.router.navigate(['home'])).catch(error => {
      throw new Error('Error de logueo de Google');
    });
  }

  async register(user: User, files: any) {
    return await createUserWithEmailAndPassword(this.auth, user.email, user.password).then(res => {
      sendEmailVerification(res.user);
      user.uid = res.user.uid;
      this.storage.updateImages(user.email, files).then(async () => {
        await this.storage.getProfilePictures(user.email).then(() => {
          this.uploadUser(user.name, user.lastName, this.storage.listUrl[0]);
          user.photoURL = this.storage.listUrl[0];
          user.imageUrl = [...this.storage.listUrl];
          this.firestoreService.addUser(user).catch(() => { console.log('Error sending patient') });
        })
      })
      this.router.navigate(['verification']);
      return res;
    }).catch(error => {
      switch (error.code) {
        case 'auth/invalid-email':
          this.toastr.error("Correo Invalido");
          break;
        case 'auth/email-already-in-use':
          this.toastr.error("Correo ya registrado");
          break;
        default:
          this.toastr.error(error.message);
          break;
      }
    });
  }

  async uploadUser(name: string,  lastName: string, url: string) {
    let auth = getAuth();
    return await updateProfile(auth.currentUser!, { displayName: name + ' ' + lastName, photoURL: url }).then().catch(
      (err) => console.log(err));
  }

  async logout() {
    this.setLocalStorage();
    return await this.afauth.signOut()
    .then(res => {
      this.router.navigate(['login']);
      
    })
    .catch(error => {
      throw new Error('Error en desloguearse');
    });
  }

  getAuth() {
    return this.afauth.authState;
  } 
}