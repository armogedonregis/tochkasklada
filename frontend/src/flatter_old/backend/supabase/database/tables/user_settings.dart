import '../database.dart';

class UserSettingsTable extends SupabaseTable<UserSettingsRow> {
  @override
  String get tableName => 'user_settings';

  @override
  UserSettingsRow createRow(Map<String, dynamic> data) => UserSettingsRow(data);
}

class UserSettingsRow extends SupabaseDataRow {
  UserSettingsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => UserSettingsTable();

  bool? get viewAsFranchiser => getField<bool>('view_as_franchiser');
  set viewAsFranchiser(bool? value) =>
      setField<bool>('view_as_franchiser', value);

  bool? get showFreeCells => getField<bool>('show_free_cells');
  set showFreeCells(bool? value) => setField<bool>('show_free_cells', value);

  bool? get showOnlyTodayNewclients =>
      getField<bool>('show_only_today_newclients');
  set showOnlyTodayNewclients(bool? value) =>
      setField<bool>('show_only_today_newclients', value);

  bool? get showOnlyTodaysMatches => getField<bool>('show_only_todays_matches');
  set showOnlyTodaysMatches(bool? value) =>
      setField<bool>('show_only_todays_matches', value);

  bool? get showOnlyTodaysPayments =>
      getField<bool>('show_only_todays_payments');
  set showOnlyTodaysPayments(bool? value) =>
      setField<bool>('show_only_todays_payments', value);

  bool? get showTodaysRequests => getField<bool>('show_todays_requests');
  set showTodaysRequests(bool? value) =>
      setField<bool>('show_todays_requests', value);

  bool? get showTodaysNewusers => getField<bool>('show_todays_newusers');
  set showTodaysNewusers(bool? value) =>
      setField<bool>('show_todays_newusers', value);

  String? get role => getField<String>('role');
  set role(String? value) => setField<String>('role', value);

  String get email => getField<String>('email')!;
  set email(String value) => setField<String>('email', value);
}
