import '../database.dart';

class ReservedviewTable extends SupabaseTable<ReservedviewRow> {
  @override
  String get tableName => 'reservedview';

  @override
  ReservedviewRow createRow(Map<String, dynamic> data) => ReservedviewRow(data);
}

class ReservedviewRow extends SupabaseDataRow {
  ReservedviewRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => ReservedviewTable();

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
}
