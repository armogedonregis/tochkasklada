import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import 'package:flutter/material.dart';
import 'open_drawler_button_model.dart';
export 'open_drawler_button_model.dart';

class OpenDrawlerButtonWidget extends StatefulWidget {
  const OpenDrawlerButtonWidget({
    super.key,
    String? buttonTittle,
    this.icon,
  }) : this.buttonTittle = buttonTittle ?? 'Создать';

  final String buttonTittle;
  final Widget? icon;

  @override
  State<OpenDrawlerButtonWidget> createState() =>
      _OpenDrawlerButtonWidgetState();
}

class _OpenDrawlerButtonWidgetState extends State<OpenDrawlerButtonWidget> {
  late OpenDrawlerButtonModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => OpenDrawlerButtonModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.max,
      children: [
        if (responsiveVisibility(
          context: context,
          phone: false,
          tablet: false,
        ))
          Align(
            alignment: AlignmentDirectional(0.0, 0.0),
            child: FFButtonWidget(
              onPressed: () async {
                Scaffold.of(context).openEndDrawer();
              },
              text: widget.buttonTittle,
              icon: Icon(
                Icons.add_rounded,
                size: 15.0,
              ),
              options: FFButtonOptions(
                height: 48.0,
                padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 0.0),
                iconPadding: EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 0.0),
                color: FlutterFlowTheme.of(context).primary,
                textStyle: FlutterFlowTheme.of(context).labelLarge.override(
                      fontFamily: 'Montserrat',
                      color: FlutterFlowTheme.of(context).info,
                      fontSize: 16.0,
                      letterSpacing: 0.0,
                      fontWeight: FontWeight.w600,
                    ),
                elevation: 1.0,
                borderSide: BorderSide(
                  color: Colors.transparent,
                  width: 1.0,
                ),
                borderRadius: BorderRadius.circular(16.0),
              ),
            ),
          ),
        if (responsiveVisibility(
          context: context,
          tabletLandscape: false,
          desktop: false,
        ))
          FlutterFlowIconButton(
            borderColor: FlutterFlowTheme.of(context).primary,
            borderRadius: 16.0,
            borderWidth: 1.0,
            buttonSize: 48.0,
            fillColor: FlutterFlowTheme.of(context).primary,
            icon: Icon(
              Icons.add,
              color: FlutterFlowTheme.of(context).info,
              size: 24.0,
            ),
            onPressed: () async {
              Scaffold.of(context).openEndDrawer();
            },
          ),
      ],
    );
  }
}
