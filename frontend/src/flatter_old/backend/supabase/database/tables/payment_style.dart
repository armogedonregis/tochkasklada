import '../database.dart';

class PaymentStyleTable extends SupabaseTable<PaymentStyleRow> {
  @override
  String get tableName => 'paymentStyle';

  @override
  PaymentStyleRow createRow(Map<String, dynamic> data) => PaymentStyleRow(data);
}

class PaymentStyleRow extends SupabaseDataRow {
  PaymentStyleRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => PaymentStyleTable();

  int get id => getField<int>('id')!;
  set id(int value) => setField<int>('id', value);

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  String? get style => getField<String>('style');
  set style(String? value) => setField<String>('style', value);

  String? get descriptionUi => getField<String>('description_ui');
  set descriptionUi(String? value) => setField<String>('description_ui', value);
}
