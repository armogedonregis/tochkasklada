import '../database.dart';

class ClientNotificationsViewTable
    extends SupabaseTable<ClientNotificationsViewRow> {
  @override
  String get tableName => 'client_notifications_view';

  @override
  ClientNotificationsViewRow createRow(Map<String, dynamic> data) =>
      ClientNotificationsViewRow(data);
}

class ClientNotificationsViewRow extends SupabaseDataRow {
  ClientNotificationsViewRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => ClientNotificationsViewTable();

  String? get clientNotificationId =>
      getField<String>('client_notification_id');
  set clientNotificationId(String? value) =>
      setField<String>('client_notification_id', value);

  String? get notificationId => getField<String>('notification_id');
  set notificationId(String? value) =>
      setField<String>('notification_id', value);

  String? get iconName => getField<String>('icon_name');
  set iconName(String? value) => setField<String>('icon_name', value);

  String? get senderName => getField<String>('sender_name');
  set senderName(String? value) => setField<String>('sender_name', value);

  String? get title => getField<String>('title');
  set title(String? value) => setField<String>('title', value);

  String? get messageTemplate => getField<String>('message_template');
  set messageTemplate(String? value) =>
      setField<String>('message_template', value);

  String? get color => getField<String>('color');
  set color(String? value) => setField<String>('color', value);

  String? get email => getField<String>('email');
  set email(String? value) => setField<String>('email', value);

  String? get clientId => getField<String>('client_id');
  set clientId(String? value) => setField<String>('client_id', value);

  String? get userId => getField<String>('user_id');
  set userId(String? value) => setField<String>('user_id', value);

  DateTime? get createdAt => getField<DateTime>('created_at');
  set createdAt(DateTime? value) => setField<DateTime>('created_at', value);

  bool? get isRead => getField<bool>('is_read');
  set isRead(bool? value) => setField<bool>('is_read', value);

  String? get question => getField<String>('question');
  set question(String? value) => setField<String>('question', value);

  String? get answer => getField<String>('answer');
  set answer(String? value) => setField<String>('answer', value);
}
