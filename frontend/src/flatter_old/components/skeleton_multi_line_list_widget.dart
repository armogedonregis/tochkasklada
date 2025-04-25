import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'skeleton_multi_line_list_model.dart';
export 'skeleton_multi_line_list_model.dart';

class SkeletonMultiLineListWidget extends StatefulWidget {
  const SkeletonMultiLineListWidget({
    super.key,
    this.height,
    int? itemsQty,
    required this.radii,
    required this.spacer,
    int? between,
  })  : this.itemsQty = itemsQty ?? 2,
        this.between = between ?? 8;

  final double? height;
  final int itemsQty;
  final int? radii;
  final int? spacer;
  final int between;

  @override
  State<SkeletonMultiLineListWidget> createState() =>
      _SkeletonMultiLineListWidgetState();
}

class _SkeletonMultiLineListWidgetState
    extends State<SkeletonMultiLineListWidget> with TickerProviderStateMixin {
  late SkeletonMultiLineListModel _model;

  final animationsMap = <String, AnimationInfo>{};

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => SkeletonMultiLineListModel());

    animationsMap.addAll({
      'columnOnPageLoadAnimation': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          ShimmerEffect(
            curve: Curves.easeInOut,
            delay: 40.0.ms,
            duration: 600.0.ms,
            color: FlutterFlowTheme.of(context).secondaryBackground,
            angle: 0.524,
          ),
          BlurEffect(
            curve: Curves.easeOut,
            delay: 40.0.ms,
            duration: 600.0.ms,
            begin: Offset(3.0, 3.0),
            end: Offset(0.0, 0.0),
          ),
        ],
      ),
      'containerOnPageLoadAnimation1': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.elasticOut,
            delay: 0.0.ms,
            duration: 600.0.ms,
            begin: 0.555,
            end: 1.0,
          ),
        ],
      ),
      'containerOnPageLoadAnimation2': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.elasticOut,
            delay: 0.0.ms,
            duration: 600.0.ms,
            begin: 0.555,
            end: 1.0,
          ),
        ],
      ),
      'containerOnPageLoadAnimation3': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.elasticOut,
            delay: 0.0.ms,
            duration: 600.0.ms,
            begin: 0.555,
            end: 1.0,
          ),
        ],
      ),
      'containerOnPageLoadAnimation4': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.elasticOut,
            delay: 0.0.ms,
            duration: 600.0.ms,
            begin: 0.555,
            end: 1.0,
          ),
        ],
      ),
      'containerOnPageLoadAnimation5': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.elasticOut,
            delay: 0.0.ms,
            duration: 600.0.ms,
            begin: 0.555,
            end: 1.0,
          ),
        ],
      ),
      'containerOnPageLoadAnimation6': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.elasticOut,
            delay: 0.0.ms,
            duration: 600.0.ms,
            begin: 0.555,
            end: 1.0,
          ),
        ],
      ),
      'containerOnPageLoadAnimation7': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.elasticOut,
            delay: 0.0.ms,
            duration: 600.0.ms,
            begin: 0.555,
            end: 1.0,
          ),
        ],
      ),
      'containerOnPageLoadAnimation8': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.elasticOut,
            delay: 0.0.ms,
            duration: 600.0.ms,
            begin: 0.555,
            end: 1.0,
          ),
        ],
      ),
      'containerOnPageLoadAnimation9': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.elasticOut,
            delay: 0.0.ms,
            duration: 600.0.ms,
            begin: 0.555,
            end: 1.0,
          ),
        ],
      ),
      'containerOnPageLoadAnimation10': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.elasticOut,
            delay: 0.0.ms,
            duration: 600.0.ms,
            begin: 0.555,
            end: 1.0,
          ),
        ],
      ),
      'containerOnPageLoadAnimation11': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.elasticOut,
            delay: 0.0.ms,
            duration: 600.0.ms,
            begin: 0.555,
            end: 1.0,
          ),
        ],
      ),
      'containerOnPageLoadAnimation12': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.elasticOut,
            delay: 0.0.ms,
            duration: 600.0.ms,
            begin: 0.555,
            end: 1.0,
          ),
        ],
      ),
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
    return Column(
      mainAxisSize: MainAxisSize.max,
      children: [
        Container(
          height: 64.0,
          decoration: BoxDecoration(),
          child: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(
                valueOrDefault<double>(
                  widget.spacer?.toDouble(),
                  0.0,
                ),
                16.0,
                valueOrDefault<double>(
                  widget.spacer?.toDouble(),
                  0.0,
                ),
                0.0),
            child: Row(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Expanded(
                  flex: 1,
                  child: Opacity(
                    opacity: 0.6,
                    child: Container(
                      height: widget.height,
                      decoration: BoxDecoration(
                        color: FlutterFlowTheme.of(context).grayAlpha,
                        borderRadius:
                            BorderRadius.circular(valueOrDefault<double>(
                          widget.radii?.toDouble(),
                          0.0,
                        )),
                      ),
                    ).animateOnPageLoad(
                        animationsMap['containerOnPageLoadAnimation1']!),
                  ),
                ),
                if (widget.itemsQty > 1)
                  Expanded(
                    flex: 1,
                    child: Opacity(
                      opacity: 0.6,
                      child: Container(
                        height: widget.height,
                        decoration: BoxDecoration(
                          color: FlutterFlowTheme.of(context).grayAlpha,
                          borderRadius:
                              BorderRadius.circular(valueOrDefault<double>(
                            widget.radii?.toDouble(),
                            0.0,
                          )),
                        ),
                      ).animateOnPageLoad(
                          animationsMap['containerOnPageLoadAnimation2']!),
                    ),
                  ),
                if (widget.itemsQty > 2)
                  Expanded(
                    flex: 1,
                    child: Opacity(
                      opacity: 0.6,
                      child: Container(
                        height: widget.height,
                        decoration: BoxDecoration(
                          color: FlutterFlowTheme.of(context).grayAlpha,
                          borderRadius:
                              BorderRadius.circular(valueOrDefault<double>(
                            widget.radii?.toDouble(),
                            0.0,
                          )),
                        ),
                      ).animateOnPageLoad(
                          animationsMap['containerOnPageLoadAnimation3']!),
                    ),
                  ),
                if (widget.itemsQty > 3)
                  Expanded(
                    flex: 1,
                    child: Opacity(
                      opacity: 0.6,
                      child: Container(
                        height: widget.height,
                        decoration: BoxDecoration(
                          color: FlutterFlowTheme.of(context).grayAlpha,
                          borderRadius:
                              BorderRadius.circular(valueOrDefault<double>(
                            widget.radii?.toDouble(),
                            0.0,
                          )),
                        ),
                      ).animateOnPageLoad(
                          animationsMap['containerOnPageLoadAnimation4']!),
                    ),
                  ),
              ].divide(SizedBox(width: 16.0)),
            ),
          ),
        ),
        Container(
          height: 64.0,
          decoration: BoxDecoration(),
          child: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(
                valueOrDefault<double>(
                  widget.spacer?.toDouble(),
                  0.0,
                ),
                valueOrDefault<double>(
                  widget.between.toDouble(),
                  0.0,
                ),
                valueOrDefault<double>(
                  widget.spacer?.toDouble(),
                  0.0,
                ),
                0.0),
            child: Row(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Expanded(
                  flex: 1,
                  child: Opacity(
                    opacity: 0.6,
                    child: Container(
                      height: widget.height,
                      decoration: BoxDecoration(
                        color: FlutterFlowTheme.of(context).grayAlpha,
                        borderRadius:
                            BorderRadius.circular(valueOrDefault<double>(
                          widget.radii?.toDouble(),
                          0.0,
                        )),
                      ),
                    ).animateOnPageLoad(
                        animationsMap['containerOnPageLoadAnimation5']!),
                  ),
                ),
                if (widget.itemsQty > 1)
                  Expanded(
                    flex: 1,
                    child: Opacity(
                      opacity: 0.6,
                      child: Container(
                        height: widget.height,
                        decoration: BoxDecoration(
                          color: FlutterFlowTheme.of(context).grayAlpha,
                          borderRadius:
                              BorderRadius.circular(valueOrDefault<double>(
                            widget.radii?.toDouble(),
                            0.0,
                          )),
                        ),
                      ).animateOnPageLoad(
                          animationsMap['containerOnPageLoadAnimation6']!),
                    ),
                  ),
                if (widget.itemsQty > 2)
                  Expanded(
                    flex: 1,
                    child: Opacity(
                      opacity: 0.6,
                      child: Container(
                        height: widget.height,
                        decoration: BoxDecoration(
                          color: FlutterFlowTheme.of(context).grayAlpha,
                          borderRadius:
                              BorderRadius.circular(valueOrDefault<double>(
                            widget.radii?.toDouble(),
                            0.0,
                          )),
                        ),
                      ).animateOnPageLoad(
                          animationsMap['containerOnPageLoadAnimation7']!),
                    ),
                  ),
                if (widget.itemsQty > 3)
                  Expanded(
                    flex: 1,
                    child: Opacity(
                      opacity: 0.6,
                      child: Container(
                        height: widget.height,
                        decoration: BoxDecoration(
                          color: FlutterFlowTheme.of(context).grayAlpha,
                          borderRadius:
                              BorderRadius.circular(valueOrDefault<double>(
                            widget.radii?.toDouble(),
                            0.0,
                          )),
                        ),
                      ).animateOnPageLoad(
                          animationsMap['containerOnPageLoadAnimation8']!),
                    ),
                  ),
              ].divide(SizedBox(width: 16.0)),
            ),
          ),
        ),
        Container(
          height: 64.0,
          decoration: BoxDecoration(),
          child: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(
                valueOrDefault<double>(
                  widget.spacer?.toDouble(),
                  0.0,
                ),
                valueOrDefault<double>(
                  widget.between.toDouble(),
                  0.0,
                ),
                valueOrDefault<double>(
                  widget.spacer?.toDouble(),
                  0.0,
                ),
                0.0),
            child: Row(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Expanded(
                  flex: 1,
                  child: Opacity(
                    opacity: 0.6,
                    child: Container(
                      height: widget.height,
                      decoration: BoxDecoration(
                        color: FlutterFlowTheme.of(context).grayAlpha,
                        borderRadius:
                            BorderRadius.circular(valueOrDefault<double>(
                          widget.radii?.toDouble(),
                          0.0,
                        )),
                      ),
                    ).animateOnPageLoad(
                        animationsMap['containerOnPageLoadAnimation9']!),
                  ),
                ),
                if (widget.itemsQty > 1)
                  Expanded(
                    flex: 1,
                    child: Opacity(
                      opacity: 0.6,
                      child: Container(
                        height: widget.height,
                        decoration: BoxDecoration(
                          color: FlutterFlowTheme.of(context).grayAlpha,
                          borderRadius:
                              BorderRadius.circular(valueOrDefault<double>(
                            widget.radii?.toDouble(),
                            0.0,
                          )),
                        ),
                      ).animateOnPageLoad(
                          animationsMap['containerOnPageLoadAnimation10']!),
                    ),
                  ),
                if (widget.itemsQty > 2)
                  Expanded(
                    flex: 1,
                    child: Opacity(
                      opacity: 0.6,
                      child: Container(
                        height: widget.height,
                        decoration: BoxDecoration(
                          color: FlutterFlowTheme.of(context).grayAlpha,
                          borderRadius:
                              BorderRadius.circular(valueOrDefault<double>(
                            widget.radii?.toDouble(),
                            0.0,
                          )),
                        ),
                      ).animateOnPageLoad(
                          animationsMap['containerOnPageLoadAnimation11']!),
                    ),
                  ),
                if (widget.itemsQty > 3)
                  Expanded(
                    flex: 1,
                    child: Opacity(
                      opacity: 0.6,
                      child: Container(
                        height: widget.height,
                        decoration: BoxDecoration(
                          color: FlutterFlowTheme.of(context).grayAlpha,
                          borderRadius:
                              BorderRadius.circular(valueOrDefault<double>(
                            widget.radii?.toDouble(),
                            0.0,
                          )),
                        ),
                      ).animateOnPageLoad(
                          animationsMap['containerOnPageLoadAnimation12']!),
                    ),
                  ),
              ].divide(SizedBox(width: 16.0)),
            ),
          ),
        ),
      ],
    ).animateOnPageLoad(animationsMap['columnOnPageLoadAnimation']!);
  }
}
