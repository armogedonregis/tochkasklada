import '/components/avatar_widget.dart';
import '/components/loc_card_cell_info_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'location_info_widget.dart' show LocationInfoWidget;
import 'package:flutter/material.dart';

class LocationInfoModel extends FlutterFlowModel<LocationInfoWidget> {
  ///  Local state fields for this component.

  bool? isActive = true;

  int? xsCellsTotal = 0;

  ///  State fields for stateful widgets in this component.

  // Model for avatarFranchasii.
  late AvatarModel avatarFranchasiiModel;
  // Model for locCardCellInfo component.
  late LocCardCellInfoModel locCardCellInfoModel1;
  // Model for locCardCellInfo component.
  late LocCardCellInfoModel locCardCellInfoModel2;
  // Model for locCardCellInfo component.
  late LocCardCellInfoModel locCardCellInfoModel3;

  @override
  void initState(BuildContext context) {
    avatarFranchasiiModel = createModel(context, () => AvatarModel());
    locCardCellInfoModel1 = createModel(context, () => LocCardCellInfoModel());
    locCardCellInfoModel2 = createModel(context, () => LocCardCellInfoModel());
    locCardCellInfoModel3 = createModel(context, () => LocCardCellInfoModel());
  }

  @override
  void dispose() {
    avatarFranchasiiModel.dispose();
    locCardCellInfoModel1.dispose();
    locCardCellInfoModel2.dispose();
    locCardCellInfoModel3.dispose();
  }
}
