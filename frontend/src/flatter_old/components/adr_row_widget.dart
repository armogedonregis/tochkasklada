import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'adr_row_model.dart';
export 'adr_row_model.dart';

class AdrRowWidget extends StatefulWidget {
  const AdrRowWidget({
    super.key,
    required this.adrID,
    required this.adrName,
    String? siteAdr,
    this.fr,
    this.price,
    required this.adr,
  }) : this.siteAdr = siteAdr ?? '';

  final String? adrID;
  final String? adrName;
  final String siteAdr;
  final int? fr;
  final int? price;
  final String? adr;

  @override
  State<AdrRowWidget> createState() => _AdrRowWidgetState();
}

class _AdrRowWidgetState extends State<AdrRowWidget> {
  late AdrRowModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => AdrRowModel());

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
      padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 24.0, 0.0),
      child: Container(
        width: double.infinity,
        height: 48.0,
        decoration: BoxDecoration(
          color: FlutterFlowTheme.of(context).secondaryBackground,
          boxShadow: [
            BoxShadow(
              blurRadius: 0.0,
              color: Color(0x33000000),
              offset: Offset(
                0.0,
                1.0,
              ),
            )
          ],
          borderRadius: BorderRadius.circular(0.0),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Padding(
              padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 0.0),
              child: Row(
                mainAxisSize: MainAxisSize.max,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Padding(
                        padding:
                            EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 0.0, 0.0),
                        child: Container(
                          width: 36.0,
                          decoration: BoxDecoration(),
                        ),
                      ),
                      Container(
                        width: valueOrDefault<double>(
                          () {
                            if (MediaQuery.sizeOf(context).width <
                                kBreakpointSmall) {
                              return 64.0;
                            } else if (MediaQuery.sizeOf(context).width <
                                kBreakpointMedium) {
                              return 78.0;
                            } else if (MediaQuery.sizeOf(context).width <
                                kBreakpointLarge) {
                              return 84.0;
                            } else {
                              return 84.0;
                            }
                          }(),
                          84.0,
                        ),
                        decoration: BoxDecoration(),
                        child: Text(
                          valueOrDefault<String>(
                            widget.adrID,
                            'ADR',
                          ),
                          style:
                              FlutterFlowTheme.of(context).bodyMedium.override(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.bold,
                                  ),
                        ),
                      ),
                      Container(
                        width: 180.0,
                        decoration: BoxDecoration(),
                        child: Align(
                          alignment: AlignmentDirectional(-1.0, 0.0),
                          child: Text(
                            valueOrDefault<String>(
                              widget.adrName,
                              'no',
                            ).maybeHandleOverflow(
                              maxChars: 36,
                            ),
                            style: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  letterSpacing: 0.0,
                                ),
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
                  ),
                  Container(
                    width: 36.0,
                    decoration: BoxDecoration(),
                    child: Padding(
                      padding:
                          EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 0.0, 0.0),
                      child: Text(
                        valueOrDefault<String>(
                          widget.fr.toString(),
                          '0',
                        ),
                        style: FlutterFlowTheme.of(context).bodyMedium.override(
                              fontFamily: 'Montserrat',
                              letterSpacing: 0.0,
                            ),
                      ),
                    ),
                  ),
                  Container(
                    width: 36.0,
                    decoration: BoxDecoration(),
                    child: Padding(
                      padding:
                          EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 0.0, 0.0),
                      child: Text(
                        valueOrDefault<String>(
                          widget.price.toString(),
                          '1',
                        ),
                        style: FlutterFlowTheme.of(context).bodyMedium.override(
                              fontFamily: 'Montserrat',
                              letterSpacing: 0.0,
                            ),
                      ),
                    ),
                  ),
                  Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 0.0, 0.0),
                    child: Text(
                      valueOrDefault<String>(
                        widget.siteAdr,
                        'site',
                      ),
                      style: FlutterFlowTheme.of(context).bodyMedium.override(
                            fontFamily: 'Montserrat',
                            letterSpacing: 0.0,
                          ),
                    ),
                  ),
                  Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 0.0, 0.0),
                    child: Text(
                      valueOrDefault<String>(
                        widget.adr,
                        'adr',
                      ),
                      style: FlutterFlowTheme.of(context).bodyMedium.override(
                            fontFamily: 'Montserrat',
                            letterSpacing: 0.0,
                          ),
                    ),
                  ),
                ].divide(SizedBox(width: 12.0)),
              ),
            ),
            Container(
              width: 48.0,
              height: 48.0,
              decoration: BoxDecoration(),
            ),
          ],
        ),
      ),
    );
  }
}
