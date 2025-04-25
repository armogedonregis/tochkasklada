import '/backend/supabase/supabase.dart';
import '/components/breadcrumps_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/submenu_item_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_data_table.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'locpreview_widget.dart' show LocpreviewWidget;
import 'package:flutter/material.dart';

class LocpreviewModel extends FlutterFlowModel<LocpreviewWidget> {
  ///  State fields for stateful widgets in this page.

  // Model for sidebar component.
  late SidebarModel sidebarModel;
  // Model for breadcrumps component.
  late BreadcrumpsModel breadcrumpsModel;
  // Model for submenuItem2.
  late SubmenuItemModel submenuItem2Model1;
  // Model for submenuItembook.
  late SubmenuItemModel submenuItembookModel;
  // Model for submenuItem2.
  late SubmenuItemModel submenuItem2Model2;
  // Model for submenuItemprice.
  late SubmenuItemModel submenuItempriceModel;
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel;
  // State field(s) for PaginatedDataTable widget.
  final paginatedDataTableController =
      FlutterFlowDataTableController<Cellstatusview1PlusClientsRow>();

  @override
  void initState(BuildContext context) {
    sidebarModel = createModel(context, () => SidebarModel());
    breadcrumpsModel = createModel(context, () => BreadcrumpsModel());
    submenuItem2Model1 = createModel(context, () => SubmenuItemModel());
    submenuItembookModel = createModel(context, () => SubmenuItemModel());
    submenuItem2Model2 = createModel(context, () => SubmenuItemModel());
    submenuItempriceModel = createModel(context, () => SubmenuItemModel());
    tittleWithIconAndSubtittleModel =
        createModel(context, () => TittleWithIconAndSubtittleModel());
  }

  @override
  void dispose() {
    sidebarModel.dispose();
    breadcrumpsModel.dispose();
    submenuItem2Model1.dispose();
    submenuItembookModel.dispose();
    submenuItem2Model2.dispose();
    submenuItempriceModel.dispose();
    tittleWithIconAndSubtittleModel.dispose();
    paginatedDataTableController.dispose();
  }
}
