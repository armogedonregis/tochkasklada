import '/auth/supabase_auth/auth_util.dart';
import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/components/modal_invite_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_checkbox_group.dart';
import '/flutter_flow/flutter_flow_choice_chips.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/flutter_flow/form_field_controller.dart';
import 'dart:async';
import '/flutter_flow/custom_functions.dart' as functions;
import 'package:aligned_dialog/aligned_dialog.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'create_user_model.dart';
export 'create_user_model.dart';

class CreateUserWidget extends StatefulWidget {
  const CreateUserWidget({
    super.key,
    required this.inviteCreator,
    required this.franchisee,
  });

  final String? inviteCreator;
  final int? franchisee;

  @override
  State<CreateUserWidget> createState() => _CreateUserWidgetState();
}

class _CreateUserWidgetState extends State<CreateUserWidget> {
  late CreateUserModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => CreateUserModel());

    _model.displayNameTextController ??= TextEditingController();
    _model.displayNameFocusNode ??= FocusNode();

    _model.emailTextController ??= TextEditingController();
    _model.emailFocusNode ??= FocusNode();

    _model.inviteCodeTextController ??=
        TextEditingController(text: functions.generateInviteToken());
    _model.inviteCodeFocusNode ??= FocusNode();

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    context.watch<FFAppState>();

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
                    ruText: 'Создать сотрудника',
                    enText: 'Create user',
                  ),
                  'Создать сотрудника',
                ),
                subtittle: valueOrDefault<String>(
                  FFLocalizations.of(context).getVariableText(
                    ruText: 'в роли  менеджера или оператора',
                    enText: 'as a manager or operator',
                  ),
                  'в роли  менеджера или оператора',
                ),
                hasIcon: false,
                hasSubtittle: true,
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
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  TextFormField(
                    controller: _model.displayNameTextController,
                    focusNode: _model.displayNameFocusNode,
                    autofocus: false,
                    textCapitalization: TextCapitalization.words,
                    obscureText: false,
                    decoration: InputDecoration(
                      isDense: true,
                      labelText: FFLocalizations.of(context).getText(
                        '2elsatal' /* Имя Фамилия */,
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
                      hintStyle: FlutterFlowTheme.of(context)
                          .bodyMedium
                          .override(
                            fontFamily: 'Montserrat',
                            color: FlutterFlowTheme.of(context).tertiaryText,
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.normal,
                          ),
                      errorStyle:
                          FlutterFlowTheme.of(context).bodyMedium.override(
                                fontFamily: 'Montserrat',
                                color: FlutterFlowTheme.of(context).error,
                                fontSize: 12.0,
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
                    validator: _model.displayNameTextControllerValidator
                        .asValidator(context),
                  ),
                  Row(
                    mainAxisSize: MainAxisSize.max,
                    children: [
                      FlutterFlowChoiceChips(
                        options: [
                          ChipData(FFLocalizations.of(context).getText(
                            '5qv3gk7i' /* Менеджер */,
                          )),
                          ChipData(FFLocalizations.of(context).getText(
                            '50xrtp93' /* Оператор */,
                          ))
                        ],
                        onChanged: (val) async {
                          safeSetState(() =>
                              _model.roleChoiceChipsValue = val?.firstOrNull);
                          _model.setRole = _model.roleChoiceChipsValue ==
                                  FFLocalizations.of(context).getVariableText(
                                    ruText: 'Менеджер',
                                    enText: 'Manager',
                                  )
                              ? CrmRoles.manager
                              : CrmRoles.operator;
                          safeSetState(() {});
                        },
                        selectedChipStyle: ChipStyle(
                          backgroundColor:
                              FlutterFlowTheme.of(context).secondary,
                          textStyle:
                              FlutterFlowTheme.of(context).bodyMedium.override(
                                    fontFamily: 'Montserrat',
                                    color: FlutterFlowTheme.of(context).info,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.w600,
                                  ),
                          iconColor: FlutterFlowTheme.of(context).info,
                          iconSize: 18.0,
                          elevation: 4.0,
                          borderRadius: BorderRadius.circular(16.0),
                        ),
                        unselectedChipStyle: ChipStyle(
                          backgroundColor:
                              FlutterFlowTheme.of(context).alternate,
                          textStyle: FlutterFlowTheme.of(context)
                              .bodyMedium
                              .override(
                                fontFamily: 'Montserrat',
                                color:
                                    FlutterFlowTheme.of(context).secondaryText,
                                letterSpacing: 0.0,
                              ),
                          iconColor: FlutterFlowTheme.of(context).secondaryText,
                          iconSize: 18.0,
                          elevation: 0.0,
                          borderRadius: BorderRadius.circular(16.0),
                        ),
                        chipSpacing: 12.0,
                        rowSpacing: 12.0,
                        multiselect: false,
                        initialized: _model.roleChoiceChipsValue != null,
                        alignment: WrapAlignment.start,
                        controller: _model.roleChoiceChipsValueController ??=
                            FormFieldController<List<String>>(
                          [
                            FFLocalizations.of(context).getText(
                              'teycxab4' /* Менеджер */,
                            )
                          ],
                        ),
                        wrapped: false,
                      ),
                    ],
                  ),
                  if (_model.roleChoiceChipsValue != null &&
                      _model.roleChoiceChipsValue != '')
                    Builder(
                      builder: (context) {
                        if (_model.setRole == CrmRoles.manager) {
                          return Column(
                            mainAxisSize: MainAxisSize.max,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                FFLocalizations.of(context).getText(
                                  '2l9cjy7h' /* Права менеджера: */,
                                ),
                                style: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .override(
                                      fontFamily: 'Montserrat',
                                      color: FlutterFlowTheme.of(context)
                                          .tertiaryText,
                                      letterSpacing: 0.0,
                                    ),
                              ),
                              Container(
                                decoration: BoxDecoration(
                                  color: FlutterFlowTheme.of(context).accent3,
                                  borderRadius: BorderRadius.circular(16.0),
                                ),
                                child: Padding(
                                  padding: EdgeInsets.all(16.0),
                                  child: FlutterFlowCheckboxGroup(
                                    options: [
                                      FFLocalizations.of(context).getText(
                                        'ekz8dvd9' /* Информация о клиентах */,
                                      ),
                                      FFLocalizations.of(context).getText(
                                        'kkkdamiw' /* Информация о статусе ячеек */,
                                      ),
                                      FFLocalizations.of(context).getText(
                                        'w7qb6c8g' /* Информация о заявках */,
                                      ),
                                      FFLocalizations.of(context).getText(
                                        'lx3woblr' /* Создание скидок и промокодов */,
                                      ),
                                      FFLocalizations.of(context).getText(
                                        'lr37xrfa' /* Просмотр платежей */,
                                      )
                                    ],
                                    onChanged: (_model.roleChoiceChipsValue !=
                                                null &&
                                            _model.roleChoiceChipsValue != '')
                                        ? null
                                        : (val) => safeSetState(() =>
                                            _model.checkboxGroupValues1 = val),
                                    controller:
                                        _model.checkboxGroupValueController1 ??=
                                            FormFieldController<List<String>>(
                                      List.from([
                                            FFLocalizations.of(context).getText(
                                              '80wkkri8' /* Информация о клиентах */,
                                            ),
                                            FFLocalizations.of(context).getText(
                                              'uhd5exk3' /* Информация о статусе ячеек */,
                                            ),
                                            FFLocalizations.of(context).getText(
                                              'pu5dyp0c' /* Информация о заявках */,
                                            ),
                                            FFLocalizations.of(context).getText(
                                              'm95po4tg' /* Создание скидок и промокодов */,
                                            ),
                                            FFLocalizations.of(context).getText(
                                              'i2lu9yh7' /* Просмотр платежей */,
                                            )
                                          ] ??
                                          []),
                                    ),
                                    activeColor: FlutterFlowTheme.of(context)
                                        .primaryText,
                                    checkColor: FlutterFlowTheme.of(context)
                                        .primaryBackground,
                                    checkboxBorderColor:
                                        FlutterFlowTheme.of(context).alternate,
                                    textStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Montserrat',
                                          letterSpacing: 0.0,
                                        ),
                                    unselectedTextStyle:
                                        FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Montserrat',
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .secondaryText,
                                              letterSpacing: 0.0,
                                            ),
                                    checkboxBorderRadius:
                                        BorderRadius.circular(4.0),
                                    initialized:
                                        _model.checkboxGroupValues1 != null,
                                  ),
                                ),
                              ),
                            ].divide(SizedBox(height: 16.0)),
                          );
                        } else {
                          return Column(
                            mainAxisSize: MainAxisSize.max,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                FFLocalizations.of(context).getText(
                                  '3mke6bxk' /* Права оператора: */,
                                ),
                                style: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .override(
                                      fontFamily: 'Montserrat',
                                      color: FlutterFlowTheme.of(context)
                                          .tertiaryText,
                                      letterSpacing: 0.0,
                                    ),
                              ),
                              Container(
                                decoration: BoxDecoration(
                                  color: FlutterFlowTheme.of(context).accent3,
                                  borderRadius: BorderRadius.circular(16.0),
                                ),
                                child: Padding(
                                  padding: EdgeInsets.all(16.0),
                                  child: FlutterFlowCheckboxGroup(
                                    options: [
                                      FFLocalizations.of(context).getText(
                                        '6xt2ac41' /* Информация о клиентах */,
                                      ),
                                      FFLocalizations.of(context).getText(
                                        '3w2obu48' /* Информация о статусе ячеек */,
                                      ),
                                      FFLocalizations.of(context).getText(
                                        'x9jg1bp8' /* Информация о заявках */,
                                      ),
                                      FFLocalizations.of(context).getText(
                                        'ena375xv' /* Создание скидок и промокодов */,
                                      ),
                                      FFLocalizations.of(context).getText(
                                        'gl5slmod' /* Просмотр платежей */,
                                      )
                                    ],
                                    onChanged: (_model.roleChoiceChipsValue !=
                                                null &&
                                            _model.roleChoiceChipsValue != '')
                                        ? null
                                        : (val) => safeSetState(() =>
                                            _model.checkboxGroupValues2 = val),
                                    controller:
                                        _model.checkboxGroupValueController2 ??=
                                            FormFieldController<List<String>>(
                                      List.from([
                                            FFLocalizations.of(context).getText(
                                              'z24zk3go' /* Информация о клиентах */,
                                            ),
                                            FFLocalizations.of(context).getText(
                                              'co2tp8kv' /* Информация о статусе ячеек */,
                                            ),
                                            FFLocalizations.of(context).getText(
                                              'gfewfmkp' /* Информация о заявках */,
                                            )
                                          ] ??
                                          []),
                                    ),
                                    activeColor: FlutterFlowTheme.of(context)
                                        .primaryText,
                                    checkColor: FlutterFlowTheme.of(context)
                                        .primaryBackground,
                                    checkboxBorderColor:
                                        FlutterFlowTheme.of(context).alternate,
                                    textStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Montserrat',
                                          letterSpacing: 0.0,
                                        ),
                                    unselectedTextStyle:
                                        FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Montserrat',
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .secondaryText,
                                              letterSpacing: 0.0,
                                            ),
                                    checkboxBorderRadius:
                                        BorderRadius.circular(4.0),
                                    initialized:
                                        _model.checkboxGroupValues2 != null,
                                  ),
                                ),
                              ),
                            ].divide(SizedBox(height: 16.0)),
                          );
                        }
                      },
                    ),
                  TextFormField(
                    controller: _model.emailTextController,
                    focusNode: _model.emailFocusNode,
                    autofocus: false,
                    textCapitalization: TextCapitalization.words,
                    obscureText: false,
                    decoration: InputDecoration(
                      isDense: true,
                      labelText: FFLocalizations.of(context).getText(
                        'e65vbqsl' /* Почта */,
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
                      hintStyle: FlutterFlowTheme.of(context)
                          .bodyMedium
                          .override(
                            fontFamily: 'Montserrat',
                            color: FlutterFlowTheme.of(context).tertiaryText,
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.normal,
                          ),
                      errorStyle:
                          FlutterFlowTheme.of(context).bodyMedium.override(
                                fontFamily: 'Montserrat',
                                color: FlutterFlowTheme.of(context).error,
                                fontSize: 12.0,
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
                    validator: _model.emailTextControllerValidator
                        .asValidator(context),
                  ),
                  TextFormField(
                    controller: _model.inviteCodeTextController,
                    focusNode: _model.inviteCodeFocusNode,
                    autofocus: false,
                    textCapitalization: TextCapitalization.words,
                    readOnly: true,
                    obscureText: false,
                    decoration: InputDecoration(
                      isDense: true,
                      labelText: FFLocalizations.of(context).getText(
                        '5sfq709g' /* Токен приглашения */,
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
                          color: FlutterFlowTheme.of(context).grayAlpha,
                          width: 1.0,
                        ),
                        borderRadius: BorderRadius.circular(16.0),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: FlutterFlowTheme.of(context).grayAlpha,
                          width: 1.0,
                        ),
                        borderRadius: BorderRadius.circular(16.0),
                      ),
                      errorBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: FlutterFlowTheme.of(context).error,
                          width: 1.0,
                        ),
                        borderRadius: BorderRadius.circular(16.0),
                      ),
                      focusedErrorBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: FlutterFlowTheme.of(context).error,
                          width: 1.0,
                        ),
                        borderRadius: BorderRadius.circular(16.0),
                      ),
                      filled: true,
                      fillColor:
                          FlutterFlowTheme.of(context).secondaryBackground,
                    ),
                    style: FlutterFlowTheme.of(context).bodyMedium.override(
                          fontFamily: 'Montserrat',
                          color: FlutterFlowTheme.of(context).tertiaryText,
                          letterSpacing: 0.0,
                          fontWeight: FontWeight.normal,
                        ),
                    validator: _model.inviteCodeTextControllerValidator
                        .asValidator(context),
                  ),
                ].divide(SizedBox(height: 24.0)),
              ),
            ),
          ),
          Align(
            alignment: AlignmentDirectional(0.0, 0.0),
            child: Builder(
              builder: (context) => FFButtonWidget(
                onPressed: () async {
                  if (_model.formKey.currentState == null ||
                      !_model.formKey.currentState!.validate()) {
                    return;
                  }
                  unawaited(
                    () async {
                      _model.createinvite = await InvitesTable().insert({
                        'inviteID': _model.inviteCodeTextController.text,
                        'invited_by': currentUserEmail,
                        'email': _model.emailTextController.text,
                        'role': _model.setRole?.name,
                        'username': _model.displayNameTextController.text,
                        'created_by': currentUserUid,
                        'franchisee': FFAppState().franchisee,
                        'invite_status': 'available',
                      });
                    }(),
                  );
                  await Future.delayed(const Duration(milliseconds: 500));
                  if (Scaffold.of(context).isDrawerOpen ||
                      Scaffold.of(context).isEndDrawerOpen) {
                    Navigator.pop(context);
                  }

                  _model.updatePage(() {});
                  await showAlignedDialog(
                    context: context,
                    isGlobal: false,
                    avoidOverflow: true,
                    targetAnchor: AlignmentDirectional(0.0, 0.0)
                        .resolve(Directionality.of(context)),
                    followerAnchor: AlignmentDirectional(0.0, 0.0)
                        .resolve(Directionality.of(context)),
                    builder: (dialogContext) {
                      return Material(
                        color: Colors.transparent,
                        child: ModalInviteWidget(
                          inviteLink:
                              'https://crmtochka.flutterflow.app/register?inviteID=${_model.inviteCodeTextController.text}',
                        ),
                      );
                    },
                  );

                  safeSetState(() {});
                },
                text: FFLocalizations.of(context).getText(
                  'uqw5vpws' /* Отправить инвайт */,
                ),
                options: FFButtonOptions(
                  width: double.infinity,
                  height: 44.0,
                  padding: EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 0.0),
                  iconPadding:
                      EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 0.0),
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
                  't9pfgbk2' /* Отмена */,
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
