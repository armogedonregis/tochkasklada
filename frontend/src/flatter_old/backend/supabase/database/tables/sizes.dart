import '../database.dart';

class SizesTable extends SupabaseTable<SizesRow> {
  @override
  String get tableName => 'sizes';

  @override
  SizesRow createRow(Map<String, dynamic> data) => SizesRow(data);
}

class SizesRow extends SupabaseDataRow {
  SizesRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => SizesTable();

  String get id => getField<String>('id')!;
  set id(String value) => setField<String>('id', value);

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  double? get sqmeters => getField<double>('sqmeters');
  set sqmeters(double? value) => setField<double>('sqmeters', value);

  String? get ruName => getField<String>('ru_name');
  set ruName(String? value) => setField<String>('ru_name', value);

  String? get sizeImage => getField<String>('size_image');
  set sizeImage(String? value) => setField<String>('size_image', value);
}
