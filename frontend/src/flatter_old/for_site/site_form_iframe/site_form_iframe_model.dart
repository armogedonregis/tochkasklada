import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/form_field_controller.dart';
import 'site_form_iframe_widget.dart' show SiteFormIframeWidget;
import 'package:flutter/material.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';

class SiteFormIframeModel extends FlutterFlowModel<SiteFormIframeWidget> {
  ///  Local state fields for this page.

  String? email;

  String? phone;

  String? name;

  String? role;

  bool? isExpired;

  bool? emailIsValid;

  String? inviterEmail;

  String? inviteIDfromLink;

  String? defaultAvatarPatch;

  String? locAdress;

  String? sizeParameters;

  String? locID;

  String? cellID;

  Period? pricePeriod = Period.week;

  String? locSize;

  bool isSimmering = true;

  String? foundedCell;

  ///  State fields for stateful widgets in this page.

  final formKey = GlobalKey<FormState>();
  // State field(s) for ChoiceChipsLoc widget.
  FormFieldController<List<String>>? choiceChipsLocValueController;
  String? get choiceChipsLocValue =>
      choiceChipsLocValueController?.value?.firstOrNull;
  set choiceChipsLocValue(String? val) =>
      choiceChipsLocValueController?.value = val != null ? [val] : [];
  // Stores action output result for [Backend Call - Query Rows] action in ChoiceChipsLoc widget.
  List<LocGeoRow>? selectedLoc;
  // State field(s) for ChoiceChipsSize widget.
  FormFieldController<List<String>>? choiceChipsSizeValueController;
  String? get choiceChipsSizeValue =>
      choiceChipsSizeValueController?.value?.firstOrNull;
  set choiceChipsSizeValue(String? val) =>
      choiceChipsSizeValueController?.value = val != null ? [val] : [];
  // Stores action output result for [Backend Call - Query Rows] action in ChoiceChipsSize widget.
  List<SizesRow>? selectedSize;
  // State field(s) for clientName widget.
  FocusNode? clientNameFocusNode;
  TextEditingController? clientNameTextController;
  String? Function(BuildContext, String?)? clientNameTextControllerValidator;
  String? _clientNameTextControllerValidator(
      BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return FFLocalizations.of(context).getText(
        'loh2bo9y' /* Это обязательное поле */,
      );
    }

    if (val.length < 3) {
      return 'Requires at least 3 characters.';
    }

    return null;
  }

  // State field(s) for emailAddress widget.
  FocusNode? emailAddressFocusNode;
  TextEditingController? emailAddressTextController;
  String? Function(BuildContext, String?)? emailAddressTextControllerValidator;
  String? _emailAddressTextControllerValidator(
      BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return FFLocalizations.of(context).getText(
        'jeoha9zd' /* Field is required */,
      );
    }

    if (!RegExp(kTextValidatorEmailRegex).hasMatch(val)) {
      return FFLocalizations.of(context).getText(
        '664ky4s7' /* Это не похоже на емейл */,
      );
    }
    return null;
  }

  // State field(s) for phone widget.
  FocusNode? phoneFocusNode;
  TextEditingController? phoneTextController;
  final phoneMask = MaskTextInputFormatter(mask: '+# (###) ###-##-##');
  String? Function(BuildContext, String?)? phoneTextControllerValidator;
  String? _phoneTextControllerValidator(BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return FFLocalizations.of(context).getText(
        'zkpg0re6' /* Field is required */,
      );
    }

    return null;
  }

  // Stores action output result for [Backend Call - Insert Row] action in Button widget.
  RequestsRow? createNewRequest;
  // Stores action output result for [Backend Call - Query Rows] action in Button widget.
  List<ClientsRow>? checkClient;
  // Stores action output result for [Backend Call - Query Rows] action in Button widget.
  List<MatchedRequestsRow>? matchesQuery;

  @override
  void initState(BuildContext context) {
    clientNameTextControllerValidator = _clientNameTextControllerValidator;
    emailAddressTextControllerValidator = _emailAddressTextControllerValidator;
    phoneTextControllerValidator = _phoneTextControllerValidator;
  }

  @override
  void dispose() {
    clientNameFocusNode?.dispose();
    clientNameTextController?.dispose();

    emailAddressFocusNode?.dispose();
    emailAddressTextController?.dispose();

    phoneFocusNode?.dispose();
    phoneTextController?.dispose();
  }
}
