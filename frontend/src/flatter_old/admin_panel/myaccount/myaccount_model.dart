import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/components/breadcrumps_widget.dart';
import '/components/change_email_widget.dart';
import '/components/change_password_widget.dart';
import '/components/edit_my_info_widget.dart';
import '/components/my_avatar_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'myaccount_widget.dart' show MyaccountWidget;
import 'package:flutter/material.dart';

class MyaccountModel extends FlutterFlowModel<MyaccountWidget> {
  ///  Local state fields for this page.

  SettingDrawler? drawlerButton;

  ///  State fields for stateful widgets in this page.

  // Stores action output result for [Backend Call - Query Rows] action in myaccount widget.
  List<UsersByRolesRow>? login;
  // Stores action output result for [Backend Call - Update Row(s)] action in myaccount widget.
  List<UsersByRolesRow>? updateEmailInPublicUsers;
  // Model for sidebar component.
  late SidebarModel sidebarModel;
  // Model for breadcrumps component.
  late BreadcrumpsModel breadcrumpsModel;
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel;
  // Model for myAvatar component.
  late MyAvatarModel myAvatarModel;
  // Model for editMyInfo component.
  late EditMyInfoModel editMyInfoModel;
  // Model for changeEmail component.
  late ChangeEmailModel changeEmailModel;
  // Model for changePassword component.
  late ChangePasswordModel changePasswordModel;

  @override
  void initState(BuildContext context) {
    sidebarModel = createModel(context, () => SidebarModel());
    breadcrumpsModel = createModel(context, () => BreadcrumpsModel());
    tittleWithIconAndSubtittleModel =
        createModel(context, () => TittleWithIconAndSubtittleModel());
    myAvatarModel = createModel(context, () => MyAvatarModel());
    editMyInfoModel = createModel(context, () => EditMyInfoModel());
    changeEmailModel = createModel(context, () => ChangeEmailModel());
    changePasswordModel = createModel(context, () => ChangePasswordModel());
  }

  @override
  void dispose() {
    sidebarModel.dispose();
    breadcrumpsModel.dispose();
    tittleWithIconAndSubtittleModel.dispose();
    myAvatarModel.dispose();
    editMyInfoModel.dispose();
    changeEmailModel.dispose();
    changePasswordModel.dispose();
  }
}
