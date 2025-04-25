import '/backend/supabase/supabase.dart';
import '/components/breadcrumps_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/submenu_item_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_data_table.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'merchant_view_widget.dart' show MerchantViewWidget;
import 'package:flutter/material.dart';

class MerchantViewModel extends FlutterFlowModel<MerchantViewWidget> {
  ///  State fields for stateful widgets in this page.

  // Model for sidebar component.
  late SidebarModel sidebarModel;
  // Model for breadcrumps component.
  late BreadcrumpsModel breadcrumpsModel;
  // Model for submenuItem1.
  late SubmenuItemModel submenuItem1Model;
  // Model for submenuItem2.
  late SubmenuItemModel submenuItem2Model;
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel;
  // State field(s) for PaginatedDataTable widget.
  final paginatedDataTableController =
      FlutterFlowDataTableController<FranchiseMerchantsViewRow>();

  @override
  void initState(BuildContext context) {
    sidebarModel = createModel(context, () => SidebarModel());
    breadcrumpsModel = createModel(context, () => BreadcrumpsModel());
    submenuItem1Model = createModel(context, () => SubmenuItemModel());
    submenuItem2Model = createModel(context, () => SubmenuItemModel());
    tittleWithIconAndSubtittleModel =
        createModel(context, () => TittleWithIconAndSubtittleModel());
  }

  @override
  void dispose() {
    sidebarModel.dispose();
    breadcrumpsModel.dispose();
    submenuItem1Model.dispose();
    submenuItem2Model.dispose();
    tittleWithIconAndSubtittleModel.dispose();
    paginatedDataTableController.dispose();
  }
}
