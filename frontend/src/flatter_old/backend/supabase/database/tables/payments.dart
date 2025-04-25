import '../database.dart';

class PaymentsTable extends SupabaseTable<PaymentsRow> {
  @override
  String get tableName => 'payments';

  @override
  PaymentsRow createRow(Map<String, dynamic> data) => PaymentsRow(data);
}

class PaymentsRow extends SupabaseDataRow {
  PaymentsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => PaymentsTable();

  DateTime get startDate => getField<DateTime>('start_date')!;
  set startDate(DateTime value) => setField<DateTime>('start_date', value);

  int get rentalDays => getField<int>('rental_days')!;
  set rentalDays(int value) => setField<int>('rental_days', value);

  String get cellId => getField<String>('cell_id')!;
  set cellId(String value) => setField<String>('cell_id', value);

  String get paymentId => getField<String>('payment_id')!;
  set paymentId(String value) => setField<String>('payment_id', value);

  int get franchiseId => getField<int>('franchise_id')!;
  set franchiseId(int value) => setField<int>('franchise_id', value);

  DateTime? get createdAt => getField<DateTime>('created_at');
  set createdAt(DateTime? value) => setField<DateTime>('created_at', value);

  int? get amount => getField<int>('amount');
  set amount(int? value) => setField<int>('amount', value);

  String? get clientId => getField<String>('client_id');
  set clientId(String? value) => setField<String>('client_id', value);

  bool get paymentSusseful => getField<bool>('payment_susseful')!;
  set paymentSusseful(bool value) => setField<bool>('payment_susseful', value);

  String? get clientMessage => getField<String>('client_message');
  set clientMessage(String? value) => setField<String>('client_message', value);

  String? get orderId => getField<String>('order_id');
  set orderId(String? value) => setField<String>('order_id', value);

  String? get tinkoffPaymentId => getField<String>('tinkoff_payment_id');
  set tinkoffPaymentId(String? value) =>
      setField<String>('tinkoff_payment_id', value);
}
