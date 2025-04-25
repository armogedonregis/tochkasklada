import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'avatar_model.dart';
export 'avatar_model.dart';

class AvatarWidget extends StatefulWidget {
  const AvatarWidget({
    super.key,
    required this.userRole,
    required this.userID,
    int? size,
    this.avatarPatch,
  }) : this.size = size ?? 48;

  final String? userRole;
  final String? userID;
  final int size;
  final String? avatarPatch;

  @override
  State<AvatarWidget> createState() => _AvatarWidgetState();
}

class _AvatarWidgetState extends State<AvatarWidget>
    with TickerProviderStateMixin {
  late AvatarModel _model;

  final animationsMap = <String, AnimationInfo>{};

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => AvatarModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      if (widget.avatarPatch != null && widget.avatarPatch != '') {
        _model.avatarPatch = widget.avatarPatch;
        safeSetState(() {});
      } else {
        _model.avatarPatch =
            'https://yzapdavvyxgrgeskutdl.supabase.co/storage/v1/object/public/crm-tochka/default_avatars/fr.png';
        safeSetState(() {});
      }
    });

    animationsMap.addAll({
      'circleImageOnPageLoadAnimation': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          ShimmerEffect(
            curve: Curves.easeInOut,
            delay: 40.0.ms,
            duration: 600.0.ms,
            color: FlutterFlowTheme.of(context).secondaryBackground,
            angle: 0.524,
          ),
          BlurEffect(
            curve: Curves.easeOut,
            delay: 40.0.ms,
            duration: 600.0.ms,
            begin: Offset(10.0, 10.0),
            end: Offset(0.0, 0.0),
          ),
        ],
      ),
    });

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ClipOval(
      child: Container(
        width: widget.size.toDouble(),
        height: widget.size.toDouble(),
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: valueOrDefault<Color>(
              () {
                if (widget.userRole == 'Франчайзи') {
                  return FlutterFlowTheme.of(context).secondary;
                } else if (widget.userRole == 'Франчайзер') {
                  return FlutterFlowTheme.of(context).primary;
                } else if (widget.userRole == 'Менеджер') {
                  return FlutterFlowTheme.of(context).tertiary;
                } else if (widget.userRole == 'Администратор') {
                  return FlutterFlowTheme.of(context).warning;
                } else {
                  return FlutterFlowTheme.of(context).grayAlpha;
                }
              }(),
              FlutterFlowTheme.of(context).grayAlpha,
            ),
            width: 2.0,
          ),
        ),
        child: Padding(
          padding: EdgeInsets.all(2.0),
          child: InkWell(
            splashColor: Colors.transparent,
            focusColor: Colors.transparent,
            hoverColor: Colors.transparent,
            highlightColor: Colors.transparent,
            onTap: () async {
              if (widget.avatarPatch != null && widget.avatarPatch != '') {
                _model.avatarPatch = widget.avatarPatch;
                safeSetState(() {});
              } else {
                _model.avatarPatch =
                    'CAMShAFDZ2hzYkdkNGNIbDVZeEpWNGdGSFFrRUtCeElGZEdVMmFYUVNOaEkwQ0FOQ0dUSVhDaFVLQzJGMllYUmhjbEJoZEdOb0VnWnNjV1p2ZVhPQ0FSUUtFa052Ym5SaGFXNWxjbDlzWWpOeGRIRTVabEFDV0FLcUFnaHdaSGRrWW1aMk1nPT0=';
                safeSetState(() {});
              }
            },
            child: Container(
              width: MediaQuery.sizeOf(context).width * 0.9,
              height: MediaQuery.sizeOf(context).width * 0.9,
              clipBehavior: Clip.antiAlias,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
              ),
              child: CachedNetworkImage(
                fadeInDuration: Duration(milliseconds: 500),
                fadeOutDuration: Duration(milliseconds: 500),
                imageUrl: valueOrDefault<String>(
                  widget.avatarPatch,
                  'https://yzapdavvyxgrgeskutdl.supabase.co/storage/v1/object/public/crm-tochka/default_avatars/errorimgload.png',
                ),
                fit: BoxFit.cover,
                errorWidget: (context, error, stackTrace) => Image.asset(
                  'assets/images/error_image.png',
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ).animateOnPageLoad(animationsMap['circleImageOnPageLoadAnimation']!),
        ),
      ),
    );
  }
}
