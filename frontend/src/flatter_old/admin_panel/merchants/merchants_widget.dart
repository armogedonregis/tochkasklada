import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/components/breadcrumps_widget.dart';
import '/components/create_merchant_widget.dart';
import '/components/empty_table_placeholder_widget.dart';
import '/components/open_drawler_button_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/skeleton_multi_line_list_widget.dart';
import '/components/submenu_item_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/components/update_merchant_widget.dart';
import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_data_table.dart';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import 'merchants_model.dart';
export 'merchants_model.dart';

class MerchantsWidget extends StatefulWidget {
  const MerchantsWidget({
    super.key,
    String? merchantID,
  }) : this.merchantID = merchantID ?? 'tochka-0';

  final String merchantID;

  static String routeName = 'merchants';
  static String routePath = '/merchants';

  @override
  State<MerchantsWidget> createState() => _MerchantsWidgetState();
}

class _MerchantsWidgetState extends State<MerchantsWidget>
    with TickerProviderStateMixin {
  late MerchantsModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  final animationsMap = <String, AnimationInfo>{};

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => MerchantsModel());

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
        title: 'merchants',
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
                elevation: 16.0,
                child: Container(
                  decoration: BoxDecoration(
                    color: FlutterFlowTheme.of(context).secondaryBackground,
                  ),
                  child: Builder(
                    builder: (context) {
                      if (_model.isCreateMerchant) {
                        return Container(
                          height: 200.0,
                          decoration: BoxDecoration(),
                          child: wrapWithModel(
                            model: _model.createMerchantModel,
                            updateCallback: () => safeSetState(() {}),
                            child: CreateMerchantWidget(),
                          ),
                        );
                      } else {
                        return Container(
                          height: 200.0,
                          decoration: BoxDecoration(),
                          child: wrapWithModel(
                            model: _model.updateMerchantModel,
                            updateCallback: () => safeSetState(() {}),
                            child: UpdateMerchantWidget(),
                          ),
                        );
                      }
                    },
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
                        'tuwxtk6j' /* Order Details */,
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
                                            if (responsiveVisibility(
                                              context: context,
                                              phone: false,
                                            ))
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
                                                          AdressesWidget
                                                              .routeName);
                                                    },
                                                    child: wrapWithModel(
                                                      model: _model
                                                          .submenuItem1Model,
                                                      updateCallback: () =>
                                                          safeSetState(() {}),
                                                      child: SubmenuItemWidget(
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
                                                          .submenuItem2Model,
                                                      updateCallback: () =>
                                                          safeSetState(() {}),
                                                      child: SubmenuItemWidget(
                                                        tittle: 'testRequest',
                                                      ),
                                                    ),
                                                  ),
                                                ].divide(SizedBox(width: 8.0)),
                                              ),
                                            Row(
                                              mainAxisSize: MainAxisSize.max,
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
                                                    _model.isCreateMerchant =
                                                        true;
                                                    safeSetState(() {});
                                                    scaffoldKey.currentState!
                                                        .openEndDrawer();
                                                  },
                                                  child: wrapWithModel(
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
                                                        'Создать мерчанта',
                                                      ),
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
                                                        ruText: 'Мерчанты',
                                                        enText: 'Merchants',
                                                      ),
                                                      'Мерчанты',
                                                    ),
                                                    subtittle:
                                                        'Терминалы Тиньков-банка',
                                                    hasIcon: false,
                                                    hasSubtittle: true,
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
                                    0.0, 0.0, 24.0, 0.0),
                                child: FutureBuilder<
                                    List<FranchiseMerchantsViewRow>>(
                                  future:
                                      FranchiseMerchantsViewTable().queryRows(
                                    queryFn: (q) => q,
                                  ),
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
                                    List<FranchiseMerchantsViewRow>
                                        containerFranchiseMerchantsViewRowList =
                                        snapshot.data!;

                                    return Container(
                                      constraints: BoxConstraints(
                                        maxHeight: 600.0,
                                      ),
                                      decoration: BoxDecoration(),
                                      child: Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            22.0, 16.0, 0.0, 0.0),
                                        child: Builder(
                                          builder: (context) {
                                            final clients =
                                                containerFranchiseMerchantsViewRowList
                                                    .map((e) => e)
                                                    .toList();
                                            if (clients.isEmpty) {
                                              return EmptyTablePlaceholderWidget(
                                                placeholderText:
                                                    'Мерчанты не созданы',
                                              );
                                            }

                                            return FlutterFlowDataTable<
                                                FranchiseMerchantsViewRow>(
                                              controller: _model
                                                  .paginatedDataTableController,
                                              data: clients,
                                              numRows: valueOrDefault<int>(
                                                clients.length,
                                                10,
                                              ),
                                              columnsBuilder: (onSortChanged) =>
                                                  [
                                                DataColumn2(
                                                  label: DefaultTextStyle.merge(
                                                    softWrap: true,
                                                    child: Padding(
                                                      padding:
                                                          EdgeInsetsDirectional
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
                                                          '0qlox5wa' /* Франшиза */,
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
                                                  onSort: onSortChanged,
                                                ),
                                                DataColumn2(
                                                  label: DefaultTextStyle.merge(
                                                    softWrap: true,
                                                    child: Text(
                                                      FFLocalizations.of(
                                                              context)
                                                          .getText(
                                                        'i4cgx37z' /* Мерчант */,
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
                                                  fixedWidth: 160.0,
                                                  onSort: onSortChanged,
                                                ),
                                                DataColumn2(
                                                  label: DefaultTextStyle.merge(
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
                                                                -1.0, 0.0),
                                                        child: Text(
                                                          FFLocalizations.of(
                                                                  context)
                                                              .getText(
                                                            'lu5t8qsc' /* Почта франчайзи */,
                                                          ),
                                                          textAlign:
                                                              TextAlign.center,
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
                                                      valueOrDefault<double>(
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
                                                  label: DefaultTextStyle.merge(
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
                                                            'chxevyu8' /* Статус */,
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
                                                  ),
                                                  fixedWidth:
                                                      valueOrDefault<double>(
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
                                                  label: DefaultTextStyle.merge(
                                                    softWrap: true,
                                                    child: Align(
                                                      alignment:
                                                          AlignmentDirectional(
                                                              -1.0, 0.0),
                                                      child: Text(
                                                        FFLocalizations.of(
                                                                context)
                                                            .getText(
                                                          '0gymkay1' /* Pass */,
                                                        ),
                                                        textAlign:
                                                            TextAlign.start,
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
                                                  onSort: onSortChanged,
                                                ),
                                                DataColumn2(
                                                  label: DefaultTextStyle.merge(
                                                    softWrap: true,
                                                    child: Text(
                                                      FFLocalizations.of(
                                                              context)
                                                          .getText(
                                                        'bqduj7mb' /* Действия */,
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
                                                  fixedWidth: 100.0,
                                                ),
                                              ],
                                              dataRowBuilder: (clientsItem,
                                                      clientsIndex,
                                                      selected,
                                                      onSelectChanged) =>
                                                  DataRow(
                                                color:
                                                    WidgetStateProperty.all(
                                                  clientsIndex % 2 == 0
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
                                                    child: Text(
                                                      valueOrDefault<String>(
                                                        clientsItem.franchiseId
                                                            ?.toString(),
                                                        '0',
                                                      ),
                                                      style:
                                                          FlutterFlowTheme.of(
                                                                  context)
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
                                                  Text(
                                                    valueOrDefault<String>(
                                                      clientsItem.merchantId,
                                                      'tochka-0',
                                                    ),
                                                    style: FlutterFlowTheme.of(
                                                            context)
                                                        .bodyMedium
                                                        .override(
                                                          fontFamily:
                                                              'Montserrat',
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .success,
                                                          fontSize: 13.0,
                                                          letterSpacing: 0.0,
                                                          fontWeight:
                                                              FontWeight.w600,
                                                        ),
                                                  ),
                                                  Padding(
                                                    padding:
                                                        EdgeInsetsDirectional
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
                                                    child: RichText(
                                                      textScaler:
                                                          MediaQuery.of(context)
                                                              .textScaler,
                                                      text: TextSpan(
                                                        children: [
                                                          TextSpan(
                                                            text:
                                                                valueOrDefault<
                                                                    String>(
                                                              clientsItem
                                                                  .franchiseEmail,
                                                              'ernest@tochkasklada.ru',
                                                            ),
                                                            style: TextStyle(
                                                              color: FlutterFlowTheme
                                                                      .of(context)
                                                                  .secondaryText,
                                                              fontSize: 14.0,
                                                            ),
                                                          )
                                                        ],
                                                        style: FlutterFlowTheme
                                                                .of(context)
                                                            .bodyMedium
                                                            .override(
                                                              fontFamily:
                                                                  'Montserrat',
                                                              letterSpacing:
                                                                  0.0,
                                                              lineHeight: 1.35,
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
                                                    child: Align(
                                                      alignment:
                                                          AlignmentDirectional(
                                                              0.0, 0.0),
                                                      child: Text(
                                                        valueOrDefault<String>(
                                                          clientsItem
                                                              .termActivity,
                                                          'Тестовый',
                                                        ),
                                                        style:
                                                            FlutterFlowTheme.of(
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
                                                    ),
                                                  ),
                                                  Builder(
                                                    builder: (context) {
                                                      if (clientsItem.aesPass !=
                                                              null &&
                                                          clientsItem.aesPass !=
                                                              '') {
                                                        return Icon(
                                                          Icons.check,
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .success,
                                                          size: 24.0,
                                                        );
                                                      } else {
                                                        return Icon(
                                                          Icons.error_rounded,
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .error,
                                                          size: 24.0,
                                                        );
                                                      }
                                                    },
                                                  ),
                                                  FlutterFlowIconButton(
                                                    borderColor:
                                                        Colors.transparent,
                                                    borderRadius: 16.0,
                                                    borderWidth: 1.0,
                                                    buttonSize: 48.0,
                                                    fillColor:
                                                        FlutterFlowTheme.of(
                                                                context)
                                                            .accent4,
                                                    hoverColor:
                                                        FlutterFlowTheme.of(
                                                                context)
                                                            .accent1,
                                                    hoverIconColor:
                                                        FlutterFlowTheme.of(
                                                                context)
                                                            .secondaryBackground,
                                                    icon: Icon(
                                                      Icons.edit_rounded,
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .primaryText,
                                                      size: 24.0,
                                                    ),
                                                    onPressed: () async {
                                                      _model.isCreateMerchant =
                                                          false;
                                                      safeSetState(() {});
                                                      scaffoldKey.currentState!
                                                          .openEndDrawer();
                                                    },
                                                  ),
                                                ]
                                                    .map((c) => DataCell(c))
                                                    .toList(),
                                              ),
                                              emptyBuilder: () =>
                                                  EmptyTablePlaceholderWidget(
                                                placeholderText:
                                                    'Мерчанты не созданы',
                                              ),
                                              paginated: true,
                                              selectable: false,
                                              hidePaginator: true,
                                              showFirstLastButtons: true,
                                              minWidth: 500.0,
                                              headingRowHeight: 42.0,
                                              dataRowHeight: 68.0,
                                              columnSpacing: 16.0,
                                              headingRowColor:
                                                  FlutterFlowTheme.of(context)
                                                      .primaryBackground,
                                              sortIconColor:
                                                  FlutterFlowTheme.of(context)
                                                      .primary,
                                              borderRadius: BorderRadius.only(
                                                bottomLeft:
                                                    Radius.circular(0.0),
                                                bottomRight:
                                                    Radius.circular(0.0),
                                                topLeft: Radius.circular(16.0),
                                                topRight: Radius.circular(16.0),
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
                                    ).animateOnPageLoad(animationsMap[
                                        'containerOnPageLoadAnimation']!);
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
