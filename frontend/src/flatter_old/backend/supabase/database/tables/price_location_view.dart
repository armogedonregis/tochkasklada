import '../database.dart';

class PriceLocationViewTable extends SupabaseTable<PriceLocationViewRow> {
  @override
  String get tableName => 'price_location_view';

  @override
  PriceLocationViewRow createRow(Map<String, dynamic> data) =>
      PriceLocationViewRow(data);
}

class PriceLocationViewRow extends SupabaseDataRow {
  PriceLocationViewRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => PriceLocationViewTable();

  int? get priceId => getField<int>('price_id');
  set priceId(int? value) => setField<int>('price_id', value);

  int? get mPriceMonth => getField<int>('m_price_month');
  set mPriceMonth(int? value) => setField<int>('m_price_month', value);

  int? get mPriceDay => getField<int>('m_price_day');
  set mPriceDay(int? value) => setField<int>('m_price_day', value);

  int? get sPriceMonth => getField<int>('s_price_month');
  set sPriceMonth(int? value) => setField<int>('s_price_month', value);

  int? get sPriceDay => getField<int>('s_price_day');
  set sPriceDay(int? value) => setField<int>('s_price_day', value);

  int? get xsPriceMonth => getField<int>('xs_price_month');
  set xsPriceMonth(int? value) => setField<int>('xs_price_month', value);

  int? get xsPriceDay => getField<int>('xs_price_day');
  set xsPriceDay(int? value) => setField<int>('xs_price_day', value);

  double? get yearCoeficient => getField<double>('year_coeficient');
  set yearCoeficient(double? value) =>
      setField<double>('year_coeficient', value);

  String? get createdBy => getField<String>('created_by');
  set createdBy(String? value) => setField<String>('created_by', value);

  List<String> get locationNames => getListField<String>('location_names');
  set locationNames(List<String>? value) =>
      setListField<String>('location_names', value);
}
