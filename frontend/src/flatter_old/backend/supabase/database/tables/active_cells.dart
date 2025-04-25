import '../database.dart';

class ActiveCellsTable extends SupabaseTable<ActiveCellsRow> {
  @override
  String get tableName => 'active_cells';

  @override
  ActiveCellsRow createRow(Map<String, dynamic> data) => ActiveCellsRow(data);
}

class ActiveCellsRow extends SupabaseDataRow {
  ActiveCellsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => ActiveCellsTable();

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

  bool? get isBlocked => getField<bool>('is_blocked');
  set isBlocked(bool? value) => setField<bool>('is_blocked', value);

  DateTime? get expirationDate => getField<DateTime>('expiration_date');
  set expirationDate(DateTime? value) =>
      setField<DateTime>('expiration_date', value);

  int? get franchiseId => getField<int>('franchise_id');
  set franchiseId(int? value) => setField<int>('franchise_id', value);

  int? get priceMonth => getField<int>('price_month');
  set priceMonth(int? value) => setField<int>('price_month', value);

  int? get priceDay => getField<int>('price_day');
  set priceDay(int? value) => setField<int>('price_day', value);

  double? get yearCoeficient => getField<double>('year_coeficient');
  set yearCoeficient(double? value) =>
      setField<double>('year_coeficient', value);
}
