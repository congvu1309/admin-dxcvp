import { parse } from 'date-fns';

const isCancellationDuringStay = (startDate: string, endDate: string) => {
    const currentDate = new Date();
    
    const parsedStartDate = parse(startDate, 'dd/MM/yyyy', new Date());
    const parsedEndDate = parse(endDate, 'dd/MM/yyyy', new Date());

    return currentDate > parsedStartDate && currentDate < parsedEndDate;
};

export default isCancellationDuringStay;
