import 'dart:async';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '/backend/schema/structs/index.dart';

import '/auth/base_auth_user_provider.dart';

import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';

import '/index.dart';

export 'package:go_router/go_router.dart';
export 'serialization_util.dart';

const kTransitionInfoKey = '__transition_info__';

GlobalKey<NavigatorState> appNavigatorKey = GlobalKey<NavigatorState>();

class AppStateNotifier extends ChangeNotifier {
  AppStateNotifier._();

  static AppStateNotifier? _instance;
  static AppStateNotifier get instance => _instance ??= AppStateNotifier._();

  BaseAuthUser? initialUser;
  BaseAuthUser? user;
  bool showSplashImage = true;
  String? _redirectLocation;

  /// Determines whether the app will refresh and build again when a sign
  /// in or sign out happens. This is useful when the app is launched or
  /// on an unexpected logout. However, this must be turned off when we
  /// intend to sign in/out and then navigate or perform any actions after.
  /// Otherwise, this will trigger a refresh and interrupt the action(s).
  bool notifyOnAuthChange = true;

  bool get loading => user == null || showSplashImage;
  bool get loggedIn => user?.loggedIn ?? false;
  bool get initiallyLoggedIn => initialUser?.loggedIn ?? false;
  bool get shouldRedirect => loggedIn && _redirectLocation != null;

  String getRedirectLocation() => _redirectLocation!;
  bool hasRedirect() => _redirectLocation != null;
  void setRedirectLocationIfUnset(String loc) => _redirectLocation ??= loc;
  void clearRedirectLocation() => _redirectLocation = null;

  /// Mark as not needing to notify on a sign in / out when we intend
  /// to perform subsequent actions (such as navigation) afterwards.
  void updateNotifyOnAuthChange(bool notify) => notifyOnAuthChange = notify;

  void update(BaseAuthUser newUser) {
    final shouldUpdate =
        user?.uid == null || newUser.uid == null || user?.uid != newUser.uid;
    initialUser ??= newUser;
    user = newUser;
    // Refresh the app on auth change unless explicitly marked otherwise.
    // No need to update unless the user has changed.
    if (notifyOnAuthChange && shouldUpdate) {
      notifyListeners();
    }
    // Once again mark the notifier as needing to update on auth change
    // (in order to catch sign in / out events).
    updateNotifyOnAuthChange(true);
  }

  void stopShowingSplashImage() {
    showSplashImage = false;
    notifyListeners();
  }
}

GoRouter createRouter(AppStateNotifier appStateNotifier) => GoRouter(
      initialLocation: '/',
      debugLogDiagnostics: true,
      refreshListenable: appStateNotifier,
      navigatorKey: appNavigatorKey,
      errorBuilder: (context, state) =>
          appStateNotifier.loggedIn ? RequestsWidget() : LoginWidget(),
      routes: [
        FFRoute(
          name: '_initialize',
          path: '/',
          builder: (context, _) =>
              appStateNotifier.loggedIn ? RequestsWidget() : LoginWidget(),
        ),
        FFRoute(
          name: LoginWidget.routeName,
          path: LoginWidget.routePath,
          builder: (context, params) => LoginWidget(),
        ),
        FFRoute(
          name: PaymentsDetailsWidget.routeName,
          path: PaymentsDetailsWidget.routePath,
          requireAuth: true,
          builder: (context, params) => PaymentsDetailsWidget(),
        ),
        FFRoute(
          name: UsersWidget.routeName,
          path: UsersWidget.routePath,
          requireAuth: true,
          builder: (context, params) => UsersWidget(),
        ),
        FFRoute(
          name: FranchasingWidget.routeName,
          path: FranchasingWidget.routePath,
          requireAuth: true,
          builder: (context, params) => FranchasingWidget(),
        ),
        FFRoute(
          name: LocsWidget.routeName,
          path: LocsWidget.routePath,
          requireAuth: true,
          builder: (context, params) => LocsWidget(),
        ),
        FFRoute(
          name: ClientsWidget.routeName,
          path: ClientsWidget.routePath,
          requireAuth: true,
          builder: (context, params) => ClientsWidget(),
        ),
        FFRoute(
          name: RequestsWidget.routeName,
          path: RequestsWidget.routePath,
          requireAuth: true,
          builder: (context, params) => RequestsWidget(),
        ),
        FFRoute(
          name: MyaccountWidget.routeName,
          path: MyaccountWidget.routePath,
          requireAuth: true,
          builder: (context, params) => MyaccountWidget(),
        ),
        FFRoute(
          name: RegisterWidget.routeName,
          path: RegisterWidget.routePath,
          builder: (context, params) => RegisterWidget(),
        ),
        FFRoute(
          name: LocpreviewWidget.routeName,
          path: LocpreviewWidget.routePath,
          requireAuth: true,
          builder: (context, params) => LocpreviewWidget(
            locID: params.getParam(
              'locID',
              ParamType.String,
            ),
            locAdress: params.getParam(
              'locAdress',
              ParamType.String,
            ),
            locName: params.getParam(
              'locName',
              ParamType.String,
            ),
            city: params.getParam(
              'city',
              ParamType.String,
            ),
            mTotal: params.getParam(
              'mTotal',
              ParamType.int,
            ),
            mAvailable: params.getParam(
              'mAvailable',
              ParamType.int,
            ),
            sTotal: params.getParam(
              'sTotal',
              ParamType.int,
            ),
            sAvailable: params.getParam(
              'sAvailable',
              ParamType.int,
            ),
            xsTotal: params.getParam(
              'xsTotal',
              ParamType.int,
            ),
            xsAvailable: params.getParam(
              'xsAvailable',
              ParamType.int,
            ),
          ),
        ),
        FFRoute(
          name: PaymentsWidget.routeName,
          path: PaymentsWidget.routePath,
          requireAuth: true,
          builder: (context, params) => PaymentsWidget(),
        ),
        FFRoute(
          name: SiteFormIframeWidget.routeName,
          path: SiteFormIframeWidget.routePath,
          builder: (context, params) => SiteFormIframeWidget(
            location: params.getParam(
              'location',
              ParamType.String,
            ),
            size: params.getParam(
              'size',
              ParamType.String,
            ),
          ),
        ),
        FFRoute(
          name: PromocodesWidget.routeName,
          path: PromocodesWidget.routePath,
          requireAuth: true,
          builder: (context, params) => PromocodesWidget(),
        ),
        FFRoute(
          name: PricesWidget.routeName,
          path: PricesWidget.routePath,
          requireAuth: true,
          builder: (context, params) => PricesWidget(),
        ),
        FFRoute(
          name: AdressesWidget.routeName,
          path: AdressesWidget.routePath,
          requireAuth: true,
          builder: (context, params) => AdressesWidget(),
        ),
        FFRoute(
          name: WaitingListWidget.routeName,
          path: WaitingListWidget.routePath,
          requireAuth: true,
          builder: (context, params) => WaitingListWidget(),
        ),
        FFRoute(
          name: CrmsettingsWidget.routeName,
          path: CrmsettingsWidget.routePath,
          requireAuth: true,
          builder: (context, params) => CrmsettingsWidget(),
        ),
        FFRoute(
          name: GotoLKWidget.routeName,
          path: GotoLKWidget.routePath,
          builder: (context, params) => GotoLKWidget(
            cellID: params.getParam(
              'cellID',
              ParamType.String,
            ),
            clientemail: params.getParam(
              'clientemail',
              ParamType.String,
            ),
            token: params.getParam(
              'token',
              ParamType.String,
            ),
            timeReserved: params.getParam(
              'timeReserved',
              ParamType.int,
            ),
          ),
        ),
        FFRoute(
          name: RecallInfoWidget.routeName,
          path: RecallInfoWidget.routePath,
          builder: (context, params) => RecallInfoWidget(
            username: params.getParam(
              'username',
              ParamType.String,
            ),
          ),
        ),
        FFRoute(
          name: BookingWidget.routeName,
          path: BookingWidget.routePath,
          requireAuth: true,
          builder: (context, params) => BookingWidget(),
        ),
        FFRoute(
          name: ClientnameWidget.routeName,
          path: ClientnameWidget.routePath,
          requireAuth: true,
          builder: (context, params) => ClientnameWidget(
            clientID: params.getParam(
              'clientID',
              ParamType.String,
            ),
            clientName: params.getParam(
              'clientName',
              ParamType.String,
            ),
            clientEmail: params.getParam(
              'clientEmail',
              ParamType.String,
            ),
            statusClient: params.getParam(
              'statusClient',
              ParamType.String,
            ),
            createdAt: params.getParam(
              'createdAt',
              ParamType.DateTime,
            ),
            clientPhone: params.getParam(
              'clientPhone',
              ParamType.String,
            ),
            cellIDs: params.getParam(
              'cellIDs',
              ParamType.String,
            ),
            lastPayment: params.getParam(
              'lastPayment',
              ParamType.DateTime,
            ),
            paymentQty: params.getParam(
              'paymentQty',
              ParamType.int,
            ),
            booking: params.getParam(
              'booking',
              ParamType.String,
            ),
            secondName: params.getParam(
              'secondName',
              ParamType.String,
            ),
            adminNotes: params.getParam(
              'adminNotes',
              ParamType.String,
            ),
          ),
        ),
        FFRoute(
          name: ChangeMailWidget.routeName,
          path: ChangeMailWidget.routePath,
          builder: (context, params) => ChangeMailWidget(
            email: params.getParam(
              'email',
              ParamType.String,
            ),
            cellID: params.getParam(
              'cellID',
              ParamType.String,
            ),
            phone: params.getParam(
              'phone',
              ParamType.String,
            ),
          ),
        ),
        FFRoute(
          name: GotoAppWidget.routeName,
          path: GotoAppWidget.routePath,
          builder: (context, params) => GotoAppWidget(
            cellID: params.getParam(
              'cellID',
              ParamType.String,
            ),
            clientemail: params.getParam(
              'clientemail',
              ParamType.String,
            ),
            timeReserved: params.getParam(
              'timeReserved',
              ParamType.int,
            ),
          ),
        ),
        FFRoute(
          name: ClientsQuestionsWidget.routeName,
          path: ClientsQuestionsWidget.routePath,
          requireAuth: true,
          builder: (context, params) => ClientsQuestionsWidget(),
        ),
        FFRoute(
          name: MerchantsWidget.routeName,
          path: MerchantsWidget.routePath,
          requireAuth: true,
          builder: (context, params) => MerchantsWidget(
            merchantID: params.getParam(
              'merchantID',
              ParamType.String,
            ),
          ),
        ),
        FFRoute(
          name: AssessErrorPageWidget.routeName,
          path: AssessErrorPageWidget.routePath,
          requireAuth: true,
          builder: (context, params) => AssessErrorPageWidget(),
        ),
        FFRoute(
          name: MerchantViewWidget.routeName,
          path: MerchantViewWidget.routePath,
          requireAuth: true,
          builder: (context, params) => MerchantViewWidget(
            merchantID: params.getParam(
              'merchantID',
              ParamType.String,
            ),
          ),
        )
      ].map((r) => r.toRoute(appStateNotifier)).toList(),
    );

extension NavParamExtensions on Map<String, String?> {
  Map<String, String> get withoutNulls => Map.fromEntries(
        entries
            .where((e) => e.value != null)
            .map((e) => MapEntry(e.key, e.value!)),
      );
}

extension NavigationExtensions on BuildContext {
  void goNamedAuth(
    String name,
    bool mounted, {
    Map<String, String> pathParameters = const <String, String>{},
    Map<String, String> queryParameters = const <String, String>{},
    Object? extra,
    bool ignoreRedirect = false,
  }) =>
      !mounted || GoRouter.of(this).shouldRedirect(ignoreRedirect)
          ? null
          : goNamed(
              name,
              pathParameters: pathParameters,
              queryParameters: queryParameters,
              extra: extra,
            );

  void pushNamedAuth(
    String name,
    bool mounted, {
    Map<String, String> pathParameters = const <String, String>{},
    Map<String, String> queryParameters = const <String, String>{},
    Object? extra,
    bool ignoreRedirect = false,
  }) =>
      !mounted || GoRouter.of(this).shouldRedirect(ignoreRedirect)
          ? null
          : pushNamed(
              name,
              pathParameters: pathParameters,
              queryParameters: queryParameters,
              extra: extra,
            );

  void safePop() {
    // If there is only one route on the stack, navigate to the initial
    // page instead of popping.
    if (canPop()) {
      pop();
    } else {
      go('/');
    }
  }
}

extension GoRouterExtensions on GoRouter {
  AppStateNotifier get appState => AppStateNotifier.instance;
  void prepareAuthEvent([bool ignoreRedirect = false]) =>
      appState.hasRedirect() && !ignoreRedirect
          ? null
          : appState.updateNotifyOnAuthChange(false);
  bool shouldRedirect(bool ignoreRedirect) =>
      !ignoreRedirect && appState.hasRedirect();
  void clearRedirectLocation() => appState.clearRedirectLocation();
  void setRedirectLocationIfUnset(String location) =>
      appState.updateNotifyOnAuthChange(false);
}

extension _GoRouterStateExtensions on GoRouterState {
  Map<String, dynamic> get extraMap =>
      extra != null ? extra as Map<String, dynamic> : {};
  Map<String, dynamic> get allParams => <String, dynamic>{}
    ..addAll(pathParameters)
    ..addAll(uri.queryParameters)
    ..addAll(extraMap);
  TransitionInfo get transitionInfo => extraMap.containsKey(kTransitionInfoKey)
      ? extraMap[kTransitionInfoKey] as TransitionInfo
      : TransitionInfo.appDefault();
}

class FFParameters {
  FFParameters(this.state, [this.asyncParams = const {}]);

  final GoRouterState state;
  final Map<String, Future<dynamic> Function(String)> asyncParams;

  Map<String, dynamic> futureParamValues = {};

  // Parameters are empty if the params map is empty or if the only parameter
  // present is the special extra parameter reserved for the transition info.
  bool get isEmpty =>
      state.allParams.isEmpty ||
      (state.allParams.length == 1 &&
          state.extraMap.containsKey(kTransitionInfoKey));
  bool isAsyncParam(MapEntry<String, dynamic> param) =>
      asyncParams.containsKey(param.key) && param.value is String;
  bool get hasFutures => state.allParams.entries.any(isAsyncParam);
  Future<bool> completeFutures() => Future.wait(
        state.allParams.entries.where(isAsyncParam).map(
          (param) async {
            final doc = await asyncParams[param.key]!(param.value)
                .onError((_, __) => null);
            if (doc != null) {
              futureParamValues[param.key] = doc;
              return true;
            }
            return false;
          },
        ),
      ).onError((_, __) => [false]).then((v) => v.every((e) => e));

  dynamic getParam<T>(
    String paramName,
    ParamType type, {
    bool isList = false,
    StructBuilder<T>? structBuilder,
  }) {
    if (futureParamValues.containsKey(paramName)) {
      return futureParamValues[paramName];
    }
    if (!state.allParams.containsKey(paramName)) {
      return null;
    }
    final param = state.allParams[paramName];
    // Got parameter from `extras`, so just directly return it.
    if (param is! String) {
      return param;
    }
    // Return serialized value.
    return deserializeParam<T>(
      param,
      type,
      isList,
      structBuilder: structBuilder,
    );
  }
}

class FFRoute {
  const FFRoute({
    required this.name,
    required this.path,
    required this.builder,
    this.requireAuth = false,
    this.asyncParams = const {},
    this.routes = const [],
  });

  final String name;
  final String path;
  final bool requireAuth;
  final Map<String, Future<dynamic> Function(String)> asyncParams;
  final Widget Function(BuildContext, FFParameters) builder;
  final List<GoRoute> routes;

  GoRoute toRoute(AppStateNotifier appStateNotifier) => GoRoute(
        name: name,
        path: path,
        redirect: (context, state) {
          if (appStateNotifier.shouldRedirect) {
            final redirectLocation = appStateNotifier.getRedirectLocation();
            appStateNotifier.clearRedirectLocation();
            return redirectLocation;
          }

          if (requireAuth && !appStateNotifier.loggedIn) {
            appStateNotifier.setRedirectLocationIfUnset(state.uri.toString());
            return '/login';
          }
          return null;
        },
        pageBuilder: (context, state) {
          fixStatusBarOniOS16AndBelow(context);
          final ffParams = FFParameters(state, asyncParams);
          final page = ffParams.hasFutures
              ? FutureBuilder(
                  future: ffParams.completeFutures(),
                  builder: (context, _) => builder(context, ffParams),
                )
              : builder(context, ffParams);
          final child = appStateNotifier.loading
              ? Container(
                  color: FlutterFlowTheme.of(context).white,
                  child: Center(
                    child: Image.asset(
                      'assets/images/smbanner.png',
                      width: double.infinity,
                      height: 100.0,
                      fit: BoxFit.fitHeight,
                    ),
                  ),
                )
              : page;

          final transitionInfo = state.transitionInfo;
          return transitionInfo.hasTransition
              ? CustomTransitionPage(
                  key: state.pageKey,
                  child: child,
                  transitionDuration: transitionInfo.duration,
                  transitionsBuilder:
                      (context, animation, secondaryAnimation, child) =>
                          PageTransition(
                    type: transitionInfo.transitionType,
                    duration: transitionInfo.duration,
                    reverseDuration: transitionInfo.duration,
                    alignment: transitionInfo.alignment,
                    child: child,
                  ).buildTransitions(
                    context,
                    animation,
                    secondaryAnimation,
                    child,
                  ),
                )
              : MaterialPage(key: state.pageKey, child: child);
        },
        routes: routes,
      );
}

class TransitionInfo {
  const TransitionInfo({
    required this.hasTransition,
    this.transitionType = PageTransitionType.fade,
    this.duration = const Duration(milliseconds: 300),
    this.alignment,
  });

  final bool hasTransition;
  final PageTransitionType transitionType;
  final Duration duration;
  final Alignment? alignment;

  static TransitionInfo appDefault() => TransitionInfo(
        hasTransition: true,
        transitionType: PageTransitionType.fade,
        duration: Duration(milliseconds: 300),
      );
}

class RootPageContext {
  const RootPageContext(this.isRootPage, [this.errorRoute]);
  final bool isRootPage;
  final String? errorRoute;

  static bool isInactiveRootPage(BuildContext context) {
    final rootPageContext = context.read<RootPageContext?>();
    final isRootPage = rootPageContext?.isRootPage ?? false;
    final location = GoRouterState.of(context).uri.toString();
    return isRootPage &&
        location != '/' &&
        location != rootPageContext?.errorRoute;
  }

  static Widget wrap(Widget child, {String? errorRoute}) => Provider.value(
        value: RootPageContext(true, errorRoute),
        child: child,
      );
}

extension GoRouterLocationExtension on GoRouter {
  String getCurrentLocation() {
    final RouteMatch lastMatch = routerDelegate.currentConfiguration.last;
    final RouteMatchList matchList = lastMatch is ImperativeRouteMatch
        ? lastMatch.matches
        : routerDelegate.currentConfiguration;
    return matchList.uri.toString();
  }
}
