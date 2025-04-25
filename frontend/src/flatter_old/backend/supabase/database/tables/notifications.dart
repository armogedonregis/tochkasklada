import '../database.dart';

class NotificationsTable extends SupabaseTable<NotificationsRow> {
  @override
  String get tableName => 'notifications';

  @override
  NotificationsRow createRow(Map<String, dynamic> data) =>
      NotificationsRow(data);
}

class NotificationsRow extends SupabaseDataRow {
  NotificationsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => NotificationsTable();

  String get notificationId => getField<String>('notification_id')!;
  set notificationId(String value) =>
      setField<String>('notification_id', value);

  String get iconName => getField<String>('icon_name')!;
  set iconName(String value) => setField<String>('icon_name', value);

  String get senderName => getField<String>('sender_name')!;
  set senderName(String value) => setField<String>('sender_name', value);

  String get title => getField<String>('title')!;
  set title(String value) => setField<String>('title', value);

  String get messageTemplate => getField<String>('message_template')!;
  set messageTemplate(String value) =>
      setField<String>('message_template', value);

  DateTime? get createdAt => getField<DateTime>('created_at');
  set createdAt(DateTime? value) => setField<DateTime>('created_at', value);

  bool? get isRead => getField<bool>('is_read');
  set isRead(bool? value) => setField<bool>('is_read', value);

  String? get color => getField<String>('color');
  set color(String? value) => setField<String>('color', value);
}
