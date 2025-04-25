import '../database.dart';

class LocationsPreviewTable extends SupabaseTable<LocationsPreviewRow> {
  @override
  String get tableName => 'locations_preview';

  @override
  LocationsPreviewRow createRow(Map<String, dynamic> data) =>
      LocationsPreviewRow(data);
}

class LocationsPreviewRow extends SupabaseDataRow {
  LocationsPreviewRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => LocationsPreviewTable();

  String? get locationId => getField<String>('location_id');
  set locationId(String? value) => setField<String>('location_id', value);

  String? get locName => getField<String>('locName');
  set locName(String? value) => setField<String>('locName', value);

  bool? get isActive => getField<bool>('is_active');
  set isActive(bool? value) => setField<bool>('is_active', value);

  int? get franchise => getField<int>('franchise');
  set franchise(int? value) => setField<int>('franchise', value);

  String? get locGeo => getField<String>('loc_geo');
  set locGeo(String? value) => setField<String>('loc_geo', value);

  String? get adress => getField<String>('adress');
  set adress(String? value) => setField<String>('adress', value);

  String? get city => getField<String>('city');
  set city(String? value) => setField<String>('city', value);

  String? get franchiseName => getField<String>('franchise_name');
  set franchiseName(String? value) => setField<String>('franchise_name', value);

  String? get avatarLink => getField<String>('avatar_link');
  set avatarLink(String? value) => setField<String>('avatar_link', value);

  int? get totalMCells => getField<int>('total_m_cells');
  set totalMCells(int? value) => setField<int>('total_m_cells', value);

  int? get totalSCells => getField<int>('total_s_cells');
  set totalSCells(int? value) => setField<int>('total_s_cells', value);

  int? get totalXsCells => getField<int>('total_xs_cells');
  set totalXsCells(int? value) => setField<int>('total_xs_cells', value);

  int? get occupiedMCells => getField<int>('occupied_m_cells');
  set occupiedMCells(int? value) => setField<int>('occupied_m_cells', value);

  int? get occupiedSCells => getField<int>('occupied_s_cells');
  set occupiedSCells(int? value) => setField<int>('occupied_s_cells', value);

  int? get occupiedXsCells => getField<int>('occupied_xs_cells');
  set occupiedXsCells(int? value) => setField<int>('occupied_xs_cells', value);

  int? get occupiedCells => getField<int>('occupied_cells');
  set occupiedCells(int? value) => setField<int>('occupied_cells', value);

  int? get totalCells => getField<int>('total_cells');
  set totalCells(int? value) => setField<int>('total_cells', value);

  int? get availableMCells => getField<int>('available_m_cells');
  set availableMCells(int? value) => setField<int>('available_m_cells', value);

  int? get availableSCells => getField<int>('available_s_cells');
  set availableSCells(int? value) => setField<int>('available_s_cells', value);

  int? get availableXsCells => getField<int>('available_xs_cells');
  set availableXsCells(int? value) =>
      setField<int>('available_xs_cells', value);

  int? get availableCells => getField<int>('available_cells');
  set availableCells(int? value) => setField<int>('available_cells', value);

  double? get availabilityRatio => getField<double>('availability_ratio');
  set availabilityRatio(double? value) =>
      setField<double>('availability_ratio', value);

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
