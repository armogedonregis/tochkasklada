import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'promocode_row_widget.dart' show PromocodeRowWidget;
import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';

class PromocodeRowModel extends FlutterFlowModel<PromocodeRowWidget> {
  ///  State fields for stateful widgets in this component.

  AudioPlayer? soundPlayer1;
  AudioPlayer? soundPlayer2;
  // Stores action output result for [Backend Call - Delete Row(s)] action in IconButton widget.
  List<PromoCodesRow>? deleteRow;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {}
}
