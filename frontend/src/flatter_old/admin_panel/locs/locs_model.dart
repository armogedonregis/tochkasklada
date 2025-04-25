import '/components/breadcrumps_widget.dart';
import '/components/location_info_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/submenu_item_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'locs_widget.dart' show LocsWidget;
import 'package:flutter/material.dart';

class LocsModel extends FlutterFlowModel<LocsWidget> {
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
  // Models for locationInfo dynamic component.
  late FlutterFlowDynamicModels<LocationInfoModel> locationInfoModels1;
  // Models for locationInfo dynamic component.
  late FlutterFlowDynamicModels<LocationInfoModel> locationInfoModels2;

  @override
  void initState(BuildContext context) {
    sidebarModel = createModel(context, () => SidebarModel());
    breadcrumpsModel = createModel(context, () => BreadcrumpsModel());
    submenuItem1Model = createModel(context, () => SubmenuItemModel());
    submenuItem2Model = createModel(context, () => SubmenuItemModel());
    tittleWithIconAndSubtittleModel =
        createModel(context, () => TittleWithIconAndSubtittleModel());
    locationInfoModels1 = FlutterFlowDynamicModels(() => LocationInfoModel());
    locationInfoModels2 = FlutterFlowDynamicModels(() => LocationInfoModel());
  }

  @override
  void dispose() {
    sidebarModel.dispose();
    breadcrumpsModel.dispose();
    submenuItem1Model.dispose();
    submenuItem2Model.dispose();
    tittleWithIconAndSubtittleModel.dispose();
    locationInfoModels1.dispose();
    locationInfoModels2.dispose();
  }
}
