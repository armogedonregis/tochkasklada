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

class DrawlerAdressShimmer extends StatefulWidget {
  const DrawlerAdressShimmer({
    super.key,
    this.width,
    this.height,
    this.borderRadius,
  });

  final double? width;
  final double? height;
  final double? borderRadius;

  @override
  State<DrawlerAdressShimmer> createState() => _DrawlerAdressShimmerState();
}

class _DrawlerAdressShimmerState extends State<DrawlerAdressShimmer> {
  @override
  Widget build(BuildContext context) {
    final cardWidth = widget.width ?? MediaQuery.of(context).size.width;
    final cardHeight = widget.height ?? 150.0;
    final borderRadius = widget.borderRadius ?? 16.0;

    return Container(
      width: cardWidth,
      height: cardHeight,
      decoration: BoxDecoration(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(borderRadius),
      ),
      child: Shimmer.fromColors(
        baseColor: FlutterFlowTheme.of(context).primaryBackground,
        highlightColor: FlutterFlowTheme.of(context).secondaryBackground,
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              for (int i = 0; i < 4; i++) ...[
                Container(
                  width: double.infinity,
                  height: 42,
                  decoration: BoxDecoration(
                    color: FlutterFlowTheme.of(context).primaryBackground,
                    borderRadius: BorderRadius.circular(borderRadius),
                  ),
                ),
                if (i < 3) SizedBox(height: 16),
              ],
              SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 42,
                      decoration: BoxDecoration(
                        color: FlutterFlowTheme.of(context).primaryBackground,
                        borderRadius: BorderRadius.circular(borderRadius),
                      ),
                    ),
                  ),
                  SizedBox(width: 16),
                  Expanded(
                    child: Container(
                      height: 42,
                      decoration: BoxDecoration(
                        color: FlutterFlowTheme.of(context).primaryBackground,
                        borderRadius: BorderRadius.circular(borderRadius),
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
