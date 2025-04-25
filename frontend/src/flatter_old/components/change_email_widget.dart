import '/auth/supabase_auth/auth_util.dart';
import '/backend/supabase/supabase.dart';
import '/components/attent_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import 'dart:async';
import '/custom_code/actions/index.dart' as actions;
import 'package:flutter/material.dart';
import 'change_email_model.dart';
export 'change_email_model.dart';

class ChangeEmailWidget extends StatefulWidget {
  const ChangeEmailWidget({super.key});

  @override
  State<ChangeEmailWidget> createState() => _ChangeEmailWidgetState();
}

class _ChangeEmailWidgetState extends State<ChangeEmailWidget> {
  late ChangeEmailModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => ChangeEmailModel());

    _model.emailTextController ??= TextEditingController();
    _model.emailFocusNode ??= FocusNode();

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
      padding: EdgeInsetsDirectional.fromSTEB(36.0, 0.0, 42.0, 0.0),
      child: Column(
        mainAxisSize: MainAxisSize.max,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Align(
            alignment: AlignmentDirectional(-1.0, 0.0),
            child: wrapWithModel(
              model: _model.tittleWithIconAndSubtittleModel,
              updateCallback: () => safeSetState(() {}),
              child: TittleWithIconAndSubtittleWidget(
                tittle: valueOrDefault<String>(
                  FFLocalizations.of(context).getVariableText(
                    ruText: 'Изменить почту',
                    enText: 'Change Email',
                  ),
                  'Изменить почту',
                ),
                subtittle: valueOrDefault<String>(
                  FFLocalizations.of(context).getVariableText(
                    ruText: 'Внимание, действие лемитировано!',
                    enText: 'Attention, the action is lemited!',
                  ),
                  'Внимание, действие лемитировано!',
                ),
                hasIcon: false,
                hasSubtittle: true,
              ),
            ),
          ),
          Container(
            constraints: BoxConstraints(
              maxHeight: 96.0,
            ),
            decoration: BoxDecoration(),
            child: wrapWithModel(
              model: _model.attentModel,
              updateCallback: () => safeSetState(() {}),
              child: AttentWidget(
                text: FFLocalizations.of(context).getVariableText(
                  ruText:
                      'Изменения вступят в силу только после подтверждения новой почты',
                  enText:
                      'The changes will only take effect once the new mail is confirmed',
                ),
              ),
            ),
          ),
          Padding(
            padding: EdgeInsetsDirectional.fromSTEB(0.0, 48.0, 0.0, 36.0),
            child: Form(
              key: _model.formKey,
              autovalidateMode: AutovalidateMode.disabled,
              child: Column(
                mainAxisSize: MainAxisSize.max,
                children: [
                  TextFormField(
                    controller: _model.emailTextController,
                    focusNode: _model.emailFocusNode,
                    autofocus: false,
                    textCapitalization: TextCapitalization.none,
                    obscureText: false,
                    decoration: InputDecoration(
                      isDense: true,
                      labelText: FFLocalizations.of(context).getText(
                        '9ip0igvk' /* Новый емейл */,
                      ),
                      labelStyle: FlutterFlowTheme.of(context)
                          .bodyMedium
                          .override(
                            fontFamily: 'Montserrat',
                            color: FlutterFlowTheme.of(context).tertiaryText,
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.w600,
                          ),
                      alignLabelWithHint: false,
                      hintText: currentUserEmail,
                      hintStyle: FlutterFlowTheme.of(context)
                          .bodyMedium
                          .override(
                            fontFamily: 'Montserrat',
                            color: FlutterFlowTheme.of(context).tertiaryText,
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.normal,
                          ),
                      enabledBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: FlutterFlowTheme.of(context).primaryBackground,
                          width: 2.0,
                        ),
                        borderRadius: BorderRadius.circular(16.0),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: FlutterFlowTheme.of(context).grayAlpha,
                          width: 2.0,
                        ),
                        borderRadius: BorderRadius.circular(16.0),
                      ),
                      errorBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: FlutterFlowTheme.of(context).error,
                          width: 2.0,
                        ),
                        borderRadius: BorderRadius.circular(16.0),
                      ),
                      focusedErrorBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: FlutterFlowTheme.of(context).error,
                          width: 2.0,
                        ),
                        borderRadius: BorderRadius.circular(16.0),
                      ),
                      filled: true,
                      fillColor: FlutterFlowTheme.of(context).primaryBackground,
                    ),
                    style: FlutterFlowTheme.of(context).bodyMedium.override(
                          fontFamily: 'Montserrat',
                          letterSpacing: 0.0,
                          fontWeight: FontWeight.normal,
                        ),
                    keyboardType: TextInputType.emailAddress,
                    validator: _model.emailTextControllerValidator
                        .asValidator(context),
                  ),
                ].divide(SizedBox(height: 24.0)),
              ),
            ),
          ),
          Align(
            alignment: AlignmentDirectional(0.0, 0.0),
            child: FFButtonWidget(
              onPressed: () async {
                unawaited(
                  () async {
                    if (_model.emailTextController.text.isEmpty) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            'Email required!',
                          ),
                        ),
                      );
                      return;
                    }

                    await authManager.updateEmail(
                      email: _model.emailTextController.text,
                      context: context,
                    );
                    safeSetState(() {});
                  }(),
                );
                await actions.changeEmail(
                  _model.emailTextController.text,
                );
                _model.updateEmailRow = await UsersByRolesTable().update(
                  data: {
                    'email': _model.emailTextController.text,
                  },
                  matchingRows: (rows) => rows.eqOrNull(
                    'created_by',
                    currentUserUid,
                  ),
                  returnRows: true,
                );
                await Future.delayed(const Duration(milliseconds: 500));
                if (Scaffold.of(context).isDrawerOpen ||
                    Scaffold.of(context).isEndDrawerOpen) {
                  Navigator.pop(context);
                }

                safeSetState(() {});
              },
              text: FFLocalizations.of(context).getText(
                'la5lk907' /* Изменить почту */,
              ),
              options: FFButtonOptions(
                width: double.infinity,
                height: 44.0,
                padding: EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 0.0),
                iconPadding: EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 0.0),
                color: FlutterFlowTheme.of(context).primary,
                textStyle: FlutterFlowTheme.of(context).labelLarge.override(
                      fontFamily: 'Montserrat',
                      color: FlutterFlowTheme.of(context).info,
                      fontSize: 16.0,
                      letterSpacing: 0.0,
                      fontWeight: FontWeight.w600,
                    ),
                elevation: 1.0,
                borderSide: BorderSide(
                  color: Colors.transparent,
                  width: 1.0,
                ),
                borderRadius: BorderRadius.circular(16.0),
              ),
            ),
          ),
          Align(
            alignment: AlignmentDirectional(0.0, 0.0),
            child: Padding(
              padding: EdgeInsetsDirectional.fromSTEB(0.0, 12.0, 0.0, 0.0),
              child: FFButtonWidget(
                onPressed: () async {
                  Navigator.pop(context);
                },
                text: FFLocalizations.of(context).getText(
                  '0m6ayfrw' /* Отмена */,
                ),
                options: FFButtonOptions(
                  width: double.infinity,
                  height: 44.0,
                  padding: EdgeInsetsDirectional.fromSTEB(16.0, 4.0, 16.0, 4.0),
                  iconPadding:
                      EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 0.0),
                  color: Colors.transparent,
                  textStyle: FlutterFlowTheme.of(context).bodyLarge.override(
                        fontFamily: 'Montserrat',
                        color: FlutterFlowTheme.of(context).secondaryText,
                        letterSpacing: 0.0,
                        fontWeight: FontWeight.w600,
                      ),
                  elevation: 0.0,
                  borderSide: BorderSide(
                    color: FlutterFlowTheme.of(context).alternate,
                    width: 1.0,
                  ),
                  borderRadius: BorderRadius.circular(16.0),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
