import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/components/breadcrumps_widget.dart';
import '/components/empty_table_placeholder_widget.dart';
import '/components/open_drawler_button_widget.dart';
import '/components/promo_generator_widget.dart';
import '/components/promocode_row_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/skeleton_multi_line_list_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import 'promocodes_model.dart';
export 'promocodes_model.dart';

class PromocodesWidget extends StatefulWidget {
  const PromocodesWidget({super.key});

  static String routeName = 'promocodes';
  static String routePath = '/promocodes';

  @override
  State<PromocodesWidget> createState() => _PromocodesWidgetState();
}

class _PromocodesWidgetState extends State<PromocodesWidget> {
  late PromocodesModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => PromocodesModel());

    // On page load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      FFAppState().currentPage = Pages.locs;
      safeSetState(() {});
    });

    _model.textController1 ??= TextEditingController();
    _model.textFieldFocusNode1 ??= FocusNode();

    _model.textController2 ??= TextEditingController();
    _model.textFieldFocusNode2 ??= FocusNode();

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
        title: 'promocodes',
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
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Align(
                        alignment: AlignmentDirectional(-1.0, 0.0),
                        child: Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              24.0, 0.0, 0.0, 0.0),
                          child: wrapWithModel(
                            model: _model.tittleWithIconAndSubtittleModel2,
                            updateCallback: () => safeSetState(() {}),
                            updateOnChange: true,
                            child: TittleWithIconAndSubtittleWidget(
                              tittle: 'Создать промокод',
                              subtittle: 'Прмокоды создатся в рамках франшизы',
                              hasIcon: false,
                              hasSubtittle: true,
                            ),
                          ),
                        ),
                      ),
                      Align(
                        alignment: AlignmentDirectional(-1.0, 0.0),
                        child: Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              24.0, 36.0, 24.0, 0.0),
                          child: Text(
                            FFLocalizations.of(context).getText(
                              '3dgbxyfz' /* Укажите, если нужно, чтобы отр... */,
                            ),
                            style: FlutterFlowTheme.of(context)
                                .labelMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  letterSpacing: 0.0,
                                ),
                          ),
                        ),
                      ),
                      Padding(
                        padding: EdgeInsetsDirectional.fromSTEB(
                            24.0, 8.0, 24.0, 24.0),
                        child: TextFormField(
                          controller: _model.textController2,
                          focusNode: _model.textFieldFocusNode2,
                          autofocus: true,
                          autofillHints: [AutofillHints.email],
                          obscureText: false,
                          decoration: InputDecoration(
                            isDense: true,
                            labelText: FFLocalizations.of(context).getText(
                              'c8yvbuv9' /* Email пользователя */,
                            ),
                            labelStyle: FlutterFlowTheme.of(context)
                                .labelMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.w600,
                                ),
                            enabledBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context)
                                    .primaryBackground,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context).grayAlpha,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            errorBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context).error,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            focusedErrorBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context).error,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            filled: true,
                            fillColor:
                                FlutterFlowTheme.of(context).primaryBackground,
                          ),
                          style:
                              FlutterFlowTheme.of(context).bodyMedium.override(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.w600,
                                  ),
                          keyboardType: TextInputType.emailAddress,
                          validator: _model.textController2Validator
                              .asValidator(context),
                        ),
                      ),
                      Padding(
                        padding: EdgeInsetsDirectional.fromSTEB(
                            16.0, 0.0, 16.0, 0.0),
                        child: wrapWithModel(
                          model: _model.promoGeneratorModel,
                          updateCallback: () => safeSetState(() {}),
                          child: PromoGeneratorWidget(
                            radii: 16,
                            personalEmail: _model.textController2.text,
                          ),
                        ),
                      ),
                    ],
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
                                                        _model.textController1,
                                                    focusNode: _model
                                                        .textFieldFocusNode1,
                                                    autofocus: true,
                                                    autofillHints: [
                                                      AutofillHints.email
                                                    ],
                                                    obscureText: false,
                                                    decoration: InputDecoration(
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
                                                        '1zijzeuq' /* Поиск */,
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
                                                        borderSide: BorderSide(
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .primaryBackground,
                                                          width: 2.0,
                                                        ),
                                                        borderRadius:
                                                            BorderRadius
                                                                .circular(16.0),
                                                      ),
                                                      focusedBorder:
                                                          OutlineInputBorder(
                                                        borderSide: BorderSide(
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .grayAlpha,
                                                          width: 2.0,
                                                        ),
                                                        borderRadius:
                                                            BorderRadius
                                                                .circular(16.0),
                                                      ),
                                                      errorBorder:
                                                          OutlineInputBorder(
                                                        borderSide: BorderSide(
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .error,
                                                          width: 2.0,
                                                        ),
                                                        borderRadius:
                                                            BorderRadius
                                                                .circular(16.0),
                                                      ),
                                                      focusedErrorBorder:
                                                          OutlineInputBorder(
                                                        borderSide: BorderSide(
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .error,
                                                          width: 2.0,
                                                        ),
                                                        borderRadius:
                                                            BorderRadius
                                                                .circular(16.0),
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
                                                    style: FlutterFlowTheme.of(
                                                            context)
                                                        .bodyMedium
                                                        .override(
                                                          fontFamily:
                                                              'Montserrat',
                                                          letterSpacing: 0.0,
                                                          fontWeight:
                                                              FontWeight.w600,
                                                        ),
                                                    keyboardType: TextInputType
                                                        .emailAddress,
                                                    validator: _model
                                                        .textController1Validator
                                                        .asValidator(context),
                                                  ),
                                                ),
                                            ].divide(SizedBox(width: 16.0)),
                                          ),
                                          InkWell(
                                            splashColor: Colors.transparent,
                                            focusColor: Colors.transparent,
                                            hoverColor: Colors.transparent,
                                            highlightColor: Colors.transparent,
                                            onTap: () async {
                                              scaffoldKey.currentState!
                                                  .openEndDrawer();
                                            },
                                            child: wrapWithModel(
                                              model:
                                                  _model.openDrawlerButtonModel,
                                              updateCallback: () =>
                                                  safeSetState(() {}),
                                              child: OpenDrawlerButtonWidget(
                                                buttonTittle: 'Промокод',
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
                                                    .tittleWithIconAndSubtittleModel1,
                                                updateCallback: () =>
                                                    safeSetState(() {}),
                                                child:
                                                    TittleWithIconAndSubtittleWidget(
                                                  tittle:
                                                      valueOrDefault<String>(
                                                    FFLocalizations.of(context)
                                                        .getVariableText(
                                                      ruText: 'Промокоды',
                                                      enText: 'Promocodes',
                                                    ),
                                                    'Промокоды',
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
                                          mainAxisSize: MainAxisSize.min,
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            Padding(
                                              padding: EdgeInsetsDirectional
                                                  .fromSTEB(
                                                      16.0, 0.0, 0.0, 0.0),
                                              child: Container(
                                                width: 160.0,
                                                decoration: BoxDecoration(),
                                                child: Text(
                                                  FFLocalizations.of(context)
                                                      .getText(
                                                    '47wy3am3' /* Промокод */,
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
                                                  'vxq6cmwl' /* Скидка */,
                                                ),
                                                textAlign: TextAlign.end,
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
                                              width: 100.0,
                                              decoration: BoxDecoration(),
                                              child: Visibility(
                                                visible: responsiveVisibility(
                                                  context: context,
                                                  phone: false,
                                                ),
                                                child: Text(
                                                  FFLocalizations.of(context)
                                                      .getText(
                                                    'gfx2047a' /* Применен */,
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
                                            if (responsiveVisibility(
                                              context: context,
                                              phone: false,
                                              tablet: false,
                                            ))
                                              Container(
                                                width: 96.0,
                                                decoration: BoxDecoration(),
                                                child: Visibility(
                                                  visible: responsiveVisibility(
                                                    context: context,
                                                    phone: false,
                                                    tablet: false,
                                                  ),
                                                  child: Text(
                                                    FFLocalizations.of(context)
                                                        .getText(
                                                      'br05zvwm' /* Годен до */,
                                                    ),
                                                    textAlign: TextAlign.end,
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
                                            if (responsiveVisibility(
                                              context: context,
                                              phone: false,
                                              tablet: false,
                                              tabletLandscape: false,
                                            ))
                                              Flexible(
                                                child: Container(
                                                  width: 36.0,
                                                  constraints: BoxConstraints(
                                                    minWidth: 106.0,
                                                  ),
                                                  decoration: BoxDecoration(),
                                                  child: Text(
                                                    FFLocalizations.of(context)
                                                        .getText(
                                                      'yfbu6133' /* Фр */,
                                                    ),
                                                    textAlign: TextAlign.center,
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
                                            if (responsiveVisibility(
                                              context: context,
                                              phone: false,
                                              tablet: false,
                                              tabletLandscape: false,
                                            ))
                                              Container(
                                                constraints: BoxConstraints(
                                                  minWidth: 106.0,
                                                ),
                                                decoration: BoxDecoration(),
                                                child: Visibility(
                                                  visible: responsiveVisibility(
                                                    context: context,
                                                    phone: false,
                                                    tablet: false,
                                                    tabletLandscape: false,
                                                  ),
                                                  child: Text(
                                                    FFLocalizations.of(context)
                                                        .getText(
                                                      'v5aa0ivb' /* Для платежей, ₽ */,
                                                    ),
                                                    textAlign: TextAlign.end,
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
                                            Flexible(
                                              child: Row(
                                                mainAxisSize: MainAxisSize.min,
                                                mainAxisAlignment:
                                                    MainAxisAlignment.center,
                                                children: [
                                                  Container(
                                                    width: 48.0,
                                                    height: 48.0,
                                                    decoration: BoxDecoration(),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ].divide(SizedBox(width: 12.0)),
                                        ),
                                      ),
                                    ),
                                  ),
                                  Container(
                                    height: 600.0,
                                    decoration: BoxDecoration(),
                                    child: FutureBuilder<List<PromoCodesRow>>(
                                      future: PromoCodesTable().queryRows(
                                        queryFn: (q) => q
                                            .eqOrNull(
                                              'is_valid',
                                              true,
                                            )
                                            .order('created_at'),
                                      ),
                                      builder: (context, snapshot) {
                                        // Customize what your widget looks like when it's loading.
                                        if (!snapshot.hasData) {
                                          return SkeletonMultiLineListWidget(
                                            height: 42.0,
                                            itemsQty: 4,
                                            radii: 16,
                                            spacer: 24,
                                          );
                                        }
                                        List<PromoCodesRow>
                                            listViewPromoCodesRowList =
                                            snapshot.data!;

                                        if (listViewPromoCodesRowList.isEmpty) {
                                          return EmptyTablePlaceholderWidget(
                                            placeholderText:
                                                'Нет действующих промокодов',
                                          );
                                        }

                                        return ListView.separated(
                                          padding: EdgeInsets.zero,
                                          scrollDirection: Axis.vertical,
                                          itemCount:
                                              listViewPromoCodesRowList.length,
                                          separatorBuilder: (_, __) =>
                                              SizedBox(height: 2.0),
                                          itemBuilder:
                                              (context, listViewIndex) {
                                            final listViewPromoCodesRow =
                                                listViewPromoCodesRowList[
                                                    listViewIndex];
                                            return Visibility(
                                              visible: FFAppState()
                                                      .viewAsFranchisor
                                                  ? true
                                                  : (FFAppState().franchisee ==
                                                      listViewPromoCodesRow
                                                          .area),
                                              child: PromocodeRowWidget(
                                                key: Key(
                                                    'Keyl63_${listViewIndex}_of_${listViewPromoCodesRowList.length}'),
                                                promocode: listViewPromoCodesRow
                                                    .promocode,
                                                codeValue: listViewPromoCodesRow
                                                    .discountAmount
                                                    .toDouble(),
                                                isPercent: listViewPromoCodesRow
                                                    .isPercentage,
                                                usageQty: listViewPromoCodesRow
                                                    .usageQty,
                                                usedQty: listViewPromoCodesRow
                                                    .usedQty!,
                                                minAmount: valueOrDefault<int>(
                                                  listViewPromoCodesRow
                                                      .minPriceValue,
                                                  0,
                                                ),
                                                maxAmount: valueOrDefault<int>(
                                                  listViewPromoCodesRow
                                                      .maxPriceValue,
                                                  200,
                                                ),
                                                expirationDate:
                                                    listViewPromoCodesRow
                                                        .validBefore,
                                                area: valueOrDefault<String>(
                                                  listViewPromoCodesRow.area
                                                      .toString(),
                                                  '0',
                                                ),
                                                usermail: listViewPromoCodesRow
                                                    .userMail,
                                              ),
                                            );
                                          },
                                        );
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
                ],
              ),
            ),
          ),
        ));
  }
}
