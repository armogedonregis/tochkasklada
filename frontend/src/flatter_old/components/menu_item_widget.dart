import '/backend/schema/enums/enums.dart';
import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import 'menu_item_model.dart';
export 'menu_item_model.dart';

class MenuItemWidget extends StatefulWidget {
  const MenuItemWidget({
    super.key,
    required this.icon,
    String? pageName,
    int? newItems,
    required this.page,
    required this.iconActive,
    bool? goto,
  })  : this.pageName = pageName ?? 'pageName',
        this.newItems = newItems ?? 0,
        this.goto = goto ?? false;

  final Widget? icon;
  final String pageName;
  final int newItems;
  final Pages? page;
  final Widget? iconActive;
  final bool goto;

  @override
  State<MenuItemWidget> createState() => _MenuItemWidgetState();
}

class _MenuItemWidgetState extends State<MenuItemWidget>
    with TickerProviderStateMixin {
  late MenuItemModel _model;

  final animationsMap = <String, AnimationInfo>{};

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => MenuItemModel());

    animationsMap.addAll({
      'textOnPageLoadAnimation': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.easeInOut,
            delay: 0.0.ms,
            duration: 320.0.ms,
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
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    context.watch<FFAppState>();

    return MouseRegion(
      opaque: true,
      cursor: MouseCursor.defer ?? MouseCursor.defer,
      child: Padding(
        padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 0.0),
        child: AnimatedContainer(
          duration: Duration(milliseconds: 360),
          curve: Curves.easeInOut,
          width: double.infinity,
          height: 44.0,
          decoration: BoxDecoration(
            color: FFAppState().currentPage == widget.page
                ? FlutterFlowTheme.of(context).secondaryBackground
                : Color(0x00000000),
            borderRadius: BorderRadius.circular(16.0),
          ),
          child: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(8.0, 0.0, 6.0, 0.0),
            child: Row(
              mainAxisSize: MainAxisSize.max,
              children: [
                Align(
                  alignment: AlignmentDirectional(0.0, 0.0),
                  child: Container(
                    width: 28.0,
                    height: 28.0,
                    decoration: BoxDecoration(),
                    alignment: AlignmentDirectional(0.0, 0.0),
                    child: Stack(
                      children: [
                        if (_model.isHower ||
                            (widget.page == FFAppState().currentPage))
                          widget.iconActive!,
                        if (!(_model.isHower ||
                            (widget.page == FFAppState().currentPage)))
                          widget.icon!,
                      ],
                    ),
                  ),
                ),
                if (FFAppState().isNavOpened)
                  Expanded(
                    child: Padding(
                      padding:
                          EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 0.0, 0.0),
                      child: Text(
                        widget.pageName,
                        style: FlutterFlowTheme.of(context).bodyMedium.override(
                              fontFamily: 'Montserrat',
                              color: valueOrDefault<Color>(
                                _model.isHower
                                    ? FlutterFlowTheme.of(context).primary
                                    : FlutterFlowTheme.of(context).primaryText,
                                FlutterFlowTheme.of(context).primaryText,
                              ),
                              letterSpacing: 0.0,
                            ),
                      ).animateOnPageLoad(
                          animationsMap['textOnPageLoadAnimation']!),
                    ),
                  ),
                if (FFAppState().isNavOpened && (widget.newItems >= 1))
                  Container(
                    height: 32.0,
                    constraints: BoxConstraints(
                      minWidth: 32.0,
                    ),
                    decoration: BoxDecoration(
                      color: FlutterFlowTheme.of(context).secondary,
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                    child: Align(
                      alignment: AlignmentDirectional(0.0, 0.0),
                      child: Padding(
                        padding:
                            EdgeInsetsDirectional.fromSTEB(8.0, 4.0, 8.0, 4.0),
                        child: Text(
                          valueOrDefault<String>(
                            widget.newItems.toString(),
                            '0',
                          ),
                          style:
                              FlutterFlowTheme.of(context).bodyMedium.override(
                                    fontFamily: 'Montserrat',
                                    color: FlutterFlowTheme.of(context)
                                        .primaryBackground,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.w600,
                                  ),
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
      onEnter: ((event) async {
        safeSetState(() => _model.mouseRegionHovered = true);
        _model.isHower = true;
        safeSetState(() {});
      }),
      onExit: ((event) async {
        safeSetState(() => _model.mouseRegionHovered = false);
        _model.isHower = false;
        safeSetState(() {});
      }),
    );
  }
}
