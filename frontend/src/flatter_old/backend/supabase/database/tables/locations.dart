import '../database.dart';

class LocationsTable extends SupabaseTable<LocationsRow> {
  @override
  String get tableName => 'locations';

  @override
  LocationsRow createRow(Map<String, dynamic> data) => LocationsRow(data);
}

class LocationsRow extends SupabaseDataRow {
  LocationsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => LocationsTable();

  String get locationId => getField<String>('location_id')!;
  set locationId(String value) => setField<String>('location_id', value);

  String get locName => getField<String>('locName')!;
  set locName(String value) => setField<String>('locName', value);

  bool? get isActive => getField<bool>('is_active');
  set isActive(bool? value) => setField<bool>('is_active', value);

  int get franchise => getField<int>('franchise')!;
  set franchise(int value) => setField<int>('franchise', value);

  String? get createdBy => getField<String>('created_by');
  set createdBy(String? value) => setField<String>('created_by', value);

  String get locGeo => getField<String>('loc_geo')!;
  set locGeo(String value) => setField<String>('loc_geo', value);
}
