import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'loc_card_widget.dart' show LocCardWidget;
import 'package:flutter/material.dart';

class LocCardModel extends FlutterFlowModel<LocCardWidget> {
  ///  Local state fields for this component.

  bool isLoading = true;

  ///  State fields for stateful widgets in this component.

  // Stores action output result for [Backend Call - Query Rows] action in locCard widget.
  List<LocationViewRow>? locationsQuery;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {}
}
