import '/backend/supabase/supabase.dart';
import '/components/attent_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'edit_price_widget.dart' show EditPriceWidget;
import 'package:flutter/material.dart';

class EditPriceModel extends FlutterFlowModel<EditPriceWidget> {
  ///  Local state fields for this component.

  bool isEditable = false;

  bool isShimmering = true;

  ///  State fields for stateful widgets in this component.

  final formKey = GlobalKey<FormState>();
  // Stores action output result for [Backend Call - Query Rows] action in editPrice widget.
  List<AreaPricesRow>? areaPriceQuery;
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel;
  // Model for attent component.
  late AttentModel attentModel;
  // State field(s) for mMonth widget.
  FocusNode? mMonthFocusNode;
  TextEditingController? mMonthTextController;
  String? Function(BuildContext, String?)? mMonthTextControllerValidator;
  // State field(s) for mDay widget.
  FocusNode? mDayFocusNode;
  TextEditingController? mDayTextController;
  String? Function(BuildContext, String?)? mDayTextControllerValidator;
  // State field(s) for sMonth widget.
  FocusNode? sMonthFocusNode;
  TextEditingController? sMonthTextController;
  String? Function(BuildContext, String?)? sMonthTextControllerValidator;
  // State field(s) for sDay widget.
  FocusNode? sDayFocusNode;
  TextEditingController? sDayTextController;
  String? Function(BuildContext, String?)? sDayTextControllerValidator;
  // State field(s) for xsMonth widget.
  FocusNode? xsMonthFocusNode;
  TextEditingController? xsMonthTextController;
  String? Function(BuildContext, String?)? xsMonthTextControllerValidator;
  // State field(s) for xsDay widget.
  FocusNode? xsDayFocusNode;
  TextEditingController? xsDayTextController;
  String? Function(BuildContext, String?)? xsDayTextControllerValidator;
  // State field(s) for yearCt widget.
  FocusNode? yearCtFocusNode;
  TextEditingController? yearCtTextController;
  String? Function(BuildContext, String?)? yearCtTextControllerValidator;
  // Stores action output result for [Backend Call - Update Row(s)] action in changePriceButton widget.
  List<AreaPricesRow>? updatePrices;

  @override
  void initState(BuildContext context) {
    tittleWithIconAndSubtittleModel =
        createModel(context, () => TittleWithIconAndSubtittleModel());
    attentModel = createModel(context, () => AttentModel());
  }

  @override
  void dispose() {
    tittleWithIconAndSubtittleModel.dispose();
    attentModel.dispose();
    mMonthFocusNode?.dispose();
    mMonthTextController?.dispose();

    mDayFocusNode?.dispose();
    mDayTextController?.dispose();

    sMonthFocusNode?.dispose();
    sMonthTextController?.dispose();

    sDayFocusNode?.dispose();
    sDayTextController?.dispose();

    xsMonthFocusNode?.dispose();
    xsMonthTextController?.dispose();

    xsDayFocusNode?.dispose();
    xsDayTextController?.dispose();

    yearCtFocusNode?.dispose();
    yearCtTextController?.dispose();
  }
}
