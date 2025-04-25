import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'logo_icon_model.dart';
export 'logo_icon_model.dart';

class LogoIconWidget extends StatefulWidget {
  const LogoIconWidget({super.key});

  @override
  State<LogoIconWidget> createState() => _LogoIconWidgetState();
}

class _LogoIconWidgetState extends State<LogoIconWidget> {
  late LogoIconModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => LogoIconModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(8.0),
      child: Image.asset(
        Theme.of(context).brightness == Brightness.dark
            ? 'assets/images/logoshortdm.png'
            : 'assets/images/logoShort.png',
        width: 40.0,
        height: 40.0,
        fit: BoxFit.cover,
      ),
    );
  }
}
