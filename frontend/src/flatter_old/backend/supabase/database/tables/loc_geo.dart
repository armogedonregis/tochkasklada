import '../database.dart';

class LocGeoTable extends SupabaseTable<LocGeoRow> {
  @override
  String get tableName => 'loc_geo';

  @override
  LocGeoRow createRow(Map<String, dynamic> data) => LocGeoRow(data);
}

class LocGeoRow extends SupabaseDataRow {
  LocGeoRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => LocGeoTable();

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  String? get adress => getField<String>('adress');
  set adress(String? value) => setField<String>('adress', value);

  String get creator => getField<String>('creator')!;
  set creator(String value) => setField<String>('creator', value);

  String? get createdBy => getField<String>('created_by');
  set createdBy(String? value) => setField<String>('created_by', value);

  String get ruName => getField<String>('ru_name')!;
  set ruName(String value) => setField<String>('ru_name', value);

  String? get siteAdress => getField<String>('site_adress');
  set siteAdress(String? value) => setField<String>('site_adress', value);

  int? get areaPrice => getField<int>('area_price');
  set areaPrice(int? value) => setField<int>('area_price', value);

  int? get franchisee => getField<int>('franchisee');
  set franchisee(int? value) => setField<int>('franchisee', value);

  String get locId => getField<String>('loc_id')!;
  set locId(String value) => setField<String>('loc_id', value);

  String? get locCoordinates => getField<String>('loc_coordinates');
  set locCoordinates(String? value) =>
      setField<String>('loc_coordinates', value);

  String? get city => getField<String>('city');
  set city(String? value) => setField<String>('city', value);

  String? get whatsapp => getField<String>('whatsapp');
  set whatsapp(String? value) => setField<String>('whatsapp', value);

  String? get telegram => getField<String>('telegram');
  set telegram(String? value) => setField<String>('telegram', value);
}
