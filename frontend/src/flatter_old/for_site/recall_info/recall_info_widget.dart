import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/custom_code/actions/index.dart' as actions;
import '/flutter_flow/custom_functions.dart' as functions;
import 'package:flutter/material.dart';
import 'recall_info_model.dart';
export 'recall_info_model.dart';

class RecallInfoWidget extends StatefulWidget {
  const RecallInfoWidget({
    super.key,
    required this.username,
  });

  final String? username;

  static String routeName = 'recallInfo';
  static String routePath = '/recallInfo';

  @override
  State<RecallInfoWidget> createState() => _RecallInfoWidgetState();
}

class _RecallInfoWidgetState extends State<RecallInfoWidget> {
  late RecallInfoModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => RecallInfoModel());

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
        title: 'recallInfo',
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
                        Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              24.0, 24.0, 24.0, 0.0),
                          child: Text(
                            valueOrDefault<String>(
                              '${widget.username}, спасибо за заявку!',
                              'Спасибо за заявку!',
                            ),
                            textAlign: TextAlign.center,
                            style: FlutterFlowTheme.of(context)
                                .titleLarge
                                .override(
                                  fontFamily: 'Tochka',
                                  color: FlutterFlowTheme.of(context).info,
                                  fontSize: 20.0,
                                  letterSpacing: 0.0,
                                  useGoogleFonts: false,
                                  lineHeight: 0.95,
                                ),
                          ),
                        ),
                        Opacity(
                          opacity: 0.8,
                          child: Align(
                            alignment: AlignmentDirectional(0.0, 0.0),
                            child: Padding(
                              padding: EdgeInsetsDirectional.fromSTEB(
                                  24.0, 8.0, 24.0, 36.0),
                              child: Text(
                                valueOrDefault<String>(
                                  functions.isWorkingHours()
                                      ? 'Мы свяжемся с вами в ближайшее время'
                                      : 'Мы свяжемся с вами, как только наши операторы будут на месте',
                                  'Свяжемся с вами в ближайшее время',
                                ),
                                textAlign: TextAlign.center,
                                style: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .override(
                                      fontFamily: 'Montserrat',
                                      color: FlutterFlowTheme.of(context).info,
                                      fontSize: 16.0,
                                      letterSpacing: 0.0,
                                      lineHeight: 1.25,
                                    ),
                              ),
                            ),
                          ),
                        ),
                        Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              0.0, 106.0, 0.0, 24.0),
                          child: FFButtonWidget(
                            onPressed: () async {
                              await actions.launchMainSite(
                                context,
                                'https://tochkasklada.ru/',
                              );
                            },
                            text: FFLocalizations.of(context).getText(
                              'rad8o8io' /* Вернуться на сайт */,
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
