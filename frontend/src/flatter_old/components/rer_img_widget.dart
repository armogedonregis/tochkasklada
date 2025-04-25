import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'rer_img_model.dart';
export 'rer_img_model.dart';

class RerImgWidget extends StatefulWidget {
  const RerImgWidget({super.key});

  @override
  State<RerImgWidget> createState() => _RerImgWidgetState();
}

class _RerImgWidgetState extends State<RerImgWidget> {
  late RerImgModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => RerImgModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Visibility(
      visible: responsiveVisibility(
        context: context,
        phone: false,
        tablet: false,
      ),
      child: Container(
        width: 714.0,
        height: double.infinity,
        decoration: BoxDecoration(
          color: FlutterFlowTheme.of(context).secondaryBackground,
          image: DecorationImage(
            fit: BoxFit.cover,
            image: Image.asset(
              'assets/images/loginImagets.png',
            ).image,
          ),
          borderRadius: BorderRadius.circular(0.0),
        ),
      ),
    );
  }
}
