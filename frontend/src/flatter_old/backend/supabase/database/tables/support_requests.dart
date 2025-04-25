import '../database.dart';

class SupportRequestsTable extends SupabaseTable<SupportRequestsRow> {
  @override
  String get tableName => 'support_requests';

  @override
  SupportRequestsRow createRow(Map<String, dynamic> data) =>
      SupportRequestsRow(data);
}

class SupportRequestsRow extends SupabaseDataRow {
  SupportRequestsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => SupportRequestsTable();

  int get id => getField<int>('id')!;
  set id(int value) => setField<int>('id', value);

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  String? get createdBy => getField<String>('created_by');
  set createdBy(String? value) => setField<String>('created_by', value);

  String? get email => getField<String>('email');
  set email(String? value) => setField<String>('email', value);

  String? get theme => getField<String>('theme');
  set theme(String? value) => setField<String>('theme', value);

  String? get question => getField<String>('question');
  set question(String? value) => setField<String>('question', value);

  String? get image => getField<String>('image');
  set image(String? value) => setField<String>('image', value);

  bool? get hasAnswer => getField<bool>('has_answer');
  set hasAnswer(bool? value) => setField<bool>('has_answer', value);

  String? get answerBy => getField<String>('answer_by');
  set answerBy(String? value) => setField<String>('answer_by', value);

  String? get answer => getField<String>('answer');
  set answer(String? value) => setField<String>('answer', value);

  DateTime? get answerDate => getField<DateTime>('answer_date');
  set answerDate(DateTime? value) => setField<DateTime>('answer_date', value);
}
