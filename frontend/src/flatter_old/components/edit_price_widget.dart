import '/auth/supabase_auth/auth_util.dart';
import '/backend/supabase/supabase.dart';
import '/components/attent_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/custom_code/widgets/index.dart' as custom_widgets;
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'edit_price_model.dart';
export 'edit_price_model.dart';

class EditPriceWidget extends StatefulWidget {
  const EditPriceWidget({
    super.key,
    int? tierID,
  }) : this.tierID = tierID ?? 1;

  final int tierID;

  @override
  State<EditPriceWidget> createState() => _EditPriceWidgetState();
}

class _EditPriceWidgetState extends State<EditPriceWidget>
    with TickerProviderStateMixin {
  late EditPriceModel _model;

  final animationsMap = <String, AnimationInfo>{};

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => EditPriceModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.isShimmering = true;
      safeSetState(() {});
      _model.areaPriceQuery = await AreaPricesTable().queryRows(
        queryFn: (q) => q.eqOrNull(
          'price_id',
          widget.tierID,
        ),
      );
      if (_model.areaPriceQuery?.firstOrNull?.createdBy == currentUserEmail) {
        _model.isEditable = true;
        safeSetState(() {});
      } else {
        _model.isEditable = false;
        safeSetState(() {});
      }

      await Future.delayed(const Duration(milliseconds: 400));
      _model.isShimmering = false;
      safeSetState(() {});
      if (animationsMap['formOnActionTriggerAnimation'] != null) {
        await animationsMap['formOnActionTriggerAnimation']!
            .controller
            .forward(from: 0.0);
      }
    });

    _model.mMonthTextController ??= TextEditingController(
        text: valueOrDefault<String>(
      _model.areaPriceQuery?.firstOrNull?.mPriceMonth?.toString(),
      '10990',
    ));
    _model.mMonthFocusNode ??= FocusNode();

    _model.mDayTextController ??= TextEditingController(
        text: valueOrDefault<String>(
      _model.areaPriceQuery?.firstOrNull?.mPriceDay?.toString(),
      '600',
    ));
    _model.mDayFocusNode ??= FocusNode();

    _model.sMonthTextController ??= TextEditingController(
        text: valueOrDefault<String>(
      _model.areaPriceQuery?.firstOrNull?.sPriceMonth?.toString(),
      '5990',
    ));
    _model.sMonthFocusNode ??= FocusNode();

    _model.sDayTextController ??= TextEditingController(
        text: valueOrDefault<String>(
      _model.areaPriceQuery?.firstOrNull?.sPriceMonth?.toString(),
      '400',
    ));
    _model.sDayFocusNode ??= FocusNode();

    _model.xsMonthTextController ??= TextEditingController(
        text: valueOrDefault<String>(
      _model.areaPriceQuery?.firstOrNull?.xsPriceMonth?.toString(),
      '3990',
    ));
    _model.xsMonthFocusNode ??= FocusNode();

    _model.xsDayTextController ??= TextEditingController(
        text: valueOrDefault<String>(
      _model.areaPriceQuery?.firstOrNull?.xsPriceDay?.toString(),
      '200',
    ));
    _model.xsDayFocusNode ??= FocusNode();

    _model.yearCtTextController ??= TextEditingController(
        text: valueOrDefault<String>(
      _model.areaPriceQuery?.firstOrNull?.yearCoeficient?.toString(),
      '10',
    ));
    _model.yearCtFocusNode ??= FocusNode();

    animationsMap.addAll({
      'formOnActionTriggerAnimation': AnimationInfo(
        trigger: AnimationTrigger.onActionTrigger,
        applyInitialState: true,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.easeInOut,
            delay: 340.0.ms,
            duration: 600.0.ms,
            begin: 0.0,
            end: 1.0,
          ),
        ],
      ),
    });
    setupAnimations(
      animationsMap.values.where((anim) =>
          anim.trigger == AnimationTrigger.onActionTrigger ||
          !anim.applyInitialState),
      this,
    );

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: FlutterFlowTheme.of(context).secondaryBackground,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Align(
            alignment: AlignmentDirectional(-1.0, 0.0),
            child: Padding(
              padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 0.0),
              child: wrapWithModel(
                model: _model.tittleWithIconAndSubtittleModel,
                updateCallback: () => safeSetState(() {}),
                updateOnChange: true,
                child: TittleWithIconAndSubtittleWidget(
                  tittle: 'Редактировать цены',
                  subtittle:
                      'Внимание, отредактированные цены применятся сразу к свзанным локациям',
                  hasIcon: false,
                  hasSubtittle: true,
                ),
              ),
            ),
          ),
          Padding(
            padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 24.0, 0.0),
            child: Column(
              mainAxisSize: MainAxisSize.max,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  constraints: BoxConstraints(
                    maxHeight: 96.0,
                  ),
                  decoration: BoxDecoration(),
                  child: wrapWithModel(
                    model: _model.attentModel,
                    updateCallback: () => safeSetState(() {}),
                    updateOnChange: true,
                    child: AttentWidget(
                      text: valueOrDefault<String>(
                        _model.isEditable
                            ? valueOrDefault<String>(
                                FFLocalizations.of(context).getVariableText(
                                  ruText:
                                      'При изменении цен, не забудьте уведомить клиентов',
                                  enText:
                                      'When changing prices, be sure to notify your customers',
                                ),
                                'При изменении цен, не забудьте уведомить клиентов',
                              )
                            : valueOrDefault<String>(
                                FFLocalizations.of(context).getVariableText(
                                  ruText:
                                      'Редактировать эти цены может только создатель',
                                  enText:
                                      'Only the creator can edit these prices',
                                ),
                                'Редактировать эти цены может только создатель',
                              ),
                        'Редактировать эти цены может только создатель',
                      ),
                    ),
                  ),
                ),
                Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(0.0, 48.0, 0.0, 36.0),
                  child: Form(
                    key: _model.formKey,
                    autovalidateMode: AutovalidateMode.disabled,
                    child: Builder(
                      builder: (context) {
                        if (!_model.isShimmering) {
                          return Column(
                            mainAxisSize: MainAxisSize.max,
                            children: [
                              Align(
                                alignment: AlignmentDirectional(-1.0, 0.0),
                                child: Padding(
                                  padding: EdgeInsetsDirectional.fromSTEB(
                                      16.0, 4.0, 0.0, 0.0),
                                  child: Text(
                                    FFLocalizations.of(context).getText(
                                      '46id1r14' /* Цены на ячейки М, ₽: */,
                                    ),
                                    style: FlutterFlowTheme.of(context)
                                        .labelMedium
                                        .override(
                                          fontFamily: 'Montserrat',
                                          fontSize: 14.0,
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
                                        controller: _model.mMonthTextController,
                                        focusNode: _model.mMonthFocusNode,
                                        autofocus: false,
                                        textCapitalization:
                                            TextCapitalization.words,
                                        readOnly: !_model.isEditable,
                                        obscureText: false,
                                        decoration: InputDecoration(
                                          isDense: true,
                                          labelText: FFLocalizations.of(context)
                                              .getText(
                                            '2v0omxux' /* Месяц */,
                                          ),
                                          labelStyle: FlutterFlowTheme.of(
                                                  context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Montserrat',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .tertiaryText,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.w600,
                                              ),
                                          alignLabelWithHint: false,
                                          hintStyle: FlutterFlowTheme.of(
                                                  context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Montserrat',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .tertiaryText,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.normal,
                                              ),
                                          enabledBorder: OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .primaryBackground,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          focusedBorder: OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .grayAlpha,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          errorBorder: OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .error,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          focusedErrorBorder:
                                              OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .error,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          filled: true,
                                          fillColor:
                                              FlutterFlowTheme.of(context)
                                                  .primaryBackground,
                                        ),
                                        style: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Montserrat',
                                              letterSpacing: 0.0,
                                              fontWeight: FontWeight.normal,
                                            ),
                                        keyboardType: TextInputType.number,
                                        validator: _model
                                            .mMonthTextControllerValidator
                                            .asValidator(context),
                                      ),
                                    ),
                                    Expanded(
                                      child: TextFormField(
                                        controller: _model.mDayTextController,
                                        focusNode: _model.mDayFocusNode,
                                        autofocus: false,
                                        textCapitalization:
                                            TextCapitalization.none,
                                        textInputAction: TextInputAction.next,
                                        readOnly: !_model.isEditable,
                                        obscureText: false,
                                        decoration: InputDecoration(
                                          isDense: true,
                                          labelText: FFLocalizations.of(context)
                                              .getText(
                                            'll6rzwj8' /* День */,
                                          ),
                                          labelStyle: FlutterFlowTheme.of(
                                                  context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Montserrat',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .tertiaryText,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.w600,
                                              ),
                                          alignLabelWithHint: false,
                                          hintStyle: FlutterFlowTheme.of(
                                                  context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Montserrat',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .tertiaryText,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.normal,
                                              ),
                                          enabledBorder: OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .primaryBackground,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          focusedBorder: OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .grayAlpha,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          errorBorder: OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .error,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          focusedErrorBorder:
                                              OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .error,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          filled: true,
                                          fillColor:
                                              FlutterFlowTheme.of(context)
                                                  .primaryBackground,
                                        ),
                                        style: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Montserrat',
                                              letterSpacing: 0.0,
                                              fontWeight: FontWeight.normal,
                                            ),
                                        keyboardType: TextInputType.number,
                                        validator: _model
                                            .mDayTextControllerValidator
                                            .asValidator(context),
                                        inputFormatters: [
                                          FilteringTextInputFormatter.allow(
                                              RegExp('[0-9]'))
                                        ],
                                      ),
                                    ),
                                  ].divide(SizedBox(width: 8.0)),
                                ),
                              ),
                              Align(
                                alignment: AlignmentDirectional(-1.0, 0.0),
                                child: Padding(
                                  padding: EdgeInsetsDirectional.fromSTEB(
                                      16.0, 4.0, 0.0, 0.0),
                                  child: Text(
                                    FFLocalizations.of(context).getText(
                                      'a9f9hl85' /* Цены на ячейки S, ₽: */,
                                    ),
                                    style: FlutterFlowTheme.of(context)
                                        .labelMedium
                                        .override(
                                          fontFamily: 'Montserrat',
                                          fontSize: 14.0,
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
                                        controller: _model.sMonthTextController,
                                        focusNode: _model.sMonthFocusNode,
                                        autofocus: false,
                                        textCapitalization:
                                            TextCapitalization.words,
                                        readOnly: !_model.isEditable,
                                        obscureText: false,
                                        decoration: InputDecoration(
                                          isDense: true,
                                          labelText: FFLocalizations.of(context)
                                              .getText(
                                            'xlbqspjh' /* Месяц */,
                                          ),
                                          labelStyle: FlutterFlowTheme.of(
                                                  context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Montserrat',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .tertiaryText,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.w600,
                                              ),
                                          alignLabelWithHint: false,
                                          hintStyle: FlutterFlowTheme.of(
                                                  context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Montserrat',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .tertiaryText,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.normal,
                                              ),
                                          enabledBorder: OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .primaryBackground,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          focusedBorder: OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .grayAlpha,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          errorBorder: OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .error,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          focusedErrorBorder:
                                              OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .error,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          filled: true,
                                          fillColor:
                                              FlutterFlowTheme.of(context)
                                                  .primaryBackground,
                                        ),
                                        style: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Montserrat',
                                              letterSpacing: 0.0,
                                              fontWeight: FontWeight.normal,
                                            ),
                                        keyboardType: TextInputType.number,
                                        validator: _model
                                            .sMonthTextControllerValidator
                                            .asValidator(context),
                                      ),
                                    ),
                                    Expanded(
                                      child: TextFormField(
                                        controller: _model.sDayTextController,
                                        focusNode: _model.sDayFocusNode,
                                        autofocus: false,
                                        textCapitalization:
                                            TextCapitalization.none,
                                        textInputAction: TextInputAction.next,
                                        readOnly: !_model.isEditable,
                                        obscureText: false,
                                        decoration: InputDecoration(
                                          isDense: true,
                                          labelText: FFLocalizations.of(context)
                                              .getText(
                                            '25tzy6l8' /* День */,
                                          ),
                                          labelStyle: FlutterFlowTheme.of(
                                                  context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Montserrat',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .tertiaryText,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.w600,
                                              ),
                                          alignLabelWithHint: false,
                                          hintStyle: FlutterFlowTheme.of(
                                                  context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Montserrat',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .tertiaryText,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.normal,
                                              ),
                                          enabledBorder: OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .primaryBackground,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          focusedBorder: OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .grayAlpha,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          errorBorder: OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .error,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          focusedErrorBorder:
                                              OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .error,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          filled: true,
                                          fillColor:
                                              FlutterFlowTheme.of(context)
                                                  .primaryBackground,
                                        ),
                                        style: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Montserrat',
                                              letterSpacing: 0.0,
                                              fontWeight: FontWeight.normal,
                                            ),
                                        keyboardType: TextInputType.number,
                                        validator: _model
                                            .sDayTextControllerValidator
                                            .asValidator(context),
                                        inputFormatters: [
                                          FilteringTextInputFormatter.allow(
                                              RegExp('[0-9]'))
                                        ],
                                      ),
                                    ),
                                  ].divide(SizedBox(width: 8.0)),
                                ),
                              ),
                              Align(
                                alignment: AlignmentDirectional(-1.0, 0.0),
                                child: Padding(
                                  padding: EdgeInsetsDirectional.fromSTEB(
                                      16.0, 4.0, 0.0, 0.0),
                                  child: Text(
                                    FFLocalizations.of(context).getText(
                                      'r0jr7eym' /* Цены на ячейки XS, ₽: */,
                                    ),
                                    style: FlutterFlowTheme.of(context)
                                        .labelMedium
                                        .override(
                                          fontFamily: 'Montserrat',
                                          fontSize: 14.0,
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
                                        controller:
                                            _model.xsMonthTextController,
                                        focusNode: _model.xsMonthFocusNode,
                                        autofocus: false,
                                        textCapitalization:
                                            TextCapitalization.words,
                                        readOnly: !_model.isEditable,
                                        obscureText: false,
                                        decoration: InputDecoration(
                                          isDense: true,
                                          labelText: FFLocalizations.of(context)
                                              .getText(
                                            'gchrqlgl' /* Месяц */,
                                          ),
                                          labelStyle: FlutterFlowTheme.of(
                                                  context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Montserrat',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .tertiaryText,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.w600,
                                              ),
                                          alignLabelWithHint: false,
                                          hintStyle: FlutterFlowTheme.of(
                                                  context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Montserrat',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .tertiaryText,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.normal,
                                              ),
                                          enabledBorder: OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .primaryBackground,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          focusedBorder: OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .grayAlpha,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          errorBorder: OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .error,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          focusedErrorBorder:
                                              OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .error,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          filled: true,
                                          fillColor:
                                              FlutterFlowTheme.of(context)
                                                  .primaryBackground,
                                        ),
                                        style: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Montserrat',
                                              letterSpacing: 0.0,
                                              fontWeight: FontWeight.normal,
                                            ),
                                        keyboardType: TextInputType.number,
                                        validator: _model
                                            .xsMonthTextControllerValidator
                                            .asValidator(context),
                                      ),
                                    ),
                                    Expanded(
                                      child: TextFormField(
                                        controller: _model.xsDayTextController,
                                        focusNode: _model.xsDayFocusNode,
                                        autofocus: false,
                                        textCapitalization:
                                            TextCapitalization.none,
                                        textInputAction: TextInputAction.next,
                                        readOnly: !_model.isEditable,
                                        obscureText: false,
                                        decoration: InputDecoration(
                                          isDense: true,
                                          labelText: FFLocalizations.of(context)
                                              .getText(
                                            '7pqhysrk' /* День */,
                                          ),
                                          labelStyle: FlutterFlowTheme.of(
                                                  context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Montserrat',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .tertiaryText,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.w600,
                                              ),
                                          alignLabelWithHint: false,
                                          hintStyle: FlutterFlowTheme.of(
                                                  context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Montserrat',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .tertiaryText,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.normal,
                                              ),
                                          enabledBorder: OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .primaryBackground,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          focusedBorder: OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .grayAlpha,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          errorBorder: OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .error,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          focusedErrorBorder:
                                              OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .error,
                                              width: 2.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(16.0),
                                          ),
                                          filled: true,
                                          fillColor:
                                              FlutterFlowTheme.of(context)
                                                  .primaryBackground,
                                        ),
                                        style: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Montserrat',
                                              letterSpacing: 0.0,
                                              fontWeight: FontWeight.normal,
                                            ),
                                        keyboardType: TextInputType.number,
                                        validator: _model
                                            .xsDayTextControllerValidator
                                            .asValidator(context),
                                        inputFormatters: [
                                          FilteringTextInputFormatter.allow(
                                              RegExp('[0-9]'))
                                        ],
                                      ),
                                    ),
                                  ].divide(SizedBox(width: 8.0)),
                                ),
                              ),
                              Padding(
                                padding: EdgeInsetsDirectional.fromSTEB(
                                    0.0, 24.0, 0.0, 0.0),
                                child: Container(
                                  decoration: BoxDecoration(),
                                  child: TextFormField(
                                    controller: _model.yearCtTextController,
                                    focusNode: _model.yearCtFocusNode,
                                    autofocus: false,
                                    textCapitalization: TextCapitalization.none,
                                    textInputAction: TextInputAction.next,
                                    readOnly: !_model.isEditable,
                                    obscureText: false,
                                    decoration: InputDecoration(
                                      isDense: true,
                                      labelText:
                                          FFLocalizations.of(context).getText(
                                        'r7jjd2m6' /* Годовая цена (в отношении цены... */,
                                      ),
                                      labelStyle: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .override(
                                            fontFamily: 'Montserrat',
                                            color: FlutterFlowTheme.of(context)
                                                .tertiaryText,
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
                                          color: FlutterFlowTheme.of(context)
                                              .primaryBackground,
                                          width: 2.0,
                                        ),
                                        borderRadius:
                                            BorderRadius.circular(16.0),
                                      ),
                                      focusedBorder: OutlineInputBorder(
                                        borderSide: BorderSide(
                                          color: FlutterFlowTheme.of(context)
                                              .grayAlpha,
                                          width: 2.0,
                                        ),
                                        borderRadius:
                                            BorderRadius.circular(16.0),
                                      ),
                                      errorBorder: OutlineInputBorder(
                                        borderSide: BorderSide(
                                          color: FlutterFlowTheme.of(context)
                                              .error,
                                          width: 2.0,
                                        ),
                                        borderRadius:
                                            BorderRadius.circular(16.0),
                                      ),
                                      focusedErrorBorder: OutlineInputBorder(
                                        borderSide: BorderSide(
                                          color: FlutterFlowTheme.of(context)
                                              .error,
                                          width: 2.0,
                                        ),
                                        borderRadius:
                                            BorderRadius.circular(16.0),
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
                                    keyboardType: TextInputType.number,
                                    validator: _model
                                        .yearCtTextControllerValidator
                                        .asValidator(context),
                                    inputFormatters: [
                                      FilteringTextInputFormatter.allow(
                                          RegExp('[0-9]'))
                                    ],
                                  ),
                                ),
                              ),
                            ].divide(SizedBox(height: 12.0)),
                          );
                        } else {
                          return Container(
                            width: MediaQuery.sizeOf(context).width * 1.0,
                            height: MediaQuery.sizeOf(context).height * 0.4,
                            child: custom_widgets.DrawlerAdressShimmer(
                              width: MediaQuery.sizeOf(context).width * 1.0,
                              height: MediaQuery.sizeOf(context).height * 0.4,
                              borderRadius: 16.0,
                            ),
                          );
                        }
                      },
                    ),
                  ).animateOnActionTrigger(
                    animationsMap['formOnActionTriggerAnimation']!,
                  ),
                ),
                Align(
                  alignment: AlignmentDirectional(0.0, 0.0),
                  child: FFButtonWidget(
                    onPressed: !_model.isEditable
                        ? null
                        : () async {
                            _model.updatePrices =
                                await AreaPricesTable().update(
                              data: {
                                'm_price_month': int.tryParse(
                                    _model.mMonthTextController.text),
                                'm_price_day': int.tryParse(
                                    _model.mDayTextController.text),
                                's_price_month': int.tryParse(
                                    _model.sMonthTextController.text),
                                's_price_day': int.tryParse(
                                    _model.sDayTextController.text),
                                'xs_price_month': int.tryParse(
                                    _model.xsMonthTextController.text),
                                'xs_price_day': int.tryParse(
                                    _model.xsDayTextController.text),
                                'price_id':
                                    _model.areaPriceQuery?.firstOrNull?.priceId,
                                'year_coeficient': double.tryParse(
                                    _model.yearCtTextController.text),
                              },
                              matchingRows: (rows) => rows.eqOrNull(
                                'price_id',
                                _model.areaPriceQuery?.firstOrNull?.priceId,
                              ),
                              returnRows: true,
                            );
                            await Future.delayed(
                                const Duration(milliseconds: 500));
                            if (Scaffold.of(context).isDrawerOpen ||
                                Scaffold.of(context).isEndDrawerOpen) {
                              Navigator.pop(context);
                            }

                            safeSetState(() {
                              _model.mMonthTextController?.text =
                                  valueOrDefault<String>(
                                _model.areaPriceQuery?.firstOrNull?.mPriceMonth
                                    ?.toString(),
                                '10990',
                              );

                              _model.mDayTextController?.text =
                                  valueOrDefault<String>(
                                _model.areaPriceQuery?.firstOrNull?.mPriceDay
                                    ?.toString(),
                                '600',
                              );

                              _model.sMonthTextController?.text =
                                  valueOrDefault<String>(
                                _model.areaPriceQuery?.firstOrNull?.sPriceMonth
                                    ?.toString(),
                                '5990',
                              );

                              _model.sDayTextController?.text =
                                  valueOrDefault<String>(
                                _model.areaPriceQuery?.firstOrNull?.sPriceMonth
                                    ?.toString(),
                                '400',
                              );

                              _model.xsMonthTextController?.text =
                                  valueOrDefault<String>(
                                _model.areaPriceQuery?.firstOrNull?.xsPriceMonth
                                    ?.toString(),
                                '3990',
                              );

                              _model.xsDayTextController?.text =
                                  valueOrDefault<String>(
                                _model.areaPriceQuery?.firstOrNull?.xsPriceDay
                                    ?.toString(),
                                '200',
                              );

                              _model.yearCtTextController?.text =
                                  valueOrDefault<String>(
                                _model
                                    .areaPriceQuery?.firstOrNull?.yearCoeficient
                                    ?.toString(),
                                '10',
                              );
                            });

                            safeSetState(() {});
                          },
                    text: FFLocalizations.of(context).getText(
                      'wrz1w6bk' /* Сохранить изменения цен */,
                    ),
                    options: FFButtonOptions(
                      width: double.infinity,
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
                Align(
                  alignment: AlignmentDirectional(0.0, 0.0),
                  child: Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(0.0, 12.0, 0.0, 0.0),
                    child: FFButtonWidget(
                      onPressed: () async {
                        Navigator.pop(context);
                      },
                      text: FFLocalizations.of(context).getText(
                        'hxbdm69v' /* Отмена */,
                      ),
                      options: FFButtonOptions(
                        width: double.infinity,
                        height: 44.0,
                        padding: EdgeInsetsDirectional.fromSTEB(
                            16.0, 4.0, 16.0, 4.0),
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
            ),
          ),
        ],
      ),
    );
  }
}
