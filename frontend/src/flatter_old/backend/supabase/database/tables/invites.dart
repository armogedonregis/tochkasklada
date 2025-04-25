import '../database.dart';

class InvitesTable extends SupabaseTable<InvitesRow> {
  @override
  String get tableName => 'invites';

  @override
  InvitesRow createRow(Map<String, dynamic> data) => InvitesRow(data);
}

class InvitesRow extends SupabaseDataRow {
  InvitesRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => InvitesTable();

  String get inviteID => getField<String>('inviteID')!;
  set inviteID(String value) => setField<String>('inviteID', value);

  DateTime get created => getField<DateTime>('created')!;
  set created(DateTime value) => setField<DateTime>('created', value);

  DateTime? get validUntil => getField<DateTime>('valid_until');
  set validUntil(DateTime? value) => setField<DateTime>('valid_until', value);

  String get email => getField<String>('email')!;
  set email(String value) => setField<String>('email', value);

  String? get role => getField<String>('role');
  set role(String? value) => setField<String>('role', value);

  String? get username => getField<String>('username');
  set username(String? value) => setField<String>('username', value);

  String? get invitedBy => getField<String>('invited_by');
  set invitedBy(String? value) => setField<String>('invited_by', value);

  String? get createdBy => getField<String>('created_by');
  set createdBy(String? value) => setField<String>('created_by', value);

  int? get franchisee => getField<int>('franchisee');
  set franchisee(int? value) => setField<int>('franchisee', value);

  String get inviteStatus => getField<String>('invite_status')!;
  set inviteStatus(String value) => setField<String>('invite_status', value);
}
