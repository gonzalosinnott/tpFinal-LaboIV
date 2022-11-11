import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collectionData, Firestore, doc, deleteDoc } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient';
import { User } from '../models/user';

import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  public patient: Patient | any;
  public role

  constructor(private afs: AngularFirestore, private firestore: Firestore) { }

  async addUser(user: User) {
    let newUser: User = {
      email: user.email,
      password: user.password,
      displayName: user.name + ' ' + user.lastName,
      photoURL: user.photoURL,
      name: user.name,
      lastName: user.lastName,
      age: user.age,
      dni: user.dni,
      insurance: user.insurance,
      imageUrl: user.imageUrl,
      specialty: user.specialty,
      role: user.role,
      uid: user.uid
    };
    return await this.afs.collection('users').add(newUser);
  }
  
  getUserData(uid: any) {
    return this.afs.collection('users', ref => ref.where('uid', '==', uid)).valueChanges();
  }

  getUserRole(uid: any) {
    var data;
    return firebase.firestore().collection('users')
                               .where('uid', '==', uid)
                               .get()
                               .then((querySnapshot) => {
                                 querySnapshot.forEach((doc) => {
                                     data = doc.data()['role'];
                                 });
                                 return data;
                               })
                               .catch((error) => {
                                 console.log("Error getting documents: ", error);
                               });
  }
 
}
  
 
  

