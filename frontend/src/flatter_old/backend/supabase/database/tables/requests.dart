import '../database.dart';

class RequestsTable extends SupabaseTable<RequestsRow> {
  @override
  String get tableName => 'requests';

  @override
  RequestsRow createRow(Map<String, dynamic> data) => RequestsRow(data);
}

class RequestsRow extends SupabaseDataRow {
  RequestsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => RequestsTable();

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  bool? get processed => getField<bool>('processed');
  set processed(bool? value) => setField<bool>('processed', value);

  String? get status => getField<String>('status');
  set status(String? value) => setField<String>('status', value);

  String get phone => getField<String>('phone')!;
  set phone(String value) => setField<String>('phone', value);

  String? get clientName => getField<String>('client_name');
  set clientName(String? value) => setField<String>('client_name', value);

  String? get size => getField<String>('size');
  set size(String? value) => setField<String>('size', value);

  String get email => getField<String>('email')!;
  set email(String value) => setField<String>('email', value);

  String? get notes => getField<String>('notes');
  set notes(String? value) => setField<String>('notes', value);

  String? get manager => getField<String>('manager');
  set manager(String? value) => setField<String>('manager', value);

  String? get reservedCell => getField<String>('reserved_cell');
  set reservedCell(String? value) => setField<String>('reserved_cell', value);

  String? get userId => getField<String>('user_id');
  set userId(String? value) => setField<String>('user_id', value);

  String get requestId => getField<String>('request_id')!;
  set requestId(String value) => setField<String>('request_id', value);

  DateTime? get waitingTimeD => getField<DateTime>('waitingTimeD');
  set waitingTimeD(DateTime? value) =>
      setField<DateTime>('waitingTimeD', value);

  String? get location => getField<String>('location');
  set location(String? value) => setField<String>('location', value);

  int? get franchise => getField<int>('franchise');
  set franchise(int? value) => setField<int>('franchise', value);
}
