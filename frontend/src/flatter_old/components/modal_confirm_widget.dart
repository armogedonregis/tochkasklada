import '/backend/schema/enums/enums.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'modal_confirm_model.dart';
export 'modal_confirm_model.dart';

class ModalConfirmWidget extends StatefulWidget {
  const ModalConfirmWidget({
    super.key,
    required this.confirmation,
    required this.tittle,
    required this.content,
    String? cancelText,
    String? mainActiontext,
  })  : this.cancelText = cancelText ?? 'Отмена',
        this.mainActiontext = mainActiontext ?? 'ОК';

  final Future Function(bool isConfirmed)? confirmation;
  final String? tittle;
  final String? content;
  final String cancelText;
  final String mainActiontext;

  @override
  State<ModalConfirmWidget> createState() => _ModalConfirmWidgetState();
}

class _ModalConfirmWidgetState extends State<ModalConfirmWidget> {
  late ModalConfirmModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => ModalConfirmModel());

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

    return Align(
      alignment: AlignmentDirectional(0.0, 0.0),
      child: Padding(
        padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 16.0),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(12.0),
          child: Container(
            width: double.infinity,
            constraints: BoxConstraints(
              minHeight: 100.0,
              maxWidth: 570.0,
            ),
            decoration: BoxDecoration(
              color: FlutterFlowTheme.of(context).secondaryBackground,
              borderRadius: BorderRadius.circular(12.0),
              border: Border.all(
                color: FlutterFlowTheme.of(context).accent4,
              ),
            ),
            child: Padding(
              padding: EdgeInsets.all(24.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 12.0, 0.0),
                    child: Text(
                      valueOrDefault<String>(
                        widget.tittle,
                        'Текст модалки',
                      ),
                      style:
                          FlutterFlowTheme.of(context).headlineMedium.override(
                                fontFamily: 'Montserrat',
                                letterSpacing: 0.0,
                              ),
                    ),
                  ),
                  Divider(
                    height: 24.0,
                    thickness: 2.0,
                    color: FlutterFlowTheme.of(context).primaryBackground,
                  ),
                  Text(
                    valueOrDefault<String>(
                      widget.content,
                      'Вы точно хотите совершить это действие???',
                    ),
                    style: FlutterFlowTheme.of(context).labelMedium.override(
                          fontFamily: 'Montserrat',
                          letterSpacing: 0.0,
                        ),
                  ),
                  Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(0.0, 16.0, 0.0, 0.0),
                    child: Row(
                      mainAxisSize: MainAxisSize.max,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Align(
                          alignment: AlignmentDirectional(0.0, 0.0),
                          child: FFButtonWidget(
                            onPressed: () async {
                              await widget.confirmation?.call(
                                false,
                              );
                            },
                            text: valueOrDefault<String>(
                              widget.cancelText,
                              'Отмена',
                            ),
                            options: FFButtonOptions(
                              height: 48.0,
                              padding: EdgeInsetsDirectional.fromSTEB(
                                  16.0, 4.0, 16.0, 4.0),
                              iconPadding: EdgeInsetsDirectional.fromSTEB(
                                  0.0, 0.0, 0.0, 0.0),
                              color: Colors.transparent,
                              textStyle: FlutterFlowTheme.of(context)
                                  .bodyLarge
                                  .override(
                                    fontFamily: 'Montserrat',
                                    color: FlutterFlowTheme.of(context)
                                        .secondaryText,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.w600,
                                  ),
                              elevation: 0.0,
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context).alternate,
                                width: 1.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                          ),
                        ),
                        Align(
                          alignment: AlignmentDirectional(0.0, 0.0),
                          child: FFButtonWidget(
                            onPressed: !FFAppState()
                                    .permLevel
                                    .contains(PermLevel.franchise)
                                ? null
                                : () async {
                                    await widget.confirmation?.call(
                                      true,
                                    );
                                  },
                            text: valueOrDefault<String>(
                              widget.mainActiontext,
                              'ОК',
                            ),
                            options: FFButtonOptions(
                              width: 130.0,
                              height: 48.0,
                              padding: EdgeInsetsDirectional.fromSTEB(
                                  0.0, 0.0, 0.0, 0.0),
                              iconPadding: EdgeInsetsDirectional.fromSTEB(
                                  0.0, 0.0, 0.0, 0.0),
                              color: FlutterFlowTheme.of(context).primary,
                              textStyle: FlutterFlowTheme.of(context)
                                  .labelLarge
                                  .override(
                                    fontFamily: 'Montserrat',
                                    color: FlutterFlowTheme.of(context).info,
                                    fontSize: 16.0,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.w600,
                                  ),
                              elevation: 1.0,
                              borderSide: BorderSide(
                                color: Colors.transparent,
                                width: 1.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                              disabledColor:
                                  FlutterFlowTheme.of(context).alternate,
                            ),
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
      ),
    );
  }
}
