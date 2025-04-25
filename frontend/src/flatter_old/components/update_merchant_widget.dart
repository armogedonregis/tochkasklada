import '/backend/supabase/supabase.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_radio_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/flutter_flow/form_field_controller.dart';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'update_merchant_model.dart';
export 'update_merchant_model.dart';

class UpdateMerchantWidget extends StatefulWidget {
  const UpdateMerchantWidget({
    super.key,
    this.merchantID,
  });

  final String? merchantID;

  @override
  State<UpdateMerchantWidget> createState() => _UpdateMerchantWidgetState();
}

class _UpdateMerchantWidgetState extends State<UpdateMerchantWidget> {
  late UpdateMerchantModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => UpdateMerchantModel());

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
      child: FutureBuilder<List<MerchantsRow>>(
        future: MerchantsTable().querySingleRow(
          queryFn: (q) => q.eqOrNull(
            'merchant_id',
            widget.merchantID,
          ),
        ),
        builder: (context, snapshot) {
          // Customize what your widget looks like when it's loading.
          if (!snapshot.hasData) {
            return Center(
              child: SizedBox(
                width: 50.0,
                height: 50.0,
                child: SpinKitWanderingCubes(
                  color: FlutterFlowTheme.of(context).primary,
                  size: 50.0,
                ),
              ),
            );
          }
          List<MerchantsRow> columnMerchantsRowList = snapshot.data!;

          final columnMerchantsRow = columnMerchantsRowList.isNotEmpty
              ? columnMerchantsRowList.first
              : null;

          return Column(
            mainAxisSize: MainAxisSize.max,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Align(
                alignment: AlignmentDirectional(-1.0, 0.0),
                child: wrapWithModel(
                  model: _model.tittleWithIconAndSubtittleModel,
                  updateCallback: () => safeSetState(() {}),
                  child: TittleWithIconAndSubtittleWidget(
                    tittle: widget.merchantID!,
                    subtittle:
                        'Изменения возможны долько для терминалов, которые не находятся в статусе \"Рабочий\"',
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
                          alignment: AlignmentDirectional(-1.0, 0.0),
                          child: Text(
                            FFLocalizations.of(context).getText(
                              'rz9qk5u8' /* Тип терминала: */,
                            ),
                            style: FlutterFlowTheme.of(context)
                                .titleSmall
                                .override(
                                  fontFamily: 'Montserrat',
                                  color:
                                      FlutterFlowTheme.of(context).primaryText,
                                  letterSpacing: 0.0,
                                ),
                          ),
                        ),
                        Align(
                          alignment: AlignmentDirectional(-1.0, 0.0),
                          child: Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(
                                0.0, 0.0, 0.0, 8.0),
                            child: FlutterFlowRadioButton(
                              options: [
                                FFLocalizations.of(context).getText(
                                  '4477xq26' /* Тестовый */,
                                ),
                                FFLocalizations.of(context).getText(
                                  'qwd9bg2j' /* Рабочий */,
                                ),
                                FFLocalizations.of(context).getText(
                                  'evzblaw0' /* Неактивный */,
                                )
                              ].toList(),
                              onChanged: (val) => safeSetState(() {}),
                              controller: _model.radioButtonValueController ??=
                                  FormFieldController<String>(
                                      columnMerchantsRow!.termActivity!),
                              optionHeight: 32.0,
                              textStyle: FlutterFlowTheme.of(context)
                                  .labelMedium
                                  .override(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 0.0,
                                  ),
                              selectedTextStyle: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
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
                          padding: EdgeInsetsDirectional.fromSTEB(
                              0.0, 0.0, 0.0, 8.0),
                          child: TextFormField(
                            controller: _model.termTextController ??=
                                TextEditingController(
                              text: columnMerchantsRow?.terminalKey,
                            ),
                            focusNode: _model.termFocusNode,
                            autofocus: false,
                            textCapitalization: TextCapitalization.words,
                            obscureText: false,
                            decoration: InputDecoration(
                              isDense: true,
                              labelText: FFLocalizations.of(context).getText(
                                'ltrt5wic' /* Ключ терминала* */,
                              ),
                              labelStyle: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.normal,
                                  ),
                              alignLabelWithHint: true,
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
                              'a5erpj12' /* Пароль от терминала* */,
                            ),
                            alignLabelWithHint: false,
                            hintText: valueOrDefault<String>(
                              columnMerchantsRow?.aesPass != null &&
                                      columnMerchantsRow?.aesPass != ''
                                  ? 'Создан и зашифрован'
                                  : 'Не установлен',
                              'Не установлен',
                            ),
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
                          style:
                              FlutterFlowTheme.of(context).bodyMedium.override(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.normal,
                                  ),
                          maxLength: 20,
                          maxLengthEnforcement: MaxLengthEnforcement.none,
                          buildCounter: (context,
                                  {required currentLength,
                                  required isFocused,
                                  maxLength}) =>
                              null,
                          validator: _model
                              .passSingleViewTextControllerValidator
                              .asValidator(context),
                        ),
                        if (columnMerchantsRow?.aesPass == null ||
                            columnMerchantsRow?.aesPass == '')
                          Align(
                            alignment: AlignmentDirectional(-1.0, 0.0),
                            child: Padding(
                              padding: EdgeInsetsDirectional.fromSTEB(
                                  8.0, 0.0, 0.0, 0.0),
                              child: Text(
                                FFLocalizations.of(context).getText(
                                  'agwoa9uf' /* Пароль будет зашифрован и недо... */,
                                ),
                                style: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .override(
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
                  onPressed: ((columnMerchantsRow?.termActivity == 'Рабочий') &&
                          (columnMerchantsRow?.aesPass != null &&
                              columnMerchantsRow?.aesPass != ''))
                      ? null
                      : () async {
                          if ((columnMerchantsRow?.termActivity == 'Рабочий') &&
                              (columnMerchantsRow?.aesPass != null &&
                                  columnMerchantsRow?.aesPass != '')) {
                            // Если действующий
                            ScaffoldMessenger.of(context).clearSnackBars();
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(
                                  'Терминал в рабочем режиме. Если необходимо что-то поменять - создайте новый и прикрепите к нужным франшизам',
                                  style: FlutterFlowTheme.of(context)
                                      .bodySmall
                                      .override(
                                        fontFamily: 'Montserrat',
                                        color: FlutterFlowTheme.of(context)
                                            .primaryText,
                                        letterSpacing: 0.0,
                                      ),
                                ),
                                duration: Duration(milliseconds: 4000),
                                backgroundColor:
                                    FlutterFlowTheme.of(context).warning,
                              ),
                            );
                          } else {
                            // Валидация измененных данных
                            _model.formValidation = true;
                            if (_model.formKey.currentState == null ||
                                !_model.formKey.currentState!.validate()) {
                              safeSetState(() => _model.formValidation = false);
                              return;
                            }
                            unawaited(
                              () async {
                                _model.editMerchantData =
                                    await MerchantsTable().update(
                                  data: {
                                    'terminal_key':
                                        _model.termTextController.text,
                                    'term_activity': _model.radioButtonValue,
                                  },
                                  matchingRows: (rows) => rows.eqOrNull(
                                    'merchant_id',
                                    widget.merchantID,
                                  ),
                                  returnRows: true,
                                );
                              }(),
                            );
                            if (_model.passSingleViewTextController.text !=
                                    '') {}
                            await Future.delayed(
                                const Duration(milliseconds: 500));
                            if (Scaffold.of(context).isDrawerOpen ||
                                Scaffold.of(context).isEndDrawerOpen) {
                              Navigator.pop(context);
                            }
                          }

                          safeSetState(() {
                            _model.termTextController?.text =
                                columnMerchantsRow!.terminalKey!;

                            _model.passSingleViewTextController?.clear();
                          });

                          safeSetState(() {});
                        },
                  text: FFLocalizations.of(context).getText(
                    '0s1iyjmj' /* Сохранить */,
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
                      safeSetState(() {
                        _model.termTextController?.text =
                            columnMerchantsRow!.terminalKey!;

                        _model.passSingleViewTextController?.clear();
                      });
                    },
                    text: FFLocalizations.of(context).getText(
                      'e8zwlabj' /* Отмена */,
                    ),
                    options: FFButtonOptions(
                      width: double.infinity,
                      height: 44.0,
                      padding:
                          EdgeInsetsDirectional.fromSTEB(16.0, 4.0, 16.0, 4.0),
                      iconPadding:
                          EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 0.0),
                      color: Colors.transparent,
                      textStyle: FlutterFlowTheme.of(context)
                          .bodyLarge
                          .override(
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
          );
        },
      ),
    );
  }
}
