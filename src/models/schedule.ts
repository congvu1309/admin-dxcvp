export class ScheduleModel {
    id: number = 0;
    productId: number = 0;
    userId: number = 0;
    startDate: string = '';
    endDate: string = '';
    numberOfDays: number = 0;
    guestCount: number = 0;
    image: string = '';
    phoneNumber: string = '';
    productScheduleData: any = null;
    userScheduleData: any = null;
    userProductData: any = null;
    pay: string = '';
    status: string = '';

    constructor(auth?: ScheduleModel) {
        if (auth) {
            Object.assign(this, auth);
        }
    }
}
