import '../database.dart';

class OnReviewTable extends SupabaseTable<OnReviewRow> {
  @override
  String get tableName => 'on_review';

  @override
  OnReviewRow createRow(Map<String, dynamic> data) => OnReviewRow(data);
}

class OnReviewRow extends SupabaseDataRow {
  OnReviewRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => OnReviewTable();

  String? get cellId => getField<String>('cell_id');
  set cellId(String? value) => setField<String>('cell_id', value);

  String? get closingId => getField<String>('closing_id');
  set closingId(String? value) => setField<String>('closing_id', value);

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

  String? get clientEmail => getField<String>('client_email');
  set clientEmail(String? value) => setField<String>('client_email', value);

  DateTime? get endDate => getField<DateTime>('end_date');
  set endDate(DateTime? value) => setField<DateTime>('end_date', value);

  bool? get stopRent => getField<bool>('stop_rent');
  set stopRent(bool? value) => setField<bool>('stop_rent', value);

  String? get clientName => getField<String>('client_name');
  set clientName(String? value) => setField<String>('client_name', value);

  String? get clientPhone => getField<String>('client_phone');
  set clientPhone(String? value) => setField<String>('client_phone', value);

  int? get rowNum => getField<int>('row_num');
  set rowNum(int? value) => setField<int>('row_num', value);
}
