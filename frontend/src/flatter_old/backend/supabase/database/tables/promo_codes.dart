import '../database.dart';

class PromoCodesTable extends SupabaseTable<PromoCodesRow> {
  @override
  String get tableName => 'promo_codes';

  @override
  PromoCodesRow createRow(Map<String, dynamic> data) => PromoCodesRow(data);
}

class PromoCodesRow extends SupabaseDataRow {
  PromoCodesRow(Map<String, dynamic> data) : super(data);

  @override
  SupabaseTable get table => PromoCodesTable();

  int get id => getField<int>('id')!;
  set id(int value) => setField<int>('id', value);

  DateTime get createdAt => getField<DateTime>('created_at')!;
  set createdAt(DateTime value) => setField<DateTime>('created_at', value);

  String get promocode => getField<String>('promocode')!;
  set promocode(String value) => setField<String>('promocode', value);

  int get discountAmount => getField<int>('discount_amount')!;
  set discountAmount(int value) => setField<int>('discount_amount', value);

  bool get isPercentage => getField<bool>('is_percentage')!;
  set isPercentage(bool value) => setField<bool>('is_percentage', value);

  int get usageQty => getField<int>('usage_qty')!;
  set usageQty(int value) => setField<int>('usage_qty', value);

  int? get usedQty => getField<int>('used_qty');
  set usedQty(int? value) => setField<int>('used_qty', value);

  DateTime get validBefore => getField<DateTime>('valid_before')!;
  set validBefore(DateTime value) => setField<DateTime>('valid_before', value);

  bool get isValid => getField<bool>('is_valid')!;
  set isValid(bool value) => setField<bool>('is_valid', value);

  String get createdBy => getField<String>('created_by')!;
  set createdBy(String value) => setField<String>('created_by', value);

  int? get area => getField<int>('area');
  set area(int? value) => setField<int>('area', value);

  int? get minPriceValue => getField<int>('min_price_value');
  set minPriceValue(int? value) => setField<int>('min_price_value', value);

  int? get maxPriceValue => getField<int>('max_price_value');
  set maxPriceValue(int? value) => setField<int>('max_price_value', value);

  String? get userMail => getField<String>('user_mail');
  set userMail(String? value) => setField<String>('user_mail', value);
}
