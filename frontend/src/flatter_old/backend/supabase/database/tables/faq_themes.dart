import '../database.dart';

class FaqThemesTable extends SupabaseTable<FaqThemesRow> {
  @override
  String get tableName => 'faq_themes';

  @override
  FaqThemesRow createRow(Map<String, dynamic> data) => FaqThemesRow(data);
}

class FaqThemesRow extends SupabaseDataRow {
  FaqThemesRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => FaqThemesTable();

  String get id => getField<String>('id')!;
  set id(String value) => setField<String>('id', value);

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  String? get theme => getField<String>('theme');
  set theme(String? value) => setField<String>('theme', value);

  String? get themeDescriptions => getField<String>('theme_descriptions');
  set themeDescriptions(String? value) =>
      setField<String>('theme_descriptions', value);

  String? get createdBy => getField<String>('created_by');
  set createdBy(String? value) => setField<String>('created_by', value);

  String? get forWhy => getField<String>('for_why');
  set forWhy(String? value) => setField<String>('for_why', value);
}
