import '../database.dart';

class RentedTable extends SupabaseTable<RentedRow> {
  @override
  String get tableName => 'rented';

  @override
  RentedRow createRow(Map<String, dynamic> data) => RentedRow(data);
}

class RentedRow extends SupabaseDataRow {
  RentedRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => RentedTable();

  String get rentId => getField<String>('rent_id')!;
  set rentId(String value) => setField<String>('rent_id', value);

  String get cellId => getField<String>('cell_id')!;
  set cellId(String value) => setField<String>('cell_id', value);

  String get clientId => getField<String>('client_id')!;
  set clientId(String value) => setField<String>('client_id', value);

  DateTime get startDate => getField<DateTime>('start_date')!;
  set startDate(DateTime value) => setField<DateTime>('start_date', value);

  DateTime? get endDate => getField<DateTime>('end_date');
  set endDate(DateTime? value) => setField<DateTime>('end_date', value);

  bool get stopRent => getField<bool>('stop_rent')!;
  set stopRent(bool value) => setField<bool>('stop_rent', value);
}
