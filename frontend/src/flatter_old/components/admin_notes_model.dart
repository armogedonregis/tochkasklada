import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'admin_notes_widget.dart' show AdminNotesWidget;
import 'package:flutter/material.dart';

class AdminNotesModel extends FlutterFlowModel<AdminNotesWidget> {
  ///  Local state fields for this component.

  bool isEditMode = false;

  ///  State fields for stateful widgets in this component.

  // State field(s) for TextField widget.
  FocusNode? textFieldFocusNode;
  TextEditingController? textController;
  String? Function(BuildContext, String?)? textControllerValidator;
  // Stores action output result for [Backend Call - Update Row(s)] action in TextField widget.
  List<ClientsRow>? addedComments;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {
    textFieldFocusNode?.dispose();
    textController?.dispose();
  }
}
