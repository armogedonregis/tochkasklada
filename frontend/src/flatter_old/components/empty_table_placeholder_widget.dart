import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'empty_table_placeholder_model.dart';
export 'empty_table_placeholder_model.dart';

class EmptyTablePlaceholderWidget extends StatefulWidget {
  const EmptyTablePlaceholderWidget({
    super.key,
    String? placeholderText,
  }) : this.placeholderText = placeholderText ?? 'Нет данных';

  final String placeholderText;

  @override
  State<EmptyTablePlaceholderWidget> createState() =>
      _EmptyTablePlaceholderWidgetState();
}

class _EmptyTablePlaceholderWidgetState
    extends State<EmptyTablePlaceholderWidget> {
  late EmptyTablePlaceholderModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => EmptyTablePlaceholderModel());

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
      padding: EdgeInsetsDirectional.fromSTEB(16.0, 48.0, 16.0, 48.0),
      child: Row(
        mainAxisSize: MainAxisSize.max,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Expanded(
            child: Align(
              alignment: AlignmentDirectional(0.0, 0.0),
              child: Padding(
                padding: EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 16.0, 0.0),
                child: Text(
                  valueOrDefault<String>(
                    widget.placeholderText,
                    'нет данных',
                  ),
                  style: FlutterFlowTheme.of(context).bodySmall.override(
                        fontFamily: 'Montserrat',
                        color: FlutterFlowTheme.of(context).tertiaryText,
                        letterSpacing: 0.0,
                      ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
