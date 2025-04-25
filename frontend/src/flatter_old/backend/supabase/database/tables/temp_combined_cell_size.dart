import '../database.dart';

class TempCombinedCellSizeTable extends SupabaseTable<TempCombinedCellSizeRow> {
  @override
  String get tableName => 'temp_combined_cell_size';

  @override
  TempCombinedCellSizeRow createRow(Map<String, dynamic> data) =>
      TempCombinedCellSizeRow(data);
}

class TempCombinedCellSizeRow extends SupabaseDataRow {
  TempCombinedCellSizeRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => TempCombinedCellSizeTable();

  String? get cellInfo => getField<String>('cell_info');
  set cellInfo(String? value) => setField<String>('cell_info', value);

  String? get cellID => getField<String>('cellID');
  set cellID(String? value) => setField<String>('cellID', value);

  String? get size => getField<String>('size');
  set size(String? value) => setField<String>('size', value);

  int? get priceTier => getField<int>('price_tier');
  set priceTier(int? value) => setField<int>('price_tier', value);

  String? get location => getField<String>('location');
  set location(String? value) => setField<String>('location', value);

  String? get locationName => getField<String>('location_name');
  set locationName(String? value) => setField<String>('location_name', value);

  String? get status => getField<String>('status');
  set status(String? value) => setField<String>('status', value);
}
