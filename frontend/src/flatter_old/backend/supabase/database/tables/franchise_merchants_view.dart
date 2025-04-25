import '../database.dart';

class FranchiseMerchantsViewTable
    extends SupabaseTable<FranchiseMerchantsViewRow> {
  @override
  String get tableName => 'franchise_merchants_view';

  @override
  FranchiseMerchantsViewRow createRow(Map<String, dynamic> data) =>
      FranchiseMerchantsViewRow(data);
}

class FranchiseMerchantsViewRow extends SupabaseDataRow {
  FranchiseMerchantsViewRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => FranchiseMerchantsViewTable();

  int? get franchiseId => getField<int>('franchise_id');
  set franchiseId(int? value) => setField<int>('franchise_id', value);

  String? get franchiseEmail => getField<String>('franchise_email');
  set franchiseEmail(String? value) =>
      setField<String>('franchise_email', value);

  String? get merchantId => getField<String>('merchant_id');
  set merchantId(String? value) => setField<String>('merchant_id', value);

  String? get terminalKey => getField<String>('terminal_key');
  set terminalKey(String? value) => setField<String>('terminal_key', value);

  String? get termActivity => getField<String>('term_activity');
  set termActivity(String? value) => setField<String>('term_activity', value);

  String? get aesPass => getField<String>('aes_pass');
  set aesPass(String? value) => setField<String>('aes_pass', value);
}
