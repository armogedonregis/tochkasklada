import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/components/breadcrumps_widget.dart';
import '/components/empty_table_placeholder_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/skeleton_multi_line_list_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_data_table.dart';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import 'payments_model.dart';
export 'payments_model.dart';

class PaymentsWidget extends StatefulWidget {
  const PaymentsWidget({super.key});

  static String routeName = 'payments';
  static String routePath = '/payments';

  @override
  State<PaymentsWidget> createState() => _PaymentsWidgetState();
}

class _PaymentsWidgetState extends State<PaymentsWidget>
    with TickerProviderStateMixin {
  late PaymentsModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  final animationsMap = <String, AnimationInfo>{};

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => PaymentsModel());

    // On page load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      FFAppState().currentPage = Pages.payments;
      safeSetState(() {});
    });

    _model.textController ??= TextEditingController();
    _model.textFieldFocusNode ??= FocusNode();

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
        title: 'payments',
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
                        'uwf9l9sj' /* Order Details */,
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
                                                iconForSection: FaIcon(
                                                  FontAwesomeIcons.coins,
                                                  color: FlutterFlowTheme.of(
                                                          context)
                                                      .secondaryText,
                                                  size: 22.0,
                                                ),
                                                currentSectionTittle:
                                                    valueOrDefault<String>(
                                                  FFLocalizations.of(context)
                                                      .getVariableText(
                                                    ruText: 'Платежи',
                                                    enText: 'Payments',
                                                  ),
                                                  'Платежи',
                                                ),
                                                isSubpage: false,
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
                                                  Container(
                                                    width: 200.0,
                                                    child: TextFormField(
                                                      controller:
                                                          _model.textController,
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
                                                          'n1g8q03t' /* Поиск пользователя */,
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
                                                        fillColor:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .primaryBackground,
                                                        prefixIcon: Icon(
                                                          Icons.search_rounded,
                                                        ),
                                                      ),
                                                      style: FlutterFlowTheme
                                                              .of(context)
                                                          .bodyMedium
                                                          .override(
                                                            fontFamily:
                                                                'Montserrat',
                                                            letterSpacing: 0.0,
                                                            fontWeight:
                                                                FontWeight.w600,
                                                          ),
                                                      keyboardType:
                                                          TextInputType
                                                              .emailAddress,
                                                      validator: _model
                                                          .textControllerValidator
                                                          .asValidator(context),
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
                                                        ruText: 'Все платежи',
                                                        enText: 'All payments',
                                                      ),
                                                      'Все платежи',
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
                                    0.0, 0.0, 24.0, 0.0),
                                child: FutureBuilder<List<PaymentviewRow>>(
                                  future: PaymentviewTable().queryRows(
                                    queryFn: (q) => q.order('created_at'),
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
                                    List<PaymentviewRow>
                                        containerPaymentviewRowList =
                                        snapshot.data!;

                                    return Container(
                                      constraints: BoxConstraints(
                                        maxHeight: 600.0,
                                      ),
                                      decoration: BoxDecoration(),
                                      child: Align(
                                        alignment:
                                            AlignmentDirectional(-1.0, -1.0),
                                        child: Builder(
                                          builder: (context) {
                                            if (FFAppState().viewAsFranchisor) {
                                              return Padding(
                                                padding: EdgeInsetsDirectional
                                                    .fromSTEB(
                                                        22.0, 16.0, 0.0, 0.0),
                                                child: Builder(
                                                  builder: (context) {
                                                    final clients =
                                                        containerPaymentviewRowList
                                                            .map((e) => e)
                                                            .toList();
                                                    if (clients.isEmpty) {
                                                      return EmptyTablePlaceholderWidget(
                                                        placeholderText:
                                                            'Нет клиентов по заданным параметрам',
                                                      );
                                                    }

                                                    return FlutterFlowDataTable<
                                                        PaymentviewRow>(
                                                      controller: _model
                                                          .paginatedDataTableController1,
                                                      data: clients,
                                                      numRows:
                                                          valueOrDefault<int>(
                                                        clients.length,
                                                        10,
                                                      ),
                                                      columnsBuilder:
                                                          (onSortChanged) => [
                                                        DataColumn2(
                                                          label:
                                                              DefaultTextStyle
                                                                  .merge(
                                                            softWrap: true,
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
                                                                  'w1jin05g' /* Дата */,
                                                                ),
                                                                style: FlutterFlowTheme.of(
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
                                                          label:
                                                              DefaultTextStyle
                                                                  .merge(
                                                            softWrap: true,
                                                            child: Text(
                                                              FFLocalizations.of(
                                                                      context)
                                                                  .getText(
                                                                'h56iuuy6' /* Сумма, ₽ */,
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
                                                          fixedWidth: 160.0,
                                                          onSort: onSortChanged,
                                                        ),
                                                        DataColumn2(
                                                          label:
                                                              DefaultTextStyle
                                                                  .merge(
                                                            softWrap: true,
                                                            child: Visibility(
                                                              visible:
                                                                  responsiveVisibility(
                                                                context:
                                                                    context,
                                                                phone: false,
                                                              ),
                                                              child: Align(
                                                                alignment:
                                                                    AlignmentDirectional(
                                                                        -1.0,
                                                                        0.0),
                                                                child: Text(
                                                                  FFLocalizations.of(
                                                                          context)
                                                                      .getText(
                                                                    'njzqtnjh' /* Клиент */,
                                                                  ),
                                                                  textAlign:
                                                                      TextAlign
                                                                          .center,
                                                                  style: FlutterFlowTheme.of(
                                                                          context)
                                                                      .bodySmall
                                                                      .override(
                                                                        fontFamily:
                                                                            'Montserrat',
                                                                        color: FlutterFlowTheme.of(context)
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
                                                          label:
                                                              DefaultTextStyle
                                                                  .merge(
                                                            softWrap: true,
                                                            child: Visibility(
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
                                                                  '3yxax4yz' /* Ячейка */,
                                                                ),
                                                                style: FlutterFlowTheme.of(
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
                                                          label:
                                                              DefaultTextStyle
                                                                  .merge(
                                                            softWrap: true,
                                                            child: Align(
                                                              alignment:
                                                                  AlignmentDirectional(
                                                                      1.0, 0.0),
                                                              child: Text(
                                                                FFLocalizations.of(
                                                                        context)
                                                                    .getText(
                                                                  'ftk9ylr0' /* Р-р */,
                                                                ),
                                                                textAlign:
                                                                    TextAlign
                                                                        .start,
                                                                style: FlutterFlowTheme.of(
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
                                                          label:
                                                              DefaultTextStyle
                                                                  .merge(
                                                            softWrap: true,
                                                            child: Text(
                                                              FFLocalizations.of(
                                                                      context)
                                                                  .getText(
                                                                'fptc9qrl' /* Аренда до */,
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
                                                          fixedWidth: 100.0,
                                                        ),
                                                        DataColumn2(
                                                          label:
                                                              DefaultTextStyle
                                                                  .merge(
                                                            softWrap: true,
                                                            child: Text(
                                                              FFLocalizations.of(
                                                                      context)
                                                                  .getText(
                                                                'qtbja31e' /* Фр */,
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
                                                        DataColumn2(
                                                          label:
                                                              DefaultTextStyle
                                                                  .merge(
                                                            softWrap: true,
                                                            child: Text(
                                                              FFLocalizations.of(
                                                                      context)
                                                                  .getText(
                                                                '2hf3iec5' /* Дней */,
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
                                                      dataRowBuilder: (clientsItem,
                                                              clientsIndex,
                                                              selected,
                                                              onSelectChanged) =>
                                                          DataRow(
                                                        color:
                                                            WidgetStateProperty
                                                                .all(
                                                          clientsIndex % 2 == 0
                                                              ? FlutterFlowTheme
                                                                      .of(
                                                                          context)
                                                                  .secondaryBackground
                                                              : FlutterFlowTheme
                                                                      .of(context)
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
                                                              valueOrDefault<
                                                                  String>(
                                                                dateTimeFormat(
                                                                  "dd.MM.yy",
                                                                  clientsItem
                                                                      .createdAt,
                                                                  locale: FFLocalizations.of(
                                                                          context)
                                                                      .languageCode,
                                                                ),
                                                                'нет',
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
                                                          Text(
                                                            valueOrDefault<
                                                                String>(
                                                              clientsItem.amount
                                                                  ?.toString(),
                                                              '0',
                                                            ),
                                                            style: FlutterFlowTheme
                                                                    .of(context)
                                                                .bodyMedium
                                                                .override(
                                                                  fontFamily:
                                                                      'Montserrat',
                                                                  color: FlutterFlowTheme.of(
                                                                          context)
                                                                      .success,
                                                                  fontSize:
                                                                      13.0,
                                                                  letterSpacing:
                                                                      0.0,
                                                                  fontWeight:
                                                                      FontWeight
                                                                          .w600,
                                                                ),
                                                          ),
                                                          Padding(
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
                                                                      clientsItem
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
                                                                      'gxdho1gz' /* 
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
                                                                      clientsItem
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
                                                                      'dz2jojdw' /* 
 */
                                                                      ,
                                                                    ),
                                                                    style:
                                                                        TextStyle(),
                                                                  ),
                                                                  TextSpan(
                                                                    text: valueOrDefault<
                                                                        String>(
                                                                      clientsItem
                                                                          .clientEmail,
                                                                      'email',
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
                                                          Visibility(
                                                            visible:
                                                                responsiveVisibility(
                                                              context: context,
                                                              phone: false,
                                                            ),
                                                            child: Text(
                                                              valueOrDefault<
                                                                  String>(
                                                                clientsItem
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
                                                          Align(
                                                            alignment:
                                                                AlignmentDirectional(
                                                                    1.0, 0.0),
                                                            child: Padding(
                                                              padding:
                                                                  EdgeInsetsDirectional
                                                                      .fromSTEB(
                                                                          0.0,
                                                                          0.0,
                                                                          24.0,
                                                                          0.0),
                                                              child: Text(
                                                                valueOrDefault<
                                                                    String>(
                                                                  clientsItem
                                                                      .cellSize,
                                                                  '-',
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
                                                            valueOrDefault<
                                                                String>(
                                                              dateTimeFormat(
                                                                "dd.MM.yy",
                                                                clientsItem
                                                                    .paidUntil,
                                                                locale: FFLocalizations.of(
                                                                        context)
                                                                    .languageCode,
                                                              ),
                                                              'dd.MM.yy',
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
                                                          Text(
                                                            valueOrDefault<
                                                                String>(
                                                              clientsItem
                                                                  .franchiseId
                                                                  ?.toString(),
                                                              '0',
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
                                                          Text(
                                                            valueOrDefault<
                                                                String>(
                                                              clientsItem
                                                                  .rentalDays
                                                                  .toString(),
                                                              '30',
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
                                                        ]
                                                            .map((c) =>
                                                                DataCell(c))
                                                            .toList(),
                                                      ),
                                                      emptyBuilder: () =>
                                                          EmptyTablePlaceholderWidget(
                                                        placeholderText:
                                                            'Нет клиентов по заданным параметрам',
                                                      ),
                                                      paginated: true,
                                                      selectable: false,
                                                      hidePaginator: true,
                                                      showFirstLastButtons:
                                                          true,
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
                                                            Radius.circular(
                                                                0.0),
                                                        bottomRight:
                                                            Radius.circular(
                                                                0.0),
                                                        topLeft:
                                                            Radius.circular(
                                                                16.0),
                                                        topRight:
                                                            Radius.circular(
                                                                16.0),
                                                      ),
                                                      addHorizontalDivider:
                                                          false,
                                                      addTopAndBottomDivider:
                                                          false,
                                                      hideDefaultHorizontalDivider:
                                                          true,
                                                      addVerticalDivider: false,
                                                    );
                                                  },
                                                ),
                                              );
                                            } else {
                                              return Padding(
                                                padding: EdgeInsetsDirectional
                                                    .fromSTEB(
                                                        22.0, 16.0, 0.0, 0.0),
                                                child: Builder(
                                                  builder: (context) {
                                                    final clients =
                                                        containerPaymentviewRowList
                                                            .map((e) => e)
                                                            .toList();
                                                    if (clients.isEmpty) {
                                                      return EmptyTablePlaceholderWidget(
                                                        placeholderText:
                                                            'Нет клиентов по заданным параметрам',
                                                      );
                                                    }

                                                    return FlutterFlowDataTable<
                                                        PaymentviewRow>(
                                                      controller: _model
                                                          .paginatedDataTableController2,
                                                      data: clients,
                                                      numRows:
                                                          valueOrDefault<int>(
                                                        clients.length,
                                                        10,
                                                      ),
                                                      columnsBuilder:
                                                          (onSortChanged) => [
                                                        DataColumn2(
                                                          label:
                                                              DefaultTextStyle
                                                                  .merge(
                                                            softWrap: true,
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
                                                                  'qf21xtix' /* Дата */,
                                                                ),
                                                                style: FlutterFlowTheme.of(
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
                                                          label:
                                                              DefaultTextStyle
                                                                  .merge(
                                                            softWrap: true,
                                                            child: Text(
                                                              FFLocalizations.of(
                                                                      context)
                                                                  .getText(
                                                                'sxkpl8e0' /* Сумма, ₽ */,
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
                                                          fixedWidth: 160.0,
                                                          onSort: onSortChanged,
                                                        ),
                                                        DataColumn2(
                                                          label:
                                                              DefaultTextStyle
                                                                  .merge(
                                                            softWrap: true,
                                                            child: Visibility(
                                                              visible:
                                                                  responsiveVisibility(
                                                                context:
                                                                    context,
                                                                phone: false,
                                                              ),
                                                              child: Align(
                                                                alignment:
                                                                    AlignmentDirectional(
                                                                        -1.0,
                                                                        0.0),
                                                                child: Text(
                                                                  FFLocalizations.of(
                                                                          context)
                                                                      .getText(
                                                                    'lwpst89y' /* Клиент */,
                                                                  ),
                                                                  textAlign:
                                                                      TextAlign
                                                                          .center,
                                                                  style: FlutterFlowTheme.of(
                                                                          context)
                                                                      .bodySmall
                                                                      .override(
                                                                        fontFamily:
                                                                            'Montserrat',
                                                                        color: FlutterFlowTheme.of(context)
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
                                                          label:
                                                              DefaultTextStyle
                                                                  .merge(
                                                            softWrap: true,
                                                            child: Visibility(
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
                                                                  'wlklrqbl' /* Ячейка */,
                                                                ),
                                                                style: FlutterFlowTheme.of(
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
                                                          label:
                                                              DefaultTextStyle
                                                                  .merge(
                                                            softWrap: true,
                                                            child: Align(
                                                              alignment:
                                                                  AlignmentDirectional(
                                                                      1.0, 0.0),
                                                              child: Text(
                                                                FFLocalizations.of(
                                                                        context)
                                                                    .getText(
                                                                  'q3oen6p3' /* Р-р */,
                                                                ),
                                                                textAlign:
                                                                    TextAlign
                                                                        .start,
                                                                style: FlutterFlowTheme.of(
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
                                                          label:
                                                              DefaultTextStyle
                                                                  .merge(
                                                            softWrap: true,
                                                            child: Text(
                                                              FFLocalizations.of(
                                                                      context)
                                                                  .getText(
                                                                'qh8laf9d' /* Аренда до */,
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
                                                          fixedWidth: 100.0,
                                                        ),
                                                        DataColumn2(
                                                          label:
                                                              DefaultTextStyle
                                                                  .merge(
                                                            softWrap: true,
                                                            child: Text(
                                                              FFLocalizations.of(
                                                                      context)
                                                                  .getText(
                                                                '9rprenee' /* Дней */,
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
                                                      dataRowBuilder: (clientsItem,
                                                              clientsIndex,
                                                              selected,
                                                              onSelectChanged) =>
                                                          DataRow(
                                                        color:
                                                            WidgetStateProperty
                                                                .all(
                                                          clientsIndex % 2 == 0
                                                              ? FlutterFlowTheme
                                                                      .of(
                                                                          context)
                                                                  .secondaryBackground
                                                              : FlutterFlowTheme
                                                                      .of(context)
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
                                                              valueOrDefault<
                                                                  String>(
                                                                dateTimeFormat(
                                                                  "dd.MM.yy",
                                                                  clientsItem
                                                                      .createdAt,
                                                                  locale: FFLocalizations.of(
                                                                          context)
                                                                      .languageCode,
                                                                ),
                                                                'нет',
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
                                                          Text(
                                                            valueOrDefault<
                                                                String>(
                                                              clientsItem.amount
                                                                  ?.toString(),
                                                              '0',
                                                            ),
                                                            style: FlutterFlowTheme
                                                                    .of(context)
                                                                .bodyMedium
                                                                .override(
                                                                  fontFamily:
                                                                      'Montserrat',
                                                                  color: FlutterFlowTheme.of(
                                                                          context)
                                                                      .success,
                                                                  fontSize:
                                                                      13.0,
                                                                  letterSpacing:
                                                                      0.0,
                                                                  fontWeight:
                                                                      FontWeight
                                                                          .w600,
                                                                ),
                                                          ),
                                                          Padding(
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
                                                                      clientsItem
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
                                                                      'b2y2n6lw' /* 
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
                                                                      clientsItem
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
                                                                      'f0rz3qsg' /* 
 */
                                                                      ,
                                                                    ),
                                                                    style:
                                                                        TextStyle(),
                                                                  ),
                                                                  TextSpan(
                                                                    text: valueOrDefault<
                                                                        String>(
                                                                      clientsItem
                                                                          .clientEmail,
                                                                      'email',
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
                                                          Visibility(
                                                            visible:
                                                                responsiveVisibility(
                                                              context: context,
                                                              phone: false,
                                                            ),
                                                            child: Text(
                                                              valueOrDefault<
                                                                  String>(
                                                                clientsItem
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
                                                          Align(
                                                            alignment:
                                                                AlignmentDirectional(
                                                                    1.0, 0.0),
                                                            child: Padding(
                                                              padding:
                                                                  EdgeInsetsDirectional
                                                                      .fromSTEB(
                                                                          0.0,
                                                                          0.0,
                                                                          24.0,
                                                                          0.0),
                                                              child: Text(
                                                                valueOrDefault<
                                                                    String>(
                                                                  clientsItem
                                                                      .cellSize,
                                                                  '-',
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
                                                            valueOrDefault<
                                                                String>(
                                                              dateTimeFormat(
                                                                "dd.MM.yy",
                                                                clientsItem
                                                                    .paidUntil,
                                                                locale: FFLocalizations.of(
                                                                        context)
                                                                    .languageCode,
                                                              ),
                                                              'dd.MM.yy',
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
                                                          Text(
                                                            valueOrDefault<
                                                                String>(
                                                              clientsItem
                                                                  .rentalDays
                                                                  .toString(),
                                                              '30',
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
                                                        ]
                                                            .map((c) =>
                                                                DataCell(c))
                                                            .toList(),
                                                      ),
                                                      emptyBuilder: () =>
                                                          EmptyTablePlaceholderWidget(
                                                        placeholderText:
                                                            'Нет клиентов по заданным параметрам',
                                                      ),
                                                      paginated: true,
                                                      selectable: false,
                                                      hidePaginator: true,
                                                      showFirstLastButtons:
                                                          true,
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
                                                            Radius.circular(
                                                                0.0),
                                                        bottomRight:
                                                            Radius.circular(
                                                                0.0),
                                                        topLeft:
                                                            Radius.circular(
                                                                16.0),
                                                        topRight:
                                                            Radius.circular(
                                                                16.0),
                                                      ),
                                                      addHorizontalDivider:
                                                          false,
                                                      addTopAndBottomDivider:
                                                          false,
                                                      hideDefaultHorizontalDivider:
                                                          true,
                                                      addVerticalDivider: false,
                                                    );
                                                  },
                                                ),
                                              );
                                            }
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
