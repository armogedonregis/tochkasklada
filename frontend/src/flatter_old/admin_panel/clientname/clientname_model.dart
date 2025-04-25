import '/backend/supabase/supabase.dart';
import '/components/admin_notes_widget.dart';
import '/components/breadcrumps_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_data_table.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'clientname_widget.dart' show ClientnameWidget;
import 'package:flutter/material.dart';

class ClientnameModel extends FlutterFlowModel<ClientnameWidget> {
  ///  State fields for stateful widgets in this page.

  // Model for sidebar component.
  late SidebarModel sidebarModel;
  // Model for breadcrumps component.
  late BreadcrumpsModel breadcrumpsModel;
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel;
  // Model for adminNotes component.
  late AdminNotesModel adminNotesModel;
  // State field(s) for PaginatedDataTable widget.
  final paginatedDataTableController =
      FlutterFlowDataTableController<PaymentsRow>();

  @override
  void initState(BuildContext context) {
    sidebarModel = createModel(context, () => SidebarModel());
    breadcrumpsModel = createModel(context, () => BreadcrumpsModel());
    tittleWithIconAndSubtittleModel =
        createModel(context, () => TittleWithIconAndSubtittleModel());
    adminNotesModel = createModel(context, () => AdminNotesModel());
  }

  @override
  void dispose() {
    sidebarModel.dispose();
    breadcrumpsModel.dispose();
    tittleWithIconAndSubtittleModel.dispose();
    adminNotesModel.dispose();
    paginatedDataTableController.dispose();
  }
}
