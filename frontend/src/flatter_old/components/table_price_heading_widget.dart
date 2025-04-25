import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'table_price_heading_model.dart';
export 'table_price_heading_model.dart';

class TablePriceHeadingWidget extends StatefulWidget {
  const TablePriceHeadingWidget({
    super.key,
    String? size,
  }) : this.size = size ?? 'M';

  final String size;

  @override
  State<TablePriceHeadingWidget> createState() =>
      _TablePriceHeadingWidgetState();
}

class _TablePriceHeadingWidgetState extends State<TablePriceHeadingWidget> {
  late TablePriceHeadingModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => TablePriceHeadingModel());

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
      mainAxisAlignment: MainAxisAlignment.end,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsetsDirectional.fromSTEB(16.0, 8.0, 0.0, 0.0),
          child: RichText(
            textScaler: MediaQuery.of(context).textScaler,
            text: TextSpan(
              children: [
                TextSpan(
                  text: FFLocalizations.of(context).getText(
                    'zekqje0m' /* Размер:  */,
                  ),
                  style: FlutterFlowTheme.of(context).labelMedium.override(
                        fontFamily: 'Montserrat',
                        letterSpacing: 0.0,
                        fontWeight: FontWeight.w500,
                      ),
                ),
                TextSpan(
                  text: valueOrDefault<String>(
                    widget.size,
                    'M',
                  ),
                  style: TextStyle(),
                )
              ],
              style: FlutterFlowTheme.of(context).labelMedium.override(
                    fontFamily: 'Montserrat',
                    letterSpacing: 0.0,
                    fontWeight: FontWeight.w500,
                  ),
            ),
            textAlign: TextAlign.start,
          ),
        ),
        Padding(
          padding: EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 4.0),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 0.0, 0.0),
                child: Container(
                  width: valueOrDefault<double>(
                    () {
                      if (MediaQuery.sizeOf(context).width < kBreakpointSmall) {
                        return 60.0;
                      } else if (MediaQuery.sizeOf(context).width <
                          kBreakpointMedium) {
                        return 80.0;
                      } else if (MediaQuery.sizeOf(context).width <
                          kBreakpointLarge) {
                        return 80.0;
                      } else {
                        return 80.0;
                      }
                    }(),
                    80.0,
                  ),
                  decoration: BoxDecoration(),
                  child: Text(
                    FFLocalizations.of(context).getText(
                      'fa3t7gkg' /* Месяц, ₽ */,
                    ),
                    style: FlutterFlowTheme.of(context).bodySmall.override(
                          fontFamily: 'Montserrat',
                          color: FlutterFlowTheme.of(context).secondaryText,
                          letterSpacing: 0.0,
                        ),
                  ),
                ),
              ),
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 0.0, 0.0),
                child: Container(
                  width: valueOrDefault<double>(
                    () {
                      if (MediaQuery.sizeOf(context).width < kBreakpointSmall) {
                        return 60.0;
                      } else if (MediaQuery.sizeOf(context).width <
                          kBreakpointMedium) {
                        return 80.0;
                      } else if (MediaQuery.sizeOf(context).width <
                          kBreakpointLarge) {
                        return 80.0;
                      } else {
                        return 80.0;
                      }
                    }(),
                    80.0,
                  ),
                  decoration: BoxDecoration(),
                  child: Text(
                    FFLocalizations.of(context).getText(
                      'y7xq2hps' /* День, ₽ */,
                    ),
                    style: FlutterFlowTheme.of(context).bodySmall.override(
                          fontFamily: 'Montserrat',
                          color: FlutterFlowTheme.of(context).secondaryText,
                          letterSpacing: 0.0,
                        ),
                  ),
                ),
              ),
              SizedBox(
                height: 24.0,
                child: VerticalDivider(
                  thickness: 1.0,
                  color: FlutterFlowTheme.of(context).tertiaryText,
                ),
              ),
            ],
          ),
        ),
      ].divide(SizedBox(height: 4.0)),
    );
  }
}
