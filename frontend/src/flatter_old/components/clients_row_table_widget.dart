import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'clients_row_table_model.dart';
export 'clients_row_table_model.dart';

class ClientsRowTableWidget extends StatefulWidget {
  const ClientsRowTableWidget({
    super.key,
    String? email,
    String? cellID,
    String? name,
    String? phone,
    required this.regDate,
  })  : this.email = email ?? 'email',
        this.cellID = cellID ?? 'cellID',
        this.name = name ?? 'name',
        this.phone = phone ?? 'phone';

  final String email;
  final String cellID;
  final String name;
  final String phone;
  final DateTime? regDate;

  @override
  State<ClientsRowTableWidget> createState() => _ClientsRowTableWidgetState();
}

class _ClientsRowTableWidgetState extends State<ClientsRowTableWidget> {
  late ClientsRowTableModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => ClientsRowTableModel());

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
        height: 64.0,
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
                flex: 4,
                child: Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(0.0, 2.0, 0.0, 2.0),
                  child: Container(
                    height: 58.0,
                    decoration: BoxDecoration(),
                    alignment: AlignmentDirectional(-1.0, 0.0),
                    child: Column(
                      mainAxisSize: MainAxisSize.max,
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (responsiveVisibility(
                          context: context,
                          phone: false,
                        ))
                          Text(
                            valueOrDefault<String>(
                              widget.name,
                              'name',
                            ),
                            style: FlutterFlowTheme.of(context)
                                .labelMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  fontSize: 12.0,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.normal,
                                ),
                          ),
                        if (responsiveVisibility(
                          context: context,
                          phone: false,
                        ))
                          Text(
                            valueOrDefault<String>(
                              widget.email,
                              'email',
                            ),
                            style: FlutterFlowTheme.of(context)
                                .labelMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  fontSize: 12.0,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.w600,
                                ),
                          ),
                        if (responsiveVisibility(
                          context: context,
                          phone: false,
                        ))
                          Text(
                            valueOrDefault<String>(
                              widget.phone,
                              'phone',
                            ),
                            style: FlutterFlowTheme.of(context)
                                .labelMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  fontSize: 12.0,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.normal,
                                ),
                          ),
                      ],
                    ),
                  ),
                ),
              ),
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
                            'celID',
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
                        dateTimeFormat(
                          "dd/MM/yy",
                          widget.regDate,
                          locale: FFLocalizations.of(context).languageCode,
                        ),
                        '23/05/22',
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
                  flex: 3,
                  child: Container(
                    decoration: BoxDecoration(),
                    child: Visibility(
                      visible: responsiveVisibility(
                        context: context,
                        phone: false,
                        tablet: false,
                      ),
                      child: Text(
                        FFLocalizations.of(context).getText(
                          'exbkf5l0' /* Последний платеж */,
                        ),
                        textAlign: TextAlign.end,
                        style: FlutterFlowTheme.of(context).bodyMedium.override(
                              fontFamily: 'Montserrat',
                              letterSpacing: 0.0,
                            ),
                      ),
                    ),
                  ),
                ),
              Container(
                width: 56.0,
                decoration: BoxDecoration(),
                child: Visibility(
                  visible: responsiveVisibility(
                    context: context,
                    phone: false,
                    tablet: false,
                  ),
                  child: Text(
                    FFLocalizations.of(context).getText(
                      'k3nkrd72' /* Сумма */,
                    ),
                    style: FlutterFlowTheme.of(context).labelMedium.override(
                          fontFamily: 'Montserrat',
                          color: FlutterFlowTheme.of(context).primaryText,
                          letterSpacing: 0.0,
                          fontWeight: FontWeight.w600,
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
                          'vd1adwrx' /* 23/05/24 */,
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
