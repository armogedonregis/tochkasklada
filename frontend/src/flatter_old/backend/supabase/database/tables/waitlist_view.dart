import '../database.dart';

class WaitlistViewTable extends SupabaseTable<WaitlistViewRow> {
  @override
  String get tableName => 'waitlist_view';

  @override
  WaitlistViewRow createRow(Map<String, dynamic> data) => WaitlistViewRow(data);
}

class WaitlistViewRow extends SupabaseDataRow {
  WaitlistViewRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => WaitlistViewTable();

  String? get requestId => getField<String>('request_id');
  set requestId(String? value) => setField<String>('request_id', value);

  DateTime? get requestDate => getField<DateTime>('request_date');
  set requestDate(DateTime? value) => setField<DateTime>('request_date', value);

  String? get phone => getField<String>('phone');
  set phone(String? value) => setField<String>('phone', value);

  String? get email => getField<String>('email');
  set email(String? value) => setField<String>('email', value);

  String? get clientName => getField<String>('client_name');
  set clientName(String? value) => setField<String>('client_name', value);

  DateTime? get waitingTime => getField<DateTime>('waiting_time');
  set waitingTime(DateTime? value) => setField<DateTime>('waiting_time', value);

  DateTime? get readyUntil => getField<DateTime>('ready_until');
  set readyUntil(DateTime? value) => setField<DateTime>('ready_until', value);

  String? get location => getField<String>('location');
  set location(String? value) => setField<String>('location', value);

  String? get size => getField<String>('size');
  set size(String? value) => setField<String>('size', value);

  String? get availableCellSummary =>
      getField<String>('available_cell_summary');
  set availableCellSummary(String? value) =>
      setField<String>('available_cell_summary', value);

  bool? get hasAvailable => getField<bool>('has_available');
  set hasAvailable(bool? value) => setField<bool>('has_available', value);

  String? get waitingStatus => getField<String>('waiting_status');
  set waitingStatus(String? value) => setField<String>('waiting_status', value);
}
