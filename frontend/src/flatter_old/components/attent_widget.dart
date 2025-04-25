import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'attent_model.dart';
export 'attent_model.dart';

class AttentWidget extends StatefulWidget {
  const AttentWidget({
    super.key,
    String? text,
  }) : this.text = text ?? 'attention';

  final String text;

  @override
  State<AttentWidget> createState() => _AttentWidgetState();
}

class _AttentWidgetState extends State<AttentWidget> {
  late AttentModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => AttentModel());

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
      padding: EdgeInsetsDirectional.fromSTEB(0.0, 16.0, 0.0, 0.0),
      child: SafeArea(
        child: AnimatedContainer(
          duration: Duration(milliseconds: 180),
          curve: Curves.easeInOut,
          width: MediaQuery.sizeOf(context).width * 1.0,
          constraints: BoxConstraints(
            minHeight: 48.0,
            maxWidth: 370.0,
            maxHeight: 160.0,
          ),
          decoration: BoxDecoration(
            color: FlutterFlowTheme.of(context).attentionBG,
            borderRadius: BorderRadius.circular(16.0),
            border: Border.all(
              color: FlutterFlowTheme.of(context).warning,
            ),
          ),
          alignment: AlignmentDirectional(0.0, 0.0),
          child: Padding(
            padding: EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 24.0, 0.0),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Align(
                  alignment: AlignmentDirectional(-1.0, 0.0),
                  child: Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(24.0, 0.0, 0.0, 0.0),
                    child: Icon(
                      Icons.warning_amber_rounded,
                      color: FlutterFlowTheme.of(context).warning,
                      size: 24.0,
                    ),
                  ),
                ),
                Flexible(
                  child: Align(
                    alignment: AlignmentDirectional(-1.0, 0.0),
                    child: SelectionArea(
                        child: AutoSizeText(
                      valueOrDefault<String>(
                        widget.text,
                        'The changes will only take effect once the new mail is confirmed',
                      ),
                      textAlign: TextAlign.start,
                      maxLines: 4,
                      minFontSize: 12.0,
                      style: FlutterFlowTheme.of(context).bodyMedium.override(
                            fontFamily: 'Montserrat',
                            color: FlutterFlowTheme.of(context).warning,
                            letterSpacing: 0.0,
                          ),
                    )),
                  ),
                ),
              ].divide(SizedBox(width: 16.0)),
            ),
          ),
        ),
      ),
    );
  }
}
