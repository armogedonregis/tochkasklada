import '/components/breadcrumps_widget.dart';
import '/components/create_new_prices_widget.dart';
import '/components/edit_price_widget.dart';
import '/components/open_drawler_button_widget.dart';
import '/components/price_head_row_widget.dart';
import '/components/price_row_widget.dart';
import '/components/sidebar_widget.dart';
import '/components/submenu_item_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'prices_widget.dart' show PricesWidget;
import 'package:flutter/material.dart';

class PricesModel extends FlutterFlowModel<PricesWidget> {
  ///  Local state fields for this page.

  int? selectedTierID;

  bool isCreateTier = false;

  ///  State fields for stateful widgets in this page.

  // Model for sidebar component.
  late SidebarModel sidebarModel;
  // Model for breadcrumps component.
  late BreadcrumpsModel breadcrumpsModel;
  // Model for submenuItem1.
  late SubmenuItemModel submenuItem1Model;
  // Model for openDrawlerButton component.
  late OpenDrawlerButtonModel openDrawlerButtonModel;
  // Model for tittleWithIconAndSubtittle component.
  late TittleWithIconAndSubtittleModel tittleWithIconAndSubtittleModel;
  // Model for priceHeadRow component.
  late PriceHeadRowModel priceHeadRowModel1;
  // Model for priceHeadRow component.
  late PriceHeadRowModel priceHeadRowModel2;
  // Model for priceHeadRow component.
  late PriceHeadRowModel priceHeadRowModel3;
  // Models for priceRow dynamic component.
  late FlutterFlowDynamicModels<PriceRowModel> priceRowModels;
  // Model for editPrice component.
  late EditPriceModel editPriceModel;
  // Model for createNewPrices component.
  late CreateNewPricesModel createNewPricesModel1;
  // Model for createNewPrices component.
  late CreateNewPricesModel createNewPricesModel2;

  @override
  void initState(BuildContext context) {
    sidebarModel = createModel(context, () => SidebarModel());
    breadcrumpsModel = createModel(context, () => BreadcrumpsModel());
    submenuItem1Model = createModel(context, () => SubmenuItemModel());
    openDrawlerButtonModel =
        createModel(context, () => OpenDrawlerButtonModel());
    tittleWithIconAndSubtittleModel =
        createModel(context, () => TittleWithIconAndSubtittleModel());
    priceHeadRowModel1 = createModel(context, () => PriceHeadRowModel());
    priceHeadRowModel2 = createModel(context, () => PriceHeadRowModel());
    priceHeadRowModel3 = createModel(context, () => PriceHeadRowModel());
    priceRowModels = FlutterFlowDynamicModels(() => PriceRowModel());
    editPriceModel = createModel(context, () => EditPriceModel());
    createNewPricesModel1 = createModel(context, () => CreateNewPricesModel());
    createNewPricesModel2 = createModel(context, () => CreateNewPricesModel());
  }

  @override
  void dispose() {
    sidebarModel.dispose();
    breadcrumpsModel.dispose();
    submenuItem1Model.dispose();
    openDrawlerButtonModel.dispose();
    tittleWithIconAndSubtittleModel.dispose();
    priceHeadRowModel1.dispose();
    priceHeadRowModel2.dispose();
    priceHeadRowModel3.dispose();
    priceRowModels.dispose();
    editPriceModel.dispose();
    createNewPricesModel1.dispose();
    createNewPricesModel2.dispose();
  }
}
