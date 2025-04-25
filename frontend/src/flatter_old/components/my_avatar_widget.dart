import '/auth/supabase_auth/auth_util.dart';
import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'my_avatar_model.dart';
export 'my_avatar_model.dart';

class MyAvatarWidget extends StatefulWidget {
  const MyAvatarWidget({
    super.key,
    int? size,
    this.patch,
  }) : this.size = size ?? 80;

  final int size;
  final String? patch;

  @override
  State<MyAvatarWidget> createState() => _MyAvatarWidgetState();
}

class _MyAvatarWidgetState extends State<MyAvatarWidget> {
  late MyAvatarModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => MyAvatarModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: widget.size.toDouble(),
      height: widget.size.toDouble(),
      decoration: BoxDecoration(),
      child: FutureBuilder<List<UsersByRolesRow>>(
        future: UsersByRolesTable().querySingleRow(
          queryFn: (q) => q.eqOrNull(
            'email',
            currentUserEmail,
          ),
        ),
        builder: (context, snapshot) {
          // Customize what your widget looks like when it's loading.
          if (!snapshot.hasData) {
            return Center(
              child: SizedBox(
                width: 50.0,
                height: 50.0,
                child: SpinKitWanderingCubes(
                  color: FlutterFlowTheme.of(context).primary,
                  size: 50.0,
                ),
              ),
            );
          }
          List<UsersByRolesRow> circleImageUsersByRolesRowList = snapshot.data!;

          final circleImageUsersByRolesRow =
              circleImageUsersByRolesRowList.isNotEmpty
                  ? circleImageUsersByRolesRowList.first
                  : null;

          return Container(
            width: 32.0,
            height: 32.0,
            clipBehavior: Clip.antiAlias,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
            ),
            child: Image.network(
              circleImageUsersByRolesRow!.avatarPatch!,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => Image.asset(
                'assets/images/error_image.png',
                fit: BoxFit.cover,
              ),
            ),
          );
        },
      ),
    );
  }
}
