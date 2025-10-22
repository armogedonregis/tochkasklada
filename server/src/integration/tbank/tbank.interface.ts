export interface TBankConfig {
    terminalKey: string;
    password: string;
    baseUrl: string;
}

export interface TBankPaymentParams {
    TerminalKey: string;
    Amount: number;
    OrderId: string;
    Description?: string;
    Token?: string;
}

export interface TBankPaymentResponse {
    Success: boolean;
    PaymentURL?: string;
    PaymentId?: string;
    ErrorCode?: string;
    Message?: string;
    Details?: string;
}

export interface TBankNotification {
    OrderId: string;
    Status: string;
    PaymentId?: string;
    [key: string]: any;
}