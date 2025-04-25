import '/auth/supabase_auth/auth_util.dart';
import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/components/breadcrumps_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:provider/provider.dart';
import 'crmsettings_model.dart';
export 'crmsettings_model.dart';

class CrmsettingsWidget extends StatefulWidget {
  const CrmsettingsWidget({super.key});

  static String routeName = 'crmsettings';
  static String routePath = '/crmsettings';

  @override
  State<CrmsettingsWidget> createState() => _CrmsettingsWidgetState();
}

class _CrmsettingsWidgetState extends State<CrmsettingsWidget> {
  late CrmsettingsModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => CrmsettingsModel());

    // On page load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.querySettings = await UserSettingsTable().queryRows(
        queryFn: (q) => q.eqOrNull(
          'email',
          currentUserEmail,
        ),
      );
      FFAppState().showAvailavleCellsInLocNav =
          _model.querySettings!.firstOrNull!.showFreeCells!;
      FFAppState().viewAsFranchisor =
          _model.querySettings!.firstOrNull!.viewAsFranchiser!;
      safeSetState(() {});
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
    context.watch<FFAppState>();

    return Title(
        title: 'crmsettings',
        color: FlutterFlowTheme.of(context).primary.withAlpha(0XFF),
        child: GestureDetector(
          onTap: () {
            FocusScope.of(context).unfocus();
            FocusManager.instance.primaryFocus?.unfocus();
          },
          child: Scaffold(
            key: scaffoldKey,
            backgroundColor: FlutterFlowTheme.of(context).secondaryBackground,
            body: SafeArea(
              top: true,
              child: Row(
                mainAxisSize: MainAxisSize.max,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  wrapWithModel(
                    model: _model.sidebarModel,
                    updateCallback: () => safeSetState(() {}),
                    child: SidebarWidget(
                      isNavbarOpened: false,
                    ),
                  ),
                  Expanded(
                    child: Align(
                      alignment: AlignmentDirectional(-1.0, -1.0),
                      child: Container(
                        width: double.infinity,
                        constraints: BoxConstraints(
                          maxWidth: double.infinity,
                        ),
                        decoration: BoxDecoration(
                          color:
                              FlutterFlowTheme.of(context).secondaryBackground,
                        ),
                        alignment: AlignmentDirectional(0.0, -1.0),
                        child: SingleChildScrollView(
                          child: Column(
                            mainAxisSize: MainAxisSize.max,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Align(
                                alignment: AlignmentDirectional(-1.0, -1.0),
                                child: Container(
                                  width: double.infinity,
                                  constraints: BoxConstraints(
                                    maxWidth: double.infinity,
                                  ),
                                  decoration: BoxDecoration(
                                    color: FlutterFlowTheme.of(context)
                                        .secondaryBackground,
                                  ),
                                  alignment: AlignmentDirectional(0.0, -1.0),
                                  child: Align(
                                    alignment: AlignmentDirectional(0.0, 0.0),
                                    child: Column(
                                      mainAxisSize: MainAxisSize.max,
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Padding(
                                          padding:
                                              EdgeInsetsDirectional.fromSTEB(
                                                  16.0, 0.0, 16.0, 0.0),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.max,
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              wrapWithModel(
                                                model: _model.breadcrumpsModel,
                                                updateCallback: () =>
                                                    safeSetState(() {}),
                                                updateOnChange: true,
                                                child: BreadcrumpsWidget(
                                                  iconForSection: Icon(
                                                    Icons.settings_rounded,
                                                    color: FlutterFlowTheme.of(
                                                            context)
                                                        .secondaryText,
                                                    size: 22.0,
                                                  ),
                                                  currentSectionTittle:
                                                      valueOrDefault<String>(
                                                    FFLocalizations.of(context)
                                                        .getVariableText(
                                                      ruText: 'Настройки',
                                                      enText: 'Settings',
                                                    ),
                                                    'Настройки',
                                                  ),
                                                  isSubpage: false,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                        Padding(
                                          padding:
                                              EdgeInsetsDirectional.fromSTEB(
                                                  16.0, 0.0, 16.0, 0.0),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.max,
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Expanded(
                                                child: Align(
                                                  alignment:
                                                      AlignmentDirectional(
                                                          -1.0, 0.0),
                                                  child: wrapWithModel(
                                                    model: _model
                                                        .tittleWithIconAndSubtittleModel,
                                                    updateCallback: () =>
                                                        safeSetState(() {}),
                                                    child:
                                                        TittleWithIconAndSubtittleWidget(
                                                      tittle: valueOrDefault<
                                                          String>(
                                                        FFLocalizations.of(
                                                                context)
                                                            .getVariableText(
                                                          ruText:
                                                              'Настройки CRM',
                                                          enText:
                                                              'CRM settings ',
                                                        ),
                                                        'Настройки CRM',
                                                      ),
                                                      hasIcon: true,
                                                      hasSubtittle: false,
                                                      margin: 24,
                                                    ),
                                                  ),
                                                ),
                                              ),
                                            ].divide(SizedBox(width: 16.0)),
                                          ),
                                        ),
                                        Align(
                                          alignment:
                                              AlignmentDirectional(-1.0, -1.0),
                                          child: Padding(
                                            padding: EdgeInsets.all(16.0),
                                            child: Container(
                                              width: double.infinity,
                                              constraints: BoxConstraints(
                                                maxWidth: 600.0,
                                              ),
                                              decoration: BoxDecoration(
                                                borderRadius:
                                                    BorderRadius.circular(16.0),
                                                border: Border.all(
                                                  color: FlutterFlowTheme.of(
                                                          context)
                                                      .grayAlpha,
                                                ),
                                              ),
                                              alignment: AlignmentDirectional(
                                                  -1.0, -1.0),
                                              child: Row(
                                                mainAxisSize: MainAxisSize.max,
                                                crossAxisAlignment:
                                                    CrossAxisAlignment.start,
                                                children: [
                                                  Expanded(
                                                    flex: 8,
                                                    child: Padding(
                                                      padding:
                                                          EdgeInsetsDirectional
                                                              .fromSTEB(
                                                                  16.0,
                                                                  16.0,
                                                                  16.0,
                                                                  16.0),
                                                      child: Column(
                                                        mainAxisSize:
                                                            MainAxisSize.max,
                                                        crossAxisAlignment:
                                                            CrossAxisAlignment
                                                                .start,
                                                        children: [
                                                          Column(
                                                            mainAxisSize:
                                                                MainAxisSize
                                                                    .min,
                                                            crossAxisAlignment:
                                                                CrossAxisAlignment
                                                                    .start,
                                                            children: [
                                                              Text(
                                                                FFLocalizations.of(
                                                                        context)
                                                                    .getText(
                                                                  '8uwqm4vu' /* Настройки меню */,
                                                                ),
                                                                style: FlutterFlowTheme.of(
                                                                        context)
                                                                    .headlineMedium
                                                                    .override(
                                                                      fontFamily:
                                                                          'Montserrat',
                                                                      letterSpacing:
                                                                          0.0,
                                                                    ),
                                                              ),
                                                              Padding(
                                                                padding:
                                                                    EdgeInsetsDirectional
                                                                        .fromSTEB(
                                                                            0.0,
                                                                            0.0,
                                                                            0.0,
                                                                            16.0),
                                                                child: Text(
                                                                  FFLocalizations.of(
                                                                          context)
                                                                      .getText(
                                                                    'afw8i8jh' /* Отображение счетчиков в навига... */,
                                                                  ),
                                                                  textAlign:
                                                                      TextAlign
                                                                          .start,
                                                                  style: FlutterFlowTheme.of(
                                                                          context)
                                                                      .bodyMedium
                                                                      .override(
                                                                        fontFamily:
                                                                            'Montserrat',
                                                                        color: FlutterFlowTheme.of(context)
                                                                            .tertiaryText,
                                                                        letterSpacing:
                                                                            0.0,
                                                                      ),
                                                                ),
                                                              ),
                                                            ],
                                                          ),
                                                          Container(
                                                            decoration:
                                                                BoxDecoration(
                                                              color: FlutterFlowTheme
                                                                      .of(context)
                                                                  .primaryBackground,
                                                              borderRadius:
                                                                  BorderRadius
                                                                      .circular(
                                                                          16.0),
                                                              border:
                                                                  Border.all(
                                                                color: FlutterFlowTheme.of(
                                                                        context)
                                                                    .grayAlpha,
                                                              ),
                                                            ),
                                                            child: Visibility(
                                                              visible: FFAppState()
                                                                  .permLevel
                                                                  .contains(
                                                                      PermLevel
                                                                          .full),
                                                              child: Material(
                                                                color: Colors
                                                                    .transparent,
                                                                child:
                                                                    SwitchListTile
                                                                        .adaptive(
                                                                  value: _model
                                                                          .switchListTileValue1 ??=
                                                                      FFAppState()
                                                                          .viewAsFranchisor,
                                                                  onChanged: !FFAppState()
                                                                          .permLevel
                                                                          .contains(
                                                                              PermLevel.full)
                                                                      ? null
                                                                      : (newValue) async {
                                                                          safeSetState(() =>
                                                                              _model.switchListTileValue1 = newValue);
                                                                          if (newValue) {
                                                                            _model.updateFranchisorView =
                                                                                await UserSettingsTable().update(
                                                                              data: {
                                                                                'view_as_franchiser': true,
                                                                              },
                                                                              matchingRows: (rows) => rows.eqOrNull(
                                                                                'email',
                                                                                currentUserEmail,
                                                                              ),
                                                                              returnRows: true,
                                                                            );
                                                                            FFAppState().viewAsFranchisor =
                                                                                true;
                                                                            FFAppState().update(() {});

                                                                            safeSetState(() {});
                                                                          } else {
                                                                            _model.updateFranchisorViewOff =
                                                                                await UserSettingsTable().update(
                                                                              data: {
                                                                                'view_as_franchiser': false,
                                                                              },
                                                                              matchingRows: (rows) => rows.eqOrNull(
                                                                                'email',
                                                                                currentUserEmail,
                                                                              ),
                                                                              returnRows: true,
                                                                            );
                                                                            FFAppState().viewAsFranchisor =
                                                                                false;
                                                                            FFAppState().update(() {});

                                                                            safeSetState(() {});
                                                                          }
                                                                        },
                                                                  title: Text(
                                                                    FFLocalizations.of(
                                                                            context)
                                                                        .getText(
                                                                      'qjhuk9eb' /* Видеть как франчайзер */,
                                                                    ),
                                                                    style: FlutterFlowTheme.of(
                                                                            context)
                                                                        .titleSmall
                                                                        .override(
                                                                          fontFamily:
                                                                              'Roboto',
                                                                          color:
                                                                              FlutterFlowTheme.of(context).primaryText,
                                                                          letterSpacing:
                                                                              0.0,
                                                                          fontWeight:
                                                                              FontWeight.bold,
                                                                        ),
                                                                  ),
                                                                  subtitle:
                                                                      Text(
                                                                    FFLocalizations.of(
                                                                            context)
                                                                        .getText(
                                                                      'ba22pnwb' /* Если выключено, только по свое... */,
                                                                    ),
                                                                    style: FlutterFlowTheme.of(
                                                                            context)
                                                                        .labelMedium
                                                                        .override(
                                                                          fontFamily:
                                                                              'Montserrat',
                                                                          letterSpacing:
                                                                              0.0,
                                                                          lineHeight:
                                                                              1.1,
                                                                        ),
                                                                  ),
                                                                  tileColor: FlutterFlowTheme.of(
                                                                          context)
                                                                      .secondaryText,
                                                                  activeColor: !FFAppState()
                                                                          .permLevel
                                                                          .contains(PermLevel
                                                                              .full)
                                                                      ? FlutterFlowTheme.of(
                                                                              context)
                                                                          .alternate
                                                                      : FlutterFlowTheme.of(
                                                                              context)
                                                                          .white,
                                                                  activeTrackColor: !FFAppState()
                                                                          .permLevel
                                                                          .contains(PermLevel
                                                                              .full)
                                                                      ? FlutterFlowTheme.of(
                                                                              context)
                                                                          .secondaryText
                                                                      : FlutterFlowTheme.of(
                                                                              context)
                                                                          .primary,
                                                                  dense: false,
                                                                  controlAffinity:
                                                                      ListTileControlAffinity
                                                                          .trailing,
                                                                  shape:
                                                                      RoundedRectangleBorder(
                                                                    borderRadius:
                                                                        BorderRadius.circular(
                                                                            16.0),
                                                                  ),
                                                                ),
                                                              ),
                                                            ),
                                                          ),
                                                          Container(
                                                            decoration:
                                                                BoxDecoration(
                                                              borderRadius:
                                                                  BorderRadius
                                                                      .circular(
                                                                          16.0),
                                                              border:
                                                                  Border.all(
                                                                color: FlutterFlowTheme.of(
                                                                        context)
                                                                    .grayAlpha,
                                                              ),
                                                            ),
                                                            child: Material(
                                                              color: Colors
                                                                  .transparent,
                                                              child:
                                                                  SwitchListTile
                                                                      .adaptive(
                                                                value: _model
                                                                        .switchListTileValue2 ??=
                                                                    FFAppState()
                                                                        .showAvailavleCellsInLocNav,
                                                                onChanged:
                                                                    (newValue) async {
                                                                  safeSetState(() =>
                                                                      _model.switchListTileValue2 =
                                                                          newValue);
                                                                  if (newValue) {
                                                                    _model.showAvailable =
                                                                        await UserSettingsTable()
                                                                            .update(
                                                                      data: {
                                                                        'show_free_cells':
                                                                            true,
                                                                      },
                                                                      matchingRows:
                                                                          (rows) =>
                                                                              rows.eqOrNull(
                                                                        'email',
                                                                        currentUserEmail,
                                                                      ),
                                                                      returnRows:
                                                                          true,
                                                                    );
                                                                    FFAppState()
                                                                            .showAvailavleCellsInLocNav =
                                                                        true;
                                                                    safeSetState(
                                                                        () {});

                                                                    safeSetState(
                                                                        () {});
                                                                  } else {
                                                                    _model.hideAvailable =
                                                                        await UserSettingsTable()
                                                                            .update(
                                                                      data: {
                                                                        'show_free_cells':
                                                                            false,
                                                                      },
                                                                      matchingRows:
                                                                          (rows) =>
                                                                              rows.eqOrNull(
                                                                        'email',
                                                                        currentUserEmail,
                                                                      ),
                                                                      returnRows:
                                                                          true,
                                                                    );
                                                                    FFAppState()
                                                                            .showAvailavleCellsInLocNav =
                                                                        false;
                                                                    safeSetState(
                                                                        () {});

                                                                    safeSetState(
                                                                        () {});
                                                                  }
                                                                },
                                                                title: Text(
                                                                  FFLocalizations.of(
                                                                          context)
                                                                      .getText(
                                                                    'ia3lb8ov' /* Локации */,
                                                                  ),
                                                                  style: FlutterFlowTheme.of(
                                                                          context)
                                                                      .titleSmall
                                                                      .override(
                                                                        fontFamily:
                                                                            'Roboto',
                                                                        color: FlutterFlowTheme.of(context)
                                                                            .primaryText,
                                                                        letterSpacing:
                                                                            0.0,
                                                                        fontWeight:
                                                                            FontWeight.bold,
                                                                      ),
                                                                ),
                                                                subtitle: Text(
                                                                  FFLocalizations.of(
                                                                          context)
                                                                      .getText(
                                                                    'zkgdcg0q' /* Показывать свободные ячейки */,
                                                                  ),
                                                                  style: FlutterFlowTheme.of(
                                                                          context)
                                                                      .labelMedium
                                                                      .override(
                                                                        fontFamily:
                                                                            'Montserrat',
                                                                        letterSpacing:
                                                                            0.0,
                                                                        lineHeight:
                                                                            1.1,
                                                                      ),
                                                                ),
                                                                tileColor: FlutterFlowTheme.of(
                                                                        context)
                                                                    .secondaryText,
                                                                activeColor:
                                                                    FlutterFlowTheme.of(
                                                                            context)
                                                                        .white,
                                                                activeTrackColor:
                                                                    FlutterFlowTheme.of(
                                                                            context)
                                                                        .primary,
                                                                dense: false,
                                                                controlAffinity:
                                                                    ListTileControlAffinity
                                                                        .trailing,
                                                                shape:
                                                                    RoundedRectangleBorder(
                                                                  borderRadius:
                                                                      BorderRadius
                                                                          .circular(
                                                                              16.0),
                                                                ),
                                                              ),
                                                            ),
                                                          ),
                                                          Container(
                                                            decoration:
                                                                BoxDecoration(
                                                              borderRadius:
                                                                  BorderRadius
                                                                      .circular(
                                                                          16.0),
                                                              border:
                                                                  Border.all(
                                                                color: FlutterFlowTheme.of(
                                                                        context)
                                                                    .grayAlpha,
                                                              ),
                                                            ),
                                                            child: Material(
                                                              color: Colors
                                                                  .transparent,
                                                              child:
                                                                  SwitchListTile
                                                                      .adaptive(
                                                                value: _model
                                                                        .switchListTileValue3 ??=
                                                                    FFAppState()
                                                                        .showDailyClients,
                                                                onChanged:
                                                                    (newValue) async {
                                                                  safeSetState(() =>
                                                                      _model.switchListTileValue3 =
                                                                          newValue);
                                                                  if (newValue) {
                                                                    _model.clientsTodayOnlyOn =
                                                                        await UserSettingsTable()
                                                                            .update(
                                                                      data: {
                                                                        'show_only_today_newclients':
                                                                            true,
                                                                      },
                                                                      matchingRows:
                                                                          (rows) =>
                                                                              rows.eqOrNull(
                                                                        'email',
                                                                        currentUserEmail,
                                                                      ),
                                                                      returnRows:
                                                                          true,
                                                                    );
                                                                    FFAppState()
                                                                            .showDailyClients =
                                                                        true;
                                                                    safeSetState(
                                                                        () {});

                                                                    safeSetState(
                                                                        () {});
                                                                  } else {
                                                                    _model.clientsTodayOnlyOff =
                                                                        await UserSettingsTable()
                                                                            .update(
                                                                      data: {
                                                                        'show_only_today_newclients':
                                                                            false,
                                                                      },
                                                                      matchingRows:
                                                                          (rows) =>
                                                                              rows.eqOrNull(
                                                                        'email',
                                                                        currentUserEmail,
                                                                      ),
                                                                      returnRows:
                                                                          true,
                                                                    );
                                                                    FFAppState()
                                                                            .showDailyClients =
                                                                        false;
                                                                    safeSetState(
                                                                        () {});

                                                                    safeSetState(
                                                                        () {});
                                                                  }
                                                                },
                                                                title: Text(
                                                                  FFLocalizations.of(
                                                                          context)
                                                                      .getText(
                                                                    'ton61mys' /* Клиенты */,
                                                                  ),
                                                                  style: FlutterFlowTheme.of(
                                                                          context)
                                                                      .titleSmall
                                                                      .override(
                                                                        fontFamily:
                                                                            'Roboto',
                                                                        color: FlutterFlowTheme.of(context)
                                                                            .primaryText,
                                                                        letterSpacing:
                                                                            0.0,
                                                                        fontWeight:
                                                                            FontWeight.bold,
                                                                      ),
                                                                ),
                                                                subtitle: Text(
                                                                  FFLocalizations.of(
                                                                          context)
                                                                      .getText(
                                                                    'p3jrbuf7' /* Новых за месяц. Включить -- то... */,
                                                                  ),
                                                                  style: FlutterFlowTheme.of(
                                                                          context)
                                                                      .labelMedium
                                                                      .override(
                                                                        fontFamily:
                                                                            'Montserrat',
                                                                        letterSpacing:
                                                                            0.0,
                                                                        lineHeight:
                                                                            1.1,
                                                                      ),
                                                                ),
                                                                tileColor: FlutterFlowTheme.of(
                                                                        context)
                                                                    .secondaryText,
                                                                activeColor:
                                                                    FlutterFlowTheme.of(
                                                                            context)
                                                                        .white,
                                                                activeTrackColor:
                                                                    FlutterFlowTheme.of(
                                                                            context)
                                                                        .primary,
                                                                dense: false,
                                                                controlAffinity:
                                                                    ListTileControlAffinity
                                                                        .trailing,
                                                                shape:
                                                                    RoundedRectangleBorder(
                                                                  borderRadius:
                                                                      BorderRadius
                                                                          .circular(
                                                                              16.0),
                                                                ),
                                                              ),
                                                            ),
                                                          ),
                                                          Container(
                                                            decoration:
                                                                BoxDecoration(
                                                              borderRadius:
                                                                  BorderRadius
                                                                      .circular(
                                                                          16.0),
                                                              border:
                                                                  Border.all(
                                                                color: FlutterFlowTheme.of(
                                                                        context)
                                                                    .grayAlpha,
                                                              ),
                                                            ),
                                                            child: Material(
                                                              color: Colors
                                                                  .transparent,
                                                              child:
                                                                  SwitchListTile
                                                                      .adaptive(
                                                                value: _model
                                                                        .switchListTileValue4 ??=
                                                                    FFAppState()
                                                                        .showPaymentsDaily,
                                                                onChanged:
                                                                    (newValue) async {
                                                                  safeSetState(() =>
                                                                      _model.switchListTileValue4 =
                                                                          newValue);
                                                                  if (newValue) {
                                                                    _model.paymentsTodayOnlyOn =
                                                                        await UserSettingsTable()
                                                                            .update(
                                                                      data: {
                                                                        'show_only_todays_payments':
                                                                            true,
                                                                      },
                                                                      matchingRows:
                                                                          (rows) =>
                                                                              rows.eqOrNull(
                                                                        'email',
                                                                        currentUserEmail,
                                                                      ),
                                                                      returnRows:
                                                                          true,
                                                                    );
                                                                    FFAppState()
                                                                            .showPaymentsDaily =
                                                                        true;
                                                                    safeSetState(
                                                                        () {});

                                                                    safeSetState(
                                                                        () {});
                                                                  } else {
                                                                    _model.paymentsTodayOnlyOff =
                                                                        await UserSettingsTable()
                                                                            .update(
                                                                      data: {
                                                                        'show_only_todays_payments':
                                                                            false,
                                                                      },
                                                                      matchingRows:
                                                                          (rows) =>
                                                                              rows.eqOrNull(
                                                                        'email',
                                                                        currentUserEmail,
                                                                      ),
                                                                      returnRows:
                                                                          true,
                                                                    );
                                                                    FFAppState()
                                                                            .showPaymentsDaily =
                                                                        false;
                                                                    safeSetState(
                                                                        () {});

                                                                    safeSetState(
                                                                        () {});
                                                                  }
                                                                },
                                                                title: Text(
                                                                  FFLocalizations.of(
                                                                          context)
                                                                      .getText(
                                                                    'eqkaxist' /* Платежи */,
                                                                  ),
                                                                  style: FlutterFlowTheme.of(
                                                                          context)
                                                                      .titleSmall
                                                                      .override(
                                                                        fontFamily:
                                                                            'Roboto',
                                                                        color: FlutterFlowTheme.of(context)
                                                                            .primaryText,
                                                                        letterSpacing:
                                                                            0.0,
                                                                        fontWeight:
                                                                            FontWeight.bold,
                                                                      ),
                                                                ),
                                                                subtitle: Text(
                                                                  FFLocalizations.of(
                                                                          context)
                                                                      .getText(
                                                                    '9kdlxmzq' /* Новых за месяц. Включить -- то... */,
                                                                  ),
                                                                  style: FlutterFlowTheme.of(
                                                                          context)
                                                                      .labelMedium
                                                                      .override(
                                                                        fontFamily:
                                                                            'Montserrat',
                                                                        letterSpacing:
                                                                            0.0,
                                                                        lineHeight:
                                                                            1.1,
                                                                      ),
                                                                ),
                                                                tileColor: FlutterFlowTheme.of(
                                                                        context)
                                                                    .secondaryText,
                                                                activeColor:
                                                                    FlutterFlowTheme.of(
                                                                            context)
                                                                        .white,
                                                                activeTrackColor:
                                                                    FlutterFlowTheme.of(
                                                                            context)
                                                                        .primary,
                                                                dense: false,
                                                                controlAffinity:
                                                                    ListTileControlAffinity
                                                                        .trailing,
                                                                shape:
                                                                    RoundedRectangleBorder(
                                                                  borderRadius:
                                                                      BorderRadius
                                                                          .circular(
                                                                              16.0),
                                                                ),
                                                              ),
                                                            ),
                                                          ),
                                                          Container(
                                                            decoration:
                                                                BoxDecoration(
                                                              borderRadius:
                                                                  BorderRadius
                                                                      .circular(
                                                                          16.0),
                                                              border:
                                                                  Border.all(
                                                                color: FlutterFlowTheme.of(
                                                                        context)
                                                                    .grayAlpha,
                                                              ),
                                                            ),
                                                            child: Material(
                                                              color: Colors
                                                                  .transparent,
                                                              child:
                                                                  SwitchListTile
                                                                      .adaptive(
                                                                value: _model
                                                                        .switchListTileValue5 ??=
                                                                    FFAppState()
                                                                        .showTodayRequestsOnly,
                                                                onChanged:
                                                                    (newValue) async {
                                                                  safeSetState(() =>
                                                                      _model.switchListTileValue5 =
                                                                          newValue);
                                                                  if (newValue) {
                                                                    _model.requestsTodayOnlyOn =
                                                                        await UserSettingsTable()
                                                                            .update(
                                                                      data: {
                                                                        'show_todays_requests':
                                                                            true,
                                                                      },
                                                                      matchingRows:
                                                                          (rows) =>
                                                                              rows.eqOrNull(
                                                                        'email',
                                                                        currentUserEmail,
                                                                      ),
                                                                      returnRows:
                                                                          true,
                                                                    );
                                                                    FFAppState()
                                                                            .showTodayRequestsOnly =
                                                                        true;
                                                                    safeSetState(
                                                                        () {});

                                                                    safeSetState(
                                                                        () {});
                                                                  } else {
                                                                    _model.requestsTodayOnlyOff =
                                                                        await UserSettingsTable()
                                                                            .update(
                                                                      data: {
                                                                        'show_todays_requests':
                                                                            false,
                                                                      },
                                                                      matchingRows:
                                                                          (rows) =>
                                                                              rows.eqOrNull(
                                                                        'email',
                                                                        currentUserEmail,
                                                                      ),
                                                                      returnRows:
                                                                          true,
                                                                    );
                                                                    FFAppState()
                                                                            .showTodayRequestsOnly =
                                                                        false;
                                                                    safeSetState(
                                                                        () {});

                                                                    safeSetState(
                                                                        () {});
                                                                  }
                                                                },
                                                                title: Text(
                                                                  FFLocalizations.of(
                                                                          context)
                                                                      .getText(
                                                                    '42zojczc' /* Заявки */,
                                                                  ),
                                                                  style: FlutterFlowTheme.of(
                                                                          context)
                                                                      .titleSmall
                                                                      .override(
                                                                        fontFamily:
                                                                            'Roboto',
                                                                        color: FlutterFlowTheme.of(context)
                                                                            .primaryText,
                                                                        letterSpacing:
                                                                            0.0,
                                                                        fontWeight:
                                                                            FontWeight.bold,
                                                                      ),
                                                                ),
                                                                subtitle: Text(
                                                                  FFLocalizations.of(
                                                                          context)
                                                                      .getText(
                                                                    't8jrjjxi' /* Все необработанные. Включить -... */,
                                                                  ),
                                                                  style: FlutterFlowTheme.of(
                                                                          context)
                                                                      .labelMedium
                                                                      .override(
                                                                        fontFamily:
                                                                            'Montserrat',
                                                                        letterSpacing:
                                                                            0.0,
                                                                        lineHeight:
                                                                            1.1,
                                                                      ),
                                                                ),
                                                                tileColor: FlutterFlowTheme.of(
                                                                        context)
                                                                    .secondaryText,
                                                                activeColor:
                                                                    FlutterFlowTheme.of(
                                                                            context)
                                                                        .white,
                                                                activeTrackColor:
                                                                    FlutterFlowTheme.of(
                                                                            context)
                                                                        .primary,
                                                                dense: false,
                                                                controlAffinity:
                                                                    ListTileControlAffinity
                                                                        .trailing,
                                                                shape:
                                                                    RoundedRectangleBorder(
                                                                  borderRadius:
                                                                      BorderRadius
                                                                          .circular(
                                                                              16.0),
                                                                ),
                                                              ),
                                                            ),
                                                          ),
                                                          Container(
                                                            decoration:
                                                                BoxDecoration(
                                                              borderRadius:
                                                                  BorderRadius
                                                                      .circular(
                                                                          16.0),
                                                              border:
                                                                  Border.all(
                                                                color: FlutterFlowTheme.of(
                                                                        context)
                                                                    .grayAlpha,
                                                              ),
                                                            ),
                                                            child: Material(
                                                              color: Colors
                                                                  .transparent,
                                                              child:
                                                                  SwitchListTile
                                                                      .adaptive(
                                                                value: _model
                                                                        .switchListTileValue6 ??=
                                                                    FFAppState()
                                                                        .showMatchesTodayOnlyOnWaiting,
                                                                onChanged:
                                                                    (newValue) async {
                                                                  safeSetState(() =>
                                                                      _model.switchListTileValue6 =
                                                                          newValue);
                                                                  if (newValue) {
                                                                    _model.matchesInWaitingTodayOnlyOn =
                                                                        await UserSettingsTable()
                                                                            .update(
                                                                      data: {
                                                                        'show_only_todays_matches':
                                                                            true,
                                                                      },
                                                                      matchingRows:
                                                                          (rows) =>
                                                                              rows.eqOrNull(
                                                                        'email',
                                                                        currentUserEmail,
                                                                      ),
                                                                      returnRows:
                                                                          true,
                                                                    );
                                                                    FFAppState()
                                                                            .showMatchesTodayOnlyOnWaiting =
                                                                        true;
                                                                    safeSetState(
                                                                        () {});

                                                                    safeSetState(
                                                                        () {});
                                                                  } else {
                                                                    _model.matchesInWaitingTodayOnlyOnCopy =
                                                                        await UserSettingsTable()
                                                                            .update(
                                                                      data: {
                                                                        'show_only_todays_matches':
                                                                            false,
                                                                      },
                                                                      matchingRows:
                                                                          (rows) =>
                                                                              rows.eqOrNull(
                                                                        'email',
                                                                        currentUserEmail,
                                                                      ),
                                                                      returnRows:
                                                                          true,
                                                                    );
                                                                    FFAppState()
                                                                            .showMatchesTodayOnlyOnWaiting =
                                                                        false;
                                                                    safeSetState(
                                                                        () {});

                                                                    safeSetState(
                                                                        () {});
                                                                  }
                                                                },
                                                                title: Text(
                                                                  FFLocalizations.of(
                                                                          context)
                                                                      .getText(
                                                                    'mfj7kl2n' /* Лист ожидания */,
                                                                  ),
                                                                  style: FlutterFlowTheme.of(
                                                                          context)
                                                                      .titleSmall
                                                                      .override(
                                                                        fontFamily:
                                                                            'Roboto',
                                                                        color: FlutterFlowTheme.of(context)
                                                                            .primaryText,
                                                                        letterSpacing:
                                                                            0.0,
                                                                        fontWeight:
                                                                            FontWeight.bold,
                                                                      ),
                                                                ),
                                                                subtitle: Text(
                                                                  FFLocalizations.of(
                                                                          context)
                                                                      .getText(
                                                                    'pjz44g02' /* Вся очередь. Включить -- тольк... */,
                                                                  ),
                                                                  style: FlutterFlowTheme.of(
                                                                          context)
                                                                      .labelMedium
                                                                      .override(
                                                                        fontFamily:
                                                                            'Montserrat',
                                                                        letterSpacing:
                                                                            0.0,
                                                                        lineHeight:
                                                                            1.1,
                                                                      ),
                                                                ),
                                                                tileColor: FlutterFlowTheme.of(
                                                                        context)
                                                                    .secondaryText,
                                                                activeColor:
                                                                    FlutterFlowTheme.of(
                                                                            context)
                                                                        .white,
                                                                activeTrackColor:
                                                                    FlutterFlowTheme.of(
                                                                            context)
                                                                        .primary,
                                                                dense: false,
                                                                controlAffinity:
                                                                    ListTileControlAffinity
                                                                        .trailing,
                                                                shape:
                                                                    RoundedRectangleBorder(
                                                                  borderRadius:
                                                                      BorderRadius
                                                                          .circular(
                                                                              16.0),
                                                                ),
                                                              ),
                                                            ),
                                                          ),
                                                          Container(
                                                            decoration:
                                                                BoxDecoration(
                                                              borderRadius:
                                                                  BorderRadius
                                                                      .circular(
                                                                          16.0),
                                                              border:
                                                                  Border.all(
                                                                color: FlutterFlowTheme.of(
                                                                        context)
                                                                    .grayAlpha,
                                                              ),
                                                            ),
                                                            child: Material(
                                                              color: Colors
                                                                  .transparent,
                                                              child:
                                                                  SwitchListTile
                                                                      .adaptive(
                                                                value: _model
                                                                        .switchListTileValue7 ??=
                                                                    FFAppState()
                                                                        .showNewUsersDayly,
                                                                onChanged:
                                                                    (newValue) async {
                                                                  safeSetState(() =>
                                                                      _model.switchListTileValue7 =
                                                                          newValue);
                                                                  if (newValue) {
                                                                    _model.usersTodayOnlyOn =
                                                                        await UserSettingsTable()
                                                                            .update(
                                                                      data: {
                                                                        'show_todays_newusers':
                                                                            true,
                                                                      },
                                                                      matchingRows:
                                                                          (rows) =>
                                                                              rows.eqOrNull(
                                                                        'email',
                                                                        currentUserEmail,
                                                                      ),
                                                                      returnRows:
                                                                          true,
                                                                    );
                                                                    FFAppState()
                                                                            .showNewUsersDayly =
                                                                        true;
                                                                    safeSetState(
                                                                        () {});

                                                                    safeSetState(
                                                                        () {});
                                                                  } else {
                                                                    _model.usersTodayOnlyOff =
                                                                        await UserSettingsTable()
                                                                            .update(
                                                                      data: {
                                                                        'show_todays_newusers':
                                                                            false,
                                                                      },
                                                                      matchingRows:
                                                                          (rows) =>
                                                                              rows.eqOrNull(
                                                                        'email',
                                                                        currentUserEmail,
                                                                      ),
                                                                      returnRows:
                                                                          true,
                                                                    );
                                                                    FFAppState()
                                                                            .showNewUsersDayly =
                                                                        false;
                                                                    safeSetState(
                                                                        () {});

                                                                    safeSetState(
                                                                        () {});
                                                                  }
                                                                },
                                                                title: Text(
                                                                  FFLocalizations.of(
                                                                          context)
                                                                      .getText(
                                                                    'ah027tue' /* Пользователи */,
                                                                  ),
                                                                  style: FlutterFlowTheme.of(
                                                                          context)
                                                                      .titleSmall
                                                                      .override(
                                                                        fontFamily:
                                                                            'Roboto',
                                                                        color: FlutterFlowTheme.of(context)
                                                                            .primaryText,
                                                                        letterSpacing:
                                                                            0.0,
                                                                        fontWeight:
                                                                            FontWeight.bold,
                                                                      ),
                                                                ),
                                                                subtitle: Text(
                                                                  FFLocalizations.of(
                                                                          context)
                                                                      .getText(
                                                                    'pwxtacky' /* Новых за месяц. Включить -- то... */,
                                                                  ),
                                                                  style: FlutterFlowTheme.of(
                                                                          context)
                                                                      .labelMedium
                                                                      .override(
                                                                        fontFamily:
                                                                            'Montserrat',
                                                                        letterSpacing:
                                                                            0.0,
                                                                        lineHeight:
                                                                            1.1,
                                                                      ),
                                                                ),
                                                                tileColor: FlutterFlowTheme.of(
                                                                        context)
                                                                    .secondaryText,
                                                                activeColor:
                                                                    FlutterFlowTheme.of(
                                                                            context)
                                                                        .white,
                                                                activeTrackColor:
                                                                    FlutterFlowTheme.of(
                                                                            context)
                                                                        .primary,
                                                                dense: false,
                                                                controlAffinity:
                                                                    ListTileControlAffinity
                                                                        .trailing,
                                                                shape:
                                                                    RoundedRectangleBorder(
                                                                  borderRadius:
                                                                      BorderRadius
                                                                          .circular(
                                                                              16.0),
                                                                ),
                                                              ),
                                                            ),
                                                          ),
                                                        ].divide(SizedBox(
                                                            height: 12.0)),
                                                      ),
                                                    ),
                                                  ),
                                                ].divide(SizedBox(width: 16.0)),
                                              ),
                                            ),
                                          ),
                                        ),
                                      ],
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
                ],
              ),
            ),
          ),
        ));
  }
}
