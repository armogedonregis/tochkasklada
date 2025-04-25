import '/auth/supabase_auth/auth_util.dart';
import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/components/breadcrumps_widget.dart';
import '/components/create_user_widget.dart';
import '/components/empty_table_placeholder_widget.dart';
import '/components/my_invites_widget.dart';
import '/components/open_drawler_button_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/skeleton_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/components/user_table_row_widget.dart';
import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import 'users_model.dart';
export 'users_model.dart';

class UsersWidget extends StatefulWidget {
  const UsersWidget({super.key});

  static String routeName = 'users';
  static String routePath = '/users';

  @override
  State<UsersWidget> createState() => _UsersWidgetState();
}

class _UsersWidgetState extends State<UsersWidget>
    with TickerProviderStateMixin {
  late UsersModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  final animationsMap = <String, AnimationInfo>{};

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => UsersModel());

    // On page load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      FFAppState().currentPage = Pages.users;
      safeSetState(() {});
    });

    _model.textController ??= TextEditingController();
    _model.textFieldFocusNode ??= FocusNode();

    animationsMap.addAll({
      'columnOnPageLoadAnimation': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.easeInOut,
            delay: 600.0.ms,
            duration: 800.0.ms,
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
    _model.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    context.watch<FFAppState>();

    return Title(
        title: 'users',
        color: FlutterFlowTheme.of(context).primary.withAlpha(0XFF),
        child: GestureDetector(
          onTap: () {
            FocusScope.of(context).unfocus();
            FocusManager.instance.primaryFocus?.unfocus();
          },
          child: Scaffold(
            key: scaffoldKey,
            backgroundColor: FlutterFlowTheme.of(context).secondaryBackground,
            endDrawer: Container(
              width: 390.0,
              child: Drawer(
                elevation: 16.0,
                child: Container(
                  decoration: BoxDecoration(
                    color: FlutterFlowTheme.of(context).secondaryBackground,
                  ),
                  child: wrapWithModel(
                    model: _model.createUserModel,
                    updateCallback: () => safeSetState(() {}),
                    updateOnChange: true,
                    child: CreateUserWidget(
                      inviteCreator: currentUserUid,
                      franchisee: FFAppState().franchisee,
                    ),
                  ),
                ),
              ),
            ),
            body: SafeArea(
              top: true,
              child: Row(
                mainAxisSize: MainAxisSize.max,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  wrapWithModel(
                    model: _model.sidebarModel,
                    updateCallback: () => safeSetState(() {}),
                    child: SidebarWidget(
                      isNavbarOpened: false,
                    ),
                  ),
                  Expanded(
                    child: Align(
                      alignment: AlignmentDirectional(-1.0, -1.0),
                      child: Container(
                        width: double.infinity,
                        constraints: BoxConstraints(
                          maxWidth: double.infinity,
                        ),
                        decoration: BoxDecoration(
                          color:
                              FlutterFlowTheme.of(context).secondaryBackground,
                        ),
                        alignment: AlignmentDirectional(0.0, -1.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.max,
                          children: [
                            Align(
                              alignment: AlignmentDirectional(0.0, -1.0),
                              child: Container(
                                width: double.infinity,
                                constraints: BoxConstraints(
                                  maxWidth: double.infinity,
                                ),
                                decoration: BoxDecoration(
                                  color: FlutterFlowTheme.of(context)
                                      .secondaryBackground,
                                ),
                                alignment: AlignmentDirectional(0.0, -1.0),
                                child: Column(
                                  mainAxisSize: MainAxisSize.max,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          16.0, 0.0, 16.0, 0.0),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.max,
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          wrapWithModel(
                                            model: _model.breadcrumpsModel,
                                            updateCallback: () =>
                                                safeSetState(() {}),
                                            updateOnChange: true,
                                            child: BreadcrumpsWidget(
                                              iconForSection: FaIcon(
                                                FontAwesomeIcons.userCog,
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .secondaryText,
                                                size: 22.0,
                                              ),
                                              currentSectionTittle:
                                                  valueOrDefault<String>(
                                                FFLocalizations.of(context)
                                                    .getVariableText(
                                                  ruText: 'Пользователи и роли',
                                                  enText: 'Users and  roles',
                                                ),
                                                'Пользователи и роли',
                                              ),
                                              isSubpage: false,
                                            ),
                                          ),
                                          Row(
                                            mainAxisSize: MainAxisSize.max,
                                            children: [
                                              if (responsiveVisibility(
                                                context: context,
                                                phone: false,
                                                tablet: false,
                                              ))
                                                Container(
                                                  width: 200.0,
                                                  child: TextFormField(
                                                    controller:
                                                        _model.textController,
                                                    focusNode: _model
                                                        .textFieldFocusNode,
                                                    autofocus: true,
                                                    autofillHints: [
                                                      AutofillHints.email
                                                    ],
                                                    obscureText: false,
                                                    decoration: InputDecoration(
                                                      isDense: true,
                                                      labelStyle:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .labelMedium
                                                              .override(
                                                                fontFamily:
                                                                    'Montserrat',
                                                                letterSpacing:
                                                                    0.0,
                                                                fontWeight:
                                                                    FontWeight
                                                                        .w600,
                                                              ),
                                                      hintText:
                                                          FFLocalizations.of(
                                                                  context)
                                                              .getText(
                                                        'l2ptdehg' /* Поиск пользователя */,
                                                      ),
                                                      hintStyle:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .bodyMedium
                                                              .override(
                                                                fontFamily:
                                                                    'Montserrat',
                                                                color: FlutterFlowTheme.of(
                                                                        context)
                                                                    .tertiaryText,
                                                                letterSpacing:
                                                                    0.0,
                                                                fontWeight:
                                                                    FontWeight
                                                                        .w600,
                                                              ),
                                                      enabledBorder:
                                                          OutlineInputBorder(
                                                        borderSide: BorderSide(
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .primaryBackground,
                                                          width: 2.0,
                                                        ),
                                                        borderRadius:
                                                            BorderRadius
                                                                .circular(16.0),
                                                      ),
                                                      focusedBorder:
                                                          OutlineInputBorder(
                                                        borderSide: BorderSide(
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .grayAlpha,
                                                          width: 2.0,
                                                        ),
                                                        borderRadius:
                                                            BorderRadius
                                                                .circular(16.0),
                                                      ),
                                                      errorBorder:
                                                          OutlineInputBorder(
                                                        borderSide: BorderSide(
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .error,
                                                          width: 2.0,
                                                        ),
                                                        borderRadius:
                                                            BorderRadius
                                                                .circular(16.0),
                                                      ),
                                                      focusedErrorBorder:
                                                          OutlineInputBorder(
                                                        borderSide: BorderSide(
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .error,
                                                          width: 2.0,
                                                        ),
                                                        borderRadius:
                                                            BorderRadius
                                                                .circular(16.0),
                                                      ),
                                                      filled: true,
                                                      fillColor:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .primaryBackground,
                                                      prefixIcon: Icon(
                                                        Icons.search_rounded,
                                                      ),
                                                    ),
                                                    style: FlutterFlowTheme.of(
                                                            context)
                                                        .bodyMedium
                                                        .override(
                                                          fontFamily:
                                                              'Montserrat',
                                                          letterSpacing: 0.0,
                                                          fontWeight:
                                                              FontWeight.w600,
                                                        ),
                                                    keyboardType: TextInputType
                                                        .emailAddress,
                                                    validator: _model
                                                        .textControllerValidator
                                                        .asValidator(context),
                                                  ),
                                                ),
                                              if (FFAppState()
                                                  .permLevel
                                                  .contains(
                                                      PermLevel.franchise))
                                                InkWell(
                                                  splashColor:
                                                      Colors.transparent,
                                                  focusColor:
                                                      Colors.transparent,
                                                  hoverColor:
                                                      Colors.transparent,
                                                  highlightColor:
                                                      Colors.transparent,
                                                  onTap: () async {
                                                    scaffoldKey.currentState!
                                                        .openEndDrawer();
                                                  },
                                                  child: wrapWithModel(
                                                    model: _model
                                                        .openDrawlerButtonModel,
                                                    updateCallback: () =>
                                                        safeSetState(() {}),
                                                    child:
                                                        OpenDrawlerButtonWidget(
                                                      buttonTittle:
                                                          valueOrDefault<
                                                              String>(
                                                        FFLocalizations.of(
                                                                context)
                                                            .getVariableText(
                                                          ruText:
                                                              'Создать пользоаателя',
                                                          enText: 'Add user',
                                                        ),
                                                        'Создать пользоаателя',
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                            ].divide(SizedBox(width: 16.0)),
                                          ),
                                        ],
                                      ),
                                    ),
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          16.0, 0.0, 16.0, 0.0),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.max,
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          Expanded(
                                            child: Align(
                                              alignment: AlignmentDirectional(
                                                  -1.0, 0.0),
                                              child: wrapWithModel(
                                                model: _model
                                                    .tittleWithIconAndSubtittleModel,
                                                updateCallback: () =>
                                                    safeSetState(() {}),
                                                child:
                                                    TittleWithIconAndSubtittleWidget(
                                                  tittle:
                                                      valueOrDefault<String>(
                                                    FFLocalizations.of(context)
                                                        .getVariableText(
                                                      ruText:
                                                          'Инвайты и пользователи',
                                                      enText:
                                                          'Users and Invites',
                                                    ),
                                                    'Инвайты и пользователи',
                                                  ),
                                                  hasIcon: true,
                                                  hasSubtittle: false,
                                                  margin: 24,
                                                ),
                                              ),
                                            ),
                                          ),
                                        ].divide(SizedBox(width: 16.0)),
                                      ),
                                    ),
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          0.0, 24.0, 16.0, 0.0),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.max,
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          Flexible(
                                            flex: 1,
                                            child: Container(
                                              constraints: BoxConstraints(
                                                maxWidth: 400.0,
                                              ),
                                              decoration: BoxDecoration(),
                                              child: Padding(
                                                padding: EdgeInsetsDirectional
                                                    .fromSTEB(
                                                        16.0, 0.0, 0.0, 0.0),
                                                child: Row(
                                                  mainAxisSize:
                                                      MainAxisSize.max,
                                                  mainAxisAlignment:
                                                      MainAxisAlignment
                                                          .spaceBetween,
                                                  children: [
                                                    Padding(
                                                      padding:
                                                          EdgeInsetsDirectional
                                                              .fromSTEB(
                                                                  0.0,
                                                                  0.0,
                                                                  16.0,
                                                                  0.0),
                                                      child: Text(
                                                        FFLocalizations.of(
                                                                context)
                                                            .getText(
                                                          'o6nwleu3' /* Сортировать по правам: */,
                                                        ),
                                                        style:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .bodySmall
                                                                .override(
                                                                  fontFamily:
                                                                      'Montserrat',
                                                                  color: FlutterFlowTheme.of(
                                                                          context)
                                                                      .tertiaryText,
                                                                  letterSpacing:
                                                                      0.0,
                                                                ),
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ),
                                          ),
                                        ].divide(SizedBox(width: 16.0)),
                                      ),
                                    ),
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          16.0, 16.0, 16.0, 0.0),
                                      child: Container(
                                        width: double.infinity,
                                        height: 40.0,
                                        decoration: BoxDecoration(
                                          color: FlutterFlowTheme.of(context)
                                              .primaryBackground,
                                          borderRadius: BorderRadius.only(
                                            bottomLeft: Radius.circular(0.0),
                                            bottomRight: Radius.circular(0.0),
                                            topLeft: Radius.circular(16.0),
                                            topRight: Radius.circular(16.0),
                                          ),
                                        ),
                                        child: Padding(
                                          padding:
                                              EdgeInsetsDirectional.fromSTEB(
                                                  16.0, 0.0, 16.0, 0.0),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.max,
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Expanded(
                                                flex: () {
                                                  if (MediaQuery.sizeOf(context)
                                                          .width <
                                                      kBreakpointSmall) {
                                                    return 6;
                                                  } else if (MediaQuery.sizeOf(
                                                              context)
                                                          .width <
                                                      kBreakpointMedium) {
                                                    return 3;
                                                  } else if (MediaQuery.sizeOf(
                                                              context)
                                                          .width <
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
                                                        EdgeInsetsDirectional
                                                            .fromSTEB(44.0, 0.0,
                                                                0.0, 0.0),
                                                    child: Text(
                                                      FFLocalizations.of(
                                                              context)
                                                          .getText(
                                                        'yc97vjbz' /* Инфо */,
                                                      ),
                                                      style:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .bodySmall
                                                              .override(
                                                                fontFamily:
                                                                    'Montserrat',
                                                                color: FlutterFlowTheme.of(
                                                                        context)
                                                                    .secondaryText,
                                                                letterSpacing:
                                                                    0.0,
                                                              ),
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
                                                    FFLocalizations.of(context)
                                                        .getText(
                                                      'ozmjfnth' /* Фр. */,
                                                    ),
                                                    style: FlutterFlowTheme.of(
                                                            context)
                                                        .bodySmall
                                                        .override(
                                                          fontFamily:
                                                              'Montserrat',
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .secondaryText,
                                                          letterSpacing: 0.0,
                                                        ),
                                                  ),
                                                ),
                                              ),
                                              Expanded(
                                                flex: 3,
                                                child: Container(
                                                  decoration: BoxDecoration(),
                                                  child: Visibility(
                                                    visible:
                                                        responsiveVisibility(
                                                      context: context,
                                                      phone: false,
                                                    ),
                                                    child: Text(
                                                      FFLocalizations.of(
                                                              context)
                                                          .getText(
                                                        'rolg699l' /* Почта */,
                                                      ),
                                                      style:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .bodySmall
                                                              .override(
                                                                fontFamily:
                                                                    'Montserrat',
                                                                color: FlutterFlowTheme.of(
                                                                        context)
                                                                    .secondaryText,
                                                                letterSpacing:
                                                                    0.0,
                                                              ),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                              Expanded(
                                                flex: 2,
                                                child: Container(
                                                  decoration: BoxDecoration(),
                                                  child: Visibility(
                                                    visible:
                                                        responsiveVisibility(
                                                      context: context,
                                                      phone: false,
                                                      tablet: false,
                                                    ),
                                                    child: Text(
                                                      FFLocalizations.of(
                                                              context)
                                                          .getText(
                                                        'i860x3bt' /* Телефон */,
                                                      ),
                                                      style:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .bodySmall
                                                              .override(
                                                                fontFamily:
                                                                    'Montserrat',
                                                                color: FlutterFlowTheme.of(
                                                                        context)
                                                                    .secondaryText,
                                                                letterSpacing:
                                                                    0.0,
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
                                                      visible:
                                                          responsiveVisibility(
                                                        context: context,
                                                        phone: false,
                                                        tablet: false,
                                                      ),
                                                      child: Text(
                                                        FFLocalizations.of(
                                                                context)
                                                            .getText(
                                                          'xedvlrr3' /* Кто пригласил */,
                                                        ),
                                                        textAlign:
                                                            TextAlign.end,
                                                        style:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .bodySmall
                                                                .override(
                                                                  fontFamily:
                                                                      'Montserrat',
                                                                  color: FlutterFlowTheme.of(
                                                                          context)
                                                                      .secondaryText,
                                                                  letterSpacing:
                                                                      0.0,
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
                                                  child: Container(
                                                    width: 100.0,
                                                    decoration: BoxDecoration(),
                                                    child: Visibility(
                                                      visible:
                                                          responsiveVisibility(
                                                        context: context,
                                                        phone: false,
                                                        tablet: false,
                                                      ),
                                                      child: Text(
                                                        FFLocalizations.of(
                                                                context)
                                                            .getText(
                                                          'sfqgxn2n' /* Создан */,
                                                        ),
                                                        textAlign:
                                                            TextAlign.end,
                                                        style:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .bodySmall
                                                                .override(
                                                                  fontFamily:
                                                                      'Montserrat',
                                                                  color: FlutterFlowTheme.of(
                                                                          context)
                                                                      .secondaryText,
                                                                  letterSpacing:
                                                                      0.0,
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
                                                    mainAxisSize:
                                                        MainAxisSize.min,
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .center,
                                                    children: [
                                                      Container(
                                                        width: 48.0,
                                                        height: 48.0,
                                                        decoration:
                                                            BoxDecoration(),
                                                      ),
                                                    ],
                                                  ),
                                                ),
                                            ].divide(SizedBox(width: 12.0)),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            Expanded(
                              child: Column(
                                mainAxisSize: MainAxisSize.max,
                                children: [
                                  AnimatedContainer(
                                    duration: Duration(milliseconds: 70),
                                    curve: Curves.easeInOut,
                                    constraints: BoxConstraints(
                                      minHeight: 40.0,
                                      maxHeight: 238.0,
                                    ),
                                    decoration: BoxDecoration(),
                                    child: FutureBuilder<List<InvitesRow>>(
                                      future: InvitesTable().queryRows(
                                        queryFn: (q) => q
                                            .not(
                                              'username',
                                              'is',
                                              null,
                                            )
                                            .order('created'),
                                      ),
                                      builder: (context, snapshot) {
                                        // Customize what your widget looks like when it's loading.
                                        if (!snapshot.hasData) {
                                          return Container(
                                            width: MediaQuery.sizeOf(context)
                                                    .width *
                                                1.0,
                                            height: MediaQuery.sizeOf(context)
                                                    .height *
                                                0.8,
                                            child: SkeletonWidget(),
                                          );
                                        }
                                        List<InvitesRow>
                                            listViewInvitesRowList =
                                            snapshot.data!;

                                        return ListView.builder(
                                          padding: EdgeInsets.zero,
                                          primary: false,
                                          shrinkWrap: true,
                                          scrollDirection: Axis.vertical,
                                          itemCount:
                                              listViewInvitesRowList.length,
                                          itemBuilder:
                                              (context, listViewIndex) {
                                            final listViewInvitesRow =
                                                listViewInvitesRowList[
                                                    listViewIndex];
                                            return Visibility(
                                              visible:
                                                  FFAppState().viewAsFranchisor
                                                      ? true
                                                      : (listViewInvitesRow
                                                              .invitedBy ==
                                                          currentUserEmail),
                                              child: MyInvitesWidget(
                                                key: Key(
                                                    'Key7w7_${listViewIndex}_of_${listViewInvitesRowList.length}'),
                                                isLogged: false,
                                                username:
                                                    valueOrDefault<String>(
                                                  listViewInvitesRow.username,
                                                  'user name',
                                                ),
                                                role: valueOrDefault<String>(
                                                  listViewInvitesRow.role,
                                                  'Оператор',
                                                ),
                                                franchiseZone:
                                                    valueOrDefault<int>(
                                                  listViewInvitesRow.franchisee,
                                                  0,
                                                ),
                                                userMail:
                                                    valueOrDefault<String>(
                                                  listViewInvitesRow.email,
                                                  'test@mail.com',
                                                ),
                                                userPhone: '--',
                                                invitedBy:
                                                    valueOrDefault<String>(
                                                  listViewInvitesRow.invitedBy,
                                                  'admin',
                                                ),
                                                id: listViewInvitesRow.inviteID,
                                                isExpired: getCurrentTimestamp >
                                                    listViewInvitesRow
                                                        .validUntil!,
                                                createdAt:
                                                    listViewInvitesRow.created,
                                                deleteItem:
                                                    (hasDeleteRow) async {
                                                  if (_model.hasDeleteRow) {
                                                    await Future.delayed(
                                                        const Duration(
                                                            milliseconds: 200));
                                                    _model.hasDeleteRow = false;
                                                    safeSetState(() {});
                                                  }
                                                },
                                              ),
                                            );
                                          },
                                        );
                                      },
                                    ),
                                  ),
                                  Expanded(
                                    child: Container(
                                      height: 500.0,
                                      decoration: BoxDecoration(),
                                      child:
                                          FutureBuilder<List<UsersByRolesRow>>(
                                        future: UsersByRolesTable().queryRows(
                                          queryFn: (q) =>
                                              q.order('app_permission_role'),
                                          limit: 20,
                                        ),
                                        builder: (context, snapshot) {
                                          // Customize what your widget looks like when it's loading.
                                          if (!snapshot.hasData) {
                                            return Container(
                                              width: MediaQuery.sizeOf(context)
                                                      .width *
                                                  1.0,
                                              height: MediaQuery.sizeOf(context)
                                                      .height *
                                                  0.8,
                                              child: SkeletonWidget(),
                                            );
                                          }
                                          List<UsersByRolesRow>
                                              listViewUsersByRolesRowList =
                                              snapshot.data!;

                                          if (listViewUsersByRolesRowList
                                              .isEmpty) {
                                            return EmptyTablePlaceholderWidget(
                                              placeholderText:
                                                  'нет доступных для просмотра пользователей',
                                            );
                                          }

                                          return ListView.builder(
                                            padding: EdgeInsets.zero,
                                            primary: false,
                                            scrollDirection: Axis.vertical,
                                            itemCount:
                                                listViewUsersByRolesRowList
                                                    .length,
                                            itemBuilder:
                                                (context, listViewIndex) {
                                              final listViewUsersByRolesRow =
                                                  listViewUsersByRolesRowList[
                                                      listViewIndex];
                                              return Visibility(
                                                visible: FFAppState()
                                                        .viewAsFranchisor
                                                    ? true
                                                    : (listViewUsersByRolesRow
                                                            .franchiseZone ==
                                                        FFAppState()
                                                            .franchisee),
                                                child: UserTableRowWidget(
                                                  key: Key(
                                                      'Key6o0_${listViewIndex}_of_${listViewUsersByRolesRowList.length}'),
                                                  isLogged: true,
                                                  username:
                                                      valueOrDefault<String>(
                                                    listViewUsersByRolesRow
                                                        .username,
                                                    'user name',
                                                  ),
                                                  role: valueOrDefault<String>(
                                                    listViewUsersByRolesRow
                                                        .roleName,
                                                    'Оператор',
                                                  ),
                                                  franchiseZone:
                                                      valueOrDefault<int>(
                                                    listViewUsersByRolesRow
                                                        .franchiseZone,
                                                    0,
                                                  ),
                                                  userMail:
                                                      valueOrDefault<String>(
                                                    listViewUsersByRolesRow
                                                        .email,
                                                    'email',
                                                  ),
                                                  userPhone:
                                                      valueOrDefault<String>(
                                                    listViewUsersByRolesRow
                                                        .phone,
                                                    'не указан',
                                                  ),
                                                  invitedBy:
                                                      valueOrDefault<String>(
                                                    listViewUsersByRolesRow
                                                        .invitedBy,
                                                    'админ',
                                                  ),
                                                  id: listViewUsersByRolesRow
                                                      .createdBy,
                                                  isExpired: false,
                                                  createdAt:
                                                      listViewUsersByRolesRow
                                                          .createdAt,
                                                  avaatarPatch:
                                                      valueOrDefault<String>(
                                                    listViewUsersByRolesRow
                                                        .avatarPatch,
                                                    'CAMShAFDZ2hzYkdkNGNIbDVZeEpWNGdGSFFrRUtCeElGZEdVMmFYUVNOaEkwQ0FOQ0dUSVhDaFVLQzJGMllYUmhjbEJoZEdOb0VnWnNjV1p2ZVhPQ0FSUUtFa052Ym5SaGFXNWxjbDlzWWpOeGRIRTVabEFDV0FLcUFnaHdaSGRrWW1aMk1nPT0=',
                                                  ),
                                                ),
                                              );
                                            },
                                          );
                                        },
                                      ),
                                    ),
                                  ),
                                ],
                              ).animateOnPageLoad(
                                  animationsMap['columnOnPageLoadAnimation']!),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ));
  }
}
