import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'loc_card_cell_info_model.dart';
export 'loc_card_cell_info_model.dart';

class LocCardCellInfoWidget extends StatefulWidget {
  const LocCardCellInfoWidget({
    super.key,
    String? size,
    int? availableCells,
    int? totalCells,
  })  : this.size = size ?? 'M',
        this.availableCells = availableCells ?? 0,
        this.totalCells = totalCells ?? 0;

  final String size;
  final int availableCells;
  final int totalCells;

  @override
  State<LocCardCellInfoWidget> createState() => _LocCardCellInfoWidgetState();
}

class _LocCardCellInfoWidgetState extends State<LocCardCellInfoWidget> {
  late LocCardCellInfoModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => LocCardCellInfoModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 36.0,
      decoration: BoxDecoration(
        color: FlutterFlowTheme.of(context).secondaryBackground,
        borderRadius: BorderRadius.circular(10.0),
      ),
      alignment: AlignmentDirectional(0.0, 0.0),
      child: Padding(
        padding: EdgeInsetsDirectional.fromSTEB(10.0, 2.0, 10.0, 2.0),
        child: Row(
          mainAxisSize: MainAxisSize.max,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            AutoSizeText(
              valueOrDefault<String>(
                widget.size,
                'M',
              ),
              style: FlutterFlowTheme.of(context).titleLarge.override(
                    fontFamily: 'Roboto',
                    letterSpacing: 0.0,
                    fontWeight: FontWeight.w900,
                  ),
            ),
            Align(
              alignment: AlignmentDirectional(0.0, 0.0),
              child: RichText(
                textScaler: MediaQuery.of(context).textScaler,
                text: TextSpan(
                  children: [
                    TextSpan(
                      text: valueOrDefault<String>(
                        widget.availableCells.toString(),
                        '0',
                      ),
                      style: FlutterFlowTheme.of(context).titleMedium.override(
                            fontFamily: 'Montserrat',
                            color: FlutterFlowTheme.of(context).success,
                            fontSize: 16.0,
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                    TextSpan(
                      text: FFLocalizations.of(context).getText(
                        'k2rfnuzv' /*  /  */,
                      ),
                      style: TextStyle(
                        color: FlutterFlowTheme.of(context).tertiaryText,
                      ),
                    ),
                    TextSpan(
                      text: valueOrDefault<String>(
                        widget.totalCells.toString(),
                        '0',
                      ),
                      style: TextStyle(
                        fontSize: 16.0,
                      ),
                    )
                  ],
                  style: FlutterFlowTheme.of(context).titleMedium.override(
                        fontFamily: 'Montserrat',
                        color: FlutterFlowTheme.of(context).tertiaryText,
                        fontSize: 12.0,
                        letterSpacing: 0.0,
                        fontWeight: FontWeight.w600,
                      ),
                ),
              ),
            ),
          ].divide(SizedBox(width: 8.0)),
        ),
      ),
    );
  }
}
