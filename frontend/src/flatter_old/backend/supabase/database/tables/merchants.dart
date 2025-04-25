import '../database.dart';

class MerchantsTable extends SupabaseTable<MerchantsRow> {
  @override
  String get tableName => 'merchants';

  @override
  MerchantsRow createRow(Map<String, dynamic> data) => MerchantsRow(data);
}

class MerchantsRow extends SupabaseDataRow {
  MerchantsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => MerchantsTable();

  String get merchantId => getField<String>('merchant_id')!;
  set merchantId(String value) => setField<String>('merchant_id', value);

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  String? get terminalKey => getField<String>('terminal_key');
  set terminalKey(String? value) => setField<String>('terminal_key', value);

  String? get currency => getField<String>('currency');
  set currency(String? value) => setField<String>('currency', value);

  String? get termActivity => getField<String>('term_activity');
  set termActivity(String? value) => setField<String>('term_activity', value);

  String? get aesPass => getField<String>('aes_pass');
  set aesPass(String? value) => setField<String>('aes_pass', value);
}
