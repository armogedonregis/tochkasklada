import '/backend/supabase/supabase.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/form_field_controller.dart';
import 'update_merchant_widget.dart' show UpdateMerchantWidget;
import 'package:flutter/material.dart';

class UpdateMerchantModel extends FlutterFlowModel<UpdateMerchantWidget> {
  ///  Local state fields for this component.

  bool isWorked = false;

  ///  State fields for stateful widgets in this component.

  final formKey = GlobalKey<FormState>();
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel;
  // State field(s) for RadioButton widget.
  FormFieldController<String>? radioButtonValueController;
  // State field(s) for term widget.
  FocusNode? termFocusNode;
  TextEditingController? termTextController;
  String? Function(BuildContext, String?)? termTextControllerValidator;
  String? _termTextControllerValidator(BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return FFLocalizations.of(context).getText(
        '96togtj9' /* Обязательное поле */,
      );
    }

    if (val.length < 20) {
      return FFLocalizations.of(context).getText(
        'gtl0hgg2' /* Слишком коротко */,
      );
    }
    if (val.length > 20) {
      return FFLocalizations.of(context).getText(
        'w9ssyhk2' /* Слишком коротко */,
      );
    }

    return null;
  }

  // State field(s) for passSingleView widget.
  FocusNode? passSingleViewFocusNode;
  TextEditingController? passSingleViewTextController;
  String? Function(BuildContext, String?)?
      passSingleViewTextControllerValidator;
  // Stores action output result for [Validate Form] action in updateInfoButton widget.
  bool? formValidation;
  // Stores action output result for [Backend Call - Update Row(s)] action in updateInfoButton widget.
  List<MerchantsRow>? editMerchantData;

  @override
  void initState(BuildContext context) {
    tittleWithIconAndSubtittleModel =
        createModel(context, () => TittleWithIconAndSubtittleModel());
    termTextControllerValidator = _termTextControllerValidator;
  }

  @override
  void dispose() {
    tittleWithIconAndSubtittleModel.dispose();
    termFocusNode?.dispose();
    termTextController?.dispose();

    passSingleViewFocusNode?.dispose();
    passSingleViewTextController?.dispose();
  }

  /// Additional helper methods.
  String? get radioButtonValue => radioButtonValueController?.value;
}
