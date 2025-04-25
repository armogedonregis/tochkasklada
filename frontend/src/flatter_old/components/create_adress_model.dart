import '/backend/supabase/supabase.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/form_field_controller.dart';
import 'create_adress_widget.dart' show CreateAdressWidget;
import 'package:flutter/material.dart';

class CreateAdressModel extends FlutterFlowModel<CreateAdressWidget> {
  ///  Local state fields for this component.

  bool isCreator = false;

  int? franchisee;

  int? prices;

  String? id;

  List<String> ids = [];
  void addToIds(String item) => ids.add(item);
  void removeFromIds(String item) => ids.remove(item);
  void removeAtIndexFromIds(int index) => ids.removeAt(index);
  void insertAtIndexInIds(int index, String item) => ids.insert(index, item);
  void updateIdsAtIndex(int index, Function(String) updateFn) =>
      ids[index] = updateFn(ids[index]);

  List<String> existingIDs = [];
  void addToExistingIDs(String item) => existingIDs.add(item);
  void removeFromExistingIDs(String item) => existingIDs.remove(item);
  void removeAtIndexFromExistingIDs(int index) => existingIDs.removeAt(index);
  void insertAtIndexInExistingIDs(int index, String item) =>
      existingIDs.insert(index, item);
  void updateExistingIDsAtIndex(int index, Function(String) updateFn) =>
      existingIDs[index] = updateFn(existingIDs[index]);

  bool? isAvailableID;

  ///  State fields for stateful widgets in this component.

  final formKey = GlobalKey<FormState>();
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel;
  // State field(s) for name widget.
  FocusNode? nameFocusNode;
  TextEditingController? nameTextController;
  String? Function(BuildContext, String?)? nameTextControllerValidator;
  String? _nameTextControllerValidator(BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return FFLocalizations.of(context).getText(
        'y1icuz8j' /* Обязательное поле */,
      );
    }

    if (!RegExp(kTextValidatorEmailRegex).hasMatch(val)) {
      return FFLocalizations.of(context).getText(
        'ief1fqor' /* Это не похоже на емейл */,
      );
    }
    return null;
  }

  // Stores action output result for [Backend Call - Query Rows] action in name widget.
  List<LocGeoRow>? checkID;
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
  String? dropDownFrValue;
  FormFieldController<String>? dropDownFrValueController;
  // State field(s) for DropDownPr widget.
  String? dropDownPrValue;
  FormFieldController<String>? dropDownPrValueController;
  // Stores action output result for [Backend Call - Insert Row] action in createAdresButton widget.
  LocGeoRow? createNewGeo;

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

    adressFocusNode1?.dispose();
    adressTextController1?.dispose();

    adressFocusNode2?.dispose();
    adressTextController2?.dispose();

    forSiteFocusNode?.dispose();
    forSiteTextController?.dispose();
  }
}
