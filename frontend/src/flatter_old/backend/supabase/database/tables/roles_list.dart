import '../database.dart';

class RolesListTable extends SupabaseTable<RolesListRow> {
  @override
  String get tableName => 'roles_list';

  @override
  RolesListRow createRow(Map<String, dynamic> data) => RolesListRow(data);
}

class RolesListRow extends SupabaseDataRow {
  RolesListRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => RolesListTable();

  String get id => getField<String>('id')!;
  set id(String value) => setField<String>('id', value);

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  String? get comments => getField<String>('comments');
  set comments(String? value) => setField<String>('comments', value);

  String? get createdBy => getField<String>('created_by');
  set createdBy(String? value) => setField<String>('created_by', value);

  String? get rolesRu => getField<String>('rolesRu');
  set rolesRu(String? value) => setField<String>('rolesRu', value);

  String? get defaultAvatarPatch => getField<String>('default_avatar_patch');
  set defaultAvatarPatch(String? value) =>
      setField<String>('default_avatar_patch', value);
}
