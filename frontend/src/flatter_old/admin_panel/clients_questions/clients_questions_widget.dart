import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/components/add_answer_widget.dart';
import '/components/breadcrumps_widget.dart';
import '/components/empty_table_placeholder_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/skeleton_multi_line_list_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_choice_chips.dart';
import '/flutter_flow/flutter_flow_data_table.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/form_field_controller.dart';
import '/index.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import 'clients_questions_model.dart';
export 'clients_questions_model.dart';

class ClientsQuestionsWidget extends StatefulWidget {
  const ClientsQuestionsWidget({super.key});

  static String routeName = 'clientsQuestions';
  static String routePath = '/clientsQuestions';

  @override
  State<ClientsQuestionsWidget> createState() => _ClientsQuestionsWidgetState();
}

class _ClientsQuestionsWidgetState extends State<ClientsQuestionsWidget> {
  late ClientsQuestionsModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => ClientsQuestionsModel());

    // On page load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      FFAppState().currentPage = Pages.clients;
      safeSetState(() {});
      _model.questionID = 0;
      _model.email = 'email';
      safeSetState(() {});
    });

    _model.textController ??= TextEditingController();
    _model.textFieldFocusNode ??= FocusNode();

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
        title: 'clientsQuestions',
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
              width: 380.0,
              child: Drawer(
                elevation: 16.0,
                child: Container(
                  decoration: BoxDecoration(
                    color: FlutterFlowTheme.of(context).secondaryBackground,
                  ),
                  child: wrapWithModel(
                    model: _model.addAnswerModel,
                    updateCallback: () => safeSetState(() {}),
                    updateOnChange: true,
                    child: AddAnswerWidget(
                      questionID: _model.questionID!,
                      userMail: _model.email!,
                      hasAnswer: !_model.isNewQuestion,
                      drawer: (resetStates) async {
                        _model.questionID = 0;
                        _model.email = 'email';
                        safeSetState(() {});
                      },
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
                        child: Align(
                          alignment: AlignmentDirectional(-1.0, -1.0),
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
                                    mainAxisSize: MainAxisSize.min,
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
                                                    ClientsWidget.routeName);
                                              },
                                              child: wrapWithModel(
                                                model: _model.breadcrumpsModel,
                                                updateCallback: () =>
                                                    safeSetState(() {}),
                                                updateOnChange: true,
                                                child: BreadcrumpsWidget(
                                                  iconForSection: FaIcon(
                                                    FontAwesomeIcons.houseUser,
                                                    color: FlutterFlowTheme.of(
                                                            context)
                                                        .secondaryText,
                                                    size: 22.0,
                                                  ),
                                                  currentSectionTittle:
                                                      valueOrDefault<String>(
                                                    FFLocalizations.of(context)
                                                        .getVariableText(
                                                      ruText: 'Клиенты',
                                                      enText: 'Clients',
                                                    ),
                                                    'Клиенты',
                                                  ),
                                                  isSubpage: false,
                                                ),
                                              ),
                                            ),
                                            Row(
                                              mainAxisSize: MainAxisSize.min,
                                              children: [
                                                if (responsiveVisibility(
                                                  context: context,
                                                  phone: false,
                                                  tablet: false,
                                                ))
                                                  Padding(
                                                    padding:
                                                        EdgeInsetsDirectional
                                                            .fromSTEB(0.0, 0.0,
                                                                16.0, 0.0),
                                                    child: Container(
                                                      width: 200.0,
                                                      child: TextFormField(
                                                        controller: _model
                                                            .textController,
                                                        focusNode: _model
                                                            .textFieldFocusNode,
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
                                                            '5klan197' /* Поиск  */,
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
                                                            .textControllerValidator
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
                                            16.0, 24.0, 16.0, 0.0),
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
                                                        'Вопросы от клиентов',
                                                    subtittle: 'test',
                                                    hasIcon: false,
                                                    hasSubtittle: false,
                                                    margin: 24,
                                                  ),
                                                ),
                                              ),
                                            ),
                                            Expanded(
                                              child: Align(
                                                alignment: AlignmentDirectional(
                                                    1.0, 0.0),
                                                child: FlutterFlowChoiceChips(
                                                  options: [
                                                    ChipData(FFLocalizations.of(
                                                            context)
                                                        .getText(
                                                      '9rhfjtfp' /* Новые */,
                                                    )),
                                                    ChipData(FFLocalizations.of(
                                                            context)
                                                        .getText(
                                                      'xmegm663' /* С ответами */,
                                                    ))
                                                  ],
                                                  onChanged: (val) async {
                                                    safeSetState(() => _model
                                                            .choiceChipsValue =
                                                        val?.firstOrNull);
                                                    _model.isNewQuestion =
                                                        valueOrDefault<bool>(
                                                      _model.choiceChipsValue ==
                                                          'Новые',
                                                      true,
                                                    );
                                                    safeSetState(() {});
                                                  },
                                                  selectedChipStyle: ChipStyle(
                                                    backgroundColor:
                                                        FlutterFlowTheme.of(
                                                                context)
                                                            .secondary,
                                                    textStyle: FlutterFlowTheme
                                                            .of(context)
                                                        .bodyMedium
                                                        .override(
                                                          fontFamily:
                                                              'Montserrat',
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .info,
                                                          letterSpacing: 0.0,
                                                          fontWeight:
                                                              FontWeight.w600,
                                                        ),
                                                    iconColor:
                                                        FlutterFlowTheme.of(
                                                                context)
                                                            .info,
                                                    iconSize: 18.0,
                                                    elevation: 4.0,
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            16.0),
                                                  ),
                                                  unselectedChipStyle:
                                                      ChipStyle(
                                                    backgroundColor:
                                                        FlutterFlowTheme.of(
                                                                context)
                                                            .alternate,
                                                    textStyle: FlutterFlowTheme
                                                            .of(context)
                                                        .bodyMedium
                                                        .override(
                                                          fontFamily:
                                                              'Montserrat',
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .secondaryText,
                                                          letterSpacing: 0.0,
                                                        ),
                                                    iconColor:
                                                        FlutterFlowTheme.of(
                                                                context)
                                                            .secondaryText,
                                                    iconSize: 18.0,
                                                    elevation: 0.0,
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            16.0),
                                                  ),
                                                  chipSpacing: 12.0,
                                                  rowSpacing: 12.0,
                                                  multiselect: false,
                                                  initialized:
                                                      _model.choiceChipsValue !=
                                                          null,
                                                  alignment:
                                                      WrapAlignment.start,
                                                  controller: _model
                                                          .choiceChipsValueController ??=
                                                      FormFieldController<
                                                          List<String>>(
                                                    [
                                                      FFLocalizations.of(
                                                              context)
                                                          .getText(
                                                        'gy2g4ozf' /* Новые */,
                                                      )
                                                    ],
                                                  ),
                                                  wrapped: false,
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
                                child: Padding(
                                  padding: EdgeInsets.all(16.0),
                                  child:
                                      FutureBuilder<List<SupportRequestsRow>>(
                                    future: SupportRequestsTable().queryRows(
                                      queryFn: (q) => q
                                          .eqOrNull(
                                            'has_answer',
                                            !_model.isNewQuestion,
                                          )
                                          .order('created_at'),
                                    ),
                                    builder: (context, snapshot) {
                                      // Customize what your widget looks like when it's loading.
                                      if (!snapshot.hasData) {
                                        return SkeletonMultiLineListWidget(
                                          height: 96.0,
                                          itemsQty: 1,
                                          radii: 16,
                                          spacer: 16,
                                          between: 16,
                                        );
                                      }
                                      List<SupportRequestsRow>
                                          maxWidthSupportRequestsRowList =
                                          snapshot.data!;

                                      return Container(
                                        width: double.infinity,
                                        height:
                                            MediaQuery.sizeOf(context).height *
                                                0.8,
                                        decoration: BoxDecoration(
                                          borderRadius:
                                              BorderRadius.circular(16.0),
                                          border: Border.all(
                                            color: FlutterFlowTheme.of(context)
                                                .grayAlpha,
                                          ),
                                        ),
                                        alignment:
                                            AlignmentDirectional(-1.0, -1.0),
                                        child: Align(
                                          alignment:
                                              AlignmentDirectional(-1.0, -1.0),
                                          child: Padding(
                                            padding:
                                                EdgeInsetsDirectional.fromSTEB(
                                                    24.0, 16.0, 24.0, 0.0),
                                            child: Builder(
                                              builder: (context) {
                                                final clientsQuestions =
                                                    maxWidthSupportRequestsRowList
                                                        .toList();
                                                if (clientsQuestions.isEmpty) {
                                                  return EmptyTablePlaceholderWidget(
                                                    placeholderText:
                                                        'Нет вопросов',
                                                  );
                                                }

                                                return FlutterFlowDataTable<
                                                    SupportRequestsRow>(
                                                  controller: _model
                                                      .paginatedDataTableController,
                                                  data: clientsQuestions,
                                                  numRows: valueOrDefault<int>(
                                                    clientsQuestions.length,
                                                    10,
                                                  ),
                                                  columnsBuilder:
                                                      (onSortChanged) => [
                                                    DataColumn2(
                                                      label: DefaultTextStyle
                                                          .merge(
                                                        softWrap: true,
                                                        child: Visibility(
                                                          visible:
                                                              responsiveVisibility(
                                                            context: context,
                                                            phone: false,
                                                            tablet: false,
                                                          ),
                                                          child: Padding(
                                                            padding: EdgeInsetsDirectional
                                                                .fromSTEB(
                                                                    valueOrDefault<
                                                                        double>(
                                                                      () {
                                                                        if (MediaQuery.sizeOf(context).width <
                                                                            kBreakpointSmall) {
                                                                          return 0.0;
                                                                        } else if (MediaQuery.sizeOf(context).width <
                                                                            kBreakpointMedium) {
                                                                          return 16.0;
                                                                        } else if (MediaQuery.sizeOf(context).width <
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
                                                                'beu17666' /* Тема */,
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
                                                            'm0hh39wq' /* Вопрос */,
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
                                                      fixedWidth:
                                                          valueOrDefault<
                                                              double>(
                                                        () {
                                                          if (MediaQuery.sizeOf(
                                                                      context)
                                                                  .width <
                                                              kBreakpointSmall) {
                                                            return 200.0;
                                                          } else if (MediaQuery
                                                                      .sizeOf(
                                                                          context)
                                                                  .width <
                                                              kBreakpointMedium) {
                                                            return 280.0;
                                                          } else if (MediaQuery
                                                                      .sizeOf(
                                                                          context)
                                                                  .width <
                                                              kBreakpointLarge) {
                                                            return 400.0;
                                                          } else {
                                                            return 400.0;
                                                          }
                                                        }(),
                                                        400.0,
                                                      ),
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
                                                            tablet: false,
                                                          ),
                                                          child: Align(
                                                            alignment:
                                                                AlignmentDirectional(
                                                                    -1.0, 0.0),
                                                            child: Text(
                                                              FFLocalizations.of(
                                                                      context)
                                                                  .getText(
                                                                'th7elznk' /* Ответ */,
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
                                                            return 160.0;
                                                          } else if (MediaQuery
                                                                      .sizeOf(
                                                                          context)
                                                                  .width <
                                                              kBreakpointLarge) {
                                                            return 160.0;
                                                          } else {
                                                            return 160.0;
                                                          }
                                                        }(),
                                                        160.0,
                                                      ),
                                                      onSort: onSortChanged,
                                                    ),
                                                    DataColumn2(
                                                      label: DefaultTextStyle
                                                          .merge(
                                                        softWrap: true,
                                                        child: Visibility(
                                                          visible: !_model
                                                                  .isNewQuestion &&
                                                              responsiveVisibility(
                                                                context:
                                                                    context,
                                                                phone: false,
                                                              ),
                                                          child: Text(
                                                            FFLocalizations.of(
                                                                    context)
                                                                .getText(
                                                              'g4zgf7w7' /* Автор ответа */,
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
                                                  ],
                                                  dataRowBuilder:
                                                      (clientsQuestionsItem,
                                                              clientsQuestionsIndex,
                                                              selected,
                                                              onSelectChanged) =>
                                                          DataRow(
                                                    color: WidgetStateProperty
                                                        .all(
                                                      clientsQuestionsIndex %
                                                                  2 ==
                                                              0
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
                                                          child: InkWell(
                                                            splashColor: Colors
                                                                .transparent,
                                                            focusColor: Colors
                                                                .transparent,
                                                            hoverColor: Colors
                                                                .transparent,
                                                            highlightColor:
                                                                Colors
                                                                    .transparent,
                                                            onTap: () async {
                                                              _model.questionID =
                                                                  valueOrDefault<
                                                                      int>(
                                                                clientsQuestionsItem
                                                                    .id,
                                                                0,
                                                              );
                                                              _model.email =
                                                                  valueOrDefault<
                                                                      String>(
                                                                clientsQuestionsItem
                                                                    .email,
                                                                '0',
                                                              );
                                                              safeSetState(
                                                                  () {});
                                                              scaffoldKey
                                                                  .currentState!
                                                                  .openEndDrawer();
                                                            },
                                                            child: RichText(
                                                              textScaler:
                                                                  MediaQuery.of(
                                                                          context)
                                                                      .textScaler,
                                                              text: TextSpan(
                                                                children: [
                                                                  TextSpan(
                                                                    text: valueOrDefault<
                                                                        String>(
                                                                      clientsQuestionsItem
                                                                          .theme,
                                                                      'тема вопроса',
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
                                                                        ),
                                                                  ),
                                                                  TextSpan(
                                                                    text: FFLocalizations.of(
                                                                            context)
                                                                        .getText(
                                                                      'ojnhr27t' /* 
 */
                                                                      ,
                                                                    ),
                                                                    style:
                                                                        TextStyle(),
                                                                  ),
                                                                  TextSpan(
                                                                    text: valueOrDefault<
                                                                        String>(
                                                                      clientsQuestionsItem
                                                                          .email,
                                                                      'почта',
                                                                    ),
                                                                    style:
                                                                        TextStyle(
                                                                      color: FlutterFlowTheme.of(
                                                                              context)
                                                                          .secondary,
                                                                      fontSize:
                                                                          12.0,
                                                                    ),
                                                                  ),
                                                                  TextSpan(
                                                                    text: FFLocalizations.of(
                                                                            context)
                                                                        .getText(
                                                                      'qeq3076u' /* 
 */
                                                                      ,
                                                                    ),
                                                                    style:
                                                                        TextStyle(),
                                                                  ),
                                                                  TextSpan(
                                                                    text: valueOrDefault<
                                                                        String>(
                                                                      dateTimeFormat(
                                                                        "dd.MM.yy HH:mm",
                                                                        clientsQuestionsItem
                                                                            .createdAt,
                                                                        locale:
                                                                            FFLocalizations.of(context).languageCode,
                                                                      ),
                                                                      'dd.MM.yy HH:mm',
                                                                    ),
                                                                    style:
                                                                        TextStyle(
                                                                      color: FlutterFlowTheme.of(
                                                                              context)
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
                                                          _model.questionID =
                                                              valueOrDefault<
                                                                  int>(
                                                            clientsQuestionsItem
                                                                .id,
                                                            0,
                                                          );
                                                          _model.email =
                                                              valueOrDefault<
                                                                  String>(
                                                            clientsQuestionsItem
                                                                .email,
                                                            '0',
                                                          );
                                                          safeSetState(() {});
                                                          scaffoldKey
                                                              .currentState!
                                                              .openEndDrawer();
                                                        },
                                                        child: Text(
                                                          valueOrDefault<
                                                              String>(
                                                            clientsQuestionsItem
                                                                .question,
                                                            'вопрос',
                                                          ).maybeHandleOverflow(
                                                            maxChars: 64,
                                                            replacement: '…',
                                                          ),
                                                          style: FlutterFlowTheme
                                                                  .of(context)
                                                              .bodyMedium
                                                              .override(
                                                                fontFamily:
                                                                    'Montserrat',
                                                                color: FlutterFlowTheme.of(
                                                                        context)
                                                                    .primaryText,
                                                                fontSize: 12.0,
                                                                letterSpacing:
                                                                    0.0,
                                                                fontWeight:
                                                                    FontWeight
                                                                        .normal,
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
                                                                  -1.0, 0.0),
                                                          child: Builder(
                                                            builder: (context) {
                                                              if (!clientsQuestionsItem
                                                                  .hasAnswer!) {
                                                                return InkWell(
                                                                  splashColor:
                                                                      Colors
                                                                          .transparent,
                                                                  focusColor: Colors
                                                                      .transparent,
                                                                  hoverColor: Colors
                                                                      .transparent,
                                                                  highlightColor:
                                                                      Colors
                                                                          .transparent,
                                                                  onTap:
                                                                      () async {
                                                                    _model.questionID =
                                                                        valueOrDefault<
                                                                            int>(
                                                                      clientsQuestionsItem
                                                                          .id,
                                                                      0,
                                                                    );
                                                                    _model.email =
                                                                        valueOrDefault<
                                                                            String>(
                                                                      clientsQuestionsItem
                                                                          .email,
                                                                      '0',
                                                                    );
                                                                    safeSetState(
                                                                        () {});
                                                                    scaffoldKey
                                                                        .currentState!
                                                                        .openEndDrawer();
                                                                  },
                                                                  child:
                                                                      Container(
                                                                    decoration:
                                                                        BoxDecoration(
                                                                      borderRadius:
                                                                          BorderRadius.circular(
                                                                              16.0),
                                                                      border:
                                                                          Border
                                                                              .all(
                                                                        color: FlutterFlowTheme.of(context)
                                                                            .primary,
                                                                      ),
                                                                    ),
                                                                    child:
                                                                        Visibility(
                                                                      visible:
                                                                          responsiveVisibility(
                                                                        context:
                                                                            context,
                                                                        phone:
                                                                            false,
                                                                      ),
                                                                      child:
                                                                          Padding(
                                                                        padding: EdgeInsetsDirectional.fromSTEB(
                                                                            8.0,
                                                                            4.0,
                                                                            8.0,
                                                                            4.0),
                                                                        child:
                                                                            Text(
                                                                          valueOrDefault<
                                                                              String>(
                                                                            clientsQuestionsItem.hasAnswer!
                                                                                ? clientsQuestionsItem.answer
                                                                                : 'Ответить',
                                                                            'Ответить',
                                                                          ),
                                                                          textAlign:
                                                                              TextAlign.start,
                                                                          style: FlutterFlowTheme.of(context)
                                                                              .bodyMedium
                                                                              .override(
                                                                                fontFamily: 'Montserrat',
                                                                                color: valueOrDefault<Color>(
                                                                                  clientsQuestionsItem.hasAnswer! ? FlutterFlowTheme.of(context).secondaryText : FlutterFlowTheme.of(context).primary,
                                                                                  FlutterFlowTheme.of(context).primary,
                                                                                ),
                                                                                fontSize: valueOrDefault<double>(
                                                                                  (clientsQuestionsItem.hasAnswer! ? 12 : 16).toDouble(),
                                                                                  16.0,
                                                                                ),
                                                                                letterSpacing: 0.0,
                                                                              ),
                                                                        ),
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
                                                                    phone:
                                                                        false,
                                                                  ),
                                                                  child: Text(
                                                                    valueOrDefault<
                                                                        String>(
                                                                      clientsQuestionsItem
                                                                          .answer,
                                                                      'ответить',
                                                                    ).maybeHandleOverflow(
                                                                      maxChars:
                                                                          32,
                                                                      replacement:
                                                                          '…',
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
                                                                          color:
                                                                              FlutterFlowTheme.of(context).secondaryText,
                                                                          fontSize:
                                                                              12.0,
                                                                          letterSpacing:
                                                                              0.0,
                                                                        ),
                                                                  ),
                                                                );
                                                              }
                                                            },
                                                          ),
                                                        ),
                                                      ),
                                                      Visibility(
                                                        visible: !_model
                                                                .isNewQuestion &&
                                                            responsiveVisibility(
                                                              context: context,
                                                              phone: false,
                                                            ),
                                                        child: Align(
                                                          alignment:
                                                              AlignmentDirectional(
                                                                  -1.0, 0.0),
                                                          child: Column(
                                                            mainAxisSize:
                                                                MainAxisSize
                                                                    .max,
                                                            crossAxisAlignment:
                                                                CrossAxisAlignment
                                                                    .start,
                                                            children: [
                                                              Text(
                                                                valueOrDefault<
                                                                    String>(
                                                                  clientsQuestionsItem
                                                                      .answerBy,
                                                                  'autor',
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
                                                                          12.0,
                                                                      letterSpacing:
                                                                          0.0,
                                                                    ),
                                                              ),
                                                              Text(
                                                                valueOrDefault<
                                                                    String>(
                                                                  dateTimeFormat(
                                                                    "dd.MM.yy HH:mm",
                                                                    clientsQuestionsItem
                                                                        .answerDate,
                                                                    locale: FFLocalizations.of(
                                                                            context)
                                                                        .languageCode,
                                                                  ),
                                                                  'dd.MM.yy HH:mm',
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
                                                                          11.0,
                                                                      letterSpacing:
                                                                          0.0,
                                                                    ),
                                                              ),
                                                              Padding(
                                                                padding:
                                                                    EdgeInsetsDirectional
                                                                        .fromSTEB(
                                                                            0.0,
                                                                            4.0,
                                                                            0.0,
                                                                            4.0),
                                                                child: InkWell(
                                                                  splashColor:
                                                                      Colors
                                                                          .transparent,
                                                                  focusColor: Colors
                                                                      .transparent,
                                                                  hoverColor: Colors
                                                                      .transparent,
                                                                  highlightColor:
                                                                      Colors
                                                                          .transparent,
                                                                  onTap:
                                                                      () async {
                                                                    _model.questionID =
                                                                        valueOrDefault<
                                                                            int>(
                                                                      clientsQuestionsItem
                                                                          .id,
                                                                      0,
                                                                    );
                                                                    _model.email =
                                                                        valueOrDefault<
                                                                            String>(
                                                                      clientsQuestionsItem
                                                                          .email,
                                                                      '0',
                                                                    );
                                                                    safeSetState(
                                                                        () {});
                                                                    scaffoldKey
                                                                        .currentState!
                                                                        .openEndDrawer();
                                                                  },
                                                                  child:
                                                                      Container(
                                                                    decoration:
                                                                        BoxDecoration(
                                                                      borderRadius:
                                                                          BorderRadius.circular(
                                                                              16.0),
                                                                      border:
                                                                          Border
                                                                              .all(
                                                                        color: FlutterFlowTheme.of(context)
                                                                            .primary,
                                                                      ),
                                                                    ),
                                                                    child:
                                                                        Visibility(
                                                                      visible:
                                                                          responsiveVisibility(
                                                                        context:
                                                                            context,
                                                                        phone:
                                                                            false,
                                                                      ),
                                                                      child:
                                                                          Padding(
                                                                        padding: EdgeInsetsDirectional.fromSTEB(
                                                                            8.0,
                                                                            2.0,
                                                                            8.0,
                                                                            2.0),
                                                                        child:
                                                                            Text(
                                                                          FFLocalizations.of(context)
                                                                              .getText(
                                                                            '4q2deh9z' /* Редактировать */,
                                                                          ),
                                                                          textAlign:
                                                                              TextAlign.start,
                                                                          style: FlutterFlowTheme.of(context)
                                                                              .bodyMedium
                                                                              .override(
                                                                                fontFamily: 'Montserrat',
                                                                                color: valueOrDefault<Color>(
                                                                                  clientsQuestionsItem.hasAnswer! ? FlutterFlowTheme.of(context).secondaryText : FlutterFlowTheme.of(context).primary,
                                                                                  FlutterFlowTheme.of(context).primary,
                                                                                ),
                                                                                fontSize: 11.0,
                                                                                letterSpacing: 0.0,
                                                                              ),
                                                                        ),
                                                                      ),
                                                                    ),
                                                                  ),
                                                                ),
                                                              ),
                                                            ],
                                                          ),
                                                        ),
                                                      ),
                                                    ]
                                                        .map((c) => DataCell(c))
                                                        .toList(),
                                                  ),
                                                  emptyBuilder: () =>
                                                      EmptyTablePlaceholderWidget(
                                                    placeholderText:
                                                        'Нет вопросов',
                                                  ),
                                                  paginated: true,
                                                  selectable: false,
                                                  hidePaginator: true,
                                                  showFirstLastButtons: true,
                                                  width: double.infinity,
                                                  minWidth: 500.0,
                                                  headingRowHeight: 42.0,
                                                  dataRowHeight: 72.0,
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
                                      );
                                    },
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
