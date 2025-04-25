import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'request_sended_match_widget.dart' show RequestSendedMatchWidget;
import 'package:flutter/material.dart';

class RequestSendedMatchModel
    extends FlutterFlowModel<RequestSendedMatchWidget> {
  ///  Local state fields for this component.

  String? generateInvite;

  ///  State fields for stateful widgets in this component.

  // Stores action output result for [Backend Call - Insert Row] action in Button widget.
  ClientsRow? createdClientID;
  // Stores action output result for [Backend Call - Insert Row] action in Button widget.
  ReserveTokensRow? createInviteForNew;
  // Stores action output result for [Backend Call - Update Row(s)] action in Button widget.
  List<RequestsRow>? userReservedCell;
  // Stores action output result for [Backend Call - Insert Row] action in Button widget.
  ReservedRow? setCellStateReservedNew;
  // Stores action output result for [Backend Call - Update Row(s)] action in Button widget.
  List<RequestsRow>? userReservedCellCopy;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {}
}
