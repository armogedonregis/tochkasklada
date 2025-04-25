import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:just_audio/just_audio.dart';
import 'modal_invite_model.dart';
export 'modal_invite_model.dart';

class ModalInviteWidget extends StatefulWidget {
  const ModalInviteWidget({
    super.key,
    required this.inviteLink,
  });

  final String? inviteLink;

  @override
  State<ModalInviteWidget> createState() => _ModalInviteWidgetState();
}

class _ModalInviteWidgetState extends State<ModalInviteWidget> {
  late ModalInviteModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => ModalInviteModel());

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
      alignment: AlignmentDirectional(0.0, 0.0),
      child: Padding(
        padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 16.0),
        child: Container(
          width: double.infinity,
          constraints: BoxConstraints(
            maxWidth: 570.0,
          ),
          decoration: BoxDecoration(
            color: FlutterFlowTheme.of(context).secondaryBackground,
            borderRadius: BorderRadius.circular(12.0),
            border: Border.all(
              color: Color(0xFFE0E3E7),
            ),
          ),
          child: Padding(
            padding: EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisSize: MainAxisSize.max,
                  children: [
                    Expanded(
                      child: Padding(
                        padding:
                            EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 12.0, 0.0),
                        child: Text(
                          FFLocalizations.of(context).getText(
                            'qyo7gbu1' /* Ссылка для нового сотрудника */,
                          ),
                          style: FlutterFlowTheme.of(context)
                              .headlineMedium
                              .override(
                                fontFamily: 'Montserrat',
                                letterSpacing: 0.0,
                              ),
                        ),
                      ),
                    ),
                    FlutterFlowIconButton(
                      borderColor:
                          FlutterFlowTheme.of(context).primaryBackground,
                      borderRadius: 30.0,
                      borderWidth: 2.0,
                      buttonSize: 44.0,
                      icon: Icon(
                        Icons.close_rounded,
                        color: FlutterFlowTheme.of(context).secondaryText,
                        size: 24.0,
                      ),
                      onPressed: () async {
                        Navigator.pop(context);
                      },
                    ),
                  ],
                ),
                Divider(
                  height: 24.0,
                  thickness: 2.0,
                  color: FlutterFlowTheme.of(context).primaryBackground,
                ),
                Text(
                  FFLocalizations.of(context).getText(
                    'iqi7lqwk' /* Это действие пока не автоматиз... */,
                  ),
                  style: FlutterFlowTheme.of(context).labelMedium.override(
                        fontFamily: 'Montserrat',
                        letterSpacing: 0.0,
                      ),
                ),
                Container(
                  decoration: BoxDecoration(
                    color: FlutterFlowTheme.of(context).accent3,
                    borderRadius: BorderRadius.circular(16.0),
                  ),
                  child: Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(16.0, 16.0, 16.0, 16.0),
                    child: Row(
                      mainAxisSize: MainAxisSize.max,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Flexible(
                          child: Align(
                            alignment: AlignmentDirectional(-1.0, 0.0),
                            child: AutoSizeText(
                              valueOrDefault<String>(
                                widget.inviteLink,
                                'упс, кажется ошибка',
                              ),
                              textAlign: TextAlign.start,
                              maxLines: 2,
                              style: FlutterFlowTheme.of(context)
                                  .labelMedium
                                  .override(
                                    fontFamily: 'Montserrat',
                                    color: FlutterFlowTheme.of(context).success,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.w600,
                                  ),
                            ),
                          ),
                        ),
                        FlutterFlowIconButton(
                          borderRadius: 16.0,
                          borderWidth: 1.0,
                          buttonSize: 48.0,
                          fillColor: FlutterFlowTheme.of(context).accent3,
                          hoverColor: FlutterFlowTheme.of(context).accent1,
                          hoverIconColor:
                              FlutterFlowTheme.of(context).secondaryBackground,
                          icon: FaIcon(
                            FontAwesomeIcons.copy,
                            color: FlutterFlowTheme.of(context).success,
                            size: 24.0,
                          ),
                          onPressed: () async {
                            await Future.wait([
                              Future(() async {
                                HapticFeedback.lightImpact();
                              }),
                              Future(() async {
                                _model.soundPlayer ??= AudioPlayer();
                                if (_model.soundPlayer!.playing) {
                                  await _model.soundPlayer!.stop();
                                }
                                _model.soundPlayer!.setVolume(0.59);
                                _model.soundPlayer!
                                    .setAsset(
                                        'assets/audios/Tick-DeepFrozenApps-397275646.mp3')
                                    .then((_) => _model.soundPlayer!.play());
                              }),
                              Future(() async {
                                await Clipboard.setData(
                                    ClipboardData(text: widget.inviteLink!));
                              }),
                            ]);
                          },
                        ),
                      ].divide(SizedBox(width: 8.0)),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
