import '/components/breadcrumps_widget.dart';
import '/components/create_user_widget.dart';
import '/components/open_drawler_button_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'users_widget.dart' show UsersWidget;
import 'package:flutter/material.dart';

class UsersModel extends FlutterFlowModel<UsersWidget> {
  ///  Local state fields for this page.

  bool hasDeleteRow = false;

  ///  State fields for stateful widgets in this page.

  // Model for sidebar component.
  late SidebarModel sidebarModel;
  // Model for breadcrumps component.
  late BreadcrumpsModel breadcrumpsModel;
  // State field(s) for TextField widget.
  FocusNode? textFieldFocusNode;
  TextEditingController? textController;
  String? Function(BuildContext, String?)? textControllerValidator;
  // Model for openDrawlerButton component.
  late OpenDrawlerButtonModel openDrawlerButtonModel;
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel;
  // Model for createUser component.
  late CreateUserModel createUserModel;

  @override
  void initState(BuildContext context) {
    sidebarModel = createModel(context, () => SidebarModel());
    breadcrumpsModel = createModel(context, () => BreadcrumpsModel());
    openDrawlerButtonModel =
        createModel(context, () => OpenDrawlerButtonModel());
    tittleWithIconAndSubtittleModel =
        createModel(context, () => TittleWithIconAndSubtittleModel());
    createUserModel = createModel(context, () => CreateUserModel());
  }

  @override
  void dispose() {
    sidebarModel.dispose();
    breadcrumpsModel.dispose();
    textFieldFocusNode?.dispose();
    textController?.dispose();

    openDrawlerButtonModel.dispose();
    tittleWithIconAndSubtittleModel.dispose();
    createUserModel.dispose();
  }
}
