import '../database.dart';

class ReserveTokensTable extends SupabaseTable<ReserveTokensRow> {
  @override
  String get tableName => 'reserve_tokens';

  @override
  ReserveTokensRow createRow(Map<String, dynamic> data) =>
      ReserveTokensRow(data);
}

class ReserveTokensRow extends SupabaseDataRow {
  ReserveTokensRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => ReserveTokensTable();

  String get id => getField<String>('id')!;
  set id(String value) => setField<String>('id', value);

  String get clientEmail => getField<String>('client_email')!;
  set clientEmail(String value) => setField<String>('client_email', value);

  String get inviteToken => getField<String>('invite_token')!;
  set inviteToken(String value) => setField<String>('invite_token', value);

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  DateTime get expiresAt => getField<DateTime>('expires_at')!;
  set expiresAt(DateTime value) => setField<DateTime>('expires_at', value);

  bool get used => getField<bool>('used')!;
  set used(bool value) => setField<bool>('used', value);

  String? get cellId => getField<String>('cell_id');
  set cellId(String? value) => setField<String>('cell_id', value);
}
