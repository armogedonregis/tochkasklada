import '/backend/supabase/supabase.dart';
import '/components/loc_card_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'card_of_franchise_widget.dart' show CardOfFranchiseWidget;
import 'package:flutter/material.dart';

class CardOfFranchiseModel extends FlutterFlowModel<CardOfFranchiseWidget> {
  ///  Local state fields for this component.

  bool isLoading = true;

  String whatView = 'base';

  ///  State fields for stateful widgets in this component.

  // Stores action output result for [Backend Call - Query Rows] action in cardOfFranchise widget.
  List<FranchiseViewRow>? franchiseQuery;
  // Models for locCard dynamic component.
  late FlutterFlowDynamicModels<LocCardModel> locCardModels;

  @override
  void initState(BuildContext context) {
    locCardModels = FlutterFlowDynamicModels(() => LocCardModel());
  }

  @override
  void dispose() {
    locCardModels.dispose();
  }
}
