import '/backend/supabase/supabase.dart';
import '/components/menu_item_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'nav_widget.dart' show NavWidget;
import 'package:flutter/material.dart';

class NavModel extends FlutterFlowModel<NavWidget> {
  ///  Local state fields for this component.

  bool showCells = false;

  ///  State fields for stateful widgets in this component.

  // Stores action output result for [Backend Call - Query Rows] action in nav widget.
  List<UserSettingsRow>? userSettingsFromBase;
  // Model for menuItemFranch.
  late MenuItemModel menuItemFranchModel;
  // Model for menuItemLocs.
  late MenuItemModel menuItemLocsModel;
  // Model for menuItemlients.
  late MenuItemModel menuItemlientsModel;
  // Model for menuItemPayments.
  late MenuItemModel menuItemPaymentsModel;
  // Model for menuItemRequest.
  late MenuItemModel menuItemRequestModel;
  // Model for menuItemWaiting.
  late MenuItemModel menuItemWaitingModel;
  // Model for menuItemUsers.
  late MenuItemModel menuItemUsersModel;
  // Model for menuItemCRM.
  late MenuItemModel menuItemCRMModel;
  // Model for menuItemDocs.
  late MenuItemModel menuItemDocsModel;

  @override
  void initState(BuildContext context) {
    menuItemFranchModel = createModel(context, () => MenuItemModel());
    menuItemLocsModel = createModel(context, () => MenuItemModel());
    menuItemlientsModel = createModel(context, () => MenuItemModel());
    menuItemPaymentsModel = createModel(context, () => MenuItemModel());
    menuItemRequestModel = createModel(context, () => MenuItemModel());
    menuItemWaitingModel = createModel(context, () => MenuItemModel());
    menuItemUsersModel = createModel(context, () => MenuItemModel());
    menuItemCRMModel = createModel(context, () => MenuItemModel());
    menuItemDocsModel = createModel(context, () => MenuItemModel());
  }

  @override
  void dispose() {
    menuItemFranchModel.dispose();
    menuItemLocsModel.dispose();
    menuItemlientsModel.dispose();
    menuItemPaymentsModel.dispose();
    menuItemRequestModel.dispose();
    menuItemWaitingModel.dispose();
    menuItemUsersModel.dispose();
    menuItemCRMModel.dispose();
    menuItemDocsModel.dispose();
  }
}
