import '/auth/supabase_auth/auth_util.dart';
import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/custom_functions.dart' as functions;
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'price_row_model.dart';
export 'price_row_model.dart';

class PriceRowWidget extends StatefulWidget {
  const PriceRowWidget({
    super.key,
    int? mMonth,
    int? mDay,
    int? sMonth,
    int? sDay,
    int? xsMonth,
    int? xsDay,
    required this.tierID,
    double? yearCt,
    required this.locs,
    this.created,
  })  : this.mMonth = mMonth ?? 10990,
        this.mDay = mDay ?? 600,
        this.sMonth = sMonth ?? 5990,
        this.sDay = sDay ?? 400,
        this.xsMonth = xsMonth ?? 3990,
        this.xsDay = xsDay ?? 200,
        this.yearCt = yearCt ?? 10.0;

  final int mMonth;
  final int mDay;
  final int sMonth;
  final int sDay;
  final int xsMonth;
  final int xsDay;
  final int? tierID;
  final double yearCt;
  final List<String>? locs;
  final String? created;

  @override
  State<PriceRowWidget> createState() => _PriceRowWidgetState();
}

class _PriceRowWidgetState extends State<PriceRowWidget> {
  late PriceRowModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => PriceRowModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.locs = functions.getLocationsForPriceTier(widget.locs!.toList())!;
      safeSetState(() {});
      if (widget.created == currentUserEmail) {
        _model.isEditable = true;
        _model.updatePage(() {});
      } else {
        _model.isEditable = false;
        _model.updatePage(() {});
      }
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
                            widget.mMonth.toString(),
                            '10990',
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
                            widget.mDay.toString(),
                            '600',
                          ),
                          style:
                              FlutterFlowTheme.of(context).bodyMedium.override(
                                    fontFamily: 'Montserrat',
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
                  ),
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
                            widget.sMonth.toString(),
                            '5990',
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
                            widget.sDay.toString(),
                            '400',
                          ),
                          style:
                              FlutterFlowTheme.of(context).bodyMedium.override(
                                    fontFamily: 'Montserrat',
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
                  ),
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
                            widget.xsMonth.toString(),
                            '3990',
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
                            widget.xsDay.toString(),
                            '200',
                          ),
                          style:
                              FlutterFlowTheme.of(context).bodyMedium.override(
                                    fontFamily: 'Montserrat',
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
                  ),
                  Container(
                    width: 100.0,
                    decoration: BoxDecoration(),
                    child: Text(
                      valueOrDefault<String>(
                        widget.yearCt.toString(),
                        '10',
                      ),
                      style: FlutterFlowTheme.of(context).bodyMedium.override(
                            fontFamily: 'Montserrat',
                            letterSpacing: 0.0,
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
                          widget.tierID?.toString(),
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
                      _model.locs,
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
              child: Builder(
                builder: (context) {
                  if (!_model.isEditable) {
                    return Visibility(
                      visible: !_model.isEditable,
                      child: Icon(
                        Icons.edit_off_rounded,
                        color: FlutterFlowTheme.of(context).secondary,
                        size: 24.0,
                      ),
                    );
                  } else {
                    return Visibility(
                      visible:
                          !(widget.locs != null && (widget.locs)!.isNotEmpty),
                      child: FlutterFlowIconButton(
                        borderColor: Colors.transparent,
                        borderRadius: 16.0,
                        borderWidth: 1.0,
                        buttonSize: 48.0,
                        hoverColor: FlutterFlowTheme.of(context).accent1,
                        hoverIconColor:
                            FlutterFlowTheme.of(context).primaryText,
                        icon: FaIcon(
                          FontAwesomeIcons.trashAlt,
                          color: FlutterFlowTheme.of(context).alternate,
                          size: 24.0,
                        ),
                        onPressed: () async {
                          _model.deleteRow = await AreaPricesTable().delete(
                            matchingRows: (rows) => rows.eqOrNull(
                              'price_id',
                              widget.tierID,
                            ),
                            returnRows: true,
                          );

                          _model.updatePage(() {});

                          safeSetState(() {});
                        },
                      ),
                    );
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
