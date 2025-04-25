import '../database.dart';

class FaqArticleTagsTable extends SupabaseTable<FaqArticleTagsRow> {
  @override
  String get tableName => 'faq_article_tags';

  @override
  FaqArticleTagsRow createRow(Map<String, dynamic> data) =>
      FaqArticleTagsRow(data);
}

class FaqArticleTagsRow extends SupabaseDataRow {
  FaqArticleTagsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => FaqArticleTagsTable();

  int get articleId => getField<int>('article_id')!;
  set articleId(int value) => setField<int>('article_id', value);

  String get tagId => getField<String>('tag_id')!;
  set tagId(String value) => setField<String>('tag_id', value);
}
