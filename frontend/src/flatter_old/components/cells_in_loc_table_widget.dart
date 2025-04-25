import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'cells_in_loc_table_model.dart';
export 'cells_in_loc_table_model.dart';

class CellsInLocTableWidget extends StatefulWidget {
  const CellsInLocTableWidget({
    super.key,
    String? email,
    String? cellID,
    String? locID,
    String? size,
    String? status,
  })  : this.email = email ?? 'email',
        this.cellID = cellID ?? 'cellID',
        this.locID = locID ?? '0',
        this.size = size ?? 'N',
        this.status = status ?? 'available';

  final String email;
  final String cellID;
  final String locID;
  final String size;
  final String status;

  @override
  State<CellsInLocTableWidget> createState() => _CellsInLocTableWidgetState();
}

class _CellsInLocTableWidgetState extends State<CellsInLocTableWidget> {
  late CellsInLocTableModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => CellsInLocTableModel());

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
      padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 0.0),
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
        child: Padding(
          padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 0.0),
          child: Row(
            mainAxisSize: MainAxisSize.max,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                flex: () {
                  if (MediaQuery.sizeOf(context).width < kBreakpointSmall) {
                    return 6;
                  } else if (MediaQuery.sizeOf(context).width <
                      kBreakpointMedium) {
                    return 3;
                  } else if (MediaQuery.sizeOf(context).width <
                      kBreakpointLarge) {
                    return 3;
                  } else {
                    return 3;
                  }
                }(),
                child: Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(24.0, 0.0, 0.0, 0.0),
                  child: Container(
                    decoration: BoxDecoration(),
                    child: Column(
                      mainAxisSize: MainAxisSize.max,
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          valueOrDefault<String>(
                            widget.cellID,
                            'cellID',
                          ),
                          style:
                              FlutterFlowTheme.of(context).labelMedium.override(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.bold,
                                  ),
                        ),
                        Text(
                          valueOrDefault<String>(
                            widget.size,
                            'N',
                          ),
                          style:
                              FlutterFlowTheme.of(context).labelMedium.override(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.bold,
                                  ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              Expanded(
                flex: 4,
                child: Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(0.0, 2.0, 0.0, 2.0),
                  child: Container(
                    height: 58.0,
                    decoration: BoxDecoration(),
                    alignment: AlignmentDirectional(-1.0, 0.0),
                    child: Visibility(
                      visible: responsiveVisibility(
                        context: context,
                        phone: false,
                      ),
                      child: Text(
                        valueOrDefault<String>(
                          widget.email,
                          'email',
                        ),
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
              ),
              Expanded(
                flex: 2,
                child: Container(
                  decoration: BoxDecoration(),
                  child: Visibility(
                    visible: responsiveVisibility(
                      context: context,
                      phone: false,
                      tablet: false,
                    ),
                    child: Text(
                      valueOrDefault<String>(
                        () {
                          if (widget.status == 'available') {
                            return 'свободно';
                          } else if (widget.status == 'rented') {
                            return 'занято';
                          } else if (widget.status == 'reserved') {
                            return 'бронь';
                          } else {
                            return 'свободно';
                          }
                        }(),
                        'status',
                      ),
                      style: FlutterFlowTheme.of(context).labelMedium.override(
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
              ))
                Expanded(
                  flex: 2,
                  child: Container(
                    width: 100.0,
                    decoration: BoxDecoration(),
                    child: Visibility(
                      visible: responsiveVisibility(
                        context: context,
                        phone: false,
                        tablet: false,
                      ),
                      child: Text(
                        FFLocalizations.of(context).getText(
                          'pvwgspb7' /* 23/05/24 */,
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
              ))
                Flexible(
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 48.0,
                        height: 48.0,
                        decoration: BoxDecoration(),
                      ),
                    ],
                  ),
                ),
            ].divide(SizedBox(width: 12.0)),
          ),
        ),
      ),
    );
  }
}
