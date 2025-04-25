import 'package:flutter/material.dart';
import 'flutter_flow/request_manager.dart';
import '/backend/schema/enums/enums.dart';
import 'backend/supabase/supabase.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:csv/csv.dart';
import 'package:synchronized/synchronized.dart';
import 'flutter_flow/flutter_flow_util.dart';

class FFAppState extends ChangeNotifier {
  static FFAppState _instance = FFAppState._internal();

  factory FFAppState() {
    return _instance;
  }

  FFAppState._internal();

  static void reset() {
    _instance = FFAppState._internal();
  }

  Future initializePersistedState() async {
    secureStorage = FlutterSecureStorage();
    await _safeInitAsync(() async {
      _isNavOpened =
          await secureStorage.getBool('ff_isNavOpened') ?? _isNavOpened;
    });
    await _safeInitAsync(() async {
      _currentPage = await secureStorage.read(key: 'ff_currentPage') != null
          ? deserializeEnum<Pages>(
              (await secureStorage.getString('ff_currentPage')))
          : _currentPage;
    });
    await _safeInitAsync(() async {
      _viewAsFranchisor = await secureStorage.getBool('ff_viewAsFranchisor') ??
          _viewAsFranchisor;
    });
    await _safeInitAsync(() async {
      _showAvailavleCellsInLocNav =
          await secureStorage.getBool('ff_showAvailavleCellsInLocNav') ??
              _showAvailavleCellsInLocNav;
    });
    await _safeInitAsync(() async {
      _showDailyClients = await secureStorage.getBool('ff_showDailyClients') ??
          _showDailyClients;
    });
    await _safeInitAsync(() async {
      _showPaymentsDaily =
          await secureStorage.getBool('ff_showPaymentsDaily') ??
              _showPaymentsDaily;
    });
    await _safeInitAsync(() async {
      _showNewUsersDayly =
          await secureStorage.getBool('ff_showNewUsersDayly') ??
              _showNewUsersDayly;
    });
    await _safeInitAsync(() async {
      _showTodayRequestsOnly =
          await secureStorage.getBool('ff_showTodayRequestsOnly') ??
              _showTodayRequestsOnly;
    });
    await _safeInitAsync(() async {
      _showMatchesTodayOnlyOnWaiting =
          await secureStorage.getBool('ff_showMatchesTodayOnlyOnWaiting') ??
              _showMatchesTodayOnlyOnWaiting;
    });
  }

  void update(VoidCallback callback) {
    callback();
    notifyListeners();
  }

  late FlutterSecureStorage secureStorage;

  bool _isNavOpened = true;
  bool get isNavOpened => _isNavOpened;
  set isNavOpened(bool value) {
    _isNavOpened = value;
    secureStorage.setBool('ff_isNavOpened', value);
  }

  void deleteIsNavOpened() {
    secureStorage.delete(key: 'ff_isNavOpened');
  }

  int _franchisee = 0;
  int get franchisee => _franchisee;
  set franchisee(int value) {
    _franchisee = value;
  }

  String _userRole = '';
  String get userRole => _userRole;
  set userRole(String value) {
    _userRole = value;
  }

  String _userPhone = '';
  String get userPhone => _userPhone;
  set userPhone(String value) {
    _userPhone = value;
  }

  String _avatar = '';
  String get avatar => _avatar;
  set avatar(String value) {
    _avatar = value;
  }

  String _username = '';
  String get username => _username;
  set username(String value) {
    _username = value;
  }

  String _uuid = '';
  String get uuid => _uuid;
  set uuid(String value) {
    _uuid = value;
  }

  DateTime? _createdAt = DateTime.fromMillisecondsSinceEpoch(1714948620000);
  DateTime? get createdAt => _createdAt;
  set createdAt(DateTime? value) {
    _createdAt = value;
  }

  String _roleID = '';
  String get roleID => _roleID;
  set roleID(String value) {
    _roleID = value;
  }

  bool _canViewAllFranchise = false;
  bool get canViewAllFranchise => _canViewAllFranchise;
  set canViewAllFranchise(bool value) {
    _canViewAllFranchise = value;
  }

  List<PermLevel> _permLevel = [PermLevel.full];
  List<PermLevel> get permLevel => _permLevel;
  set permLevel(List<PermLevel> value) {
    _permLevel = value;
  }

  void addToPermLevel(PermLevel value) {
    permLevel.add(value);
  }

  void removeFromPermLevel(PermLevel value) {
    permLevel.remove(value);
  }

  void removeAtIndexFromPermLevel(int index) {
    permLevel.removeAt(index);
  }

  void updatePermLevelAtIndex(
    int index,
    PermLevel Function(PermLevel) updateFn,
  ) {
    permLevel[index] = updateFn(_permLevel[index]);
  }

  void insertAtIndexInPermLevel(int index, PermLevel value) {
    permLevel.insert(index, value);
  }

  Pages? _currentPage = Pages.franchasing;
  Pages? get currentPage => _currentPage;
  set currentPage(Pages? value) {
    _currentPage = value;
    value != null
        ? secureStorage.setString('ff_currentPage', value.serialize())
        : secureStorage.remove('ff_currentPage');
  }

  void deleteCurrentPage() {
    secureStorage.delete(key: 'ff_currentPage');
  }

  bool _viewAsFranchisor = false;
  bool get viewAsFranchisor => _viewAsFranchisor;
  set viewAsFranchisor(bool value) {
    _viewAsFranchisor = value;
    secureStorage.setBool('ff_viewAsFranchisor', value);
  }

  void deleteViewAsFranchisor() {
    secureStorage.delete(key: 'ff_viewAsFranchisor');
  }

  bool _showAvailavleCellsInLocNav = false;
  bool get showAvailavleCellsInLocNav => _showAvailavleCellsInLocNav;
  set showAvailavleCellsInLocNav(bool value) {
    _showAvailavleCellsInLocNav = value;
    secureStorage.setBool('ff_showAvailavleCellsInLocNav', value);
  }

  void deleteShowAvailavleCellsInLocNav() {
    secureStorage.delete(key: 'ff_showAvailavleCellsInLocNav');
  }

  bool _showDailyClients = false;
  bool get showDailyClients => _showDailyClients;
  set showDailyClients(bool value) {
    _showDailyClients = value;
    secureStorage.setBool('ff_showDailyClients', value);
  }

  void deleteShowDailyClients() {
    secureStorage.delete(key: 'ff_showDailyClients');
  }

  bool _showPaymentsDaily = false;
  bool get showPaymentsDaily => _showPaymentsDaily;
  set showPaymentsDaily(bool value) {
    _showPaymentsDaily = value;
    secureStorage.setBool('ff_showPaymentsDaily', value);
  }

  void deleteShowPaymentsDaily() {
    secureStorage.delete(key: 'ff_showPaymentsDaily');
  }

  bool _showNewUsersDayly = false;
  bool get showNewUsersDayly => _showNewUsersDayly;
  set showNewUsersDayly(bool value) {
    _showNewUsersDayly = value;
    secureStorage.setBool('ff_showNewUsersDayly', value);
  }

  void deleteShowNewUsersDayly() {
    secureStorage.delete(key: 'ff_showNewUsersDayly');
  }

  bool _showTodayRequestsOnly = false;
  bool get showTodayRequestsOnly => _showTodayRequestsOnly;
  set showTodayRequestsOnly(bool value) {
    _showTodayRequestsOnly = value;
    secureStorage.setBool('ff_showTodayRequestsOnly', value);
  }

  void deleteShowTodayRequestsOnly() {
    secureStorage.delete(key: 'ff_showTodayRequestsOnly');
  }

  bool _showMatchesTodayOnlyOnWaiting = false;
  bool get showMatchesTodayOnlyOnWaiting => _showMatchesTodayOnlyOnWaiting;
  set showMatchesTodayOnlyOnWaiting(bool value) {
    _showMatchesTodayOnlyOnWaiting = value;
    secureStorage.setBool('ff_showMatchesTodayOnlyOnWaiting', value);
  }

  void deleteShowMatchesTodayOnlyOnWaiting() {
    secureStorage.delete(key: 'ff_showMatchesTodayOnlyOnWaiting');
  }

  final _allSizesManager = FutureRequestManager<List<SizesRow>>();
  Future<List<SizesRow>> allSizes({
    String? uniqueQueryKey,
    bool? overrideCache,
    required Future<List<SizesRow>> Function() requestFn,
  }) =>
      _allSizesManager.performRequest(
        uniqueQueryKey: uniqueQueryKey,
        overrideCache: overrideCache,
        requestFn: requestFn,
      );
  void clearAllSizesCache() => _allSizesManager.clear();
  void clearAllSizesCacheKey(String? uniqueKey) =>
      _allSizesManager.clearRequest(uniqueKey);

  final _allLocsManager = FutureRequestManager<List<LocGeoRow>>();
  Future<List<LocGeoRow>> allLocs({
    String? uniqueQueryKey,
    bool? overrideCache,
    required Future<List<LocGeoRow>> Function() requestFn,
  }) =>
      _allLocsManager.performRequest(
        uniqueQueryKey: uniqueQueryKey,
        overrideCache: overrideCache,
        requestFn: requestFn,
      );
  void clearAllLocsCache() => _allLocsManager.clear();
  void clearAllLocsCacheKey(String? uniqueKey) =>
      _allLocsManager.clearRequest(uniqueKey);

  final _franchiseManager = FutureRequestManager<List<FranchiseViewRow>>();
  Future<List<FranchiseViewRow>> franchise({
    String? uniqueQueryKey,
    bool? overrideCache,
    required Future<List<FranchiseViewRow>> Function() requestFn,
  }) =>
      _franchiseManager.performRequest(
        uniqueQueryKey: uniqueQueryKey,
        overrideCache: overrideCache,
        requestFn: requestFn,
      );
  void clearFranchiseCache() => _franchiseManager.clear();
  void clearFranchiseCacheKey(String? uniqueKey) =>
      _franchiseManager.clearRequest(uniqueKey);
}

void _safeInit(Function() initializeField) {
  try {
    initializeField();
  } catch (_) {}
}

Future _safeInitAsync(Function() initializeField) async {
  try {
    await initializeField();
  } catch (_) {}
}

extension FlutterSecureStorageExtensions on FlutterSecureStorage {
  static final _lock = Lock();

  Future<void> writeSync({required String key, String? value}) async =>
      await _lock.synchronized(() async {
        await write(key: key, value: value);
      });

  void remove(String key) => delete(key: key);

  Future<String?> getString(String key) async => await read(key: key);
  Future<void> setString(String key, String value) async =>
      await writeSync(key: key, value: value);

  Future<bool?> getBool(String key) async => (await read(key: key)) == 'true';
  Future<void> setBool(String key, bool value) async =>
      await writeSync(key: key, value: value.toString());

  Future<int?> getInt(String key) async =>
      int.tryParse(await read(key: key) ?? '');
  Future<void> setInt(String key, int value) async =>
      await writeSync(key: key, value: value.toString());

  Future<double?> getDouble(String key) async =>
      double.tryParse(await read(key: key) ?? '');
  Future<void> setDouble(String key, double value) async =>
      await writeSync(key: key, value: value.toString());

  Future<List<String>?> getStringList(String key) async =>
      await read(key: key).then((result) {
        if (result == null || result.isEmpty) {
          return null;
        }
        return CsvToListConverter()
            .convert(result)
            .first
            .map((e) => e.toString())
            .toList();
      });
  Future<void> setStringList(String key, List<String> value) async =>
      await writeSync(key: key, value: ListToCsvConverter().convert([value]));
}
