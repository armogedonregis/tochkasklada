import '/components/breadcrumps_widget.dart';
import '/components/open_drawler_button_widget.dart';
import '/components/promo_generator_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'promocodes_widget.dart' show PromocodesWidget;
import 'package:flutter/material.dart';

class PromocodesModel extends FlutterFlowModel<PromocodesWidget> {
  ///  State fields for stateful widgets in this page.

  // Model for sidebar component.
  late SidebarModel sidebarModel;
  // Model for breadcrumps component.
  late BreadcrumpsModel breadcrumpsModel;
  // State field(s) for TextField widget.
  FocusNode? textFieldFocusNode1;
  TextEditingController? textController1;
  String? Function(BuildContext, String?)? textController1Validator;
  // Model for openDrawlerButton component.
  late OpenDrawlerButtonModel openDrawlerButtonModel;
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel1;
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel2;
  // State field(s) for TextField widget.
  FocusNode? textFieldFocusNode2;
  TextEditingController? textController2;
  String? Function(BuildContext, String?)? textController2Validator;
  // Model for promoGenerator component.
  late PromoGeneratorModel promoGeneratorModel;

  @override
  void initState(BuildContext context) {
    sidebarModel = createModel(context, () => SidebarModel());
    breadcrumpsModel = createModel(context, () => BreadcrumpsModel());
    openDrawlerButtonModel =
        createModel(context, () => OpenDrawlerButtonModel());
    tittleWithIconAndSubtittleModel1 =
        createModel(context, () => TittleWithIconAndSubtittleModel());
    tittleWithIconAndSubtittleModel2 =
        createModel(context, () => TittleWithIconAndSubtittleModel());
    promoGeneratorModel = createModel(context, () => PromoGeneratorModel());
  }

  @override
  void dispose() {
    sidebarModel.dispose();
    breadcrumpsModel.dispose();
    textFieldFocusNode1?.dispose();
    textController1?.dispose();

    openDrawlerButtonModel.dispose();
    tittleWithIconAndSubtittleModel1.dispose();
    tittleWithIconAndSubtittleModel2.dispose();
    textFieldFocusNode2?.dispose();
    textController2?.dispose();

    promoGeneratorModel.dispose();
  }
}
