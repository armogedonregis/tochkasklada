import '../database.dart';

class ClientNotificationsTable extends SupabaseTable<ClientNotificationsRow> {
  @override
  String get tableName => 'client_notifications';

  @override
  ClientNotificationsRow createRow(Map<String, dynamic> data) =>
      ClientNotificationsRow(data);
}

class ClientNotificationsRow extends SupabaseDataRow {
  ClientNotificationsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => ClientNotificationsTable();

  String get id => getField<String>('id')!;
  set id(String value) => setField<String>('id', value);

  String get clientId => getField<String>('client_id')!;
  set clientId(String value) => setField<String>('client_id', value);

  String get notificationId => getField<String>('notification_id')!;
  set notificationId(String value) =>
      setField<String>('notification_id', value);

  DateTime? get sentAt => getField<DateTime>('sent_at');
  set sentAt(DateTime? value) => setField<DateTime>('sent_at', value);

  bool? get isRead => getField<bool>('is_read');
  set isRead(bool? value) => setField<bool>('is_read', value);

  int? get supportRequestId => getField<int>('support_request_id');
  set supportRequestId(int? value) =>
      setField<int>('support_request_id', value);

  String? get userId => getField<String>('user_id');
  set userId(String? value) => setField<String>('user_id', value);
}
