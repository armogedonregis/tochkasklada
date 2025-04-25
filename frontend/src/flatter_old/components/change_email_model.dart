import '/backend/supabase/supabase.dart';
import '/components/attent_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'change_email_widget.dart' show ChangeEmailWidget;
import 'package:flutter/material.dart';

class ChangeEmailModel extends FlutterFlowModel<ChangeEmailWidget> {
  ///  State fields for stateful widgets in this component.

  final formKey = GlobalKey<FormState>();
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel;
  // Model for attent component.
  late AttentModel attentModel;
  // State field(s) for email widget.
  FocusNode? emailFocusNode;
  TextEditingController? emailTextController;
  String? Function(BuildContext, String?)? emailTextControllerValidator;
  String? _emailTextControllerValidator(BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return FFLocalizations.of(context).getText(
        'hmd3m5ri' /* Обязательное поле */,
      );
    }

    if (!RegExp(kTextValidatorEmailRegex).hasMatch(val)) {
      return FFLocalizations.of(context).getText(
        '6xryqfg5' /* Это не похоже на емейл */,
      );
    }
    return null;
  }

  // Stores action output result for [Backend Call - Update Row(s)] action in sendInvitrButton widget.
  List<UsersByRolesRow>? updateEmailRow;

  @override
  void initState(BuildContext context) {
    tittleWithIconAndSubtittleModel =
        createModel(context, () => TittleWithIconAndSubtittleModel());
    attentModel = createModel(context, () => AttentModel());
    emailTextControllerValidator = _emailTextControllerValidator;
  }

  @override
  void dispose() {
    tittleWithIconAndSubtittleModel.dispose();
    attentModel.dispose();
    emailFocusNode?.dispose();
    emailTextController?.dispose();
  }
}
