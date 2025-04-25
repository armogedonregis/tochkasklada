import '../database.dart';

class FranchiseTable extends SupabaseTable<FranchiseRow> {
  @override
  String get tableName => 'franchise';

  @override
  FranchiseRow createRow(Map<String, dynamic> data) => FranchiseRow(data);
}

class FranchiseRow extends SupabaseDataRow {
  FranchiseRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => FranchiseTable();

  int get id => getField<int>('id')!;
  set id(int value) => setField<int>('id', value);

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  String? get franchiasiiMail => getField<String>('franchiasii_mail');
  set franchiasiiMail(String? value) =>
      setField<String>('franchiasii_mail', value);

  String? get createdBy => getField<String>('created_by');
  set createdBy(String? value) => setField<String>('created_by', value);

  String? get email => getField<String>('email');
  set email(String? value) => setField<String>('email', value);

  String? get merchantId => getField<String>('merchant_id');
  set merchantId(String? value) => setField<String>('merchant_id', value);
}
