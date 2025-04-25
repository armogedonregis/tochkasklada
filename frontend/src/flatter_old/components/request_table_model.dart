import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'request_table_widget.dart' show RequestTableWidget;
import 'package:flutter/material.dart';

class RequestTableModel extends FlutterFlowModel<RequestTableWidget> {
  ///  Local state fields for this component.

  String? availableCeliID;

  ///  State fields for stateful widgets in this component.

  // Stores action output result for [Backend Call - Query Rows] action in requestTable widget.
  List<CellsRow>? isAvailable;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {}
}
