import '../database.dart';

class UsersByRolesTable extends SupabaseTable<UsersByRolesRow> {
  @override
  String get tableName => 'users_by_roles';

  @override
  UsersByRolesRow createRow(Map<String, dynamic> data) => UsersByRolesRow(data);
}

class UsersByRolesRow extends SupabaseDataRow {
  UsersByRolesRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => UsersByRolesTable();

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  String get email => getField<String>('email')!;
  set email(String value) => setField<String>('email', value);

  String? get phone => getField<String>('phone');
  set phone(String? value) => setField<String>('phone', value);

  String? get username => getField<String>('username');
  set username(String? value) => setField<String>('username', value);

  int? get franchiseZone => getField<int>('franchiseZone');
  set franchiseZone(int? value) => setField<int>('franchiseZone', value);

  String? get roleName => getField<String>('role_name');
  set roleName(String? value) => setField<String>('role_name', value);

  String get createdBy => getField<String>('created_by')!;
  set createdBy(String value) => setField<String>('created_by', value);

  String? get avatarPatch => getField<String>('avatar_patch');
  set avatarPatch(String? value) => setField<String>('avatar_patch', value);

  String? get invitedBy => getField<String>('invited_by');
  set invitedBy(String? value) => setField<String>('invited_by', value);

  String? get appPermissionRole => getField<String>('app_permission_role');
  set appPermissionRole(String? value) =>
      setField<String>('app_permission_role', value);
}
