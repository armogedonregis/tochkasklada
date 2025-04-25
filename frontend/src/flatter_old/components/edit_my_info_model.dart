import '/backend/supabase/supabase.dart';
import '/components/my_avatar_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'edit_my_info_widget.dart' show EditMyInfoWidget;
import 'package:flutter/material.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';

class EditMyInfoModel extends FlutterFlowModel<EditMyInfoWidget> {
  ///  Local state fields for this component.

  bool avatarUpdated = false;

  String? avatarPatch;

  ///  State fields for stateful widgets in this component.

  final formKey = GlobalKey<FormState>();
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel;
  bool isDataUploading = false;
  FFUploadedFile uploadedLocalFile =
      FFUploadedFile(bytes: Uint8List.fromList([]));
  String uploadedFileUrl = '';

  // Stores action output result for [Backend Call - Update Row(s)] action in Container widget.
  List<UsersByRolesRow>? updAvatar;
  // Model for myAvatar component.
  late MyAvatarModel myAvatarModel;
  // State field(s) for display_name widget.
  FocusNode? displayNameFocusNode;
  TextEditingController? displayNameTextController;
  String? Function(BuildContext, String?)? displayNameTextControllerValidator;
  String? _displayNameTextControllerValidator(
      BuildContext context, String? val) {
    if (val == null || val.isEmpty) {
      return FFLocalizations.of(context).getText(
        'n5ftwaqb' /* Обязательное поле */,
      );
    }

    if (val.length < 6) {
      return FFLocalizations.of(context).getText(
        'oqyyqtrp' /* Пожалуйста, введите Имя и Фами... */,
      );
    }

    return null;
  }

  // State field(s) for phone widget.
  FocusNode? phoneFocusNode;
  TextEditingController? phoneTextController;
  final phoneMask = MaskTextInputFormatter(mask: '+# (###) ###-##-##');
  String? Function(BuildContext, String?)? phoneTextControllerValidator;
  // Stores action output result for [Backend Call - Update Row(s)] action in updateInfoButton widget.
  List<UsersByRolesRow>? editUserInfo;

  @override
  void initState(BuildContext context) {
    tittleWithIconAndSubtittleModel =
        createModel(context, () => TittleWithIconAndSubtittleModel());
    myAvatarModel = createModel(context, () => MyAvatarModel());
    displayNameTextControllerValidator = _displayNameTextControllerValidator;
  }

  @override
  void dispose() {
    tittleWithIconAndSubtittleModel.dispose();
    myAvatarModel.dispose();
    displayNameFocusNode?.dispose();
    displayNameTextController?.dispose();

    phoneFocusNode?.dispose();
    phoneTextController?.dispose();
  }
}
