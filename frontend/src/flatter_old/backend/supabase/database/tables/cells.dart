import '../database.dart';

class CellsTable extends SupabaseTable<CellsRow> {
  @override
  String get tableName => 'cells';

  @override
  CellsRow createRow(Map<String, dynamic> data) => CellsRow(data);
}

class CellsRow extends SupabaseDataRow {
  CellsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => CellsTable();

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  String get size => getField<String>('size')!;
  set size(String value) => setField<String>('size', value);

  int? get priceTier => getField<int>('price_tier');
  set priceTier(int? value) => setField<int>('price_tier', value);

  String? get status => getField<String>('status');
  set status(String? value) => setField<String>('status', value);

  String get cellId => getField<String>('cell_id')!;
  set cellId(String value) => setField<String>('cell_id', value);

  int? get container => getField<int>('container');
  set container(int? value) => setField<int>('container', value);

  String? get createdBy => getField<String>('created_by');
  set createdBy(String? value) => setField<String>('created_by', value);

  String? get email => getField<String>('email');
  set email(String? value) => setField<String>('email', value);

  String? get adress => getField<String>('adress');
  set adress(String? value) => setField<String>('adress', value);

  bool? get isActive => getField<bool>('is_active');
  set isActive(bool? value) => setField<bool>('is_active', value);

  String? get locationId => getField<String>('location_id');
  set locationId(String? value) => setField<String>('location_id', value);

  bool get isBlocked => getField<bool>('is_blocked')!;
  set isBlocked(bool value) => setField<bool>('is_blocked', value);
}
