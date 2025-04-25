import '../database.dart';

class CellstatusviewTable extends SupabaseTable<CellstatusviewRow> {
  @override
  String get tableName => 'cellstatusview';

  @override
  CellstatusviewRow createRow(Map<String, dynamic> data) =>
      CellstatusviewRow(data);
}

class CellstatusviewRow extends SupabaseDataRow {
  CellstatusviewRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => CellstatusviewTable();

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

  DateTime? get expirationDate => getField<DateTime>('expiration_date');
  set expirationDate(DateTime? value) =>
      setField<DateTime>('expiration_date', value);
}
