import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/form_field_controller.dart';
import 'promo_generator_widget.dart' show PromoGeneratorWidget;
import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';

class PromoGeneratorModel extends FlutterFlowModel<PromoGeneratorWidget> {
  ///  Local state fields for this component.

  String? promocode;

  bool isCopied = false;

  bool isPercentage = false;

  int times = 1;

  int? discount;

  ///  State fields for stateful widgets in this component.

  // State field(s) for DropDown widget.
  int? dropDownValue;
  FormFieldController<int>? dropDownValueController;
  // State field(s) for usageQty widget.
  FocusNode? usageQtyFocusNode;
  TextEditingController? usageQtyTextController;
  String? Function(BuildContext, String?)? usageQtyTextControllerValidator;
  // State field(s) for minPrice widget.
  FocusNode? minPriceFocusNode;
  TextEditingController? minPriceTextController;
  String? Function(BuildContext, String?)? minPriceTextControllerValidator;
  // State field(s) for maxPrice widget.
  FocusNode? maxPriceFocusNode;
  TextEditingController? maxPriceTextController;
  String? Function(BuildContext, String?)? maxPriceTextControllerValidator;
  // State field(s) for discount widget.
  FocusNode? discountFocusNode;
  TextEditingController? discountTextController;
  String? Function(BuildContext, String?)? discountTextControllerValidator;
  // Stores action output result for [Backend Call - Insert Row] action in createCode widget.
  PromoCodesRow? createPromocode;
  // State field(s) for TextField widget.
  FocusNode? textFieldFocusNode;
  TextEditingController? textController5;
  String? Function(BuildContext, String?)? textController5Validator;
  AudioPlayer? soundPlayer;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {
    usageQtyFocusNode?.dispose();
    usageQtyTextController?.dispose();

    minPriceFocusNode?.dispose();
    minPriceTextController?.dispose();

    maxPriceFocusNode?.dispose();
    maxPriceTextController?.dispose();

    discountFocusNode?.dispose();
    discountTextController?.dispose();

    textFieldFocusNode?.dispose();
    textController5?.dispose();
  }
}
