import '/backend/supabase/supabase.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_radio_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/flutter_flow/form_field_controller.dart';
import 'package:flutter/material.dart';
import 'create_merchant_model.dart';
export 'create_merchant_model.dart';

class CreateMerchantWidget extends StatefulWidget {
  const CreateMerchantWidget({super.key});

  @override
  State<CreateMerchantWidget> createState() => _CreateMerchantWidgetState();
}

class _CreateMerchantWidgetState extends State<CreateMerchantWidget> {
  late CreateMerchantModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => CreateMerchantModel());

    _model.termIDTextController ??= TextEditingController();
    _model.termIDFocusNode ??= FocusNode();
    _model.termIDFocusNode!.addListener(
      () async {
        // Такое имя существует?
        _model.checkTermName = await MerchantsTable().queryRows(
          queryFn: (q) => q.eqOrNull(
            'merchant_id',
            _model.termIDTextController.text,
          ),
        );
        if (_model.checkTermName != null &&
            (_model.checkTermName)!.isNotEmpty) {
          // Имя занято
          _model.nameAvailable = false;
          safeSetState(() {});
        } else {
          // Имя свободно
          _model.nameAvailable = true;
          safeSetState(() {});
        }

        safeSetState(() {});
      },
    );
    _model.termTextController ??= TextEditingController();
    _model.termFocusNode ??= FocusNode();

    _model.passSingleViewTextController ??= TextEditingController();
    _model.passSingleViewFocusNode ??= FocusNode();

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
                tittle: 'Создать Мерчанта',
                subtittle:
                    'Для создания потребуется регистрация в Тиньков-банке. \nТерминал может быть привязан к одной или нескольким франшизам. ',
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
              child: Align(
                alignment: AlignmentDirectional(-1.0, 0.0),
                child: Column(
                  mainAxisSize: MainAxisSize.max,
                  children: [
                    Align(
                      alignment: AlignmentDirectional(1.0, 0.0),
                      child: Stack(
                        alignment: AlignmentDirectional(1.0, 0.0),
                        children: [
                          TextFormField(
                            controller: _model.termIDTextController,
                            focusNode: _model.termIDFocusNode,
                            autofocus: false,
                            textCapitalization: TextCapitalization.none,
                            obscureText: false,
                            decoration: InputDecoration(
                              isDense: true,
                              labelText: FFLocalizations.of(context).getText(
                                'q2jo2ejn' /* Имя терминала* */,
                              ),
                              labelStyle: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.normal,
                                  ),
                              alignLabelWithHint: true,
                              hintText: FFLocalizations.of(context).getText(
                                '7os467p3' /* Например, tochka-1 или ip-pupk... */,
                              ),
                              hintStyle: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    fontFamily: 'Montserrat',
                                    color: FlutterFlowTheme.of(context)
                                        .tertiaryText,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.normal,
                                  ),
                              enabledBorder: OutlineInputBorder(
                                borderSide: BorderSide(
                                  color: FlutterFlowTheme.of(context)
                                      .primaryBackground,
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
                              fillColor: FlutterFlowTheme.of(context)
                                  .primaryBackground,
                            ),
                            style: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.normal,
                                ),
                            validator: _model.termIDTextControllerValidator
                                .asValidator(context),
                          ),
                          if (_model.nameAvailable != null)
                            Padding(
                              padding: EdgeInsetsDirectional.fromSTEB(
                                  0.0, 0.0, 8.0, 0.0),
                              child: Builder(
                                builder: (context) {
                                  if (_model.nameAvailable ?? false) {
                                    return Icon(
                                      Icons.check_rounded,
                                      color:
                                          FlutterFlowTheme.of(context).success,
                                      size: 24.0,
                                    );
                                  } else {
                                    return Icon(
                                      Icons.error,
                                      color: FlutterFlowTheme.of(context).error,
                                      size: 24.0,
                                    );
                                  }
                                },
                              ),
                            ),
                        ],
                      ),
                    ),
                    Align(
                      alignment: AlignmentDirectional(-1.0, 0.0),
                      child: Padding(
                        padding:
                            EdgeInsetsDirectional.fromSTEB(8.0, 0.0, 0.0, 0.0),
                        child: Text(
                          FFLocalizations.of(context).getText(
                            'edj8rc1f' /* Допустима только латиница (стр... */,
                          ),
                          style:
                              FlutterFlowTheme.of(context).bodyMedium.override(
                                    fontFamily: 'Montserrat',
                                    fontSize: 12.0,
                                    letterSpacing: 0.0,
                                  ),
                        ),
                      ),
                    ),
                    Align(
                      alignment: AlignmentDirectional(-1.0, 0.0),
                      child: Padding(
                        padding:
                            EdgeInsetsDirectional.fromSTEB(0.0, 16.0, 0.0, 0.0),
                        child: Text(
                          FFLocalizations.of(context).getText(
                            '4ykupryy' /* Выберите тип терминала: */,
                          ),
                          style: FlutterFlowTheme.of(context)
                              .titleSmall
                              .override(
                                fontFamily: 'Montserrat',
                                color: FlutterFlowTheme.of(context).primaryText,
                                letterSpacing: 0.0,
                              ),
                        ),
                      ),
                    ),
                    Align(
                      alignment: AlignmentDirectional(-1.0, 0.0),
                      child: Padding(
                        padding:
                            EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 8.0),
                        child: FlutterFlowRadioButton(
                          options: [
                            FFLocalizations.of(context).getText(
                              'ulhcil7p' /* Тестовый */,
                            ),
                            FFLocalizations.of(context).getText(
                              'aa2vc8ta' /* Рабочий */,
                            ),
                            FFLocalizations.of(context).getText(
                              '4bjg52lq' /* Неактивный */,
                            )
                          ].toList(),
                          onChanged: (val) => safeSetState(() {}),
                          controller: _model.radioButtonValueController ??=
                              FormFieldController<String>(
                                  FFLocalizations.of(context).getText(
                            'reulb1w9' /* Тестовый */,
                          )),
                          optionHeight: 32.0,
                          textStyle:
                              FlutterFlowTheme.of(context).labelMedium.override(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 0.0,
                                  ),
                          selectedTextStyle:
                              FlutterFlowTheme.of(context).bodyMedium.override(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 0.0,
                                  ),
                          buttonPosition: RadioButtonPosition.left,
                          direction: Axis.horizontal,
                          radioButtonColor:
                              FlutterFlowTheme.of(context).primary,
                          inactiveRadioButtonColor:
                              FlutterFlowTheme.of(context).secondaryText,
                          toggleable: false,
                          horizontalAlignment: WrapAlignment.start,
                          verticalAlignment: WrapCrossAlignment.start,
                        ),
                      ),
                    ),
                    Padding(
                      padding:
                          EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 8.0),
                      child: TextFormField(
                        controller: _model.termTextController,
                        focusNode: _model.termFocusNode,
                        autofocus: false,
                        textCapitalization: TextCapitalization.words,
                        obscureText: false,
                        decoration: InputDecoration(
                          isDense: true,
                          labelText: FFLocalizations.of(context).getText(
                            '0k2b2k1a' /* Ключ терминала* */,
                          ),
                          labelStyle:
                              FlutterFlowTheme.of(context).bodyMedium.override(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.normal,
                                  ),
                          alignLabelWithHint: true,
                          hintStyle: FlutterFlowTheme.of(context)
                              .bodyMedium
                              .override(
                                fontFamily: 'Montserrat',
                                color:
                                    FlutterFlowTheme.of(context).tertiaryText,
                                letterSpacing: 0.0,
                                fontWeight: FontWeight.normal,
                              ),
                          enabledBorder: OutlineInputBorder(
                            borderSide: BorderSide(
                              color: FlutterFlowTheme.of(context)
                                  .primaryBackground,
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
                          fillColor:
                              FlutterFlowTheme.of(context).primaryBackground,
                        ),
                        style: FlutterFlowTheme.of(context).bodyMedium.override(
                              fontFamily: 'Montserrat',
                              letterSpacing: 0.0,
                              fontWeight: FontWeight.normal,
                            ),
                        validator: _model.termTextControllerValidator
                            .asValidator(context),
                      ),
                    ),
                    TextFormField(
                      controller: _model.passSingleViewTextController,
                      focusNode: _model.passSingleViewFocusNode,
                      autofocus: false,
                      textCapitalization: TextCapitalization.none,
                      obscureText: false,
                      decoration: InputDecoration(
                        isDense: true,
                        labelText: FFLocalizations.of(context).getText(
                          '71n3l0hd' /* Пароль от терминала* */,
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
                            color:
                                FlutterFlowTheme.of(context).primaryBackground,
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
                        fillColor:
                            FlutterFlowTheme.of(context).primaryBackground,
                      ),
                      style: FlutterFlowTheme.of(context).bodyMedium.override(
                            fontFamily: 'Montserrat',
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.normal,
                          ),
                      validator: _model.passSingleViewTextControllerValidator
                          .asValidator(context),
                    ),
                    Align(
                      alignment: AlignmentDirectional(-1.0, 0.0),
                      child: Padding(
                        padding:
                            EdgeInsetsDirectional.fromSTEB(8.0, 0.0, 0.0, 0.0),
                        child: Text(
                          FFLocalizations.of(context).getText(
                            'ryvxdp3p' /* Пароль будет зашифрован и недо... */,
                          ),
                          style:
                              FlutterFlowTheme.of(context).bodyMedium.override(
                                    fontFamily: 'Montserrat',
                                    fontSize: 12.0,
                                    letterSpacing: 0.0,
                                  ),
                        ),
                      ),
                    ),
                  ].divide(SizedBox(height: 16.0)),
                ),
              ),
            ),
          ),
          Align(
            alignment: AlignmentDirectional(0.0, 0.0),
            child: FFButtonWidget(
              onPressed: !_model.nameAvailable!
                  ? null
                  : () async {
                      _model.formValidation = true;
                      if (_model.formKey.currentState == null ||
                          !_model.formKey.currentState!.validate()) {
                        safeSetState(() => _model.formValidation = false);
                        return;
                      }
                      _model.addMerchant = await MerchantsTable().insert({
                        'merchant_id': _model.termIDTextController.text,
                        'terminal_key': _model.termTextController.text,
                        'currency': 'rub',
                        'term_activity': _model.radioButtonValue,
                      });
                      if (_model.passSingleViewTextController.text != '') {}
                      await Future.delayed(const Duration(milliseconds: 500));
                      if (Scaffold.of(context).isDrawerOpen ||
                          Scaffold.of(context).isEndDrawerOpen) {
                        Navigator.pop(context);
                      }

                      safeSetState(() {});
                    },
              text: FFLocalizations.of(context).getText(
                '8uixioi0' /* Создать */,
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
                disabledColor: FlutterFlowTheme.of(context).alternate,
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
                  'qj3zavzs' /* Отмена */,
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
