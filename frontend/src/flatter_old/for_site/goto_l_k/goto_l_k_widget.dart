import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_timer.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/flutter_flow/instant_timer.dart';
import 'dart:async';
import '/custom_code/actions/index.dart' as actions;
import 'package:stop_watch_timer/stop_watch_timer.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'goto_l_k_model.dart';
export 'goto_l_k_model.dart';

class GotoLKWidget extends StatefulWidget {
  const GotoLKWidget({
    super.key,
    required this.cellID,
    required this.clientemail,
    required this.token,
    int? timeReserved,
  }) : this.timeReserved = timeReserved ?? 3;

  final String? cellID;
  final String? clientemail;
  final String? token;
  final int timeReserved;

  static String routeName = 'gotoLK';
  static String routePath = '/gotoLK';

  @override
  State<GotoLKWidget> createState() => _GotoLKWidgetState();
}

class _GotoLKWidgetState extends State<GotoLKWidget> {
  late GotoLKModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => GotoLKModel());

    // On page load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.instantTimer = InstantTimer.periodic(
        duration: Duration(milliseconds: 1000),
        callback: (timer) async {
          _model.timerController.onStartTimer();
        },
        startImmediately: true,
      );
    });

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Title(
        title: 'gotoLK',
        color: FlutterFlowTheme.of(context).primary.withAlpha(0XFF),
        child: GestureDetector(
          onTap: () {
            FocusScope.of(context).unfocus();
            FocusManager.instance.primaryFocus?.unfocus();
          },
          child: Scaffold(
            key: scaffoldKey,
            backgroundColor: FlutterFlowTheme.of(context).primary,
            body: SafeArea(
              top: true,
              child: Align(
                alignment: AlignmentDirectional(0.0, 0.0),
                child: Container(
                  decoration: BoxDecoration(),
                  child: Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(0.0, 80.0, 0.0, 0.0),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.end,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8.0),
                          child: Image.asset(
                            'assets/images/appIcon-120-1.png',
                            width: 75.0,
                            height: 75.0,
                            fit: BoxFit.cover,
                          ),
                        ),
                        Opacity(
                          opacity: 0.2,
                          child: Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(
                                16.0, 0.0, 16.0, 24.0),
                            child: FlutterFlowTimer(
                              initialTime: widget.timeReserved == 3
                                  ? 10800000
                                  : 864000000,
                              getDisplayTime: (value) =>
                                  StopWatchTimer.getDisplayTime(value,
                                      milliSecond: false),
                              controller: _model.timerController,
                              updateStateInterval: Duration(milliseconds: 1000),
                              onChanged: (value, displayTime, shouldUpdate) {
                                _model.timerMilliseconds = value;
                                _model.timerValue = displayTime;
                                if (shouldUpdate) safeSetState(() {});
                              },
                              textAlign: TextAlign.start,
                              style: FlutterFlowTheme.of(context)
                                  .headlineSmall
                                  .override(
                                    fontFamily: 'Montserrat',
                                    color: FlutterFlowTheme.of(context).info,
                                    fontSize: 60.0,
                                    letterSpacing: 0.0,
                                  ),
                            ),
                          ),
                        ),
                        Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              24.0, 0.0, 24.0, 2.0),
                          child: Text(
                            FFLocalizations.of(context).getText(
                              'fdi9htd9' /* Ячейка забронирована  */,
                            ),
                            textAlign: TextAlign.center,
                            style: FlutterFlowTheme.of(context)
                                .titleLarge
                                .override(
                                  fontFamily: 'Tochka',
                                  color: FlutterFlowTheme.of(context).info,
                                  letterSpacing: 0.0,
                                  useGoogleFonts: false,
                                  lineHeight: 0.95,
                                ),
                          ),
                        ),
                        Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              24.0, 0.0, 24.0, 0.0),
                          child: Text(
                            valueOrDefault<String>(
                              'на ${valueOrDefault<String>(
                                widget.timeReserved.toString(),
                                '3',
                              )} часа',
                              'на 3 часа',
                            ),
                            textAlign: TextAlign.center,
                            style: FlutterFlowTheme.of(context)
                                .titleLarge
                                .override(
                                  fontFamily: 'Tochka',
                                  color: FlutterFlowTheme.of(context).info,
                                  letterSpacing: 0.0,
                                  useGoogleFonts: false,
                                  lineHeight: 0.95,
                                ),
                          ),
                        ),
                        Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              0.0, 106.0, 0.0, 24.0),
                          child: FFButtonWidget(
                            onPressed: () async {
                              unawaited(
                                () async {
                                  await actions.launchMainSite(
                                    context,
                                    valueOrDefault<String>(
                                      'https://lk.tochkasklada.ru/reservedCell?token=${widget.token}',
                                      'https://lk.tochkasklada.ru/reservedCell',
                                    ),
                                  );
                                }(),
                              );
                            },
                            text: FFLocalizations.of(context).getText(
                              'zm45g4hl' /* Перейти к оплате */,
                            ),
                            options: FFButtonOptions(
                              height: 52.0,
                              padding: EdgeInsetsDirectional.fromSTEB(
                                  24.0, 16.0, 24.0, 16.0),
                              iconPadding: EdgeInsetsDirectional.fromSTEB(
                                  0.0, 0.0, 0.0, 0.0),
                              color: FlutterFlowTheme.of(context).info,
                              textStyle: FlutterFlowTheme.of(context)
                                  .displayLarge
                                  .override(
                                    fontFamily: 'Tochka',
                                    fontSize: 28.0,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.bold,
                                    useGoogleFonts: false,
                                  ),
                              elevation: 24.0,
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
                          child: Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(
                                24.0, 24.0, 24.0, 0.0),
                            child: Text(
                              FFLocalizations.of(context).getText(
                                'w0pou7p4' /* На следующей странице можно вы... */,
                              ),
                              textAlign: TextAlign.center,
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    fontFamily: 'Montserrat',
                                    color: FlutterFlowTheme.of(context).info,
                                    letterSpacing: 0.0,
                                    lineHeight: 1.25,
                                  ),
                            ),
                          ),
                        ),
                        Opacity(
                          opacity: 0.8,
                          child: Align(
                            alignment: AlignmentDirectional(0.0, 0.0),
                            child: Padding(
                              padding: EdgeInsetsDirectional.fromSTEB(
                                  24.0, 24.0, 24.0, 16.0),
                              child: Text(
                                FFLocalizations.of(context).getText(
                                  'v33sh3s1' /* Ссылку для доступа 
продублиро... */
                                  ,
                                ),
                                textAlign: TextAlign.center,
                                style: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .override(
                                      fontFamily: 'Montserrat',
                                      color: FlutterFlowTheme.of(context).info,
                                      letterSpacing: 0.0,
                                      lineHeight: 1.25,
                                    ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ));
  }
}
