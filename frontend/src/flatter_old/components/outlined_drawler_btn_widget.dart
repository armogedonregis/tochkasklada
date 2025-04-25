import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import 'package:flutter/material.dart';
import 'outlined_drawler_btn_model.dart';
export 'outlined_drawler_btn_model.dart';

class OutlinedDrawlerBtnWidget extends StatefulWidget {
  const OutlinedDrawlerBtnWidget({
    super.key,
    String? btnTittle,
    required this.btnIcon,
  }) : this.btnTittle = btnTittle ?? 'Titlle';

  final String btnTittle;
  final Widget? btnIcon;

  @override
  State<OutlinedDrawlerBtnWidget> createState() =>
      _OutlinedDrawlerBtnWidgetState();
}

class _OutlinedDrawlerBtnWidgetState extends State<OutlinedDrawlerBtnWidget> {
  late OutlinedDrawlerBtnModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => OutlinedDrawlerBtnModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
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
              text: widget.btnTittle,
              icon: widget.btnIcon,
              options: FFButtonOptions(
                height: 48.0,
                padding: EdgeInsetsDirectional.fromSTEB(16.0, 4.0, 16.0, 4.0),
                iconPadding: EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 0.0),
                color: Colors.transparent,
                textStyle: FlutterFlowTheme.of(context).bodyLarge.override(
                      fontFamily: 'Montserrat',
                      color: FlutterFlowTheme.of(context).secondaryText,
                      letterSpacing: 0.0,
                      fontWeight: FontWeight.w600,
                    ),
                elevation: 0.0,
                borderSide: BorderSide(
                  color: FlutterFlowTheme.of(context).alternate,
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
            borderColor: FlutterFlowTheme.of(context).alternate,
            borderRadius: 16.0,
            borderWidth: 1.0,
            buttonSize: 48.0,
            icon: widget.btnIcon!,
            onPressed: () async {
              Scaffold.of(context).openEndDrawer();
            },
          ),
      ],
    );
  }
}
