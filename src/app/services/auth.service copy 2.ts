import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';

import { AngularFireAuth } from '@angular/fire/compat/auth';

import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';


import { Injectable } from '@angular/core';

import { UserData } from '../interfaces/user-data';
import { LoginData } from '../interfaces/login-data';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  userData: any; // Save logged in user data
  now = new Date();
  isLogin = false;    
  roleAs: string;

  constructor(private auth: Auth,
              public afAuth: AngularFireAuth,
              public afs: AngularFirestore, // Inject Firebase auth service
    ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.setItem('user', 'null');
      }
    });
  }
  
  registerUser({ email, 
                    password, 
                    name, 
                    lastName, 
                     }: UserData) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
    .then(credential => {
      credential.user.updateProfile({displayName: name + " " + lastName,})
      credential.user.sendEmailVerification();
    })
    .catch(error => {
      switch (error.code) {
        case 'auth/invalid-email':
          throw new Error('Mail Inválido');
        case 'auth/email-already-in-use':
          throw new Error('El correo ya se encuentra en uso');
        default:
          throw new Error(error.message);
      }});
  }

  login({ email, password }: LoginData) {
    return signInWithEmailAndPassword(this.auth, email, password)
    .then((result) => { 
      this.userData = result.user;
      localStorage.setItem('user', JSON.stringify(this.userData));
    })
  }

  logout() {
    return signOut(this.auth)
    .then((result) => {
      localStorage.removeItem('user');
      this.userData = null;
    })
  }

  SetPatientData(user: any, name, lastName, idNumber, age, healthInsurance, role, formFile, formFile2) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `user-registry/${user.uid}`
    );

    const userLog: AngularFirestoreDocument<any> = this.afs.doc(
      `users-log/${this.now}`
    );

    const userData: any = {
      uid: user.uid,
      email: user.email,
      displayName: name + " " + lastName,
      emailVerified: user.emailVerified,
      name: name,
      lastName: lastName,
      idNumber: idNumber,
      age: age,
      healthInsurance: healthInsurance,
      role: role,
      formFile: formFile,
      formFile2: formFile2,
    };

    const userDataLog: any = {
      displayName: user.displayName,
      email: user.email,
      loginDate : this.now.toLocaleString()
    };

    userLog.set(userDataLog, {
      merge: false,
    });
    
    return userRef.set(userData, {
      merge: true,
    });
  }

  getAuth() {
    return this.afAuth.authState;
  }

  getUserRole() {
    var data;
    return firebase.firestore().collection('user-registry')
                               .where('uid', '==', this.userData.uid)
                               .limit(1)
                               .get()
                               .then((querySnapshot) => {
                                 querySnapshot.forEach((doc) => {
                                     data = doc.data()['role'];
                                 });
                                 console.log(data);
                                 localStorage.setItem('ROLE', data)
                                 return data;
                               })
                               .catch((error) => {
                                 console.log("Error getting documents: ", error);
                               });
  }

  getUserVerified() {
    var data;

    return firebase.firestore().collection('user-registry')
                               .where('displayName', '==', this.userData.displayName)
                               .limit(1)
                               .get()
                               .then((querySnapshot) => {
                                 querySnapshot.forEach((doc) => {
                                     data = doc.data()['emailVerified'];
                                 });
                                 console.log(data);
                                 return data;
                               })
                               .catch((error) => {
                                 console.log("Error getting documents: ", error);
                               });
  }

}