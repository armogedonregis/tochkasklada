import '../database.dart';

class RentedviewTable extends SupabaseTable<RentedviewRow> {
  @override
  String get tableName => 'rentedview';

  @override
  RentedviewRow createRow(Map<String, dynamic> data) => RentedviewRow(data);
}

class RentedviewRow extends SupabaseDataRow {
  RentedviewRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => RentedviewTable();

  String? get cellId => getField<String>('cell_id');
  set cellId(String? value) => setField<String>('cell_id', value);

  String? get paymentId => getField<String>('payment_id');
  set paymentId(String? value) => setField<String>('payment_id', value);

  int? get paymentAmount => getField<int>('payment_amount');
  set paymentAmount(int? value) => setField<int>('payment_amount', value);

  DateTime? get startDate => getField<DateTime>('start_date');
  set startDate(DateTime? value) => setField<DateTime>('start_date', value);

  DateTime? get endDate => getField<DateTime>('end_date');
  set endDate(DateTime? value) => setField<DateTime>('end_date', value);

  bool? get stopRent => getField<bool>('stop_rent');
  set stopRent(bool? value) => setField<bool>('stop_rent', value);

  String? get clientId => getField<String>('client_id');
  set clientId(String? value) => setField<String>('client_id', value);

  String? get clientName => getField<String>('client_name');
  set clientName(String? value) => setField<String>('client_name', value);

  String? get clientEmail => getField<String>('client_email');
  set clientEmail(String? value) => setField<String>('client_email', value);

  String? get clientPhone => getField<String>('client_phone');
  set clientPhone(String? value) => setField<String>('client_phone', value);

  int? get franchiseId => getField<int>('franchise_id');
  set franchiseId(int? value) => setField<int>('franchise_id', value);
}
