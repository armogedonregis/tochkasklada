import '/backend/supabase/supabase.dart';
import '/components/logo_widget.dart';
import '/components/my_avatar_widget.dart';
import '/components/nav_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'sidebar_widget.dart' show SidebarWidget;
import 'package:flutter/material.dart';

class SidebarModel extends FlutterFlowModel<SidebarWidget> {
  ///  State fields for stateful widgets in this component.

  // Stores action output result for [Backend Call - Query Rows] action in sidebar widget.
  List<UsersByRolesRow>? login;
  // Stores action output result for [Backend Call - Update Row(s)] action in sidebar widget.
  List<UsersByRolesRow>? updateEmailIandPermissions;
  // Model for logo component.
  late LogoModel logoModel;
  // Model for nav component.
  late NavModel navModel;
  // Model for myAvatar component.
  late MyAvatarModel myAvatarModel;

  @override
  void initState(BuildContext context) {
    logoModel = createModel(context, () => LogoModel());
    navModel = createModel(context, () => NavModel());
    myAvatarModel = createModel(context, () => MyAvatarModel());
  }

  @override
  void dispose() {
    logoModel.dispose();
    navModel.dispose();
    myAvatarModel.dispose();
  }
}
