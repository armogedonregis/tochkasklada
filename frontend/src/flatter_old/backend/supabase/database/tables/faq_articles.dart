import '../database.dart';

class FaqArticlesTable extends SupabaseTable<FaqArticlesRow> {
  @override
  String get tableName => 'faq_articles';

  @override
  FaqArticlesRow createRow(Map<String, dynamic> data) => FaqArticlesRow(data);
}

class FaqArticlesRow extends SupabaseDataRow {
  FaqArticlesRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => FaqArticlesTable();

  int get id => getField<int>('id')!;
  set id(int value) => setField<int>('id', value);

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  String get theme => getField<String>('theme')!;
  set theme(String value) => setField<String>('theme', value);

  String get article => getField<String>('article')!;
  set article(String value) => setField<String>('article', value);

  String get artTitle => getField<String>('art_title')!;
  set artTitle(String value) => setField<String>('art_title', value);

  String? get createdBy => getField<String>('created_by');
  set createdBy(String? value) => setField<String>('created_by', value);
}
