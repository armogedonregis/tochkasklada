import '/components/breadcrumps_widget.dart';
import '/components/open_drawler_button_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/submenu_item_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'franchasing_widget.dart' show FranchasingWidget;
import 'package:flutter/material.dart';

class FranchasingModel extends FlutterFlowModel<FranchasingWidget> {
  ///  State fields for stateful widgets in this page.

  // Model for sidebar component.
  late SidebarModel sidebarModel;
  // Model for breadcrumps component.
  late BreadcrumpsModel breadcrumpsModel;
  // Model for submenuItem1.
  late SubmenuItemModel submenuItem1Model1;
  // Model for submenuItem2.
  late SubmenuItemModel submenuItem2Model1;
  // Model for openDrawlerButton component.
  late OpenDrawlerButtonModel openDrawlerButtonModel;
  // Model for submenuItem1.
  late SubmenuItemModel submenuItem1Model2;
  // Model for submenuItem2.
  late SubmenuItemModel submenuItem2Model2;
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel;

  @override
  void initState(BuildContext context) {
    sidebarModel = createModel(context, () => SidebarModel());
    breadcrumpsModel = createModel(context, () => BreadcrumpsModel());
    submenuItem1Model1 = createModel(context, () => SubmenuItemModel());
    submenuItem2Model1 = createModel(context, () => SubmenuItemModel());
    openDrawlerButtonModel =
        createModel(context, () => OpenDrawlerButtonModel());
    submenuItem1Model2 = createModel(context, () => SubmenuItemModel());
    submenuItem2Model2 = createModel(context, () => SubmenuItemModel());
    tittleWithIconAndSubtittleModel =
        createModel(context, () => TittleWithIconAndSubtittleModel());
  }

  @override
  void dispose() {
    sidebarModel.dispose();
    breadcrumpsModel.dispose();
    submenuItem1Model1.dispose();
    submenuItem2Model1.dispose();
    openDrawlerButtonModel.dispose();
    submenuItem1Model2.dispose();
    submenuItem2Model2.dispose();
    tittleWithIconAndSubtittleModel.dispose();
  }
}
