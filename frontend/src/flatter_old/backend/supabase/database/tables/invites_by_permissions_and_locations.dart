import '../database.dart';

class InvitesByPermissionsAndLocationsTable
    extends SupabaseTable<InvitesByPermissionsAndLocationsRow> {
  @override
  String get tableName => 'invites_by_permissions_and_locations';

  @override
  InvitesByPermissionsAndLocationsRow createRow(Map<String, dynamic> data) =>
      InvitesByPermissionsAndLocationsRow(data);
}

class InvitesByPermissionsAndLocationsRow extends SupabaseDataRow {
  InvitesByPermissionsAndLocationsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => InvitesByPermissionsAndLocationsTable();

  String get id => getField<String>('id')!;
  set id(String value) => setField<String>('id', value);

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  String get role => getField<String>('role')!;
  set role(String value) => setField<String>('role', value);

  bool? get isStandartPermissions => getField<bool>('is_standart_permissions');
  set isStandartPermissions(bool? value) =>
      setField<bool>('is_standart_permissions', value);

  String? get createdBy => getField<String>('created_by');
  set createdBy(String? value) => setField<String>('created_by', value);
}
