export class LoginModel {
    email: string = '';
    password: string = '';

    constructor(auth?: LoginModel) {
        if (auth) {
            Object.assign(this, auth);
        }
    }
}
