import '../database.dart';

class LocationViewTable extends SupabaseTable<LocationViewRow> {
  @override
  String get tableName => 'location_view';

  @override
  LocationViewRow createRow(Map<String, dynamic> data) => LocationViewRow(data);
}

class LocationViewRow extends SupabaseDataRow {
  LocationViewRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => LocationViewTable();

  String? get locId => getField<String>('loc_id');
  set locId(String? value) => setField<String>('loc_id', value);

  String? get ruName => getField<String>('ru_name');
  set ruName(String? value) => setField<String>('ru_name', value);

  String? get adress => getField<String>('adress');
  set adress(String? value) => setField<String>('adress', value);

  int? get franchisee => getField<int>('franchisee');
  set franchisee(int? value) => setField<int>('franchisee', value);

  int? get priceTier => getField<int>('price_tier');
  set priceTier(int? value) => setField<int>('price_tier', value);

  int? get totalCells => getField<int>('total_cells');
  set totalCells(int? value) => setField<int>('total_cells', value);

  int? get availableCells => getField<int>('available_cells');
  set availableCells(int? value) => setField<int>('available_cells', value);

  int? get rentedCells => getField<int>('rented_cells');
  set rentedCells(int? value) => setField<int>('rented_cells', value);

  double? get paymentsLast30Days => getField<double>('payments_last_30_days');
  set paymentsLast30Days(double? value) =>
      setField<double>('payments_last_30_days', value);

  double? get paymentsCurrentMonth =>
      getField<double>('payments_current_month');
  set paymentsCurrentMonth(double? value) =>
      setField<double>('payments_current_month', value);

  String? get currentMonth => getField<String>('current_month');
  set currentMonth(String? value) => setField<String>('current_month', value);
}
