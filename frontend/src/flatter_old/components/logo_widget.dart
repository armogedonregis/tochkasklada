import '/components/logo_icon_widget.dart';
import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import 'logo_model.dart';
export 'logo_model.dart';

class LogoWidget extends StatefulWidget {
  const LogoWidget({super.key});

  @override
  State<LogoWidget> createState() => _LogoWidgetState();
}

class _LogoWidgetState extends State<LogoWidget> with TickerProviderStateMixin {
  late LogoModel _model;

  final animationsMap = <String, AnimationInfo>{};

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => LogoModel());

    animationsMap.addAll({
      'textOnPageLoadAnimation': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.easeInOut,
            delay: 0.0.ms,
            duration: 320.0.ms,
            begin: 0.0,
            end: 1.0,
          ),
        ],
      ),
    });

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    context.watch<FFAppState>();

    return Padding(
      padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 12.0),
      child: Row(
        mainAxisSize: MainAxisSize.max,
        children: [
          wrapWithModel(
            model: _model.logoIconModel,
            updateCallback: () => safeSetState(() {}),
            child: LogoIconWidget(),
          ),
          if (FFAppState().isNavOpened)
            Padding(
              padding: EdgeInsetsDirectional.fromSTEB(12.0, 0.0, 0.0, 4.0),
              child: Text(
                FFLocalizations.of(context).getText(
                  'byab1roc' /* точка.склада */,
                ),
                style: FlutterFlowTheme.of(context).headlineSmall.override(
                      fontFamily: 'Tochka',
                      letterSpacing: 0.0,
                      useGoogleFonts: false,
                    ),
              ).animateOnPageLoad(animationsMap['textOnPageLoadAnimation']!),
            ),
        ],
      ),
    );
  }
}
