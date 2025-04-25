import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'logo_dark_light_model.dart';
export 'logo_dark_light_model.dart';

class LogoDarkLightWidget extends StatefulWidget {
  const LogoDarkLightWidget({super.key});

  @override
  State<LogoDarkLightWidget> createState() => _LogoDarkLightWidgetState();
}

class _LogoDarkLightWidgetState extends State<LogoDarkLightWidget> {
  late LogoDarkLightModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => LogoDarkLightModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsetsDirectional.fromSTEB(24.0, 24.0, 0.0, 0.0),
      child: Container(
        width: 60.0,
        height: 60.0,
        decoration: BoxDecoration(
          color: FlutterFlowTheme.of(context).secondaryBackground,
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(0.0),
          child: Image.asset(
            Theme.of(context).brightness == Brightness.dark
                ? 'assets/images/logoshortdm.png'
                : 'assets/images/logoShort.png',
            width: 60.0,
            height: 39.0,
            fit: BoxFit.contain,
          ),
        ),
      ),
    );
  }
}
