import '/backend/supabase/supabase.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/form_field_controller.dart';
import 'edit_adress_widget.dart' show EditAdressWidget;
import 'package:flutter/material.dart';

class EditAdressModel extends FlutterFlowModel<EditAdressWidget> {
  ///  Local state fields for this component.

  int? franchisee;

  int? prices;

  bool canEdit = false;

  bool showShimmer = true;

  ///  State fields for stateful widgets in this component.

  final formKey = GlobalKey<FormState>();
  // Stores action output result for [Backend Call - Query Rows] action in editAdress widget.
  List<LocGeoRow>? geoQuery;
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel;
  // State field(s) for name widget.
  FocusNode? nameFocusNode;
  TextEditingController? nameTextController;
  String? Function(BuildContext, String?)? nameTextControllerValidator;
  String? _nameTextControllerValidator(BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return FFLocalizations.of(context).getText(
        '72xkk2c7' /* Обязательное поле */,
      );
    }

    if (!RegExp(kTextValidatorEmailRegex).hasMatch(val)) {
      return FFLocalizations.of(context).getText(
        '55uuf57g' /* Это не похоже на емейл */,
      );
    }
    return null;
  }

  // State field(s) for id widget.
  FocusNode? idFocusNode;
  TextEditingController? idTextController;
  String? Function(BuildContext, String?)? idTextControllerValidator;
  // State field(s) for adress widget.
  FocusNode? adressFocusNode1;
  TextEditingController? adressTextController1;
  String? Function(BuildContext, String?)? adressTextController1Validator;
  // State field(s) for adress widget.
  FocusNode? adressFocusNode2;
  TextEditingController? adressTextController2;
  String? Function(BuildContext, String?)? adressTextController2Validator;
  // State field(s) for forSite widget.
  FocusNode? forSiteFocusNode;
  TextEditingController? forSiteTextController;
  String? Function(BuildContext, String?)? forSiteTextControllerValidator;
  // State field(s) for DropDownFr widget.
  int? dropDownFrValue;
  FormFieldController<int>? dropDownFrValueController;
  // State field(s) for DropDownPrices widget.
  int? dropDownPricesValue;
  FormFieldController<int>? dropDownPricesValueController;

  @override
  void initState(BuildContext context) {
    tittleWithIconAndSubtittleModel =
        createModel(context, () => TittleWithIconAndSubtittleModel());
    nameTextControllerValidator = _nameTextControllerValidator;
  }

  @override
  void dispose() {
    tittleWithIconAndSubtittleModel.dispose();
    nameFocusNode?.dispose();
    nameTextController?.dispose();

    idFocusNode?.dispose();
    idTextController?.dispose();

    adressFocusNode1?.dispose();
    adressTextController1?.dispose();

    adressFocusNode2?.dispose();
    adressTextController2?.dispose();

    forSiteFocusNode?.dispose();
    forSiteTextController?.dispose();
  }
}
