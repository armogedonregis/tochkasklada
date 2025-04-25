import '/backend/supabase/supabase.dart';
import '/components/promo_generator_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/form_field_controller.dart';
import 'edit_request_widget.dart' show EditRequestWidget;
import 'package:flutter/material.dart';

class EditRequestModel extends FlutterFlowModel<EditRequestWidget> {
  ///  Local state fields for this component.

  bool isAvailable = false;

  String? availableCell;

  List<String> alternateLoc = [];
  void addToAlternateLoc(String item) => alternateLoc.add(item);
  void removeFromAlternateLoc(String item) => alternateLoc.remove(item);
  void removeAtIndexFromAlternateLoc(int index) => alternateLoc.removeAt(index);
  void insertAtIndexInAlternateLoc(int index, String item) =>
      alternateLoc.insert(index, item);
  void updateAlternateLocAtIndex(int index, Function(String) updateFn) =>
      alternateLoc[index] = updateFn(alternateLoc[index]);

  List<String> alternateSize = [];
  void addToAlternateSize(String item) => alternateSize.add(item);
  void removeFromAlternateSize(String item) => alternateSize.remove(item);
  void removeAtIndexFromAlternateSize(int index) =>
      alternateSize.removeAt(index);
  void insertAtIndexInAlternateSize(int index, String item) =>
      alternateSize.insert(index, item);
  void updateAlternateSizeAtIndex(int index, Function(String) updateFn) =>
      alternateSize[index] = updateFn(alternateSize[index]);

  String? alternateCell;

  int? reservedTimeH;

  int? waitingTimeDays;

  String? notes;

  String? promocode;

  bool isGeneratorVisible = false;

  ///  State fields for stateful widgets in this component.

  final formKey = GlobalKey<FormState>();
  // Stores action output result for [Backend Call - Query Rows] action in editRequest widget.
  List<RequestsRow>? selectedRequest;
  // Stores action output result for [Backend Call - Query Rows] action in editRequest widget.
  List<CellsRow>? cellRequest;
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel;
  // State field(s) for DropDownWaiting widget.
  int? dropDownWaitingValue;
  FormFieldController<int>? dropDownWaitingValueController;
  // State field(s) for DropDownLoc widget.
  List<String>? dropDownLocValue;
  FormFieldController<List<String>>? dropDownLocValueController;
  // State field(s) for DropDownSize widget.
  List<String>? dropDownSizeValue;
  FormFieldController<List<String>>? dropDownSizeValueController;
  // State field(s) for DropDownNum widget.
  String? dropDownNumValue;
  FormFieldController<String>? dropDownNumValueController;
  // State field(s) for notes widget.
  FocusNode? notesFocusNode;
  TextEditingController? notesTextController;
  String? Function(BuildContext, String?)? notesTextControllerValidator;
  // Stores action output result for [Backend Call - Update Row(s)] action in notes widget.
  List<RequestsRow>? notProseeded;
  // State field(s) for Switch widget.
  bool? switchValue;
  // Model for promoGenerator component.
  late PromoGeneratorModel promoGeneratorModel;
  // State field(s) for Checkbox widget.
  bool? checkboxValue;
  // Stores action output result for [Backend Call - Update Row(s)] action in reserveButton widget.
  List<RequestsRow>? forReservation;
  // Stores action output result for [Backend Call - Query Rows] action in reserveButton widget.
  List<ClientsRow>? hasClientID;
  // Stores action output result for [Backend Call - Insert Row] action in reserveButton widget.
  ClientsRow? createClient;
  // Stores action output result for [Backend Call - Query Rows] action in reserveButton widget.
  List<ClientsRow>? isClientID;
  // Stores action output result for [Backend Call - Insert Row] action in reserveButton widget.
  ReservedRow? reserved;
  // Stores action output result for [Backend Call - Update Row(s)] action in waitingListButton widget.
  List<RequestsRow>? toWaitingList;
  // Stores action output result for [Backend Call - Update Row(s)] action in fellOffButton widget.
  List<RequestsRow>? leadOff;
  // Stores action output result for [Backend Call - Query Rows] action in closeDrawler widget.
  List<RequestsRow>? test;

  @override
  void initState(BuildContext context) {
    tittleWithIconAndSubtittleModel =
        createModel(context, () => TittleWithIconAndSubtittleModel());
    promoGeneratorModel = createModel(context, () => PromoGeneratorModel());
  }

  @override
  void dispose() {
    tittleWithIconAndSubtittleModel.dispose();
    notesFocusNode?.dispose();
    notesTextController?.dispose();

    promoGeneratorModel.dispose();
  }
}
