import '../database.dart';

class ContainersTable extends SupabaseTable<ContainersRow> {
  @override
  String get tableName => 'containers';

  @override
  ContainersRow createRow(Map<String, dynamic> data) => ContainersRow(data);
}

class ContainersRow extends SupabaseDataRow {
  ContainersRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => ContainersTable();

  int get id => getField<int>('id')!;
  set id(int value) => setField<int>('id', value);

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  String? get location => getField<String>('location');
  set location(String? value) => setField<String>('location', value);

  String? get createdBy => getField<String>('created_by');
  set createdBy(String? value) => setField<String>('created_by', value);

  int? get franchise => getField<int>('franchise');
  set franchise(int? value) => setField<int>('franchise', value);
}
