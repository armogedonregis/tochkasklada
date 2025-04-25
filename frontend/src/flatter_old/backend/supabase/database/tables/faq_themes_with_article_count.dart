import '../database.dart';

class FaqThemesWithArticleCountTable
    extends SupabaseTable<FaqThemesWithArticleCountRow> {
  @override
  String get tableName => 'faq_themes_with_article_count';

  @override
  FaqThemesWithArticleCountRow createRow(Map<String, dynamic> data) =>
      FaqThemesWithArticleCountRow(data);
}

class FaqThemesWithArticleCountRow extends SupabaseDataRow {
  FaqThemesWithArticleCountRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => FaqThemesWithArticleCountTable();

  String? get themeId => getField<String>('theme_id');
  set themeId(String? value) => setField<String>('theme_id', value);

  String? get theme => getField<String>('theme');
  set theme(String? value) => setField<String>('theme', value);

  String? get themeDescription => getField<String>('theme_description');
  set themeDescription(String? value) =>
      setField<String>('theme_description', value);

  String? get forWhy => getField<String>('for_why');
  set forWhy(String? value) => setField<String>('for_why', value);

  int? get articleCount => getField<int>('article_count');
  set articleCount(int? value) => setField<int>('article_count', value);
}
