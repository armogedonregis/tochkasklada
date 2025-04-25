import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/components/breadcrumps_widget.dart';
import '/components/location_info_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/submenu_item_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import 'locs_model.dart';
export 'locs_model.dart';

class LocsWidget extends StatefulWidget {
  const LocsWidget({super.key});

  static String routeName = 'locs';
  static String routePath = '/locs';

  @override
  State<LocsWidget> createState() => _LocsWidgetState();
}

class _LocsWidgetState extends State<LocsWidget> {
  late LocsModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => LocsModel());

    // On page load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      FFAppState().currentPage = Pages.locs;
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
        title: 'locs',
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
                        child: SingleChildScrollView(
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
                                        padding: EdgeInsetsDirectional.fromSTEB(
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
                                                iconForSection: FaIcon(
                                                  FontAwesomeIcons.route,
                                                  color: FlutterFlowTheme.of(
                                                          context)
                                                      .secondaryText,
                                                  size: 22.0,
                                                ),
                                                currentSectionTittle:
                                                    valueOrDefault<String>(
                                                  FFLocalizations.of(context)
                                                      .getVariableText(
                                                    ruText: 'Локации',
                                                    enText: 'Locations',
                                                  ),
                                                  'Локации',
                                                ),
                                                isSubpage: false,
                                              ),
                                            ),
                                            Row(
                                              mainAxisSize: MainAxisSize.min,
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
                                                        PromocodesWidget
                                                            .routeName);
                                                  },
                                                  child: wrapWithModel(
                                                    model: _model
                                                        .submenuItem1Model,
                                                    updateCallback: () =>
                                                        safeSetState(() {}),
                                                    child: SubmenuItemWidget(
                                                      tittle: 'Промокоды',
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
                                                        PricesWidget.routeName);
                                                  },
                                                  child: wrapWithModel(
                                                    model: _model
                                                        .submenuItem2Model,
                                                    updateCallback: () =>
                                                        safeSetState(() {}),
                                                    child: SubmenuItemWidget(
                                                      tittle: 'Цены',
                                                    ),
                                                  ),
                                                ),
                                              ].divide(SizedBox(width: 8.0)),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            16.0,
                                            valueOrDefault<double>(
                                              () {
                                                if (MediaQuery.sizeOf(context)
                                                        .width <
                                                    kBreakpointSmall) {
                                                  return 0.0;
                                                } else if (MediaQuery.sizeOf(
                                                            context)
                                                        .width <
                                                    kBreakpointMedium) {
                                                  return 24.0;
                                                } else if (MediaQuery.sizeOf(
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
                                                      FFLocalizations.of(
                                                              context)
                                                          .getVariableText(
                                                        ruText:
                                                            'Доступность ячеек ',
                                                        enText: 'Free Cells',
                                                      ),
                                                      'Доступность ячеек',
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
                                    ],
                                  ),
                                ),
                              ),
                              Align(
                                alignment: AlignmentDirectional(-1.0, -1.0),
                                child: Builder(
                                  builder: (context) {
                                    if (!FFAppState().viewAsFranchisor) {
                                      return Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            24.0, 16.0, 16.0, 16.0),
                                        child: FutureBuilder<
                                            List<LocationsPreviewRow>>(
                                          future:
                                              LocationsPreviewTable().queryRows(
                                            queryFn: (q) => q
                                                .eqOrNull(
                                                  'franchise',
                                                  FFAppState().franchisee,
                                                )
                                                .order('is_active')
                                                .order('locName'),
                                          ),
                                          builder: (context, snapshot) {
                                            // Customize what your widget looks like when it's loading.
                                            if (!snapshot.hasData) {
                                              return Center(
                                                child: SizedBox(
                                                  width: 50.0,
                                                  height: 50.0,
                                                  child: SpinKitWanderingCubes(
                                                    color: FlutterFlowTheme.of(
                                                            context)
                                                        .primary,
                                                    size: 50.0,
                                                  ),
                                                ),
                                              );
                                            }
                                            List<LocationsPreviewRow>
                                                wrapLocationsPreviewRowList =
                                                snapshot.data!;

                                            return Wrap(
                                              spacing: 8.0,
                                              runSpacing: 8.0,
                                              alignment: WrapAlignment.start,
                                              crossAxisAlignment:
                                                  WrapCrossAlignment.start,
                                              direction: Axis.horizontal,
                                              runAlignment: WrapAlignment.start,
                                              verticalDirection:
                                                  VerticalDirection.down,
                                              clipBehavior: Clip.none,
                                              children: List.generate(
                                                  wrapLocationsPreviewRowList
                                                      .length, (wrapIndex) {
                                                final wrapLocationsPreviewRow =
                                                    wrapLocationsPreviewRowList[
                                                        wrapIndex];
                                                return wrapWithModel(
                                                  model: _model
                                                      .locationInfoModels1
                                                      .getModel(
                                                    wrapLocationsPreviewRow
                                                        .locationId!,
                                                    wrapIndex,
                                                  ),
                                                  updateCallback: () =>
                                                      safeSetState(() {}),
                                                  updateOnChange: true,
                                                  child: LocationInfoWidget(
                                                    key: Key(
                                                      'Keykpo_${wrapLocationsPreviewRow.locationId!}',
                                                    ),
                                                    locAdress:
                                                        wrapLocationsPreviewRow
                                                            .adress!,
                                                    isActive:
                                                        wrapLocationsPreviewRow
                                                            .isActive!,
                                                    locCity:
                                                        wrapLocationsPreviewRow
                                                            .city!,
                                                    franchise:
                                                        wrapLocationsPreviewRow
                                                            .franchise!,
                                                    locID:
                                                        wrapLocationsPreviewRow
                                                            .locationId!,
                                                    locName:
                                                        wrapLocationsPreviewRow
                                                            .locName!,
                                                    franchasAvatar:
                                                        wrapLocationsPreviewRow
                                                            .avatarLink!,
                                                    mCellsTotal:
                                                        wrapLocationsPreviewRow
                                                            .totalMCells!,
                                                    sCellsTotal:
                                                        wrapLocationsPreviewRow
                                                            .totalSCells!,
                                                    xsCellsTotal:
                                                        wrapLocationsPreviewRow
                                                            .totalXsCells!,
                                                    mAvailable:
                                                        wrapLocationsPreviewRow
                                                            .availableMCells!,
                                                    sAvailable:
                                                        wrapLocationsPreviewRow
                                                            .availableSCells!,
                                                    xsAvailable:
                                                        wrapLocationsPreviewRow
                                                            .availableXsCells!,
                                                    totalCells:
                                                        wrapLocationsPreviewRow
                                                            .totalCells!,
                                                    totalRAvailableCells:
                                                        wrapLocationsPreviewRow
                                                            .availableCells!,
                                                    availableRatio:
                                                        wrapLocationsPreviewRow
                                                            .availabilityRatio!,
                                                    paymentsLast30Days:
                                                        valueOrDefault<double>(
                                                      wrapLocationsPreviewRow
                                                          .paymentsLast30Days,
                                                      0.0,
                                                    ),
                                                    paymentsCurrentMonth:
                                                        valueOrDefault<double>(
                                                      wrapLocationsPreviewRow
                                                          .paymentsCurrentMonth,
                                                      0.0,
                                                    ),
                                                    currentMonth:
                                                        valueOrDefault<String>(
                                                      wrapLocationsPreviewRow
                                                          .currentMonth,
                                                      '01.24',
                                                    ),
                                                  ),
                                                );
                                              }),
                                            );
                                          },
                                        ),
                                      );
                                    } else {
                                      return Align(
                                        alignment:
                                            AlignmentDirectional(-1.0, -1.0),
                                        child: Padding(
                                          padding:
                                              EdgeInsetsDirectional.fromSTEB(
                                                  24.0, 16.0, 16.0, 16.0),
                                          child: FutureBuilder<
                                              List<LocationsPreviewRow>>(
                                            future: LocationsPreviewTable()
                                                .queryRows(
                                              queryFn: (q) => q
                                                  .order('is_active')
                                                  .order('locName'),
                                            ),
                                            builder: (context, snapshot) {
                                              // Customize what your widget looks like when it's loading.
                                              if (!snapshot.hasData) {
                                                return Center(
                                                  child: SizedBox(
                                                    width: 50.0,
                                                    height: 50.0,
                                                    child:
                                                        SpinKitWanderingCubes(
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .primary,
                                                      size: 50.0,
                                                    ),
                                                  ),
                                                );
                                              }
                                              List<LocationsPreviewRow>
                                                  wrapLocationsPreviewRowList =
                                                  snapshot.data!;

                                              return Wrap(
                                                spacing: 8.0,
                                                runSpacing: 8.0,
                                                alignment: WrapAlignment.start,
                                                crossAxisAlignment:
                                                    WrapCrossAlignment.start,
                                                direction: Axis.horizontal,
                                                runAlignment:
                                                    WrapAlignment.start,
                                                verticalDirection:
                                                    VerticalDirection.down,
                                                clipBehavior: Clip.none,
                                                children: List.generate(
                                                    wrapLocationsPreviewRowList
                                                        .length, (wrapIndex) {
                                                  final wrapLocationsPreviewRow =
                                                      wrapLocationsPreviewRowList[
                                                          wrapIndex];
                                                  return wrapWithModel(
                                                    model: _model
                                                        .locationInfoModels2
                                                        .getModel(
                                                      wrapLocationsPreviewRow
                                                          .locationId!,
                                                      wrapIndex,
                                                    ),
                                                    updateCallback: () =>
                                                        safeSetState(() {}),
                                                    child: LocationInfoWidget(
                                                      key: Key(
                                                        'Keyvms_${wrapLocationsPreviewRow.locationId!}',
                                                      ),
                                                      locAdress:
                                                          wrapLocationsPreviewRow
                                                              .adress!,
                                                      isActive:
                                                          wrapLocationsPreviewRow
                                                              .isActive!,
                                                      locCity:
                                                          wrapLocationsPreviewRow
                                                              .city!,
                                                      franchise:
                                                          wrapLocationsPreviewRow
                                                              .franchise!,
                                                      locID:
                                                          wrapLocationsPreviewRow
                                                              .locationId!,
                                                      locName:
                                                          wrapLocationsPreviewRow
                                                              .locName!,
                                                      franchasAvatar:
                                                          wrapLocationsPreviewRow
                                                              .avatarLink!,
                                                      mCellsTotal:
                                                          wrapLocationsPreviewRow
                                                              .totalMCells!,
                                                      sCellsTotal:
                                                          wrapLocationsPreviewRow
                                                              .totalSCells!,
                                                      xsCellsTotal:
                                                          wrapLocationsPreviewRow
                                                              .totalXsCells!,
                                                      mAvailable:
                                                          wrapLocationsPreviewRow
                                                              .availableMCells!,
                                                      sAvailable:
                                                          wrapLocationsPreviewRow
                                                              .availableSCells!,
                                                      xsAvailable:
                                                          wrapLocationsPreviewRow
                                                              .availableXsCells!,
                                                      totalCells:
                                                          wrapLocationsPreviewRow
                                                              .totalCells!,
                                                      totalRAvailableCells:
                                                          wrapLocationsPreviewRow
                                                              .availableCells!,
                                                      availableRatio:
                                                          wrapLocationsPreviewRow
                                                              .availabilityRatio!,
                                                      paymentsLast30Days:
                                                          wrapLocationsPreviewRow
                                                              .paymentsLast30Days,
                                                      paymentsCurrentMonth:
                                                          wrapLocationsPreviewRow
                                                              .paymentsCurrentMonth,
                                                      currentMonth:
                                                          wrapLocationsPreviewRow
                                                              .currentMonth,
                                                    ),
                                                  );
                                                }),
                                              );
                                            },
                                          ),
                                        ),
                                      );
                                    }
                                  },
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
