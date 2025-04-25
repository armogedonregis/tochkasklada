import '../database.dart';

class OverdueViewTable extends SupabaseTable<OverdueViewRow> {
  @override
  String get tableName => 'overdue_view';

  @override
  OverdueViewRow createRow(Map<String, dynamic> data) => OverdueViewRow(data);
}

class OverdueViewRow extends SupabaseDataRow {
  OverdueViewRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => OverdueViewTable();

  String? get paymentId => getField<String>('payment_id');
  set paymentId(String? value) => setField<String>('payment_id', value);

  String? get cellId => getField<String>('cell_id');
  set cellId(String? value) => setField<String>('cell_id', value);

  String? get clientId => getField<String>('client_id');
  set clientId(String? value) => setField<String>('client_id', value);

  String? get clientName => getField<String>('client_name');
  set clientName(String? value) => setField<String>('client_name', value);

  String? get clientEmail => getField<String>('client_email');
  set clientEmail(String? value) => setField<String>('client_email', value);

  String? get clientPhone => getField<String>('client_phone');
  set clientPhone(String? value) => setField<String>('client_phone', value);

  String? get cellSize => getField<String>('cell_size');
  set cellSize(String? value) => setField<String>('cell_size', value);

  String? get cellAddress => getField<String>('cell_address');
  set cellAddress(String? value) => setField<String>('cell_address', value);

  String? get cellLocationId => getField<String>('cell_location_id');
  set cellLocationId(String? value) =>
      setField<String>('cell_location_id', value);

  int? get cellPriceTier => getField<int>('cell_price_tier');
  set cellPriceTier(int? value) => setField<int>('cell_price_tier', value);

  int? get paymentAmount => getField<int>('payment_amount');
  set paymentAmount(int? value) => setField<int>('payment_amount', value);

  DateTime? get startDate => getField<DateTime>('start_date');
  set startDate(DateTime? value) => setField<DateTime>('start_date', value);

  DateTime? get endDate => getField<DateTime>('end_date');
  set endDate(DateTime? value) => setField<DateTime>('end_date', value);

  double? get overdueDays => getField<double>('overdue_days');
  set overdueDays(double? value) => setField<double>('overdue_days', value);
}
