import '../database.dart';

class ViewCombinedCellSizeTable extends SupabaseTable<ViewCombinedCellSizeRow> {
  @override
  String get tableName => 'view_combined_cell_size';

  @override
  ViewCombinedCellSizeRow createRow(Map<String, dynamic> data) =>
      ViewCombinedCellSizeRow(data);
}

class ViewCombinedCellSizeRow extends SupabaseDataRow {
  ViewCombinedCellSizeRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => ViewCombinedCellSizeTable();

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
