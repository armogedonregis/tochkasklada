import '/backend/supabase/supabase.dart';
import '/components/avatar_widget.dart';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import 'user_table_row_model.dart';
export 'user_table_row_model.dart';

class UserTableRowWidget extends StatefulWidget {
  const UserTableRowWidget({
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
    this.avaatarPatch,
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
  final String? avaatarPatch;

  @override
  State<UserTableRowWidget> createState() => _UserTableRowWidgetState();
}

class _UserTableRowWidgetState extends State<UserTableRowWidget> {
  late UserTableRowModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => UserTableRowModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      if (widget.avaatarPatch != null && widget.avaatarPatch != '') {
        _model.avatarPatchOther = widget.avaatarPatch;
        safeSetState(() {});
      } else {
        _model.defAvatar = await RolesListTable().queryRows(
          queryFn: (q) => q.eqOrNull(
            'rolesRu',
            widget.role,
          ),
        );
        _model.avatarPatchOther = _model.defAvatar
            ?.sortedList(keyOf: (e) => e.defaultAvatarPatch!, desc: false)
            .firstOrNull
            ?.defaultAvatarPatch;
        safeSetState(() {});
      }
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

    return Padding(
      padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 1.0),
      child: Container(
        decoration: BoxDecoration(
          color: FlutterFlowTheme.of(context).secondaryBackground,
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
          child: Row(
            mainAxisSize: MainAxisSize.max,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                flex: () {
                  if (MediaQuery.sizeOf(context).width < kBreakpointSmall) {
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
                    padding:
                        EdgeInsetsDirectional.fromSTEB(0.0, 8.0, 12.0, 8.0),
                    child: Row(
                      mainAxisSize: MainAxisSize.max,
                      children: [
                        if (valueOrDefault<bool>(
                          widget.isLogged == true,
                          false,
                        ))
                          wrapWithModel(
                            model: _model.avatarModel,
                            updateCallback: () => safeSetState(() {}),
                            child: AvatarWidget(
                              userRole: widget.role,
                              userID: valueOrDefault<String>(
                                widget.id,
                                '00001',
                              ),
                              size: 40,
                              avatarPatch: _model.avatarPatchOther,
                            ),
                          ),
                        Expanded(
                          child: Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(
                                4.0, 0.0, 0.0, 0.0),
                            child: Column(
                              mainAxisSize: MainAxisSize.max,
                              mainAxisAlignment: MainAxisAlignment.center,
                              crossAxisAlignment: CrossAxisAlignment.start,
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
                                          color: FlutterFlowTheme.of(context)
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
                    style: FlutterFlowTheme.of(context).bodySmall.override(
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
                        style: FlutterFlowTheme.of(context).bodySmall.override(
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
                        style: FlutterFlowTheme.of(context).bodySmall.override(
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
                        style: FlutterFlowTheme.of(context).bodySmall.override(
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
                                locale:
                                    FFLocalizations.of(context).languageCode,
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
                        child: FlutterFlowIconButton(
                          borderRadius: 16.0,
                          borderWidth: 1.0,
                          buttonSize: 48.0,
                          disabledColor:
                              FlutterFlowTheme.of(context).primaryBackground,
                          disabledIconColor:
                              FlutterFlowTheme.of(context).secondaryBackground,
                          hoverColor: FlutterFlowTheme.of(context).accent1,
                          hoverIconColor:
                              FlutterFlowTheme.of(context).primaryText,
                          icon: FaIcon(
                            FontAwesomeIcons.trashAlt,
                            color: FlutterFlowTheme.of(context).alternate,
                            size: 24.0,
                          ),
                          onPressed: (((widget.franchiseZone !=
                                          FFAppState().franchisee) &&
                                      (widget.role == 'Франчайзи')) ||
                                  (widget.role == 'Франчайзер') ||
                                  (widget.role == 'Администратор'))
                              ? null
                              : () async {
                                  _model.deleteRow =
                                      await UsersByRolesTable().delete(
                                    matchingRows: (rows) => rows.eqOrNull(
                                      'email',
                                      widget.userMail,
                                    ),
                                    returnRows: true,
                                  );

                                  safeSetState(() {});

                                  safeSetState(() {});
                                },
                        ),
                      ),
                    ],
                  ),
                ),
            ].divide(SizedBox(width: 12.0)),
          ),
        ),
      ),
    );
  }
}
