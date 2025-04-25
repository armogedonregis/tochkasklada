import '../database.dart';

class CurrentRentalsTable extends SupabaseTable<CurrentRentalsRow> {
  @override
  String get tableName => 'current_rentals';

  @override
  CurrentRentalsRow createRow(Map<String, dynamic> data) =>
      CurrentRentalsRow(data);
}

class CurrentRentalsRow extends SupabaseDataRow {
  CurrentRentalsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => CurrentRentalsTable();

  String? get rentId => getField<String>('rent_id');
  set rentId(String? value) => setField<String>('rent_id', value);

  String? get cellId => getField<String>('cell_id');
  set cellId(String? value) => setField<String>('cell_id', value);

  String? get clientId => getField<String>('client_id');
  set clientId(String? value) => setField<String>('client_id', value);

  DateTime? get startDate => getField<DateTime>('start_date');
  set startDate(DateTime? value) => setField<DateTime>('start_date', value);

  DateTime? get endDate => getField<DateTime>('end_date');
  set endDate(DateTime? value) => setField<DateTime>('end_date', value);

  String? get franchise => getField<String>('franchise');
  set franchise(String? value) => setField<String>('franchise', value);
}
