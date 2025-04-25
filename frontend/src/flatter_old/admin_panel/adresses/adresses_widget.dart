import '/backend/supabase/supabase.dart';
import '/components/breadcrumps_widget.dart';
import '/components/create_adress_widget.dart';
import '/components/edit_adress_widget.dart';
import '/components/empty_table_placeholder_widget.dart';
import '/components/loc_geo_row_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/skeleton_multi_line_list_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/index.dart';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'adresses_model.dart';
export 'adresses_model.dart';

class AdressesWidget extends StatefulWidget {
  const AdressesWidget({super.key});

  static String routeName = 'adresses';
  static String routePath = '/adresses';

  @override
  State<AdressesWidget> createState() => _AdressesWidgetState();
}

class _AdressesWidgetState extends State<AdressesWidget>
    with TickerProviderStateMixin {
  late AdressesModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  final animationsMap = <String, AnimationInfo>{};

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => AdressesModel());

    animationsMap.addAll({
      'containerOnPageLoadAnimation': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.easeInOut,
            delay: 600.0.ms,
            duration: 800.0.ms,
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
    _model.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Title(
        title: 'adresses',
        color: FlutterFlowTheme.of(context).primary.withAlpha(0XFF),
        child: GestureDetector(
          onTap: () {
            FocusScope.of(context).unfocus();
            FocusManager.instance.primaryFocus?.unfocus();
          },
          child: Scaffold(
            key: scaffoldKey,
            backgroundColor: FlutterFlowTheme.of(context).primaryBackground,
            endDrawer: Container(
              width: 390.0,
              child: Drawer(
                child: Container(
                  decoration: BoxDecoration(
                    color: FlutterFlowTheme.of(context).secondaryBackground,
                  ),
                  child: Builder(
                    builder: (context) {
                      if (!_model.createNewAdress) {
                        return wrapWithModel(
                          model: _model.editAdressModel,
                          updateCallback: () => safeSetState(() {}),
                          updateOnChange: true,
                          child: EditAdressWidget(
                            id: valueOrDefault<String>(
                              _model.locID,
                              'ADR',
                            ),
                            isConfirmed: (isConfirmed) async {
                              safeSetState(
                                  () => _model.requestCompleter = null);
                              await _model.waitForRequestCompleted();
                              _model.isConfirmed = false;
                              safeSetState(() {});
                            },
                          ),
                        );
                      } else {
                        return wrapWithModel(
                          model: _model.createAdressModel,
                          updateCallback: () => safeSetState(() {}),
                          updateOnChange: true,
                          child: CreateAdressWidget(),
                        );
                      }
                    },
                  ),
                ),
              ),
            ),
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
                      alignment: AlignmentDirectional(0.0, -1.0),
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
                        child: Column(
                          mainAxisSize: MainAxisSize.max,
                          children: [
                            Align(
                              alignment: AlignmentDirectional(0.0, -1.0),
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
                                child: Column(
                                  mainAxisSize: MainAxisSize.max,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          16.0, 0.0, 16.0, 0.0),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.max,
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          InkWell(
                                            splashColor: Colors.transparent,
                                            focusColor: Colors.transparent,
                                            hoverColor: Colors.transparent,
                                            highlightColor: Colors.transparent,
                                            onTap: () async {
                                              context.pushNamed(
                                                  FranchasingWidget.routeName);
                                            },
                                            child: wrapWithModel(
                                              model: _model.breadcrumpsModel,
                                              updateCallback: () =>
                                                  safeSetState(() {}),
                                              updateOnChange: true,
                                              child: BreadcrumpsWidget(
                                                iconForSection: Icon(
                                                  Icons.business_center_rounded,
                                                  color: FlutterFlowTheme.of(
                                                          context)
                                                      .secondaryText,
                                                  size: 22.0,
                                                ),
                                                currentSectionTittle:
                                                    valueOrDefault<String>(
                                                  FFLocalizations.of(context)
                                                      .getVariableText(
                                                    ruText: 'Франчайзинг',
                                                    enText: 'Franchising',
                                                  ),
                                                  'Франчайзинг',
                                                ),
                                                isSubpage: false,
                                              ),
                                            ),
                                          ),
                                          Row(
                                            mainAxisSize: MainAxisSize.max,
                                            children: [
                                              if (responsiveVisibility(
                                                context: context,
                                                phone: false,
                                                tablet: false,
                                              ))
                                                Align(
                                                  alignment:
                                                      AlignmentDirectional(
                                                          0.0, 0.0),
                                                  child: FFButtonWidget(
                                                    onPressed: () async {
                                                      _model.createNewAdress =
                                                          true;
                                                      safeSetState(() {});
                                                      scaffoldKey.currentState!
                                                          .openEndDrawer();
                                                    },
                                                    text: FFLocalizations.of(
                                                            context)
                                                        .getText(
                                                      '1natc96v' /* Адрес */,
                                                    ),
                                                    icon: Icon(
                                                      Icons.add_rounded,
                                                      size: 15.0,
                                                    ),
                                                    options: FFButtonOptions(
                                                      height: 48.0,
                                                      padding:
                                                          EdgeInsetsDirectional
                                                              .fromSTEB(
                                                                  16.0,
                                                                  0.0,
                                                                  16.0,
                                                                  0.0),
                                                      iconPadding:
                                                          EdgeInsetsDirectional
                                                              .fromSTEB(
                                                                  0.0,
                                                                  0.0,
                                                                  0.0,
                                                                  0.0),
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .primary,
                                                      textStyle:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .labelLarge
                                                              .override(
                                                                fontFamily:
                                                                    'Montserrat',
                                                                color: FlutterFlowTheme.of(
                                                                        context)
                                                                    .info,
                                                                fontSize: 16.0,
                                                                letterSpacing:
                                                                    0.0,
                                                                fontWeight:
                                                                    FontWeight
                                                                        .w600,
                                                              ),
                                                      elevation: 1.0,
                                                      borderSide: BorderSide(
                                                        color:
                                                            Colors.transparent,
                                                        width: 1.0,
                                                      ),
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                              16.0),
                                                    ),
                                                  ),
                                                ),
                                              if (responsiveVisibility(
                                                context: context,
                                                tabletLandscape: false,
                                                desktop: false,
                                              ))
                                                FlutterFlowIconButton(
                                                  borderColor:
                                                      FlutterFlowTheme.of(
                                                              context)
                                                          .primary,
                                                  borderRadius: 16.0,
                                                  borderWidth: 1.0,
                                                  buttonSize: 48.0,
                                                  fillColor:
                                                      FlutterFlowTheme.of(
                                                              context)
                                                          .primary,
                                                  icon: Icon(
                                                    Icons.add,
                                                    color: FlutterFlowTheme.of(
                                                            context)
                                                        .info,
                                                    size: 24.0,
                                                  ),
                                                  onPressed: () async {
                                                    _model.createNewAdress =
                                                        true;
                                                    safeSetState(() {});
                                                    scaffoldKey.currentState!
                                                        .openEndDrawer();
                                                  },
                                                ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          16.0, 0.0, 16.0, 0.0),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.max,
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          Expanded(
                                            child: Align(
                                              alignment: AlignmentDirectional(
                                                  -1.0, 0.0),
                                              child: wrapWithModel(
                                                model: _model
                                                    .tittleWithIconAndSubtittleModel,
                                                updateCallback: () =>
                                                    safeSetState(() {}),
                                                child:
                                                    TittleWithIconAndSubtittleWidget(
                                                  tittle:
                                                      valueOrDefault<String>(
                                                    FFLocalizations.of(context)
                                                        .getVariableText(
                                                      ruText: 'Адреса',
                                                      enText: 'Geo',
                                                    ),
                                                    'Адреса',
                                                  ),
                                                  hasIcon: false,
                                                  hasSubtittle: false,
                                                  margin: 24,
                                                ),
                                              ),
                                            ),
                                          ),
                                        ].divide(SizedBox(width: 16.0)),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            Padding(
                              padding: EdgeInsetsDirectional.fromSTEB(
                                  0.0, 0.0, 0.0, 16.0),
                              child: Column(
                                mainAxisSize: MainAxisSize.max,
                                children: [
                                  Padding(
                                    padding: EdgeInsetsDirectional.fromSTEB(
                                        16.0, 16.0, 24.0, 0.0),
                                    child: Container(
                                      width: double.infinity,
                                      height: 40.0,
                                      decoration: BoxDecoration(
                                        color: FlutterFlowTheme.of(context)
                                            .primaryBackground,
                                        borderRadius: BorderRadius.only(
                                          bottomLeft: Radius.circular(0.0),
                                          bottomRight: Radius.circular(0.0),
                                          topLeft: Radius.circular(16.0),
                                          topRight: Radius.circular(16.0),
                                        ),
                                      ),
                                      child: Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            16.0, 0.0, 16.0, 0.0),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.max,
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            Padding(
                                              padding: EdgeInsetsDirectional
                                                  .fromSTEB(
                                                      16.0, 0.0, 0.0, 0.0),
                                              child: Container(
                                                width: 100.0,
                                                decoration: BoxDecoration(),
                                                child: Text(
                                                  FFLocalizations.of(context)
                                                      .getText(
                                                    '0gk5zdhx' /* Название */,
                                                  ),
                                                  style: FlutterFlowTheme.of(
                                                          context)
                                                      .bodySmall
                                                      .override(
                                                        fontFamily:
                                                            'Montserrat',
                                                        color:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .secondaryText,
                                                        letterSpacing: 0.0,
                                                      ),
                                                ),
                                              ),
                                            ),
                                            Container(
                                              width: 80.0,
                                              decoration: BoxDecoration(),
                                              child: Text(
                                                FFLocalizations.of(context)
                                                    .getText(
                                                  'obpk8dhb' /* ID */,
                                                ),
                                                style: FlutterFlowTheme.of(
                                                        context)
                                                    .bodySmall
                                                    .override(
                                                      fontFamily: 'Montserrat',
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .secondaryText,
                                                      letterSpacing: 0.0,
                                                    ),
                                              ),
                                            ),
                                            Container(
                                              width: 40.0,
                                              decoration: BoxDecoration(),
                                              child: Text(
                                                FFLocalizations.of(context)
                                                    .getText(
                                                  'tr5pdggs' /* Фр. */,
                                                ),
                                                style: FlutterFlowTheme.of(
                                                        context)
                                                    .bodySmall
                                                    .override(
                                                      fontFamily: 'Montserrat',
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .secondaryText,
                                                      letterSpacing: 0.0,
                                                    ),
                                              ),
                                            ),
                                            Expanded(
                                              flex: 2,
                                              child: Container(
                                                width: 260.0,
                                                decoration: BoxDecoration(),
                                                child: Visibility(
                                                  visible: responsiveVisibility(
                                                    context: context,
                                                    phone: false,
                                                  ),
                                                  child: Text(
                                                    FFLocalizations.of(context)
                                                        .getText(
                                                      '1cowem73' /* Адрес */,
                                                    ),
                                                    style: FlutterFlowTheme.of(
                                                            context)
                                                        .bodySmall
                                                        .override(
                                                          fontFamily:
                                                              'Montserrat',
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .secondaryText,
                                                          letterSpacing: 0.0,
                                                        ),
                                                  ),
                                                ),
                                              ),
                                            ),
                                            Container(
                                              constraints: BoxConstraints(
                                                minWidth: 106.0,
                                              ),
                                              decoration: BoxDecoration(),
                                              child: Text(
                                                FFLocalizations.of(context)
                                                    .getText(
                                                  's5ox3mlz' /* Тир цен */,
                                                ),
                                                style: FlutterFlowTheme.of(
                                                        context)
                                                    .bodySmall
                                                    .override(
                                                      fontFamily: 'Montserrat',
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .secondaryText,
                                                      letterSpacing: 0.0,
                                                    ),
                                              ),
                                            ),
                                            if (responsiveVisibility(
                                              context: context,
                                              phone: false,
                                              tablet: false,
                                            ))
                                              Expanded(
                                                flex: 2,
                                                child: Container(
                                                  width: 100.0,
                                                  decoration: BoxDecoration(),
                                                  child: Visibility(
                                                    visible:
                                                        responsiveVisibility(
                                                      context: context,
                                                      phone: false,
                                                      tablet: false,
                                                    ),
                                                    child: Text(
                                                      FFLocalizations.of(
                                                              context)
                                                          .getText(
                                                        'oh7ym9s2' /* Адрес на сайте */,
                                                      ),
                                                      textAlign: TextAlign.end,
                                                      style:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .bodySmall
                                                              .override(
                                                                fontFamily:
                                                                    'Montserrat',
                                                                color: FlutterFlowTheme.of(
                                                                        context)
                                                                    .secondaryText,
                                                                letterSpacing:
                                                                    0.0,
                                                              ),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                            Container(
                                              width: 48.0,
                                              height: 48.0,
                                              decoration: BoxDecoration(),
                                            ),
                                          ].divide(SizedBox(width: 12.0)),
                                        ),
                                      ),
                                    ),
                                  ),
                                  FutureBuilder<List<LocGeoRow>>(
                                    future: (_model.requestCompleter ??=
                                            Completer<List<LocGeoRow>>()
                                              ..complete(
                                                  LocGeoTable().queryRows(
                                                queryFn: (q) =>
                                                    q.order('loc_id'),
                                              )))
                                        .future,
                                    builder: (context, snapshot) {
                                      // Customize what your widget looks like when it's loading.
                                      if (!snapshot.hasData) {
                                        return SkeletonMultiLineListWidget(
                                          height: 36.0,
                                          itemsQty: 4,
                                          radii: 16,
                                          spacer: 24,
                                          between: 4,
                                        );
                                      }
                                      List<LocGeoRow> containerLocGeoRowList =
                                          snapshot.data!;

                                      return Container(
                                        constraints: BoxConstraints(
                                          maxHeight: 600.0,
                                        ),
                                        decoration: BoxDecoration(),
                                        child: Builder(
                                          builder: (context) {
                                            final containerVar =
                                                containerLocGeoRowList
                                                    .map((e) => e)
                                                    .toList();
                                            if (containerVar.isEmpty) {
                                              return EmptyTablePlaceholderWidget(
                                                placeholderText:
                                                    'Еще нет адресов',
                                              );
                                            }

                                            return ListView.builder(
                                              padding: EdgeInsets.zero,
                                              scrollDirection: Axis.vertical,
                                              itemCount: containerVar.length,
                                              itemBuilder:
                                                  (context, containerVarIndex) {
                                                final containerVarItem =
                                                    containerVar[
                                                        containerVarIndex];
                                                return Padding(
                                                  padding: EdgeInsetsDirectional
                                                      .fromSTEB(
                                                          0.0, 0.0, 0.0, 2.0),
                                                  child: InkWell(
                                                    splashColor:
                                                        Colors.transparent,
                                                    focusColor:
                                                        Colors.transparent,
                                                    hoverColor:
                                                        Colors.transparent,
                                                    highlightColor:
                                                        Colors.transparent,
                                                    onTap: () async {
                                                      scaffoldKey.currentState!
                                                          .openEndDrawer();
                                                      _model.locID =
                                                          containerVarItem
                                                              .locId;
                                                      _model.createNewAdress =
                                                          false;
                                                      safeSetState(() {});
                                                      await Future.wait([
                                                        Future(() async {
                                                          safeSetState(() {
                                                            _model
                                                                    .editAdressModel
                                                                    .nameTextController
                                                                    ?.text =
                                                                containerVarItem
                                                                    .ruName;
                                                          });
                                                        }),
                                                        Future(() async {
                                                          safeSetState(() {
                                                            _model
                                                                    .editAdressModel
                                                                    .idTextController
                                                                    ?.text =
                                                                containerVarItem
                                                                    .locId;
                                                          });
                                                        }),
                                                        Future(() async {
                                                          safeSetState(() {
                                                            _model
                                                                    .editAdressModel
                                                                    .adressTextController1
                                                                    ?.text =
                                                                containerVarItem
                                                                    .adress!;
                                                          });
                                                        }),
                                                        Future(() async {
                                                          safeSetState(() {
                                                            _model
                                                                    .editAdressModel
                                                                    .forSiteTextController
                                                                    ?.text =
                                                                containerVarItem
                                                                    .siteAdress!;
                                                          });
                                                        }),
                                                        Future(() async {
                                                          safeSetState(() {
                                                            _model
                                                                    .editAdressModel
                                                                    .dropDownFrValueController
                                                                    ?.value =
                                                                containerVarItem
                                                                    .franchisee!;
                                                          });
                                                        }),
                                                        Future(() async {
                                                          safeSetState(() {
                                                            _model
                                                                    .editAdressModel
                                                                    .dropDownPricesValueController
                                                                    ?.value =
                                                                containerVarItem
                                                                    .areaPrice!;
                                                          });
                                                        }),
                                                      ]);
                                                    },
                                                    child: wrapWithModel(
                                                      model: _model
                                                          .locGeoRowModels
                                                          .getModel(
                                                        containerVarItem.locId,
                                                        containerVarIndex,
                                                      ),
                                                      updateCallback: () =>
                                                          safeSetState(() {}),
                                                      updateOnChange: true,
                                                      child: LocGeoRowWidget(
                                                        key: Key(
                                                          'Key9h9_${containerVarItem.locId}',
                                                        ),
                                                        id: containerVarItem
                                                            .locId,
                                                      ),
                                                    ),
                                                  ),
                                                );
                                              },
                                            );
                                          },
                                        ),
                                      ).animateOnPageLoad(animationsMap[
                                          'containerOnPageLoadAnimation']!);
                                    },
                                  ),
                                ],
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
        ));
  }
}
