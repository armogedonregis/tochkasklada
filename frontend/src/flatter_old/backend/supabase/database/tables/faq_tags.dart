import '../database.dart';

class FaqTagsTable extends SupabaseTable<FaqTagsRow> {
  @override
  String get tableName => 'faq_tags';

  @override
  FaqTagsRow createRow(Map<String, dynamic> data) => FaqTagsRow(data);
}

class FaqTagsRow extends SupabaseDataRow {
  FaqTagsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => FaqTagsTable();

  String get id => getField<String>('id')!;
  set id(String value) => setField<String>('id', value);

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  String get tag => getField<String>('tag')!;
  set tag(String value) => setField<String>('tag', value);

  String? get createdBy => getField<String>('created_by');
  set createdBy(String? value) => setField<String>('created_by', value);
}
