export class UtilitiesModel {
    id: number = 0;
    title: string = '';
    image: any = null;

    constructor(auth?: UtilitiesModel) {
        if (auth) {
            Object.assign(this, auth);
        }
    }
}
