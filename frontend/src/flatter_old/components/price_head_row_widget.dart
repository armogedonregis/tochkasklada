import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'price_head_row_model.dart';
export 'price_head_row_model.dart';

class PriceHeadRowWidget extends StatefulWidget {
  const PriceHeadRowWidget({
    super.key,
    required this.size,
  });

  final String? size;

  @override
  State<PriceHeadRowWidget> createState() => _PriceHeadRowWidgetState();
}

class _PriceHeadRowWidgetState extends State<PriceHeadRowWidget> {
  late PriceHeadRowModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => PriceHeadRowModel());

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
      mainAxisSize: MainAxisSize.min,
      children: [
        Padding(
          padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 0.0, 0.0),
          child: Container(
            width: 36.0,
            decoration: BoxDecoration(),
            child: RichText(
              textScaler: MediaQuery.of(context).textScaler,
              text: TextSpan(
                children: [
                  TextSpan(
                    text: valueOrDefault<String>(
                      widget.size,
                      'M',
                    ),
                    style: FlutterFlowTheme.of(context).bodySmall.override(
                          fontFamily: 'Montserrat',
                          color: FlutterFlowTheme.of(context).primary,
                          fontSize: 14.0,
                          letterSpacing: 0.0,
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  TextSpan(
                    text: FFLocalizations.of(context).getText(
                      '0h6z1bm7' /* : */,
                    ),
                    style: TextStyle(),
                  )
                ],
                style: FlutterFlowTheme.of(context).bodySmall.override(
                      fontFamily: 'Montserrat',
                      color: FlutterFlowTheme.of(context).primary,
                      fontSize: 14.0,
                      letterSpacing: 0.0,
                      fontWeight: FontWeight.bold,
                    ),
              ),
            ),
          ),
        ),
        Container(
          width: valueOrDefault<double>(
            () {
              if (MediaQuery.sizeOf(context).width < kBreakpointSmall) {
                return 64.0;
              } else if (MediaQuery.sizeOf(context).width < kBreakpointMedium) {
                return 78.0;
              } else if (MediaQuery.sizeOf(context).width < kBreakpointLarge) {
                return 84.0;
              } else {
                return 84.0;
              }
            }(),
            84.0,
          ),
          decoration: BoxDecoration(),
          child: Text(
            FFLocalizations.of(context).getText(
              'bxya09xr' /* месяц, ₽ */,
            ),
            style: FlutterFlowTheme.of(context).bodySmall.override(
                  fontFamily: 'Montserrat',
                  color: FlutterFlowTheme.of(context).secondaryText,
                  letterSpacing: 0.0,
                  fontWeight: FontWeight.w600,
                ),
          ),
        ),
        Container(
          width: valueOrDefault<double>(
            () {
              if (MediaQuery.sizeOf(context).width < kBreakpointSmall) {
                return 64.0;
              } else if (MediaQuery.sizeOf(context).width < kBreakpointMedium) {
                return 78.0;
              } else if (MediaQuery.sizeOf(context).width < kBreakpointLarge) {
                return 84.0;
              } else {
                return 84.0;
              }
            }(),
            84.0,
          ),
          decoration: BoxDecoration(),
          child: Text(
            FFLocalizations.of(context).getText(
              'oixg0d81' /* день, ₽ */,
            ),
            style: FlutterFlowTheme.of(context).bodySmall.override(
                  fontFamily: 'Montserrat',
                  color: FlutterFlowTheme.of(context).secondaryText,
                  letterSpacing: 0.0,
                ),
          ),
        ),
        SizedBox(
          height: 40.0,
          child: VerticalDivider(
            thickness: 1.0,
            color: FlutterFlowTheme.of(context).alternate,
          ),
        ),
      ],
    );
  }
}
