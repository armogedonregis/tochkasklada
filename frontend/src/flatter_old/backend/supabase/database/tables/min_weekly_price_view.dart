import '../database.dart';

class MinWeeklyPriceViewTable extends SupabaseTable<MinWeeklyPriceViewRow> {
  @override
  String get tableName => 'min_weekly_price_view';

  @override
  MinWeeklyPriceViewRow createRow(Map<String, dynamic> data) =>
      MinWeeklyPriceViewRow(data);
}

class MinWeeklyPriceViewRow extends SupabaseDataRow {
  MinWeeklyPriceViewRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => MinWeeklyPriceViewTable();

  String? get locationSizeId => getField<String>('location_size_id');
  set locationSizeId(String? value) =>
      setField<String>('location_size_id', value);

  String? get locationName => getField<String>('location_name');
  set locationName(String? value) => setField<String>('location_name', value);

  String? get size => getField<String>('size');
  set size(String? value) => setField<String>('size', value);

  double? get minWeeklyPrice => getField<double>('min_weekly_price');
  set minWeeklyPrice(double? value) =>
      setField<double>('min_weekly_price', value);

  double? get minDailyPrice => getField<double>('min_daily_price');
  set minDailyPrice(double? value) =>
      setField<double>('min_daily_price', value);

  int? get realMonthlyPrice => getField<int>('real_monthly_price');
  set realMonthlyPrice(int? value) =>
      setField<int>('real_monthly_price', value);

  int? get realDailyPrice => getField<int>('real_daily_price');
  set realDailyPrice(int? value) => setField<int>('real_daily_price', value);
}
