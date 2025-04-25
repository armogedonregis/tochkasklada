import '../database.dart';

class ReservedTable extends SupabaseTable<ReservedRow> {
  @override
  String get tableName => 'reserved';

  @override
  ReservedRow createRow(Map<String, dynamic> data) => ReservedRow(data);
}

class ReservedRow extends SupabaseDataRow {
  ReservedRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => ReservedTable();

  String get reservationId => getField<String>('reservation_id')!;
  set reservationId(String value) => setField<String>('reservation_id', value);

  String get cellId => getField<String>('cell_id')!;
  set cellId(String value) => setField<String>('cell_id', value);

  String get clientId => getField<String>('client_id')!;
  set clientId(String value) => setField<String>('client_id', value);

  DateTime? get reservedUntil => getField<DateTime>('reserved_until');
  set reservedUntil(DateTime? value) =>
      setField<DateTime>('reserved_until', value);
}
