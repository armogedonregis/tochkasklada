import '/auth/supabase_auth/auth_util.dart';
import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/components/logo_widget.dart';
import '/components/my_avatar_widget.dart';
import '/components/nav_widget.dart';
import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_toggle_icon.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/custom_functions.dart' as functions;
import '/index.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import 'sidebar_model.dart';
export 'sidebar_model.dart';

class SidebarWidget extends StatefulWidget {
  const SidebarWidget({
    super.key,
    bool? isNavbarOpened,
    this.permissions,
  }) : this.isNavbarOpened = isNavbarOpened ?? true;

  final bool isNavbarOpened;
  final List<RolesAndPermissionsRow>? permissions;

  @override
  State<SidebarWidget> createState() => _SidebarWidgetState();
}

class _SidebarWidgetState extends State<SidebarWidget>
    with TickerProviderStateMixin {
  late SidebarModel _model;

  final animationsMap = <String, AnimationInfo>{};

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => SidebarModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.login = await UsersByRolesTable().queryRows(
        queryFn: (q) => q.eqOrNull(
          'created_by',
          currentUserUid,
        ),
      );
      FFAppState().uuid = currentUserUid;
      FFAppState().franchisee = _model.login!.firstOrNull!.franchiseZone!;
      FFAppState().userRole = _model.login!.firstOrNull!.roleName!;
      FFAppState().userPhone = _model.login!.firstOrNull!.phone!;
      FFAppState().username = _model.login!.firstOrNull!.username!;
      FFAppState().createdAt = _model.login?.firstOrNull?.createdAt;
      FFAppState().avatar = _model.login!.firstOrNull!.avatarPatch!;
      FFAppState().update(() {});
      FFAppState().roleID = valueOrDefault<String>(
        functions.setRoleID(FFAppState().userRole),
        'operator',
      );
      FFAppState().canViewAllFranchise = valueOrDefault<bool>(
        functions.canViewAll(FFAppState().roleID),
        false,
      );
      FFAppState().permLevel = functions
          .setPermLevel(FFAppState().roleID)!
          .toList()
          .cast<PermLevel>();
      FFAppState().update(() {});
      _model.updateEmailIandPermissions = await UsersByRolesTable().update(
        data: {
          'email': currentUserEmail,
          'app_permission_role': FFAppState().roleID,
        },
        matchingRows: (rows) => rows.eqOrNull(
          'created_by',
          currentUserUid,
        ),
        returnRows: true,
      );
    });

    animationsMap.addAll({
      'containerOnPageLoadAnimation': AnimationInfo(
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
      'containerOnActionTriggerAnimation': AnimationInfo(
        trigger: AnimationTrigger.onActionTrigger,
        applyInitialState: true,
        effectsBuilder: () => [
          MoveEffect(
            curve: Curves.easeInOut,
            delay: 0.0.ms,
            duration: 600.0.ms,
            begin: Offset(0.0, 0.0),
            end: Offset(115.0, 0.0),
          ),
        ],
      ),
      'textOnPageLoadAnimation1': AnimationInfo(
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
      'textOnPageLoadAnimation2': AnimationInfo(
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
      'textOnPageLoadAnimation3': AnimationInfo(
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
    setupAnimations(
      animationsMap.values.where((anim) =>
          anim.trigger == AnimationTrigger.onActionTrigger ||
          !anim.applyInitialState),
      this,
    );

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

    return Visibility(
      visible: responsiveVisibility(
        context: context,
        phone: false,
        tablet: false,
      ),
      child: AnimatedContainer(
        duration: Duration(milliseconds: 140),
        curve: Curves.easeInOut,
        width: FFAppState().isNavOpened ? 270.0 : 80.0,
        height: double.infinity,
        decoration: BoxDecoration(
          color: FlutterFlowTheme.of(context).primaryBackground,
          borderRadius: BorderRadius.circular(0.0),
          border: Border.all(
            color: FlutterFlowTheme.of(context).grayAlpha,
            width: 1.0,
          ),
        ),
        child: Padding(
          padding: EdgeInsetsDirectional.fromSTEB(0.0, 24.0, 0.0, 16.0),
          child: Column(
            mainAxisSize: MainAxisSize.max,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              wrapWithModel(
                model: _model.logoModel,
                updateCallback: () => safeSetState(() {}),
                child: LogoWidget(),
              ),
              Divider(
                height: 12.0,
                thickness: 1.0,
                color: FlutterFlowTheme.of(context).grayAlpha,
              ),
              Expanded(
                child: wrapWithModel(
                  model: _model.navModel,
                  updateCallback: () => safeSetState(() {}),
                  child: NavWidget(),
                ),
              ),
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(8.0, 0.0, 12.0, 8.0),
                child: Container(
                  width: double.infinity,
                  height: 44.0,
                  decoration: BoxDecoration(
                    color: FlutterFlowTheme.of(context).primaryBackground,
                    borderRadius: BorderRadius.circular(16.0),
                    border: Border.all(
                      color: FlutterFlowTheme.of(context).grayAlpha,
                      width: 1.0,
                    ),
                  ),
                  child: Padding(
                    padding: EdgeInsetsDirectional.fromSTEB(2.0, 2.0, 2.0, 2.0),
                    child: Row(
                      mainAxisSize: MainAxisSize.max,
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        Expanded(
                          child: InkWell(
                            splashColor: Colors.transparent,
                            focusColor: Colors.transparent,
                            hoverColor: Colors.transparent,
                            highlightColor: Colors.transparent,
                            onTap: () async {
                              setDarkModeSetting(context, ThemeMode.light);
                            },
                            child: Container(
                              width: double.infinity,
                              height: 100.0,
                              decoration: BoxDecoration(
                                color: Theme.of(context).brightness ==
                                        Brightness.light
                                    ? FlutterFlowTheme.of(context)
                                        .secondaryBackground
                                    : FlutterFlowTheme.of(context)
                                        .primaryBackground,
                                borderRadius: BorderRadius.only(
                                  bottomLeft: Radius.circular(12.0),
                                  bottomRight: Radius.circular(4.0),
                                  topLeft: Radius.circular(12.0),
                                  topRight: Radius.circular(4.0),
                                ),
                                border: Border.all(
                                  color: Colors.transparent,
                                  width: 1.0,
                                ),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.max,
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.wb_sunny_rounded,
                                    color: Theme.of(context).brightness ==
                                            Brightness.light
                                        ? FlutterFlowTheme.of(context)
                                            .primaryText
                                        : FlutterFlowTheme.of(context)
                                            .secondaryText,
                                    size: 18.0,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                        Expanded(
                          child: InkWell(
                            splashColor: Colors.transparent,
                            focusColor: Colors.transparent,
                            hoverColor: Colors.transparent,
                            highlightColor: Colors.transparent,
                            onTap: () async {
                              setDarkModeSetting(context, ThemeMode.dark);
                            },
                            child: Container(
                              width: double.infinity,
                              height: 100.0,
                              decoration: BoxDecoration(
                                color: Theme.of(context).brightness ==
                                        Brightness.dark
                                    ? FlutterFlowTheme.of(context)
                                        .secondaryBackground
                                    : FlutterFlowTheme.of(context)
                                        .primaryBackground,
                                borderRadius: BorderRadius.only(
                                  bottomLeft: Radius.circular(4.0),
                                  bottomRight: Radius.circular(10.0),
                                  topLeft: Radius.circular(4.0),
                                  topRight: Radius.circular(12.0),
                                ),
                                border: Border.all(
                                  color: FlutterFlowTheme.of(context)
                                      .primaryBackground,
                                  width: 1.0,
                                ),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.max,
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.dark_mode_rounded,
                                    color: Theme.of(context).brightness ==
                                            Brightness.dark
                                        ? FlutterFlowTheme.of(context)
                                            .primaryText
                                        : FlutterFlowTheme.of(context)
                                            .secondaryText,
                                    size: 18.0,
                                  ),
                                ],
                              ),
                            ),
                          ).animateOnActionTrigger(
                            animationsMap['containerOnActionTriggerAnimation']!,
                          ),
                        ),
                      ],
                    ),
                  ),
                ).animateOnPageLoad(
                    animationsMap['containerOnPageLoadAnimation']!),
              ),
              Divider(
                height: 12.0,
                thickness: 1.0,
                color: FlutterFlowTheme.of(context).grayAlpha,
              ),
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(16.0, 12.0, 8.0, 12.0),
                child: InkWell(
                  splashColor: Colors.transparent,
                  focusColor: Colors.transparent,
                  hoverColor: Colors.transparent,
                  highlightColor: Colors.transparent,
                  onTap: () async {
                    context.pushNamed(MyaccountWidget.routeName);
                  },
                  child: Row(
                    mainAxisSize: MainAxisSize.max,
                    children: [
                      wrapWithModel(
                        model: _model.myAvatarModel,
                        updateCallback: () => safeSetState(() {}),
                        child: MyAvatarWidget(
                          size: 44,
                          patch: FFAppState().avatar,
                        ),
                      ),
                      if (FFAppState().isNavOpened)
                        Expanded(
                          child: Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(
                                12.0, 0.0, 0.0, 0.0),
                            child: Column(
                              mainAxisSize: MainAxisSize.max,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  valueOrDefault<String>(
                                    FFAppState().username,
                                    'username',
                                  ),
                                  style: FlutterFlowTheme.of(context)
                                      .bodyLarge
                                      .override(
                                        fontFamily: 'Montserrat',
                                        letterSpacing: 0.0,
                                      ),
                                ).animateOnPageLoad(
                                    animationsMap['textOnPageLoadAnimation1']!),
                                Text(
                                  currentUserEmail,
                                  style: FlutterFlowTheme.of(context)
                                      .labelSmall
                                      .override(
                                        fontFamily: 'Montserrat',
                                        letterSpacing: 0.0,
                                      ),
                                ).animateOnPageLoad(
                                    animationsMap['textOnPageLoadAnimation2']!),
                                Text(
                                  FFAppState().userRole,
                                  style: FlutterFlowTheme.of(context)
                                      .labelSmall
                                      .override(
                                        fontFamily: 'Montserrat',
                                        letterSpacing: 0.0,
                                      ),
                                ).animateOnPageLoad(
                                    animationsMap['textOnPageLoadAnimation3']!),
                              ],
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(8.0, 0.0, 12.0, 0.0),
                child: InkWell(
                  splashColor: Colors.transparent,
                  focusColor: Colors.transparent,
                  hoverColor: Colors.transparent,
                  highlightColor: Colors.transparent,
                  onTap: () async {
                    if (FFAppState().isNavOpened) {
                      FFAppState().isNavOpened = false;
                      safeSetState(() {});
                    } else {
                      FFAppState().isNavOpened = true;
                      safeSetState(() {});
                    }
                  },
                  child: Row(
                    mainAxisSize: MainAxisSize.max,
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      ToggleIcon(
                        onPressed: () async {
                          safeSetState(() => FFAppState().isNavOpened =
                              !FFAppState().isNavOpened);
                        },
                        value: FFAppState().isNavOpened,
                        onIcon: Icon(
                          Icons.keyboard_double_arrow_left_sharp,
                          color: FlutterFlowTheme.of(context).secondaryText,
                          size: 24.0,
                        ),
                        offIcon: Icon(
                          Icons.keyboard_double_arrow_right_sharp,
                          color: FlutterFlowTheme.of(context).secondaryText,
                          size: 24.0,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
