import '/backend/supabase/supabase.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'add_answer_widget.dart' show AddAnswerWidget;
import 'package:flutter/material.dart';

class AddAnswerModel extends FlutterFlowModel<AddAnswerWidget> {
  ///  State fields for stateful widgets in this component.

  final formKey = GlobalKey<FormState>();
  // Stores action output result for [Backend Call - Query Rows] action in addAnswer widget.
  List<RequestsRow>? selectedRequest;
  // Stores action output result for [Backend Call - Query Rows] action in addAnswer widget.
  List<CellsRow>? cellRequest;
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel;
  // State field(s) for answer widget.
  FocusNode? answerFocusNode;
  TextEditingController? answerTextController;
  String? Function(BuildContext, String?)? answerTextControllerValidator;
  // Stores action output result for [Backend Call - Update Row(s)] action in answer widget.
  List<RequestsRow>? notProseeded;
  // Stores action output result for [Backend Call - Query Rows] action in reserveButton widget.
  List<ClientsRow>? askClientInfo;
  // Stores action output result for [Backend Call - Update Row(s)] action in reserveButton widget.
  List<SupportRequestsRow>? updateAnswer;
  // Stores action output result for [Backend Call - Update Row(s)] action in reserveButton widget.
  List<ClientNotificationsRow>? updateNotification;
  // Stores action output result for [Backend Call - Update Row(s)] action in reserveButton widget.
  List<SupportRequestsRow>? sendAnswer;
  // Stores action output result for [Backend Call - Insert Row] action in reserveButton widget.
  ClientNotificationsRow? createNotification;

  @override
  void initState(BuildContext context) {
    tittleWithIconAndSubtittleModel =
        createModel(context, () => TittleWithIconAndSubtittleModel());
  }

  @override
  void dispose() {
    tittleWithIconAndSubtittleModel.dispose();
    answerFocusNode?.dispose();
    answerTextController?.dispose();
  }
}
