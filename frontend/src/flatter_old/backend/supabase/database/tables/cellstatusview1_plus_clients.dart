import '../database.dart';

class Cellstatusview1PlusClientsTable
    extends SupabaseTable<Cellstatusview1PlusClientsRow> {
  @override
  String get tableName => 'cellstatusview1_plus_clients';

  @override
  Cellstatusview1PlusClientsRow createRow(Map<String, dynamic> data) =>
      Cellstatusview1PlusClientsRow(data);
}

class Cellstatusview1PlusClientsRow extends SupabaseDataRow {
  Cellstatusview1PlusClientsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => Cellstatusview1PlusClientsTable();

  String? get cellId => getField<String>('cell_id');
  set cellId(String? value) => setField<String>('cell_id', value);

  String? get status => getField<String>('status');
  set status(String? value) => setField<String>('status', value);

  String? get adress => getField<String>('adress');
  set adress(String? value) => setField<String>('adress', value);

  String? get locationId => getField<String>('location_id');
  set locationId(String? value) => setField<String>('location_id', value);

  int? get priceTier => getField<int>('price_tier');
  set priceTier(int? value) => setField<int>('price_tier', value);

  String? get size => getField<String>('size');
  set size(String? value) => setField<String>('size', value);

  bool? get isBlocked => getField<bool>('is_blocked');
  set isBlocked(bool? value) => setField<bool>('is_blocked', value);

  DateTime? get expirationDate => getField<DateTime>('expiration_date');
  set expirationDate(DateTime? value) =>
      setField<DateTime>('expiration_date', value);

  String? get clientName => getField<String>('client_name');
  set clientName(String? value) => setField<String>('client_name', value);

  String? get clientEmail => getField<String>('client_email');
  set clientEmail(String? value) => setField<String>('client_email', value);

  String? get clientPhone => getField<String>('client_phone');
  set clientPhone(String? value) => setField<String>('client_phone', value);

  String? get adressNameRu => getField<String>('adress_name_ru');
  set adressNameRu(String? value) => setField<String>('adress_name_ru', value);

  int? get pricePerMonth => getField<int>('price_per_month');
  set pricePerMonth(int? value) => setField<int>('price_per_month', value);
}
