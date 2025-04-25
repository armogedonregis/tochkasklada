import '../database.dart';

class FaqSupportStatsTable extends SupabaseTable<FaqSupportStatsRow> {
  @override
  String get tableName => 'faq_support_stats';

  @override
  FaqSupportStatsRow createRow(Map<String, dynamic> data) =>
      FaqSupportStatsRow(data);
}

class FaqSupportStatsRow extends SupabaseDataRow {
  FaqSupportStatsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => FaqSupportStatsTable();

  String? get theme => getField<String>('theme');
  set theme(String? value) => setField<String>('theme', value);

  int? get unansweredToday => getField<int>('unanswered_today');
  set unansweredToday(int? value) => setField<int>('unanswered_today', value);

  int? get unansweredTotal => getField<int>('unanswered_total');
  set unansweredTotal(int? value) => setField<int>('unanswered_total', value);

  int? get answeredTotal => getField<int>('answered_total');
  set answeredTotal(int? value) => setField<int>('answered_total', value);

  int? get totalQuestions => getField<int>('total_questions');
  set totalQuestions(int? value) => setField<int>('total_questions', value);
}
