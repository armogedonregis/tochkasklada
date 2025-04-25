import '/backend/supabase/supabase.dart';
import '/components/breadcrumps_widget.dart';
import '/components/open_drawler_button_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_data_table.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'booking_widget.dart' show BookingWidget;
import 'package:flutter/material.dart';

class BookingModel extends FlutterFlowModel<BookingWidget> {
  ///  Local state fields for this page.

  String? locID;

  bool createNewAdress = false;

  bool isConfirmed = false;

  DateTime? addedTime;

  bool needPageUpdate = false;

  DateTime? limitTimForTable;

  bool? addTimeConfirmation;

  ///  State fields for stateful widgets in this page.

  // Stores action output result for [Backend Call - Query Rows] action in booking widget.
  List<ReservedRow>? queryBookedCells;
  // Model for sidebar component.
  late SidebarModel sidebarModel;
  // Model for breadcrumps component.
  late BreadcrumpsModel breadcrumpsModel;
  // Model for openDrawlerButton component.
  late OpenDrawlerButtonModel openDrawlerButtonModel;
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel;
  // State field(s) for PaginatedDataTable widget.
  final paginatedDataTableController =
      FlutterFlowDataTableController<ReservedviewPlusTokensRow>();
  // Stores action output result for [Backend Call - Query Rows] action in IconButton widget.
  List<ReservedviewPlusTokensRow>? actualReserves;
  // Stores action output result for [Backend Call - Update Row(s)] action in IconButton widget.
  List<ReservedRow>? addTimeToReserve;

  @override
  void initState(BuildContext context) {
    sidebarModel = createModel(context, () => SidebarModel());
    breadcrumpsModel = createModel(context, () => BreadcrumpsModel());
    openDrawlerButtonModel =
        createModel(context, () => OpenDrawlerButtonModel());
    tittleWithIconAndSubtittleModel =
        createModel(context, () => TittleWithIconAndSubtittleModel());
  }

  @override
  void dispose() {
    sidebarModel.dispose();
    breadcrumpsModel.dispose();
    openDrawlerButtonModel.dispose();
    tittleWithIconAndSubtittleModel.dispose();
    paginatedDataTableController.dispose();
  }
}
