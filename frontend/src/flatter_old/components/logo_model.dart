import '/components/logo_icon_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'logo_widget.dart' show LogoWidget;
import 'package:flutter/material.dart';

class LogoModel extends FlutterFlowModel<LogoWidget> {
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
