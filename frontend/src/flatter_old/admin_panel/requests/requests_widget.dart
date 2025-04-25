import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/components/breadcrumps_widget.dart';
import '/components/edit_request_widget.dart';
import '/components/empty_table_placeholder_widget.dart';
import '/components/request_table_widget.dart';
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
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import 'requests_model.dart';
export 'requests_model.dart';

class RequestsWidget extends StatefulWidget {
  const RequestsWidget({super.key});

  static String routeName = 'requests';
  static String routePath = '/requests';

  @override
  State<RequestsWidget> createState() => _RequestsWidgetState();
}

class _RequestsWidgetState extends State<RequestsWidget>
    with TickerProviderStateMixin {
  late RequestsModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  final animationsMap = <String, AnimationInfo>{};

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => RequestsModel());

    // On page load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      FFAppState().currentPage = Pages.requests;
      safeSetState(() {});
    });

    _model.textFieldSearchTextController ??= TextEditingController();
    _model.textFieldSearchFocusNode ??= FocusNode();

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
        title: 'requests',
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
                  child: wrapWithModel(
                    model: _model.editRequestModel,
                    updateCallback: () => safeSetState(() {}),
                    updateOnChange: true,
                    child: EditRequestWidget(
                      requestID: valueOrDefault<String>(
                        _model.requestID,
                        '000',
                      ),
                    ),
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
                        child: InkWell(
                          splashColor: Colors.transparent,
                          focusColor: Colors.transparent,
                          hoverColor: Colors.transparent,
                          highlightColor: Colors.transparent,
                          onTap: () async {
                            if (scaffoldKey.currentState!.isDrawerOpen ||
                                scaffoldKey.currentState!.isEndDrawerOpen) {
                              Navigator.pop(context);
                            }

                            _model.isDravlerOpen = false;
                            safeSetState(() {});
                            safeSetState(() {
                              _model.editRequestModel.notesTextController
                                  ?.clear();
                            });
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
                                            wrapWithModel(
                                              model: _model.breadcrumpsModel,
                                              updateCallback: () =>
                                                  safeSetState(() {}),
                                              updateOnChange: true,
                                              child: BreadcrumpsWidget(
                                                iconForSection: FaIcon(
                                                  FontAwesomeIcons.addressBook,
                                                  color: FlutterFlowTheme.of(
                                                          context)
                                                      .secondaryText,
                                                  size: 22.0,
                                                ),
                                                currentSectionTittle:
                                                    valueOrDefault<String>(
                                                  FFLocalizations.of(context)
                                                      .getVariableText(
                                                    ruText: 'Заявки',
                                                    enText: 'Requests',
                                                  ),
                                                  'Заявки',
                                                ),
                                                isSubpage: false,
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
                                                    BookingWidget.routeName);
                                              },
                                              child: wrapWithModel(
                                                model:
                                                    _model.submenuItembookModel,
                                                updateCallback: () =>
                                                    safeSetState(() {}),
                                                child: SubmenuItemWidget(
                                                  tittle: 'Бронирования',
                                                ),
                                              ),
                                            ),
                                            Row(
                                              mainAxisSize: MainAxisSize.max,
                                              mainAxisAlignment:
                                                  MainAxisAlignment.end,
                                              children: [
                                                if (responsiveVisibility(
                                                  context: context,
                                                  phone: false,
                                                ))
                                                  Container(
                                                    width: () {
                                                      if (MediaQuery.sizeOf(
                                                                  context)
                                                              .width <
                                                          kBreakpointSmall) {
                                                        return 60.0;
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
                                                        return 200.0;
                                                      } else {
                                                        return 200.0;
                                                      }
                                                    }(),
                                                    decoration: BoxDecoration(),
                                                    child: Container(
                                                      width: 200.0,
                                                      child: TextFormField(
                                                        controller: _model
                                                            .textFieldSearchTextController,
                                                        focusNode: _model
                                                            .textFieldSearchFocusNode,
                                                        autofocus: true,
                                                        autofillHints: [
                                                          AutofillHints.email
                                                        ],
                                                        obscureText: false,
                                                        decoration:
                                                            InputDecoration(
                                                          isDense: true,
                                                          labelStyle:
                                                              FlutterFlowTheme.of(
                                                                      context)
                                                                  .labelMedium
                                                                  .override(
                                                                    fontFamily:
                                                                        'Montserrat',
                                                                    letterSpacing:
                                                                        0.0,
                                                                    fontWeight:
                                                                        FontWeight
                                                                            .w600,
                                                                  ),
                                                          hintText:
                                                              FFLocalizations.of(
                                                                      context)
                                                                  .getText(
                                                            'kaylumjf' /* Поиск пользователя */,
                                                          ),
                                                          hintStyle:
                                                              FlutterFlowTheme.of(
                                                                      context)
                                                                  .bodyMedium
                                                                  .override(
                                                                    fontFamily:
                                                                        'Montserrat',
                                                                    color: FlutterFlowTheme.of(
                                                                            context)
                                                                        .tertiaryText,
                                                                    letterSpacing:
                                                                        0.0,
                                                                    fontWeight:
                                                                        FontWeight
                                                                            .w600,
                                                                  ),
                                                          enabledBorder:
                                                              OutlineInputBorder(
                                                            borderSide:
                                                                BorderSide(
                                                              color: FlutterFlowTheme
                                                                      .of(context)
                                                                  .primaryBackground,
                                                              width: 2.0,
                                                            ),
                                                            borderRadius:
                                                                BorderRadius
                                                                    .circular(
                                                                        16.0),
                                                          ),
                                                          focusedBorder:
                                                              OutlineInputBorder(
                                                            borderSide:
                                                                BorderSide(
                                                              color: FlutterFlowTheme
                                                                      .of(context)
                                                                  .grayAlpha,
                                                              width: 2.0,
                                                            ),
                                                            borderRadius:
                                                                BorderRadius
                                                                    .circular(
                                                                        16.0),
                                                          ),
                                                          errorBorder:
                                                              OutlineInputBorder(
                                                            borderSide:
                                                                BorderSide(
                                                              color: FlutterFlowTheme
                                                                      .of(context)
                                                                  .error,
                                                              width: 2.0,
                                                            ),
                                                            borderRadius:
                                                                BorderRadius
                                                                    .circular(
                                                                        16.0),
                                                          ),
                                                          focusedErrorBorder:
                                                              OutlineInputBorder(
                                                            borderSide:
                                                                BorderSide(
                                                              color: FlutterFlowTheme
                                                                      .of(context)
                                                                  .error,
                                                              width: 2.0,
                                                            ),
                                                            borderRadius:
                                                                BorderRadius
                                                                    .circular(
                                                                        16.0),
                                                          ),
                                                          filled: true,
                                                          fillColor: FlutterFlowTheme
                                                                  .of(context)
                                                              .primaryBackground,
                                                          prefixIcon: Icon(
                                                            Icons
                                                                .search_rounded,
                                                          ),
                                                        ),
                                                        style:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .bodyMedium
                                                                .override(
                                                                  fontFamily:
                                                                      'Montserrat',
                                                                  letterSpacing:
                                                                      0.0,
                                                                  fontWeight:
                                                                      FontWeight
                                                                          .w600,
                                                                ),
                                                        keyboardType:
                                                            TextInputType
                                                                .emailAddress,
                                                        validator: _model
                                                            .textFieldSearchTextControllerValidator
                                                            .asValidator(
                                                                context),
                                                      ),
                                                    ),
                                                  ),
                                              ].divide(SizedBox(width: 16.0)),
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
                                                        ruText: 'Новые заявки',
                                                        enText: 'New Requests',
                                                      ),
                                                      'Новые заявки',
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
                                        Expanded(
                                          flex: () {
                                            if (MediaQuery.sizeOf(context)
                                                    .width <
                                                kBreakpointSmall) {
                                              return 6;
                                            } else if (MediaQuery.sizeOf(
                                                        context)
                                                    .width <
                                                kBreakpointMedium) {
                                              return 3;
                                            } else if (MediaQuery.sizeOf(
                                                        context)
                                                    .width <
                                                kBreakpointLarge) {
                                              return 3;
                                            } else {
                                              return 3;
                                            }
                                          }(),
                                          child: Padding(
                                            padding:
                                                EdgeInsetsDirectional.fromSTEB(
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
                                                          return 16.0;
                                                        } else if (MediaQuery
                                                                    .sizeOf(
                                                                        context)
                                                                .width <
                                                            kBreakpointLarge) {
                                                          return 16.0;
                                                        } else {
                                                          return 16.0;
                                                        }
                                                      }(),
                                                      16.0,
                                                    ),
                                                    0.0,
                                                    0.0,
                                                    0.0),
                                            child: Container(
                                              width: 180.0,
                                              decoration: BoxDecoration(),
                                              child: Text(
                                                FFLocalizations.of(context)
                                                    .getText(
                                                  'v3er8ntf' /* Лид */,
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
                                          ),
                                        ),
                                        if (responsiveVisibility(
                                          context: context,
                                          phone: false,
                                          tablet: false,
                                        ))
                                          Expanded(
                                            flex: () {
                                              if (MediaQuery.sizeOf(context)
                                                      .width <
                                                  kBreakpointSmall) {
                                                return 2;
                                              } else if (MediaQuery.sizeOf(
                                                          context)
                                                      .width <
                                                  kBreakpointMedium) {
                                                return 1;
                                              } else if (MediaQuery.sizeOf(
                                                          context)
                                                      .width <
                                                  kBreakpointLarge) {
                                                return 1;
                                              } else {
                                                return 1;
                                              }
                                            }(),
                                            child: Align(
                                              alignment: AlignmentDirectional(
                                                  1.0, 0.0),
                                              child: Container(
                                                width: () {
                                                  if (MediaQuery.sizeOf(context)
                                                          .width <
                                                      kBreakpointSmall) {
                                                    return 36.0;
                                                  } else if (MediaQuery.sizeOf(
                                                              context)
                                                          .width <
                                                      kBreakpointMedium) {
                                                    return 140.0;
                                                  } else if (MediaQuery.sizeOf(
                                                              context)
                                                          .width <
                                                      kBreakpointLarge) {
                                                    return 140.0;
                                                  } else {
                                                    return 140.0;
                                                  }
                                                }(),
                                                decoration: BoxDecoration(),
                                                alignment: AlignmentDirectional(
                                                    1.0, 0.0),
                                                child: Align(
                                                  alignment:
                                                      AlignmentDirectional(
                                                          0.0, 0.0),
                                                  child: Padding(
                                                    padding:
                                                        EdgeInsetsDirectional
                                                            .fromSTEB(0.0, 0.0,
                                                                8.0, 0.0),
                                                    child: Row(
                                                      mainAxisSize:
                                                          MainAxisSize.max,
                                                      mainAxisAlignment:
                                                          MainAxisAlignment.end,
                                                      children: [
                                                        Text(
                                                          FFLocalizations.of(
                                                                  context)
                                                              .getText(
                                                            '4l2ak1om' /* Доступно */,
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
                                                      ].divide(
                                                          SizedBox(width: 8.0)),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                            ),
                                          ),
                                        Align(
                                          alignment:
                                              AlignmentDirectional(1.0, 0.0),
                                          child: Container(
                                            constraints: BoxConstraints(
                                              minWidth: 48.0,
                                            ),
                                            decoration: BoxDecoration(),
                                            child: Text(
                                              FFLocalizations.of(context)
                                                  .getText(
                                                '7zhntpj8' /* Локация */,
                                              ),
                                              style: FlutterFlowTheme.of(
                                                      context)
                                                  .bodySmall
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
                                        Container(
                                          width: () {
                                            if (MediaQuery.sizeOf(context)
                                                    .width <
                                                kBreakpointSmall) {
                                              return 28.0;
                                            } else if (MediaQuery.sizeOf(
                                                        context)
                                                    .width <
                                                kBreakpointMedium) {
                                              return 64.0;
                                            } else if (MediaQuery.sizeOf(
                                                        context)
                                                    .width <
                                                kBreakpointLarge) {
                                              return 64.0;
                                            } else {
                                              return 64.0;
                                            }
                                          }(),
                                          decoration: BoxDecoration(),
                                          child: Align(
                                            alignment:
                                                AlignmentDirectional(1.0, 0.0),
                                            child: Text(
                                              FFLocalizations.of(context)
                                                  .getText(
                                                'pc8ho419' /* Р-р */,
                                              ),
                                              style: FlutterFlowTheme.of(
                                                      context)
                                                  .bodySmall
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
                                        if (responsiveVisibility(
                                          context: context,
                                          phone: false,
                                          tablet: false,
                                          tabletLandscape: false,
                                        ))
                                          Align(
                                            alignment:
                                                AlignmentDirectional(1.0, 0.0),
                                            child: Container(
                                              width: 96.0,
                                              decoration: BoxDecoration(),
                                              alignment: AlignmentDirectional(
                                                  1.0, 0.0),
                                              child: Visibility(
                                                visible: responsiveVisibility(
                                                  context: context,
                                                  phone: false,
                                                  tablet: false,
                                                ),
                                                child: Text(
                                                  FFLocalizations.of(context)
                                                      .getText(
                                                    '9xw5gk8o' /* Дата заяки */,
                                                  ),
                                                  textAlign: TextAlign.end,
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
                                          ),
                                      ].divide(SizedBox(width: 0.0)),
                                    ),
                                  ),
                                ),
                              ),
                              Container(
                                height: 600.0,
                                decoration: BoxDecoration(),
                                child: FutureBuilder<List<RequestsRow>>(
                                  future: RequestsTable().queryRows(
                                    queryFn: (q) => q
                                        .eqOrNull(
                                          'processed',
                                          false,
                                        )
                                        .eqOrNull(
                                          'status',
                                          'lead',
                                        )
                                        .order('created_at'),
                                  ),
                                  builder: (context, snapshot) {
                                    // Customize what your widget looks like when it's loading.
                                    if (!snapshot.hasData) {
                                      return SkeletonMultiLineListWidget(
                                        height: 36.0,
                                        itemsQty: 4,
                                        radii: 16,
                                        spacer: 24,
                                        between: 12,
                                      );
                                    }
                                    List<RequestsRow>
                                        listViewRequestsRequestsRowList =
                                        snapshot.data!;

                                    if (listViewRequestsRequestsRowList
                                        .isEmpty) {
                                      return EmptyTablePlaceholderWidget(
                                        placeholderText: 'Нет новых заявок',
                                      );
                                    }

                                    return ListView.separated(
                                      padding: EdgeInsets.zero,
                                      scrollDirection: Axis.vertical,
                                      itemCount: listViewRequestsRequestsRowList
                                          .length,
                                      separatorBuilder: (_, __) =>
                                          SizedBox(height: 2.0),
                                      itemBuilder:
                                          (context, listViewRequestsIndex) {
                                        final listViewRequestsRequestsRow =
                                            listViewRequestsRequestsRowList[
                                                listViewRequestsIndex];
                                        return Visibility(
                                          visible: FFAppState().viewAsFranchisor
                                              ? true
                                              : (FFAppState().franchisee ==
                                                  listViewRequestsRequestsRow
                                                      .franchise),
                                          child: Padding(
                                            padding:
                                                EdgeInsetsDirectional.fromSTEB(
                                                    0.0, 0.0, 0.0, 2.0),
                                            child: InkWell(
                                              splashColor: Colors.transparent,
                                              focusColor: Colors.transparent,
                                              hoverColor: Colors.transparent,
                                              highlightColor:
                                                  Colors.transparent,
                                              onTap: () async {
                                                scaffoldKey.currentState!
                                                    .openEndDrawer();
                                                _model.requestID =
                                                    valueOrDefault<String>(
                                                  listViewRequestsRequestsRow
                                                      .requestId,
                                                  '0000',
                                                );
                                                _model.isDravlerOpen = true;
                                                safeSetState(() {});
                                                safeSetState(() {
                                                  _model
                                                          .editRequestModel
                                                          .notesTextController
                                                          ?.text =
                                                      listViewRequestsRequestsRow
                                                          .notes!;
                                                });
                                              },
                                              child: wrapWithModel(
                                                model: _model.requestTableModels
                                                    .getModel(
                                                  listViewRequestsRequestsRow
                                                      .requestId,
                                                  listViewRequestsIndex,
                                                ),
                                                updateCallback: () =>
                                                    safeSetState(() {}),
                                                updateOnChange: true,
                                                child: RequestTableWidget(
                                                  key: Key(
                                                    'Keypjx_${listViewRequestsRequestsRow.requestId}',
                                                  ),
                                                  clientPhone:
                                                      listViewRequestsRequestsRow
                                                          .phone,
                                                  clientEmail:
                                                      listViewRequestsRequestsRow
                                                          .email,
                                                  clientName:
                                                      listViewRequestsRequestsRow
                                                          .clientName!,
                                                  locPrefs:
                                                      listViewRequestsRequestsRow
                                                          .location!,
                                                  cellSize:
                                                      listViewRequestsRequestsRow
                                                          .size!,
                                                  requestStatus:
                                                      listViewRequestsRequestsRow
                                                          .status!,
                                                  createdAt:
                                                      listViewRequestsRequestsRow
                                                          .createdAt,
                                                  requestID:
                                                      listViewRequestsRequestsRow
                                                          .requestId,
                                                ),
                                              ),
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
