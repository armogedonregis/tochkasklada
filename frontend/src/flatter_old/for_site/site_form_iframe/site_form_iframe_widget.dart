import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/components/request_sended_match_client_widget.dart';
import '/components/request_sended_match_widget.dart';
import '/components/request_sended_widget.dart';
import '/components/skeleton_multi_line_widget.dart';
import '/components/skeleton_widget.dart';
import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_choice_chips.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/flutter_flow/form_field_controller.dart';
import 'dart:async';
import '/custom_code/widgets/index.dart' as custom_widgets;
import '/flutter_flow/random_data_util.dart' as random_data;
import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'site_form_iframe_model.dart';
export 'site_form_iframe_model.dart';

class SiteFormIframeWidget extends StatefulWidget {
  const SiteFormIframeWidget({
    super.key,
    String? location,
    String? size,
  })  : this.location = location ?? 'KUD',
        this.size = size ?? 'XS';

  final String location;
  final String size;

  static String routeName = 'siteFormIframe';
  static String routePath = '/siteFormIframe';

  @override
  State<SiteFormIframeWidget> createState() => _SiteFormIframeWidgetState();
}

class _SiteFormIframeWidgetState extends State<SiteFormIframeWidget>
    with TickerProviderStateMixin {
  late SiteFormIframeModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();
  var hasRichTextTriggered2 = false;
  final animationsMap = <String, AnimationInfo>{};

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => SiteFormIframeModel());

    // On page load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.locSize = 'KUD_XS';
      safeSetState(() {});
      await Future.delayed(const Duration(milliseconds: 2000));
      _model.isSimmering = false;
      safeSetState(() {});
    });

    _model.clientNameTextController ??= TextEditingController();
    _model.clientNameFocusNode ??= FocusNode();

    _model.emailAddressTextController ??= TextEditingController();
    _model.emailAddressFocusNode ??= FocusNode();

    _model.phoneTextController ??= TextEditingController();
    _model.phoneFocusNode ??= FocusNode();

    animationsMap.addAll({
      'columnOnPageLoadAnimation1': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          VisibilityEffect(duration: 30.ms),
          BlurEffect(
            curve: Curves.easeInOut,
            delay: 30.0.ms,
            duration: 980.0.ms,
            begin: Offset(5.0, 4.0),
            end: Offset(0.0, 0.0),
          ),
          FadeEffect(
            curve: Curves.easeInOut,
            delay: 410.0.ms,
            duration: 860.0.ms,
            begin: 0.0,
            end: 1.0,
          ),
        ],
      ),
      'richTextOnPageLoadAnimation1': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        applyInitialState: true,
        effectsBuilder: () => [
          ShimmerEffect(
            curve: Curves.easeInOut,
            delay: 0.0.ms,
            duration: 600.0.ms,
            color: Color(0x80FFFFFF),
            angle: 0.524,
          ),
          BlurEffect(
            curve: Curves.easeInOut,
            delay: 400.0.ms,
            duration: 400.0.ms,
            begin: Offset(3.0, 3.0),
            end: Offset(0.0, 0.0),
          ),
        ],
      ),
      'richTextOnActionTriggerAnimation1': AnimationInfo(
        trigger: AnimationTrigger.onActionTrigger,
        applyInitialState: true,
        effectsBuilder: () => [
          ShimmerEffect(
            curve: Curves.easeInOut,
            delay: 0.0.ms,
            duration: 600.0.ms,
            color: Color(0x80FFFFFF),
            angle: 0.524,
          ),
          BlurEffect(
            curve: Curves.easeInOut,
            delay: 30.0.ms,
            duration: 400.0.ms,
            begin: Offset(3.0, 0.0),
            end: Offset(0.0, 0.0),
          ),
          FadeEffect(
            curve: Curves.easeInOut,
            delay: 30.0.ms,
            duration: 410.0.ms,
            begin: 0.0,
            end: 1.0,
          ),
        ],
      ),
      'columnOnPageLoadAnimation2': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.easeInOut,
            delay: 710.0.ms,
            duration: 600.0.ms,
            begin: 0.0,
            end: 1.0,
          ),
        ],
      ),
      'containerOnPageLoadAnimation1': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.easeInOut,
            delay: 370.0.ms,
            duration: 600.0.ms,
            begin: 0.0,
            end: 1.0,
          ),
        ],
      ),
      'containerOnPageLoadAnimation2': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.easeInOut,
            delay: 330.0.ms,
            duration: 600.0.ms,
            begin: 0.0,
            end: 1.0,
          ),
        ],
      ),
      'rowOnActionTriggerAnimation': AnimationInfo(
        trigger: AnimationTrigger.onActionTrigger,
        applyInitialState: true,
        effectsBuilder: () => [
          ShimmerEffect(
            curve: Curves.easeInOut,
            delay: 0.0.ms,
            duration: 600.0.ms,
            color: Color(0x80FFFFFF),
            angle: 0.524,
          ),
          BlurEffect(
            curve: Curves.easeInOut,
            delay: 30.0.ms,
            duration: 400.0.ms,
            begin: Offset(3.0, 0.0),
            end: Offset(0.0, 0.0),
          ),
          FadeEffect(
            curve: Curves.easeInOut,
            delay: 30.0.ms,
            duration: 410.0.ms,
            begin: 0.0,
            end: 1.0,
          ),
        ],
      ),
      'choiceChipsOnPageLoadAnimation': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.easeInOut,
            delay: 360.0.ms,
            duration: 600.0.ms,
            begin: 0.0,
            end: 1.0,
          ),
        ],
      ),
      'richTextOnActionTriggerAnimation2': AnimationInfo(
        trigger: AnimationTrigger.onActionTrigger,
        applyInitialState: false,
        effectsBuilder: () => [
          ShimmerEffect(
            curve: Curves.easeInOut,
            delay: 0.0.ms,
            duration: 600.0.ms,
            color: Color(0x80FFFFFF),
            angle: 0.524,
          ),
          BlurEffect(
            curve: Curves.easeInOut,
            delay: 30.0.ms,
            duration: 400.0.ms,
            begin: Offset(3.0, 3.0),
            end: Offset(0.0, 0.0),
          ),
        ],
      ),
      'richTextOnPageLoadAnimation2': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        applyInitialState: true,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.easeInOut,
            delay: 620.0.ms,
            duration: 600.0.ms,
            begin: 0.0,
            end: 1.0,
          ),
        ],
      ),
      'richTextOnActionTriggerAnimation3': AnimationInfo(
        trigger: AnimationTrigger.onActionTrigger,
        applyInitialState: true,
        effectsBuilder: () => [
          ShimmerEffect(
            curve: Curves.easeInOut,
            delay: 350.0.ms,
            duration: 840.0.ms,
            color: Color(0x80FFFFFF),
            angle: 0.524,
          ),
          FadeEffect(
            curve: Curves.easeInOut,
            delay: 160.0.ms,
            duration: 600.0.ms,
            begin: 0.0,
            end: 1.0,
          ),
        ],
      ),
      'imageOnPageLoadAnimation': AnimationInfo(
        loop: true,
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          SaturateEffect(
            curve: Curves.easeInOut,
            delay: 410.0.ms,
            duration: 1720.0.ms,
            begin: 0.0,
            end: 1.0,
          ),
          ShimmerEffect(
            curve: Curves.easeInOut,
            delay: 410.0.ms,
            duration: 1720.0.ms,
            color: Color(0x80FFFFFF),
            angle: 0.524,
          ),
        ],
      ),
    });
    setupAnimations(
      animationsMap.values.where((anim) =>
          anim.trigger == AnimationTrigger.onActionTrigger ||
          !anim.applyInitialState),
      this,
    );

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
        title: 'siteFormIframe',
        color: FlutterFlowTheme.of(context).primary.withAlpha(0XFF),
        child: GestureDetector(
          onTap: () {
            FocusScope.of(context).unfocus();
            FocusManager.instance.primaryFocus?.unfocus();
          },
          child: Scaffold(
            key: scaffoldKey,
            backgroundColor: FlutterFlowTheme.of(context).secondaryBackground,
            body: Row(
              mainAxisSize: MainAxisSize.max,
              children: [
                Expanded(
                  flex: 8,
                  child: Container(
                    width: 400.0,
                    height: double.infinity,
                    constraints: BoxConstraints(
                      maxWidth: 600.0,
                    ),
                    decoration: BoxDecoration(
                      color: FlutterFlowTheme.of(context).secondaryBackground,
                    ),
                    alignment: AlignmentDirectional(0.0, 0.0),
                    child: Align(
                      alignment: AlignmentDirectional(0.0, 0.0),
                      child: Builder(
                        builder: (context) {
                          if (!_model.isSimmering) {
                            return Container(
                              constraints: BoxConstraints(
                                minWidth: 370.0,
                                maxWidth: 460.0,
                              ),
                              decoration: BoxDecoration(),
                              child: Padding(
                                padding: EdgeInsets.all(32.0),
                                child: SingleChildScrollView(
                                  child: Column(
                                    mainAxisSize: MainAxisSize.min,
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.center,
                                    children: [
                                      Align(
                                        alignment:
                                            AlignmentDirectional(-1.0, 0.0),
                                        child: Padding(
                                          padding:
                                              EdgeInsetsDirectional.fromSTEB(
                                                  16.0, 0.0, 0.0, 0.0),
                                          child: RichText(
                                            textScaler: MediaQuery.of(context)
                                                .textScaler,
                                            text: TextSpan(
                                              children: [
                                                TextSpan(
                                                  text: FFLocalizations.of(
                                                          context)
                                                      .getText(
                                                    '6dbee9ng' /* Бронировать */,
                                                  ),
                                                  style: FlutterFlowTheme.of(
                                                          context)
                                                      .displaySmall
                                                      .override(
                                                        fontFamily: 'Tochka',
                                                        color:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .primary,
                                                        fontSize: 23.0,
                                                        letterSpacing: 0.0,
                                                        useGoogleFonts: false,
                                                      ),
                                                ),
                                                TextSpan(
                                                  text: FFLocalizations.of(
                                                          context)
                                                      .getText(
                                                    'n8o8veq7' /*   */,
                                                  ),
                                                  style: TextStyle(
                                                    fontSize: 20.0,
                                                  ),
                                                ),
                                                TextSpan(
                                                  text: valueOrDefault<String>(
                                                    _model.sizeParameters,
                                                    'ячейку',
                                                  ),
                                                  style: TextStyle(
                                                    fontSize: 23.0,
                                                  ),
                                                )
                                              ],
                                              style:
                                                  FlutterFlowTheme.of(context)
                                                      .displaySmall
                                                      .override(
                                                        fontFamily: 'Tochka',
                                                        fontSize: 28.0,
                                                        letterSpacing: 0.0,
                                                        useGoogleFonts: false,
                                                      ),
                                            ),
                                          )
                                              .animateOnPageLoad(animationsMap[
                                                  'richTextOnPageLoadAnimation1']!)
                                              .animateOnActionTrigger(
                                                animationsMap[
                                                    'richTextOnActionTriggerAnimation1']!,
                                              ),
                                        ),
                                      ),
                                      Container(
                                        width: 370.0,
                                        child: Form(
                                          key: _model.formKey,
                                          autovalidateMode:
                                              AutovalidateMode.disabled,
                                          child: Column(
                                            mainAxisSize: MainAxisSize.max,
                                            children: [
                                              Align(
                                                alignment: AlignmentDirectional(
                                                    0.0, -1.0),
                                                child: Padding(
                                                  padding: EdgeInsetsDirectional
                                                      .fromSTEB(
                                                          0.0, 16.0, 0.0, 0.0),
                                                  child: Container(
                                                    width: 400.0,
                                                    height: 133.0,
                                                    constraints: BoxConstraints(
                                                      maxHeight: 130.0,
                                                    ),
                                                    decoration: BoxDecoration(
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                              4.0),
                                                    ),
                                                    child: Align(
                                                      alignment:
                                                          AlignmentDirectional(
                                                              -1.0, -1.0),
                                                      child: Padding(
                                                        padding:
                                                            EdgeInsetsDirectional
                                                                .fromSTEB(
                                                                    0.0,
                                                                    8.0,
                                                                    0.0,
                                                                    0.0),
                                                        child: Column(
                                                          mainAxisSize:
                                                              MainAxisSize.min,
                                                          crossAxisAlignment:
                                                              CrossAxisAlignment
                                                                  .center,
                                                          children: [
                                                            Align(
                                                              alignment:
                                                                  AlignmentDirectional(
                                                                      -1.0,
                                                                      -1.0),
                                                              child: ClipRRect(
                                                                child:
                                                                    Container(
                                                                  width: 370.0,
                                                                  height: 38.0,
                                                                  decoration:
                                                                      BoxDecoration(),
                                                                  alignment:
                                                                      AlignmentDirectional(
                                                                          -1.0,
                                                                          -1.0),
                                                                  child: Align(
                                                                    alignment:
                                                                        AlignmentDirectional(
                                                                            -1.0,
                                                                            -1.0),
                                                                    child: FutureBuilder<
                                                                        List<
                                                                            LocGeoRow>>(
                                                                      future: LocGeoTable()
                                                                          .queryRows(
                                                                        queryFn:
                                                                            (q) =>
                                                                                q.order('loc_id'),
                                                                      ),
                                                                      builder:
                                                                          (context,
                                                                              snapshot) {
                                                                        // Customize what your widget looks like when it's loading.
                                                                        if (!snapshot
                                                                            .hasData) {
                                                                          return SkeletonMultiLineWidget(
                                                                            height:
                                                                                40.0,
                                                                            itemsQty:
                                                                                3,
                                                                            radii:
                                                                                4,
                                                                            spacer:
                                                                                64,
                                                                          );
                                                                        }
                                                                        List<LocGeoRow>
                                                                            choiceChipsLocLocGeoRowList =
                                                                            snapshot.data!;

                                                                        return FlutterFlowChoiceChips(
                                                                          options: choiceChipsLocLocGeoRowList
                                                                              .map((e) => e.ruName)
                                                                              .toList()
                                                                              .map((label) => ChipData(label))
                                                                              .toList(),
                                                                          onChanged:
                                                                              (val) async {
                                                                            safeSetState(() =>
                                                                                _model.choiceChipsLocValue = val?.firstOrNull);
                                                                            _model.selectedLoc =
                                                                                await LocGeoTable().queryRows(
                                                                              queryFn: (q) => q.eqOrNull(
                                                                                'ru_name',
                                                                                _model.choiceChipsLocValue,
                                                                              ),
                                                                            );
                                                                            _model.locAdress =
                                                                                _model.selectedLoc?.sortedList(keyOf: (e) => e.siteAdress!, desc: false).firstOrNull?.siteAdress;
                                                                            _model.locID =
                                                                                valueOrDefault<String>(
                                                                              _model.selectedLoc?.sortedList(keyOf: (e) => e.locId, desc: false).firstOrNull?.locId,
                                                                              '--',
                                                                            );
                                                                            _model.locSize =
                                                                                '${_model.locID}_${_model.choiceChipsSizeValue}';
                                                                            safeSetState(() {});
                                                                            if (animationsMap['rowOnActionTriggerAnimation'] !=
                                                                                null) {
                                                                              await animationsMap['rowOnActionTriggerAnimation']!.controller.forward(from: 0.0);
                                                                            }

                                                                            safeSetState(() {});
                                                                          },
                                                                          selectedChipStyle:
                                                                              ChipStyle(
                                                                            backgroundColor:
                                                                                FlutterFlowTheme.of(context).primary,
                                                                            textStyle: FlutterFlowTheme.of(context).titleLarge.override(
                                                                                  fontFamily: 'Tochka',
                                                                                  color: FlutterFlowTheme.of(context).info,
                                                                                  fontSize: 16.0,
                                                                                  letterSpacing: 0.0,
                                                                                  fontWeight: FontWeight.w600,
                                                                                  useGoogleFonts: false,
                                                                                ),
                                                                            iconColor:
                                                                                FlutterFlowTheme.of(context).info,
                                                                            iconSize:
                                                                                18.0,
                                                                            labelPadding: EdgeInsetsDirectional.fromSTEB(
                                                                                4.0,
                                                                                4.0,
                                                                                6.0,
                                                                                4.0),
                                                                            elevation:
                                                                                4.0,
                                                                            borderRadius:
                                                                                BorderRadius.only(
                                                                              bottomLeft: Radius.circular(0.0),
                                                                              bottomRight: Radius.circular(0.0),
                                                                              topLeft: Radius.circular(4.0),
                                                                              topRight: Radius.circular(4.0),
                                                                            ),
                                                                          ),
                                                                          unselectedChipStyle:
                                                                              ChipStyle(
                                                                            backgroundColor:
                                                                                FlutterFlowTheme.of(context).secondaryBackground,
                                                                            textStyle: FlutterFlowTheme.of(context).titleLarge.override(
                                                                                  fontFamily: 'Tochka',
                                                                                  color: FlutterFlowTheme.of(context).secondaryText,
                                                                                  fontSize: 16.0,
                                                                                  letterSpacing: 0.0,
                                                                                  fontWeight: FontWeight.w600,
                                                                                  useGoogleFonts: false,
                                                                                ),
                                                                            iconColor:
                                                                                FlutterFlowTheme.of(context).tertiaryText,
                                                                            iconSize:
                                                                                18.0,
                                                                            labelPadding: EdgeInsetsDirectional.fromSTEB(
                                                                                6.0,
                                                                                4.0,
                                                                                6.0,
                                                                                4.0),
                                                                            elevation:
                                                                                0.0,
                                                                            borderColor:
                                                                                FlutterFlowTheme.of(context).alternate,
                                                                            borderRadius:
                                                                                BorderRadius.circular(4.0),
                                                                          ),
                                                                          chipSpacing:
                                                                              4.0,
                                                                          rowSpacing:
                                                                              4.0,
                                                                          multiselect:
                                                                              false,
                                                                          initialized:
                                                                              _model.choiceChipsLocValue != null,
                                                                          alignment:
                                                                              WrapAlignment.center,
                                                                          controller: _model.choiceChipsLocValueController ??=
                                                                              FormFieldController<List<String>>(
                                                                            [
                                                                              valueOrDefault<String>(
                                                                                choiceChipsLocLocGeoRowList.unique((e) => widget.location).firstOrNull?.ruName,
                                                                                'Кудрово',
                                                                              )
                                                                            ],
                                                                          ),
                                                                          wrapped:
                                                                              false,
                                                                        );
                                                                      },
                                                                    ),
                                                                  ),
                                                                ),
                                                              ).animateOnPageLoad(
                                                                  animationsMap[
                                                                      'containerOnPageLoadAnimation1']!),
                                                            ),
                                                            Align(
                                                              alignment:
                                                                  AlignmentDirectional(
                                                                      0.0, 0.0),
                                                              child:
                                                                  AnimatedContainer(
                                                                duration: Duration(
                                                                    milliseconds:
                                                                        180),
                                                                curve: Curves
                                                                    .easeInOut,
                                                                width: 370.0,
                                                                decoration:
                                                                    BoxDecoration(
                                                                  color: FlutterFlowTheme.of(
                                                                          context)
                                                                      .secondaryBackground,
                                                                  borderRadius:
                                                                      BorderRadius
                                                                          .only(
                                                                    bottomLeft:
                                                                        Radius.circular(
                                                                            2.0),
                                                                    bottomRight:
                                                                        Radius.circular(
                                                                            2.0),
                                                                    topLeft: Radius
                                                                        .circular(
                                                                            0.0),
                                                                    topRight: Radius
                                                                        .circular(
                                                                            0.0),
                                                                  ),
                                                                  border: Border
                                                                      .all(
                                                                    color: FlutterFlowTheme.of(
                                                                            context)
                                                                        .alternate,
                                                                  ),
                                                                ),
                                                                child: Align(
                                                                  alignment:
                                                                      AlignmentDirectional(
                                                                          0.0,
                                                                          0.0),
                                                                  child:
                                                                      Padding(
                                                                    padding: EdgeInsetsDirectional
                                                                        .fromSTEB(
                                                                            8.0,
                                                                            24.0,
                                                                            8.0,
                                                                            24.0),
                                                                    child: Row(
                                                                      mainAxisSize:
                                                                          MainAxisSize
                                                                              .max,
                                                                      mainAxisAlignment:
                                                                          MainAxisAlignment
                                                                              .center,
                                                                      children:
                                                                          [
                                                                        Builder(
                                                                          builder:
                                                                              (context) {
                                                                            if (valueOrDefault<bool>(
                                                                              _model.locAdress == null || _model.locAdress == '',
                                                                              true,
                                                                            )) {
                                                                              return Visibility(
                                                                                visible: _model.locAdress == null || _model.locAdress == '',
                                                                                child: Icon(
                                                                                  Icons.warning_rounded,
                                                                                  color: FlutterFlowTheme.of(context).tertiary,
                                                                                  size: 24.0,
                                                                                ),
                                                                              );
                                                                            } else {
                                                                              return Icon(
                                                                                Icons.location_on,
                                                                                color: FlutterFlowTheme.of(context).primary,
                                                                                size: 24.0,
                                                                              );
                                                                            }
                                                                          },
                                                                        ),
                                                                        Container(
                                                                          constraints:
                                                                              BoxConstraints(
                                                                            maxWidth:
                                                                                314.0,
                                                                          ),
                                                                          decoration:
                                                                              BoxDecoration(),
                                                                          child: SelectionArea(
                                                                              child: AutoSizeText(
                                                                            valueOrDefault<String>(
                                                                              _model.locAdress,
                                                                              'Выберите локацию ',
                                                                            ),
                                                                            maxLines:
                                                                                3,
                                                                            minFontSize:
                                                                                12.0,
                                                                            style: FlutterFlowTheme.of(context).bodyMedium.override(
                                                                                  fontFamily: 'Montserrat',
                                                                                  letterSpacing: 0.0,
                                                                                  lineHeight: 0.9,
                                                                                ),
                                                                          )),
                                                                        ),
                                                                      ].divide(SizedBox(
                                                                              width: 8.0)),
                                                                    ).animateOnActionTrigger(
                                                                      animationsMap[
                                                                          'rowOnActionTriggerAnimation']!,
                                                                    ),
                                                                  ),
                                                                ),
                                                              ).animateOnPageLoad(
                                                                      animationsMap[
                                                                          'containerOnPageLoadAnimation2']!),
                                                            ),
                                                          ],
                                                        ),
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                              Align(
                                                alignment: AlignmentDirectional(
                                                    -1.0, 0.0),
                                                child: ClipRRect(
                                                  borderRadius:
                                                      BorderRadius.only(
                                                    bottomLeft:
                                                        Radius.circular(4.0),
                                                    bottomRight:
                                                        Radius.circular(4.0),
                                                    topLeft:
                                                        Radius.circular(0.0),
                                                    topRight:
                                                        Radius.circular(0.0),
                                                  ),
                                                  child: Container(
                                                    width: 374.0,
                                                    decoration: BoxDecoration(
                                                      borderRadius:
                                                          BorderRadius.only(
                                                        bottomLeft:
                                                            Radius.circular(
                                                                4.0),
                                                        bottomRight:
                                                            Radius.circular(
                                                                4.0),
                                                        topLeft:
                                                            Radius.circular(
                                                                0.0),
                                                        topRight:
                                                            Radius.circular(
                                                                0.0),
                                                      ),
                                                    ),
                                                    alignment:
                                                        AlignmentDirectional(
                                                            0.0, 0.0),
                                                    child: Padding(
                                                      padding:
                                                          EdgeInsetsDirectional
                                                              .fromSTEB(
                                                                  0.0,
                                                                  0.0,
                                                                  0.0,
                                                                  8.0),
                                                      child: Column(
                                                        mainAxisSize:
                                                            MainAxisSize.max,
                                                        children: [
                                                          Align(
                                                            alignment:
                                                                AlignmentDirectional(
                                                                    -1.0, -1.0),
                                                            child: Padding(
                                                              padding:
                                                                  EdgeInsetsDirectional
                                                                      .fromSTEB(
                                                                          0.0,
                                                                          0.0,
                                                                          0.0,
                                                                          8.0),
                                                              child: Row(
                                                                mainAxisSize:
                                                                    MainAxisSize
                                                                        .min,
                                                                mainAxisAlignment:
                                                                    MainAxisAlignment
                                                                        .start,
                                                                children: [
                                                                  Align(
                                                                    alignment:
                                                                        AlignmentDirectional(
                                                                            0.0,
                                                                            0.0),
                                                                    child:
                                                                        Padding(
                                                                      padding: EdgeInsetsDirectional.fromSTEB(
                                                                          0.0,
                                                                          8.0,
                                                                          0.0,
                                                                          8.0),
                                                                      child:
                                                                          ClipRRect(
                                                                        borderRadius:
                                                                            BorderRadius.circular(4.0),
                                                                        child:
                                                                            Container(
                                                                          width:
                                                                              190.0,
                                                                          height:
                                                                              44.0,
                                                                          constraints:
                                                                              BoxConstraints(
                                                                            maxWidth:
                                                                                322.0,
                                                                          ),
                                                                          decoration:
                                                                              BoxDecoration(
                                                                            borderRadius:
                                                                                BorderRadius.circular(4.0),
                                                                          ),
                                                                          child:
                                                                              Align(
                                                                            alignment:
                                                                                AlignmentDirectional(0.0, 0.0),
                                                                            child:
                                                                                Padding(
                                                                              padding: EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 16.0, 0.0),
                                                                              child: Column(
                                                                                mainAxisSize: MainAxisSize.max,
                                                                                mainAxisAlignment: MainAxisAlignment.center,
                                                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                                                children: [
                                                                                  Flexible(
                                                                                    child: Align(
                                                                                      alignment: AlignmentDirectional(-1.0, 0.0),
                                                                                      child: FutureBuilder<List<SizesRow>>(
                                                                                        future: SizesTable().queryRows(
                                                                                          queryFn: (q) => q.order('id'),
                                                                                        ),
                                                                                        builder: (context, snapshot) {
                                                                                          // Customize what your widget looks like when it's loading.
                                                                                          if (!snapshot.hasData) {
                                                                                            return SkeletonMultiLineWidget(
                                                                                              height: 40.0,
                                                                                              itemsQty: 3,
                                                                                              radii: 4,
                                                                                              spacer: 64,
                                                                                            );
                                                                                          }
                                                                                          List<SizesRow> choiceChipsSizeSizesRowList = snapshot.data!;

                                                                                          return FlutterFlowChoiceChips(
                                                                                            options: choiceChipsSizeSizesRowList.map((e) => e.id).toList().map((label) => ChipData(label)).toList(),
                                                                                            onChanged: (val) async {
                                                                                              safeSetState(() => _model.choiceChipsSizeValue = val?.firstOrNull);
                                                                                              _model.selectedSize = await SizesTable().queryRows(
                                                                                                queryFn: (q) => q.eqOrNull(
                                                                                                  'id',
                                                                                                  _model.choiceChipsSizeValue,
                                                                                                ),
                                                                                              );
                                                                                              _model.sizeParameters = '${_model.selectedSize?.firstOrNull?.ruName}, ${_model.selectedSize?.firstOrNull?.sqmeters?.toString()} м²';
                                                                                              _model.locSize = '${_model.locID}_${_model.choiceChipsSizeValue}';
                                                                                              safeSetState(() {});
                                                                                              if (animationsMap['richTextOnActionTriggerAnimation1'] != null) {
                                                                                                await animationsMap['richTextOnActionTriggerAnimation1']!.controller.forward(from: 0.0);
                                                                                              }

                                                                                              safeSetState(() {});
                                                                                            },
                                                                                            selectedChipStyle: ChipStyle(
                                                                                              backgroundColor: FlutterFlowTheme.of(context).primary,
                                                                                              textStyle: FlutterFlowTheme.of(context).titleLarge.override(
                                                                                                    fontFamily: 'Tochka',
                                                                                                    color: FlutterFlowTheme.of(context).info,
                                                                                                    fontSize: 16.0,
                                                                                                    letterSpacing: 0.0,
                                                                                                    fontWeight: FontWeight.w600,
                                                                                                    useGoogleFonts: false,
                                                                                                  ),
                                                                                              iconColor: FlutterFlowTheme.of(context).info,
                                                                                              iconSize: 18.0,
                                                                                              labelPadding: EdgeInsetsDirectional.fromSTEB(4.0, 4.0, 6.0, 4.0),
                                                                                              elevation: 4.0,
                                                                                              borderRadius: BorderRadius.circular(4.0),
                                                                                            ),
                                                                                            unselectedChipStyle: ChipStyle(
                                                                                              backgroundColor: FlutterFlowTheme.of(context).secondaryBackground,
                                                                                              textStyle: FlutterFlowTheme.of(context).titleLarge.override(
                                                                                                    fontFamily: 'Tochka',
                                                                                                    color: FlutterFlowTheme.of(context).secondaryText,
                                                                                                    fontSize: 16.0,
                                                                                                    letterSpacing: 0.0,
                                                                                                    fontWeight: FontWeight.w600,
                                                                                                    useGoogleFonts: false,
                                                                                                  ),
                                                                                              iconColor: FlutterFlowTheme.of(context).tertiaryText,
                                                                                              iconSize: 18.0,
                                                                                              labelPadding: EdgeInsetsDirectional.fromSTEB(6.0, 4.0, 6.0, 4.0),
                                                                                              elevation: 0.0,
                                                                                              borderColor: FlutterFlowTheme.of(context).alternate,
                                                                                              borderRadius: BorderRadius.circular(4.0),
                                                                                            ),
                                                                                            chipSpacing: 2.0,
                                                                                            rowSpacing: 4.0,
                                                                                            multiselect: false,
                                                                                            initialized: _model.choiceChipsSizeValue != null,
                                                                                            alignment: WrapAlignment.center,
                                                                                            controller: _model.choiceChipsSizeValueController ??= FormFieldController<List<String>>(
                                                                                              [
                                                                                                valueOrDefault<String>(
                                                                                                  choiceChipsSizeSizesRowList.unique((e) => widget.size).firstOrNull?.id,
                                                                                                  'XS',
                                                                                                )
                                                                                              ],
                                                                                            ),
                                                                                            wrapped: false,
                                                                                          ).animateOnPageLoad(animationsMap['choiceChipsOnPageLoadAnimation']!);
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
                                                                    ),
                                                                  ),
                                                                  Expanded(
                                                                    child:
                                                                        Align(
                                                                      alignment:
                                                                          AlignmentDirectional(
                                                                              -1.0,
                                                                              0.0),
                                                                      child:
                                                                          Column(
                                                                        mainAxisSize:
                                                                            MainAxisSize.min,
                                                                        mainAxisAlignment:
                                                                            MainAxisAlignment.start,
                                                                        crossAxisAlignment:
                                                                            CrossAxisAlignment.end,
                                                                        children: [
                                                                          Align(
                                                                            alignment:
                                                                                AlignmentDirectional(1.0, 0.0),
                                                                            child:
                                                                                Container(
                                                                              width: 190.0,
                                                                              child: Stack(
                                                                                alignment: AlignmentDirectional(-1.0, 0.0),
                                                                                children: [
                                                                                  Align(
                                                                                    alignment: AlignmentDirectional(1.0, 0.0),
                                                                                    child: Container(
                                                                                      width: 180.0,
                                                                                      decoration: BoxDecoration(
                                                                                        color: FlutterFlowTheme.of(context).promo,
                                                                                        borderRadius: BorderRadius.circular(2.0),
                                                                                      ),
                                                                                      child: Padding(
                                                                                        padding: EdgeInsetsDirectional.fromSTEB(0.0, 16.0, 12.0, 16.0),
                                                                                        child: FutureBuilder<List<MinWeeklyPriceViewRow>>(
                                                                                          future: MinWeeklyPriceViewTable().queryRows(
                                                                                            queryFn: (q) => q,
                                                                                          ),
                                                                                          builder: (context, snapshot) {
                                                                                            // Customize what your widget looks like when it's loading.
                                                                                            if (!snapshot.hasData) {
                                                                                              return Center(
                                                                                                child: Container(
                                                                                                  width: 80.0,
                                                                                                  height: 36.0,
                                                                                                  child: SkeletonWidget(),
                                                                                                ),
                                                                                              );
                                                                                            }
                                                                                            List<MinWeeklyPriceViewRow> richTextPriceMinWeeklyPriceViewRowList = snapshot.data!;

                                                                                            return InkWell(
                                                                                              splashColor: Colors.transparent,
                                                                                              focusColor: Colors.transparent,
                                                                                              hoverColor: Colors.transparent,
                                                                                              highlightColor: Colors.transparent,
                                                                                              onTap: () async {
                                                                                                if (_model.pricePeriod == Period.day) {
                                                                                                  _model.pricePeriod = Period.week;
                                                                                                  safeSetState(() {});
                                                                                                } else if (_model.pricePeriod == Period.week) {
                                                                                                  _model.pricePeriod = Period.month;
                                                                                                  safeSetState(() {});
                                                                                                } else {
                                                                                                  _model.pricePeriod = Period.day;
                                                                                                  safeSetState(() {});
                                                                                                }

                                                                                                await Future.wait([
                                                                                                  Future(() async {
                                                                                                    if (animationsMap['richTextOnActionTriggerAnimation2'] != null) {
                                                                                                      safeSetState(() => hasRichTextTriggered2 = true);
                                                                                                      SchedulerBinding.instance.addPostFrameCallback((_) async => animationsMap['richTextOnActionTriggerAnimation2']!.controller.forward(from: 0.0));
                                                                                                    }
                                                                                                  }),
                                                                                                  Future(() async {
                                                                                                    if (animationsMap['richTextOnActionTriggerAnimation3'] != null) {
                                                                                                      animationsMap['richTextOnActionTriggerAnimation3']!.controller.forward(from: 0.0);
                                                                                                    }
                                                                                                  }),
                                                                                                ]);
                                                                                              },
                                                                                              child: RichText(
                                                                                                textScaler: MediaQuery.of(context).textScaler,
                                                                                                text: TextSpan(
                                                                                                  children: [
                                                                                                    TextSpan(
                                                                                                      text: valueOrDefault<String>(
                                                                                                        _model.pricePeriod == Period.month ? 'за ' : 'от ',
                                                                                                        'от ',
                                                                                                      ),
                                                                                                      style: FlutterFlowTheme.of(context).bodyMedium.override(
                                                                                                            fontFamily: 'Montserrat',
                                                                                                            letterSpacing: 0.0,
                                                                                                          ),
                                                                                                    ),
                                                                                                    TextSpan(
                                                                                                      text: valueOrDefault<String>(
                                                                                                        () {
                                                                                                          if (_model.pricePeriod == Period.week) {
                                                                                                            return valueOrDefault<String>(
                                                                                                              richTextPriceMinWeeklyPriceViewRowList.where((e) => _model.locSize == e.locationSizeId).toList().firstOrNull?.minWeeklyPrice.toString(),
                                                                                                              '0',
                                                                                                            );
                                                                                                          } else if (_model.pricePeriod == Period.day) {
                                                                                                            return valueOrDefault<String>(
                                                                                                              richTextPriceMinWeeklyPriceViewRowList.where((e) => _model.locSize == e.locationSizeId).toList().firstOrNull?.minDailyPrice.toString(),
                                                                                                              '0',
                                                                                                            );
                                                                                                          } else {
                                                                                                            return valueOrDefault<String>(
                                                                                                              richTextPriceMinWeeklyPriceViewRowList.where((e) => _model.locSize == e.locationSizeId).toList().firstOrNull?.realMonthlyPrice.toString(),
                                                                                                              '0',
                                                                                                            );
                                                                                                          }
                                                                                                        }(),
                                                                                                        '0',
                                                                                                      ),
                                                                                                      style: FlutterFlowTheme.of(context).displaySmall.override(
                                                                                                            fontFamily: 'Montserrat',
                                                                                                            fontSize: 24.0,
                                                                                                            letterSpacing: 0.0,
                                                                                                          ),
                                                                                                    ),
                                                                                                    TextSpan(
                                                                                                      text: FFLocalizations.of(context).getText(
                                                                                                        'opffo1qf' /*  ₽/ */,
                                                                                                      ),
                                                                                                      style: FlutterFlowTheme.of(context).bodyMedium.override(
                                                                                                            fontFamily: 'Montserrat',
                                                                                                            letterSpacing: 0.0,
                                                                                                          ),
                                                                                                    ),
                                                                                                    TextSpan(
                                                                                                      text: valueOrDefault<String>(
                                                                                                        () {
                                                                                                          if (_model.pricePeriod == Period.day) {
                                                                                                            return 'день';
                                                                                                          } else if (_model.pricePeriod == Period.month) {
                                                                                                            return 'мес';
                                                                                                          } else {
                                                                                                            return 'нед';
                                                                                                          }
                                                                                                        }(),
                                                                                                        'нед',
                                                                                                      ),
                                                                                                      style: FlutterFlowTheme.of(context).titleLarge.override(
                                                                                                            fontFamily: 'Tochka',
                                                                                                            color: FlutterFlowTheme.of(context).secondary,
                                                                                                            fontSize: 16.0,
                                                                                                            letterSpacing: 0.0,
                                                                                                            decoration: TextDecoration.underline,
                                                                                                            useGoogleFonts: false,
                                                                                                          ),
                                                                                                    )
                                                                                                  ],
                                                                                                  style: FlutterFlowTheme.of(context).bodyMedium.override(
                                                                                                        fontFamily: 'Montserrat',
                                                                                                        fontSize: 1.0,
                                                                                                        letterSpacing: 0.0,
                                                                                                        lineHeight: 0.8,
                                                                                                      ),
                                                                                                ),
                                                                                                textAlign: TextAlign.end,
                                                                                              ),
                                                                                            ).animateOnPageLoad(animationsMap['richTextOnPageLoadAnimation2']!).animateOnActionTrigger(animationsMap['richTextOnActionTriggerAnimation2']!, hasBeenTriggered: hasRichTextTriggered2);
                                                                                          },
                                                                                        ),
                                                                                      ),
                                                                                    ),
                                                                                  ),
                                                                                  ClipRRect(
                                                                                    borderRadius: BorderRadius.circular(8.0),
                                                                                    child: Image.asset(
                                                                                      Theme.of(context).brightness == Brightness.dark ? 'assets/images/Frame_20.png' : 'assets/images/Frame_19.png',
                                                                                      width: 16.0,
                                                                                      height: 24.0,
                                                                                      fit: BoxFit.contain,
                                                                                      alignment: Alignment(-1.0, 0.0),
                                                                                    ),
                                                                                  ),
                                                                                ],
                                                                              ),
                                                                            ),
                                                                          ),
                                                                        ],
                                                                      ),
                                                                    ),
                                                                  ),
                                                                ].divide(SizedBox(
                                                                    width:
                                                                        4.0)),
                                                              ),
                                                            ),
                                                          ),
                                                        ],
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                              Padding(
                                                padding: EdgeInsetsDirectional
                                                    .fromSTEB(
                                                        0.0, 0.0, 0.0, 16.0),
                                                child: Container(
                                                  width: 370.0,
                                                  child: TextFormField(
                                                    controller: _model
                                                        .clientNameTextController,
                                                    focusNode: _model
                                                        .clientNameFocusNode,
                                                    autofocus: false,
                                                    autofillHints: [
                                                      AutofillHints.name
                                                    ],
                                                    obscureText: false,
                                                    decoration: InputDecoration(
                                                      labelText:
                                                          FFLocalizations.of(
                                                                  context)
                                                              .getText(
                                                        'qmhkkjqk' /* Как к вам обращаться? */,
                                                      ),
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
                                                                .circular(2.0),
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
                                                                .circular(2.0),
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
                                                                .circular(2.0),
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
                                                                .circular(2.0),
                                                      ),
                                                      filled: true,
                                                      fillColor:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .primaryBackground,
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
                                                    validator: _model
                                                        .clientNameTextControllerValidator
                                                        .asValidator(context),
                                                  ),
                                                ),
                                              ),
                                              Padding(
                                                padding: EdgeInsetsDirectional
                                                    .fromSTEB(
                                                        0.0, 0.0, 0.0, 16.0),
                                                child: Container(
                                                  width: 370.0,
                                                  child: TextFormField(
                                                    controller: _model
                                                        .emailAddressTextController,
                                                    focusNode: _model
                                                        .emailAddressFocusNode,
                                                    autofocus: false,
                                                    autofillHints: [
                                                      AutofillHints
                                                          .telephoneNumberCountryCode
                                                    ],
                                                    obscureText: false,
                                                    decoration: InputDecoration(
                                                      labelText:
                                                          FFLocalizations.of(
                                                                  context)
                                                              .getText(
                                                        'oxewm7p0' /* Почта */,
                                                      ),
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
                                                                .circular(2.0),
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
                                                                .circular(2.0),
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
                                                                .circular(2.0),
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
                                                                .circular(2.0),
                                                      ),
                                                      filled: true,
                                                      fillColor:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .primaryBackground,
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
                                                        .emailAddressTextControllerValidator
                                                        .asValidator(context),
                                                  ),
                                                ),
                                              ),
                                              Padding(
                                                padding: EdgeInsetsDirectional
                                                    .fromSTEB(
                                                        0.0, 0.0, 0.0, 16.0),
                                                child: Container(
                                                  width: 370.0,
                                                  child: TextFormField(
                                                    controller: _model
                                                        .phoneTextController,
                                                    focusNode:
                                                        _model.phoneFocusNode,
                                                    autofocus: false,
                                                    autofillHints: [
                                                      AutofillHints
                                                          .telephoneNumberCountryCode
                                                    ],
                                                    obscureText: false,
                                                    decoration: InputDecoration(
                                                      labelText:
                                                          FFLocalizations.of(
                                                                  context)
                                                              .getText(
                                                        'y0liyobf' /* Телефон */,
                                                      ),
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
                                                                .circular(2.0),
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
                                                                .circular(2.0),
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
                                                                .circular(2.0),
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
                                                                .circular(2.0),
                                                      ),
                                                      filled: true,
                                                      fillColor:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .primaryBackground,
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
                                                        .phoneTextControllerValidator
                                                        .asValidator(context),
                                                    inputFormatters: [
                                                      _model.phoneMask
                                                    ],
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ).animateOnPageLoad(animationsMap[
                                              'columnOnPageLoadAnimation2']!),
                                        ),
                                      ),
                                      Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            0.0, 0.0, 0.0, 12.0),
                                        child: FFButtonWidget(
                                          onPressed: () async {
                                            if (_model.formKey.currentState ==
                                                    null ||
                                                !_model.formKey.currentState!
                                                    .validate()) {
                                              return;
                                            }
                                            // create Request
                                            _model.createNewRequest =
                                                await RequestsTable().insert({
                                              'phone': _model
                                                  .phoneTextController.text,
                                              'client_name': _model
                                                  .clientNameTextController
                                                  .text,
                                              'email': _model
                                                  .emailAddressTextController
                                                  .text,
                                              'request_id':
                                                  valueOrDefault<String>(
                                                '${widget.location}-${widget.size}-${random_data.randomInteger(0, 100).toString()}${valueOrDefault<String>(
                                                  random_data.randomString(
                                                    4,
                                                    4,
                                                    true,
                                                    true,
                                                    false,
                                                  ),
                                                  'aAaa',
                                                )}-${getCurrentTimestamp.secondsSinceEpoch.toString()}',
                                                '000-000',
                                              ),
                                              'location': _model.locID,
                                              'size': valueOrDefault<String>(
                                                _model.choiceChipsSizeValue,
                                                'XS',
                                              ),
                                              'franchise': valueOrDefault<int>(
                                                _model.selectedLoc?.firstOrNull
                                                    ?.franchisee,
                                                0,
                                              ),
                                              'processed': false,
                                              'status': 'lead',
                                            });
                                            // check Client
                                            _model.checkClient =
                                                await ClientsTable().queryRows(
                                              queryFn: (q) => q.eqOrNull(
                                                'email',
                                                _model
                                                    .emailAddressTextController
                                                    .text,
                                              ),
                                            );
                                            _model.matchesQuery =
                                                await MatchedRequestsTable()
                                                    .queryRows(
                                              queryFn: (q) => q
                                                  .eqOrNull(
                                                    'email',
                                                    _model
                                                        .emailAddressTextController
                                                        .text,
                                                  )
                                                  .eqOrNull(
                                                    'phone',
                                                    _model.phoneTextController
                                                        .text,
                                                  ),
                                            );
                                            if ((_model.checkClient != null &&
                                                    (_model.checkClient)!
                                                        .isNotEmpty) &&
                                                (_model.matchesQuery != null &&
                                                    (_model.matchesQuery)!
                                                        .isNotEmpty)) {
                                              await showModalBottomSheet(
                                                isScrollControlled: true,
                                                backgroundColor:
                                                    FlutterFlowTheme.of(context)
                                                        .primary,
                                                barrierColor:
                                                    FlutterFlowTheme.of(context)
                                                        .primary,
                                                enableDrag: false,
                                                context: context,
                                                builder: (context) {
                                                  return GestureDetector(
                                                    onTap: () {
                                                      FocusScope.of(context)
                                                          .unfocus();
                                                      FocusManager
                                                          .instance.primaryFocus
                                                          ?.unfocus();
                                                    },
                                                    child: Padding(
                                                      padding: MediaQuery
                                                          .viewInsetsOf(
                                                              context),
                                                      child:
                                                          RequestSendedMatchClientWidget(
                                                        hasCell: _model
                                                            .matchesQuery!
                                                            .firstOrNull!
                                                            .cellId!,
                                                        email: _model
                                                            .matchesQuery!
                                                            .firstOrNull!
                                                            .email!,
                                                        requestID: _model
                                                            .matchesQuery!
                                                            .firstOrNull!
                                                            .requestId!,
                                                        phone: _model
                                                            .matchesQuery!
                                                            .firstOrNull!
                                                            .phone!,
                                                        username: _model
                                                            .matchesQuery!
                                                            .firstOrNull!
                                                            .clientName!,
                                                        clientname: _model
                                                            .checkClient!
                                                            .firstOrNull!
                                                            .clientName!,
                                                        clientID: _model
                                                            .checkClient!
                                                            .firstOrNull!
                                                            .clientId,
                                                      ),
                                                    ),
                                                  );
                                                },
                                              ).then((value) =>
                                                  safeSetState(() {}));

                                              _model.foundedCell = _model
                                                  .matchesQuery
                                                  ?.firstOrNull
                                                  ?.cellId;
                                              safeSetState(() {});
                                            } else if (!(_model.checkClient !=
                                                        null &&
                                                    (_model.checkClient)!
                                                        .isNotEmpty) &&
                                                (_model.matchesQuery != null &&
                                                    (_model.matchesQuery)!
                                                        .isNotEmpty)) {
                                              await showModalBottomSheet(
                                                isScrollControlled: true,
                                                backgroundColor:
                                                    FlutterFlowTheme.of(context)
                                                        .primary,
                                                barrierColor:
                                                    FlutterFlowTheme.of(context)
                                                        .primary,
                                                enableDrag: false,
                                                context: context,
                                                builder: (context) {
                                                  return GestureDetector(
                                                    onTap: () {
                                                      FocusScope.of(context)
                                                          .unfocus();
                                                      FocusManager
                                                          .instance.primaryFocus
                                                          ?.unfocus();
                                                    },
                                                    child: Padding(
                                                      padding: MediaQuery
                                                          .viewInsetsOf(
                                                              context),
                                                      child:
                                                          RequestSendedMatchWidget(
                                                        hasCell: _model
                                                            .matchesQuery!
                                                            .firstOrNull!
                                                            .cellId!,
                                                        email: _model
                                                            .matchesQuery!
                                                            .firstOrNull!
                                                            .email!,
                                                        requestID: _model
                                                            .matchesQuery!
                                                            .firstOrNull!
                                                            .requestId!,
                                                        phone: _model
                                                            .matchesQuery!
                                                            .firstOrNull!
                                                            .phone!,
                                                        username: _model
                                                            .matchesQuery!
                                                            .firstOrNull!
                                                            .clientName!,
                                                      ),
                                                    ),
                                                  );
                                                },
                                              ).then((value) =>
                                                  safeSetState(() {}));

                                              _model.foundedCell = _model
                                                  .matchesQuery
                                                  ?.firstOrNull
                                                  ?.cellId;
                                              safeSetState(() {});
                                            } else {
                                              await showModalBottomSheet(
                                                isScrollControlled: true,
                                                backgroundColor:
                                                    Colors.transparent,
                                                barrierColor:
                                                    FlutterFlowTheme.of(context)
                                                        .primary,
                                                enableDrag: false,
                                                context: context,
                                                builder: (context) {
                                                  return GestureDetector(
                                                    onTap: () {
                                                      FocusScope.of(context)
                                                          .unfocus();
                                                      FocusManager
                                                          .instance.primaryFocus
                                                          ?.unfocus();
                                                    },
                                                    child: Padding(
                                                      padding: MediaQuery
                                                          .viewInsetsOf(
                                                              context),
                                                      child:
                                                          RequestSendedWidget(),
                                                    ),
                                                  );
                                                },
                                              ).then((value) =>
                                                  safeSetState(() {}));

                                              await Future.delayed(
                                                  const Duration(
                                                      milliseconds: 1000));
                                              safeSetState(() {
                                                _model.clientNameTextController
                                                    ?.clear();
                                                _model
                                                    .emailAddressTextController
                                                    ?.clear();
                                                _model.phoneTextController
                                                    ?.clear();
                                                _model.phoneMask.clear();
                                              });
                                            }

                                            safeSetState(() {});
                                          },
                                          text: FFLocalizations.of(context)
                                              .getText(
                                            '5clpfmfp' /* Отправить заявку */,
                                          ),
                                          options: FFButtonOptions(
                                            width: 370.0,
                                            height: 48.0,
                                            padding:
                                                EdgeInsetsDirectional.fromSTEB(
                                                    0.0, 0.0, 0.0, 0.0),
                                            iconPadding:
                                                EdgeInsetsDirectional.fromSTEB(
                                                    0.0, 0.0, 0.0, 0.0),
                                            color: FlutterFlowTheme.of(context)
                                                .primary,
                                            textStyle:
                                                FlutterFlowTheme.of(context)
                                                    .titleSmall
                                                    .override(
                                                      fontFamily: 'Tochka',
                                                      color: Colors.white,
                                                      fontSize: 22.0,
                                                      letterSpacing: 0.0,
                                                      fontWeight:
                                                          FontWeight.bold,
                                                      useGoogleFonts: false,
                                                    ),
                                            elevation: 16.0,
                                            borderSide: BorderSide(
                                              color: Colors.transparent,
                                              width: 1.0,
                                            ),
                                            borderRadius:
                                                BorderRadius.circular(4.0),
                                          ),
                                        ),
                                      ),
                                      Align(
                                        alignment:
                                            AlignmentDirectional(0.0, 0.0),
                                        child: Padding(
                                          padding:
                                              EdgeInsetsDirectional.fromSTEB(
                                                  16.0, 0.0, 16.0, 8.0),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.max,
                                            mainAxisAlignment:
                                                MainAxisAlignment.end,
                                            children: [
                                              // You will have to add an action on this rich text to go to your login page.
                                              Align(
                                                alignment: AlignmentDirectional(
                                                    1.0, 0.0),
                                                child: RichText(
                                                  textScaler:
                                                      MediaQuery.of(context)
                                                          .textScaler,
                                                  text: TextSpan(
                                                    children: [
                                                      TextSpan(
                                                        text:
                                                            FFLocalizations.of(
                                                                    context)
                                                                .getText(
                                                          '7p52rwh0' /* * */,
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
                                                                      .primary,
                                                                  fontSize:
                                                                      12.0,
                                                                  letterSpacing:
                                                                      0.0,
                                                                  fontWeight:
                                                                      FontWeight
                                                                          .w600,
                                                                ),
                                                        mouseCursor:
                                                            SystemMouseCursors
                                                                .click,
                                                        recognizer:
                                                            TapGestureRecognizer()
                                                              ..onTap =
                                                                  () async {
                                                                unawaited(
                                                                  () async {
                                                                    await launchURL(
                                                                        'https://tochkasklada.ru/documents#rec207989415');
                                                                  }(),
                                                                );
                                                              },
                                                      ),
                                                      TextSpan(
                                                        text: _model.pricePeriod ==
                                                                Period.month
                                                            ? 'при оплате за 1 месяц'
                                                            : 'при условии долгосрочной аренды',
                                                        style: TextStyle(),
                                                      )
                                                    ],
                                                    style: FlutterFlowTheme.of(
                                                            context)
                                                        .bodyMedium
                                                        .override(
                                                          fontFamily:
                                                              'Montserrat',
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .tertiaryText,
                                                          fontSize: 11.0,
                                                          letterSpacing: 0.0,
                                                          lineHeight: 0.9,
                                                        ),
                                                  ),
                                                  textAlign: TextAlign.end,
                                                  maxLines: 2,
                                                ).animateOnActionTrigger(
                                                  animationsMap[
                                                      'richTextOnActionTriggerAnimation3']!,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),

                                      // You will have to add an action on this rich text to go to your login page.
                                      Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            16.0, 8.0, 0.0, 6.0),
                                        child: InkWell(
                                          splashColor: Colors.transparent,
                                          focusColor: Colors.transparent,
                                          hoverColor: Colors.transparent,
                                          highlightColor: Colors.transparent,
                                          onTap: () async {
                                            unawaited(
                                              () async {
                                                await launchURL(
                                                    'https://tochkasklada.ru/documents#rec207989415');
                                              }(),
                                            );
                                          },
                                          child: RichText(
                                            textScaler: MediaQuery.of(context)
                                                .textScaler,
                                            text: TextSpan(
                                              children: [
                                                TextSpan(
                                                  text: FFLocalizations.of(
                                                          context)
                                                      .getText(
                                                    'd8e78sk7' /* Отправляя заявку, вы принимает... */,
                                                  ),
                                                  style: TextStyle(),
                                                ),
                                                TextSpan(
                                                  text: FFLocalizations.of(
                                                          context)
                                                      .getText(
                                                    '7bd9za9u' /* политику конфиденциальности  */,
                                                  ),
                                                  style: FlutterFlowTheme.of(
                                                          context)
                                                      .bodyMedium
                                                      .override(
                                                        fontFamily:
                                                            'Montserrat',
                                                        color:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .primary,
                                                        fontSize: 12.0,
                                                        letterSpacing: 0.0,
                                                        fontWeight:
                                                            FontWeight.w600,
                                                      ),
                                                  mouseCursor:
                                                      SystemMouseCursors.click,
                                                  recognizer:
                                                      TapGestureRecognizer()
                                                        ..onTap = () async {
                                                          unawaited(
                                                            () async {
                                                              await launchURL(
                                                                  'https://tochkasklada.ru/documents#rec207989415');
                                                            }(),
                                                          );
                                                        },
                                                ),
                                                TextSpan(
                                                  text: FFLocalizations.of(
                                                          context)
                                                      .getText(
                                                    'dc346suy' /* сайта */,
                                                  ),
                                                  style: TextStyle(),
                                                )
                                              ],
                                              style:
                                                  FlutterFlowTheme.of(context)
                                                      .bodyMedium
                                                      .override(
                                                        fontFamily:
                                                            'Montserrat',
                                                        fontSize: 12.0,
                                                        letterSpacing: 0.0,
                                                      ),
                                            ),
                                            maxLines: 2,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ).animateOnPageLoad(animationsMap[
                                    'columnOnPageLoadAnimation1']!),
                              ),
                            );
                          } else {
                            return Align(
                              alignment: AlignmentDirectional(0.0, 0.0),
                              child: Padding(
                                padding: EdgeInsetsDirectional.fromSTEB(
                                    0.0, 48.0, 0.0, 0.0),
                                child: Column(
                                  mainAxisSize: MainAxisSize.max,
                                  children: [
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          0.0, 48.0, 0.0, 0.0),
                                      child: ClipRRect(
                                        borderRadius:
                                            BorderRadius.circular(8.0),
                                        child: Image.asset(
                                          'assets/images/logoShort.png',
                                          width: 100.0,
                                          height: 100.0,
                                          fit: BoxFit.cover,
                                        ),
                                      ).animateOnPageLoad(animationsMap[
                                          'imageOnPageLoadAnimation']!),
                                    ),
                                    Align(
                                      alignment: AlignmentDirectional(0.0, 0.0),
                                      child: Container(
                                        width: 370.0,
                                        height:
                                            MediaQuery.sizeOf(context).height *
                                                0.6,
                                        child:
                                            custom_widgets.DrawlerAdressShimmer(
                                          width: 370.0,
                                          height: MediaQuery.sizeOf(context)
                                                  .height *
                                              0.6,
                                          borderRadius: 16.0,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          }
                        },
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ));
  }
}
