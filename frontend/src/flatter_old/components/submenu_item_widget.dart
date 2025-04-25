import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'submenu_item_model.dart';
export 'submenu_item_model.dart';

class SubmenuItemWidget extends StatefulWidget {
  const SubmenuItemWidget({
    super.key,
    String? tittle,
  }) : this.tittle = tittle ?? 'itemTittle';

  final String tittle;

  @override
  State<SubmenuItemWidget> createState() => _SubmenuItemWidgetState();
}

class _SubmenuItemWidgetState extends State<SubmenuItemWidget> {
  late SubmenuItemModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => SubmenuItemModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      opaque: false,
      cursor: MouseCursor.defer ?? MouseCursor.defer,
      child: Padding(
        padding: EdgeInsetsDirectional.fromSTEB(0.0, 8.0, 0.0, 8.0),
        child: Container(
          height: 32.0,
          decoration: BoxDecoration(
            color: FlutterFlowTheme.of(context).primaryBackground,
            borderRadius: BorderRadius.circular(12.0),
          ),
          alignment: AlignmentDirectional(0.0, 0.0),
          child: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(12.0, 4.0, 12.0, 4.0),
            child: Text(
              widget.tittle,
              style: FlutterFlowTheme.of(context).bodyMedium.override(
                    fontFamily: 'Montserrat',
                    color: _model.hower
                        ? FlutterFlowTheme.of(context).primary
                        : FlutterFlowTheme.of(context).secondaryText,
                    letterSpacing: 0.0,
                  ),
            ),
          ),
        ),
      ),
      onEnter: ((event) async {
        safeSetState(() => _model.mouseRegionHovered = true);
        _model.hower = true;
        safeSetState(() {});
      }),
      onExit: ((event) async {
        safeSetState(() => _model.mouseRegionHovered = false);
        _model.hower = false;
        safeSetState(() {});
      }),
    );
  }
}
