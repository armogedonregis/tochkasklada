import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'waitlist_table_widget.dart' show WaitlistTableWidget;
import 'package:flutter/material.dart';

class WaitlistTableModel extends FlutterFlowModel<WaitlistTableWidget> {
  ///  Local state fields for this component.

  String? availableCeliID;

  ///  State fields for stateful widgets in this component.

  // Stores action output result for [Backend Call - Query Rows] action in waitlistTable widget.
  List<CellsRow>? isAvailable;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {}
}
