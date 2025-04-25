import '/backend/supabase/supabase.dart';
import '/components/breadcrumps_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'crmsettings_widget.dart' show CrmsettingsWidget;
import 'package:flutter/material.dart';

class CrmsettingsModel extends FlutterFlowModel<CrmsettingsWidget> {
  ///  State fields for stateful widgets in this page.

  // Stores action output result for [Backend Call - Query Rows] action in crmsettings widget.
  List<UserSettingsRow>? querySettings;
  // Model for sidebar component.
  late SidebarModel sidebarModel;
  // Model for breadcrumps component.
  late BreadcrumpsModel breadcrumpsModel;
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel;
  // State field(s) for SwitchListTile widget.
  bool? switchListTileValue1;
  // Stores action output result for [Backend Call - Update Row(s)] action in SwitchListTile widget.
  List<UserSettingsRow>? updateFranchisorView;
  // Stores action output result for [Backend Call - Update Row(s)] action in SwitchListTile widget.
  List<UserSettingsRow>? updateFranchisorViewOff;
  // State field(s) for SwitchListTile widget.
  bool? switchListTileValue2;
  // Stores action output result for [Backend Call - Update Row(s)] action in SwitchListTile widget.
  List<UserSettingsRow>? showAvailable;
  // Stores action output result for [Backend Call - Update Row(s)] action in SwitchListTile widget.
  List<UserSettingsRow>? hideAvailable;
  // State field(s) for SwitchListTile widget.
  bool? switchListTileValue3;
  // Stores action output result for [Backend Call - Update Row(s)] action in SwitchListTile widget.
  List<UserSettingsRow>? clientsTodayOnlyOn;
  // Stores action output result for [Backend Call - Update Row(s)] action in SwitchListTile widget.
  List<UserSettingsRow>? clientsTodayOnlyOff;
  // State field(s) for SwitchListTile widget.
  bool? switchListTileValue4;
  // Stores action output result for [Backend Call - Update Row(s)] action in SwitchListTile widget.
  List<UserSettingsRow>? paymentsTodayOnlyOn;
  // Stores action output result for [Backend Call - Update Row(s)] action in SwitchListTile widget.
  List<UserSettingsRow>? paymentsTodayOnlyOff;
  // State field(s) for SwitchListTile widget.
  bool? switchListTileValue5;
  // Stores action output result for [Backend Call - Update Row(s)] action in SwitchListTile widget.
  List<UserSettingsRow>? requestsTodayOnlyOn;
  // Stores action output result for [Backend Call - Update Row(s)] action in SwitchListTile widget.
  List<UserSettingsRow>? requestsTodayOnlyOff;
  // State field(s) for SwitchListTile widget.
  bool? switchListTileValue6;
  // Stores action output result for [Backend Call - Update Row(s)] action in SwitchListTile widget.
  List<UserSettingsRow>? matchesInWaitingTodayOnlyOn;
  // Stores action output result for [Backend Call - Update Row(s)] action in SwitchListTile widget.
  List<UserSettingsRow>? matchesInWaitingTodayOnlyOnCopy;
  // State field(s) for SwitchListTile widget.
  bool? switchListTileValue7;
  // Stores action output result for [Backend Call - Update Row(s)] action in SwitchListTile widget.
  List<UserSettingsRow>? usersTodayOnlyOn;
  // Stores action output result for [Backend Call - Update Row(s)] action in SwitchListTile widget.
  List<UserSettingsRow>? usersTodayOnlyOff;

  @override
  void initState(BuildContext context) {
    sidebarModel = createModel(context, () => SidebarModel());
    breadcrumpsModel = createModel(context, () => BreadcrumpsModel());
    tittleWithIconAndSubtittleModel =
        createModel(context, () => TittleWithIconAndSubtittleModel());
  }

  @override
  void dispose() {
    sidebarModel.dispose();
    breadcrumpsModel.dispose();
    tittleWithIconAndSubtittleModel.dispose();
  }
}
