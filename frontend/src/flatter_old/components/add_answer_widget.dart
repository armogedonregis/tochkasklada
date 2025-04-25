import '/auth/supabase_auth/auth_util.dart';
import '/backend/supabase/supabase.dart';
import '/components/skeleton_multi_line_list_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_animations.dart';
import '/flutter_flow/flutter_flow_expanded_image_view.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/flutter_flow/custom_functions.dart' as functions;
import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'add_answer_model.dart';
export 'add_answer_model.dart';

class AddAnswerWidget extends StatefulWidget {
  const AddAnswerWidget({
    super.key,
    required this.questionID,
    required this.userMail,
    required this.drawer,
    bool? hasAnswer,
  }) : this.hasAnswer = hasAnswer ?? false;

  final int? questionID;
  final String? userMail;
  final Future Function(bool resetStates)? drawer;
  final bool hasAnswer;

  @override
  State<AddAnswerWidget> createState() => _AddAnswerWidgetState();
}

class _AddAnswerWidgetState extends State<AddAnswerWidget>
    with TickerProviderStateMixin {
  late AddAnswerModel _model;

  final animationsMap = <String, AnimationInfo>{};

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => AddAnswerModel());

    // On component load action.
    SchedulerBinding.instance.addPostFrameCallback((_) async {
      _model.selectedRequest = await RequestsTable().queryRows(
        queryFn: (q) => q.eqOrNull(
          'request_id',
          widget.questionID?.toString(),
        ),
      );
      _model.cellRequest = await CellsTable().queryRows(
        queryFn: (q) => q
            .eqOrNull(
              'size',
              _model.selectedRequest?.firstOrNull?.size,
            )
            .eqOrNull(
              'adress',
              _model.selectedRequest?.firstOrNull?.location,
            )
            .order('cell_id'),
      );

      safeSetState(() {});
      safeSetState(() {
        _model.answerTextController?.text =
            _model.selectedRequest!.firstOrNull!.notes!;
      });
    });

    _model.answerFocusNode ??= FocusNode();
    _model.answerFocusNode!.addListener(
      () async {
        _model.notProseeded = await RequestsTable().update(
          data: {
            'notes': _model.answerTextController.text,
            'manager': currentUserEmail,
          },
          matchingRows: (rows) => rows
              .eqOrNull(
                'request_id',
                widget.questionID?.toString(),
              )
              .eqOrNull(
                'client_name',
                _model.selectedRequest?.firstOrNull?.clientName,
              )
              .eqOrNull(
                'email',
                _model.selectedRequest?.firstOrNull?.email,
              ),
          returnRows: true,
        );

        safeSetState(() {});
      },
    );
    animationsMap.addAll({
      'columnOnPageLoadAnimation': AnimationInfo(
        trigger: AnimationTrigger.onPageLoad,
        effectsBuilder: () => [
          FadeEffect(
            curve: Curves.easeInOut,
            delay: 160.0.ms,
            duration: 600.0.ms,
            begin: 0.0,
            end: 1.0,
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
    return Padding(
      padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 24.0, 0.0),
      child: FutureBuilder<List<SupportRequestsRow>>(
        future: SupportRequestsTable().querySingleRow(
          queryFn: (q) => q
              .eqOrNull(
                'id',
                widget.questionID,
              )
              .eqOrNull(
                'email',
                widget.userMail,
              ),
        ),
        builder: (context, snapshot) {
          // Customize what your widget looks like when it's loading.
          if (!snapshot.hasData) {
            return SkeletonMultiLineListWidget(
              height: 96.0,
              itemsQty: 1,
              radii: 16,
              spacer: 16,
              between: 24,
            );
          }
          List<SupportRequestsRow> columnSupportRequestsRowList =
              snapshot.data!;

          final columnSupportRequestsRow =
              columnSupportRequestsRowList.isNotEmpty
                  ? columnSupportRequestsRowList.first
                  : null;

          return SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.max,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Align(
                  alignment: AlignmentDirectional(-1.0, 0.0),
                  child: Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 0.0, 0.0),
                    child: wrapWithModel(
                      model: _model.tittleWithIconAndSubtittleModel,
                      updateCallback: () => safeSetState(() {}),
                      updateOnChange: true,
                      child: TittleWithIconAndSubtittleWidget(
                        tittle: columnSupportRequestsRow!.theme!,
                        subtittle: '#${valueOrDefault<String>(
                          widget.questionID?.toString(),
                          'ID',
                        )} от ${valueOrDefault<String>(
                          dateTimeFormat(
                            "relative",
                            columnSupportRequestsRow.createdAt,
                            locale: FFLocalizations.of(context).languageCode,
                          ),
                          '23.05.24',
                        )}',
                        hasIcon: false,
                        hasSubtittle: true,
                      ),
                    ),
                  ),
                ),
                Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(0.0, 32.0, 0.0, 24.0),
                  child: Form(
                    key: _model.formKey,
                    autovalidateMode: AutovalidateMode.disabled,
                    child: Column(
                      mainAxisSize: MainAxisSize.max,
                      children: [
                        Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              16.0, 12.0, 16.0, 42.0),
                          child: Container(
                            constraints: BoxConstraints(
                              minWidth: 320.0,
                              maxWidth: 400.0,
                            ),
                            decoration: BoxDecoration(
                              color: FlutterFlowTheme.of(context)
                                  .secondaryBackground,
                              boxShadow: [
                                BoxShadow(
                                  blurRadius: 10.0,
                                  color: FlutterFlowTheme.of(context).shadow,
                                  offset: Offset(
                                    0.0,
                                    18.0,
                                  ),
                                  spreadRadius: 7.0,
                                )
                              ],
                              borderRadius: BorderRadius.circular(16.0),
                              border: Border.all(
                                color: FlutterFlowTheme.of(context).grayAlpha,
                              ),
                            ),
                            child: Padding(
                              padding: EdgeInsetsDirectional.fromSTEB(
                                  16.0, 24.0, 16.0, 24.0),
                              child: AutoSizeText(
                                valueOrDefault<String>(
                                  columnSupportRequestsRow.question,
                                  'вопрос пользователя',
                                ),
                                textAlign: TextAlign.start,
                                maxLines: 24,
                                style: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .override(
                                      fontFamily: 'Montserrat',
                                      color: FlutterFlowTheme.of(context)
                                          .secondaryText,
                                      fontSize: 16.0,
                                      letterSpacing: 0.0,
                                      fontWeight: FontWeight.bold,
                                    ),
                              ),
                            ),
                          ),
                        ),
                        Padding(
                          padding: EdgeInsetsDirectional.fromSTEB(
                              16.0, 0.0, 16.0, 0.0),
                          child: Column(
                            mainAxisSize: MainAxisSize.max,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              if ((columnSupportRequestsRow.image != null &&
                                      columnSupportRequestsRow.image != '') &&
                                  (columnSupportRequestsRow.image != 'null'))
                                Column(
                                  mainAxisSize: MainAxisSize.max,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Padding(
                                      padding: EdgeInsetsDirectional.fromSTEB(
                                          0.0, 0.0, 0.0, 4.0),
                                      child: Text(
                                        FFLocalizations.of(context).getText(
                                          '3t4y7ukm' /* Прикрепленное изображение: */,
                                        ),
                                        style: FlutterFlowTheme.of(context)
                                            .bodyMedium
                                            .override(
                                              fontFamily: 'Montserrat',
                                              letterSpacing: 0.0,
                                            ),
                                      ),
                                    ),
                                    InkWell(
                                      splashColor: Colors.transparent,
                                      focusColor: Colors.transparent,
                                      hoverColor: Colors.transparent,
                                      highlightColor: Colors.transparent,
                                      onTap: () async {
                                        await Navigator.push(
                                          context,
                                          PageTransition(
                                            type: PageTransitionType.fade,
                                            child: FlutterFlowExpandedImageView(
                                              image: Image.network(
                                                valueOrDefault<String>(
                                                  columnSupportRequestsRow
                                                                  .image !=
                                                              null &&
                                                          columnSupportRequestsRow
                                                                  .image !=
                                                              ''
                                                      ? columnSupportRequestsRow
                                                          .image
                                                      : 'https://yzapdavvyxgrgeskutdl.supabase.co/storage/v1/object/public/crm-tochka/default_avatars/errorimgload.png',
                                                  'https://yzapdavvyxgrgeskutdl.supabase.co/storage/v1/object/public/crm-tochka/default_avatars/errorimgload.png',
                                                ),
                                                fit: BoxFit.contain,
                                                alignment: Alignment(-1.0, 0.0),
                                              ),
                                              allowRotation: false,
                                              tag: valueOrDefault<String>(
                                                columnSupportRequestsRow
                                                                .image !=
                                                            null &&
                                                        columnSupportRequestsRow
                                                                .image !=
                                                            ''
                                                    ? columnSupportRequestsRow
                                                        .image
                                                    : 'https://yzapdavvyxgrgeskutdl.supabase.co/storage/v1/object/public/crm-tochka/default_avatars/errorimgload.png',
                                                'https://yzapdavvyxgrgeskutdl.supabase.co/storage/v1/object/public/crm-tochka/default_avatars/errorimgload.png',
                                              ),
                                              useHeroAnimation: true,
                                            ),
                                          ),
                                        );
                                      },
                                      child: Hero(
                                        tag: valueOrDefault<String>(
                                          columnSupportRequestsRow.image !=
                                                      null &&
                                                  columnSupportRequestsRow
                                                          .image !=
                                                      ''
                                              ? columnSupportRequestsRow.image
                                              : 'https://yzapdavvyxgrgeskutdl.supabase.co/storage/v1/object/public/crm-tochka/default_avatars/errorimgload.png',
                                          'https://yzapdavvyxgrgeskutdl.supabase.co/storage/v1/object/public/crm-tochka/default_avatars/errorimgload.png',
                                        ),
                                        transitionOnUserGestures: true,
                                        child: ClipRRect(
                                          borderRadius:
                                              BorderRadius.circular(8.0),
                                          child: Image.network(
                                            valueOrDefault<String>(
                                              columnSupportRequestsRow.image !=
                                                          null &&
                                                      columnSupportRequestsRow
                                                              .image !=
                                                          ''
                                                  ? columnSupportRequestsRow
                                                      .image
                                                  : 'https://yzapdavvyxgrgeskutdl.supabase.co/storage/v1/object/public/crm-tochka/default_avatars/errorimgload.png',
                                              'https://yzapdavvyxgrgeskutdl.supabase.co/storage/v1/object/public/crm-tochka/default_avatars/errorimgload.png',
                                            ),
                                            width: 374.0,
                                            height: 200.0,
                                            fit: BoxFit.fitHeight,
                                            alignment: Alignment(-1.0, 0.0),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ].divide(SizedBox(height: 8.0)),
                                ),
                              Column(
                                mainAxisSize: MainAxisSize.max,
                                children: [
                                  Padding(
                                    padding: EdgeInsetsDirectional.fromSTEB(
                                        0.0, 8.0, 0.0, 0.0),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.max,
                                      mainAxisAlignment:
                                          MainAxisAlignment.start,
                                      children: [
                                        Text(
                                          FFLocalizations.of(context).getText(
                                            'studkph5' /* Ответьте по сути.
Приветствие,... */
                                            ,
                                          ),
                                          style: FlutterFlowTheme.of(context)
                                              .bodyMedium
                                              .override(
                                                fontFamily: 'Montserrat',
                                                letterSpacing: 0.0,
                                              ),
                                        ),
                                      ].divide(SizedBox(width: 16.0)),
                                    ),
                                  ),
                                ].divide(SizedBox(height: 16.0)),
                              ),
                              TextFormField(
                                controller: _model.answerTextController ??=
                                    TextEditingController(
                                  text: columnSupportRequestsRow.answer,
                                ),
                                focusNode: _model.answerFocusNode,
                                autofocus: false,
                                textCapitalization: TextCapitalization.words,
                                obscureText: false,
                                decoration: InputDecoration(
                                  isDense: true,
                                  labelText:
                                      FFLocalizations.of(context).getText(
                                    'iwsck9fs' /* Ответ: */,
                                  ),
                                  labelStyle: FlutterFlowTheme.of(context)
                                      .bodyMedium
                                      .override(
                                        fontFamily: 'Montserrat',
                                        letterSpacing: 0.0,
                                        fontWeight: FontWeight.normal,
                                      ),
                                  alignLabelWithHint: true,
                                  hintStyle: FlutterFlowTheme.of(context)
                                      .bodyMedium
                                      .override(
                                        fontFamily: 'Montserrat',
                                        color: FlutterFlowTheme.of(context)
                                            .tertiaryText,
                                        letterSpacing: 0.0,
                                        fontWeight: FontWeight.normal,
                                      ),
                                  enabledBorder: OutlineInputBorder(
                                    borderSide: BorderSide(
                                      color: FlutterFlowTheme.of(context)
                                          .primaryBackground,
                                      width: 2.0,
                                    ),
                                    borderRadius: BorderRadius.circular(16.0),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderSide: BorderSide(
                                      color: FlutterFlowTheme.of(context)
                                          .grayAlpha,
                                      width: 2.0,
                                    ),
                                    borderRadius: BorderRadius.circular(16.0),
                                  ),
                                  errorBorder: OutlineInputBorder(
                                    borderSide: BorderSide(
                                      color: FlutterFlowTheme.of(context).error,
                                      width: 2.0,
                                    ),
                                    borderRadius: BorderRadius.circular(16.0),
                                  ),
                                  focusedErrorBorder: OutlineInputBorder(
                                    borderSide: BorderSide(
                                      color: FlutterFlowTheme.of(context).error,
                                      width: 2.0,
                                    ),
                                    borderRadius: BorderRadius.circular(16.0),
                                  ),
                                  filled: true,
                                  fillColor: FlutterFlowTheme.of(context)
                                      .primaryBackground,
                                ),
                                style: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .override(
                                      fontFamily: 'Montserrat',
                                      letterSpacing: 0.0,
                                      fontWeight: FontWeight.normal,
                                    ),
                                maxLines: null,
                                minLines: 8,
                                validator: _model.answerTextControllerValidator
                                    .asValidator(context),
                              ),
                            ].divide(SizedBox(height: 24.0)),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 0.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.max,
                    children: [
                      Align(
                        alignment: AlignmentDirectional(0.0, 0.0),
                        child: FFButtonWidget(
                          onPressed: (/* NOT RECOMMENDED */ _model
                                      .answerTextController.text ==
                                  'true')
                              ? null
                              : () async {
                                  _model.askClientInfo =
                                      await ClientsTable().queryRows(
                                    queryFn: (q) => q.eqOrNull(
                                      'email',
                                      widget.userMail,
                                    ),
                                  );
                                  if (widget.hasAnswer) {
                                    _model.updateAnswer =
                                        await SupportRequestsTable().update(
                                      data: {
                                        'has_answer': true,
                                        'answer_by': currentUserEmail,
                                        'answer':
                                            _model.answerTextController.text,
                                        'answer_date': supaSerialize<DateTime>(
                                            functions.convertTimeToServerTime(
                                                getCurrentTimestamp)),
                                      },
                                      matchingRows: (rows) => rows.eqOrNull(
                                        'id',
                                        widget.questionID,
                                      ),
                                      returnRows: true,
                                    );
                                    _model.updateNotification =
                                        await ClientNotificationsTable().update(
                                      data: {
                                        'is_read': false,
                                        'sent_at': supaSerialize<DateTime>(
                                            functions.convertTimeToServerTime(
                                                getCurrentTimestamp)),
                                      },
                                      matchingRows: (rows) => rows
                                          .eqOrNull(
                                            'client_id',
                                            _model.askClientInfo?.firstOrNull
                                                ?.clientId,
                                          )
                                          .eqOrNull(
                                            'support_request_id',
                                            widget.questionID,
                                          ),
                                      returnRows: true,
                                    );
                                    await Future.wait([
                                      Future(() async {
                                        ScaffoldMessenger.of(context)
                                            .showSnackBar(
                                          SnackBar(
                                            content: Text(
                                              'Ответ jобновлен',
                                              style: FlutterFlowTheme.of(
                                                      context)
                                                  .labelMedium
                                                  .override(
                                                    fontFamily: 'Montserrat',
                                                    color: FlutterFlowTheme.of(
                                                            context)
                                                        .secondaryBackground,
                                                    letterSpacing: 0.0,
                                                  ),
                                            ),
                                            duration:
                                                Duration(milliseconds: 4000),
                                            backgroundColor:
                                                FlutterFlowTheme.of(context)
                                                    .success,
                                          ),
                                        );
                                      }),
                                      Future(() async {
                                        Navigator.pop(context);
                                        safeSetState(() {
                                          _model.answerTextController?.clear();
                                        });
                                      }),
                                    ]);
                                    await widget.drawer?.call(
                                      true,
                                    );
                                  } else {
                                    // Добавляем ответ в таблицу
                                    _model.sendAnswer =
                                        await SupportRequestsTable().update(
                                      data: {
                                        'has_answer': true,
                                        'answer_by': currentUserEmail,
                                        'answer':
                                            _model.answerTextController.text,
                                        'answer_date': supaSerialize<DateTime>(
                                            functions.convertTimeToServerTime(
                                                getCurrentTimestamp)),
                                      },
                                      matchingRows: (rows) => rows.eqOrNull(
                                        'id',
                                        widget.questionID,
                                      ),
                                      returnRows: true,
                                    );
                                    // Создаем уведомление
                                    _model.createNotification =
                                        await ClientNotificationsTable()
                                            .insert({
                                      'client_id': valueOrDefault<String>(
                                        _model.askClientInfo?.firstOrNull
                                            ?.clientId,
                                        'clientID',
                                      ),
                                      'notification_id': 'support_answer',
                                      'is_read': false,
                                      'support_request_id': widget.questionID,
                                      'sent_at': supaSerialize<DateTime>(
                                          functions.convertTimeToServerTime(
                                              getCurrentTimestamp)),
                                      'user_id': _model
                                          .askClientInfo?.firstOrNull?.userId,
                                    });
                                    await Future.wait([
                                      Future(() async {
                                        ScaffoldMessenger.of(context)
                                            .showSnackBar(
                                          SnackBar(
                                            content: Text(
                                              'Ответ отправлен',
                                              style: FlutterFlowTheme.of(
                                                      context)
                                                  .labelMedium
                                                  .override(
                                                    fontFamily: 'Montserrat',
                                                    color: FlutterFlowTheme.of(
                                                            context)
                                                        .secondaryBackground,
                                                    letterSpacing: 0.0,
                                                  ),
                                            ),
                                            duration:
                                                Duration(milliseconds: 4000),
                                            backgroundColor:
                                                FlutterFlowTheme.of(context)
                                                    .success,
                                          ),
                                        );
                                      }),
                                      Future(() async {
                                        Navigator.pop(context);
                                        safeSetState(() {
                                          _model.answerTextController?.clear();
                                        });
                                      }),
                                    ]);
                                    await widget.drawer?.call(
                                      true,
                                    );
                                  }

                                  safeSetState(() {});
                                },
                          text: valueOrDefault<String>(
                            widget.hasAnswer
                                ? 'Изменить ответ'
                                : 'Отправить ответ',
                            'Отправить ответ',
                          ),
                          options: FFButtonOptions(
                            width: double.infinity,
                            height: 44.0,
                            padding: EdgeInsetsDirectional.fromSTEB(
                                0.0, 0.0, 0.0, 0.0),
                            iconPadding: EdgeInsetsDirectional.fromSTEB(
                                0.0, 0.0, 0.0, 0.0),
                            color: FlutterFlowTheme.of(context).primary,
                            textStyle: FlutterFlowTheme.of(context)
                                .labelLarge
                                .override(
                                  fontFamily: 'Montserrat',
                                  color: FlutterFlowTheme.of(context).info,
                                  fontSize: 16.0,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.w600,
                                ),
                            elevation: 1.0,
                            borderSide: BorderSide(
                              color: Colors.transparent,
                              width: 1.0,
                            ),
                            borderRadius: BorderRadius.circular(16.0),
                            disabledColor:
                                FlutterFlowTheme.of(context).alternate,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: EdgeInsetsDirectional.fromSTEB(16.0, 0.0, 16.0, 0.0),
                  child: Container(
                    width: 380.0,
                    decoration: BoxDecoration(),
                  ),
                ),
                Align(
                  alignment: AlignmentDirectional(0.0, 0.0),
                  child: Padding(
                    padding:
                        EdgeInsetsDirectional.fromSTEB(16.0, 16.0, 16.0, 24.0),
                    child: FFButtonWidget(
                      onPressed: () async {
                        Navigator.pop(context);
                        safeSetState(() {
                          _model.answerTextController?.clear();
                        });
                      },
                      text: valueOrDefault<String>(
                        widget.hasAnswer
                            ? 'Оставить как есть'
                            : 'Оставить без ответа',
                        'Оставить без ответа',
                      ),
                      options: FFButtonOptions(
                        width: double.infinity,
                        height: 44.0,
                        padding: EdgeInsetsDirectional.fromSTEB(
                            16.0, 4.0, 16.0, 4.0),
                        iconPadding:
                            EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 0.0),
                        color: Colors.transparent,
                        textStyle: FlutterFlowTheme.of(context)
                            .bodyLarge
                            .override(
                              fontFamily: 'Montserrat',
                              color: FlutterFlowTheme.of(context).secondaryText,
                              letterSpacing: 0.0,
                              fontWeight: FontWeight.w600,
                            ),
                        elevation: 0.0,
                        borderSide: BorderSide(
                          color: FlutterFlowTheme.of(context).alternate,
                          width: 1.0,
                        ),
                        borderRadius: BorderRadius.circular(16.0),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ).animateOnPageLoad(animationsMap['columnOnPageLoadAnimation']!);
        },
      ),
    );
  }
}
