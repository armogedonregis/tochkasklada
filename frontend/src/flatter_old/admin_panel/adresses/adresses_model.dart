import '/backend/supabase/supabase.dart';
import '/components/breadcrumps_widget.dart';
import '/components/create_adress_widget.dart';
import '/components/edit_adress_widget.dart';
import '/components/loc_geo_row_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'adresses_widget.dart' show AdressesWidget;
import 'dart:async';
import 'package:flutter/material.dart';

class AdressesModel extends FlutterFlowModel<AdressesWidget> {
  ///  Local state fields for this page.

  String? locID;

  bool createNewAdress = false;

  bool isConfirmed = false;

  ///  State fields for stateful widgets in this page.

  // Model for sidebar component.
  late SidebarModel sidebarModel;
  // Model for breadcrumps component.
  late BreadcrumpsModel breadcrumpsModel;
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel;
  // Models for locGeoRow dynamic component.
  late FlutterFlowDynamicModels<LocGeoRowModel> locGeoRowModels;
  // Model for editAdress component.
  late EditAdressModel editAdressModel;
  Completer<List<LocGeoRow>>? requestCompleter;
  // Model for createAdress component.
  late CreateAdressModel createAdressModel;

  @override
  void initState(BuildContext context) {
    sidebarModel = createModel(context, () => SidebarModel());
    breadcrumpsModel = createModel(context, () => BreadcrumpsModel());
    tittleWithIconAndSubtittleModel =
        createModel(context, () => TittleWithIconAndSubtittleModel());
    locGeoRowModels = FlutterFlowDynamicModels(() => LocGeoRowModel());
    editAdressModel = createModel(context, () => EditAdressModel());
    createAdressModel = createModel(context, () => CreateAdressModel());
  }

  @override
  void dispose() {
    sidebarModel.dispose();
    breadcrumpsModel.dispose();
    tittleWithIconAndSubtittleModel.dispose();
    locGeoRowModels.dispose();
    editAdressModel.dispose();
    createAdressModel.dispose();
  }

  /// Additional helper methods.
  Future waitForRequestCompleted({
    double minWait = 0,
    double maxWait = double.infinity,
  }) async {
    final stopwatch = Stopwatch()..start();
    while (true) {
      await Future.delayed(Duration(milliseconds: 50));
      final timeElapsed = stopwatch.elapsedMilliseconds;
      final requestComplete = requestCompleter?.isCompleted ?? false;
      if (timeElapsed > maxWait || (requestComplete && timeElapsed > minWait)) {
        break;
      }
    }
  }
}
