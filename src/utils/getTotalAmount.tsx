import { ScheduleModel } from '@/models/schedule';
import { parse } from 'date-fns';

const isCancellationDuringStay = (startDate: string, endDate: string, cancellationDate: Date) => {
    const parsedStartDate = parse(startDate, 'dd/MM/yyyy', new Date());
    const parsedEndDate = parse(endDate, 'dd/MM/yyyy', new Date());

    // Check if the cancellation date is within the stay period
    return cancellationDate > parsedStartDate && cancellationDate < parsedEndDate;
};

const getTotalAmount = (schedule: ScheduleModel) => {
    const formattedPrice = schedule.productScheduleData.price ?? "0";
    const formattedPay = schedule.pay ?? "0";
    const pricePerNight = Number(formattedPrice.replace(/[^\d.-]/g, '')) || 0;
    const priceTotal = Number(formattedPay.replace(/[^\d.-]/g, '')) || 0;
    const provisional = pricePerNight * (schedule.numberOfDays || 1);
    const serviceCharge = provisional * 0.2;
    let totalAmount = priceTotal - serviceCharge;

    const currentDate = new Date();
    const parsedStartDate = parse(schedule.startDate, 'dd/MM/yyyy', new Date());

    const isCancelledBeforeStart = schedule.status === 'canceled' && currentDate < parsedStartDate;

    if (isCancelledBeforeStart) {
        totalAmount = 0;
    } else if (schedule.status === 'canceled' || schedule.status === 'refunded' && isCancellationDuringStay(schedule.startDate, schedule.endDate, currentDate)) {
        totalAmount *= 0.5;
    }

    return totalAmount.toLocaleString();
};

export default getTotalAmount;
