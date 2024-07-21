export class CategoryModel {
    id: number = 0;
    title: string = '';
    image: any = null;

    constructor(auth?: CategoryModel) {
        if (auth) {
            Object.assign(this, auth);
        }
    }
}
