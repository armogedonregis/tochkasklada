import '/components/nav_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'nav_bottom_shit_widget.dart' show NavBottomShitWidget;
import 'package:flutter/material.dart';

class NavBottomShitModel extends FlutterFlowModel<NavBottomShitWidget> {
  ///  State fields for stateful widgets in this component.

  // Model for nav component.
  late NavModel navModel;

  @override
  void initState(BuildContext context) {
    navModel = createModel(context, () => NavModel());
  }

  @override
  void dispose() {
    navModel.dispose();
  }
}
