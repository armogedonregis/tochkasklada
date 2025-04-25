import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'waitlist_table_model.dart';
export 'waitlist_table_model.dart';

class WaitlistTableWidget extends StatefulWidget {
  const WaitlistTableWidget({
    super.key,
    required this.clientPhone,
    required this.clientEmail,
    required this.clientName,
    required this.locPrefs,
    required this.cellSize,
    required this.createdAt,
    String? requestStatus,
    this.requestID,
    this.availableCellSummary,
  }) : this.requestStatus = requestStatus ?? 'lead';

  final String? clientPhone;
  final String? clientEmail;
  final String? clientName;
  final String? locPrefs;
  final String? cellSize;
  final DateTime? createdAt;
  final String requestStatus;
  final String? requestID;
  final String? availableCellSummary;

  @override
  State<WaitlistTableWidget> createState() => _WaitlistTableWidgetState();
}

class _WaitlistTableWidgetState extends State<WaitlistTableWidget> {
  late WaitlistTableModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => WaitlistTableModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.isAvailable = await CellsTable().queryRows(
        queryFn: (q) => q
            .eqOrNull(
              'size',
              widget.cellSize,
            )
            .eqOrNull(
              'adress',
              widget.locPrefs,
            )
            .order('cell_id'),
      );
      if (_model.isAvailable != null && (_model.isAvailable)!.isNotEmpty) {
        _model.availableCeliID = valueOrDefault<String>(
          _model.isAvailable?.firstOrNull?.cellId,
          'нет свободных',
        );
        safeSetState(() {});
      } else {
        _model.availableCeliID = null;
        safeSetState(() {});
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
      child: AnimatedContainer(
        duration: Duration(milliseconds: 290),
        curve: Curves.easeInOut,
        width: double.infinity,
        height: 96.0,
        decoration: BoxDecoration(
          color: FlutterFlowTheme.of(context).secondaryBackground,
          boxShadow: [
            BoxShadow(
              blurRadius: 0.0,
              color: FlutterFlowTheme.of(context).accent4,
              offset: Offset(
                0.0,
                1.0,
              ),
            )
          ],
          borderRadius: BorderRadius.circular(0.0),
        ),
        child: Padding(
          padding: EdgeInsetsDirectional.fromSTEB(
              valueOrDefault<double>(
                () {
                  if (MediaQuery.sizeOf(context).width < kBreakpointSmall) {
                    return 0.0;
                  } else if (MediaQuery.sizeOf(context).width <
                      kBreakpointMedium) {
                    return 0.0;
                  } else if (MediaQuery.sizeOf(context).width <
                      kBreakpointLarge) {
                    return 16.0;
                  } else {
                    return 16.0;
                  }
                }(),
                16.0,
              ),
              0.0,
              16.0,
              0.0),
          child: Row(
            mainAxisSize: MainAxisSize.max,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                flex: () {
                  if (MediaQuery.sizeOf(context).width < kBreakpointSmall) {
                    return 3;
                  } else if (MediaQuery.sizeOf(context).width <
                      kBreakpointMedium) {
                    return 1;
                  } else if (MediaQuery.sizeOf(context).width <
                      kBreakpointLarge) {
                    return 1;
                  } else {
                    return 1;
                  }
                }(),
                child: Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 0.0, 0.0),
                  child: Container(
                    constraints: BoxConstraints(
                      minWidth: 160.0,
                    ),
                    decoration: BoxDecoration(),
                    child: Align(
                      alignment: AlignmentDirectional(-1.0, 0.0),
                      child: Column(
                        mainAxisSize: MainAxisSize.max,
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            valueOrDefault<String>(
                              widget.clientName,
                              'Александра',
                            ),
                            style: FlutterFlowTheme.of(context)
                                .labelMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.normal,
                                ),
                          ),
                          Text(
                            valueOrDefault<String>(
                              widget.clientPhone,
                              '-',
                            ),
                            style: FlutterFlowTheme.of(context)
                                .labelMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  fontSize: valueOrDefault<double>(
                                    () {
                                      if (MediaQuery.sizeOf(context).width <
                                          kBreakpointSmall) {
                                        return 12.0;
                                      } else if (MediaQuery.sizeOf(context)
                                              .width <
                                          kBreakpointMedium) {
                                        return 14.0;
                                      } else if (MediaQuery.sizeOf(context)
                                              .width <
                                          kBreakpointLarge) {
                                        return 14.0;
                                      } else {
                                        return 14.0;
                                      }
                                    }(),
                                    14.0,
                                  ),
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                          if (responsiveVisibility(
                            context: context,
                            phone: false,
                          ))
                            Text(
                              valueOrDefault<String>(
                                widget.clientEmail,
                                'alexandrapupkina@supermail.ru',
                              ),
                              style: FlutterFlowTheme.of(context)
                                  .labelMedium
                                  .override(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.normal,
                                  ),
                            ),
                        ].divide(SizedBox(height: 4.0)),
                      ),
                    ),
                  ),
                ),
              ),
              if (responsiveVisibility(
                context: context,
                phone: false,
              ))
                Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 8.0, 0.0),
                  child: Container(
                    width: 96.0,
                    decoration: BoxDecoration(),
                    child: Align(
                      alignment: AlignmentDirectional(1.0, 0.0),
                      child: Text(
                        valueOrDefault<String>(
                          dateTimeFormat(
                            "d/M H:mm",
                            widget.createdAt,
                            locale: FFLocalizations.of(context).languageCode,
                          ),
                          '12/5 9:56',
                        ),
                        textAlign: TextAlign.end,
                        style:
                            FlutterFlowTheme.of(context).labelMedium.override(
                                  fontFamily: 'Montserrat',
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.normal,
                                ),
                      ),
                    ),
                  ),
                ),
              if (responsiveVisibility(
                context: context,
                phone: false,
                tablet: false,
                tabletLandscape: false,
              ))
                Align(
                  alignment: AlignmentDirectional(-1.0, 0.0),
                  child: Container(
                    width: 120.0,
                    decoration: BoxDecoration(),
                    child: Text(
                      FFLocalizations.of(context).getText(
                        'ill9o5ml' /* Высокая */,
                      ),
                      textAlign: TextAlign.center,
                      style: FlutterFlowTheme.of(context).labelMedium.override(
                            fontFamily: 'Montserrat',
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.normal,
                          ),
                    ),
                  ),
                ),
              Expanded(
                flex: () {
                  if (MediaQuery.sizeOf(context).width < kBreakpointSmall) {
                    return 3;
                  } else if (MediaQuery.sizeOf(context).width <
                      kBreakpointMedium) {
                    return 2;
                  } else if (MediaQuery.sizeOf(context).width <
                      kBreakpointLarge) {
                    return 1;
                  } else {
                    return 1;
                  }
                }(),
                child: Align(
                  alignment: AlignmentDirectional(1.0, 0.0),
                  child: Container(
                    width: valueOrDefault<double>(
                      () {
                        if (MediaQuery.sizeOf(context).width <
                            kBreakpointSmall) {
                          return 36.0;
                        } else if (MediaQuery.sizeOf(context).width <
                            kBreakpointMedium) {
                          return 200.0;
                        } else if (MediaQuery.sizeOf(context).width <
                            kBreakpointLarge) {
                          return 200.0;
                        } else {
                          return 200.0;
                        }
                      }(),
                      200.0,
                    ),
                    decoration: BoxDecoration(),
                    alignment: AlignmentDirectional(1.0, 0.0),
                    child: Align(
                      alignment: AlignmentDirectional(0.0, 0.0),
                      child: Padding(
                        padding:
                            EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 8.0, 0.0),
                        child: Row(
                          mainAxisSize: MainAxisSize.max,
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            Align(
                              alignment: AlignmentDirectional(0.0, 0.0),
                              child: Builder(
                                builder: (context) {
                                  if (_model.availableCeliID != null &&
                                      _model.availableCeliID != '') {
                                    return Row(
                                      mainAxisSize: MainAxisSize.max,
                                      children: [
                                        if (responsiveVisibility(
                                          context: context,
                                          phone: false,
                                        ))
                                          AutoSizeText(
                                            valueOrDefault<String>(
                                              widget.availableCellSummary,
                                              '-',
                                            ).maybeHandleOverflow(
                                              maxChars: 32,
                                            ),
                                            textAlign: TextAlign.start,
                                            style: FlutterFlowTheme.of(context)
                                                .bodySmall
                                                .override(
                                                  fontFamily: 'Montserrat',
                                                  color: FlutterFlowTheme.of(
                                                          context)
                                                      .success,
                                                  letterSpacing: 0.0,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                          ),
                                        if (_model.availableCeliID != null &&
                                            _model.availableCeliID != '')
                                          Align(
                                            alignment:
                                                AlignmentDirectional(1.0, 0.0),
                                            child: FaIcon(
                                              FontAwesomeIcons.solidCheckCircle,
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .success,
                                              size: 24.0,
                                            ),
                                          ),
                                      ].divide(SizedBox(width: 4.0)),
                                    );
                                  } else {
                                    return Visibility(
                                      visible: _model.availableCeliID == null ||
                                          _model.availableCeliID == '',
                                      child: Align(
                                        alignment:
                                            AlignmentDirectional(1.0, 0.0),
                                        child: Icon(
                                          Icons.not_interested,
                                          color: FlutterFlowTheme.of(context)
                                              .error,
                                          size: 24.0,
                                        ),
                                      ),
                                    );
                                  }
                                },
                              ),
                            ),
                          ].divide(SizedBox(width: 8.0)),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              Align(
                alignment: AlignmentDirectional(1.0, 0.0),
                child: Container(
                  width: 48.0,
                  decoration: BoxDecoration(),
                  child: Align(
                    alignment: AlignmentDirectional(1.0, 0.0),
                    child: Text(
                      valueOrDefault<String>(
                        widget.locPrefs,
                        'КУД',
                      ),
                      style: FlutterFlowTheme.of(context).labelMedium.override(
                            fontFamily: 'Montserrat',
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                  ),
                ),
              ),
              Container(
                width: () {
                  if (MediaQuery.sizeOf(context).width < kBreakpointSmall) {
                    return 28.0;
                  } else if (MediaQuery.sizeOf(context).width <
                      kBreakpointMedium) {
                    return 64.0;
                  } else if (MediaQuery.sizeOf(context).width <
                      kBreakpointLarge) {
                    return 64.0;
                  } else {
                    return 64.0;
                  }
                }(),
                decoration: BoxDecoration(),
                child: Align(
                  alignment: AlignmentDirectional(1.0, 0.0),
                  child: Row(
                    mainAxisSize: MainAxisSize.max,
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Align(
                        alignment: AlignmentDirectional(1.0, 0.0),
                        child: Text(
                          valueOrDefault<String>(
                            widget.cellSize,
                            'XS',
                          ),
                          style:
                              FlutterFlowTheme.of(context).labelMedium.override(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.bold,
                                  ),
                        ),
                      ),
                    ].divide(SizedBox(width: 4.0)),
                  ),
                ),
              ),
              if (responsiveVisibility(
                context: context,
                phone: false,
                tablet: false,
                tabletLandscape: false,
              ))
                Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 4.0, 0.0),
                  child: Container(
                    width: 96.0,
                    decoration: BoxDecoration(),
                    child: Visibility(
                      visible: responsiveVisibility(
                        context: context,
                        phone: false,
                        tablet: false,
                      ),
                      child: Text(
                        valueOrDefault<String>(
                          dateTimeFormat(
                            "d/M H:mm",
                            widget.createdAt,
                            locale: FFLocalizations.of(context).languageCode,
                          ),
                          '12/5 9:56',
                        ),
                        textAlign: TextAlign.end,
                        style: FlutterFlowTheme.of(context).bodySmall.override(
                              fontFamily: 'Montserrat',
                              color: FlutterFlowTheme.of(context).secondaryText,
                              letterSpacing: 0.0,
                            ),
                      ),
                    ),
                  ),
                ),
            ].divide(SizedBox(width: 0.0)),
          ),
        ),
      ),
    );
  }
}
