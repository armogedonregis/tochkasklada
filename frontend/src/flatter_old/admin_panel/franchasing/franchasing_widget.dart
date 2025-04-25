import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/components/breadcrumps_widget.dart';
import '/components/card_of_franchise_widget.dart';
import '/components/empty_table_placeholder_widget.dart';
import '/components/open_drawler_button_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/skeleton_multi_line_list_widget.dart';
import '/components/submenu_item_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:provider/provider.dart';
import 'franchasing_model.dart';
export 'franchasing_model.dart';

class FranchasingWidget extends StatefulWidget {
  const FranchasingWidget({super.key});

  static String routeName = 'franchasing';
  static String routePath = '/franchasing';

  @override
  State<FranchasingWidget> createState() => _FranchasingWidgetState();
}

class _FranchasingWidgetState extends State<FranchasingWidget>
    with TickerProviderStateMixin {
  late FranchasingModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  final animationsMap = <String, AnimationInfo>{};

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => FranchasingModel());

    // On page load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      FFAppState().currentPage = Pages.franchasing;
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
      'staggeredViewOnPageLoadAnimation': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.easeInOut,
            delay: 0.0.ms,
            duration: 830.0.ms,
            begin: 0.0,
            end: 1.0,
          ),
          ShimmerEffect(
            curve: Curves.easeInOut,
            delay: 0.0.ms,
            duration: 830.0.ms,
            color: FlutterFlowTheme.of(context).secondaryBackground,
            angle: 0.524,
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
        title: 'franchasing',
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
              child: Align(
                alignment: AlignmentDirectional(0.0, -1.0),
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
                            color: FlutterFlowTheme.of(context)
                                .secondaryBackground,
                          ),
                          alignment: AlignmentDirectional(-1.0, -1.0),
                          child: Column(
                            mainAxisSize: MainAxisSize.max,
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
                                    alignment: AlignmentDirectional(-1.0, -1.0),
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
                                                    Icons
                                                        .business_center_rounded,
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
                                              if (responsiveVisibility(
                                                context: context,
                                                phone: false,
                                              ))
                                                Row(
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
                                                            AdressesWidget
                                                                .routeName);
                                                      },
                                                      child: wrapWithModel(
                                                        model: _model
                                                            .submenuItem1Model1,
                                                        updateCallback: () =>
                                                            safeSetState(() {}),
                                                        child:
                                                            SubmenuItemWidget(
                                                          tittle: 'Адреса',
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
                                                          SiteFormIframeWidget
                                                              .routeName,
                                                          queryParameters: {
                                                            'location':
                                                                serializeParam(
                                                              'KUD',
                                                              ParamType.String,
                                                            ),
                                                            'size':
                                                                serializeParam(
                                                              'S',
                                                              ParamType.String,
                                                            ),
                                                          }.withoutNulls,
                                                        );
                                                      },
                                                      child: wrapWithModel(
                                                        model: _model
                                                            .submenuItem2Model1,
                                                        updateCallback: () =>
                                                            safeSetState(() {}),
                                                        child:
                                                            SubmenuItemWidget(
                                                          tittle: 'testRequest',
                                                        ),
                                                      ),
                                                    ),
                                                  ].divide(
                                                      SizedBox(width: 8.0)),
                                                ),
                                              Row(
                                                mainAxisSize: MainAxisSize.max,
                                                children: [
                                                  wrapWithModel(
                                                    model: _model
                                                        .openDrawlerButtonModel,
                                                    updateCallback: () =>
                                                        safeSetState(() {}),
                                                    child:
                                                        OpenDrawlerButtonWidget(
                                                      buttonTittle:
                                                          valueOrDefault<
                                                              String>(
                                                        FFLocalizations.of(
                                                                context)
                                                            .getVariableText(
                                                          ruText:
                                                              'Создать франшизу',
                                                          enText:
                                                              'Add franchise',
                                                        ),
                                                        'Создать франшизу',
                                                      ),
                                                    ),
                                                  ),
                                                ].divide(SizedBox(width: 8.0)),
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
                                                              AdressesWidget
                                                                  .routeName);
                                                        },
                                                        child: wrapWithModel(
                                                          model: _model
                                                              .submenuItem1Model2,
                                                          updateCallback: () =>
                                                              safeSetState(
                                                                  () {}),
                                                          child:
                                                              SubmenuItemWidget(
                                                            tittle: 'Адреса',
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
                                                            SiteFormIframeWidget
                                                                .routeName,
                                                            queryParameters: {
                                                              'location':
                                                                  serializeParam(
                                                                'KUD',
                                                                ParamType
                                                                    .String,
                                                              ),
                                                              'size':
                                                                  serializeParam(
                                                                'XS',
                                                                ParamType
                                                                    .String,
                                                              ),
                                                            }.withoutNulls,
                                                          );
                                                        },
                                                        child: wrapWithModel(
                                                          model: _model
                                                              .submenuItem2Model2,
                                                          updateCallback: () =>
                                                              safeSetState(
                                                                  () {}),
                                                          child:
                                                              SubmenuItemWidget(
                                                            tittle:
                                                                'testRequest',
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
                                                          ruText: 'Франшизы',
                                                          enText: 'Franchises',
                                                        ),
                                                        'Франшизы',
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
                              ),
                              Container(
                                width: double.infinity,
                                height: MediaQuery.sizeOf(context).height * 0.8,
                                decoration: BoxDecoration(
                                  color: FlutterFlowTheme.of(context)
                                      .secondaryBackground,
                                ),
                                child: Padding(
                                  padding: EdgeInsetsDirectional.fromSTEB(
                                      16.0, 0.0, 16.0, 0.0),
                                  child: FutureBuilder<List<FranchiseViewRow>>(
                                    future: FFAppState().franchise(
                                      requestFn: () =>
                                          FranchiseViewTable().queryRows(
                                        queryFn: (q) => q.order('franchise_id',
                                            ascending: true),
                                      ),
                                    ),
                                    builder: (context, snapshot) {
                                      // Customize what your widget looks like when it's loading.
                                      if (!snapshot.hasData) {
                                        return SkeletonMultiLineListWidget(
                                          height: 200.0,
                                          itemsQty: 3,
                                          radii: 16,
                                          spacer: 24,
                                        );
                                      }
                                      List<FranchiseViewRow>
                                          staggeredViewFranchiseViewRowList =
                                          snapshot.data!;

                                      if (staggeredViewFranchiseViewRowList
                                          .isEmpty) {
                                        return EmptyTablePlaceholderWidget(
                                          placeholderText:
                                              'Для начала добавьте хотябы 1 франшизу',
                                        );
                                      }

                                      return MasonryGridView.builder(
                                        gridDelegate:
                                            SliverSimpleGridDelegateWithFixedCrossAxisCount(
                                          crossAxisCount: valueOrDefault<int>(
                                            () {
                                              if (MediaQuery.sizeOf(context)
                                                      .width <
                                                  kBreakpointSmall) {
                                                return 1;
                                              } else if (MediaQuery.sizeOf(
                                                          context)
                                                      .width <
                                                  kBreakpointMedium) {
                                                return 1;
                                              } else if (MediaQuery.sizeOf(
                                                          context)
                                                      .width <
                                                  kBreakpointLarge) {
                                                return 2;
                                              } else {
                                                return 3;
                                              }
                                            }(),
                                            3,
                                          ),
                                        ),
                                        crossAxisSpacing: 8.0,
                                        mainAxisSpacing: 8.0,
                                        itemCount:
                                            staggeredViewFranchiseViewRowList
                                                .length,
                                        itemBuilder:
                                            (context, staggeredViewIndex) {
                                          final staggeredViewFranchiseViewRow =
                                              staggeredViewFranchiseViewRowList[
                                                  staggeredViewIndex];
                                          return CardOfFranchiseWidget(
                                            key: Key(
                                                'Key0xq_${staggeredViewIndex}_of_${staggeredViewFranchiseViewRowList.length}'),
                                            franchiseID:
                                                staggeredViewFranchiseViewRow
                                                    .franchiseId!,
                                          );
                                        },
                                      ).animateOnPageLoad(animationsMap[
                                          'staggeredViewOnPageLoadAnimation']!);
                                    },
                                  ),
                                ),
                              ).animateOnPageLoad(animationsMap[
                                  'containerOnPageLoadAnimation']!),
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
        ));
  }
}
