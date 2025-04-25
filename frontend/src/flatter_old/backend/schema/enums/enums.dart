import 'package:collection/collection.dart';

enum Permissions {
  createFranchise,
  createManager,
  createContainers,
  createFranchasi,
  createLocations,
  createPromos,
  viewPayments,
  viewClients,
  viewCells,
  viewRequests,
  viewInvestRequests,
}

enum CrmRoles {
  administrator,
  franchisee,
  manager,
  franchisor,
  operator,
}

enum CellSizes {
  XS,
  S,
  M,
  L,
}

enum CellStates {
  available,
  rented,
  reserved,
}

enum InviteStates {
  active,
  applied,
  expired,
}

enum SettingDrawler {
  changeInfo,
  changeEmail,
  changePassword,
}

enum PermLevel {
  full,
  franchise,
  management,
  operative,
}

enum LocPrefs {
  KUD,
  SHU,
}

enum RequestStates {
  lead,
  client,
  waiting_list,
  fell_off,
}

enum Period {
  day,
  week,
  month,
}

enum Pages {
  franchasing,
  locs,
  clients,
  requests,
  waitlist,
  docs,
  payments,
  users,
  myaccount,
  crmsettings,
}

extension FFEnumExtensions<T extends Enum> on T {
  String serialize() => name;
}

extension FFEnumListExtensions<T extends Enum> on Iterable<T> {
  T? deserialize(String? value) =>
      firstWhereOrNull((e) => e.serialize() == value);
}

T? deserializeEnum<T>(String? value) {
  switch (T) {
    case (Permissions):
      return Permissions.values.deserialize(value) as T?;
    case (CrmRoles):
      return CrmRoles.values.deserialize(value) as T?;
    case (CellSizes):
      return CellSizes.values.deserialize(value) as T?;
    case (CellStates):
      return CellStates.values.deserialize(value) as T?;
    case (InviteStates):
      return InviteStates.values.deserialize(value) as T?;
    case (SettingDrawler):
      return SettingDrawler.values.deserialize(value) as T?;
    case (PermLevel):
      return PermLevel.values.deserialize(value) as T?;
    case (LocPrefs):
      return LocPrefs.values.deserialize(value) as T?;
    case (RequestStates):
      return RequestStates.values.deserialize(value) as T?;
    case (Period):
      return Period.values.deserialize(value) as T?;
    case (Pages):
      return Pages.values.deserialize(value) as T?;
    default:
      return null;
  }
}
