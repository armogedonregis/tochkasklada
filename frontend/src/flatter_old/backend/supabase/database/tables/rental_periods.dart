import '../database.dart';

class RentalPeriodsTable extends SupabaseTable<RentalPeriodsRow> {
  @override
  String get tableName => 'rentalPeriods';

  @override
  RentalPeriodsRow createRow(Map<String, dynamic> data) =>
      RentalPeriodsRow(data);
}

class RentalPeriodsRow extends SupabaseDataRow {
  RentalPeriodsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => RentalPeriodsTable();

  int get periodId => getField<int>('period_id')!;
  set periodId(int value) => setField<int>('period_id', value);

  String? get description => getField<String>('description');
  set description(String? value) => setField<String>('description', value);

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  String? get createdBy => getField<String>('created_by');
  set createdBy(String? value) => setField<String>('created_by', value);

  int? get periodDays => getField<int>('period_days');
  set periodDays(int? value) => setField<int>('period_days', value);
}
