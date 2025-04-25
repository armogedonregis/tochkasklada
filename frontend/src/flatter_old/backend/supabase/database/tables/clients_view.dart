import '../database.dart';

class ClientsViewTable extends SupabaseTable<ClientsViewRow> {
  @override
  String get tableName => 'clients_view';

  @override
  ClientsViewRow createRow(Map<String, dynamic> data) => ClientsViewRow(data);
}

class ClientsViewRow extends SupabaseDataRow {
  ClientsViewRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => ClientsViewTable();

  String? get clientId => getField<String>('client_id');
  set clientId(String? value) => setField<String>('client_id', value);

  DateTime? get createdAt => getField<DateTime>('created_at');
  set createdAt(DateTime? value) => setField<DateTime>('created_at', value);

  String? get phone => getField<String>('phone');
  set phone(String? value) => setField<String>('phone', value);

  String? get email => getField<String>('email');
  set email(String? value) => setField<String>('email', value);

  String? get clientName => getField<String>('client_name');
  set clientName(String? value) => setField<String>('client_name', value);

  String? get secondName => getField<String>('second_name');
  set secondName(String? value) => setField<String>('second_name', value);

  String? get adminComments => getField<String>('admin_comments');
  set adminComments(String? value) => setField<String>('admin_comments', value);

  String? get createdBy => getField<String>('created_by');
  set createdBy(String? value) => setField<String>('created_by', value);

  int? get totalPayments => getField<int>('total_payments');
  set totalPayments(int? value) => setField<int>('total_payments', value);

  DateTime? get lastPaymentDate => getField<DateTime>('last_payment_date');
  set lastPaymentDate(DateTime? value) =>
      setField<DateTime>('last_payment_date', value);

  int? get currentRentedCells => getField<int>('current_rented_cells');
  set currentRentedCells(int? value) =>
      setField<int>('current_rented_cells', value);

  String? get rentedCells => getField<String>('rented_cells');
  set rentedCells(String? value) => setField<String>('rented_cells', value);

  String? get rentedEndDates => getField<String>('rented_end_dates');
  set rentedEndDates(String? value) =>
      setField<String>('rented_end_dates', value);

  int? get currentReservedCells => getField<int>('current_reserved_cells');
  set currentReservedCells(int? value) =>
      setField<int>('current_reserved_cells', value);

  String? get reservedCells => getField<String>('reserved_cells');
  set reservedCells(String? value) => setField<String>('reserved_cells', value);

  String? get reservedEndDates => getField<String>('reserved_end_dates');
  set reservedEndDates(String? value) =>
      setField<String>('reserved_end_dates', value);

  int? get overdueCells => getField<int>('overdue_cells');
  set overdueCells(int? value) => setField<int>('overdue_cells', value);

  bool? get hasBlockedCells => getField<bool>('has_blocked_cells');
  set hasBlockedCells(bool? value) =>
      setField<bool>('has_blocked_cells', value);

  String? get activeFranchises => getField<String>('active_franchises');
  set activeFranchises(String? value) =>
      setField<String>('active_franchises', value);

  String? get franchiseHistory => getField<String>('franchise_history');
  set franchiseHistory(String? value) =>
      setField<String>('franchise_history', value);

  String? get clientStatus => getField<String>('client_status');
  set clientStatus(String? value) => setField<String>('client_status', value);
}
