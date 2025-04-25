import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/components/loc_card_widget.dart';
import '/components/skeleton_multi_line_list_widget.dart';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/custom_code/widgets/index.dart' as custom_widgets;
import '/index.dart';
import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:provider/provider.dart';
import 'card_of_franchise_model.dart';
export 'card_of_franchise_model.dart';

class CardOfFranchiseWidget extends StatefulWidget {
  const CardOfFranchiseWidget({
    super.key,
    required this.franchiseID,
  });

  final int? franchiseID;

  @override
  State<CardOfFranchiseWidget> createState() => _CardOfFranchiseWidgetState();
}

class _CardOfFranchiseWidgetState extends State<CardOfFranchiseWidget> {
  late CardOfFranchiseModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => CardOfFranchiseModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.franchiseQuery = await FranchiseViewTable().queryRows(
        queryFn: (q) => q.eqOrNull(
          'franchise_id',
          widget.franchiseID,
        ),
      );
      await Future.delayed(const Duration(milliseconds: 400));
      _model.isLoading = !_model.isLoading;
      safeSetState(() {});
    });

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    context.watch<FFAppState>();

    return Padding(
      padding: EdgeInsetsDirectional.fromSTEB(0.0, 8.0, 0.0, 8.0),
      child: Builder(
        builder: (context) {
          if (!_model.isLoading) {
            return Padding(
              padding: EdgeInsetsDirectional.fromSTEB(16.0, 12.0, 16.0, 32.0),
              child: Container(
                width: 340.0,
                constraints: BoxConstraints(
                  minWidth: 320.0,
                  maxWidth: 400.0,
                ),
                decoration: BoxDecoration(
                  color: FlutterFlowTheme.of(context).secondaryBackground,
                  boxShadow: [
                    BoxShadow(
                      blurRadius: 10.0,
                      color: FlutterFlowTheme.of(context).shadow,
                      offset: Offset(
                        0.0,
                        18.0,
                      ),
                      spreadRadius: 7.0,
                    )
                  ],
                  borderRadius: BorderRadius.circular(16.0),
                  border: Border.all(
                    color: FlutterFlowTheme.of(context).grayAlpha,
                  ),
                ),
                child: Padding(
                  padding: EdgeInsets.all(12.0),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Padding(
                              padding: EdgeInsetsDirectional.fromSTEB(
                                  0.0, 12.0, 0.0, 12.0),
                              child: Row(
                                mainAxisSize: MainAxisSize.max,
                                children: [
                                  Text(
                                    valueOrDefault<String>(
                                      '# ${widget.franchiseID?.toString()}',
                                      '# 0',
                                    ),
                                    style: FlutterFlowTheme.of(context)
                                        .headlineSmall
                                        .override(
                                          fontFamily: 'Tochka',
                                          letterSpacing: 0.0,
                                          useGoogleFonts: false,
                                        ),
                                  ),
                                  Container(
                                    width: 32.0,
                                    height: 32.0,
                                    clipBehavior: Clip.antiAlias,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                    ),
                                    child: Image.network(
                                      valueOrDefault<String>(
                                        _model.franchiseQuery?.firstOrNull
                                            ?.franchiseAvatar,
                                        'https://yzapdavvyxgrgeskutdl.supabase.co/storage/v1/object/public/crm-tochka/default_avatars/fi.png',
                                      ),
                                      fit: BoxFit.cover,
                                      errorBuilder:
                                          (context, error, stackTrace) =>
                                              Image.asset(
                                        'assets/images/error_image.png',
                                        fit: BoxFit.cover,
                                      ),
                                    ),
                                  ),
                                  Column(
                                    mainAxisSize: MainAxisSize.max,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      SelectionArea(
                                          child: Text(
                                        valueOrDefault<String>(
                                          _model.franchiseQuery?.firstOrNull
                                              ?.franchiseName,
                                          'Имя Фамилия',
                                        ).maybeHandleOverflow(
                                          maxChars: 36,
                                        ),
                                        style: FlutterFlowTheme.of(context)
                                            .bodyLarge
                                            .override(
                                              fontFamily: 'Montserrat',
                                              letterSpacing: 0.0,
                                            ),
                                      )),
                                      Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            0.0, 4.0, 0.0, 0.0),
                                        child: SelectionArea(
                                            child: AutoSizeText(
                                          valueOrDefault<String>(
                                            _model.franchiseQuery?.firstOrNull
                                                ?.franchiasiiMail,
                                            'mail',
                                          ),
                                          minFontSize: 12.0,
                                          style: FlutterFlowTheme.of(context)
                                              .labelSmall
                                              .override(
                                                fontFamily: 'Montserrat',
                                                letterSpacing: 0.0,
                                              ),
                                        )),
                                      ),
                                    ],
                                  ),
                                ].divide(SizedBox(width: 8.0)),
                              ),
                            ),
                            Container(
                              decoration: BoxDecoration(),
                              child: Builder(
                                builder: (context) {
                                  if (_model.whatView == 'base') {
                                    return Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          0.0, 0.0, 12.0, 8.0),
                                      child:
                                          FutureBuilder<List<LocationViewRow>>(
                                        future: LocationViewTable().queryRows(
                                          queryFn: (q) => q
                                              .eqOrNull(
                                                'franchisee',
                                                widget.franchiseID,
                                              )
                                              .order('total_cells'),
                                        ),
                                        builder: (context, snapshot) {
                                          // Customize what your widget looks like when it's loading.
                                          if (!snapshot.hasData) {
                                            return SkeletonMultiLineListWidget(
                                              height: 100.0,
                                              itemsQty: 1,
                                              radii: 16,
                                              spacer: 16,
                                            );
                                          }
                                          List<LocationViewRow>
                                              listViewLocationViewRowList =
                                              snapshot.data!;

                                          return ListView.separated(
                                            padding: EdgeInsets.zero,
                                            shrinkWrap: true,
                                            scrollDirection: Axis.vertical,
                                            itemCount:
                                                listViewLocationViewRowList
                                                    .length,
                                            separatorBuilder: (_, __) =>
                                                SizedBox(height: 8.0),
                                            itemBuilder:
                                                (context, listViewIndex) {
                                              final listViewLocationViewRow =
                                                  listViewLocationViewRowList[
                                                      listViewIndex];
                                              return Container(
                                                decoration: BoxDecoration(),
                                                child: wrapWithModel(
                                                  model: _model.locCardModels
                                                      .getModel(
                                                    listViewLocationViewRow
                                                        .locId!,
                                                    listViewIndex,
                                                  ),
                                                  updateCallback: () =>
                                                      safeSetState(() {}),
                                                  child: LocCardWidget(
                                                    key: Key(
                                                      'Keyj1c_${listViewLocationViewRow.locId!}',
                                                    ),
                                                    locID:
                                                        valueOrDefault<String>(
                                                      listViewLocationViewRow
                                                          .locId,
                                                      'ADR',
                                                    ),
                                                  ),
                                                ),
                                              );
                                            },
                                          );
                                        },
                                      ),
                                    );
                                  } else {
                                    return Align(
                                      alignment:
                                          AlignmentDirectional(-1.0, -1.0),
                                      child: Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            0.0, 12.0, 0.0, 0.0),
                                        child: Column(
                                          mainAxisSize: MainAxisSize.max,
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            FutureBuilder<List<FranchiseRow>>(
                                              future: FranchiseTable()
                                                  .querySingleRow(
                                                queryFn: (q) => q.eqOrNull(
                                                  'id',
                                                  widget.franchiseID,
                                                ),
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
                                                List<FranchiseRow>
                                                    richTextFranchiseRowList =
                                                    snapshot.data!;

                                                final richTextFranchiseRow =
                                                    richTextFranchiseRowList
                                                            .isNotEmpty
                                                        ? richTextFranchiseRowList
                                                            .first
                                                        : null;

                                                return RichText(
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
                                                          'se7iezc7' /* MerchantID:  */,
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
                                                                  fontSize:
                                                                      14.0,
                                                                  letterSpacing:
                                                                      0.0,
                                                                ),
                                                      ),
                                                      TextSpan(
                                                        text: valueOrDefault<
                                                            String>(
                                                          richTextFranchiseRow
                                                              ?.merchantId,
                                                          'tochka-0',
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
                                                      )
                                                    ],
                                                    style: FlutterFlowTheme.of(
                                                            context)
                                                        .bodyMedium
                                                        .override(
                                                          fontFamily:
                                                              'Montserrat',
                                                          letterSpacing: 0.0,
                                                        ),
                                                  ),
                                                );
                                              },
                                            ),
                                            if (FFAppState()
                                                .permLevel
                                                .contains(PermLevel.full))
                                              Align(
                                                alignment: AlignmentDirectional(
                                                    -1.0, 0.0),
                                                child: FFButtonWidget(
                                                  onPressed: () async {
                                                    if (FFAppState()
                                                        .permLevel
                                                        .contains(
                                                            PermLevel.full)) {
                                                      context.pushNamed(
                                                          MerchantsWidget
                                                              .routeName);
                                                    } else {
                                                      context.pushNamed(
                                                          AssessErrorPageWidget
                                                              .routeName);
                                                    }
                                                  },
                                                  text: FFLocalizations.of(
                                                          context)
                                                      .getText(
                                                    'i6vlugaa' /* Редактировать  */,
                                                  ),
                                                  options: FFButtonOptions(
                                                    height: 32.0,
                                                    padding:
                                                        EdgeInsetsDirectional
                                                            .fromSTEB(16.0, 4.0,
                                                                16.0, 4.0),
                                                    iconPadding:
                                                        EdgeInsetsDirectional
                                                            .fromSTEB(0.0, 0.0,
                                                                0.0, 0.0),
                                                    color: Colors.transparent,
                                                    textStyle: FlutterFlowTheme
                                                            .of(context)
                                                        .bodyLarge
                                                        .override(
                                                          fontFamily:
                                                              'Montserrat',
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .secondaryText,
                                                          fontSize: 12.0,
                                                          letterSpacing: 0.0,
                                                          fontWeight:
                                                              FontWeight.w600,
                                                        ),
                                                    elevation: 0.0,
                                                    borderSide: BorderSide(
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .alternate,
                                                      width: 1.0,
                                                    ),
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            12.0),
                                                  ),
                                                ),
                                              ),
                                          ].divide(SizedBox(height: 8.0)),
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
                      Padding(
                        padding:
                            EdgeInsetsDirectional.fromSTEB(0.0, 12.0, 0.0, 0.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.max,
                          children: [
                            Padding(
                              padding: EdgeInsetsDirectional.fromSTEB(
                                  0.0, 0.0, 0.0, 8.0),
                              child: FlutterFlowIconButton(
                                borderColor:
                                    FlutterFlowTheme.of(context).accent4,
                                borderRadius: 12.0,
                                borderWidth: 2.0,
                                buttonSize: 40.0,
                                fillColor: FlutterFlowTheme.of(context)
                                    .secondaryBackground,
                                disabledColor:
                                    FlutterFlowTheme.of(context).primary,
                                disabledIconColor:
                                    FlutterFlowTheme.of(context).info,
                                icon: Icon(
                                  Icons.bar_chart_rounded,
                                  color: FlutterFlowTheme.of(context)
                                      .secondaryText,
                                  size: 20.0,
                                ),
                                onPressed: (_model.whatView == 'base')
                                    ? null
                                    : () async {
                                        _model.whatView = 'base';
                                        safeSetState(() {});
                                      },
                              ),
                            ),
                            Padding(
                              padding: EdgeInsetsDirectional.fromSTEB(
                                  0.0, 0.0, 0.0, 8.0),
                              child: FlutterFlowIconButton(
                                borderColor:
                                    FlutterFlowTheme.of(context).grayAlpha,
                                borderRadius: 12.0,
                                borderWidth: 2.0,
                                buttonSize: 40.0,
                                disabledColor:
                                    FlutterFlowTheme.of(context).primary,
                                disabledIconColor:
                                    FlutterFlowTheme.of(context).info,
                                icon: Icon(
                                  Icons.payment,
                                  color: FlutterFlowTheme.of(context)
                                      .secondaryText,
                                  size: 20.0,
                                ),
                                onPressed: (_model.whatView == 'merchant')
                                    ? null
                                    : () async {
                                        _model.whatView = 'merchant';
                                        safeSetState(() {});
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
            );
          } else {
            return Padding(
              padding: EdgeInsetsDirectional.fromSTEB(16.0, 12.0, 16.0, 32.0),
              child: Container(
                constraints: BoxConstraints(
                  minWidth: 320.0,
                  maxWidth: 400.0,
                ),
                decoration: BoxDecoration(
                  color: FlutterFlowTheme.of(context).secondaryBackground,
                  boxShadow: [
                    BoxShadow(
                      blurRadius: 10.0,
                      color: FlutterFlowTheme.of(context).shadow,
                      offset: Offset(
                        0.0,
                        18.0,
                      ),
                      spreadRadius: 7.0,
                    )
                  ],
                  borderRadius: BorderRadius.circular(16.0),
                  border: Border.all(
                    color: FlutterFlowTheme.of(context).grayAlpha,
                  ),
                ),
                child: Container(
                  width: MediaQuery.sizeOf(context).width * 1.0,
                  height: 216.0,
                  child: custom_widgets.FranchiseCardShimmer(
                    width: MediaQuery.sizeOf(context).width * 1.0,
                    height: 216.0,
                    borderRadius: 16.0,
                  ),
                ),
              ),
            );
          }
        },
      ),
    );
  }
}
