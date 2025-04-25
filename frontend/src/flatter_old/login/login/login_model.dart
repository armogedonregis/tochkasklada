import '/backend/supabase/supabase.dart';
import '/components/logo_dark_light_widget.dart';
import '/components/rer_img_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'login_widget.dart' show LoginWidget;
import 'package:flutter/material.dart';

class LoginModel extends FlutterFlowModel<LoginWidget> {
  ///  State fields for stateful widgets in this page.

  final formKey = GlobalKey<FormState>();
  // State field(s) for emailAddress widget.
  FocusNode? emailAddressFocusNode;
  TextEditingController? emailAddressTextController;
  String? Function(BuildContext, String?)? emailAddressTextControllerValidator;
  String? _emailAddressTextControllerValidator(
      BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return FFLocalizations.of(context).getText(
        'z2d5excx' /* Это обязательное поле */,
      );
    }

    if (!RegExp(kTextValidatorEmailRegex).hasMatch(val)) {
      return FFLocalizations.of(context).getText(
        'osyu1s03' /* Это не похоже на емейл */,
      );
    }
    return null;
  }

  // State field(s) for password widget.
  FocusNode? passwordFocusNode;
  TextEditingController? passwordTextController;
  late bool passwordVisibility;
  String? Function(BuildContext, String?)? passwordTextControllerValidator;
  String? _passwordTextControllerValidator(BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return FFLocalizations.of(context).getText(
        'pt964efa' /* Это обязательное поле */,
      );
    }

    if (val.length < 8) {
      return 'Requires at least 8 characters.';
    }
    if (val.length > 36) {
      return 'Maximum 36 characters allowed, currently ${val.length}.';
    }
    if (!RegExp(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@\$!%*?&])[A-Za-z\\d@\$!%*?&]{8,}\$')
        .hasMatch(val)) {
      return FFLocalizations.of(context).getText(
        'wvewn8ri' /* Кажется, в пароле есть ошибка */,
      );
    }
    return null;
  }

  // Stores action output result for [Backend Call - Query Rows] action in Button widget.
  List<UserSettingsRow>? settings;
  // Stores action output result for [Backend Call - Query Rows] action in Button widget.
  List<UsersByRolesRow>? avatar;
  // Model for logoDarkLight component.
  late LogoDarkLightModel logoDarkLightModel;
  // Model for rerImg component.
  late RerImgModel rerImgModel;

  @override
  void initState(BuildContext context) {
    emailAddressTextControllerValidator = _emailAddressTextControllerValidator;
    passwordVisibility = false;
    passwordTextControllerValidator = _passwordTextControllerValidator;
    logoDarkLightModel = createModel(context, () => LogoDarkLightModel());
    rerImgModel = createModel(context, () => RerImgModel());
  }

  @override
  void dispose() {
    emailAddressFocusNode?.dispose();
    emailAddressTextController?.dispose();

    passwordFocusNode?.dispose();
    passwordTextController?.dispose();

    logoDarkLightModel.dispose();
    rerImgModel.dispose();
  }
}
