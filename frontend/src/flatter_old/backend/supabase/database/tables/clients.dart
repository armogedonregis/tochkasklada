import '../database.dart';

class ClientsTable extends SupabaseTable<ClientsRow> {
  @override
  String get tableName => 'clients';

  @override
  ClientsRow createRow(Map<String, dynamic> data) => ClientsRow(data);
}

class ClientsRow extends SupabaseDataRow {
  ClientsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => ClientsTable();

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  String get phone => getField<String>('phone')!;
  set phone(String value) => setField<String>('phone', value);

  String get email => getField<String>('email')!;
  set email(String value) => setField<String>('email', value);

  String? get clientName => getField<String>('client_name');
  set clientName(String? value) => setField<String>('client_name', value);

  String? get cellID => getField<String>('cellID');
  set cellID(String? value) => setField<String>('cellID', value);

  String? get createdBy => getField<String>('created_by');
  set createdBy(String? value) => setField<String>('created_by', value);

  String get clientId => getField<String>('client_id')!;
  set clientId(String value) => setField<String>('client_id', value);

  String? get inviteToken => getField<String>('invite_token');
  set inviteToken(String? value) => setField<String>('invite_token', value);

  String? get userId => getField<String>('user_id');
  set userId(String? value) => setField<String>('user_id', value);

  String? get secondName => getField<String>('second_name');
  set secondName(String? value) => setField<String>('second_name', value);

  String? get adminComments => getField<String>('admin_comments');
  set adminComments(String? value) => setField<String>('admin_comments', value);
}
