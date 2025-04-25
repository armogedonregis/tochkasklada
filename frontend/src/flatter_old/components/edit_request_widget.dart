import '/auth/supabase_auth/auth_util.dart';
import '/backend/supabase/supabase.dart';
import '/components/promo_generator_widget.dart';
import '/components/skeleton_multi_line_widget.dart';
import '/components/skeleton_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_drop_down.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/flutter_flow/form_field_controller.dart';
import '/flutter_flow/custom_functions.dart' as functions;
import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'edit_request_model.dart';
export 'edit_request_model.dart';

class EditRequestWidget extends StatefulWidget {
  const EditRequestWidget({
    super.key,
    required this.requestID,
  });

  final String? requestID;

  @override
  State<EditRequestWidget> createState() => _EditRequestWidgetState();
}

class _EditRequestWidgetState extends State<EditRequestWidget>
    with TickerProviderStateMixin {
  late EditRequestModel _model;

  final animationsMap = <String, AnimationInfo>{};

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => EditRequestModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.selectedRequest = await RequestsTable().queryRows(
        queryFn: (q) => q.eqOrNull(
          'request_id',
          widget.requestID,
        ),
      );
      _model.cellRequest = await CellsTable().queryRows(
        queryFn: (q) => q
            .eqOrNull(
              'size',
              _model.selectedRequest?.firstOrNull?.size,
            )
            .eqOrNull(
              'adress',
              _model.selectedRequest?.firstOrNull?.location,
            )
            .order('cell_id'),
      );
      _model.isAvailable =
          _model.cellRequest != null && (_model.cellRequest)!.isNotEmpty;
      _model.availableCell = _model.cellRequest?.firstOrNull?.cellId;
      _model.reservedTimeH = _model.checkboxValue! ? 24 : 3;
      safeSetState(() {});
      safeSetState(() {
        _model.notesTextController?.text =
            _model.selectedRequest!.firstOrNull!.notes!;
      });
    });

    _model.notesTextController ??=
        TextEditingController(text: _model.selectedRequest?.firstOrNull?.notes);
    _model.notesFocusNode ??= FocusNode();
    _model.notesFocusNode!.addListener(
      () async {
        _model.notProseeded = await RequestsTable().update(
          data: {
            'notes': _model.notesTextController.text,
            'manager': currentUserEmail,
          },
          matchingRows: (rows) => rows
              .eqOrNull(
                'request_id',
                widget.requestID,
              )
              .eqOrNull(
                'client_name',
                _model.selectedRequest?.firstOrNull?.clientName,
              )
              .eqOrNull(
                'email',
                _model.selectedRequest?.firstOrNull?.email,
              ),
          returnRows: true,
        );

        safeSetState(() {});
      },
    );
    _model.switchValue = false;
    animationsMap.addAll({
      'columnOnPageLoadAnimation': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.easeInOut,
            delay: 160.0.ms,
            duration: 600.0.ms,
            begin: 0.0,
            end: 1.0,
          ),
        ],
      ),
    });

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
      padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 24.0, 0.0),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.max,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Align(
              alignment: AlignmentDirectional(-1.0, 0.0),
              child: Padding(
                padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 0.0, 0.0),
                child: wrapWithModel(
                  model: _model.tittleWithIconAndSubtittleModel,
                  updateCallback: () => safeSetState(() {}),
                  updateOnChange: true,
                  child: TittleWithIconAndSubtittleWidget(
                    tittle: dateTimeFormat(
                      "relative",
                      _model.selectedRequest!
                          .unique((e) => dateTimeFormat(
                                "d/M H:mm",
                                e.createdAt,
                                locale:
                                    FFLocalizations.of(context).languageCode,
                              ))
                          .firstOrNull!
                          .createdAt,
                      locale: FFLocalizations.of(context).languageCode,
                    ),
                    subtittle: widget.requestID,
                    hasIcon: false,
                    hasSubtittle: true,
                  ),
                ),
              ),
            ),
            Padding(
              padding: EdgeInsetsDirectional.fromSTEB(0.0, 32.0, 0.0, 24.0),
              child: Form(
                key: _model.formKey,
                autovalidateMode: AutovalidateMode.disabled,
                child: Column(
                  mainAxisSize: MainAxisSize.max,
                  children: [
                    Padding(
                      padding: EdgeInsetsDirectional.fromSTEB(
                          16.0, 12.0, 16.0, 42.0),
                      child: Container(
                        constraints: BoxConstraints(
                          minWidth: 320.0,
                          maxWidth: 400.0,
                        ),
                        decoration: BoxDecoration(
                          color:
                              FlutterFlowTheme.of(context).secondaryBackground,
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
                          padding: EdgeInsetsDirectional.fromSTEB(
                              16.0, 16.0, 16.0, 16.0),
                          child: Column(
                            mainAxisSize: MainAxisSize.max,
                            children: [
                              Padding(
                                padding: EdgeInsetsDirectional.fromSTEB(
                                    0.0, 8.0, 0.0, 0.0),
                                child: Row(
                                  mainAxisSize: MainAxisSize.max,
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          12.0, 0.0, 0.0, 0.0),
                                      child: Text(
                                        valueOrDefault<String>(
                                          _model.selectedRequest?.firstOrNull
                                              ?.clientName,
                                          'name',
                                        ),
                                        style: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Montserrat',
                                              letterSpacing: 0.0,
                                              fontWeight: FontWeight.bold,
                                            ),
                                      ),
                                    ),
                                    Text(
                                      valueOrDefault<String>(
                                        _model.selectedRequest?.firstOrNull
                                            ?.phone,
                                        'phone',
                                      ),
                                      textAlign: TextAlign.end,
                                      style: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .override(
                                            fontFamily: 'Montserrat',
                                            color: FlutterFlowTheme.of(context)
                                                .secondaryText,
                                            letterSpacing: 0.0,
                                          ),
                                    ),
                                  ].divide(SizedBox(width: 16.0)),
                                ),
                              ),
                              Align(
                                alignment: AlignmentDirectional(1.0, 0.0),
                                child: Padding(
                                  padding: EdgeInsetsDirectional.fromSTEB(
                                      0.0, 8.0, 0.0, 0.0),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.max,
                                    mainAxisAlignment: MainAxisAlignment.end,
                                    children: [
                                      Flexible(
                                        child: Align(
                                          alignment:
                                              AlignmentDirectional(1.0, 0.0),
                                          child: AutoSizeText(
                                            valueOrDefault<String>(
                                              _model.selectedRequest
                                                  ?.firstOrNull?.email,
                                              'email',
                                            ).maybeHandleOverflow(
                                              maxChars: 36,
                                              replacement: '…',
                                            ),
                                            textAlign: TextAlign.end,
                                            minFontSize: 12.0,
                                            style: FlutterFlowTheme.of(context)
                                                .bodyMedium
                                                .override(
                                                  fontFamily: 'Montserrat',
                                                  color: FlutterFlowTheme.of(
                                                          context)
                                                      .secondaryText,
                                                  letterSpacing: 0.0,
                                                ),
                                          ),
                                        ),
                                      ),
                                    ].divide(SizedBox(width: 16.0)),
                                  ),
                                ),
                              ),
                              Padding(
                                padding: EdgeInsetsDirectional.fromSTEB(
                                    0.0, 24.0, 0.0, 8.0),
                                child: Container(
                                  decoration: BoxDecoration(
                                    color: valueOrDefault<Color>(
                                      _model.availableCell != null &&
                                              _model.availableCell != ''
                                          ? FlutterFlowTheme.of(context).accent3
                                          : FlutterFlowTheme.of(context)
                                              .grayAlpha,
                                      FlutterFlowTheme.of(context).grayAlpha,
                                    ),
                                    borderRadius: BorderRadius.circular(12.0),
                                    border: Border.all(
                                      color: FlutterFlowTheme.of(context)
                                          .grayAlpha,
                                    ),
                                  ),
                                  child: Padding(
                                    padding: EdgeInsetsDirectional.fromSTEB(
                                        8.0, 12.0, 8.0, 12.0),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.max,
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Padding(
                                          padding:
                                              EdgeInsetsDirectional.fromSTEB(
                                                  8.0, 0.0, 0.0, 0.0),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.max,
                                            children: [
                                              Text(
                                                FFLocalizations.of(context)
                                                    .getText(
                                                  'vmw4xpme' /* Пожелания: */,
                                                ),
                                                style: FlutterFlowTheme.of(
                                                        context)
                                                    .labelMedium
                                                    .override(
                                                      fontFamily: 'Montserrat',
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .secondaryText,
                                                      fontSize: 12.0,
                                                      letterSpacing: 0.0,
                                                      fontWeight:
                                                          FontWeight.normal,
                                                    ),
                                              ),
                                              Text(
                                                valueOrDefault<String>(
                                                  '${valueOrDefault<String>(
                                                    _model.selectedRequest
                                                        ?.firstOrNull?.location,
                                                    'loc',
                                                  )} ${valueOrDefault<String>(
                                                    _model.selectedRequest
                                                        ?.firstOrNull?.size,
                                                    'XS',
                                                  )}',
                                                  'КУД XS',
                                                ),
                                                style: FlutterFlowTheme.of(
                                                        context)
                                                    .bodyMedium
                                                    .override(
                                                      fontFamily: 'Montserrat',
                                                      color: _model.alternateCell !=
                                                                  null &&
                                                              _model.alternateCell !=
                                                                  ''
                                                          ? FlutterFlowTheme.of(
                                                                  context)
                                                              .tertiaryText
                                                          : FlutterFlowTheme.of(
                                                                  context)
                                                              .primaryText,
                                                      letterSpacing: 0.0,
                                                    ),
                                              ),
                                            ].divide(SizedBox(width: 8.0)),
                                          ),
                                        ),
                                        Padding(
                                          padding:
                                              EdgeInsetsDirectional.fromSTEB(
                                                  0.0, 0.0, 8.0, 0.0),
                                          child: Text(
                                            valueOrDefault<String>(
                                              () {
                                                if (_model.isAvailable) {
                                                  return _model.availableCell;
                                                } else if (_model
                                                            .alternateCell !=
                                                        null &&
                                                    _model.alternateCell !=
                                                        '') {
                                                  return _model.alternateCell;
                                                } else {
                                                  return 'нет';
                                                }
                                              }(),
                                              'нет',
                                            ),
                                            style: FlutterFlowTheme.of(context)
                                                .bodyMedium
                                                .override(
                                                  fontFamily: 'Montserrat',
                                                  color: valueOrDefault<Color>(
                                                    () {
                                                      if (!_model.isAvailable) {
                                                        return FlutterFlowTheme
                                                                .of(context)
                                                            .primaryText;
                                                      } else if (_model
                                                                  .availableCell !=
                                                              null &&
                                                          _model.availableCell !=
                                                              '') {
                                                        return FlutterFlowTheme
                                                                .of(context)
                                                            .success;
                                                      } else if (_model
                                                                  .alternateCell !=
                                                              null &&
                                                          _model.alternateCell !=
                                                              '') {
                                                        return FlutterFlowTheme
                                                                .of(context)
                                                            .success;
                                                      } else {
                                                        return FlutterFlowTheme
                                                                .of(context)
                                                            .primaryText;
                                                      }
                                                    }(),
                                                    FlutterFlowTheme.of(context)
                                                        .primaryText,
                                                  ),
                                                  letterSpacing: 0.0,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                          ),
                                        ),
                                      ].divide(SizedBox(width: 16.0)),
                                    ),
                                  ),
                                ),
                              ),
                            ].divide(SizedBox(height: 0.0)),
                          ),
                        ),
                      ),
                    ),
                    Padding(
                      padding:
                          EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 0.0),
                      child: Column(
                        mainAxisSize: MainAxisSize.max,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (!_model.isAvailable)
                            Column(
                              mainAxisSize: MainAxisSize.max,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Padding(
                                  padding: EdgeInsetsDirectional.fromSTEB(
                                      0.0, 0.0, 0.0, 4.0),
                                  child: Text(
                                    FFLocalizations.of(context).getText(
                                      '3jp1sgsu' /* Сколько готов ждать: */,
                                    ),
                                    style: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Montserrat',
                                          letterSpacing: 0.0,
                                        ),
                                  ),
                                ),
                                FlutterFlowDropDown<int>(
                                  controller:
                                      _model.dropDownWaitingValueController ??=
                                          FormFieldController<int>(
                                    _model.dropDownWaitingValue ??= 60,
                                  ),
                                  options: List<int>.from([7, 14, 30, 60]),
                                  optionLabels: [
                                    FFLocalizations.of(context).getText(
                                      'wpt3haea' /* 7  дней */,
                                    ),
                                    FFLocalizations.of(context).getText(
                                      'uyfyj40f' /* 2 недели */,
                                    ),
                                    FFLocalizations.of(context).getText(
                                      '3l27hvmp' /* Месяц */,
                                    ),
                                    FFLocalizations.of(context).getText(
                                      'ri31cpfu' /* 2 месяца */,
                                    )
                                  ],
                                  onChanged: (val) async {
                                    safeSetState(() =>
                                        _model.dropDownWaitingValue = val);
                                    _model.waitingTimeDays =
                                        _model.dropDownWaitingValue;
                                    safeSetState(() {});
                                  },
                                  height: 44.0,
                                  textStyle: FlutterFlowTheme.of(context)
                                      .bodyMedium
                                      .override(
                                        fontFamily: 'Montserrat',
                                        color: FlutterFlowTheme.of(context)
                                            .tertiaryText,
                                        fontSize: 14.0,
                                        letterSpacing: 0.0,
                                        fontWeight: FontWeight.w600,
                                      ),
                                  icon: Icon(
                                    Icons.keyboard_arrow_down_rounded,
                                    color: FlutterFlowTheme.of(context)
                                        .tertiaryText,
                                    size: 22.0,
                                  ),
                                  fillColor: FlutterFlowTheme.of(context)
                                      .primaryBackground,
                                  elevation: 1.0,
                                  borderColor: Colors.transparent,
                                  borderWidth: 0.0,
                                  borderRadius: 16.0,
                                  margin: EdgeInsetsDirectional.fromSTEB(
                                      16.0, 4.0, 16.0, 4.0),
                                  hidesUnderline: true,
                                  isOverButton: false,
                                  isSearchable: false,
                                  isMultiSelect: false,
                                  labelText: valueOrDefault<String>(
                                    _model.waitingTimeDays?.toString(),
                                    '60',
                                  ),
                                  labelTextStyle: FlutterFlowTheme.of(context)
                                      .labelMedium
                                      .override(
                                        fontFamily: 'Montserrat',
                                        color: FlutterFlowTheme.of(context)
                                            .tertiaryText,
                                        fontSize: 16.0,
                                        letterSpacing: 0.0,
                                        fontWeight: FontWeight.w600,
                                      ),
                                ),
                              ].divide(SizedBox(height: 8.0)),
                            ),
                          if (_model.isAvailable == false)
                            Column(
                              mainAxisSize: MainAxisSize.max,
                              children: [
                                Padding(
                                  padding: EdgeInsetsDirectional.fromSTEB(
                                      0.0, 8.0, 0.0, 0.0),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.max,
                                    mainAxisAlignment: MainAxisAlignment.start,
                                    children: [
                                      Text(
                                        FFLocalizations.of(context).getText(
                                          '3ooub1ow' /* Показать доступные варианты: */,
                                        ),
                                        style: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Montserrat',
                                              letterSpacing: 0.0,
                                            ),
                                      ),
                                    ].divide(SizedBox(width: 16.0)),
                                  ),
                                ),
                                Row(
                                  mainAxisSize: MainAxisSize.max,
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Container(
                                      width: 150.0,
                                      decoration: BoxDecoration(),
                                      child: FutureBuilder<List<LocGeoRow>>(
                                        future: FFAppState().allLocs(
                                          requestFn: () =>
                                              LocGeoTable().queryRows(
                                            queryFn: (q) => q,
                                          ),
                                        ),
                                        builder: (context, snapshot) {
                                          // Customize what your widget looks like when it's loading.
                                          if (!snapshot.hasData) {
                                            return SkeletonWidget();
                                          }
                                          List<LocGeoRow>
                                              dropDownLocLocGeoRowList =
                                              snapshot.data!;

                                          return FlutterFlowDropDown<String>(
                                            multiSelectController: _model
                                                    .dropDownLocValueController ??=
                                                FormListFieldController<String>(
                                                    null),
                                            options: dropDownLocLocGeoRowList
                                                .map((e) =>
                                                    valueOrDefault<String>(
                                                      e.ruName,
                                                      '--',
                                                    ))
                                                .toList(),
                                            height: 44.0,
                                            textStyle: FlutterFlowTheme.of(
                                                    context)
                                                .bodyMedium
                                                .override(
                                                  fontFamily: 'Montserrat',
                                                  color: FlutterFlowTheme.of(
                                                          context)
                                                      .tertiaryText,
                                                  letterSpacing: 0.0,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                            hintText:
                                                FFLocalizations.of(context)
                                                    .getText(
                                              '8qb0742h' /* Локация */,
                                            ),
                                            icon: Icon(
                                              Icons.keyboard_arrow_down_rounded,
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .tertiaryText,
                                              size: 22.0,
                                            ),
                                            fillColor:
                                                FlutterFlowTheme.of(context)
                                                    .primaryBackground,
                                            elevation: 1.0,
                                            borderColor: Colors.transparent,
                                            borderWidth: 0.0,
                                            borderRadius: 16.0,
                                            margin:
                                                EdgeInsetsDirectional.fromSTEB(
                                                    16.0, 4.0, 16.0, 4.0),
                                            hidesUnderline: true,
                                            isOverButton: true,
                                            isSearchable: false,
                                            isMultiSelect: true,
                                            onMultiSelectChanged: (val) async {
                                              safeSetState(() => _model
                                                  .dropDownLocValue = val);
                                              _model.alternateLoc = _model
                                                  .dropDownLocValue!
                                                  .toList()
                                                  .cast<String>();
                                              safeSetState(() {});
                                            },
                                            labelText:
                                                FFLocalizations.of(context)
                                                    .getText(
                                              'qa3zieni' /* Выбрать */,
                                            ),
                                            labelTextStyle:
                                                FlutterFlowTheme.of(context)
                                                    .labelMedium
                                                    .override(
                                                      fontFamily: 'Montserrat',
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .tertiaryText,
                                                      letterSpacing: 0.0,
                                                    ),
                                          );
                                        },
                                      ),
                                    ),
                                    Container(
                                      width: 150.0,
                                      decoration: BoxDecoration(),
                                      child: FutureBuilder<List<SizesRow>>(
                                        future: FFAppState().allSizes(
                                          requestFn: () =>
                                              SizesTable().queryRows(
                                            queryFn: (q) => q,
                                          ),
                                        ),
                                        builder: (context, snapshot) {
                                          // Customize what your widget looks like when it's loading.
                                          if (!snapshot.hasData) {
                                            return SkeletonWidget();
                                          }
                                          List<SizesRow>
                                              dropDownSizeSizesRowList =
                                              snapshot.data!;

                                          return FlutterFlowDropDown<String>(
                                            multiSelectController: _model
                                                    .dropDownSizeValueController ??=
                                                FormListFieldController<String>(
                                                    null),
                                            options: dropDownSizeSizesRowList
                                                .map((e) => e.id)
                                                .toList(),
                                            height: 44.0,
                                            textStyle: FlutterFlowTheme.of(
                                                    context)
                                                .bodyMedium
                                                .override(
                                                  fontFamily: 'Montserrat',
                                                  color: FlutterFlowTheme.of(
                                                          context)
                                                      .tertiaryText,
                                                  letterSpacing: 0.0,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                            hintText:
                                                FFLocalizations.of(context)
                                                    .getText(
                                              'fsxvths2' /* Размер */,
                                            ),
                                            icon: Icon(
                                              Icons.keyboard_arrow_down_rounded,
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .tertiaryText,
                                              size: 22.0,
                                            ),
                                            fillColor:
                                                FlutterFlowTheme.of(context)
                                                    .primaryBackground,
                                            elevation: 1.0,
                                            borderColor: Colors.transparent,
                                            borderWidth: 0.0,
                                            borderRadius: 16.0,
                                            margin:
                                                EdgeInsetsDirectional.fromSTEB(
                                                    16.0, 4.0, 16.0, 4.0),
                                            hidesUnderline: true,
                                            isOverButton: true,
                                            isSearchable: false,
                                            isMultiSelect: true,
                                            onMultiSelectChanged: (val) async {
                                              safeSetState(() => _model
                                                  .dropDownSizeValue = val);
                                              _model.alternateSize = _model
                                                  .dropDownSizeValue!
                                                  .toList()
                                                  .cast<String>();
                                              safeSetState(() {});
                                            },
                                            labelText:
                                                FFLocalizations.of(context)
                                                    .getText(
                                              '50uuirn8' /* Выбрать */,
                                            ),
                                            labelTextStyle:
                                                FlutterFlowTheme.of(context)
                                                    .labelMedium
                                                    .override(
                                                      fontFamily: 'Montserrat',
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .tertiaryText,
                                                      letterSpacing: 0.0,
                                                    ),
                                          );
                                        },
                                      ),
                                    ),
                                  ],
                                ),
                                if ((_model.alternateLoc.isNotEmpty) &&
                                    (_model.alternateSize.isNotEmpty))
                                  FutureBuilder<List<ViewCombinedCellSizeRow>>(
                                    future:
                                        ViewCombinedCellSizeTable().queryRows(
                                      queryFn: (q) => q
                                          .inFilterOrNull(
                                            'size',
                                            _model.dropDownSizeValue,
                                          )
                                          .inFilterOrNull(
                                            'location_name',
                                            _model.alternateLoc,
                                          ),
                                    ),
                                    builder: (context, snapshot) {
                                      // Customize what your widget looks like when it's loading.
                                      if (!snapshot.hasData) {
                                        return SkeletonMultiLineWidget(
                                          height: 36.0,
                                          itemsQty: 1,
                                          radii: 16,
                                          spacer: 0,
                                        );
                                      }
                                      List<ViewCombinedCellSizeRow>
                                          dropDownNumViewCombinedCellSizeRowList =
                                          snapshot.data!;

                                      return FlutterFlowDropDown<String>(
                                        controller: _model
                                                .dropDownNumValueController ??=
                                            FormFieldController<String>(
                                          _model.dropDownNumValue ??= '',
                                        ),
                                        options: List<String>.from(
                                            dropDownNumViewCombinedCellSizeRowList
                                                .map((e) => e.cellID)
                                                .withoutNulls
                                                .toList()),
                                        optionLabels:
                                            dropDownNumViewCombinedCellSizeRowList
                                                .map((e) => e.cellInfo)
                                                .withoutNulls
                                                .toList(),
                                        onChanged: (val) async {
                                          safeSetState(() =>
                                              _model.dropDownNumValue = val);
                                          _model.alternateCell =
                                              _model.dropDownNumValue;
                                          safeSetState(() {});
                                        },
                                        height: 44.0,
                                        textStyle: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Montserrat',
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .tertiaryText,
                                              fontSize: 14.0,
                                              letterSpacing: 0.0,
                                              fontWeight: FontWeight.w600,
                                            ),
                                        hintText:
                                            FFLocalizations.of(context).getText(
                                          'e2utmpsk' /* Номер ячейки */,
                                        ),
                                        icon: Icon(
                                          Icons.keyboard_arrow_down_rounded,
                                          color: FlutterFlowTheme.of(context)
                                              .tertiaryText,
                                          size: 22.0,
                                        ),
                                        fillColor: FlutterFlowTheme.of(context)
                                            .primaryBackground,
                                        elevation: 1.0,
                                        borderColor: Colors.transparent,
                                        borderWidth: 0.0,
                                        borderRadius: 16.0,
                                        margin: EdgeInsetsDirectional.fromSTEB(
                                            16.0, 4.0, 16.0, 4.0),
                                        hidesUnderline: true,
                                        isOverButton: false,
                                        isSearchable: false,
                                        isMultiSelect: false,
                                        labelText:
                                            FFLocalizations.of(context).getText(
                                          '2yctf3k7' /* Доступно: */,
                                        ),
                                        labelTextStyle: FlutterFlowTheme.of(
                                                context)
                                            .labelMedium
                                            .override(
                                              fontFamily: 'Montserrat',
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .tertiaryText,
                                              fontSize: 16.0,
                                              letterSpacing: 0.0,
                                              fontWeight: FontWeight.w600,
                                            ),
                                      );
                                    },
                                  ),
                              ].divide(SizedBox(height: 16.0)),
                            ),
                          TextFormField(
                            controller: _model.notesTextController,
                            focusNode: _model.notesFocusNode,
                            autofocus: false,
                            textCapitalization: TextCapitalization.words,
                            obscureText: false,
                            decoration: InputDecoration(
                              isDense: true,
                              labelText: _model.notes != null &&
                                      _model.notes != ''
                                  ? _model.selectedRequest?.firstOrNull?.notes
                                  : 'Добавить комментарий',
                              labelStyle: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.normal,
                                  ),
                              alignLabelWithHint: true,
                              hintText:
                                  _model.selectedRequest?.firstOrNull?.notes,
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
                            maxLines: 4,
                            minLines: 2,
                            validator: _model.notesTextControllerValidator
                                .asValidator(context),
                          ),
                          if ((_model.isAvailable == true) ||
                              (_model.alternateCell != null &&
                                  _model.alternateCell != ''))
                            Column(
                              mainAxisSize: MainAxisSize.max,
                              children: [
                                Container(
                                  decoration: BoxDecoration(
                                    color: _model.isGeneratorVisible
                                        ? FlutterFlowTheme.of(context)
                                            .primaryBackground
                                        : Color(0x00000000),
                                    borderRadius: BorderRadius.only(
                                      bottomLeft: Radius.circular(
                                          valueOrDefault<double>(
                                        _model.isGeneratorVisible ? 0.0 : 12.0,
                                        0.0,
                                      )),
                                      bottomRight: Radius.circular(
                                          valueOrDefault<double>(
                                        _model.isGeneratorVisible ? 0.0 : 12.0,
                                        0.0,
                                      )),
                                      topLeft: Radius.circular(12.0),
                                      topRight: Radius.circular(12.0),
                                    ),
                                    border: Border.all(
                                      color: FlutterFlowTheme.of(context)
                                          .grayAlpha,
                                    ),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.max,
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.center,
                                    children: [
                                      Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            12.0, 8.0, 12.0, 8.0),
                                        child: AutoSizeText(
                                          FFLocalizations.of(context).getText(
                                            'lgbn7i1q' /* Промокод */,
                                          ),
                                          textAlign: TextAlign.end,
                                          minFontSize: 13.0,
                                          style: FlutterFlowTheme.of(context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Montserrat',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .secondaryText,
                                                letterSpacing: 0.0,
                                              ),
                                        ),
                                      ),
                                      Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            0.0, 2.0, 8.0, 2.0),
                                        child: Switch.adaptive(
                                          value: _model.switchValue!,
                                          onChanged: (newValue) async {
                                            safeSetState(() =>
                                                _model.switchValue = newValue);
                                            if (newValue) {
                                              _model.isGeneratorVisible = true;
                                              safeSetState(() {});
                                            } else {
                                              _model.isGeneratorVisible = false;
                                              safeSetState(() {});
                                            }
                                          },
                                          activeColor:
                                              FlutterFlowTheme.of(context)
                                                  .accent1,
                                          activeTrackColor:
                                              FlutterFlowTheme.of(context)
                                                  .primary,
                                          inactiveTrackColor:
                                              FlutterFlowTheme.of(context)
                                                  .alternate,
                                          inactiveThumbColor:
                                              FlutterFlowTheme.of(context)
                                                  .secondaryText,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                if (_model.isGeneratorVisible == true)
                                  wrapWithModel(
                                    model: _model.promoGeneratorModel,
                                    updateCallback: () => safeSetState(() {}),
                                    updateOnChange: true,
                                    child: PromoGeneratorWidget(
                                      radii: 0,
                                      personalEmail: _model
                                          .selectedRequest?.firstOrNull?.email,
                                    ),
                                  ),
                              ],
                            ),
                        ].divide(SizedBox(height: 24.0)),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            if (((_model.availableCell != null && _model.availableCell != '') &&
                    _model.isAvailable) ||
                (!_model.isAvailable &&
                    (_model.alternateCell != null &&
                        _model.alternateCell != '')))
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 0.0),
                child: Column(
                  mainAxisSize: MainAxisSize.max,
                  children: [
                    Padding(
                      padding:
                          EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 8.0),
                      child: Row(
                        mainAxisSize: MainAxisSize.max,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Align(
                            alignment: AlignmentDirectional(-1.0, 0.0),
                            child: Text(
                              FFLocalizations.of(context).getText(
                                'u3mdp816' /* Бронь по умолчанию: 3ч */,
                              ),
                              style: FlutterFlowTheme.of(context)
                                  .labelMedium
                                  .override(
                                    fontFamily: 'Montserrat',
                                    color: FlutterFlowTheme.of(context)
                                        .tertiaryText,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.normal,
                                  ),
                            ),
                          ),
                          Row(
                            mainAxisSize: MainAxisSize.max,
                            children: [
                              Align(
                                alignment: AlignmentDirectional(-1.0, 0.0),
                                child: Text(
                                  FFLocalizations.of(context).getText(
                                    'x4uev4oh' /* На 24ч */,
                                  ),
                                  style: FlutterFlowTheme.of(context)
                                      .labelMedium
                                      .override(
                                        fontFamily: 'Montserrat',
                                        color: FlutterFlowTheme.of(context)
                                            .tertiaryText,
                                        letterSpacing: 0.0,
                                        fontWeight: FontWeight.normal,
                                      ),
                                ),
                              ),
                              Theme(
                                data: ThemeData(
                                  checkboxTheme: CheckboxThemeData(
                                    visualDensity: VisualDensity.compact,
                                    materialTapTargetSize:
                                        MaterialTapTargetSize.shrinkWrap,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(4.0),
                                    ),
                                  ),
                                  unselectedWidgetColor:
                                      FlutterFlowTheme.of(context).tertiaryText,
                                ),
                                child: Checkbox(
                                  value: _model.checkboxValue ??= false,
                                  onChanged: (newValue) async {
                                    safeSetState(
                                        () => _model.checkboxValue = newValue!);
                                    if (newValue!) {
                                      _model.reservedTimeH = 24;
                                      safeSetState(() {});
                                    } else {
                                      _model.reservedTimeH = 3;
                                      safeSetState(() {});
                                    }
                                  },
                                  side: BorderSide(
                                    width: 2,
                                    color: FlutterFlowTheme.of(context)
                                        .tertiaryText,
                                  ),
                                  activeColor:
                                      FlutterFlowTheme.of(context).primary,
                                  checkColor: FlutterFlowTheme.of(context).info,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Align(
                      alignment: AlignmentDirectional(0.0, 0.0),
                      child: FFButtonWidget(
                        onPressed: !((_model.availableCell != null &&
                                    _model.availableCell != '') ||
                                (_model.alternateCell != null &&
                                    _model.alternateCell != ''))
                            ? null
                            : () async {
                                _model.forReservation =
                                    await RequestsTable().update(
                                  data: {
                                    'manager': currentUserEmail,
                                    'notes': _model.notesTextController.text !=
                                                ''
                                        ? _model.notesTextController.text
                                        : 'создана бронь',
                                    'processed': true,
                                    'status': 'reserved',
                                    'reserved_cell':
                                        _model.availableCell != null &&
                                                _model.availableCell != ''
                                            ? _model.availableCell
                                            : _model.alternateCell,
                                  },
                                  matchingRows: (rows) => rows.eqOrNull(
                                    'request_id',
                                    widget.requestID,
                                  ),
                                  returnRows: true,
                                );
                                _model.hasClientID =
                                    await ClientsTable().queryRows(
                                  queryFn: (q) => q.eqOrNull(
                                    'email',
                                    valueOrDefault<String>(
                                      _model.forReservation?.firstOrNull?.email,
                                      'email',
                                    ),
                                  ),
                                );
                                if (!(_model.hasClientID != null &&
                                    (_model.hasClientID)!.isNotEmpty)) {
                                  _model.createClient =
                                      await ClientsTable().insert({
                                    'email': _model
                                        .selectedRequest?.firstOrNull?.email,
                                    'client_id': valueOrDefault<String>(
                                      '${_model.selectedRequest?.firstOrNull?.email}-${valueOrDefault<String>(
                                        dateTimeFormat(
                                          "dd-MM-yy-H:mm",
                                          getCurrentTimestamp,
                                          locale: FFLocalizations.of(context)
                                              .languageCode,
                                        ),
                                        '12-12-22-22:22',
                                      )}',
                                      'email-11-11-11-11:11',
                                    ),
                                    'phone': _model
                                        .selectedRequest?.firstOrNull?.phone,
                                    'client_name': _model.selectedRequest
                                        ?.firstOrNull?.clientName,
                                    'invite_token': valueOrDefault<String>(
                                      functions.generateInviteToken(),
                                      '123',
                                    ),
                                    'created_by': currentUserUid,
                                  });
                                }
                                _model.isClientID =
                                    await ClientsTable().queryRows(
                                  queryFn: (q) => q.eqOrNull(
                                    'email',
                                    valueOrDefault<String>(
                                      _model.forReservation?.firstOrNull?.email,
                                      'email',
                                    ),
                                  ),
                                );
                                _model.reserved = await ReservedTable().insert({
                                  'cell_id': _model.forReservation?.firstOrNull
                                      ?.reservedCell,
                                  'client_id': valueOrDefault<String>(
                                    _model.isClientID?.firstOrNull?.clientId,
                                    'id',
                                  ),
                                  'reserved_until': supaSerialize<DateTime>(
                                      functions.createReserveTime(
                                          _model.reservedTimeH!)),
                                });
                                Navigator.pop(context);
                                safeSetState(() {
                                  _model.notesTextController?.clear();
                                  _model.promoGeneratorModel
                                      .discountTextController
                                      ?.clear();
                                  _model.promoGeneratorModel.textController5
                                      ?.clear();
                                  _model.promoGeneratorModel
                                      .usageQtyTextController
                                      ?.clear();
                                  _model.promoGeneratorModel
                                      .minPriceTextController
                                      ?.clear();
                                  _model.promoGeneratorModel
                                      .maxPriceTextController
                                      ?.clear();
                                });
                                _model.availableCell = null;
                                _model.isAvailable = false;
                                _model.alternateCell = null;
                                _model.alternateLoc = [];
                                _model.reservedTimeH = null;
                                _model.alternateSize = [];
                                safeSetState(() {});

                                safeSetState(() {});
                              },
                        text: 'Бронировать  ${() {
                          if ((_model.availableCell != null &&
                                  _model.availableCell != '') &&
                              _model.isAvailable) {
                            return _model.availableCell;
                          } else if (_model.alternateCell != null &&
                              _model.alternateCell != '') {
                            return _model.alternateCell;
                          } else {
                            return ' ';
                          }
                        }()}',
                        options: FFButtonOptions(
                          width: double.infinity,
                          height: 44.0,
                          padding: EdgeInsetsDirectional.fromSTEB(
                              0.0, 0.0, 0.0, 0.0),
                          iconPadding: EdgeInsetsDirectional.fromSTEB(
                              0.0, 0.0, 0.0, 0.0),
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
                  ],
                ),
              ),
            Padding(
              padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 0.0),
              child: Container(
                width: 380.0,
                decoration: BoxDecoration(),
                child: Visibility(
                  visible: !_model.isAvailable,
                  child: Row(
                    mainAxisSize: MainAxisSize.max,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        flex: 2,
                        child: Align(
                          alignment: AlignmentDirectional(0.0, 0.0),
                          child: Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(
                                0.0, 16.0, 0.0, 0.0),
                            child: FFButtonWidget(
                              onPressed: () async {
                                _model.toWaitingList =
                                    await RequestsTable().update(
                                  data: {
                                    'manager': currentUserEmail,
                                    'notes': _model.notesTextController.text !=
                                                ''
                                        ? _model.notesTextController.text
                                        : 'в листе ожидания',
                                    'processed': true,
                                    'status': 'waiting_list',
                                    'waitingTimeD': supaSerialize<DateTime>(
                                        functions.endWaitingData(
                                            _model.dropDownWaitingValue)),
                                  },
                                  matchingRows: (rows) => rows
                                      .eqOrNull(
                                        'request_id',
                                        widget.requestID,
                                      )
                                      .eqOrNull(
                                        'email',
                                        _model.selectedRequest?.firstOrNull
                                            ?.email,
                                      ),
                                  returnRows: true,
                                );
                                Navigator.pop(context);
                                safeSetState(() {
                                  _model.notesTextController?.clear();
                                });
                                _model.availableCell = null;
                                _model.isAvailable = false;
                                _model.alternateCell = null;
                                _model.alternateLoc = [];
                                _model.reservedTimeH = null;
                                _model.alternateSize = [];
                                safeSetState(() {});

                                safeSetState(() {});
                              },
                              text: FFLocalizations.of(context).getText(
                                'n8pg7pph' /* В лист ожидания */,
                              ),
                              options: FFButtonOptions(
                                width: double.infinity,
                                height: 44.0,
                                padding: EdgeInsetsDirectional.fromSTEB(
                                    16.0, 0.0, 16.0, 0.0),
                                iconPadding: EdgeInsetsDirectional.fromSTEB(
                                    0.0, 0.0, 0.0, 0.0),
                                color: FlutterFlowTheme.of(context).tertiary,
                                textStyle: FlutterFlowTheme.of(context)
                                    .labelLarge
                                    .override(
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
                      ),
                      Expanded(
                        flex: 1,
                        child: Align(
                          alignment: AlignmentDirectional(0.0, 0.0),
                          child: Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(
                                0.0, 16.0, 0.0, 0.0),
                            child: FFButtonWidget(
                              onPressed: () async {
                                _model.leadOff = await RequestsTable().update(
                                  data: {
                                    'manager': currentUserEmail,
                                    'notes': _model.notesTextController.text !=
                                                ''
                                        ? _model.notesTextController.text
                                        : 'отказ',
                                    'processed': true,
                                    'status': 'fell_off',
                                  },
                                  matchingRows: (rows) => rows.eqOrNull(
                                    'request_id',
                                    widget.requestID,
                                  ),
                                  returnRows: true,
                                );
                                Navigator.pop(context);
                                safeSetState(() {
                                  _model.notesTextController?.clear();
                                });
                                _model.availableCell = null;
                                _model.isAvailable = false;
                                _model.alternateCell = null;
                                _model.alternateLoc = [];
                                _model.reservedTimeH = null;
                                _model.alternateSize = [];
                                safeSetState(() {});

                                safeSetState(() {});
                              },
                              text: FFLocalizations.of(context).getText(
                                'u56au1t9' /* Отказ */,
                              ),
                              options: FFButtonOptions(
                                width: double.infinity,
                                height: 44.0,
                                padding: EdgeInsetsDirectional.fromSTEB(
                                    0.0, 0.0, 0.0, 0.0),
                                iconPadding: EdgeInsetsDirectional.fromSTEB(
                                    0.0, 0.0, 0.0, 0.0),
                                color:
                                    FlutterFlowTheme.of(context).secondaryText,
                                textStyle: FlutterFlowTheme.of(context)
                                    .labelLarge
                                    .override(
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
                      ),
                    ].divide(SizedBox(width: 12.0)),
                  ),
                ),
              ),
            ),
            Align(
              alignment: AlignmentDirectional(0.0, 0.0),
              child: Padding(
                padding: EdgeInsetsDirectional.fromSTEB(16.0, 16.0, 16.0, 24.0),
                child: FFButtonWidget(
                  onPressed: () async {
                    _model.test = await RequestsTable().queryRows(
                      queryFn: (q) => q.eqOrNull(
                        'request_id',
                        widget.requestID,
                      ),
                    );
                    Navigator.pop(context);
                    safeSetState(() {
                      _model.notesTextController?.clear();
                    });
                    _model.availableCell = null;
                    _model.isAvailable = false;
                    _model.alternateCell = null;
                    _model.alternateLoc = [];
                    _model.reservedTimeH = null;
                    _model.alternateSize = [];
                    safeSetState(() {});

                    safeSetState(() {});
                  },
                  text: FFLocalizations.of(context).getText(
                    '80vge9mx' /* Заявка не обработана */,
                  ),
                  options: FFButtonOptions(
                    width: double.infinity,
                    height: 44.0,
                    padding:
                        EdgeInsetsDirectional.fromSTEB(16.0, 4.0, 16.0, 4.0),
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
      ).animateOnPageLoad(animationsMap['columnOnPageLoadAnimation']!),
    );
  }
}
