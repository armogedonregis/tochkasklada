// Automatic FlutterFlow imports
import '/backend/schema/structs/index.dart';
import '/backend/schema/enums/enums.dart';
import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'index.dart'; // Imports other custom widgets
import '/custom_code/actions/index.dart'; // Imports custom actions
import '/flutter_flow/custom_functions.dart'; // Imports custom functions
import 'package:flutter/material.dart';
// Begin custom widget code
// DO NOT REMOVE OR MODIFY THE CODE ABOVE!

import 'package:shimmer/shimmer.dart';

class ShimmerAdress extends StatefulWidget {
  const ShimmerAdress({
    Key? key,
    this.width,
    this.height,
    this.radii,
  }) : super(key: key);

  final double? width;
  final double? height;
  final double? radii;

  @override
  State<ShimmerAdress> createState() => _ShimmerAdressState();
}

class _ShimmerAdressState extends State<ShimmerAdress> {
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: widget.width,
      height: widget.height,
      child: Shimmer.fromColors(
        baseColor: FlutterFlowTheme.of(context).primaryBackground,
        highlightColor: FlutterFlowTheme.of(context).secondaryBackground,
        child: Container(
          decoration: BoxDecoration(
            color: FlutterFlowTheme.of(context).primaryBackground,
            borderRadius: BorderRadius.circular(widget.radii ?? 0),
          ),
        ),
      ),
    );
  }
}
