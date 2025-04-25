import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'size_loc_view_model.dart';
export 'size_loc_view_model.dart';

class SizeLocViewWidget extends StatefulWidget {
  const SizeLocViewWidget({
    super.key,
    String? size,
    double? meters,
    int? availableQty,
    int? totalQty,
    int? monthlyPrice,
    int? earlyPrice,
  })  : this.size = size ?? 'XS',
        this.meters = meters ?? 3.5,
        this.availableQty = availableQty ?? 0,
        this.totalQty = totalQty ?? 0,
        this.monthlyPrice = monthlyPrice ?? 9999,
        this.earlyPrice = earlyPrice ?? 999999;

  final String size;
  final double meters;
  final int availableQty;
  final int totalQty;
  final int monthlyPrice;
  final int earlyPrice;

  @override
  State<SizeLocViewWidget> createState() => _SizeLocViewWidgetState();
}

class _SizeLocViewWidgetState extends State<SizeLocViewWidget> {
  late SizeLocViewModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => SizeLocViewModel());

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
      width: () {
        if (MediaQuery.sizeOf(context).width < kBreakpointSmall) {
          return 90.0;
        } else if (MediaQuery.sizeOf(context).width < kBreakpointMedium) {
          return 30.0;
        } else if (MediaQuery.sizeOf(context).width < kBreakpointLarge) {
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
                  style: FlutterFlowTheme.of(context).displayLarge.override(
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
                      padding:
                          EdgeInsetsDirectional.fromSTEB(0.0, 16.0, 0.0, 0.0),
                      child: RichText(
                        textScaler: MediaQuery.of(context).textScaler,
                        text: TextSpan(
                          children: [
                            TextSpan(
                              text: valueOrDefault<String>(
                                widget.meters.toString(),
                                '3.5',
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
                                'd2x71fj6' /*  м² */,
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
                              widget.availableQty.toString(),
                              '0',
                            ),
                            style: FlutterFlowTheme.of(context)
                                .displayLarge
                                .override(
                                  fontFamily: 'Montserrat',
                                  color: FlutterFlowTheme.of(context).success,
                                  fontSize: 28.0,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                          TextSpan(
                            text: FFLocalizations.of(context).getText(
                              '6u92ufqs' /* / */,
                            ),
                            style: TextStyle(
                              color: FlutterFlowTheme.of(context).alternate,
                            ),
                          ),
                          TextSpan(
                            text: valueOrDefault<String>(
                              widget.totalQty.toString(),
                              '0',
                            ),
                            style: TextStyle(),
                          )
                        ],
                        style: FlutterFlowTheme.of(context)
                            .displayLarge
                            .override(
                              fontFamily: 'Montserrat',
                              color: FlutterFlowTheme.of(context).primaryText,
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
                            widget.earlyPrice.toString(),
                            '0',
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
                            'n2bssuf0' /* ₽ / год */,
                          ),
                          style: TextStyle(),
                        )
                      ],
                      style:
                          FlutterFlowTheme.of(context).headlineLarge.override(
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
                        widget.monthlyPrice.toString(),
                        '0',
                      ),
                      style: FlutterFlowTheme.of(context).displayLarge.override(
                            fontFamily: 'Montserrat',
                            color: FlutterFlowTheme.of(context).primaryText,
                            fontSize: 36.0,
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    Text(
                      FFLocalizations.of(context).getText(
                        'n6zibn67' /* ₽ */,
                      ),
                      style: FlutterFlowTheme.of(context).displayLarge.override(
                            fontFamily: 'Tochka',
                            color: FlutterFlowTheme.of(context).alternate,
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
    );
  }
}
