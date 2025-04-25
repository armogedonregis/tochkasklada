import '/components/breadcrumps_widget.dart';
import '/components/edit_request_widget.dart';
import '/components/request_table_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/submenu_item_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'requests_widget.dart' show RequestsWidget;
import 'package:flutter/material.dart';

class RequestsModel extends FlutterFlowModel<RequestsWidget> {
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
  // Models for requestTable dynamic component.
  late FlutterFlowDynamicModels<RequestTableModel> requestTableModels;
  // Model for editRequest component.
  late EditRequestModel editRequestModel;

  @override
  void initState(BuildContext context) {
    sidebarModel = createModel(context, () => SidebarModel());
    breadcrumpsModel = createModel(context, () => BreadcrumpsModel());
    submenuItembookModel = createModel(context, () => SubmenuItemModel());
    tittleWithIconAndSubtittleModel =
        createModel(context, () => TittleWithIconAndSubtittleModel());
    requestTableModels = FlutterFlowDynamicModels(() => RequestTableModel());
    editRequestModel = createModel(context, () => EditRequestModel());
  }

  @override
  void dispose() {
    sidebarModel.dispose();
    breadcrumpsModel.dispose();
    submenuItembookModel.dispose();
    textFieldSearchFocusNode?.dispose();
    textFieldSearchTextController?.dispose();

    tittleWithIconAndSubtittleModel.dispose();
    requestTableModels.dispose();
    editRequestModel.dispose();
  }
}
