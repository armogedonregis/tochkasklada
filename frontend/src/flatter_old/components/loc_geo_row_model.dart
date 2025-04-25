import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'loc_geo_row_widget.dart' show LocGeoRowWidget;
import 'package:flutter/material.dart';

class LocGeoRowModel extends FlutterFlowModel<LocGeoRowWidget> {
  ///  Local state fields for this component.

  bool isCreator = false;

  ///  State fields for stateful widgets in this component.

  // Stores action output result for [Backend Call - Query Rows] action in locGeoRow widget.
  List<LocGeoRow>? geoQuery;
  // Stores action output result for [Backend Call - Delete Row(s)] action in IconButton widget.
  List<LocGeoRow>? deleteRow;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {}
}
