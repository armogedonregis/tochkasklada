import '/backend/supabase/supabase.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/form_field_controller.dart';
import 'create_merchant_widget.dart' show CreateMerchantWidget;
import 'package:flutter/material.dart';

class CreateMerchantModel extends FlutterFlowModel<CreateMerchantWidget> {
  ///  Local state fields for this component.

  bool? nameAvailable;

  ///  State fields for stateful widgets in this component.

  final formKey = GlobalKey<FormState>();
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel;
  // State field(s) for termID widget.
  FocusNode? termIDFocusNode;
  TextEditingController? termIDTextController;
  String? Function(BuildContext, String?)? termIDTextControllerValidator;
  String? _termIDTextControllerValidator(BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return FFLocalizations.of(context).getText(
        'q7j8ljux' /* Обязательное поле */,
      );
    }

    if (val.length < 5) {
      return FFLocalizations.of(context).getText(
        '23r1jntd' /* Слишком короткое имя */,
      );
    }

    if (!RegExp('^[a-z-]*\\d*\$').hasMatch(val)) {
      return FFLocalizations.of(context).getText(
        '5ptbjsct' /* В пароле есть недопустимые сим... */,
      );
    }
    return null;
  }

  // Stores action output result for [Backend Call - Query Rows] action in termID widget.
  List<MerchantsRow>? checkTermName;
  // State field(s) for RadioButton widget.
  FormFieldController<String>? radioButtonValueController;
  // State field(s) for term widget.
  FocusNode? termFocusNode;
  TextEditingController? termTextController;
  String? Function(BuildContext, String?)? termTextControllerValidator;
  String? _termTextControllerValidator(BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return FFLocalizations.of(context).getText(
        'rr6pqc5q' /* Обязательное поле */,
      );
    }

    if (val.length < 20) {
      return FFLocalizations.of(context).getText(
        '3hd6de22' /* Слишком коротко */,
      );
    }
    if (val.length > 20) {
      return FFLocalizations.of(context).getText(
        'hl1ptbk4' /* Слишком коротко */,
      );
    }

    return null;
  }

  // State field(s) for passSingleView widget.
  FocusNode? passSingleViewFocusNode;
  TextEditingController? passSingleViewTextController;
  String? Function(BuildContext, String?)?
      passSingleViewTextControllerValidator;
  String? _passSingleViewTextControllerValidator(
      BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return FFLocalizations.of(context).getText(
        'xltj4kcp' /* Обязательное поле */,
      );
    }

    if (val.length < 20) {
      return FFLocalizations.of(context).getText(
        '7wn5kbjf' /* Слишком короткий */,
      );
    }
    if (val.length > 20) {
      return FFLocalizations.of(context).getText(
        '4ifb80es' /* Не плхоже на пароль от термина... */,
      );
    }

    return null;
  }

  // Stores action output result for [Validate Form] action in updateInfoButton widget.
  bool? formValidation;
  // Stores action output result for [Backend Call - Insert Row] action in updateInfoButton widget.
  MerchantsRow? addMerchant;

  @override
  void initState(BuildContext context) {
    tittleWithIconAndSubtittleModel =
        createModel(context, () => TittleWithIconAndSubtittleModel());
    termIDTextControllerValidator = _termIDTextControllerValidator;
    termTextControllerValidator = _termTextControllerValidator;
    passSingleViewTextControllerValidator =
        _passSingleViewTextControllerValidator;
  }

  @override
  void dispose() {
    tittleWithIconAndSubtittleModel.dispose();
    termIDFocusNode?.dispose();
    termIDTextController?.dispose();

    termFocusNode?.dispose();
    termTextController?.dispose();

    passSingleViewFocusNode?.dispose();
    passSingleViewTextController?.dispose();
  }

  /// Additional helper methods.
  String? get radioButtonValue => radioButtonValueController?.value;
}
