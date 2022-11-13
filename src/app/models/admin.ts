export class Admin {
    id?: string;
    email: string;
    password: string;
    displayName: string;
    photoURL: string;
    name: string;
    lastName: string;
    age: number;
    dni: string;
    insurance: string;
    imageUrl: string[] = [];
    role: string = 'Admin';
    specialties?: string[] = [];
    

    constructor(email: string = '', password: string = '', displayName: string = '', photoURL: string = '', name: string = '', lastName: string = '', age: number = 0, dni: string = '', insurance: string = '', imageUrl: string[] = [], specialties: string[] = []) {
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
        this.role = 'Admin';
        this.specialties = specialties;
    }
}
