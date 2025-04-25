import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'cellfrom_sizeinfo_model.dart';
export 'cellfrom_sizeinfo_model.dart';

class CellfromSizeinfoWidget extends StatefulWidget {
  const CellfromSizeinfoWidget({
    super.key,
    required this.size,
    required this.sqm,
    required this.price,
    required this.available,
    required this.total,
    required this.yearPrice,
  });

  final String? size;
  final double? sqm;
  final int? price;
  final int? available;
  final int? total;
  final int? yearPrice;

  @override
  State<CellfromSizeinfoWidget> createState() => _CellfromSizeinfoWidgetState();
}

class _CellfromSizeinfoWidgetState extends State<CellfromSizeinfoWidget> {
  late CellfromSizeinfoModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => CellfromSizeinfoModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 340.0,
      decoration: BoxDecoration(
        color: FlutterFlowTheme.of(context).primaryBackground,
        boxShadow: [
          BoxShadow(
            blurRadius: 1.0,
            color: FlutterFlowTheme.of(context).grayAlpha,
            offset: Offset(
              0.0,
              1.0,
            ),
          )
        ],
        borderRadius: BorderRadius.circular(12.0),
      ),
      child: Padding(
        padding: EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 4.0),
        child: Column(
          mainAxisSize: MainAxisSize.max,
          children: [
            Container(
              width: () {
                if (MediaQuery.sizeOf(context).width < kBreakpointSmall) {
                  return 90.0;
                } else if (MediaQuery.sizeOf(context).width <
                    kBreakpointMedium) {
                  return 30.0;
                } else if (MediaQuery.sizeOf(context).width <
                    kBreakpointLarge) {
                  return 30.0;
                } else {
                  return 30.0;
                }
              }(),
              height: 100.0,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(0.0),
                  bottomRight: Radius.circular(0.0),
                  topLeft: Radius.circular(12.0),
                  topRight: Radius.circular(12.0),
                ),
              ),
              child: Padding(
                padding: EdgeInsetsDirectional.fromSTEB(16.0, 4.0, 24.0, 4.0),
                child: Row(
                  mainAxisSize: MainAxisSize.max,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Row(
                      mainAxisSize: MainAxisSize.max,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          valueOrDefault<String>(
                            widget.size,
                            'S',
                          ),
                          style: FlutterFlowTheme.of(context)
                              .displayLarge
                              .override(
                                fontFamily: 'Tochka',
                                fontSize: 64.0,
                                letterSpacing: 0.0,
                                useGoogleFonts: false,
                              ),
                        ),
                        Column(
                          mainAxisSize: MainAxisSize.max,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Padding(
                              padding: EdgeInsetsDirectional.fromSTEB(
                                  0.0, 16.0, 0.0, 0.0),
                              child: RichText(
                                textScaler: MediaQuery.of(context).textScaler,
                                text: TextSpan(
                                  children: [
                                    TextSpan(
                                      text: valueOrDefault<String>(
                                        widget.sqm.toString(),
                                        '14',
                                      ),
                                      style: FlutterFlowTheme.of(context)
                                          .headlineLarge
                                          .override(
                                            fontFamily: 'Montserrat',
                                            fontSize: 16.0,
                                            letterSpacing: 0.0,
                                          ),
                                    ),
                                    TextSpan(
                                      text: FFLocalizations.of(context).getText(
                                        'kfpp8cpt' /*  м² */,
                                      ),
                                      style: TextStyle(),
                                    )
                                  ],
                                  style: FlutterFlowTheme.of(context)
                                      .headlineLarge
                                      .override(
                                        fontFamily: 'Montserrat',
                                        fontSize: 16.0,
                                        letterSpacing: 0.0,
                                      ),
                                ),
                              ),
                            ),
                            RichText(
                              textScaler: MediaQuery.of(context).textScaler,
                              text: TextSpan(
                                children: [
                                  TextSpan(
                                    text: valueOrDefault<String>(
                                      widget.available?.toString(),
                                      '8',
                                    ),
                                    style: FlutterFlowTheme.of(context)
                                        .displayLarge
                                        .override(
                                          fontFamily: 'Montserrat',
                                          color: widget.available! >= 1
                                              ? FlutterFlowTheme.of(context)
                                                  .success
                                              : FlutterFlowTheme.of(context)
                                                  .primary,
                                          fontSize: 28.0,
                                          letterSpacing: 0.0,
                                          fontWeight: FontWeight.bold,
                                        ),
                                  ),
                                  TextSpan(
                                    text: FFLocalizations.of(context).getText(
                                      'tbh89nrl' /* / */,
                                    ),
                                    style: TextStyle(
                                      color: FlutterFlowTheme.of(context)
                                          .alternate,
                                    ),
                                  ),
                                  TextSpan(
                                    text: valueOrDefault<String>(
                                      widget.total?.toString(),
                                      '12',
                                    ),
                                    style: TextStyle(),
                                  )
                                ],
                                style: FlutterFlowTheme.of(context)
                                    .displayLarge
                                    .override(
                                      fontFamily: 'Montserrat',
                                      color: FlutterFlowTheme.of(context)
                                          .primaryText,
                                      fontSize: 24.0,
                                      letterSpacing: 0.0,
                                      fontWeight: FontWeight.bold,
                                    ),
                              ),
                            ),
                          ],
                        ),
                      ].divide(SizedBox(width: 16.0)),
                    ),
                    Column(
                      mainAxisSize: MainAxisSize.max,
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Opacity(
                          opacity: 0.6,
                          child: RichText(
                            textScaler: MediaQuery.of(context).textScaler,
                            text: TextSpan(
                              children: [
                                TextSpan(
                                  text: valueOrDefault<String>(
                                    widget.yearPrice?.toString(),
                                    '9999',
                                  ),
                                  style: FlutterFlowTheme.of(context)
                                      .headlineLarge
                                      .override(
                                        fontFamily: 'Montserrat',
                                        fontSize: 12.0,
                                        letterSpacing: 0.0,
                                      ),
                                ),
                                TextSpan(
                                  text: FFLocalizations.of(context).getText(
                                    '0l60d4pq' /* ₽ / год */,
                                  ),
                                  style: TextStyle(),
                                )
                              ],
                              style: FlutterFlowTheme.of(context)
                                  .headlineLarge
                                  .override(
                                    fontFamily: 'Montserrat',
                                    fontSize: 12.0,
                                    letterSpacing: 0.0,
                                  ),
                            ),
                          ),
                        ),
                        Row(
                          mainAxisSize: MainAxisSize.max,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              valueOrDefault<String>(
                                widget.price.toString(),
                                '5999',
                              ),
                              style: FlutterFlowTheme.of(context)
                                  .displayLarge
                                  .override(
                                    fontFamily: 'Montserrat',
                                    color: FlutterFlowTheme.of(context)
                                        .primaryText,
                                    fontSize: 36.0,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.bold,
                                  ),
                            ),
                            Text(
                              FFLocalizations.of(context).getText(
                                '6fmshkh1' /* ₽ */,
                              ),
                              style: FlutterFlowTheme.of(context)
                                  .displayLarge
                                  .override(
                                    fontFamily: 'Tochka',
                                    color:
                                        FlutterFlowTheme.of(context).alternate,
                                    fontSize: 24.0,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.bold,
                                    useGoogleFonts: false,
                                  ),
                            ),
                          ].divide(SizedBox(width: 4.0)),
                        ),
                      ],
                    ),
                  ].divide(SizedBox(width: 16.0)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
