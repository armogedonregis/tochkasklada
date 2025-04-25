import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/custom_code/actions/index.dart' as actions;
import '/index.dart';
import 'package:flutter/material.dart';
import 'change_mail_model.dart';
export 'change_mail_model.dart';

class ChangeMailWidget extends StatefulWidget {
  const ChangeMailWidget({
    super.key,
    required this.email,
    required this.cellID,
    required this.phone,
  });

  final String? email;
  final String? cellID;
  final String? phone;

  static String routeName = 'changeMail';
  static String routePath = '/changeMail';

  @override
  State<ChangeMailWidget> createState() => _ChangeMailWidgetState();
}

class _ChangeMailWidgetState extends State<ChangeMailWidget> {
  late ChangeMailModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => ChangeMailModel());

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
        title: 'changeMail',
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
                              '${widget.email} уже зарегистрирован!',
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
                                  24.0, 16.0, 24.0, 36.0),
                              child: Text(
                                FFLocalizations.of(context).getText(
                                  'plmfoegw' /* Никогда не регистрировались
на... */
                                  ,
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
                        Align(
                          alignment: AlignmentDirectional(0.0, 0.0),
                          child: Wrap(
                            spacing: 0.0,
                            runSpacing: 0.0,
                            alignment: WrapAlignment.start,
                            crossAxisAlignment: WrapCrossAlignment.start,
                            direction: Axis.horizontal,
                            runAlignment: WrapAlignment.start,
                            verticalDirection: VerticalDirection.down,
                            clipBehavior: Clip.none,
                            children: [
                              Align(
                                alignment: AlignmentDirectional(0.0, 0.0),
                                child: Padding(
                                  padding: EdgeInsetsDirectional.fromSTEB(
                                      0.0, 0.0, 0.0, 24.0),
                                  child: FFButtonWidget(
                                    onPressed: () async {
                                      context.pushNamed(
                                        SiteFormIframeWidget.routeName,
                                        queryParameters: {
                                          'location': serializeParam(
                                            'KUD',
                                            ParamType.String,
                                          ),
                                          'size': serializeParam(
                                            'XS',
                                            ParamType.String,
                                          ),
                                        }.withoutNulls,
                                      );
                                    },
                                    text: FFLocalizations.of(context).getText(
                                      'jp0ojid1' /* Заполнить заново */,
                                    ),
                                    options: FFButtonOptions(
                                      height: 52.0,
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          24.0, 16.0, 24.0, 16.0),
                                      iconPadding:
                                          EdgeInsetsDirectional.fromSTEB(
                                              0.0, 0.0, 0.0, 0.0),
                                      color:
                                          FlutterFlowTheme.of(context).primary,
                                      textStyle: FlutterFlowTheme.of(context)
                                          .displayLarge
                                          .override(
                                            fontFamily: 'Tochka',
                                            color: FlutterFlowTheme.of(context)
                                                .secondaryBackground,
                                            fontSize: 20.0,
                                            letterSpacing: 0.0,
                                            fontWeight: FontWeight.bold,
                                            useGoogleFonts: false,
                                          ),
                                      elevation: 0.0,
                                      borderSide: BorderSide(
                                        color: FlutterFlowTheme.of(context)
                                            .secondaryBackground,
                                        width: 1.0,
                                      ),
                                      borderRadius: BorderRadius.circular(4.0),
                                    ),
                                  ),
                                ),
                              ),
                              Align(
                                alignment: AlignmentDirectional(0.0, 0.0),
                                child: Padding(
                                  padding: EdgeInsetsDirectional.fromSTEB(
                                      0.0, 0.0, 0.0, 24.0),
                                  child: FFButtonWidget(
                                    onPressed: () async {
                                      await showDialog(
                                        context: context,
                                        builder: (alertDialogContext) {
                                          return AlertDialog(
                                            title: Text('Заявка принята! '),
                                            content: Text(
                                                'Мы свяжемся с вами для корректировки данных и бронирования в ближайшее время!'),
                                            actions: [
                                              TextButton(
                                                onPressed: () => Navigator.pop(
                                                    alertDialogContext),
                                                child: Text('ОК'),
                                              ),
                                            ],
                                          );
                                        },
                                      );
                                      _model.updateRequestData =
                                          await RequestsTable().update(
                                        data: {
                                          'notes':
                                              'Клиент найден, но надо уточнить данные',
                                        },
                                        matchingRows: (rows) => rows
                                            .eqOrNull(
                                              'email',
                                              widget.email,
                                            )
                                            .eqOrNull(
                                              'phone',
                                              widget.phone,
                                            )
                                            .eqOrNull(
                                              'reserved_cell',
                                              widget.cellID,
                                            ),
                                        returnRows: true,
                                      );
                                      await actions.launchMainSite(
                                        context,
                                        'https://tochkasklada.ru/',
                                      );

                                      safeSetState(() {});
                                    },
                                    text: FFLocalizations.of(context).getText(
                                      'ml24vm5p' /* Это мой адрес */,
                                    ),
                                    options: FFButtonOptions(
                                      height: 52.0,
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          24.0, 16.0, 24.0, 16.0),
                                      iconPadding:
                                          EdgeInsetsDirectional.fromSTEB(
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
          ),
        ));
  }
}
