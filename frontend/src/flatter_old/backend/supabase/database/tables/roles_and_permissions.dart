import '../database.dart';

class RolesAndPermissionsTable extends SupabaseTable<RolesAndPermissionsRow> {
  @override
  String get tableName => 'roles_and_permissions';

  @override
  RolesAndPermissionsRow createRow(Map<String, dynamic> data) =>
      RolesAndPermissionsRow(data);
}

class RolesAndPermissionsRow extends SupabaseDataRow {
  RolesAndPermissionsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => RolesAndPermissionsTable();

  String get roleId => getField<String>('role_id')!;
  set roleId(String value) => setField<String>('role_id', value);

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  String get permissionsId => getField<String>('permissions_id')!;
  set permissionsId(String value) => setField<String>('permissions_id', value);

  String? get createdBy => getField<String>('created_by');
  set createdBy(String? value) => setField<String>('created_by', value);
}
