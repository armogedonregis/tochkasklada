import '../database.dart';

class MembershipsTable extends SupabaseTable<MembershipsRow> {
  @override
  String get tableName => 'memberships';

  @override
  MembershipsRow createRow(Map<String, dynamic> data) => MembershipsRow(data);
}

class MembershipsRow extends SupabaseDataRow {
  MembershipsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => MembershipsTable();

  int get id => getField<int>('id')!;
  set id(int value) => setField<int>('id', value);

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  String? get userId => getField<String>('user_id');
  set userId(String? value) => setField<String>('user_id', value);

  String? get role => getField<String>('role');
  set role(String? value) => setField<String>('role', value);

  int get franchiseId => getField<int>('franchise_id')!;
  set franchiseId(int value) => setField<int>('franchise_id', value);

  String get email => getField<String>('email')!;
  set email(String value) => setField<String>('email', value);
}
