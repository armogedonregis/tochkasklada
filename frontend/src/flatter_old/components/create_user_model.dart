import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/form_field_controller.dart';
import 'create_user_widget.dart' show CreateUserWidget;
import 'package:flutter/material.dart';

class CreateUserModel extends FlutterFlowModel<CreateUserWidget> {
  ///  Local state fields for this component.

  CrmRoles? setRole = CrmRoles.manager;

  ///  State fields for stateful widgets in this component.

  final formKey = GlobalKey<FormState>();
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel;
  // State field(s) for display_name widget.
  FocusNode? displayNameFocusNode;
  TextEditingController? displayNameTextController;
  String? Function(BuildContext, String?)? displayNameTextControllerValidator;
  String? _displayNameTextControllerValidator(
      BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return FFLocalizations.of(context).getText(
        'xngw9uuj' /* Обязательное поле */,
      );
    }

    if (val.length < 6) {
      return FFLocalizations.of(context).getText(
        'm2quop9f' /* Пожалуйста, введите Имя и Фами... */,
      );
    }

    return null;
  }

  // State field(s) for roleChoiceChips widget.
  FormFieldController<List<String>>? roleChoiceChipsValueController;
  String? get roleChoiceChipsValue =>
      roleChoiceChipsValueController?.value?.firstOrNull;
  set roleChoiceChipsValue(String? val) =>
      roleChoiceChipsValueController?.value = val != null ? [val] : [];
  // State field(s) for CheckboxGroup widget.
  FormFieldController<List<String>>? checkboxGroupValueController1;
  List<String>? get checkboxGroupValues1 =>
      checkboxGroupValueController1?.value;
  set checkboxGroupValues1(List<String>? v) =>
      checkboxGroupValueController1?.value = v;

  // State field(s) for CheckboxGroup widget.
  FormFieldController<List<String>>? checkboxGroupValueController2;
  List<String>? get checkboxGroupValues2 =>
      checkboxGroupValueController2?.value;
  set checkboxGroupValues2(List<String>? v) =>
      checkboxGroupValueController2?.value = v;

  // State field(s) for email widget.
  FocusNode? emailFocusNode;
  TextEditingController? emailTextController;
  String? Function(BuildContext, String?)? emailTextControllerValidator;
  String? _emailTextControllerValidator(BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return FFLocalizations.of(context).getText(
        'ciab8xlb' /* Обязательное поле */,
      );
    }

    if (!RegExp(kTextValidatorEmailRegex).hasMatch(val)) {
      return FFLocalizations.of(context).getText(
        '4ozfy9yh' /* Это не похоже на емейл */,
      );
    }
    return null;
  }

  // State field(s) for inviteCode widget.
  FocusNode? inviteCodeFocusNode;
  TextEditingController? inviteCodeTextController;
  String? Function(BuildContext, String?)? inviteCodeTextControllerValidator;
  // Stores action output result for [Backend Call - Insert Row] action in sendInvitrButton widget.
  InvitesRow? createinvite;

  @override
  void initState(BuildContext context) {
    tittleWithIconAndSubtittleModel =
        createModel(context, () => TittleWithIconAndSubtittleModel());
    displayNameTextControllerValidator = _displayNameTextControllerValidator;
    emailTextControllerValidator = _emailTextControllerValidator;
  }

  @override
  void dispose() {
    tittleWithIconAndSubtittleModel.dispose();
    displayNameFocusNode?.dispose();
    displayNameTextController?.dispose();

    emailFocusNode?.dispose();
    emailTextController?.dispose();

    inviteCodeFocusNode?.dispose();
    inviteCodeTextController?.dispose();
  }
}
