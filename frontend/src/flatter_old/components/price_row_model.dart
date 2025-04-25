import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'price_row_widget.dart' show PriceRowWidget;
import 'package:flutter/material.dart';

class PriceRowModel extends FlutterFlowModel<PriceRowWidget> {
  ///  Local state fields for this component.

  String locs = '--';

  bool isEditable = true;

  ///  State fields for stateful widgets in this component.

  // Stores action output result for [Backend Call - Delete Row(s)] action in IconButton widget.
  List<AreaPricesRow>? deleteRow;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {}
}
