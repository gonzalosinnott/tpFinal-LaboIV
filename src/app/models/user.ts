import { Roles } from "./role";

export class User {
    id?: string;
    uid?: string;
    email: string;
    password: string;
    displayName: string;
    photoURL: string;
    name: string;
    lastName: string;
    age: number;
    dni: string;
    insurance?: string;
    imageUrl: string[] = [];
    specialties?: string[] = [];
    role: Roles;
    emailVerified?: boolean;
    approved?: boolean;

    constructor(uid: string = '', email: string = '', password: string = '', displayName: string = '', photoURL: string = '', name: string = '', lastName: string = '', age: number = 0, dni: string = '', insurance: string = '', imageUrl: string[] = [], specialties: string[] = [],  role: Roles = 'Admin', emailVerified: boolean = false, approved: boolean = false) {
        this.email = email;
        this.password = password;
        this.displayName = displayName;
        this.photoURL = photoURL;
        this.name = name;
        this.lastName = lastName;
        this.age = age;
        this.dni = dni;
        this.insurance = insurance;
        this.imageUrl = imageUrl;
        this.specialties = specialties;
        this.role = role;
        this.emailVerified = emailVerified;
        this.approved = approved;
        this.uid = uid;
    }
}
