import '/auth/supabase_auth/auth_util.dart';
import '/backend/supabase/supabase.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_drop_down.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/flutter_flow/form_field_controller.dart';
import '/flutter_flow/custom_functions.dart' as functions;
import 'package:easy_debounce/easy_debounce.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:provider/provider.dart';
import 'create_adress_model.dart';
export 'create_adress_model.dart';

class CreateAdressWidget extends StatefulWidget {
  const CreateAdressWidget({super.key});

  @override
  State<CreateAdressWidget> createState() => _CreateAdressWidgetState();
}

class _CreateAdressWidgetState extends State<CreateAdressWidget> {
  late CreateAdressModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => CreateAdressModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.franchisee = null;
      _model.prices = null;
      _model.updatePage(() {});
    });

    _model.nameTextController ??= TextEditingController();
    _model.nameFocusNode ??= FocusNode();

    _model.adressTextController1 ??= TextEditingController();
    _model.adressFocusNode1 ??= FocusNode();

    _model.adressTextController2 ??= TextEditingController();
    _model.adressFocusNode2 ??= FocusNode();

    _model.forSiteTextController ??= TextEditingController();
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
                    ruText: 'Добавить адрес',
                    enText: 'Add adress',
                  ),
                  'Добавить адрес',
                ),
                subtittle: 'Для новой или существующей франшизы',
                hasIcon: false,
                hasSubtittle: true,
              ),
            ),
          ),
          Container(
            constraints: BoxConstraints(
              maxHeight: 96.0,
            ),
            decoration: BoxDecoration(),
          ),
          Padding(
            padding: EdgeInsetsDirectional.fromSTEB(0.0, 48.0, 0.0, 36.0),
            child: Form(
              key: _model.formKey,
              autovalidateMode: AutovalidateMode.disabled,
              child: Column(
                mainAxisSize: MainAxisSize.max,
                children: [
                  Align(
                    alignment: AlignmentDirectional(1.0, 0.0),
                    child: Stack(
                      alignment: AlignmentDirectional(1.0, 0.0),
                      children: [
                        TextFormField(
                          controller: _model.nameTextController,
                          focusNode: _model.nameFocusNode,
                          onChanged: (_) => EasyDebounce.debounce(
                            '_model.nameTextController',
                            Duration(milliseconds: 2000),
                            () async {
                              _model.ids = functions
                                  .generateID(_model.nameTextController.text)
                                  .toList()
                                  .cast<String>();
                              safeSetState(() {});
                              _model.checkID = await LocGeoTable().queryRows(
                                queryFn: (q) => q,
                              );
                              _model.existingIDs = _model.checkID!
                                  .map((e) => e.locId)
                                  .toList()
                                  .cast<String>();
                              _model.id = functions.findFirstUniqueId(
                                  _model.ids.toList(),
                                  _model.existingIDs.toList());
                              safeSetState(() {});

                              safeSetState(() {});
                            },
                          ),
                          autofocus: false,
                          textCapitalization: TextCapitalization.none,
                          obscureText: false,
                          decoration: InputDecoration(
                            isDense: true,
                            labelText: FFLocalizations.of(context).getText(
                              'j6fhrl4c' /* Название */,
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
                        if (_model.id != null && _model.id != '')
                          InkWell(
                            splashColor: Colors.transparent,
                            focusColor: Colors.transparent,
                            hoverColor: Colors.transparent,
                            highlightColor: Colors.transparent,
                            onTap: () async {
                              _model.id =
                                  functions.generateRandomId(_model.id!);
                              safeSetState(() {});
                            },
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                Padding(
                                  padding: EdgeInsetsDirectional.fromSTEB(
                                      0.0, 0.0, 4.0, 0.0),
                                  child: Text(
                                    valueOrDefault<String>(
                                      _model.id,
                                      'ID',
                                    ),
                                    textAlign: TextAlign.end,
                                    style: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .override(
                                          fontFamily: 'Montserrat',
                                          color: FlutterFlowTheme.of(context)
                                              .tertiaryText,
                                          letterSpacing: 0.0,
                                          fontWeight: FontWeight.bold,
                                        ),
                                  ),
                                ),
                                Padding(
                                  padding: EdgeInsetsDirectional.fromSTEB(
                                      0.0, 0.0, 16.0, 0.0),
                                  child: Icon(
                                    Icons.refresh_outlined,
                                    color: FlutterFlowTheme.of(context).primary,
                                    size: 24.0,
                                  ),
                                ),
                              ],
                            ),
                          ),
                      ],
                    ),
                  ),
                  TextFormField(
                    controller: _model.adressTextController1,
                    focusNode: _model.adressFocusNode1,
                    autofocus: false,
                    textCapitalization: TextCapitalization.characters,
                    obscureText: false,
                    decoration: InputDecoration(
                      isDense: true,
                      labelText: FFLocalizations.of(context).getText(
                        '6qfutz5f' /* Адрес */,
                      ),
                      labelStyle: FlutterFlowTheme.of(context)
                          .bodyMedium
                          .override(
                            fontFamily: 'Montserrat',
                            color: FlutterFlowTheme.of(context).tertiaryText,
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.w600,
                          ),
                      alignLabelWithHint: false,
                      hintStyle: FlutterFlowTheme.of(context)
                          .bodyMedium
                          .override(
                            fontFamily: 'Montserrat',
                            color: FlutterFlowTheme.of(context).tertiaryText,
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.normal,
                          ),
                      enabledBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: FlutterFlowTheme.of(context).primaryBackground,
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
                      fillColor: FlutterFlowTheme.of(context).primaryBackground,
                    ),
                    style: FlutterFlowTheme.of(context).bodyMedium.override(
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
                    obscureText: false,
                    decoration: InputDecoration(
                      isDense: true,
                      labelText: FFLocalizations.of(context).getText(
                        't7m3ygjo' /* Город */,
                      ),
                      labelStyle: FlutterFlowTheme.of(context)
                          .bodyMedium
                          .override(
                            fontFamily: 'Montserrat',
                            color: FlutterFlowTheme.of(context).tertiaryText,
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.w600,
                          ),
                      alignLabelWithHint: false,
                      hintStyle: FlutterFlowTheme.of(context)
                          .bodyMedium
                          .override(
                            fontFamily: 'Montserrat',
                            color: FlutterFlowTheme.of(context).tertiaryText,
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.normal,
                          ),
                      enabledBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: FlutterFlowTheme.of(context).primaryBackground,
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
                      fillColor: FlutterFlowTheme.of(context).primaryBackground,
                    ),
                    style: FlutterFlowTheme.of(context).bodyMedium.override(
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
                    obscureText: false,
                    decoration: InputDecoration(
                      isDense: true,
                      labelText: FFLocalizations.of(context).getText(
                        'nxvqjdjl' /* Адрес на сайте */,
                      ),
                      labelStyle: FlutterFlowTheme.of(context)
                          .bodyMedium
                          .override(
                            fontFamily: 'Montserrat',
                            color: FlutterFlowTheme.of(context).tertiaryText,
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.w600,
                          ),
                      alignLabelWithHint: false,
                      hintStyle: FlutterFlowTheme.of(context)
                          .bodyMedium
                          .override(
                            fontFamily: 'Montserrat',
                            color: FlutterFlowTheme.of(context).tertiaryText,
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.normal,
                          ),
                      enabledBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: FlutterFlowTheme.of(context).primaryBackground,
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
                      fillColor: FlutterFlowTheme.of(context).primaryBackground,
                    ),
                    style: FlutterFlowTheme.of(context).bodyMedium.override(
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
                      FutureBuilder<List<FranchiseRow>>(
                        future: FranchiseTable().queryRows(
                          queryFn: (q) => q,
                        ),
                        builder: (context, snapshot) {
                          // Customize what your widget looks like when it's loading.
                          if (!snapshot.hasData) {
                            return Center(
                              child: SizedBox(
                                width: 50.0,
                                height: 50.0,
                                child: SpinKitWanderingCubes(
                                  color: FlutterFlowTheme.of(context).primary,
                                  size: 50.0,
                                ),
                              ),
                            );
                          }
                          List<FranchiseRow> containerFranchiseRowList =
                              snapshot.data!;

                          return Container(
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
                                        'ztp7sb6k' /* Франшиза: */,
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
                                FlutterFlowDropDown<String>(
                                  controller:
                                      _model.dropDownFrValueController ??=
                                          FormFieldController<String>(
                                    _model.dropDownFrValue ??=
                                        FFAppState().franchisee.toString(),
                                  ),
                                  options: containerFranchiseRowList
                                      .map((e) => e.id.toString())
                                      .toList(),
                                  onChanged: (val) async {
                                    safeSetState(
                                        () => _model.dropDownFrValue = val);
                                    _model.franchisee =
                                        containerFranchiseRowList
                                            .firstOrNull?.id;
                                    safeSetState(() {});
                                  },
                                  width: 160.0,
                                  height: 44.0,
                                  textStyle: FlutterFlowTheme.of(context)
                                      .bodyMedium
                                      .override(
                                        fontFamily: 'Montserrat',
                                        color: FlutterFlowTheme.of(context)
                                            .tertiaryText,
                                        letterSpacing: 0.0,
                                        fontWeight: FontWeight.w600,
                                      ),
                                  hintText: FFLocalizations.of(context).getText(
                                    '7jc7xijf' /* не выбрано */,
                                  ),
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
                                  isOverButton: false,
                                  isSearchable: false,
                                  isMultiSelect: false,
                                  labelText:
                                      FFLocalizations.of(context).getText(
                                    '9m95lomu' /* Выбрать */,
                                  ),
                                  labelTextStyle: FlutterFlowTheme.of(context)
                                      .labelMedium
                                      .override(
                                        fontFamily: 'Montserrat',
                                        color: FlutterFlowTheme.of(context)
                                            .tertiaryText,
                                        letterSpacing: 0.0,
                                      ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                      FutureBuilder<List<AreaPricesRow>>(
                        future: AreaPricesTable().queryRows(
                          queryFn: (q) => q,
                        ),
                        builder: (context, snapshot) {
                          // Customize what your widget looks like when it's loading.
                          if (!snapshot.hasData) {
                            return Center(
                              child: SizedBox(
                                width: 50.0,
                                height: 50.0,
                                child: SpinKitWanderingCubes(
                                  color: FlutterFlowTheme.of(context).primary,
                                  size: 50.0,
                                ),
                              ),
                            );
                          }
                          List<AreaPricesRow> containerAreaPricesRowList =
                              snapshot.data!;

                          return Container(
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
                                        'sl59mf6l' /* Группа цен: */,
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
                                FlutterFlowDropDown<String>(
                                  controller:
                                      _model.dropDownPrValueController ??=
                                          FormFieldController<String>(null),
                                  options: containerAreaPricesRowList
                                      .map((e) => e.priceId.toString())
                                      .toList(),
                                  onChanged: (val) async {
                                    safeSetState(
                                        () => _model.dropDownPrValue = val);
                                    _model.prices = containerAreaPricesRowList
                                        .firstOrNull?.priceId;
                                    safeSetState(() {});
                                  },
                                  width: 160.0,
                                  height: 44.0,
                                  textStyle: FlutterFlowTheme.of(context)
                                      .bodyMedium
                                      .override(
                                        fontFamily: 'Montserrat',
                                        color: FlutterFlowTheme.of(context)
                                            .tertiaryText,
                                        letterSpacing: 0.0,
                                        fontWeight: FontWeight.w600,
                                      ),
                                  hintText: FFLocalizations.of(context).getText(
                                    '9n4h7qf8' /* не выбрано */,
                                  ),
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
                                  isOverButton: false,
                                  isSearchable: false,
                                  isMultiSelect: false,
                                  labelText:
                                      FFLocalizations.of(context).getText(
                                    'fdeikhoy' /* Выбрать */,
                                  ),
                                  labelTextStyle: FlutterFlowTheme.of(context)
                                      .labelMedium
                                      .override(
                                        fontFamily: 'Montserrat',
                                        color: FlutterFlowTheme.of(context)
                                            .tertiaryText,
                                        letterSpacing: 0.0,
                                      ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ].divide(SizedBox(width: 8.0)),
                  ),
                ].divide(SizedBox(height: 24.0)),
              ),
            ),
          ),
          Align(
            alignment: AlignmentDirectional(0.0, 0.0),
            child: FFButtonWidget(
              onPressed: (_model.nameTextController.text == '')
                  ? null
                  : () async {
                      _model.createNewGeo = await LocGeoTable().insert({
                        'adress': _model.adressTextController1.text,
                        'ru_name': _model.nameTextController.text,
                        'site_adress': _model.forSiteTextController.text,
                        'area_price': _model.prices,
                        'franchisee': _model.franchisee,
                        'creator': currentUserEmail,
                        'created_by': currentUserUid,
                        'loc_id': _model.id,
                        'city': _model.adressTextController2.text,
                      });
                      await Future.delayed(const Duration(milliseconds: 500));
                      if (Scaffold.of(context).isDrawerOpen ||
                          Scaffold.of(context).isEndDrawerOpen) {
                        Navigator.pop(context);
                      }

                      _model.franchisee = null;
                      _model.prices = null;
                      _model.id = null;
                      _model.ids = [];
                      _model.existingIDs = [];
                      _model.updatePage(() {});
                      safeSetState(() {
                        _model.nameTextController?.clear();
                        _model.adressTextController1?.clear();
                        _model.forSiteTextController?.clear();
                      });
                      safeSetState(() {
                        _model.dropDownPrValueController?.reset();
                        _model.dropDownFrValueController?.reset();
                      });

                      safeSetState(() {});
                    },
              text: FFLocalizations.of(context).getText(
                'kogroebp' /* Создать адрес */,
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
                    _model.dropDownPrValueController?.reset();
                    _model.dropDownFrValueController?.reset();
                  });
                  _model.isCreator = false;
                  _model.franchisee = null;
                  _model.prices = null;
                  safeSetState(() {});
                  safeSetState(() {
                    _model.nameTextController?.clear();
                    _model.adressTextController1?.clear();
                    _model.forSiteTextController?.clear();
                  });
                },
                text: FFLocalizations.of(context).getText(
                  '75r8ldpo' /* Отмена */,
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
