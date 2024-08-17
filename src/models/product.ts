export class ProductModel {
    id: number = 0;
    userId: number = 0;
    title: string = '';
    address: string = '';
    price: string = '';
    categoryId: string = '';
    guests: string = '';
    bedrooms: string = '';
    beds: string = '';
    bathrooms: string = '';
    checkIn: string = '';
    checkOut: string = '';
    imageProductData: any = null;
    utilities: any = null;
    description: string = '';
    status: string = '';

    constructor(auth?: ProductModel) {
        if (auth) {
            Object.assign(this, auth);
        }
    }
}