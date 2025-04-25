import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/flutter_flow/custom_functions.dart' as functions;
import '/index.dart';
import 'package:flutter/material.dart';
import 'request_sended_match_copy4_model.dart';
export 'request_sended_match_copy4_model.dart';

class RequestSendedMatchCopy4Widget extends StatefulWidget {
  const RequestSendedMatchCopy4Widget({
    super.key,
    required this.hasCell,
    required this.email,
    required this.requestID,
    required this.phone,
    required this.username,
  });

  final String? hasCell;
  final String? email;
  final String? requestID;
  final String? phone;
  final String? username;

  @override
  State<RequestSendedMatchCopy4Widget> createState() =>
      _RequestSendedMatchCopy4WidgetState();
}

class _RequestSendedMatchCopy4WidgetState
    extends State<RequestSendedMatchCopy4Widget> {
  late RequestSendedMatchCopy4Model _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => RequestSendedMatchCopy4Model());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: AlignmentDirectional(0.0, 0.0),
      child: Padding(
        padding: EdgeInsetsDirectional.fromSTEB(16.0, 12.0, 16.0, 32.0),
        child: InkWell(
          splashColor: Colors.transparent,
          focusColor: Colors.transparent,
          hoverColor: Colors.transparent,
          highlightColor: Colors.transparent,
          onTap: () async {
            Navigator.pop(context);
            await launchURL('https://tochkasklada.ru');
          },
          child: Container(
            width: double.infinity,
            constraints: BoxConstraints(
              minWidth: 370.0,
              maxWidth: 540.0,
            ),
            decoration: BoxDecoration(
              color: FlutterFlowTheme.of(context).secondaryBackground,
              boxShadow: [
                BoxShadow(
                  blurRadius: 10.0,
                  color: FlutterFlowTheme.of(context).shadow,
                  offset: Offset(
                    0.0,
                    18.0,
                  ),
                  spreadRadius: 7.0,
                )
              ],
              borderRadius: BorderRadius.circular(16.0),
              border: Border.all(
                color: FlutterFlowTheme.of(context).grayAlpha,
              ),
            ),
            child: Padding(
              padding: EdgeInsets.all(24.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisSize: MainAxisSize.max,
                    children: [
                      Expanded(
                        child: Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              0.0, 0.0, 12.0, 0.0),
                          child: Text(
                            FFLocalizations.of(context).getText(
                              'juz4mkys' /* Ура! Ячейка найдена! */,
                            ),
                            style: FlutterFlowTheme.of(context)
                                .headlineMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  letterSpacing: 0.0,
                                ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  Divider(
                    height: 24.0,
                    thickness: 2.0,
                    color: FlutterFlowTheme.of(context).primaryBackground,
                  ),
                  Text(
                    FFLocalizations.of(context).getText(
                      'fyq39ldf' /* AI-сторож Тихон нашел подходящ... */,
                    ),
                    style: FlutterFlowTheme.of(context).bodyLarge.override(
                          fontFamily: 'Montserrat',
                          letterSpacing: 0.0,
                        ),
                  ),
                  Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(0.0, 16.0, 0.0, 0.0),
                    child: Wrap(
                      spacing: 8.0,
                      runSpacing: 12.0,
                      alignment: WrapAlignment.start,
                      crossAxisAlignment: WrapCrossAlignment.start,
                      direction: Axis.horizontal,
                      runAlignment: WrapAlignment.start,
                      verticalDirection: VerticalDirection.down,
                      clipBehavior: Clip.none,
                      children: [
                        Align(
                          alignment: AlignmentDirectional(0.0, 0.0),
                          child: FFButtonWidget(
                            onPressed: () async {
                              // generateInvite
                              _model.generateInvite =
                                  functions.generateInviteToken();
                              safeSetState(() {});
                              // check client
                              _model.checkClientsEmail =
                                  await ClientsTable().queryRows(
                                queryFn: (q) => q.eqOrNull(
                                  'email',
                                  widget.email,
                                ),
                              );
                              if (_model.checkClientsEmail != null &&
                                  (_model.checkClientsEmail)!.isNotEmpty) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                      'пользователь найден',
                                      style: TextStyle(
                                        color: FlutterFlowTheme.of(context)
                                            .primaryText,
                                      ),
                                    ),
                                    duration: Duration(milliseconds: 4000),
                                    backgroundColor:
                                        FlutterFlowTheme.of(context).secondary,
                                  ),
                                );
                                // create Token for current
                                _model.createInviteForCurrent =
                                    await ReserveTokensTable().insert({
                                  'client_email': widget.email,
                                  'invite_token': _model.generateInvite,
                                  'expires_at': supaSerialize<DateTime>(
                                      functions.createReserveTime(3)),
                                  'used': false,
                                  'cell_id': widget.hasCell,
                                });
                                // uodate request
                                _model.currentUserReservedCell =
                                    await RequestsTable().update(
                                  data: {
                                    'notes': 'самостоятельная бронь ',
                                    'processed': true,
                                    'status': 'reserved',
                                    'reserved_cell': widget.hasCell,
                                  },
                                  matchingRows: (rows) => rows
                                      .eqOrNull(
                                        'request_id',
                                        widget.requestID,
                                      )
                                      .eqOrNull(
                                        'email',
                                        widget.email,
                                      ),
                                  returnRows: true,
                                );
                                _model.setCellStateReservedCurrent =
                                    await ReservedTable().insert({
                                  'cell_id': widget.hasCell,
                                  'client_id': _model
                                      .checkClientsEmail?.firstOrNull?.clientId,
                                  'reservation_id': valueOrDefault<String>(
                                    functions.createReserveTime(3).toString(),
                                    '3',
                                  ),
                                });
                              } else {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                      'новый пользователь',
                                      style: TextStyle(
                                        color: FlutterFlowTheme.of(context)
                                            .primaryText,
                                      ),
                                    ),
                                    duration: Duration(milliseconds: 4000),
                                    backgroundColor:
                                        FlutterFlowTheme.of(context).secondary,
                                  ),
                                );
                                // CreateClient
                                _model.createdClientID =
                                    await ClientsTable().insert({
                                  'phone': widget.phone,
                                  'email': widget.email,
                                  'client_name': widget.username,
                                  'created_by': '',
                                  'client_id': '',
                                  'invite_token': _model.generateInvite,
                                });
                                // create Token for New
                                _model.createInviteForNew =
                                    await ReserveTokensTable().insert({
                                  'client_email': widget.email,
                                  'invite_token': _model.generateInvite,
                                  'expires_at': supaSerialize<DateTime>(
                                      functions.createReserveTime(3)),
                                  'used': false,
                                  'cell_id': widget.hasCell,
                                });
                                // uodate request
                                _model.userReservedCell =
                                    await RequestsTable().update(
                                  data: {
                                    'notes': 'самостоятельная бронь ',
                                    'processed': true,
                                    'status': 'reserved',
                                    'reserved_cell': widget.hasCell,
                                  },
                                  matchingRows: (rows) => rows
                                      .eqOrNull(
                                        'request_id',
                                        widget.requestID,
                                      )
                                      .eqOrNull(
                                        'email',
                                        widget.email,
                                      ),
                                  returnRows: true,
                                );
                                _model.setCellStateReservedNew =
                                    await ReservedTable().insert({
                                  'cell_id': widget.hasCell,
                                  'client_id': _model.createdClientID?.clientId,
                                  'reservation_id': valueOrDefault<String>(
                                    functions.createReserveTime(3).toString(),
                                    '3',
                                  ),
                                });
                              }

                              context.pushNamed(
                                GotoLKWidget.routeName,
                                queryParameters: {
                                  'cellID': serializeParam(
                                    widget.hasCell,
                                    ParamType.String,
                                  ),
                                  'clientemail': serializeParam(
                                    widget.email,
                                    ParamType.String,
                                  ),
                                  'token': serializeParam(
                                    _model.generateInvite,
                                    ParamType.String,
                                  ),
                                  'timeReserved': serializeParam(
                                    3,
                                    ParamType.int,
                                  ),
                                }.withoutNulls,
                              );

                              await Future.delayed(
                                  const Duration(milliseconds: 1000));
                              Navigator.pop(context);
                              _model.generateInvite = null;
                              safeSetState(() {});

                              safeSetState(() {});
                            },
                            text: FFLocalizations.of(context).getText(
                              'p8cje75d' /* Забронировать сейчас */,
                            ),
                            options: FFButtonOptions(
                              width: double.infinity,
                              height: 48.0,
                              padding: EdgeInsetsDirectional.fromSTEB(
                                  0.0, 16.0, 0.0, 16.0),
                              iconPadding: EdgeInsetsDirectional.fromSTEB(
                                  0.0, 0.0, 0.0, 0.0),
                              color: FlutterFlowTheme.of(context).primary,
                              textStyle: FlutterFlowTheme.of(context)
                                  .labelLarge
                                  .override(
                                    fontFamily: 'Montserrat',
                                    color: FlutterFlowTheme.of(context).info,
                                    fontSize: 16.0,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.w600,
                                  ),
                              elevation: 16.0,
                              borderSide: BorderSide(
                                color: Colors.transparent,
                                width: 1.0,
                              ),
                              borderRadius: BorderRadius.circular(4.0),
                            ),
                          ),
                        ),
                        Align(
                          alignment: AlignmentDirectional(0.0, 0.0),
                          child: FFButtonWidget(
                            onPressed: () async {
                              _model.userReservedCellCopy =
                                  await RequestsTable().update(
                                data: {
                                  'notes': 'Ячейка найдена. Просит связаться',
                                },
                                matchingRows: (rows) => rows
                                    .eqOrNull(
                                      'request_id',
                                      widget.requestID,
                                    )
                                    .eqOrNull(
                                      'email',
                                      widget.email,
                                    ),
                                returnRows: true,
                              );
                              Navigator.pop(context);

                              context.pushNamed(
                                RecallInfoWidget.routeName,
                                queryParameters: {
                                  'username': serializeParam(
                                    widget.username,
                                    ParamType.String,
                                  ),
                                }.withoutNulls,
                              );

                              safeSetState(() {});
                            },
                            text: FFLocalizations.of(context).getText(
                              'kjet1o51' /* Свяжитесь со мной  */,
                            ),
                            options: FFButtonOptions(
                              width: double.infinity,
                              height: 48.0,
                              padding: EdgeInsetsDirectional.fromSTEB(
                                  16.0, 16.0, 16.0, 16.0),
                              iconPadding: EdgeInsetsDirectional.fromSTEB(
                                  0.0, 0.0, 0.0, 0.0),
                              color: Colors.transparent,
                              textStyle: FlutterFlowTheme.of(context)
                                  .bodyLarge
                                  .override(
                                    fontFamily: 'Montserrat',
                                    color: FlutterFlowTheme.of(context)
                                        .secondaryText,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.w600,
                                  ),
                              elevation: 0.0,
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context).alternate,
                                width: 1.0,
                              ),
                              borderRadius: BorderRadius.circular(4.0),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
