import '/components/logo_icon_widget.dart';
import '/components/nav_bottom_shit_widget.dart';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'breadcrumps_model.dart';
export 'breadcrumps_model.dart';

class BreadcrumpsWidget extends StatefulWidget {
  const BreadcrumpsWidget({
    super.key,
    required this.iconForSection,
    String? currentSectionTittle,
    bool? isSubpage,
  })  : this.currentSectionTittle = currentSectionTittle ?? 'PageName',
        this.isSubpage = isSubpage ?? false;

  final Widget? iconForSection;
  final String currentSectionTittle;
  final bool isSubpage;

  @override
  State<BreadcrumpsWidget> createState() => _BreadcrumpsWidgetState();
}

class _BreadcrumpsWidgetState extends State<BreadcrumpsWidget> {
  late BreadcrumpsModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => BreadcrumpsModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsetsDirectional.fromSTEB(0.0, 12.0, 0.0, 12.0),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          mainAxisSize: MainAxisSize.max,
          children: [
            if (responsiveVisibility(
              context: context,
              tabletLandscape: false,
              desktop: false,
            ))
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(4.0, 0.0, 0.0, 0.0),
                child: InkWell(
                  splashColor: Colors.transparent,
                  focusColor: Colors.transparent,
                  hoverColor: Colors.transparent,
                  highlightColor: Colors.transparent,
                  onTap: () async {
                    await showModalBottomSheet(
                      isScrollControlled: true,
                      backgroundColor: Colors.transparent,
                      barrierColor:
                          FlutterFlowTheme.of(context).primaryBackground,
                      enableDrag: false,
                      context: context,
                      builder: (context) {
                        return Padding(
                          padding: MediaQuery.viewInsetsOf(context),
                          child: Container(
                            height: MediaQuery.sizeOf(context).height * 1.0,
                            child: NavBottomShitWidget(),
                          ),
                        );
                      },
                    ).then((value) => safeSetState(() {}));
                  },
                  child: wrapWithModel(
                    model: _model.logoIconModel,
                    updateCallback: () => safeSetState(() {}),
                    child: LogoIconWidget(),
                  ),
                ),
              ),
            if (responsiveVisibility(
              context: context,
              phone: false,
              tablet: false,
            ))
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(0.0, 2.0, 0.0, 2.0),
                child: FlutterFlowIconButton(
                  borderColor: Colors.transparent,
                  borderRadius: 30.0,
                  borderWidth: 1.0,
                  buttonSize: 40.0,
                  icon: FaIcon(
                    FontAwesomeIcons.userCog,
                    color: FlutterFlowTheme.of(context).secondaryText,
                    size: 22.0,
                  ),
                  onPressed: !widget.isSubpage
                      ? null
                      : () {
                          print('IconButton pressed ...');
                        },
                ),
              ),
            Padding(
              padding: EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 8.0, 0.0),
              child: Icon(
                Icons.chevron_right_rounded,
                color: FlutterFlowTheme.of(context).secondaryText,
                size: 16.0,
              ),
            ),
            Padding(
              padding: EdgeInsetsDirectional.fromSTEB(0.0, 8.0, 8.0, 8.0),
              child: Container(
                height: 32.0,
                decoration: BoxDecoration(
                  color: FlutterFlowTheme.of(context).alternate,
                  borderRadius: BorderRadius.circular(12.0),
                ),
                alignment: AlignmentDirectional(0.0, 0.0),
                child: Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(12.0, 4.0, 12.0, 4.0),
                  child: Text(
                    valueOrDefault<String>(
                      widget.currentSectionTittle,
                      'Tittle',
                    ),
                    style: FlutterFlowTheme.of(context).bodyMedium.override(
                          fontFamily: 'Montserrat',
                          color: FlutterFlowTheme.of(context).primaryText,
                          letterSpacing: 0.0,
                        ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
