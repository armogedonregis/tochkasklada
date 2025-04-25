import '/auth/supabase_auth/auth_util.dart';
import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/custom_code/widgets/index.dart' as custom_widgets;
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';
import 'loc_geo_row_model.dart';
export 'loc_geo_row_model.dart';

class LocGeoRowWidget extends StatefulWidget {
  const LocGeoRowWidget({
    super.key,
    required this.id,
  });

  final String? id;

  @override
  State<LocGeoRowWidget> createState() => _LocGeoRowWidgetState();
}

class _LocGeoRowWidgetState extends State<LocGeoRowWidget> {
  late LocGeoRowModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => LocGeoRowModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.geoQuery = await LocGeoTable().queryRows(
        queryFn: (q) => q.eqOrNull(
          'loc_id',
          widget.id,
        ),
      );
      if (_model.geoQuery?.firstOrNull?.creator == currentUserEmail) {
        _model.isCreator = true;
        _model.updatePage(() {});
      } else {
        _model.isCreator = false;
        _model.updatePage(() {});
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
      padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 24.0, 0.0),
      child: Container(
        width: double.infinity,
        height: 48.0,
        decoration: BoxDecoration(
          color: FlutterFlowTheme.of(context).secondaryBackground,
          boxShadow: [
            BoxShadow(
              blurRadius: 0.0,
              color: Color(0x33000000),
              offset: Offset(
                0.0,
                1.0,
              ),
            )
          ],
          borderRadius: BorderRadius.circular(0.0),
        ),
        child: Builder(
          builder: (context) {
            if (widget.id != null && widget.id != '') {
              return Padding(
                padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 0.0),
                child: Row(
                  mainAxisSize: MainAxisSize.max,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Padding(
                      padding:
                          EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 0.0, 0.0),
                      child: Container(
                        width: 100.0,
                        decoration: BoxDecoration(),
                        child: Text(
                          _model.geoQuery!.firstOrNull!.ruName,
                          style:
                              FlutterFlowTheme.of(context).labelMedium.override(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.normal,
                                  ),
                        ),
                      ),
                    ),
                    Container(
                      width: 80.0,
                      decoration: BoxDecoration(),
                      child: Text(
                        _model.geoQuery!.firstOrNull!.locId,
                        style:
                            FlutterFlowTheme.of(context).labelMedium.override(
                                  fontFamily: 'Montserrat',
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.bold,
                                ),
                      ),
                    ),
                    Container(
                      width: 40.0,
                      decoration: BoxDecoration(),
                      child: Text(
                        _model.geoQuery!.firstOrNull!.franchisee!.toString(),
                        style:
                            FlutterFlowTheme.of(context).labelMedium.override(
                                  fontFamily: 'Montserrat',
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.bold,
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
                          width: 260.0,
                          decoration: BoxDecoration(),
                          child: Column(
                            mainAxisSize: MainAxisSize.max,
                            mainAxisAlignment: MainAxisAlignment.center,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _model.geoQuery!.firstOrNull!.adress!,
                                style: FlutterFlowTheme.of(context)
                                    .labelMedium
                                    .override(
                                      fontFamily: 'Montserrat',
                                      letterSpacing: 0.0,
                                      fontWeight: FontWeight.normal,
                                    ),
                              ),
                              Text(
                                valueOrDefault<String>(
                                  _model.geoQuery?.firstOrNull?.city,
                                  'Санкт-Петербкрг',
                                ),
                                style: FlutterFlowTheme.of(context)
                                    .labelMedium
                                    .override(
                                      fontFamily: 'Montserrat',
                                      letterSpacing: 0.0,
                                      fontWeight: FontWeight.normal,
                                    ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    Container(
                      width: 106.0,
                      decoration: BoxDecoration(),
                      child: Text(
                        _model.geoQuery!.firstOrNull!.areaPrice!.toString(),
                        style:
                            FlutterFlowTheme.of(context).labelMedium.override(
                                  fontFamily: 'Montserrat',
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.bold,
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
                          width: 100.0,
                          decoration: BoxDecoration(),
                          child: Visibility(
                            visible: responsiveVisibility(
                              context: context,
                              phone: false,
                              tablet: false,
                            ),
                            child: Text(
                              _model.geoQuery!.firstOrNull!.siteAdress!,
                              textAlign: TextAlign.end,
                              style: FlutterFlowTheme.of(context)
                                  .bodySmall
                                  .override(
                                    fontFamily: 'Montserrat',
                                    color: FlutterFlowTheme.of(context)
                                        .secondaryText,
                                    letterSpacing: 0.0,
                                  ),
                            ),
                          ),
                        ),
                      ),
                    Container(
                      width: 48.0,
                      height: 48.0,
                      decoration: BoxDecoration(),
                      child: Visibility(
                        visible: responsiveVisibility(
                          context: context,
                          phone: false,
                        ),
                        child: Builder(
                          builder: (context) {
                            if (_model.geoQuery?.firstOrNull?.creator !=
                                currentUserEmail) {
                              return Visibility(
                                visible: !_model.isCreator,
                                child: Icon(
                                  Icons.edit_off_rounded,
                                  color: FlutterFlowTheme.of(context).secondary,
                                  size: 24.0,
                                ),
                              );
                            } else {
                              return Visibility(
                                visible: valueOrDefault<bool>(
                                  valueOrDefault<bool>(
                                        FFAppState()
                                            .permLevel
                                            .contains(PermLevel.full),
                                        false,
                                      ) &&
                                      ((_model.geoQuery?.firstOrNull
                                                  ?.franchisee ==
                                              null) ||
                                          (_model.geoQuery?.firstOrNull
                                                  ?.franchisee ==
                                              0)),
                                  false,
                                ),
                                child: FlutterFlowIconButton(
                                  borderColor: Colors.transparent,
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
                                        await LocGeoTable().delete(
                                      matchingRows: (rows) => rows.eqOrNull(
                                        'loc_id',
                                        widget.id,
                                      ),
                                      returnRows: true,
                                    );

                                    _model.updatePage(() {});

                                    safeSetState(() {});
                                  },
                                ),
                              );
                            }
                          },
                        ),
                      ),
                    ),
                  ].divide(SizedBox(width: 12.0)),
                ),
              );
            } else {
              return Container(
                width: MediaQuery.sizeOf(context).width * 1.0,
                height: 36.0,
                child: custom_widgets.ShimmerAdress(
                  width: MediaQuery.sizeOf(context).width * 1.0,
                  height: 36.0,
                  radii: 16.0,
                ),
              );
            }
          },
        ),
      ),
    );
  }
}
