import { parse } from "date-fns";

const isCancellationBeforeStart = (startDate: string, cancellationDate: Date) => {
    const parsedStartDate = parse(startDate, 'dd/MM/yyyy', new Date());
    return cancellationDate < parsedStartDate;
};

export default isCancellationBeforeStart;