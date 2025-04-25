import '/auth/supabase_auth/auth_util.dart';
import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/components/skeleton_multi_line_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_drop_down.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/flutter_flow/form_field_controller.dart';
import '/custom_code/widgets/index.dart' as custom_widgets;
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:provider/provider.dart';
import 'edit_adress_model.dart';
export 'edit_adress_model.dart';

class EditAdressWidget extends StatefulWidget {
  const EditAdressWidget({
    super.key,
    String? id,
    required this.isConfirmed,
  }) : this.id = id ?? 'АДР';

  final String id;
  final Future Function(bool isConfirmed)? isConfirmed;

  @override
  State<EditAdressWidget> createState() => _EditAdressWidgetState();
}

class _EditAdressWidgetState extends State<EditAdressWidget> {
  late EditAdressModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => EditAdressModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.franchisee = null;
      _model.prices = null;
      _model.showShimmer = true;
      _model.updatePage(() {});
      _model.geoQuery = await LocGeoTable().queryRows(
        queryFn: (q) => q.eqOrNull(
          'loc_id',
          widget.id,
        ),
      );
      if (_model.geoQuery?.firstOrNull?.creator == currentUserEmail) {
        _model.canEdit = true;
        _model.updatePage(() {});
      } else {
        _model.canEdit = false;
        _model.updatePage(() {});
      }

      await Future.delayed(const Duration(milliseconds: 600));
      _model.showShimmer = false;
      _model.franchisee = _model.geoQuery?.firstOrNull?.franchisee;
      _model.prices = _model.geoQuery?.firstOrNull?.areaPrice;
      safeSetState(() {});
    });

    _model.nameTextController ??=
        TextEditingController(text: _model.geoQuery?.firstOrNull?.ruName);
    _model.nameFocusNode ??= FocusNode();

    _model.idTextController ??= TextEditingController(text: widget.id);
    _model.idFocusNode ??= FocusNode();

    _model.adressTextController1 ??=
        TextEditingController(text: _model.geoQuery?.firstOrNull?.adress);
    _model.adressFocusNode1 ??= FocusNode();

    _model.adressTextController2 ??=
        TextEditingController(text: _model.geoQuery?.firstOrNull?.city);
    _model.adressFocusNode2 ??= FocusNode();

    _model.forSiteTextController ??=
        TextEditingController(text: _model.geoQuery?.firstOrNull?.siteAdress);
    _model.forSiteFocusNode ??= FocusNode();

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
      padding: EdgeInsetsDirectional.fromSTEB(36.0, 0.0, 42.0, 0.0),
      child: Column(
        mainAxisSize: MainAxisSize.max,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Align(
            alignment: AlignmentDirectional(-1.0, 0.0),
            child: wrapWithModel(
              model: _model.tittleWithIconAndSubtittleModel,
              updateCallback: () => safeSetState(() {}),
              child: TittleWithIconAndSubtittleWidget(
                tittle: valueOrDefault<String>(
                  FFLocalizations.of(context).getVariableText(
                    ruText: 'Редактировать адрес',
                    enText: 'Edit adress',
                  ),
                  'Редактировать адрес',
                ),
                subtittle: 'Здесь можно изменить группу цен ',
                hasIcon: false,
                hasSubtittle: true,
              ),
            ),
          ),
          Container(
            constraints: BoxConstraints(
              maxHeight: 96.0,
            ),
            decoration: BoxDecoration(
              color: FlutterFlowTheme.of(context).secondaryBackground,
            ),
          ),
          Padding(
            padding: EdgeInsetsDirectional.fromSTEB(0.0, 48.0, 0.0, 36.0),
            child: Form(
              key: _model.formKey,
              autovalidateMode: AutovalidateMode.disabled,
              child: Builder(
                builder: (context) {
                  if (!_model.showShimmer) {
                    return Column(
                      mainAxisSize: MainAxisSize.max,
                      children: [
                        TextFormField(
                          controller: _model.nameTextController,
                          focusNode: _model.nameFocusNode,
                          autofocus: false,
                          textCapitalization: TextCapitalization.none,
                          readOnly: !_model.canEdit,
                          obscureText: false,
                          decoration: InputDecoration(
                            isDense: true,
                            labelText: FFLocalizations.of(context).getText(
                              '95ut8f31' /* Название */,
                            ),
                            labelStyle: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  color:
                                      FlutterFlowTheme.of(context).tertiaryText,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.w600,
                                ),
                            alignLabelWithHint: false,
                            hintStyle: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  color:
                                      FlutterFlowTheme.of(context).tertiaryText,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.normal,
                                ),
                            enabledBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context)
                                    .primaryBackground,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context).grayAlpha,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            errorBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context).error,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            focusedErrorBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context).error,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            filled: true,
                            fillColor:
                                FlutterFlowTheme.of(context).primaryBackground,
                          ),
                          style:
                              FlutterFlowTheme.of(context).bodyMedium.override(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.normal,
                                  ),
                          validator: _model.nameTextControllerValidator
                              .asValidator(context),
                        ),
                        TextFormField(
                          controller: _model.idTextController,
                          focusNode: _model.idFocusNode,
                          autofocus: false,
                          textCapitalization: TextCapitalization.characters,
                          textInputAction: TextInputAction.next,
                          readOnly: true,
                          obscureText: false,
                          decoration: InputDecoration(
                            isDense: true,
                            labelText: FFLocalizations.of(context).getText(
                              'kje4bd1w' /* ID */,
                            ),
                            labelStyle: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  color:
                                      FlutterFlowTheme.of(context).tertiaryText,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.w600,
                                ),
                            alignLabelWithHint: false,
                            hintText: FFLocalizations.of(context).getText(
                              'qywd414u' /* KUD */,
                            ),
                            hintStyle: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  color:
                                      FlutterFlowTheme.of(context).tertiaryText,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.normal,
                                ),
                            enabledBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context)
                                    .primaryBackground,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context).grayAlpha,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            errorBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context).error,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            focusedErrorBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context).error,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            filled: true,
                            fillColor:
                                FlutterFlowTheme.of(context).primaryBackground,
                          ),
                          style:
                              FlutterFlowTheme.of(context).bodyMedium.override(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.normal,
                                  ),
                          validator: _model.idTextControllerValidator
                              .asValidator(context),
                        ),
                        TextFormField(
                          controller: _model.adressTextController1,
                          focusNode: _model.adressFocusNode1,
                          autofocus: false,
                          textCapitalization: TextCapitalization.characters,
                          readOnly: !_model.canEdit,
                          obscureText: false,
                          decoration: InputDecoration(
                            isDense: true,
                            labelText: FFLocalizations.of(context).getText(
                              '1drvuc9t' /* Адрес */,
                            ),
                            labelStyle: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  color:
                                      FlutterFlowTheme.of(context).tertiaryText,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.w600,
                                ),
                            alignLabelWithHint: false,
                            hintStyle: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  color:
                                      FlutterFlowTheme.of(context).tertiaryText,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.normal,
                                ),
                            enabledBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context)
                                    .primaryBackground,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context).grayAlpha,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            errorBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context).error,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            focusedErrorBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context).error,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            filled: true,
                            fillColor:
                                FlutterFlowTheme.of(context).primaryBackground,
                          ),
                          style:
                              FlutterFlowTheme.of(context).bodyMedium.override(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.normal,
                                  ),
                          maxLines: 3,
                          minLines: 1,
                          validator: _model.adressTextController1Validator
                              .asValidator(context),
                        ),
                        TextFormField(
                          controller: _model.adressTextController2,
                          focusNode: _model.adressFocusNode2,
                          autofocus: false,
                          textCapitalization: TextCapitalization.characters,
                          readOnly: !_model.canEdit,
                          obscureText: false,
                          decoration: InputDecoration(
                            isDense: true,
                            labelText: FFLocalizations.of(context).getText(
                              'vm0co7z6' /* Город */,
                            ),
                            labelStyle: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  color:
                                      FlutterFlowTheme.of(context).tertiaryText,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.w600,
                                ),
                            alignLabelWithHint: false,
                            hintStyle: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  color:
                                      FlutterFlowTheme.of(context).tertiaryText,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.normal,
                                ),
                            enabledBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context)
                                    .primaryBackground,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context).grayAlpha,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            errorBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context).error,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            focusedErrorBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context).error,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            filled: true,
                            fillColor:
                                FlutterFlowTheme.of(context).primaryBackground,
                          ),
                          style:
                              FlutterFlowTheme.of(context).bodyMedium.override(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.normal,
                                  ),
                          maxLines: 3,
                          minLines: 1,
                          validator: _model.adressTextController2Validator
                              .asValidator(context),
                        ),
                        TextFormField(
                          controller: _model.forSiteTextController,
                          focusNode: _model.forSiteFocusNode,
                          autofocus: false,
                          textCapitalization: TextCapitalization.characters,
                          readOnly: !_model.canEdit,
                          obscureText: false,
                          decoration: InputDecoration(
                            isDense: true,
                            labelText: FFLocalizations.of(context).getText(
                              '4h4xu55m' /* Адрес на сайте */,
                            ),
                            labelStyle: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  color:
                                      FlutterFlowTheme.of(context).tertiaryText,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.w600,
                                ),
                            alignLabelWithHint: false,
                            hintStyle: FlutterFlowTheme.of(context)
                                .bodyMedium
                                .override(
                                  fontFamily: 'Montserrat',
                                  color:
                                      FlutterFlowTheme.of(context).tertiaryText,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.normal,
                                ),
                            enabledBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context)
                                    .primaryBackground,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context).grayAlpha,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            errorBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context).error,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            focusedErrorBorder: OutlineInputBorder(
                              borderSide: BorderSide(
                                color: FlutterFlowTheme.of(context).error,
                                width: 2.0,
                              ),
                              borderRadius: BorderRadius.circular(16.0),
                            ),
                            filled: true,
                            fillColor:
                                FlutterFlowTheme.of(context).primaryBackground,
                          ),
                          style:
                              FlutterFlowTheme.of(context).bodyMedium.override(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.normal,
                                  ),
                          maxLines: 3,
                          minLines: 1,
                          validator: _model.forSiteTextControllerValidator
                              .asValidator(context),
                        ),
                        Row(
                          mainAxisSize: MainAxisSize.max,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              width: 152.0,
                              height: 70.0,
                              constraints: BoxConstraints(
                                maxHeight: 70.0,
                              ),
                              decoration: BoxDecoration(),
                              child: Column(
                                mainAxisSize: MainAxisSize.max,
                                children: [
                                  Align(
                                    alignment: AlignmentDirectional(-1.0, 0.0),
                                    child: Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          16.0, 0.0, 0.0, 4.0),
                                      child: Text(
                                        FFLocalizations.of(context).getText(
                                          'wwdfdfio' /* Франшиза: */,
                                        ),
                                        style: FlutterFlowTheme.of(context)
                                            .labelMedium
                                            .override(
                                              fontFamily: 'Montserrat',
                                              letterSpacing: 0.0,
                                              fontWeight: FontWeight.normal,
                                            ),
                                      ),
                                    ),
                                  ),

                                  // изменять франшизу может только франчайзер
                                  FutureBuilder<List<FranchiseRow>>(
                                    future: FranchiseTable().queryRows(
                                      queryFn: (q) => q,
                                    ),
                                    builder: (context, snapshot) {
                                      // Customize what your widget looks like when it's loading.
                                      if (!snapshot.hasData) {
                                        return Container(
                                          height: 36.0,
                                          child: SkeletonMultiLineWidget(
                                            height: 36.0,
                                            itemsQty: 1,
                                            radii: 16,
                                            spacer: 16,
                                          ),
                                        );
                                      }
                                      List<FranchiseRow>
                                          dropDownFrFranchiseRowList =
                                          snapshot.data!;

                                      return FlutterFlowDropDown<int>(
                                        controller:
                                            _model.dropDownFrValueController ??=
                                                FormFieldController<int>(
                                          _model.dropDownFrValue ??= _model
                                              .geoQuery
                                              ?.firstOrNull
                                              ?.franchisee,
                                        ),
                                        options: List<int>.from(
                                            dropDownFrFranchiseRowList
                                                .map((e) => e.id)
                                                .toList()),
                                        optionLabels: dropDownFrFranchiseRowList
                                            .map((e) => e.id.toString())
                                            .toList(),
                                        onChanged: (val) async {
                                          safeSetState(() =>
                                              _model.dropDownFrValue = val);
                                          _model.franchisee =
                                              _model.dropDownFrValue;
                                          safeSetState(() {});
                                        },
                                        width: 160.0,
                                        height: 44.0,
                                        textStyle: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Montserrat',
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .tertiaryText,
                                              letterSpacing: 0.0,
                                              fontWeight: FontWeight.w600,
                                            ),
                                        hintText: _model
                                            .geoQuery?.firstOrNull?.franchisee
                                            ?.toString(),
                                        icon: Icon(
                                          Icons.keyboard_arrow_down_rounded,
                                          color: FlutterFlowTheme.of(context)
                                              .tertiaryText,
                                          size: 22.0,
                                        ),
                                        fillColor: FlutterFlowTheme.of(context)
                                            .primaryBackground,
                                        elevation: 1.0,
                                        borderColor: Colors.transparent,
                                        borderWidth: 0.0,
                                        borderRadius: 16.0,
                                        margin: EdgeInsetsDirectional.fromSTEB(
                                            16.0, 4.0, 16.0, 4.0),
                                        hidesUnderline: true,
                                        disabled: !FFAppState()
                                            .permLevel
                                            .contains(PermLevel.full),
                                        isOverButton: false,
                                        isSearchable: false,
                                        isMultiSelect: false,
                                        labelText:
                                            FFLocalizations.of(context).getText(
                                          'qf0rwqkb' /* Выбрать */,
                                        ),
                                        labelTextStyle: FlutterFlowTheme.of(
                                                context)
                                            .labelMedium
                                            .override(
                                              fontFamily: 'Montserrat',
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .tertiaryText,
                                              letterSpacing: 0.0,
                                            ),
                                      );
                                    },
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              width: 152.0,
                              height: 70.0,
                              constraints: BoxConstraints(
                                maxHeight: 70.0,
                              ),
                              decoration: BoxDecoration(),
                              child: Column(
                                mainAxisSize: MainAxisSize.max,
                                children: [
                                  Align(
                                    alignment: AlignmentDirectional(-1.0, 0.0),
                                    child: Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          16.0, 0.0, 0.0, 4.0),
                                      child: Text(
                                        FFLocalizations.of(context).getText(
                                          'y3anagld' /* Группа цен: */,
                                        ),
                                        style: FlutterFlowTheme.of(context)
                                            .labelMedium
                                            .override(
                                              fontFamily: 'Montserrat',
                                              letterSpacing: 0.0,
                                              fontWeight: FontWeight.normal,
                                            ),
                                      ),
                                    ),
                                  ),
                                  FutureBuilder<List<AreaPricesRow>>(
                                    future: AreaPricesTable().queryRows(
                                      queryFn: (q) => q,
                                    ),
                                    builder: (context, snapshot) {
                                      // Customize what your widget looks like when it's loading.
                                      if (!snapshot.hasData) {
                                        return Container(
                                          height: 36.0,
                                          child: SkeletonMultiLineWidget(
                                            height: 36.0,
                                            itemsQty: 1,
                                            radii: 16,
                                            spacer: 16,
                                          ),
                                        );
                                      }
                                      List<AreaPricesRow>
                                          dropDownPricesAreaPricesRowList =
                                          snapshot.data!;

                                      return FlutterFlowDropDown<int>(
                                        controller: _model
                                                .dropDownPricesValueController ??=
                                            FormFieldController<int>(
                                          _model.dropDownPricesValue ??= _model
                                              .geoQuery?.firstOrNull?.areaPrice,
                                        ),
                                        options: List<int>.from(
                                            dropDownPricesAreaPricesRowList
                                                .map((e) => e.priceId)
                                                .toList()),
                                        optionLabels:
                                            dropDownPricesAreaPricesRowList
                                                .map(
                                                    (e) => e.priceId.toString())
                                                .toList(),
                                        onChanged: (val) async {
                                          safeSetState(() =>
                                              _model.dropDownPricesValue = val);
                                          _model.prices =
                                              _model.dropDownPricesValue;
                                          safeSetState(() {});
                                        },
                                        width: 160.0,
                                        height: 44.0,
                                        textStyle: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Montserrat',
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .tertiaryText,
                                              letterSpacing: 0.0,
                                              fontWeight: FontWeight.w600,
                                            ),
                                        hintText: _model.prices.toString(),
                                        icon: Icon(
                                          Icons.keyboard_arrow_down_rounded,
                                          color: FlutterFlowTheme.of(context)
                                              .tertiaryText,
                                          size: 22.0,
                                        ),
                                        fillColor: FlutterFlowTheme.of(context)
                                            .primaryBackground,
                                        elevation: 1.0,
                                        borderColor: Colors.transparent,
                                        borderWidth: 0.0,
                                        borderRadius: 16.0,
                                        margin: EdgeInsetsDirectional.fromSTEB(
                                            16.0, 4.0, 16.0, 4.0),
                                        hidesUnderline: true,
                                        disabled: !_model.canEdit,
                                        isOverButton: false,
                                        isSearchable: false,
                                        isMultiSelect: false,
                                        labelText:
                                            FFLocalizations.of(context).getText(
                                          'enendhkl' /* Выбрать */,
                                        ),
                                        labelTextStyle: FlutterFlowTheme.of(
                                                context)
                                            .labelMedium
                                            .override(
                                              fontFamily: 'Montserrat',
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .tertiaryText,
                                              letterSpacing: 0.0,
                                            ),
                                      );
                                    },
                                  ),
                                ],
                              ),
                            ),
                          ].divide(SizedBox(width: 8.0)),
                        ),
                      ].divide(SizedBox(height: 24.0)),
                    );
                  } else {
                    return Container(
                      width: MediaQuery.sizeOf(context).width * 1.0,
                      height: 348.0,
                      child: custom_widgets.DrawlerAdressShimmer(
                        width: MediaQuery.sizeOf(context).width * 1.0,
                        height: 348.0,
                        borderRadius: 16.0,
                      ),
                    );
                  }
                },
              ),
            ),
          ),
          Align(
            alignment: AlignmentDirectional(0.0, 0.0),
            child: FFButtonWidget(
              onPressed: (!_model.canEdit ||
                      !FFAppState().permLevel.contains(PermLevel.full) ||
                      ((_model.nameTextController.text == '') &&
                          (_model.adressTextController1.text == '')))
                  ? null
                  : () async {
                      await LocGeoTable().update(
                        data: {
                          'adress': _model.adressTextController1.text,
                          'ru_name': _model.nameTextController.text,
                          'site_adress': _model.forSiteTextController.text,
                          'area_price': _model.dropDownPricesValue,
                          'franchisee': _model.dropDownFrValue,
                          'city': _model.adressTextController2.text,
                        },
                        matchingRows: (rows) => rows.eqOrNull(
                          'loc_id',
                          widget.id,
                        ),
                      );
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            'Баг: чтобы увидеть изменения нажо обновить страницу',
                            style: TextStyle(
                              color: FlutterFlowTheme.of(context).primaryText,
                            ),
                          ),
                          duration: Duration(milliseconds: 4000),
                          backgroundColor:
                              FlutterFlowTheme.of(context).secondary,
                        ),
                      );
                      await widget.isConfirmed?.call(
                        true,
                      );
                      _model.franchisee = null;
                      _model.prices = null;
                      _model.canEdit = false;
                      _model.showShimmer = true;
                      safeSetState(() {});
                    },
              text: FFLocalizations.of(context).getText(
                'tbpr8w1q' /* Изменить адрес */,
              ),
              options: FFButtonOptions(
                width: double.infinity,
                height: 44.0,
                padding: EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 0.0),
                iconPadding: EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 0.0),
                color: FlutterFlowTheme.of(context).primary,
                textStyle: FlutterFlowTheme.of(context).labelLarge.override(
                      fontFamily: 'Montserrat',
                      color: FlutterFlowTheme.of(context).info,
                      fontSize: 16.0,
                      letterSpacing: 0.0,
                      fontWeight: FontWeight.w600,
                    ),
                elevation: 1.0,
                borderSide: BorderSide(
                  color: Colors.transparent,
                  width: 1.0,
                ),
                borderRadius: BorderRadius.circular(16.0),
                disabledColor: FlutterFlowTheme.of(context).alternate,
              ),
            ),
          ),
          Align(
            alignment: AlignmentDirectional(0.0, 0.0),
            child: Padding(
              padding: EdgeInsetsDirectional.fromSTEB(0.0, 12.0, 0.0, 0.0),
              child: FFButtonWidget(
                onPressed: () async {
                  Navigator.pop(context);
                  safeSetState(() {
                    _model.dropDownPricesValueController?.reset();
                    _model.dropDownFrValueController?.reset();
                  });
                  _model.franchisee = null;
                  _model.prices = null;
                  safeSetState(() {});
                  safeSetState(() {
                    _model.nameTextController?.text =
                        _model.geoQuery!.firstOrNull!.ruName;

                    _model.idTextController?.text = widget.id;

                    _model.adressTextController1?.text =
                        _model.geoQuery!.firstOrNull!.adress!;

                    _model.forSiteTextController?.text =
                        _model.geoQuery!.firstOrNull!.siteAdress!;
                  });
                },
                text: FFLocalizations.of(context).getText(
                  'kx7p2l46' /* Отмена */,
                ),
                options: FFButtonOptions(
                  width: double.infinity,
                  height: 44.0,
                  padding: EdgeInsetsDirectional.fromSTEB(16.0, 4.0, 16.0, 4.0),
                  iconPadding:
                      EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 0.0),
                  color: Colors.transparent,
                  textStyle: FlutterFlowTheme.of(context).bodyLarge.override(
                        fontFamily: 'Montserrat',
                        color: FlutterFlowTheme.of(context).secondaryText,
                        letterSpacing: 0.0,
                        fontWeight: FontWeight.w600,
                      ),
                  elevation: 0.0,
                  borderSide: BorderSide(
                    color: FlutterFlowTheme.of(context).alternate,
                    width: 1.0,
                  ),
                  borderRadius: BorderRadius.circular(16.0),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
