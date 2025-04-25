import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/components/breadcrumps_widget.dart';
import '/components/empty_table_placeholder_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/submenu_item_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_data_table.dart';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import 'locpreview_model.dart';
export 'locpreview_model.dart';

class LocpreviewWidget extends StatefulWidget {
  const LocpreviewWidget({
    super.key,
    String? locID,
    required this.locAdress,
    String? locName,
    String? city,
    int? mTotal,
    int? mAvailable,
    int? sTotal,
    int? sAvailable,
    int? xsTotal,
    int? xsAvailable,
  })  : this.locID = locID ?? 'Кудрово-1',
        this.locName = locName ?? 'locName',
        this.city = city ?? 'city',
        this.mTotal = mTotal ?? 0,
        this.mAvailable = mAvailable ?? 0,
        this.sTotal = sTotal ?? 0,
        this.sAvailable = sAvailable ?? 0,
        this.xsTotal = xsTotal ?? 0,
        this.xsAvailable = xsAvailable ?? 0;

  final String locID;
  final String? locAdress;
  final String locName;
  final String city;
  final int mTotal;
  final int mAvailable;
  final int sTotal;
  final int sAvailable;
  final int xsTotal;
  final int xsAvailable;

  static String routeName = 'locpreview';
  static String routePath = '/locID';

  @override
  State<LocpreviewWidget> createState() => _LocpreviewWidgetState();
}

class _LocpreviewWidgetState extends State<LocpreviewWidget>
    with TickerProviderStateMixin {
  late LocpreviewModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  final animationsMap = <String, AnimationInfo>{};

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => LocpreviewModel());

    // On page load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      FFAppState().currentPage = Pages.locs;
      safeSetState(() {});
    });

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
    context.watch<FFAppState>();

    return Title(
        title: 'locID',
        color: FlutterFlowTheme.of(context).primary.withAlpha(0XFF),
        child: GestureDetector(
          onTap: () {
            FocusScope.of(context).unfocus();
            FocusManager.instance.primaryFocus?.unfocus();
          },
          child: Scaffold(
            key: scaffoldKey,
            backgroundColor: FlutterFlowTheme.of(context).secondaryBackground,
            appBar: MediaQuery.sizeOf(context).width <= 991.0
                ? AppBar(
                    backgroundColor:
                        FlutterFlowTheme.of(context).secondaryBackground,
                    automaticallyImplyLeading: false,
                    leading: FlutterFlowIconButton(
                      borderColor: Colors.transparent,
                      borderRadius: 30.0,
                      borderWidth: 1.0,
                      buttonSize: 60.0,
                      icon: Icon(
                        Icons.arrow_back_rounded,
                        color: FlutterFlowTheme.of(context).primaryText,
                        size: 30.0,
                      ),
                      onPressed: () async {
                        context.pop();
                      },
                    ),
                    title: Text(
                      FFLocalizations.of(context).getText(
                        'usosrcd9' /* Order Details */,
                      ),
                      style: FlutterFlowTheme.of(context).bodyLarge.override(
                            fontFamily: 'Montserrat',
                            letterSpacing: 0.0,
                          ),
                    ),
                    actions: [],
                    centerTitle: false,
                    elevation: 0.0,
                  )
                : null,
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
                      child: FutureBuilder<List<Cellstatusview1PlusClientsRow>>(
                        future: Cellstatusview1PlusClientsTable().queryRows(
                          queryFn: (q) => q.eqOrNull(
                            'location_id',
                            widget.locID,
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
                          List<Cellstatusview1PlusClientsRow>
                              maxWidthCellstatusview1PlusClientsRowList =
                              snapshot.data!;

                          return Container(
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
                                              InkWell(
                                                splashColor: Colors.transparent,
                                                focusColor: Colors.transparent,
                                                hoverColor: Colors.transparent,
                                                highlightColor:
                                                    Colors.transparent,
                                                onTap: () async {
                                                  context.pushNamed(
                                                      LocsWidget.routeName);
                                                },
                                                child: wrapWithModel(
                                                  model:
                                                      _model.breadcrumpsModel,
                                                  updateCallback: () =>
                                                      safeSetState(() {}),
                                                  updateOnChange: true,
                                                  child: BreadcrumpsWidget(
                                                    iconForSection: FaIcon(
                                                      FontAwesomeIcons.route,
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .secondaryText,
                                                      size: 22.0,
                                                    ),
                                                    currentSectionTittle:
                                                        valueOrDefault<String>(
                                                      FFLocalizations.of(
                                                              context)
                                                          .getVariableText(
                                                        ruText: 'Локации',
                                                        enText: 'Locations',
                                                      ),
                                                      'Локации',
                                                    ),
                                                    isSubpage: false,
                                                  ),
                                                ),
                                              ),
                                              if (responsiveVisibility(
                                                context: context,
                                                phone: false,
                                              ))
                                                Row(
                                                  mainAxisSize:
                                                      MainAxisSize.max,
                                                  children: [
                                                    InkWell(
                                                      splashColor:
                                                          Colors.transparent,
                                                      focusColor:
                                                          Colors.transparent,
                                                      hoverColor:
                                                          Colors.transparent,
                                                      highlightColor:
                                                          Colors.transparent,
                                                      onTap: () async {
                                                        context.pushNamed(
                                                            PricesWidget
                                                                .routeName);
                                                      },
                                                      child: wrapWithModel(
                                                        model: _model
                                                            .submenuItem2Model1,
                                                        updateCallback: () =>
                                                            safeSetState(() {}),
                                                        child:
                                                            SubmenuItemWidget(
                                                          tittle: 'Цены',
                                                        ),
                                                      ),
                                                    ),
                                                    InkWell(
                                                      splashColor:
                                                          Colors.transparent,
                                                      focusColor:
                                                          Colors.transparent,
                                                      hoverColor:
                                                          Colors.transparent,
                                                      highlightColor:
                                                          Colors.transparent,
                                                      onTap: () async {
                                                        context.pushNamed(
                                                            BookingWidget
                                                                .routeName);
                                                      },
                                                      child: wrapWithModel(
                                                        model: _model
                                                            .submenuItembookModel,
                                                        updateCallback: () =>
                                                            safeSetState(() {}),
                                                        child:
                                                            SubmenuItemWidget(
                                                          tittle:
                                                              'Бронирования',
                                                        ),
                                                      ),
                                                    ),
                                                  ].divide(
                                                      SizedBox(width: 8.0)),
                                                ),
                                            ],
                                          ),
                                        ),
                                        if (responsiveVisibility(
                                          context: context,
                                          tablet: false,
                                          tabletLandscape: false,
                                          desktop: false,
                                        ))
                                          Column(
                                            mainAxisSize: MainAxisSize.max,
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Divider(
                                                height: 2.0,
                                                thickness: 1.0,
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .accent4,
                                              ),
                                              Align(
                                                alignment: AlignmentDirectional(
                                                    -1.0, 0.0),
                                                child: Padding(
                                                  padding: EdgeInsetsDirectional
                                                      .fromSTEB(
                                                          84.0, 0.0, 0.0, 0.0),
                                                  child: Row(
                                                    mainAxisSize:
                                                        MainAxisSize.min,
                                                    children: [
                                                      InkWell(
                                                        splashColor:
                                                            Colors.transparent,
                                                        focusColor:
                                                            Colors.transparent,
                                                        hoverColor:
                                                            Colors.transparent,
                                                        highlightColor:
                                                            Colors.transparent,
                                                        onTap: () async {
                                                          context.pushNamed(
                                                              PricesWidget
                                                                  .routeName);
                                                        },
                                                        child: wrapWithModel(
                                                          model: _model
                                                              .submenuItem2Model2,
                                                          updateCallback: () =>
                                                              safeSetState(
                                                                  () {}),
                                                          child:
                                                              SubmenuItemWidget(
                                                            tittle: 'Цены',
                                                          ),
                                                        ),
                                                      ),
                                                      InkWell(
                                                        splashColor:
                                                            Colors.transparent,
                                                        focusColor:
                                                            Colors.transparent,
                                                        hoverColor:
                                                            Colors.transparent,
                                                        highlightColor:
                                                            Colors.transparent,
                                                        onTap: () async {
                                                          context.pushNamed(
                                                              BookingWidget
                                                                  .routeName);
                                                        },
                                                        child: wrapWithModel(
                                                          model: _model
                                                              .submenuItempriceModel,
                                                          updateCallback: () =>
                                                              safeSetState(
                                                                  () {}),
                                                          child:
                                                              SubmenuItemWidget(
                                                            tittle:
                                                                'Бронирования',
                                                          ),
                                                        ),
                                                      ),
                                                    ].divide(
                                                        SizedBox(width: 8.0)),
                                                  ),
                                                ),
                                              ),
                                              Divider(
                                                height: 2.0,
                                                thickness: 1.0,
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .accent4,
                                              ),
                                            ],
                                          ),
                                        Padding(
                                          padding:
                                              EdgeInsetsDirectional.fromSTEB(
                                                  16.0,
                                                  valueOrDefault<double>(
                                                    () {
                                                      if (MediaQuery.sizeOf(
                                                                  context)
                                                              .width <
                                                          kBreakpointSmall) {
                                                        return 0.0;
                                                      } else if (MediaQuery
                                                                  .sizeOf(
                                                                      context)
                                                              .width <
                                                          kBreakpointMedium) {
                                                        return 24.0;
                                                      } else if (MediaQuery
                                                                  .sizeOf(
                                                                      context)
                                                              .width <
                                                          kBreakpointLarge) {
                                                        return 24.0;
                                                      } else {
                                                        return 24.0;
                                                      }
                                                    }(),
                                                    24.0,
                                                  ),
                                                  16.0,
                                                  0.0),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.max,
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Expanded(
                                                child: Align(
                                                  alignment:
                                                      AlignmentDirectional(
                                                          0.0, -1.0),
                                                  child: Padding(
                                                    padding:
                                                        EdgeInsetsDirectional
                                                            .fromSTEB(0.0, 0.0,
                                                                0.0, 16.0),
                                                    child: wrapWithModel(
                                                      model: _model
                                                          .tittleWithIconAndSubtittleModel,
                                                      updateCallback: () =>
                                                          safeSetState(() {}),
                                                      child:
                                                          TittleWithIconAndSubtittleWidget(
                                                        tittle: valueOrDefault<
                                                            String>(
                                                          widget.locName,
                                                          'locName',
                                                        ),
                                                        subtittle:
                                                            '${widget.city}, ${widget.locAdress}',
                                                        hasIcon: false,
                                                        hasSubtittle: true,
                                                        margin: 24,
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                            ].divide(SizedBox(width: 16.0)),
                                          ),
                                        ),
                                        Padding(
                                          padding:
                                              EdgeInsetsDirectional.fromSTEB(
                                                  16.0, 0.0, 16.0, 0.0),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.max,
                                            children: [
                                              Container(
                                                width: 340.0,
                                                decoration: BoxDecoration(
                                                  color: FlutterFlowTheme.of(
                                                          context)
                                                      .primaryBackground,
                                                  boxShadow: [
                                                    BoxShadow(
                                                      blurRadius: 1.0,
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .grayAlpha,
                                                      offset: Offset(
                                                        0.0,
                                                        1.0,
                                                      ),
                                                    )
                                                  ],
                                                  borderRadius:
                                                      BorderRadius.circular(
                                                          12.0),
                                                ),
                                                child: Padding(
                                                  padding: EdgeInsetsDirectional
                                                      .fromSTEB(
                                                          0.0, 0.0, 0.0, 4.0),
                                                  child: Column(
                                                    mainAxisSize:
                                                        MainAxisSize.max,
                                                    children: [],
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
                                ListView(
                                  padding: EdgeInsets.zero,
                                  shrinkWrap: true,
                                  scrollDirection: Axis.vertical,
                                  children: [
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          0.0, 0.0, 24.0, 0.0),
                                      child: Container(
                                        constraints: BoxConstraints(
                                          minHeight: MediaQuery.sizeOf(context)
                                                  .height *
                                              0.3,
                                          maxHeight: MediaQuery.sizeOf(context)
                                                  .height *
                                              0.8,
                                        ),
                                        decoration: BoxDecoration(),
                                        child: Align(
                                          alignment:
                                              AlignmentDirectional(-1.0, -1.0),
                                          child: Padding(
                                            padding:
                                                EdgeInsetsDirectional.fromSTEB(
                                                    22.0, 16.0, 0.0, 0.0),
                                            child: Builder(
                                              builder: (context) {
                                                final cellsInLoc =
                                                    maxWidthCellstatusview1PlusClientsRowList
                                                        .map((e) => e)
                                                        .toList();
                                                if (cellsInLoc.isEmpty) {
                                                  return EmptyTablePlaceholderWidget(
                                                    placeholderText:
                                                        'Нет клиентов по заданным параметрам',
                                                  );
                                                }

                                                return FlutterFlowDataTable<
                                                    Cellstatusview1PlusClientsRow>(
                                                  controller: _model
                                                      .paginatedDataTableController,
                                                  data: cellsInLoc,
                                                  columnsBuilder:
                                                      (onSortChanged) => [
                                                    DataColumn2(
                                                      label: DefaultTextStyle
                                                          .merge(
                                                        softWrap: true,
                                                        child: Padding(
                                                          padding: EdgeInsetsDirectional
                                                              .fromSTEB(
                                                                  valueOrDefault<
                                                                      double>(
                                                                    () {
                                                                      if (MediaQuery.sizeOf(context)
                                                                              .width <
                                                                          kBreakpointSmall) {
                                                                        return 0.0;
                                                                      } else if (MediaQuery.sizeOf(context)
                                                                              .width <
                                                                          kBreakpointMedium) {
                                                                        return 16.0;
                                                                      } else if (MediaQuery.sizeOf(context)
                                                                              .width <
                                                                          kBreakpointLarge) {
                                                                        return 24.0;
                                                                      } else {
                                                                        return 24.0;
                                                                      }
                                                                    }(),
                                                                    24.0,
                                                                  ),
                                                                  0.0,
                                                                  0.0,
                                                                  0.0),
                                                          child: Text(
                                                            FFLocalizations.of(
                                                                    context)
                                                                .getText(
                                                              'qp6ukyp6' /* ID ячейки */,
                                                            ),
                                                            style: FlutterFlowTheme
                                                                    .of(context)
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
                                                      fixedWidth:
                                                          valueOrDefault<
                                                              double>(
                                                        () {
                                                          if (MediaQuery.sizeOf(
                                                                      context)
                                                                  .width <
                                                              kBreakpointSmall) {
                                                            return 160.0;
                                                          } else if (MediaQuery
                                                                      .sizeOf(
                                                                          context)
                                                                  .width <
                                                              kBreakpointMedium) {
                                                            return 240.0;
                                                          } else if (MediaQuery
                                                                      .sizeOf(
                                                                          context)
                                                                  .width <
                                                              kBreakpointLarge) {
                                                            return 280.0;
                                                          } else {
                                                            return 280.0;
                                                          }
                                                        }(),
                                                        280.0,
                                                      ),
                                                      onSort: onSortChanged,
                                                    ),
                                                    DataColumn2(
                                                      label: DefaultTextStyle
                                                          .merge(
                                                        softWrap: true,
                                                        child: Text(
                                                          FFLocalizations.of(
                                                                  context)
                                                              .getText(
                                                            '216qi9p1' /* Статус */,
                                                          ),
                                                          style: FlutterFlowTheme
                                                                  .of(context)
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
                                                      onSort: onSortChanged,
                                                    ),
                                                    DataColumn2(
                                                      label: DefaultTextStyle
                                                          .merge(
                                                        softWrap: true,
                                                        child: Visibility(
                                                          visible:
                                                              responsiveVisibility(
                                                            context: context,
                                                            phone: false,
                                                          ),
                                                          child: Align(
                                                            alignment:
                                                                AlignmentDirectional(
                                                                    0.0, 0.0),
                                                            child: Text(
                                                              FFLocalizations.of(
                                                                      context)
                                                                  .getText(
                                                                '0qa3eyl5' /* Размер */,
                                                              ),
                                                              textAlign:
                                                                  TextAlign
                                                                      .center,
                                                              style: FlutterFlowTheme
                                                                      .of(context)
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
                                                      fixedWidth:
                                                          valueOrDefault<
                                                              double>(
                                                        () {
                                                          if (MediaQuery.sizeOf(
                                                                      context)
                                                                  .width <
                                                              kBreakpointSmall) {
                                                            return 0.0;
                                                          } else if (MediaQuery
                                                                      .sizeOf(
                                                                          context)
                                                                  .width <
                                                              kBreakpointMedium) {
                                                            return 120.0;
                                                          } else if (MediaQuery
                                                                      .sizeOf(
                                                                          context)
                                                                  .width <
                                                              kBreakpointLarge) {
                                                            return 120.0;
                                                          } else {
                                                            return 120.0;
                                                          }
                                                        }(),
                                                        120.0,
                                                      ),
                                                      onSort: onSortChanged,
                                                    ),
                                                    DataColumn2(
                                                      label: DefaultTextStyle
                                                          .merge(
                                                        softWrap: true,
                                                        child: Visibility(
                                                          visible:
                                                              responsiveVisibility(
                                                            context: context,
                                                            phone: false,
                                                          ),
                                                          child: Text(
                                                            FFLocalizations.of(
                                                                    context)
                                                                .getText(
                                                              'dp2v21ah' /* Истекает */,
                                                            ),
                                                            style: FlutterFlowTheme
                                                                    .of(context)
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
                                                      fixedWidth:
                                                          valueOrDefault<
                                                              double>(
                                                        () {
                                                          if (MediaQuery.sizeOf(
                                                                      context)
                                                                  .width <
                                                              kBreakpointSmall) {
                                                            return 160.0;
                                                          } else if (MediaQuery
                                                                      .sizeOf(
                                                                          context)
                                                                  .width <
                                                              kBreakpointMedium) {
                                                            return 240.0;
                                                          } else if (MediaQuery
                                                                      .sizeOf(
                                                                          context)
                                                                  .width <
                                                              kBreakpointLarge) {
                                                            return 280.0;
                                                          } else {
                                                            return 280.0;
                                                          }
                                                        }(),
                                                        280.0,
                                                      ),
                                                      onSort: onSortChanged,
                                                    ),
                                                    DataColumn2(
                                                      label: DefaultTextStyle
                                                          .merge(
                                                        softWrap: true,
                                                        child: Text(
                                                          FFLocalizations.of(
                                                                  context)
                                                              .getText(
                                                            'p7k573kb' /* Клиент */,
                                                          ),
                                                          style: FlutterFlowTheme
                                                                  .of(context)
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
                                                  ],
                                                  dataRowBuilder:
                                                      (cellsInLocItem,
                                                              cellsInLocIndex,
                                                              selected,
                                                              onSelectChanged) =>
                                                          DataRow(
                                                    color: WidgetStateProperty
                                                        .all(
                                                      cellsInLocIndex % 2 == 0
                                                          ? FlutterFlowTheme.of(
                                                                  context)
                                                              .secondaryBackground
                                                          : FlutterFlowTheme.of(
                                                                  context)
                                                              .tertiaryBackground,
                                                    ),
                                                    cells: [
                                                      Visibility(
                                                        visible:
                                                            responsiveVisibility(
                                                          context: context,
                                                          phone: false,
                                                        ),
                                                        child: Padding(
                                                          padding: EdgeInsetsDirectional
                                                              .fromSTEB(
                                                                  valueOrDefault<
                                                                      double>(
                                                                    () {
                                                                      if (MediaQuery.sizeOf(context)
                                                                              .width <
                                                                          kBreakpointSmall) {
                                                                        return 0.0;
                                                                      } else if (MediaQuery.sizeOf(context)
                                                                              .width <
                                                                          kBreakpointMedium) {
                                                                        return 16.0;
                                                                      } else if (MediaQuery.sizeOf(context)
                                                                              .width <
                                                                          kBreakpointLarge) {
                                                                        return 24.0;
                                                                      } else {
                                                                        return 24.0;
                                                                      }
                                                                    }(),
                                                                    24.0,
                                                                  ),
                                                                  0.0,
                                                                  0.0,
                                                                  0.0),
                                                          child: Text(
                                                            valueOrDefault<
                                                                String>(
                                                              cellsInLocItem
                                                                  .cellId,
                                                              '-',
                                                            ),
                                                            style: FlutterFlowTheme
                                                                    .of(context)
                                                                .bodyMedium
                                                                .override(
                                                                  fontFamily:
                                                                      'Montserrat',
                                                                  color: FlutterFlowTheme.of(
                                                                          context)
                                                                      .secondaryText,
                                                                  fontSize:
                                                                      13.0,
                                                                  letterSpacing:
                                                                      0.0,
                                                                ),
                                                          ),
                                                        ),
                                                      ),
                                                      Text(
                                                        valueOrDefault<String>(
                                                          () {
                                                            if (cellsInLocItem
                                                                    .status ==
                                                                'rented') {
                                                              return 'занято';
                                                            } else if (cellsInLocItem
                                                                    .status ==
                                                                'reserved') {
                                                              return 'бронь';
                                                            } else {
                                                              return 'свободно';
                                                            }
                                                          }(),
                                                          '-',
                                                        ),
                                                        style: FlutterFlowTheme
                                                                .of(context)
                                                            .bodyMedium
                                                            .override(
                                                              fontFamily:
                                                                  'Montserrat',
                                                              color: cellsInLocItem
                                                                          .status ==
                                                                      'available'
                                                                  ? FlutterFlowTheme.of(
                                                                          context)
                                                                      .success
                                                                  : FlutterFlowTheme.of(
                                                                          context)
                                                                      .primary,
                                                              fontSize: 13.0,
                                                              letterSpacing:
                                                                  0.0,
                                                              fontWeight:
                                                                  FontWeight
                                                                      .w600,
                                                            ),
                                                      ),
                                                      Visibility(
                                                        visible:
                                                            responsiveVisibility(
                                                          context: context,
                                                          phone: false,
                                                        ),
                                                        child: Align(
                                                          alignment:
                                                              AlignmentDirectional(
                                                                  0.0, 0.0),
                                                          child: Text(
                                                            valueOrDefault<
                                                                String>(
                                                              cellsInLocItem
                                                                  .size,
                                                              '-',
                                                            ),
                                                            style: FlutterFlowTheme
                                                                    .of(context)
                                                                .bodyMedium
                                                                .override(
                                                                  fontFamily:
                                                                      'Montserrat',
                                                                  color: FlutterFlowTheme.of(
                                                                          context)
                                                                      .secondaryText,
                                                                  fontSize:
                                                                      13.0,
                                                                  letterSpacing:
                                                                      0.0,
                                                                ),
                                                          ),
                                                        ),
                                                      ),
                                                      Visibility(
                                                        visible:
                                                            responsiveVisibility(
                                                          context: context,
                                                          phone: false,
                                                        ),
                                                        child: Text(
                                                          valueOrDefault<
                                                              String>(
                                                            dateTimeFormat(
                                                              "dd.MM.yy",
                                                              cellsInLocItem
                                                                  .expirationDate,
                                                              locale: FFLocalizations
                                                                      .of(context)
                                                                  .languageCode,
                                                            ),
                                                            '-',
                                                          ),
                                                          style: FlutterFlowTheme
                                                                  .of(context)
                                                              .bodyMedium
                                                              .override(
                                                                fontFamily:
                                                                    'Montserrat',
                                                                color: FlutterFlowTheme.of(
                                                                        context)
                                                                    .secondaryText,
                                                                fontSize: 13.0,
                                                                letterSpacing:
                                                                    0.0,
                                                              ),
                                                        ),
                                                      ),
                                                      Builder(
                                                        builder: (context) {
                                                          if (cellsInLocItem
                                                                  .status !=
                                                              'available') {
                                                            return Align(
                                                              alignment:
                                                                  AlignmentDirectional(
                                                                      -1.0,
                                                                      0.0),
                                                              child: RichText(
                                                                textScaler: MediaQuery.of(
                                                                        context)
                                                                    .textScaler,
                                                                text: TextSpan(
                                                                  children: [
                                                                    TextSpan(
                                                                      text: valueOrDefault<
                                                                          String>(
                                                                        cellsInLocItem
                                                                            .clientName,
                                                                        'name',
                                                                      ),
                                                                      style: FlutterFlowTheme.of(
                                                                              context)
                                                                          .bodyMedium
                                                                          .override(
                                                                            fontFamily:
                                                                                'Montserrat',
                                                                            letterSpacing:
                                                                                0.0,
                                                                          ),
                                                                    ),
                                                                    TextSpan(
                                                                      text: FFLocalizations.of(
                                                                              context)
                                                                          .getText(
                                                                        'tmxfqfup' /* 
 */
                                                                        ,
                                                                      ),
                                                                      style: FlutterFlowTheme.of(
                                                                              context)
                                                                          .bodyMedium
                                                                          .override(
                                                                            fontFamily:
                                                                                'Montserrat',
                                                                            fontSize:
                                                                                12.0,
                                                                            letterSpacing:
                                                                                0.0,
                                                                            fontWeight:
                                                                                FontWeight.bold,
                                                                          ),
                                                                    ),
                                                                    TextSpan(
                                                                      text: valueOrDefault<
                                                                          String>(
                                                                        cellsInLocItem
                                                                            .clientPhone,
                                                                        'phone',
                                                                      ),
                                                                      style: FlutterFlowTheme.of(
                                                                              context)
                                                                          .bodySmall
                                                                          .override(
                                                                            fontFamily:
                                                                                'Montserrat',
                                                                            letterSpacing:
                                                                                0.0,
                                                                            fontWeight:
                                                                                FontWeight.bold,
                                                                          ),
                                                                    ),
                                                                    TextSpan(
                                                                      text: FFLocalizations.of(
                                                                              context)
                                                                          .getText(
                                                                        'b4w6kkgw' /* 
 */
                                                                        ,
                                                                      ),
                                                                      style:
                                                                          TextStyle(),
                                                                    ),
                                                                    TextSpan(
                                                                      text: valueOrDefault<
                                                                          String>(
                                                                        cellsInLocItem
                                                                            .clientEmail,
                                                                        'email',
                                                                      ),
                                                                      style:
                                                                          TextStyle(
                                                                        color: FlutterFlowTheme.of(context)
                                                                            .tertiaryText,
                                                                        fontSize:
                                                                            12.0,
                                                                      ),
                                                                    )
                                                                  ],
                                                                  style: FlutterFlowTheme.of(
                                                                          context)
                                                                      .bodyMedium
                                                                      .override(
                                                                        fontFamily:
                                                                            'Montserrat',
                                                                        letterSpacing:
                                                                            0.0,
                                                                        lineHeight:
                                                                            1.35,
                                                                      ),
                                                                ),
                                                              ),
                                                            );
                                                          } else {
                                                            return Visibility(
                                                              visible:
                                                                  responsiveVisibility(
                                                                context:
                                                                    context,
                                                                phone: false,
                                                              ),
                                                              child: Text(
                                                                FFLocalizations.of(
                                                                        context)
                                                                    .getText(
                                                                  'vcntdei5' /* - */,
                                                                ),
                                                                style: FlutterFlowTheme.of(
                                                                        context)
                                                                    .bodyMedium
                                                                    .override(
                                                                      fontFamily:
                                                                          'Montserrat',
                                                                      color: FlutterFlowTheme.of(
                                                                              context)
                                                                          .secondaryText,
                                                                      fontSize:
                                                                          13.0,
                                                                      letterSpacing:
                                                                          0.0,
                                                                    ),
                                                              ),
                                                            );
                                                          }
                                                        },
                                                      ),
                                                    ]
                                                        .map((c) => DataCell(c))
                                                        .toList(),
                                                  ),
                                                  emptyBuilder: () =>
                                                      EmptyTablePlaceholderWidget(
                                                    placeholderText:
                                                        'Нет клиентов по заданным параметрам',
                                                  ),
                                                  paginated: true,
                                                  selectable: false,
                                                  hidePaginator: false,
                                                  showFirstLastButtons: true,
                                                  minWidth: 500.0,
                                                  headingRowHeight: 42.0,
                                                  dataRowHeight: 68.0,
                                                  columnSpacing: 16.0,
                                                  headingRowColor:
                                                      FlutterFlowTheme.of(
                                                              context)
                                                          .primaryBackground,
                                                  sortIconColor:
                                                      FlutterFlowTheme.of(
                                                              context)
                                                          .primary,
                                                  borderRadius:
                                                      BorderRadius.only(
                                                    bottomLeft:
                                                        Radius.circular(0.0),
                                                    bottomRight:
                                                        Radius.circular(0.0),
                                                    topLeft:
                                                        Radius.circular(16.0),
                                                    topRight:
                                                        Radius.circular(16.0),
                                                  ),
                                                  addHorizontalDivider: false,
                                                  addTopAndBottomDivider: false,
                                                  hideDefaultHorizontalDivider:
                                                      true,
                                                  addVerticalDivider: false,
                                                );
                                              },
                                            ),
                                          ),
                                        ),
                                      ).animateOnPageLoad(animationsMap[
                                          'containerOnPageLoadAnimation']!),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          );
                        },
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
