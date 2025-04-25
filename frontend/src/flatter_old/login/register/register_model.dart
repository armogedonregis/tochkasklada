import '/backend/supabase/supabase.dart';
import '/components/logo_dark_light_widget.dart';
import '/components/rer_img_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'register_widget.dart' show RegisterWidget;
import 'package:flutter/material.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';

class RegisterModel extends FlutterFlowModel<RegisterWidget> {
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

  ///  State fields for stateful widgets in this page.

  final formKey = GlobalKey<FormState>();
  // Stores action output result for [Backend Call - Query Rows] action in register widget.
  List<InvitesRow>? inviteData;
  // State field(s) for emailAddress widget.
  FocusNode? emailAddressFocusNode;
  TextEditingController? emailAddressTextController;
  String? Function(BuildContext, String?)? emailAddressTextControllerValidator;
  String? _emailAddressTextControllerValidator(
      BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return FFLocalizations.of(context).getText(
        'erk7tchf' /* Это обязательное поле */,
      );
    }

    if (!RegExp(kTextValidatorEmailRegex).hasMatch(val)) {
      return FFLocalizations.of(context).getText(
        '5g99q0xb' /* Это не похоже на емейл */,
      );
    }
    return null;
  }

  // State field(s) for phone widget.
  FocusNode? phoneFocusNode;
  TextEditingController? phoneTextController;
  final phoneMask = MaskTextInputFormatter(mask: '+# (###) ###-##-##');
  String? Function(BuildContext, String?)? phoneTextControllerValidator;
  // State field(s) for password widget.
  FocusNode? passwordFocusNode;
  TextEditingController? passwordTextController;
  late bool passwordVisibility;
  String? Function(BuildContext, String?)? passwordTextControllerValidator;
  String? _passwordTextControllerValidator(BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return FFLocalizations.of(context).getText(
        'yem13ugu' /* Это обязательное поле */,
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
        'tw5gejzq' /* Кажется, в пароле есть ошибка */,
      );
    }
    return null;
  }

  // Stores action output result for [Backend Call - Insert Row] action in Button widget.
  UsersByRolesRow? createUser;
  // Stores action output result for [Backend Call - Update Row(s)] action in Button widget.
  List<InvitesRow>? setInviteStatusUsed;
  // Stores action output result for [Backend Call - Update Row(s)] action in Button widget.
  List<InvitesRow>? setInviteStatusExpired;
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

    phoneFocusNode?.dispose();
    phoneTextController?.dispose();

    passwordFocusNode?.dispose();
    passwordTextController?.dispose();

    logoDarkLightModel.dispose();
    rerImgModel.dispose();
  }
}
