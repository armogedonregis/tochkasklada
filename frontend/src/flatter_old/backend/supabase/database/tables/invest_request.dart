import '../database.dart';

class InvestRequestTable extends SupabaseTable<InvestRequestRow> {
  @override
  String get tableName => 'invest_request';

  @override
  InvestRequestRow createRow(Map<String, dynamic> data) =>
      InvestRequestRow(data);
}

class InvestRequestRow extends SupabaseDataRow {
  InvestRequestRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => InvestRequestTable();

  int get id => getField<int>('id')!;
  set id(int value) => setField<int>('id', value);

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  String? get phone => getField<String>('phone');
  set phone(String? value) => setField<String>('phone', value);

  int? get potentialInvestment => getField<int>('potential_investment');
  set potentialInvestment(int? value) =>
      setField<int>('potential_investment', value);

  String? get name => getField<String>('name');
  set name(String? value) => setField<String>('name', value);

  bool? get processed => getField<bool>('processed');
  set processed(bool? value) => setField<bool>('processed', value);

  String? get notes => getField<String>('notes');
  set notes(String? value) => setField<String>('notes', value);

  String? get email => getField<String>('email');
  set email(String? value) => setField<String>('email', value);

  String? get createdBy => getField<String>('created_by');
  set createdBy(String? value) => setField<String>('created_by', value);
}
