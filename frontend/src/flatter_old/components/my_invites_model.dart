import '/backend/supabase/supabase.dart';
import '/components/avatar_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'my_invites_widget.dart' show MyInvitesWidget;
import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';

class MyInvitesModel extends FlutterFlowModel<MyInvitesWidget> {
  ///  Local state fields for this component.

  bool setHidden = false;

  ///  State fields for stateful widgets in this component.

  AudioPlayer? soundPlayer;
  // Model for avatar component.
  late AvatarModel avatarModel;
  // Stores action output result for [Backend Call - Delete Row(s)] action in IconButton widget.
  List<InvitesRow>? deleteRow;

  @override
  void initState(BuildContext context) {
    avatarModel = createModel(context, () => AvatarModel());
  }

  @override
  void dispose() {
    avatarModel.dispose();
  }
}
