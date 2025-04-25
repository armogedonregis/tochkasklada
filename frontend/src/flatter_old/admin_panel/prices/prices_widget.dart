import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/components/breadcrumps_widget.dart';
import '/components/create_new_prices_widget.dart';
import '/components/edit_price_widget.dart';
import '/components/empty_table_placeholder_widget.dart';
import '/components/open_drawler_button_widget.dart';
import '/components/price_head_row_widget.dart';
import '/components/price_row_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/skeleton_multi_line_list_widget.dart';
import '/components/submenu_item_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'package:aligned_tooltip/aligned_tooltip.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import 'prices_model.dart';
export 'prices_model.dart';

class PricesWidget extends StatefulWidget {
  const PricesWidget({super.key});

  static String routeName = 'prices';
  static String routePath = '/prices';

  @override
  State<PricesWidget> createState() => _PricesWidgetState();
}

class _PricesWidgetState extends State<PricesWidget>
    with TickerProviderStateMixin {
  late PricesModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  final animationsMap = <String, AnimationInfo>{};

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => PricesModel());

    // On page load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      FFAppState().currentPage = Pages.locs;
      safeSetState(() {});
      _model.selectedTierID = 0;
      _model.isCreateTier = true;
      safeSetState(() {});
    });

    animationsMap.addAll({
      'listViewOnPageLoadAnimation': AnimationInfo(
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
        title: 'prices',
        color: FlutterFlowTheme.of(context).primary.withAlpha(0XFF),
        child: GestureDetector(
          onTap: () {
            FocusScope.of(context).unfocus();
            FocusManager.instance.primaryFocus?.unfocus();
          },
          child: Scaffold(
            key: scaffoldKey,
            backgroundColor: FlutterFlowTheme.of(context).secondaryBackground,
            endDrawer: Container(
              width: 390.0,
              child: Drawer(
                elevation: 0.0,
                child: Container(
                  decoration: BoxDecoration(
                    color: FlutterFlowTheme.of(context).secondaryBackground,
                  ),
                  child: Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 0.0),
                    child: Builder(
                      builder: (context) {
                        if (_model.selectedTierID != 0) {
                          return wrapWithModel(
                            model: _model.editPriceModel,
                            updateCallback: () => safeSetState(() {}),
                            updateOnChange: true,
                            child: EditPriceWidget(
                              tierID: valueOrDefault<int>(
                                _model.selectedTierID,
                                0,
                              ),
                            ),
                          );
                        } else if (_model.selectedTierID == 0) {
                          return wrapWithModel(
                            model: _model.createNewPricesModel1,
                            updateCallback: () => safeSetState(() {}),
                            updateOnChange: true,
                            child: CreateNewPricesWidget(
                              mMonth: 10990,
                              mDay: 600,
                              sMonth: 5990,
                              sDay: 400,
                              xsMonth: 3990,
                              xsDay: 200,
                              yearCt: 10.0,
                            ),
                          );
                        } else {
                          return wrapWithModel(
                            model: _model.createNewPricesModel2,
                            updateCallback: () => safeSetState(() {}),
                            child: CreateNewPricesWidget(),
                          );
                        }
                      },
                    ),
                  ),
                ),
              ),
            ),
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
                        'thihwd25' /* Order Details */,
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
                        child: InkWell(
                          splashColor: Colors.transparent,
                          focusColor: Colors.transparent,
                          hoverColor: Colors.transparent,
                          highlightColor: Colors.transparent,
                          onTap: () async {
                            _model.selectedTierID = 0;
                            safeSetState(() {});
                          },
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
                                            ),
                                            InkWell(
                                              splashColor: Colors.transparent,
                                              focusColor: Colors.transparent,
                                              hoverColor: Colors.transparent,
                                              highlightColor:
                                                  Colors.transparent,
                                              onTap: () async {
                                                context.pushNamed(
                                                    AdressesWidget.routeName);
                                              },
                                              child: wrapWithModel(
                                                model: _model.submenuItem1Model,
                                                updateCallback: () =>
                                                    safeSetState(() {}),
                                                child: SubmenuItemWidget(
                                                  tittle: 'Адреса',
                                                ),
                                              ),
                                            ),
                                            if (FFAppState()
                                                .permLevel
                                                .contains(PermLevel.franchise))
                                              InkWell(
                                                splashColor: Colors.transparent,
                                                focusColor: Colors.transparent,
                                                hoverColor: Colors.transparent,
                                                highlightColor:
                                                    Colors.transparent,
                                                onTap: () async {
                                                  _model.isCreateTier = true;
                                                  _model.selectedTierID = 0;
                                                  safeSetState(() {});
                                                  await Future.delayed(
                                                      const Duration(
                                                          milliseconds: 300));
                                                },
                                                child: wrapWithModel(
                                                  model: _model
                                                      .openDrawlerButtonModel,
                                                  updateCallback: () =>
                                                      safeSetState(() {}),
                                                  child:
                                                      OpenDrawlerButtonWidget(
                                                    buttonTittle: 'Цены',
                                                    icon: Icon(
                                                      Icons
                                                          .currency_exchange_outlined,
                                                    ),
                                                  ),
                                                ),
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
                                                      FFLocalizations.of(
                                                              context)
                                                          .getVariableText(
                                                        ruText: 'Цены по зонам',
                                                        enText: 'Area prices',
                                                      ),
                                                      'Цены по зонам',
                                                    ),
                                                    subtittle:
                                                        'Можно редактировать только цены, созданные вами',
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
                                        child: Row(
                                          mainAxisSize: MainAxisSize.max,
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            Padding(
                                              padding: EdgeInsetsDirectional
                                                  .fromSTEB(
                                                      16.0, 0.0, 16.0, 0.0),
                                              child: Row(
                                                mainAxisSize: MainAxisSize.min,
                                                mainAxisAlignment:
                                                    MainAxisAlignment.start,
                                                children: [
                                                  wrapWithModel(
                                                    model: _model
                                                        .priceHeadRowModel1,
                                                    updateCallback: () =>
                                                        safeSetState(() {}),
                                                    child: PriceHeadRowWidget(
                                                      size: 'M',
                                                    ),
                                                  ),
                                                  wrapWithModel(
                                                    model: _model
                                                        .priceHeadRowModel2,
                                                    updateCallback: () =>
                                                        safeSetState(() {}),
                                                    child: PriceHeadRowWidget(
                                                      size: 'S',
                                                    ),
                                                  ),
                                                  wrapWithModel(
                                                    model: _model
                                                        .priceHeadRowModel3,
                                                    updateCallback: () =>
                                                        safeSetState(() {}),
                                                    child: PriceHeadRowWidget(
                                                      size: 'XS',
                                                    ),
                                                  ),
                                                  AlignedTooltip(
                                                    content: Padding(
                                                      padding:
                                                          EdgeInsets.all(24.0),
                                                      child: Text(
                                                        FFLocalizations.of(
                                                                context)
                                                            .getText(
                                                          'ntp2w9id' /* Стоимость аренды за год при ед... */,
                                                        ),
                                                        textAlign:
                                                            TextAlign.start,
                                                        style:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .bodyMedium
                                                                .override(
                                                                  fontFamily:
                                                                      'Montserrat',
                                                                  color: FlutterFlowTheme.of(
                                                                          context)
                                                                      .background,
                                                                  fontSize:
                                                                      14.0,
                                                                  letterSpacing:
                                                                      0.0,
                                                                ),
                                                      ),
                                                    ),
                                                    offset: 8.0,
                                                    preferredDirection:
                                                        AxisDirection.right,
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            16.0),
                                                    backgroundColor:
                                                        FlutterFlowTheme.of(
                                                                context)
                                                            .promo,
                                                    elevation: 1.0,
                                                    tailBaseWidth: 24.0,
                                                    tailLength: 12.0,
                                                    waitDuration: Duration(
                                                        milliseconds: 100),
                                                    showDuration: Duration(
                                                        milliseconds: 1500),
                                                    triggerMode:
                                                        TooltipTriggerMode.tap,
                                                    child: Container(
                                                      width: 100.0,
                                                      decoration:
                                                          BoxDecoration(),
                                                      alignment:
                                                          AlignmentDirectional(
                                                              0.0, 0.0),
                                                      child: Text(
                                                        FFLocalizations.of(
                                                                context)
                                                            .getText(
                                                          'noyb006e' /* Год. коэф (мес) */,
                                                        ),
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
                                                  Container(
                                                    width: 36.0,
                                                    decoration: BoxDecoration(),
                                                    child: Padding(
                                                      padding:
                                                          EdgeInsetsDirectional
                                                              .fromSTEB(
                                                                  16.0,
                                                                  0.0,
                                                                  0.0,
                                                                  0.0),
                                                      child: Text(
                                                        FFLocalizations.of(
                                                                context)
                                                            .getText(
                                                          'uxxjpj7w' /* ID */,
                                                        ),
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
                                                  Padding(
                                                    padding:
                                                        EdgeInsetsDirectional
                                                            .fromSTEB(16.0, 0.0,
                                                                0.0, 0.0),
                                                    child: Text(
                                                      FFLocalizations.of(
                                                              context)
                                                          .getText(
                                                        'dugx69j8' /* Зона */,
                                                      ),
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
                                                ].divide(SizedBox(width: 12.0)),
                                              ),
                                            ),
                                            Flexible(
                                              flex: 2,
                                              child: Container(
                                                height: 48.0,
                                                decoration: BoxDecoration(),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                    Container(
                                      constraints: BoxConstraints(
                                        maxHeight: 600.0,
                                      ),
                                      decoration: BoxDecoration(),
                                      child: FutureBuilder<
                                          List<PriceLocationViewRow>>(
                                        future:
                                            PriceLocationViewTable().queryRows(
                                          queryFn: (q) => q.order('price_id'),
                                        ),
                                        builder: (context, snapshot) {
                                          // Customize what your widget looks like when it's loading.
                                          if (!snapshot.hasData) {
                                            return Padding(
                                              padding: EdgeInsetsDirectional
                                                  .fromSTEB(0.0, 0.0, 0.0, 2.0),
                                              child:
                                                  SkeletonMultiLineListWidget(
                                                height: 42.0,
                                                itemsQty: 4,
                                                radii: 16,
                                                spacer: 24,
                                              ),
                                            );
                                          }
                                          List<PriceLocationViewRow>
                                              listViewPriceLocationViewRowList =
                                              snapshot.data!;

                                          if (listViewPriceLocationViewRowList
                                              .isEmpty) {
                                            return EmptyTablePlaceholderWidget(
                                              placeholderText:
                                                  'Цены еще не установлены',
                                            );
                                          }

                                          return ListView.builder(
                                            padding: EdgeInsets.zero,
                                            scrollDirection: Axis.vertical,
                                            itemCount:
                                                listViewPriceLocationViewRowList
                                                    .length,
                                            itemBuilder:
                                                (context, listViewIndex) {
                                              final listViewPriceLocationViewRow =
                                                  listViewPriceLocationViewRowList[
                                                      listViewIndex];
                                              return InkWell(
                                                splashColor: Colors.transparent,
                                                focusColor: Colors.transparent,
                                                hoverColor: Colors.transparent,
                                                highlightColor:
                                                    Colors.transparent,
                                                onTap: () async {
                                                  scaffoldKey.currentState!
                                                      .openEndDrawer();
                                                  _model.selectedTierID =
                                                      listViewPriceLocationViewRow
                                                          .priceId;
                                                  _model.isCreateTier = false;
                                                  safeSetState(() {});
                                                  await Future.wait([
                                                    Future(() async {
                                                      safeSetState(() {
                                                        _model
                                                                .editPriceModel
                                                                .mMonthTextController
                                                                ?.text =
                                                            listViewPriceLocationViewRow
                                                                .mPriceMonth!
                                                                .toString();
                                                      });
                                                    }),
                                                    Future(() async {
                                                      safeSetState(() {
                                                        _model
                                                                .editPriceModel
                                                                .mDayTextController
                                                                ?.text =
                                                            listViewPriceLocationViewRow
                                                                .mPriceDay!
                                                                .toString();
                                                      });
                                                    }),
                                                    Future(() async {
                                                      safeSetState(() {
                                                        _model
                                                                .editPriceModel
                                                                .sMonthTextController
                                                                ?.text =
                                                            listViewPriceLocationViewRow
                                                                .sPriceMonth!
                                                                .toString();
                                                      });
                                                    }),
                                                    Future(() async {
                                                      safeSetState(() {
                                                        _model
                                                                .editPriceModel
                                                                .sDayTextController
                                                                ?.text =
                                                            listViewPriceLocationViewRow
                                                                .sPriceDay!
                                                                .toString();
                                                      });
                                                    }),
                                                    Future(() async {
                                                      safeSetState(() {
                                                        _model
                                                                .editPriceModel
                                                                .xsMonthTextController
                                                                ?.text =
                                                            listViewPriceLocationViewRow
                                                                .xsPriceMonth!
                                                                .toString();
                                                      });
                                                    }),
                                                    Future(() async {
                                                      safeSetState(() {
                                                        _model
                                                                .editPriceModel
                                                                .xsDayTextController
                                                                ?.text =
                                                            listViewPriceLocationViewRow
                                                                .xsPriceDay!
                                                                .toString();
                                                      });
                                                    }),
                                                    Future(() async {
                                                      safeSetState(() {
                                                        _model
                                                                .editPriceModel
                                                                .yearCtTextController
                                                                ?.text =
                                                            listViewPriceLocationViewRow
                                                                .yearCoeficient!
                                                                .toString();
                                                      });
                                                    }),
                                                  ]);
                                                },
                                                child: wrapWithModel(
                                                  model: _model.priceRowModels
                                                      .getModel(
                                                    listViewPriceLocationViewRow
                                                        .priceId!
                                                        .toString(),
                                                    listViewIndex,
                                                  ),
                                                  updateCallback: () =>
                                                      safeSetState(() {}),
                                                  updateOnChange: true,
                                                  child: PriceRowWidget(
                                                    key: Key(
                                                      'Key5ub_${listViewPriceLocationViewRow.priceId!.toString()}',
                                                    ),
                                                    mMonth:
                                                        listViewPriceLocationViewRow
                                                            .mPriceMonth!,
                                                    mDay:
                                                        listViewPriceLocationViewRow
                                                            .mPriceDay!,
                                                    sMonth:
                                                        listViewPriceLocationViewRow
                                                            .sPriceMonth!,
                                                    sDay:
                                                        listViewPriceLocationViewRow
                                                            .sPriceDay!,
                                                    xsMonth:
                                                        listViewPriceLocationViewRow
                                                            .xsPriceMonth!,
                                                    xsDay:
                                                        listViewPriceLocationViewRow
                                                            .xsPriceDay!,
                                                    tierID:
                                                        listViewPriceLocationViewRow
                                                            .priceId!,
                                                    yearCt:
                                                        listViewPriceLocationViewRow
                                                            .yearCoeficient!,
                                                    locs:
                                                        listViewPriceLocationViewRow
                                                            .locationNames,
                                                    created:
                                                        listViewPriceLocationViewRow
                                                            .createdBy,
                                                  ),
                                                ),
                                              );
                                            },
                                          ).animateOnPageLoad(animationsMap[
                                              'listViewOnPageLoadAnimation']!);
                                        },
                                      ),
                                    ),
                                  ],
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
