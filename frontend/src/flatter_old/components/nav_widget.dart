import '/auth/supabase_auth/auth_util.dart';
import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/components/menu_item_widget.dart';
import '/components/skeleton_multi_line_list_widget.dart';
import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'dart:async';
import '/index.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import 'nav_model.dart';
export 'nav_model.dart';

class NavWidget extends StatefulWidget {
  const NavWidget({super.key});

  @override
  State<NavWidget> createState() => _NavWidgetState();
}

class _NavWidgetState extends State<NavWidget> with TickerProviderStateMixin {
  late NavModel _model;

  final animationsMap = <String, AnimationInfo>{};

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => NavModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.userSettingsFromBase = await UserSettingsTable().queryRows(
        queryFn: (q) => q.eqOrNull(
          'email',
          currentUserEmail,
        ),
      );
    });

    animationsMap.addAll({
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

    return FutureBuilder<List<DashboardItemsRow>>(
      future: DashboardItemsTable().querySingleRow(
        queryFn: (q) => q.eqOrNull(
          'franchise_id',
          FFAppState().viewAsFranchisor ? 0 : FFAppState().franchisee,
        ),
      ),
      builder: (context, snapshot) {
        // Customize what your widget looks like when it's loading.
        if (!snapshot.hasData) {
          return SkeletonMultiLineListWidget(
            height: 42.0,
            itemsQty: 1,
            radii: 16,
            spacer: 16,
            between: 8,
          );
        }
        List<DashboardItemsRow> navItemsDashboardItemsRowList = snapshot.data!;

        final navItemsDashboardItemsRow =
            navItemsDashboardItemsRowList.isNotEmpty
                ? navItemsDashboardItemsRowList.first
                : null;

        return SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.max,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (FFAppState().isNavOpened)
                Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(16.0, 8.0, 0.0, 0.0),
                  child: Text(
                    FFLocalizations.of(context).getText(
                      'z9d3d1ad' /* Бизнес */,
                    ),
                    style: FlutterFlowTheme.of(context).labelMedium.override(
                          fontFamily: 'Montserrat',
                          letterSpacing: 0.0,
                        ),
                  ).animateOnPageLoad(
                      animationsMap['textOnPageLoadAnimation1']!),
                ),
              if (FFAppState().permLevel.contains(PermLevel.full))
                InkWell(
                  splashColor: Colors.transparent,
                  focusColor: Colors.transparent,
                  hoverColor: Colors.transparent,
                  highlightColor: Colors.transparent,
                  onTap: () async {
                    context.pushNamed(FranchasingWidget.routeName);

                    FFAppState().currentPage = Pages.franchasing;
                    _model.updatePage(() {});
                  },
                  child: wrapWithModel(
                    model: _model.menuItemFranchModel,
                    updateCallback: () => safeSetState(() {}),
                    updateOnChange: true,
                    child: MenuItemWidget(
                      icon: Icon(
                        Icons.business_center_rounded,
                        color: FlutterFlowTheme.of(context).secondaryText,
                        size: 24.0,
                      ),
                      pageName: 'Франчайзинг',
                      newItems: 0,
                      page: Pages.franchasing,
                      iconActive: Icon(
                        Icons.business_center_rounded,
                        color: FlutterFlowTheme.of(context).primary,
                        size: 24.0,
                      ),
                      goto: false,
                    ),
                  ),
                ),
              InkWell(
                splashColor: Colors.transparent,
                focusColor: Colors.transparent,
                hoverColor: Colors.transparent,
                highlightColor: Colors.transparent,
                onTap: () async {
                  context.pushNamed(LocsWidget.routeName);

                  FFAppState().currentPage = Pages.locs;
                  _model.updatePage(() {});
                },
                child: wrapWithModel(
                  model: _model.menuItemLocsModel,
                  updateCallback: () => safeSetState(() {}),
                  updateOnChange: true,
                  child: MenuItemWidget(
                    icon: FaIcon(
                      FontAwesomeIcons.route,
                      color: FlutterFlowTheme.of(context).secondaryText,
                    ),
                    pageName: 'Локации',
                    newItems: valueOrDefault<int>(
                      FFAppState().showAvailavleCellsInLocNav
                          ? navItemsDashboardItemsRow?.freeCells
                          : 0,
                      0,
                    ),
                    page: Pages.locs,
                    iconActive: FaIcon(
                      FontAwesomeIcons.route,
                      color: FlutterFlowTheme.of(context).primary,
                    ),
                    goto: false,
                  ),
                ),
              ),
              InkWell(
                splashColor: Colors.transparent,
                focusColor: Colors.transparent,
                hoverColor: Colors.transparent,
                highlightColor: Colors.transparent,
                onTap: () async {
                  context.pushNamed(ClientsWidget.routeName);

                  FFAppState().currentPage = Pages.clients;
                  _model.updatePage(() {});
                },
                child: wrapWithModel(
                  model: _model.menuItemlientsModel,
                  updateCallback: () => safeSetState(() {}),
                  updateOnChange: true,
                  child: MenuItemWidget(
                    icon: FaIcon(
                      FontAwesomeIcons.houseUser,
                      color: FlutterFlowTheme.of(context).secondaryText,
                    ),
                    pageName: 'Клиенты',
                    newItems: valueOrDefault<int>(
                      FFAppState().showDailyClients
                          ? navItemsDashboardItemsRow?.clientsToday
                          : navItemsDashboardItemsRow?.clientsThisMonth,
                      0,
                    ),
                    page: Pages.clients,
                    iconActive: FaIcon(
                      FontAwesomeIcons.houseUser,
                      color: FlutterFlowTheme.of(context).primary,
                    ),
                    goto: false,
                  ),
                ),
              ),
              InkWell(
                splashColor: Colors.transparent,
                focusColor: Colors.transparent,
                hoverColor: Colors.transparent,
                highlightColor: Colors.transparent,
                onTap: () async {
                  context.pushNamed(PaymentsWidget.routeName);

                  FFAppState().currentPage = Pages.payments;
                  _model.updatePage(() {});
                },
                child: wrapWithModel(
                  model: _model.menuItemPaymentsModel,
                  updateCallback: () => safeSetState(() {}),
                  updateOnChange: true,
                  child: MenuItemWidget(
                    icon: FaIcon(
                      FontAwesomeIcons.coins,
                      color: FlutterFlowTheme.of(context).secondaryText,
                    ),
                    pageName: 'Платежи',
                    newItems: valueOrDefault<int>(
                      FFAppState().showPaymentsDaily
                          ? navItemsDashboardItemsRow?.paymentsToday
                          : navItemsDashboardItemsRow?.paymentsThisMonth,
                      0,
                    ),
                    page: Pages.payments,
                    iconActive: FaIcon(
                      FontAwesomeIcons.coins,
                      color: FlutterFlowTheme.of(context).primary,
                    ),
                    goto: false,
                  ),
                ),
              ),
              InkWell(
                splashColor: Colors.transparent,
                focusColor: Colors.transparent,
                hoverColor: Colors.transparent,
                highlightColor: Colors.transparent,
                onTap: () async {
                  context.pushNamed(RequestsWidget.routeName);

                  FFAppState().currentPage = Pages.requests;
                  _model.updatePage(() {});
                },
                child: wrapWithModel(
                  model: _model.menuItemRequestModel,
                  updateCallback: () => safeSetState(() {}),
                  updateOnChange: true,
                  child: MenuItemWidget(
                    icon: FaIcon(
                      FontAwesomeIcons.solidAddressBook,
                      color: FlutterFlowTheme.of(context).secondaryText,
                    ),
                    pageName: 'Заявки',
                    newItems: valueOrDefault<int>(
                      FFAppState().showTodayRequestsOnly
                          ? navItemsDashboardItemsRow?.requestsLeadToday
                          : navItemsDashboardItemsRow?.requestsLead,
                      0,
                    ),
                    page: Pages.requests,
                    iconActive: FaIcon(
                      FontAwesomeIcons.solidAddressBook,
                      color: FlutterFlowTheme.of(context).primary,
                    ),
                    goto: false,
                  ),
                ),
              ),
              InkWell(
                splashColor: Colors.transparent,
                focusColor: Colors.transparent,
                hoverColor: Colors.transparent,
                highlightColor: Colors.transparent,
                onTap: () async {
                  context.pushNamed(WaitingListWidget.routeName);

                  FFAppState().currentPage = Pages.waitlist;
                  _model.updatePage(() {});
                },
                child: wrapWithModel(
                  model: _model.menuItemWaitingModel,
                  updateCallback: () => safeSetState(() {}),
                  updateOnChange: true,
                  child: MenuItemWidget(
                    icon: FaIcon(
                      FontAwesomeIcons.clipboardList,
                      color: FlutterFlowTheme.of(context).secondaryText,
                    ),
                    pageName: 'Лист ожидания',
                    newItems: valueOrDefault<int>(
                      FFAppState().showMatchesTodayOnlyOnWaiting
                          ? navItemsDashboardItemsRow?.totalMatching
                          : navItemsDashboardItemsRow?.totalWaitlist,
                      0,
                    ),
                    page: Pages.waitlist,
                    iconActive: FaIcon(
                      FontAwesomeIcons.clipboardList,
                      color: FlutterFlowTheme.of(context).primary,
                    ),
                    goto: false,
                  ),
                ),
              ),
              if (FFAppState().isNavOpened)
                Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(16.0, 8.0, 0.0, 0.0),
                  child: Text(
                    FFLocalizations.of(context).getText(
                      '3apk19p1' /* CRM */,
                    ),
                    style: FlutterFlowTheme.of(context).labelMedium.override(
                          fontFamily: 'Montserrat',
                          letterSpacing: 0.0,
                        ),
                  ).animateOnPageLoad(
                      animationsMap['textOnPageLoadAnimation2']!),
                ),
              InkWell(
                splashColor: Colors.transparent,
                focusColor: Colors.transparent,
                hoverColor: Colors.transparent,
                highlightColor: Colors.transparent,
                onTap: () async {
                  context.pushNamed(UsersWidget.routeName);

                  FFAppState().currentPage = Pages.users;
                  _model.updatePage(() {});
                },
                child: wrapWithModel(
                  model: _model.menuItemUsersModel,
                  updateCallback: () => safeSetState(() {}),
                  updateOnChange: true,
                  child: MenuItemWidget(
                    icon: FaIcon(
                      FontAwesomeIcons.userCog,
                      color: FlutterFlowTheme.of(context).secondaryText,
                    ),
                    pageName: 'Пользователи',
                    newItems: valueOrDefault<int>(
                      FFAppState().showNewUsersDayly
                          ? navItemsDashboardItemsRow?.newMembershipsToday
                          : navItemsDashboardItemsRow?.newMembershipsThisMonth,
                      0,
                    ),
                    page: Pages.users,
                    iconActive: FaIcon(
                      FontAwesomeIcons.userCog,
                      color: FlutterFlowTheme.of(context).primary,
                    ),
                    goto: false,
                  ),
                ),
              ),
              InkWell(
                splashColor: Colors.transparent,
                focusColor: Colors.transparent,
                hoverColor: Colors.transparent,
                highlightColor: Colors.transparent,
                onTap: () async {
                  context.pushNamed(CrmsettingsWidget.routeName);

                  FFAppState().currentPage = Pages.crmsettings;
                  _model.updatePage(() {});
                },
                child: wrapWithModel(
                  model: _model.menuItemCRMModel,
                  updateCallback: () => safeSetState(() {}),
                  updateOnChange: true,
                  child: MenuItemWidget(
                    icon: FaIcon(
                      FontAwesomeIcons.cog,
                      color: FlutterFlowTheme.of(context).secondaryText,
                    ),
                    pageName: 'Настройки',
                    newItems: 0,
                    page: Pages.crmsettings,
                    iconActive: FaIcon(
                      FontAwesomeIcons.cog,
                      color: FlutterFlowTheme.of(context).primary,
                    ),
                    goto: false,
                  ),
                ),
              ),
              InkWell(
                splashColor: Colors.transparent,
                focusColor: Colors.transparent,
                hoverColor: Colors.transparent,
                highlightColor: Colors.transparent,
                onTap: () async {
                  unawaited(
                    () async {
                      await launchURL(
                          'https://coda.io/@crm-tochka-docs/crm-tochka');
                    }(),
                  );
                },
                child: wrapWithModel(
                  model: _model.menuItemDocsModel,
                  updateCallback: () => safeSetState(() {}),
                  updateOnChange: true,
                  child: MenuItemWidget(
                    icon: FaIcon(
                      FontAwesomeIcons.inbox,
                      color: FlutterFlowTheme.of(context).secondaryText,
                    ),
                    pageName: 'Документация',
                    newItems: 0,
                    page: Pages.docs,
                    iconActive: FaIcon(
                      FontAwesomeIcons.inbox,
                      color: FlutterFlowTheme.of(context).primary,
                    ),
                    goto: false,
                  ),
                ),
              ),
            ].divide(SizedBox(height: 12.0)),
          ),
        );
      },
    );
  }
}
