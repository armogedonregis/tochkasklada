import '../database.dart';

class PermissionsDescriptionTable
    extends SupabaseTable<PermissionsDescriptionRow> {
  @override
  String get tableName => 'permissions_description';

  @override
  PermissionsDescriptionRow createRow(Map<String, dynamic> data) =>
      PermissionsDescriptionRow(data);
}

class PermissionsDescriptionRow extends SupabaseDataRow {
  PermissionsDescriptionRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => PermissionsDescriptionTable();

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  String get permissionName => getField<String>('permission_name')!;
  set permissionName(String value) =>
      setField<String>('permission_name', value);

  String? get permissionDescription =>
      getField<String>('permission_description');
  set permissionDescription(String? value) =>
      setField<String>('permission_description', value);

  String? get createdBy => getField<String>('created_by');
  set createdBy(String? value) => setField<String>('created_by', value);
}
