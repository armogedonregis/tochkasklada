import '../database.dart';

class AllCellStatusTable extends SupabaseTable<AllCellStatusRow> {
  @override
  String get tableName => 'all_cell_status';

  @override
  AllCellStatusRow createRow(Map<String, dynamic> data) =>
      AllCellStatusRow(data);
}

class AllCellStatusRow extends SupabaseDataRow {
  AllCellStatusRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => AllCellStatusTable();

  String? get cellId => getField<String>('cell_id');
  set cellId(String? value) => setField<String>('cell_id', value);

  String? get status => getField<String>('status');
  set status(String? value) => setField<String>('status', value);

  String? get adress => getField<String>('adress');
  set adress(String? value) => setField<String>('adress', value);

  String? get locationId => getField<String>('location_id');
  set locationId(String? value) => setField<String>('location_id', value);

  int? get priceTier => getField<int>('price_tier');
  set priceTier(int? value) => setField<int>('price_tier', value);

  String? get size => getField<String>('size');
  set size(String? value) => setField<String>('size', value);

  int? get franchiseId => getField<int>('franchise_id');
  set franchiseId(int? value) => setField<int>('franchise_id', value);

  int? get priceMonth => getField<int>('price_month');
  set priceMonth(int? value) => setField<int>('price_month', value);

  int? get priceDay => getField<int>('price_day');
  set priceDay(int? value) => setField<int>('price_day', value);

  double? get yearCoeficient => getField<double>('year_coeficient');
  set yearCoeficient(double? value) =>
      setField<double>('year_coeficient', value);

  String? get clientName => getField<String>('client_name');
  set clientName(String? value) => setField<String>('client_name', value);

  String? get clientEmail => getField<String>('client_email');
  set clientEmail(String? value) => setField<String>('client_email', value);

  String? get clientPhone => getField<String>('client_phone');
  set clientPhone(String? value) => setField<String>('client_phone', value);

  DateTime? get expirationDate => getField<DateTime>('expiration_date');
  set expirationDate(DateTime? value) =>
      setField<DateTime>('expiration_date', value);
}
