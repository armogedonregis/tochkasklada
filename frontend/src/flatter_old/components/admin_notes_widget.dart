import '/backend/supabase/supabase.dart';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'package:easy_debounce/easy_debounce.dart';
import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'admin_notes_model.dart';
export 'admin_notes_model.dart';

class AdminNotesWidget extends StatefulWidget {
  const AdminNotesWidget({
    super.key,
    String? adminNotes,
    required this.clientID,
  }) : this.adminNotes = adminNotes ?? 'нет заметок';

  final String adminNotes;
  final String? clientID;

  @override
  State<AdminNotesWidget> createState() => _AdminNotesWidgetState();
}

class _AdminNotesWidgetState extends State<AdminNotesWidget> {
  late AdminNotesModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => AdminNotesModel());

    _model.textFieldFocusNode ??= FocusNode();
    _model.textFieldFocusNode!.addListener(
      () async {
        _model.addedComments = await ClientsTable().update(
          data: {
            'admin_comments': _model.textController.text,
          },
          matchingRows: (rows) => rows.eqOrNull(
            'client_id',
            widget.clientID,
          ),
          returnRows: true,
        );

        safeSetState(() {});
      },
    );
    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsetsDirectional.fromSTEB(0.0, 8.0, 0.0, 0.0),
      child: FutureBuilder<List<ClientsRow>>(
        future: ClientsTable().querySingleRow(
          queryFn: (q) => q.eqOrNull(
            'client_id',
            widget.clientID,
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
          List<ClientsRow> columnClientsRowList = snapshot.data!;

          final columnClientsRow = columnClientsRowList.isNotEmpty
              ? columnClientsRowList.first
              : null;

          return Column(
            mainAxisSize: MainAxisSize.max,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                mainAxisSize: MainAxisSize.max,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    FFLocalizations.of(context).getText(
                      'ine9waoj' /* Заметки: */,
                    ),
                    style: FlutterFlowTheme.of(context).labelMedium.override(
                          fontFamily: 'Montserrat',
                          letterSpacing: 0.0,
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  FlutterFlowIconButton(
                    borderRadius: 12.0,
                    borderWidth: 1.0,
                    buttonSize: 32.0,
                    fillColor: FlutterFlowTheme.of(context).accent4,
                    hoverColor: FlutterFlowTheme.of(context).alternate,
                    hoverIconColor: FlutterFlowTheme.of(context).secondaryText,
                    icon: Icon(
                      Icons.mode_edit,
                      color: FlutterFlowTheme.of(context).primaryText,
                      size: 18.0,
                    ),
                    onPressed: () async {
                      _model.isEditMode = !_model.isEditMode;
                      safeSetState(() {});
                    },
                  ),
                ],
              ),
              Align(
                alignment: AlignmentDirectional(-1.0, -1.0),
                child: Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(0.0, 16.0, 0.0, 16.0),
                  child: Container(
                    width: double.infinity,
                    constraints: BoxConstraints(
                      maxWidth: 1170.0,
                    ),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16.0),
                      border: Border.all(
                        color: FlutterFlowTheme.of(context).grayAlpha,
                      ),
                    ),
                    child: Builder(
                      builder: (context) {
                        if (!_model.isEditMode) {
                          return Padding(
                            padding: EdgeInsetsDirectional.fromSTEB(
                                16.0, 8.0, 16.0, 8.0),
                            child: Text(
                              valueOrDefault<String>(
                                columnClientsRow?.adminComments,
                                'нет заметок',
                              ),
                              textAlign: TextAlign.start,
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 0.0,
                                  ),
                            ),
                          );
                        } else {
                          return Align(
                            alignment: AlignmentDirectional(-1.0, -1.0),
                            child: Padding(
                              padding: EdgeInsetsDirectional.fromSTEB(
                                  8.0, 0.0, 8.0, 0.0),
                              child: TextFormField(
                                controller: _model.textController ??=
                                    TextEditingController(
                                  text: columnClientsRow?.adminComments,
                                ),
                                focusNode: _model.textFieldFocusNode,
                                onChanged: (_) => EasyDebounce.debounce(
                                  '_model.textController',
                                  Duration(milliseconds: 1000),
                                  () => safeSetState(() {}),
                                ),
                                autofocus: true,
                                textInputAction: TextInputAction.done,
                                obscureText: false,
                                decoration: InputDecoration(
                                  labelStyle: FlutterFlowTheme.of(context)
                                      .labelMedium
                                      .override(
                                        fontFamily: 'Montserrat',
                                        letterSpacing: 0.0,
                                      ),
                                  hintStyle: FlutterFlowTheme.of(context)
                                      .labelMedium
                                      .override(
                                        fontFamily: 'Montserrat',
                                        letterSpacing: 0.0,
                                      ),
                                  enabledBorder: InputBorder.none,
                                  focusedBorder: InputBorder.none,
                                  errorBorder: InputBorder.none,
                                  focusedErrorBorder: InputBorder.none,
                                ),
                                style: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .override(
                                      fontFamily: 'Montserrat',
                                      letterSpacing: 0.0,
                                    ),
                                textAlign: TextAlign.start,
                                maxLines: 8,
                                minLines: 4,
                                validator: _model.textControllerValidator
                                    .asValidator(context),
                              ),
                            ),
                          );
                        }
                      },
                    ),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
