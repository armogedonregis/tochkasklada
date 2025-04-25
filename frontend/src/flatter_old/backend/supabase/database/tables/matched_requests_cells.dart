import '../database.dart';

class MatchedRequestsCellsTable extends SupabaseTable<MatchedRequestsCellsRow> {
  @override
  String get tableName => 'matched_requests_cells';

  @override
  MatchedRequestsCellsRow createRow(Map<String, dynamic> data) =>
      MatchedRequestsCellsRow(data);
}

class MatchedRequestsCellsRow extends SupabaseDataRow {
  MatchedRequestsCellsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => MatchedRequestsCellsTable();

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

  String? get cellID => getField<String>('cellID');
  set cellID(String? value) => setField<String>('cellID', value);

  String? get locationName => getField<String>('location_name');
  set locationName(String? value) => setField<String>('location_name', value);

  bool? get matching => getField<bool>('matching');
  set matching(bool? value) => setField<bool>('matching', value);

  int? get availableCellsCount => getField<int>('available_cells_count');
  set availableCellsCount(int? value) =>
      setField<int>('available_cells_count', value);
}
