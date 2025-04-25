import '../database.dart';

class DashboardItemsTable extends SupabaseTable<DashboardItemsRow> {
  @override
  String get tableName => 'dashboard_items';

  @override
  DashboardItemsRow createRow(Map<String, dynamic> data) =>
      DashboardItemsRow(data);
}

class DashboardItemsRow extends SupabaseDataRow {
  DashboardItemsRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => DashboardItemsTable();

  int? get franchiseId => getField<int>('franchise_id');
  set franchiseId(int? value) => setField<int>('franchise_id', value);

  int? get freeCells => getField<int>('free_cells');
  set freeCells(int? value) => setField<int>('free_cells', value);

  int? get clientsThisMonth => getField<int>('clients_this_month');
  set clientsThisMonth(int? value) =>
      setField<int>('clients_this_month', value);

  int? get clientsToday => getField<int>('clients_today');
  set clientsToday(int? value) => setField<int>('clients_today', value);

  int? get requestsLead => getField<int>('requests_lead');
  set requestsLead(int? value) => setField<int>('requests_lead', value);

  int? get requestsLeadToday => getField<int>('requests_lead_today');
  set requestsLeadToday(int? value) =>
      setField<int>('requests_lead_today', value);

  int? get requestsReserved => getField<int>('requests_reserved');
  set requestsReserved(int? value) => setField<int>('requests_reserved', value);

  int? get requestsReservedThisMonth =>
      getField<int>('requests_reserved_this_month');
  set requestsReservedThisMonth(int? value) =>
      setField<int>('requests_reserved_this_month', value);

  int? get requestsReservedToday => getField<int>('requests_reserved_today');
  set requestsReservedToday(int? value) =>
      setField<int>('requests_reserved_today', value);

  int? get paymentsThisMonth => getField<int>('payments_this_month');
  set paymentsThisMonth(int? value) =>
      setField<int>('payments_this_month', value);

  int? get paymentsToday => getField<int>('payments_today');
  set paymentsToday(int? value) => setField<int>('payments_today', value);

  int? get newMembershipsThisMonth =>
      getField<int>('new_memberships_this_month');
  set newMembershipsThisMonth(int? value) =>
      setField<int>('new_memberships_this_month', value);

  int? get newMembershipsToday => getField<int>('new_memberships_today');
  set newMembershipsToday(int? value) =>
      setField<int>('new_memberships_today', value);

  int? get totalWaitlist => getField<int>('total_waitlist');
  set totalWaitlist(int? value) => setField<int>('total_waitlist', value);

  int? get totalMatching => getField<int>('total_matching');
  set totalMatching(int? value) => setField<int>('total_matching', value);
}
