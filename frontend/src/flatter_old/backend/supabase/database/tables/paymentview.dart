import '../database.dart';

class PaymentviewTable extends SupabaseTable<PaymentviewRow> {
  @override
  String get tableName => 'paymentview';

  @override
  PaymentviewRow createRow(Map<String, dynamic> data) => PaymentviewRow(data);
}

class PaymentviewRow extends SupabaseDataRow {
  PaymentviewRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => PaymentviewTable();

  String? get paymentId => getField<String>('payment_id');
  set paymentId(String? value) => setField<String>('payment_id', value);

  DateTime? get startDate => getField<DateTime>('start_date');
  set startDate(DateTime? value) => setField<DateTime>('start_date', value);

  int? get rentalDays => getField<int>('rental_days');
  set rentalDays(int? value) => setField<int>('rental_days', value);

  String? get cellId => getField<String>('cell_id');
  set cellId(String? value) => setField<String>('cell_id', value);

  int? get franchiseId => getField<int>('franchise_id');
  set franchiseId(int? value) => setField<int>('franchise_id', value);

  DateTime? get createdAt => getField<DateTime>('created_at');
  set createdAt(DateTime? value) => setField<DateTime>('created_at', value);

  int? get amount => getField<int>('amount');
  set amount(int? value) => setField<int>('amount', value);

  String? get clientId => getField<String>('client_id');
  set clientId(String? value) => setField<String>('client_id', value);

  String? get clientName => getField<String>('client_name');
  set clientName(String? value) => setField<String>('client_name', value);

  String? get clientPhone => getField<String>('client_phone');
  set clientPhone(String? value) => setField<String>('client_phone', value);

  String? get clientEmail => getField<String>('client_email');
  set clientEmail(String? value) => setField<String>('client_email', value);

  String? get cellSize => getField<String>('cell_size');
  set cellSize(String? value) => setField<String>('cell_size', value);

  String? get cellStatus => getField<String>('cell_status');
  set cellStatus(String? value) => setField<String>('cell_status', value);

  String? get cellAddress => getField<String>('cell_address');
  set cellAddress(String? value) => setField<String>('cell_address', value);

  String? get cellLocationId => getField<String>('cell_location_id');
  set cellLocationId(String? value) =>
      setField<String>('cell_location_id', value);

  int? get cellPriceTier => getField<int>('cell_price_tier');
  set cellPriceTier(int? value) => setField<int>('cell_price_tier', value);

  String? get adressNameRu => getField<String>('adress_name_ru');
  set adressNameRu(String? value) => setField<String>('adress_name_ru', value);

  DateTime? get paidUntil => getField<DateTime>('paid_until');
  set paidUntil(DateTime? value) => setField<DateTime>('paid_until', value);

  String? get tinkoffPaymentId => getField<String>('tinkoff_payment_id');
  set tinkoffPaymentId(String? value) =>
      setField<String>('tinkoff_payment_id', value);
}
