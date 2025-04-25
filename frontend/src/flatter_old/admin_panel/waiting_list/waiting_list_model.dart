import '/components/breadcrumps_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/submenu_item_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/components/waitlist_table_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'waiting_list_widget.dart' show WaitingListWidget;
import 'package:flutter/material.dart';

class WaitingListModel extends FlutterFlowModel<WaitingListWidget> {
  ///  Local state fields for this page.

  String? requestID;

  bool isDravlerOpen = false;

  bool? isNewestFirst = true;

  ///  State fields for stateful widgets in this page.

  // Model for sidebar component.
  late SidebarModel sidebarModel;
  // Model for breadcrumps component.
  late BreadcrumpsModel breadcrumpsModel;
  // Model for submenuItembook.
  late SubmenuItemModel submenuItembookModel;
  // State field(s) for TextFieldSearch widget.
  FocusNode? textFieldSearchFocusNode;
  TextEditingController? textFieldSearchTextController;
  String? Function(BuildContext, String?)?
      textFieldSearchTextControllerValidator;
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel;
  // Models for waitlistTable dynamic component.
  late FlutterFlowDynamicModels<WaitlistTableModel> waitlistTableModels;

  @override
  void initState(BuildContext context) {
    sidebarModel = createModel(context, () => SidebarModel());
    breadcrumpsModel = createModel(context, () => BreadcrumpsModel());
    submenuItembookModel = createModel(context, () => SubmenuItemModel());
    tittleWithIconAndSubtittleModel =
        createModel(context, () => TittleWithIconAndSubtittleModel());
    waitlistTableModels = FlutterFlowDynamicModels(() => WaitlistTableModel());
  }

  @override
  void dispose() {
    sidebarModel.dispose();
    breadcrumpsModel.dispose();
    submenuItembookModel.dispose();
    textFieldSearchFocusNode?.dispose();
    textFieldSearchTextController?.dispose();

    tittleWithIconAndSubtittleModel.dispose();
    waitlistTableModels.dispose();
  }
}
