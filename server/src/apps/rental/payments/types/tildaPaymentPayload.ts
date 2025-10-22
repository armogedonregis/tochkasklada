export interface TildaPaymentPayload {
    email: string;
    phone: string;
    name: string;
    cellNumber?: string;
    secondCellNumber?: string;
    sizeform?: string;
    amount?: string | number;
    description?: string;
    rentalDuration?: string | number;
    systranid?: string;
    [key: string]: any;
}
