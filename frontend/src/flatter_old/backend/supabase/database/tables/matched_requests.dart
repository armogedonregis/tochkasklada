import '../database.dart';

class MatchedRequestsTable extends SupabaseTable<MatchedRequestsRow> {
  @override
  String get tableName => 'matched_requests';

  @override
  MatchedRequestsRow createRow(Map<String, dynamic> data) =>
      MatchedRequestsRow(data);
}

class MatchedRequestsRow extends SupabaseDataRow {
  MatchedRequestsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => MatchedRequestsTable();

  String? get requestId => getField<String>('request_id');
  set requestId(String? value) => setField<String>('request_id', value);

  String? get requestSize => getField<String>('request_size');
  set requestSize(String? value) => setField<String>('request_size', value);

  String? get requestLocation => getField<String>('request_location');
  set requestLocation(String? value) =>
      setField<String>('request_location', value);

  String? get email => getField<String>('email');
  set email(String? value) => setField<String>('email', value);

  String? get phone => getField<String>('phone');
  set phone(String? value) => setField<String>('phone', value);

  String? get clientName => getField<String>('client_name');
  set clientName(String? value) => setField<String>('client_name', value);

  int? get availableCellsCount => getField<int>('available_cells_count');
  set availableCellsCount(int? value) =>
      setField<int>('available_cells_count', value);

  bool? get isAvailable => getField<bool>('is_available');
  set isAvailable(bool? value) => setField<bool>('is_available', value);

  String? get locationName => getField<String>('location_name');
  set locationName(String? value) => setField<String>('location_name', value);

  String? get cellId => getField<String>('cell_id');
  set cellId(String? value) => setField<String>('cell_id', value);
}
