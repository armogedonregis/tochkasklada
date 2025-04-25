import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'request_sended_match_copy3_widget.dart'
    show RequestSendedMatchCopy3Widget;
import 'package:flutter/material.dart';

class RequestSendedMatchCopy3Model
    extends FlutterFlowModel<RequestSendedMatchCopy3Widget> {
  ///  Local state fields for this component.

  String? generateInvite;

  ///  State fields for stateful widgets in this component.

  // Stores action output result for [Backend Call - Query Rows] action in Button widget.
  List<ClientsRow>? checkClientsEmail;
  // Stores action output result for [Backend Call - Insert Row] action in Button widget.
  ReserveTokensRow? createInviteForCurrent;
  // Stores action output result for [Backend Call - Update Row(s)] action in Button widget.
  List<RequestsRow>? currentUserReservedCell;
  // Stores action output result for [Backend Call - Insert Row] action in Button widget.
  ReservedRow? setCellStateReservedCurrent;
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
