import '/components/logo_icon_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'breadcrumps_widget.dart' show BreadcrumpsWidget;
import 'package:flutter/material.dart';

class BreadcrumpsModel extends FlutterFlowModel<BreadcrumpsWidget> {
  ///  State fields for stateful widgets in this component.

  // Model for logoIcon component.
  late LogoIconModel logoIconModel;

  @override
  void initState(BuildContext context) {
    logoIconModel = createModel(context, () => LogoIconModel());
  }

  @override
  void dispose() {
    logoIconModel.dispose();
  }
}
