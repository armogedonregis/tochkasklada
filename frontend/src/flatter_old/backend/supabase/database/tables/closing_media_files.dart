import '../database.dart';

class ClosingMediaFilesTable extends SupabaseTable<ClosingMediaFilesRow> {
  @override
  String get tableName => 'closing_media_files';

  @override
  ClosingMediaFilesRow createRow(Map<String, dynamic> data) =>
      ClosingMediaFilesRow(data);
}

class ClosingMediaFilesRow extends SupabaseDataRow {
  ClosingMediaFilesRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => ClosingMediaFilesTable();

  String get closingId => getField<String>('closing_id')!;
  set closingId(String value) => setField<String>('closing_id', value);

  String get cellId => getField<String>('cell_id')!;
  set cellId(String value) => setField<String>('cell_id', value);

  String? get frontViewUrl => getField<String>('front_view_url');
  set frontViewUrl(String? value) => setField<String>('front_view_url', value);

  String? get backViewUrl => getField<String>('back_view_url');
  set backViewUrl(String? value) => setField<String>('back_view_url', value);

  String? get lockOpenUrl => getField<String>('lock_open_url');
  set lockOpenUrl(String? value) => setField<String>('lock_open_url', value);

  String? get lockClosedUrl => getField<String>('lock_closed_url');
  set lockClosedUrl(String? value) =>
      setField<String>('lock_closed_url', value);

  bool? get clientCheck => getField<bool>('client_check');
  set clientCheck(bool? value) => setField<bool>('client_check', value);

  bool? get adminCheck => getField<bool>('admin_check');
  set adminCheck(bool? value) => setField<bool>('admin_check', value);

  DateTime? get createdAt => getField<DateTime>('created_at');
  set createdAt(DateTime? value) => setField<DateTime>('created_at', value);

  DateTime? get updatedAt => getField<DateTime>('updated_at');
  set updatedAt(DateTime? value) => setField<DateTime>('updated_at', value);

  String? get email => getField<String>('email');
  set email(String? value) => setField<String>('email', value);
}
