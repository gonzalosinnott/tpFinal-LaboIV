import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user';

import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  public role;

  constructor(private afs: AngularFirestore) {}

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
      specialties: user.specialties,
      role: user.role,
      uid: user.uid,
      approved: user.approved,
    };
    return await this.afs.collection('users').add(newUser);
  }

  async addAppointment(date, doctor, patient, specialty) {
    let newAppointment: any = {
      date: date,
      doctor: doctor,
      patient: patient,
      specialty: specialty,
      status: 'pending',
    };
    return await this.afs.collection('appointments').add(newAppointment);
  }

  getUserData(uid: any) {
    return this.afs
      .collection('users', (ref) => ref.where('uid', '==', uid))
      .valueChanges();
  }

  getAllUsers() {
    return this.afs.collection('users').valueChanges();
  }

  getAllPatients() {
    const data: any[] = [];
    return firebase
      .firestore()
      .collection('users')
      .where('role', '==', 'Patient')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        return data;
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  }

  getSpecialties() {
    return this.afs.collection('specialties').valueChanges();
  }

  getDoctorsBySpecialtyAndEnabled(specialty: any) {
    const data: any[] = [];
    return firebase
      .firestore()
      .collection('users')
      .where('specialties', 'array-contains', specialty)
      .where('approved', '==', true)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        return data;
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  }

  getDoctorAvailableHours(uid: any) {
    var data;
    return firebase
      .firestore()
      .collection('users')
      .where('uid', '==', uid )
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data = doc.data()['serviceHours'];
        });
        return data;
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  }

  searchDoctorAvailability(uid: any) {
    var data;
    return firebase
      .firestore()
      .collection('appointments')
      .where('doctor', '==', uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data = doc.data();
        });
        return data;
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  }

  searchPatientAvailability(uid: any) {
    var data;
    return firebase
      .firestore()
      .collection('appointments')
      .where('patient', '==', uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data = doc.data();
        });
        return data;
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  }  
  
  updateSpecialties(specialties: any) {
    return firebase
      .firestore()
      .collection('specialties')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            specialties: specialties,
          });
        });
      })
      .catch((error) => {
        console.log('Error updating document: ', error);
      });
  }

  enableUser(uid: any) {
    return firebase
      .firestore()
      .collection('users')
      .where('uid', '==', uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            approved: true,
          });
          console.log(doc.data()['approved']);
        });
      })
      .catch((error) => {
        console.log('Error updating document: ', error);
      });
  }

  disableUser(uid: any) {
    return firebase
      .firestore()
      .collection('users')
      .where('uid', '==', uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            approved: false,
          });
          console.log(doc.data()['approved']);
        });
      })
      .catch((error) => {
        console.log('Error updating document: ', error);
      });
  }

  getUserRole(uid: any) {
    var data;
    return firebase
      .firestore()
      .collection('users')
      .where('uid', '==', uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data = doc.data()['role'];
        });
        return data;
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  }

  getUserApproved(uid: any) {
    var data;
    return firebase
      .firestore()
      .collection('users')
      .where('uid', '==', uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data = doc.data()['approved'];
        });
        return data;
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  }

  updateServiceHours(uid: any, hours: any) {
    return firebase
      .firestore()
      .collection('users')
      .where('uid', '==', uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            serviceHours: hours,
          });
          console.log(doc.data()['approved']);
        });
      })
      .catch((error) => {
        console.log('Error updating document: ', error);
      });
  }
}
  
 
  

