import '/auth/supabase_auth/auth_util.dart';
import '/backend/supabase/supabase.dart';
import '/components/avatar_widget.dart';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:just_audio/just_audio.dart';
import 'my_invites_model.dart';
export 'my_invites_model.dart';

class MyInvitesWidget extends StatefulWidget {
  const MyInvitesWidget({
    super.key,
    bool? isLogged,
    required this.username,
    String? role,
    int? franchiseZone,
    required this.userMail,
    String? userPhone,
    String? invitedBy,
    this.createdAt,
    String? id,
    bool? isExpired,
    required this.deleteItem,
  })  : this.isLogged = isLogged ?? false,
        this.role = role ?? 'Оператор',
        this.franchiseZone = franchiseZone ?? 0,
        this.userPhone = userPhone ?? '-',
        this.invitedBy = invitedBy ?? 'admin',
        this.id = id ?? '0000',
        this.isExpired = isExpired ?? false;

  final bool isLogged;
  final String? username;
  final String role;
  final int franchiseZone;
  final String? userMail;
  final String userPhone;
  final String invitedBy;
  final DateTime? createdAt;
  final String id;
  final bool isExpired;
  final Future Function(bool hasDeleteRow)? deleteItem;

  @override
  State<MyInvitesWidget> createState() => _MyInvitesWidgetState();
}

class _MyInvitesWidgetState extends State<MyInvitesWidget> {
  late MyInvitesModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => MyInvitesModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Visibility(
      visible: !_model.setHidden,
      child: Opacity(
        opacity: widget.isLogged ? 1.0 : 0.85,
        child: Padding(
          padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 1.0),
          child: Container(
            decoration: BoxDecoration(
              color: () {
                if (widget.isLogged) {
                  return FlutterFlowTheme.of(context).secondaryBackground;
                } else if (widget.isExpired) {
                  return Color(0x20FFA0A9);
                } else {
                  return FlutterFlowTheme.of(context).primaryBackground;
                }
              }(),
              boxShadow: [
                BoxShadow(
                  blurRadius: 0.0,
                  color: FlutterFlowTheme.of(context).accent4,
                  offset: Offset(
                    0.0,
                    1.0,
                  ),
                )
              ],
            ),
            child: Padding(
              padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 0.0),
              child: InkWell(
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
                      ScaffoldMessenger.of(context).clearSnackBars();
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            'Инвайт скопирован!',
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
                              FlutterFlowTheme.of(context).primaryText,
                        ),
                      );
                    }),
                    Future(() async {
                      await Clipboard.setData(ClipboardData(text: widget.id));
                    }),
                  ]);
                },
                child: Row(
                  mainAxisSize: MainAxisSize.max,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      flex: () {
                        if (MediaQuery.sizeOf(context).width <
                            kBreakpointSmall) {
                          return 6;
                        } else if (MediaQuery.sizeOf(context).width <
                            kBreakpointMedium) {
                          return 3;
                        } else if (MediaQuery.sizeOf(context).width <
                            kBreakpointLarge) {
                          return 3;
                        } else {
                          return 3;
                        }
                      }(),
                      child: Container(
                        decoration: BoxDecoration(),
                        child: Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              0.0, 8.0, 12.0, 8.0),
                          child: Row(
                            mainAxisSize: MainAxisSize.max,
                            children: [
                              Container(
                                width: 40.0,
                                decoration: BoxDecoration(),
                                child: Visibility(
                                  visible: valueOrDefault<bool>(
                                    widget.isLogged == true,
                                    false,
                                  ),
                                  child: wrapWithModel(
                                    model: _model.avatarModel,
                                    updateCallback: () => safeSetState(() {}),
                                    child: AvatarWidget(
                                      userRole: widget.role,
                                      userID: valueOrDefault<String>(
                                        widget.id,
                                        '00001',
                                      ),
                                      size: 40,
                                    ),
                                  ),
                                ),
                              ),
                              Expanded(
                                child: Padding(
                                  padding: EdgeInsetsDirectional.fromSTEB(
                                      4.0, 0.0, 0.0, 0.0),
                                  child: Column(
                                    mainAxisSize: MainAxisSize.max,
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        valueOrDefault<String>(
                                          widget.username,
                                          'Александр Иванченкович',
                                        ),
                                        style: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Montserrat',
                                              letterSpacing: 0.0,
                                              fontWeight: FontWeight.bold,
                                            ),
                                      ),
                                      Padding(
                                        padding: EdgeInsetsDirectional.fromSTEB(
                                            0.0, 4.0, 0.0, 0.0),
                                        child: Text(
                                          valueOrDefault<String>(
                                            widget.role,
                                            'оператор',
                                          ),
                                          style: FlutterFlowTheme.of(context)
                                              .bodySmall
                                              .override(
                                                fontFamily: 'Montserrat',
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .tertiaryText,
                                                letterSpacing: 0.0,
                                              ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ].divide(SizedBox(width: 4.0)),
                          ),
                        ),
                      ),
                    ),
                    Flexible(
                      flex: 1,
                      child: Container(
                        width: 48.0,
                        decoration: BoxDecoration(),
                        child: Text(
                          valueOrDefault<String>(
                            widget.franchiseZone.toString(),
                            '0',
                          ),
                          style:
                              FlutterFlowTheme.of(context).bodySmall.override(
                                    fontFamily: 'Montserrat',
                                    fontSize: 14.0,
                                    letterSpacing: 0.0,
                                  ),
                        ),
                      ),
                    ),
                    if (responsiveVisibility(
                      context: context,
                      phone: false,
                    ))
                      Expanded(
                        flex: 3,
                        child: Container(
                          decoration: BoxDecoration(),
                          child: Visibility(
                            visible: responsiveVisibility(
                              context: context,
                              phone: false,
                            ),
                            child: Text(
                              valueOrDefault<String>(
                                widget.userMail,
                                'mail@mail.com',
                              ),
                              style: FlutterFlowTheme.of(context)
                                  .bodySmall
                                  .override(
                                    fontFamily: 'Montserrat',
                                    color: FlutterFlowTheme.of(context).primary,
                                    fontSize: 14.0,
                                    letterSpacing: 0.0,
                                  ),
                            ),
                          ),
                        ),
                      ),
                    if (responsiveVisibility(
                      context: context,
                      phone: false,
                    ))
                      Expanded(
                        flex: 2,
                        child: Container(
                          decoration: BoxDecoration(),
                          child: Visibility(
                            visible: responsiveVisibility(
                              context: context,
                              phone: false,
                            ),
                            child: Text(
                              valueOrDefault<String>(
                                widget.userPhone,
                                '+7 (111) 222-33-44',
                              ),
                              style: FlutterFlowTheme.of(context)
                                  .bodySmall
                                  .override(
                                    fontFamily: 'Montserrat',
                                    fontSize: 14.0,
                                    letterSpacing: 0.0,
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
                      Expanded(
                        flex: 3,
                        child: Container(
                          decoration: BoxDecoration(),
                          child: Visibility(
                            visible: responsiveVisibility(
                              context: context,
                              phone: false,
                              tablet: false,
                            ),
                            child: Text(
                              valueOrDefault<String>(
                                widget.invitedBy,
                                'superadmin@gmail.com',
                              ),
                              textAlign: TextAlign.end,
                              maxLines: 2,
                              style: FlutterFlowTheme.of(context)
                                  .bodySmall
                                  .override(
                                    fontFamily: 'Montserrat',
                                    fontSize: 14.0,
                                    letterSpacing: 0.0,
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
                      Expanded(
                        flex: 2,
                        child: Align(
                          alignment: AlignmentDirectional(1.0, 0.0),
                          child: Container(
                            decoration: BoxDecoration(),
                            child: Visibility(
                              visible: responsiveVisibility(
                                context: context,
                                phone: false,
                              ),
                              child: Padding(
                                padding: EdgeInsetsDirectional.fromSTEB(
                                    12.0, 0.0, 0.0, 0.0),
                                child: Text(
                                  valueOrDefault<String>(
                                    dateTimeFormat(
                                      "d/M/y",
                                      widget.createdAt,
                                      locale: FFLocalizations.of(context)
                                          .languageCode,
                                    ),
                                    '31/12/2000',
                                  ),
                                  textAlign: TextAlign.end,
                                  style: FlutterFlowTheme.of(context)
                                      .bodyMedium
                                      .override(
                                        fontFamily: 'Montserrat',
                                        letterSpacing: 0.0,
                                      ),
                                ),
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
                      Flexible(
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              width: 48.0,
                              height: 48.0,
                              decoration: BoxDecoration(),
                              child: Visibility(
                                visible: widget.invitedBy == currentUserEmail,
                                child: FlutterFlowIconButton(
                                  borderRadius: 16.0,
                                  borderWidth: 1.0,
                                  buttonSize: 48.0,
                                  hoverColor:
                                      FlutterFlowTheme.of(context).accent1,
                                  hoverIconColor:
                                      FlutterFlowTheme.of(context).primaryText,
                                  icon: FaIcon(
                                    FontAwesomeIcons.trashAlt,
                                    color:
                                        FlutterFlowTheme.of(context).alternate,
                                    size: 24.0,
                                  ),
                                  onPressed: () async {
                                    _model.deleteRow =
                                        await InvitesTable().delete(
                                      matchingRows: (rows) => rows.eqOrNull(
                                        'inviteID',
                                        widget.id,
                                      ),
                                      returnRows: true,
                                    );
                                    await Future.delayed(
                                        const Duration(milliseconds: 200));
                                    await widget.deleteItem?.call(
                                      true,
                                    );
                                    _model.setHidden = true;
                                    _model.updatePage(() {});

                                    safeSetState(() {});
                                  },
                                ),
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
        ),
      ),
    );
  }
}
