import '/auth/supabase_auth/auth_util.dart';
import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_drop_down.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/flutter_flow/form_field_controller.dart';
import '/flutter_flow/custom_functions.dart' as functions;
import '/flutter_flow/random_data_util.dart' as random_data;
import 'package:easy_debounce/easy_debounce.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import 'package:just_audio/just_audio.dart';
import 'package:provider/provider.dart';
import 'promo_generator_model.dart';
export 'promo_generator_model.dart';

class PromoGeneratorWidget extends StatefulWidget {
  const PromoGeneratorWidget({
    super.key,
    int? radii,
    this.personalEmail,
  }) : this.radii = radii ?? 12;

  final int radii;
  final String? personalEmail;

  @override
  State<PromoGeneratorWidget> createState() => _PromoGeneratorWidgetState();
}

class _PromoGeneratorWidgetState extends State<PromoGeneratorWidget> {
  late PromoGeneratorModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => PromoGeneratorModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.isPercentage = false;
      _model.promocode = null;
      safeSetState(() {});
    });

    _model.usageQtyTextController ??= TextEditingController();
    _model.usageQtyFocusNode ??= FocusNode();

    _model.minPriceTextController ??= TextEditingController();
    _model.minPriceFocusNode ??= FocusNode();

    _model.maxPriceTextController ??= TextEditingController();
    _model.maxPriceFocusNode ??= FocusNode();

    _model.discountTextController ??= TextEditingController();
    _model.discountFocusNode ??= FocusNode();

    _model.textController5 ??= TextEditingController(
        text: valueOrDefault<String>(
      _model.promocode == null || _model.promocode == ''
          ? 'NO PROMO'
          : _model.promocode,
      'NO PROMO',
    ));
    _model.textFieldFocusNode ??= FocusNode();

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {
          _model.usageQtyTextController?.text =
              FFLocalizations.of(context).getText(
            'tdw7r20w' /* 1 */,
          );
          _model.minPriceTextController?.text =
              FFLocalizations.of(context).getText(
            '3ig3u9da' /* 3000 */,
          );
          _model.maxPriceTextController?.text =
              FFLocalizations.of(context).getText(
            'tgmleqon' /* 200000 */,
          );
          _model.discountTextController?.text =
              FFLocalizations.of(context).getText(
            'e3oh6p3a' /* 99 */,
          );
        }));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    context.watch<FFAppState>();

    return Container(
      width: MediaQuery.sizeOf(context).width * 1.0,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(12.0),
          bottomRight: Radius.circular(12.0),
          topLeft: Radius.circular(valueOrDefault<double>(
            widget.radii.toDouble(),
            0.0,
          )),
          topRight: Radius.circular(valueOrDefault<double>(
            widget.radii.toDouble(),
            0.0,
          )),
        ),
        border: Border.all(
          color: FlutterFlowTheme.of(context).grayAlpha,
        ),
      ),
      child: Padding(
        padding: EdgeInsetsDirectional.fromSTEB(12.0, 24.0, 12.0, 24.0),
        child: Column(
          mainAxisSize: MainAxisSize.max,
          children: [
            Align(
              alignment: AlignmentDirectional(0.0, 0.0),
              child: Row(
                mainAxisSize: MainAxisSize.max,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Padding(
                    padding: EdgeInsetsDirectional.fromSTEB(0.0, 2.0, 0.0, 0.0),
                    child: FlutterFlowDropDown<int>(
                      controller: _model.dropDownValueController ??=
                          FormFieldController<int>(
                        _model.dropDownValue ??= 1,
                      ),
                      options: List<int>.from([1, 7, 30, 365]),
                      optionLabels: [
                        FFLocalizations.of(context).getText(
                          '4ys6mpls' /* 24 ч */,
                        ),
                        FFLocalizations.of(context).getText(
                          'x2wf2l71' /* Неделя */,
                        ),
                        FFLocalizations.of(context).getText(
                          'nj0lnpru' /* Месяц */,
                        ),
                        FFLocalizations.of(context).getText(
                          'mp6lri3l' /* Год */,
                        )
                      ],
                      onChanged: (val) =>
                          safeSetState(() => _model.dropDownValue = val),
                      width: 140.0,
                      height: 44.0,
                      textStyle: FlutterFlowTheme.of(context)
                          .bodyMedium
                          .override(
                            fontFamily: 'Montserrat',
                            color: FlutterFlowTheme.of(context).tertiaryText,
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.normal,
                          ),
                      hintText: FFLocalizations.of(context).getText(
                        '4c01tjxw' /* Срок, дн */,
                      ),
                      icon: Icon(
                        Icons.keyboard_arrow_down_rounded,
                        color: FlutterFlowTheme.of(context).tertiaryText,
                        size: 22.0,
                      ),
                      fillColor: FlutterFlowTheme.of(context).primaryBackground,
                      elevation: 1.0,
                      borderColor: Colors.transparent,
                      borderWidth: 0.0,
                      borderRadius: 16.0,
                      margin:
                          EdgeInsetsDirectional.fromSTEB(16.0, 4.0, 16.0, 4.0),
                      hidesUnderline: true,
                      isOverButton: false,
                      isSearchable: false,
                      isMultiSelect: false,
                      labelText: FFLocalizations.of(context).getText(
                        '10753i12' /* Срок, дн */,
                      ),
                      labelTextStyle: FlutterFlowTheme.of(context)
                          .labelMedium
                          .override(
                            fontFamily: 'Montserrat',
                            color: FlutterFlowTheme.of(context).tertiaryText,
                            fontSize: 16.0,
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.w500,
                          ),
                    ),
                  ),
                  Flexible(
                    child: TextFormField(
                      controller: _model.usageQtyTextController,
                      focusNode: _model.usageQtyFocusNode,
                      autofocus: false,
                      textCapitalization: TextCapitalization.words,
                      obscureText: false,
                      decoration: InputDecoration(
                        isDense: true,
                        labelText: FFLocalizations.of(context).getText(
                          'og8tw153' /* Применений */,
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
                      keyboardType: TextInputType.number,
                      validator: _model.usageQtyTextControllerValidator
                          .asValidator(context),
                    ),
                  ),
                ].divide(SizedBox(width: 8.0)),
              ),
            ),
            Align(
              alignment: AlignmentDirectional(-1.0, 0.0),
              child: Padding(
                padding: EdgeInsetsDirectional.fromSTEB(16.0, 4.0, 0.0, 0.0),
                child: Text(
                  FFLocalizations.of(context).getText(
                    'syqxs424' /* Диапазон стоимости, к которой ... */,
                  ),
                  style: FlutterFlowTheme.of(context).labelMedium.override(
                        fontFamily: 'Montserrat',
                        color: FlutterFlowTheme.of(context).tertiaryText,
                        fontSize: 12.0,
                        letterSpacing: 0.0,
                        fontWeight: FontWeight.normal,
                      ),
                ),
              ),
            ),
            Align(
              alignment: AlignmentDirectional(0.0, 0.0),
              child: Row(
                mainAxisSize: MainAxisSize.max,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Flexible(
                    child: TextFormField(
                      controller: _model.minPriceTextController,
                      focusNode: _model.minPriceFocusNode,
                      autofocus: false,
                      textCapitalization: TextCapitalization.words,
                      obscureText: false,
                      decoration: InputDecoration(
                        isDense: true,
                        labelText: FFLocalizations.of(context).getText(
                          'e3hnfgv2' /* Минимум */,
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
                      keyboardType: TextInputType.number,
                      validator: _model.minPriceTextControllerValidator
                          .asValidator(context),
                    ),
                  ),
                  Expanded(
                    child: TextFormField(
                      controller: _model.maxPriceTextController,
                      focusNode: _model.maxPriceFocusNode,
                      autofocus: false,
                      textCapitalization: TextCapitalization.none,
                      textInputAction: TextInputAction.next,
                      obscureText: false,
                      decoration: InputDecoration(
                        isDense: true,
                        labelText: FFLocalizations.of(context).getText(
                          '4kbjiw0b' /* Максимум */,
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
                      keyboardType: TextInputType.number,
                      validator: _model.maxPriceTextControllerValidator
                          .asValidator(context),
                      inputFormatters: [
                        FilteringTextInputFormatter.allow(RegExp('[0-9]'))
                      ],
                    ),
                  ),
                ].divide(SizedBox(width: 8.0)),
              ),
            ),
            Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  flex: 2,
                  child: Stack(
                    alignment: AlignmentDirectional(1.0, 0.0),
                    children: [
                      TextFormField(
                        controller: _model.discountTextController,
                        focusNode: _model.discountFocusNode,
                        onChanged: (_) => EasyDebounce.debounce(
                          '_model.discountTextController',
                          Duration(milliseconds: 2000),
                          () async {
                            _model.discount = int.tryParse(
                                _model.discountTextController.text);
                            safeSetState(() {});
                          },
                        ),
                        autofocus: true,
                        textCapitalization: TextCapitalization.words,
                        obscureText: false,
                        decoration: InputDecoration(
                          isDense: true,
                          labelText: valueOrDefault<String>(
                            _model.isPercentage ? 'Скидка, %' : 'Скидка, ₽',
                            'Скидка, ₽',
                          ),
                          labelStyle: FlutterFlowTheme.of(context)
                              .bodyMedium
                              .override(
                                fontFamily: 'Montserrat',
                                color:
                                    FlutterFlowTheme.of(context).tertiaryText,
                                letterSpacing: 0.0,
                                fontWeight: FontWeight.w600,
                              ),
                          alignLabelWithHint: false,
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
                        maxLength: _model.isPercentage ? 2 : 6,
                        maxLengthEnforcement: MaxLengthEnforcement.enforced,
                        buildCounter: (context,
                                {required currentLength,
                                required isFocused,
                                maxLength}) =>
                            null,
                        keyboardType: TextInputType.number,
                        validator: _model.discountTextControllerValidator
                            .asValidator(context),
                        inputFormatters: [
                          FilteringTextInputFormatter.allow(RegExp('[0-9]'))
                        ],
                      ),
                      InkWell(
                        splashColor: Colors.transparent,
                        focusColor: Colors.transparent,
                        hoverColor: Colors.transparent,
                        highlightColor: Colors.transparent,
                        onTap: () async {
                          if (_model.isPercentage) {
                            _model.isPercentage = false;
                            safeSetState(() {});
                          } else {
                            _model.isPercentage = true;
                            safeSetState(() {});
                          }
                        },
                        child: Container(
                          width: 36.0,
                          height: 36.0,
                          decoration: BoxDecoration(
                            color: FlutterFlowTheme.of(context).accent4,
                            borderRadius: BorderRadius.circular(10.0),
                          ),
                          child: Builder(
                            builder: (context) {
                              if (_model.isPercentage) {
                                return Icon(
                                  Icons.percent,
                                  color: FlutterFlowTheme.of(context)
                                      .secondaryText,
                                  size: 22.0,
                                );
                              } else {
                                return Icon(
                                  Icons.currency_ruble_outlined,
                                  color: FlutterFlowTheme.of(context)
                                      .secondaryText,
                                  size: 22.0,
                                );
                              }
                            },
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  flex: 1,
                  child: Align(
                    alignment: AlignmentDirectional(1.0, 0.0),
                    child: FFButtonWidget(
                      onPressed: ((_model.discount == null) ||
                              ((_model.isPercentage == true) &&
                                  (_model.discount! > 99)))
                          ? null
                          : () async {
                              // cenerate code
                              _model.promocode = valueOrDefault<String>(
                                '${valueOrDefault<String>(
                                  FFAppState().franchisee.toString(),
                                  '0',
                                )}${random_data.randomString(
                                  1,
                                  1,
                                  false,
                                  true,
                                  false,
                                )}${random_data.randomInteger(0, 9).toString()}${random_data.randomString(
                                  2,
                                  2,
                                  false,
                                  true,
                                  false,
                                )}${_model.discountTextController.text}',
                                'PROMO0',
                              );
                              safeSetState(() {});
                              _model.createPromocode =
                                  await PromoCodesTable().insert({
                                'promocode': _model.promocode,
                                'discount_amount': int.tryParse(
                                    _model.discountTextController.text),
                                'usage_qty': _model.times,
                                'used_qty': 0,
                                'valid_before': supaSerialize<DateTime>(
                                    functions.endDataClientPromocode(
                                        _model.dropDownValue!)),
                                'is_valid': true,
                                'created_by': currentUserEmail,
                                'area': FFAppState().franchisee,
                                'is_percentage': _model.isPercentage,
                                'min_price_value': int.tryParse(
                                    _model.minPriceTextController.text),
                                'max_price_value': int.tryParse(
                                    _model.maxPriceTextController.text),
                                'user_mail': widget.personalEmail != null &&
                                        widget.personalEmail != ''
                                    ? widget.personalEmail
                                    : 'null',
                              });
                              safeSetState(() {
                                _model.textController5?.text =
                                    _model.promocode!;
                              });

                              _model.updatePage(() {});

                              safeSetState(() {});
                            },
                      text: FFLocalizations.of(context).getText(
                        '2195fdn1' /* Создать */,
                      ),
                      options: FFButtonOptions(
                        width: 96.0,
                        height: 44.0,
                        padding:
                            EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 0.0),
                        iconPadding:
                            EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 0.0),
                        color: FlutterFlowTheme.of(context).primary,
                        textStyle:
                            FlutterFlowTheme.of(context).labelLarge.override(
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
                ),
              ].divide(SizedBox(width: 8.0)),
            ),
            Row(
              mainAxisSize: MainAxisSize.max,
              children: [
                Expanded(
                  child: Align(
                    alignment: AlignmentDirectional(1.0, 0.0),
                    child: Padding(
                      padding:
                          EdgeInsetsDirectional.fromSTEB(0.0, 8.0, 0.0, 0.0),
                      child: Stack(
                        alignment: AlignmentDirectional(1.0, 0.0),
                        children: [
                          TextFormField(
                            controller: _model.textController5,
                            focusNode: _model.textFieldFocusNode,
                            autofocus: false,
                            textCapitalization: TextCapitalization.words,
                            readOnly: true,
                            obscureText: false,
                            decoration: InputDecoration(
                              isDense: true,
                              labelText: FFLocalizations.of(context).getText(
                                'f77jdvlp' /* Промокод: */,
                              ),
                              labelStyle: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    fontFamily: 'Montserrat',
                                    color:
                                        FlutterFlowTheme.of(context).secondary,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.w600,
                                  ),
                              alignLabelWithHint: false,
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
                                  color: FlutterFlowTheme.of(context).accent1,
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
                              fillColor: FlutterFlowTheme.of(context).promo,
                            ),
                            style: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  color: FlutterFlowTheme.of(context).primary,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.normal,
                                ),
                            validator: _model.textController5Validator
                                .asValidator(context),
                          ),
                          Align(
                            alignment: AlignmentDirectional(1.0, 0.0),
                            child: Padding(
                              padding: EdgeInsetsDirectional.fromSTEB(
                                  0.0, 0.0, 16.0, 0.0),
                              child: Builder(
                                builder: (context) {
                                  if (!_model.isCopied) {
                                    return Visibility(
                                      visible: _model.promocode != null &&
                                          _model.promocode != '',
                                      child: InkWell(
                                        splashColor: Colors.transparent,
                                        focusColor: Colors.transparent,
                                        hoverColor: Colors.transparent,
                                        highlightColor: Colors.transparent,
                                        onTap: () async {
                                          await Future.wait([
                                            Future(() async {
                                              HapticFeedback.lightImpact();
                                            }),
                                            Future(() async {
                                              _model.soundPlayer ??=
                                                  AudioPlayer();
                                              if (_model.soundPlayer!.playing) {
                                                await _model.soundPlayer!
                                                    .stop();
                                              }
                                              _model.soundPlayer!
                                                  .setVolume(0.59);
                                              _model.soundPlayer!
                                                  .setAsset(
                                                      'assets/audios/Tick-DeepFrozenApps-397275646.mp3')
                                                  .then((_) => _model
                                                      .soundPlayer!
                                                      .play());
                                            }),
                                            Future(() async {
                                              await Clipboard.setData(
                                                  ClipboardData(
                                                      text: _model
                                                          .textController5
                                                          .text));
                                            }),
                                          ]);
                                          _model.isCopied = true;
                                          safeSetState(() {});
                                          await Future.delayed(const Duration(
                                              milliseconds: 4000));
                                          _model.isCopied = false;
                                          safeSetState(() {});
                                        },
                                        child: Icon(
                                          Icons.content_copy,
                                          color: FlutterFlowTheme.of(context)
                                              .primary,
                                          size: 24.0,
                                        ),
                                      ),
                                    );
                                  } else {
                                    return Icon(
                                      Icons.check_rounded,
                                      color: FlutterFlowTheme.of(context)
                                          .secondary,
                                      size: 24.0,
                                    );
                                  }
                                },
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ].divide(SizedBox(width: 8.0)),
            ),
          ].divide(SizedBox(height: 12.0)),
        ),
      ),
    );
  }
}
