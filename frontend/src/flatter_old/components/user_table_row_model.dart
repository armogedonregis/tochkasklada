import '/backend/supabase/supabase.dart';
import '/components/avatar_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'user_table_row_widget.dart' show UserTableRowWidget;
import 'package:flutter/material.dart';

class UserTableRowModel extends FlutterFlowModel<UserTableRowWidget> {
  ///  Local state fields for this component.

  String? avatarPatchOther;

  ///  State fields for stateful widgets in this component.

  // Stores action output result for [Backend Call - Query Rows] action in userTableRow widget.
  List<RolesListRow>? defAvatar;
  // Model for avatar component.
  late AvatarModel avatarModel;
  // Stores action output result for [Backend Call - Delete Row(s)] action in IconButtonDel widget.
  List<UsersByRolesRow>? deleteRow;

  @override
  void initState(BuildContext context) {
    avatarModel = createModel(context, () => AvatarModel());
  }

  @override
  void dispose() {
    avatarModel.dispose();
  }
}
