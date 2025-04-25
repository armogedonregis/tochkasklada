import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'tittle_with_icon_and_subtittle_model.dart';
export 'tittle_with_icon_and_subtittle_model.dart';

class TittleWithIconAndSubtittleWidget extends StatefulWidget {
  const TittleWithIconAndSubtittleWidget({
    super.key,
    String? tittle,
    String? subtittle,
    bool? hasIcon,
    bool? hasSubtittle,
    int? margin,
  })  : this.tittle = tittle ?? 'Tittle',
        this.subtittle = subtittle ?? 'Subtittle',
        this.hasIcon = hasIcon ?? true,
        this.hasSubtittle = hasSubtittle ?? true,
        this.margin = margin ?? 36;

  final String tittle;
  final String subtittle;
  final bool hasIcon;
  final bool hasSubtittle;
  final int margin;

  @override
  State<TittleWithIconAndSubtittleWidget> createState() =>
      _TittleWithIconAndSubtittleWidgetState();
}

class _TittleWithIconAndSubtittleWidgetState
    extends State<TittleWithIconAndSubtittleWidget> {
  late TittleWithIconAndSubtittleModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => TittleWithIconAndSubtittleModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: AlignmentDirectional(-1.0, 0.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: EdgeInsetsDirectional.fromSTEB(
                0.0,
                valueOrDefault<double>(
                  widget.margin.toDouble(),
                  0.0,
                ),
                0.0,
                0.0),
            child: Row(
              mainAxisSize: MainAxisSize.max,
              children: [
                Text(
                  widget.tittle,
                  style: FlutterFlowTheme.of(context).headlineSmall.override(
                        fontFamily: 'Tochka',
                        letterSpacing: 0.0,
                        useGoogleFonts: false,
                      ),
                ),
                if (widget.hasIcon)
                  FlutterFlowIconButton(
                    borderRadius: 16.0,
                    borderWidth: 1.0,
                    buttonSize: 40.0,
                    icon: FaIcon(
                      FontAwesomeIcons.questionCircle,
                      color: FlutterFlowTheme.of(context).tertiaryText,
                      size: 22.0,
                    ),
                    onPressed: () {
                      print('IconButton pressed ...');
                    },
                  ),
              ],
            ),
          ),
          if (widget.hasSubtittle)
            Text(
              widget.subtittle,
              textAlign: TextAlign.start,
              style: FlutterFlowTheme.of(context).bodyMedium.override(
                    fontFamily: 'Montserrat',
                    color: FlutterFlowTheme.of(context).tertiaryText,
                    letterSpacing: 0.0,
                  ),
            ),
        ],
      ),
    );
  }
}
