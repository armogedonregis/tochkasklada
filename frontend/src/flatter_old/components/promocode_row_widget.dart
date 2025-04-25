import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:just_audio/just_audio.dart';
import 'promocode_row_model.dart';
export 'promocode_row_model.dart';

class PromocodeRowWidget extends StatefulWidget {
  const PromocodeRowWidget({
    super.key,
    required this.promocode,
    required this.codeValue,
    bool? isPercent,
    required this.usageQty,
    int? usedQty,
    this.expirationDate,
    int? minAmount,
    int? maxAmount,
    String? area,
    this.usermail,
  })  : this.isPercent = isPercent ?? false,
        this.usedQty = usedQty ?? 0,
        this.minAmount = minAmount ?? 3000,
        this.maxAmount = maxAmount ?? 200000,
        this.area = area ?? '0';

  final String? promocode;
  final double? codeValue;
  final bool isPercent;
  final int? usageQty;
  final int usedQty;
  final DateTime? expirationDate;
  final int minAmount;
  final int maxAmount;
  final String area;
  final String? usermail;

  @override
  State<PromocodeRowWidget> createState() => _PromocodeRowWidgetState();
}

class _PromocodeRowWidgetState extends State<PromocodeRowWidget> {
  late PromocodeRowModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => PromocodeRowModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 24.0, 0.0),
      child: Container(
        width: double.infinity,
        height: 48.0,
        decoration: BoxDecoration(
          color: widget.isPercent
              ? FlutterFlowTheme.of(context).accent1
              : FlutterFlowTheme.of(context).secondaryBackground,
          boxShadow: [
            BoxShadow(
              blurRadius: 0.0,
              color: FlutterFlowTheme.of(context).shadow,
              offset: Offset(
                0.0,
                1.0,
              ),
            )
          ],
          borderRadius: BorderRadius.circular(0.0),
        ),
        child: Opacity(
          opacity: (widget.expirationDate!.secondsSinceEpoch <=
                      getCurrentTimestamp.secondsSinceEpoch) ||
                  (widget.usedQty >= widget.usageQty!)
              ? 0.45
              : 1.0,
          child: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 0.0),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 0.0, 0.0),
                  child: Container(
                    width: 160.0,
                    decoration: BoxDecoration(),
                    child: Column(
                      mainAxisSize: MainAxisSize.max,
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        InkWell(
                          splashColor: Colors.transparent,
                          focusColor: Colors.transparent,
                          hoverColor: Colors.transparent,
                          highlightColor: Colors.transparent,
                          onTap: () async {
                            await Future.wait([
                              Future(() async {
                                HapticFeedback.lightImpact();
                              }),
                              Future(() async {
                                _model.soundPlayer1 ??= AudioPlayer();
                                if (_model.soundPlayer1!.playing) {
                                  await _model.soundPlayer1!.stop();
                                }
                                _model.soundPlayer1!.setVolume(0.59);
                                _model.soundPlayer1!
                                    .setAsset(
                                        'assets/audios/Tick-DeepFrozenApps-397275646.mp3')
                                    .then((_) => _model.soundPlayer1!.play());
                              }),
                              Future(() async {
                                ScaffoldMessenger.of(context).clearSnackBars();
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                      'Промокод скопирован!',
                                      style: FlutterFlowTheme.of(context)
                                          .labelMedium
                                          .override(
                                            fontFamily: 'Montserrat',
                                            color: FlutterFlowTheme.of(context)
                                                .primaryBackground,
                                            letterSpacing: 0.0,
                                          ),
                                    ),
                                    duration: Duration(milliseconds: 4000),
                                    backgroundColor:
                                        FlutterFlowTheme.of(context)
                                            .primaryText,
                                  ),
                                );
                              }),
                              Future(() async {
                                await Clipboard.setData(
                                    ClipboardData(text: widget.promocode!));
                              }),
                            ]);
                          },
                          child: Text(
                            valueOrDefault<String>(
                              widget.promocode,
                              'promocode',
                            ),
                            style: FlutterFlowTheme.of(context)
                                .labelMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  color:
                                      FlutterFlowTheme.of(context).tertiaryText,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                        ),
                        InkWell(
                          splashColor: Colors.transparent,
                          focusColor: Colors.transparent,
                          hoverColor: Colors.transparent,
                          highlightColor: Colors.transparent,
                          onTap: () async {
                            await Future.wait([
                              Future(() async {
                                HapticFeedback.lightImpact();
                              }),
                              Future(() async {
                                _model.soundPlayer2 ??= AudioPlayer();
                                if (_model.soundPlayer2!.playing) {
                                  await _model.soundPlayer2!.stop();
                                }
                                _model.soundPlayer2!.setVolume(0.59);
                                _model.soundPlayer2!
                                    .setAsset(
                                        'assets/audios/Tick-DeepFrozenApps-397275646.mp3')
                                    .then((_) => _model.soundPlayer2!.play());
                              }),
                              Future(() async {
                                ScaffoldMessenger.of(context).clearSnackBars();
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                      'Промокод скопирован!',
                                      style: FlutterFlowTheme.of(context)
                                          .labelMedium
                                          .override(
                                            fontFamily: 'Montserrat',
                                            color: FlutterFlowTheme.of(context)
                                                .primaryBackground,
                                            letterSpacing: 0.0,
                                          ),
                                    ),
                                    duration: Duration(milliseconds: 4000),
                                    backgroundColor:
                                        FlutterFlowTheme.of(context)
                                            .primaryText,
                                  ),
                                );
                              }),
                              Future(() async {
                                await Clipboard.setData(
                                    ClipboardData(text: widget.promocode!));
                              }),
                            ]);
                          },
                          child: Text(
                            valueOrDefault<String>(
                              widget.usermail,
                              '-',
                            ),
                            textAlign: TextAlign.start,
                            style: FlutterFlowTheme.of(context)
                                .labelMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  color:
                                      FlutterFlowTheme.of(context).tertiaryText,
                                  fontSize: 12.0,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.normal,
                                ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                Align(
                  alignment: AlignmentDirectional(-1.0, 0.0),
                  child: Container(
                    width: 80.0,
                    decoration: BoxDecoration(),
                    child: Text(
                      '${valueOrDefault<String>(
                        widget.codeValue.toString(),
                        '0',
                      )} ${valueOrDefault<String>(
                        widget.isPercent ? '%' : '₽',
                        '₽',
                      )}',
                      textAlign: TextAlign.end,
                      style: FlutterFlowTheme.of(context).labelMedium.override(
                            fontFamily: 'Montserrat',
                            color: widget.isPercent
                                ? FlutterFlowTheme.of(context).secondary
                                : FlutterFlowTheme.of(context).secondaryText,
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.bold,
                          ),
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
                    child: RichText(
                      textScaler: MediaQuery.of(context).textScaler,
                      text: TextSpan(
                        children: [
                          TextSpan(
                            text: valueOrDefault<String>(
                              widget.usedQty.toString(),
                              '0',
                            ),
                            style: FlutterFlowTheme.of(context)
                                .labelMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.w600,
                                ),
                          ),
                          TextSpan(
                            text: FFLocalizations.of(context).getText(
                              'pfj1n86n' /*  из  */,
                            ),
                            style: TextStyle(),
                          ),
                          TextSpan(
                            text: valueOrDefault<String>(
                              widget.usageQty?.toString(),
                              '1',
                            ),
                            style: TextStyle(),
                          )
                        ],
                        style:
                            FlutterFlowTheme.of(context).labelMedium.override(
                                  fontFamily: 'Montserrat',
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.normal,
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
                        dateTimeFormat(
                          "d/M/y",
                          widget.expirationDate,
                          locale: FFLocalizations.of(context).languageCode,
                        ),
                        textAlign: TextAlign.end,
                        style: FlutterFlowTheme.of(context).bodySmall.override(
                              fontFamily: 'Montserrat',
                              color: FlutterFlowTheme.of(context).secondaryText,
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
                      decoration: BoxDecoration(),
                      child: Text(
                        valueOrDefault<String>(
                          widget.area,
                          '0',
                        ),
                        textAlign: TextAlign.center,
                        style:
                            FlutterFlowTheme.of(context).labelMedium.override(
                                  fontFamily: 'Montserrat',
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.bold,
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
                    width: 132.0,
                    decoration: BoxDecoration(),
                    child: Visibility(
                      visible: responsiveVisibility(
                        context: context,
                        phone: false,
                        tablet: false,
                        tabletLandscape: false,
                      ),
                      child: Text(
                        valueOrDefault<String>(
                          '${valueOrDefault<String>(
                            widget.minAmount.toString(),
                            '3000',
                          )} — ${valueOrDefault<String>(
                            widget.maxAmount.toString(),
                            '200000',
                          )}',
                          '3000 — 200000',
                        ),
                        textAlign: TextAlign.end,
                        style:
                            FlutterFlowTheme.of(context).labelMedium.override(
                                  fontFamily: 'Montserrat',
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.bold,
                                ),
                      ),
                    ),
                  ),
                Flexible(
                  flex: 2,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 48.0,
                        height: 48.0,
                        decoration: BoxDecoration(),
                        child: FlutterFlowIconButton(
                          borderRadius: 16.0,
                          borderWidth: 1.0,
                          buttonSize: 48.0,
                          hoverColor: FlutterFlowTheme.of(context).accent1,
                          hoverIconColor: (widget
                                          .expirationDate!.secondsSinceEpoch <=
                                      getCurrentTimestamp.secondsSinceEpoch) ||
                                  (widget.usedQty >= widget.usageQty!)
                              ? FlutterFlowTheme.of(context).primary
                              : FlutterFlowTheme.of(context)
                                  .secondaryBackground,
                          icon: FaIcon(
                            FontAwesomeIcons.trashAlt,
                            color: (widget.expirationDate!.secondsSinceEpoch <=
                                        getCurrentTimestamp
                                            .secondsSinceEpoch) ||
                                    (widget.usedQty >= widget.usageQty!)
                                ? FlutterFlowTheme.of(context).primary
                                : FlutterFlowTheme.of(context).alternate,
                            size: 24.0,
                          ),
                          onPressed: () async {
                            unawaited(
                              () async {
                                _model.deleteRow =
                                    await PromoCodesTable().delete(
                                  matchingRows: (rows) => rows.eqOrNull(
                                    'promocode',
                                    widget.promocode,
                                  ),
                                  returnRows: true,
                                );
                              }(),
                            );

                            safeSetState(() {});

                            _model.updatePage(() {});

                            safeSetState(() {});
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ].divide(SizedBox(width: 12.0)),
            ),
          ),
        ),
      ),
    );
  }
}
