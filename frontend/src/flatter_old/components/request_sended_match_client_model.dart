import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'request_sended_match_client_widget.dart'
    show RequestSendedMatchClientWidget;
import 'package:flutter/material.dart';

class RequestSendedMatchClientModel
    extends FlutterFlowModel<RequestSendedMatchClientWidget> {
  ///  Local state fields for this component.

  String? generateInvite;

  ///  State fields for stateful widgets in this component.

  // Stores action output result for [Backend Call - Insert Row] action in Button widget.
  ReserveTokensRow? createInviteForCurrent;
  // Stores action output result for [Backend Call - Update Row(s)] action in Button widget.
  List<RequestsRow>? currentUserReservedCell;
  // Stores action output result for [Backend Call - Insert Row] action in Button widget.
  ReservedRow? setCellStateReservedCurrent;
  // Stores action output result for [Backend Call - Update Row(s)] action in Button widget.
  List<RequestsRow>? userReservedCellCopy;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {}
}
