import '../database.dart';

class ReservedviewPlusTokensTable
    extends SupabaseTable<ReservedviewPlusTokensRow> {
  @override
  String get tableName => 'reservedview_plus_tokens';

  @override
  ReservedviewPlusTokensRow createRow(Map<String, dynamic> data) =>
      ReservedviewPlusTokensRow(data);
}

class ReservedviewPlusTokensRow extends SupabaseDataRow {
  ReservedviewPlusTokensRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => ReservedviewPlusTokensTable();

  String? get cellId => getField<String>('cell_id');
  set cellId(String? value) => setField<String>('cell_id', value);

  String? get size => getField<String>('size');
  set size(String? value) => setField<String>('size', value);

  String? get status => getField<String>('status');
  set status(String? value) => setField<String>('status', value);

  DateTime? get reservedUntil => getField<DateTime>('reserved_until');
  set reservedUntil(DateTime? value) =>
      setField<DateTime>('reserved_until', value);

  String? get email => getField<String>('email');
  set email(String? value) => setField<String>('email', value);

  String? get phone => getField<String>('phone');
  set phone(String? value) => setField<String>('phone', value);

  String? get clientName => getField<String>('client_name');
  set clientName(String? value) => setField<String>('client_name', value);

  String? get adress => getField<String>('adress');
  set adress(String? value) => setField<String>('adress', value);

  String? get clientId => getField<String>('client_id');
  set clientId(String? value) => setField<String>('client_id', value);

  String? get reserveId => getField<String>('reserve_id');
  set reserveId(String? value) => setField<String>('reserve_id', value);

  String? get inviteToken => getField<String>('invite_token');
  set inviteToken(String? value) => setField<String>('invite_token', value);

  bool? get used => getField<bool>('used');
  set used(bool? value) => setField<bool>('used', value);
}
