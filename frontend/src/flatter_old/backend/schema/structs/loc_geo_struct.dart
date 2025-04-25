// ignore_for_file: unnecessary_getters_setters

import '/backend/schema/util/schema_util.dart';

import 'index.dart';
import '/flutter_flow/flutter_flow_util.dart';

class LocGeoStruct extends BaseStruct {
  LocGeoStruct({
    String? adress,
    String? creator,
    String? createdBy,
    String? ruName,
    String? siteAdress,
    int? areaPrice,
    int? franchisee,
    String? locId,
  })  : _adress = adress,
        _creator = creator,
        _createdBy = createdBy,
        _ruName = ruName,
        _siteAdress = siteAdress,
        _areaPrice = areaPrice,
        _franchisee = franchisee,
        _locId = locId;

  // "adress" field.
  String? _adress;
  String get adress => _adress ?? '';
  set adress(String? val) => _adress = val;

  bool hasAdress() => _adress != null;

  // "creator" field.
  String? _creator;
  String get creator => _creator ?? '';
  set creator(String? val) => _creator = val;

  bool hasCreator() => _creator != null;

  // "created_by" field.
  String? _createdBy;
  String get createdBy => _createdBy ?? '';
  set createdBy(String? val) => _createdBy = val;

  bool hasCreatedBy() => _createdBy != null;

  // "ru_name" field.
  String? _ruName;
  String get ruName => _ruName ?? '';
  set ruName(String? val) => _ruName = val;

  bool hasRuName() => _ruName != null;

  // "site_adress" field.
  String? _siteAdress;
  String get siteAdress => _siteAdress ?? '';
  set siteAdress(String? val) => _siteAdress = val;

  bool hasSiteAdress() => _siteAdress != null;

  // "area_price" field.
  int? _areaPrice;
  int get areaPrice => _areaPrice ?? 0;
  set areaPrice(int? val) => _areaPrice = val;

  void incrementAreaPrice(int amount) => areaPrice = areaPrice + amount;

  bool hasAreaPrice() => _areaPrice != null;

  // "franchisee" field.
  int? _franchisee;
  int get franchisee => _franchisee ?? 0;
  set franchisee(int? val) => _franchisee = val;

  void incrementFranchisee(int amount) => franchisee = franchisee + amount;

  bool hasFranchisee() => _franchisee != null;

  // "loc_id" field.
  String? _locId;
  String get locId => _locId ?? '';
  set locId(String? val) => _locId = val;

  bool hasLocId() => _locId != null;

  static LocGeoStruct fromMap(Map<String, dynamic> data) => LocGeoStruct(
        adress: data['adress'] as String?,
        creator: data['creator'] as String?,
        createdBy: data['created_by'] as String?,
        ruName: data['ru_name'] as String?,
        siteAdress: data['site_adress'] as String?,
        areaPrice: castToType<int>(data['area_price']),
        franchisee: castToType<int>(data['franchisee']),
        locId: data['loc_id'] as String?,
      );

  static LocGeoStruct? maybeFromMap(dynamic data) =>
      data is Map ? LocGeoStruct.fromMap(data.cast<String, dynamic>()) : null;

  Map<String, dynamic> toMap() => {
        'adress': _adress,
        'creator': _creator,
        'created_by': _createdBy,
        'ru_name': _ruName,
        'site_adress': _siteAdress,
        'area_price': _areaPrice,
        'franchisee': _franchisee,
        'loc_id': _locId,
      }.withoutNulls;

  @override
  Map<String, dynamic> toSerializableMap() => {
        'adress': serializeParam(
          _adress,
          ParamType.String,
        ),
        'creator': serializeParam(
          _creator,
          ParamType.String,
        ),
        'created_by': serializeParam(
          _createdBy,
          ParamType.String,
        ),
        'ru_name': serializeParam(
          _ruName,
          ParamType.String,
        ),
        'site_adress': serializeParam(
          _siteAdress,
          ParamType.String,
        ),
        'area_price': serializeParam(
          _areaPrice,
          ParamType.int,
        ),
        'franchisee': serializeParam(
          _franchisee,
          ParamType.int,
        ),
        'loc_id': serializeParam(
          _locId,
          ParamType.String,
        ),
      }.withoutNulls;

  static LocGeoStruct fromSerializableMap(Map<String, dynamic> data) =>
      LocGeoStruct(
        adress: deserializeParam(
          data['adress'],
          ParamType.String,
          false,
        ),
        creator: deserializeParam(
          data['creator'],
          ParamType.String,
          false,
        ),
        createdBy: deserializeParam(
          data['created_by'],
          ParamType.String,
          false,
        ),
        ruName: deserializeParam(
          data['ru_name'],
          ParamType.String,
          false,
        ),
        siteAdress: deserializeParam(
          data['site_adress'],
          ParamType.String,
          false,
        ),
        areaPrice: deserializeParam(
          data['area_price'],
          ParamType.int,
          false,
        ),
        franchisee: deserializeParam(
          data['franchisee'],
          ParamType.int,
          false,
        ),
        locId: deserializeParam(
          data['loc_id'],
          ParamType.String,
          false,
        ),
      );

  @override
  String toString() => 'LocGeoStruct(${toMap()})';

  @override
  bool operator ==(Object other) {
    return other is LocGeoStruct &&
        adress == other.adress &&
        creator == other.creator &&
        createdBy == other.createdBy &&
        ruName == other.ruName &&
        siteAdress == other.siteAdress &&
        areaPrice == other.areaPrice &&
        franchisee == other.franchisee &&
        locId == other.locId;
  }

  @override
  int get hashCode => const ListEquality().hash([
        adress,
        creator,
        createdBy,
        ruName,
        siteAdress,
        areaPrice,
        franchisee,
        locId
      ]);
}

LocGeoStruct createLocGeoStruct({
  String? adress,
  String? creator,
  String? createdBy,
  String? ruName,
  String? siteAdress,
  int? areaPrice,
  int? franchisee,
  String? locId,
}) =>
    LocGeoStruct(
      adress: adress,
      creator: creator,
      createdBy: createdBy,
      ruName: ruName,
      siteAdress: siteAdress,
      areaPrice: areaPrice,
      franchisee: franchisee,
      locId: locId,
    );
