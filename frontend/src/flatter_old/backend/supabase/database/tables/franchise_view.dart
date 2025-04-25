import '../database.dart';

class FranchiseViewTable extends SupabaseTable<FranchiseViewRow> {
  @override
  String get tableName => 'franchise_view';

  @override
  FranchiseViewRow createRow(Map<String, dynamic> data) =>
      FranchiseViewRow(data);
}

class FranchiseViewRow extends SupabaseDataRow {
  FranchiseViewRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => FranchiseViewTable();

  int? get franchiseId => getField<int>('franchise_id');
  set franchiseId(int? value) => setField<int>('franchise_id', value);

  String? get franchiasiiMail => getField<String>('franchiasii_mail');
  set franchiasiiMail(String? value) =>
      setField<String>('franchiasii_mail', value);

  String? get franchiseName => getField<String>('franchise_name');
  set franchiseName(String? value) => setField<String>('franchise_name', value);

  String? get franchiseEmail => getField<String>('franchise_email');
  set franchiseEmail(String? value) =>
      setField<String>('franchise_email', value);

  String? get franchisePhone => getField<String>('franchise_phone');
  set franchisePhone(String? value) =>
      setField<String>('franchise_phone', value);

  String? get franchiseAvatar => getField<String>('franchise_avatar');
  set franchiseAvatar(String? value) =>
      setField<String>('franchise_avatar', value);

  List<String> get locationsIds => getListField<String>('locations_ids');
  set locationsIds(List<String>? value) =>
      setListField<String>('locations_ids', value);

  List<String> get otherUsersEmails =>
      getListField<String>('other_users_emails');
  set otherUsersEmails(List<String>? value) =>
      setListField<String>('other_users_emails', value);

  int? get rentedCells => getField<int>('rented_cells');
  set rentedCells(int? value) => setField<int>('rented_cells', value);
}
