import '/auth/supabase_auth/auth_util.dart';
import '/backend/supabase/supabase.dart';
import '/components/my_avatar_widget.dart';
import '/components/tittle_with_icon_and_subtittle_widget.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/flutter_flow/upload_data.dart';
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'edit_my_info_model.dart';
export 'edit_my_info_model.dart';

class EditMyInfoWidget extends StatefulWidget {
  const EditMyInfoWidget({super.key});

  @override
  State<EditMyInfoWidget> createState() => _EditMyInfoWidgetState();
}

class _EditMyInfoWidgetState extends State<EditMyInfoWidget> {
  late EditMyInfoModel _model;

  @override
  void setState(VoidCallback callback) {
    super.setState(callback);
    _model.onUpdate();
  }

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => EditMyInfoModel());

    _model.displayNameTextController ??=
        TextEditingController(text: FFAppState().username);
    _model.displayNameFocusNode ??= FocusNode();

    _model.phoneTextController ??=
        TextEditingController(text: FFAppState().userPhone);
    _model.phoneFocusNode ??= FocusNode();

    WidgetsBinding.instance.addPostFrameCallback((_) => safeSetState(() {}));
  }

  @override
  void dispose() {
    _model.maybeDispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    context.watch<FFAppState>();

    return Padding(
      padding: EdgeInsetsDirectional.fromSTEB(36.0, 0.0, 42.0, 0.0),
      child: Column(
        mainAxisSize: MainAxisSize.max,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Align(
            alignment: AlignmentDirectional(-1.0, 0.0),
            child: wrapWithModel(
              model: _model.tittleWithIconAndSubtittleModel,
              updateCallback: () => safeSetState(() {}),
              child: TittleWithIconAndSubtittleWidget(
                tittle: valueOrDefault<String>(
                  FFLocalizations.of(context).getVariableText(
                    ruText: 'Мой аккаунт',
                    enText: 'My info',
                  ),
                  'Мой аккаунт',
                ),
                subtittle: valueOrDefault<String>(
                  FFAppState().userPhone == ''
                      ? FFLocalizations.of(context).getVariableText(
                          ruText: 'Пожалуйста, укажите телефон',
                          enText: 'Please, set phone number',
                        )
                      : valueOrDefault<String>(
                          FFLocalizations.of(context).getVariableText(
                            ruText:
                                'Аватар загружается и меняется после закрытия дравлера и перезагрузки страницы',
                            enText:
                                'The avatar loads and changes after closing the dravler and reloading the page',
                          ),
                          'Аватар загружается и меняется после закрытия дравлера и перезагрузки страницы',
                        ),
                  'Для удобства  команды используйте как  аватар реальное фото',
                ),
                hasIcon: false,
                hasSubtittle: true,
              ),
            ),
          ),
          Padding(
            padding: EdgeInsetsDirectional.fromSTEB(0.0, 48.0, 0.0, 36.0),
            child: Form(
              key: _model.formKey,
              autovalidateMode: AutovalidateMode.disabled,
              child: Column(
                mainAxisSize: MainAxisSize.max,
                children: [
                  InkWell(
                    splashColor: Colors.transparent,
                    focusColor: Colors.transparent,
                    hoverColor: Colors.transparent,
                    highlightColor: Colors.transparent,
                    onTap: () async {
                      final selectedMedia = await selectMedia(
                        storageFolderPath: 'users_avatars_${currentUserEmail}',
                        maxWidth: 240.00,
                        maxHeight: 240.00,
                        includeBlurHash: true,
                        mediaSource: MediaSource.photoGallery,
                        multiImage: false,
                      );
                      if (selectedMedia != null &&
                          selectedMedia.every((m) =>
                              validateFileFormat(m.storagePath, context))) {
                        safeSetState(() => _model.isDataUploading = true);
                        var selectedUploadedFiles = <FFUploadedFile>[];

                        var downloadUrls = <String>[];
                        try {
                          selectedUploadedFiles = selectedMedia
                              .map((m) => FFUploadedFile(
                                    name: m.storagePath.split('/').last,
                                    bytes: m.bytes,
                                    height: m.dimensions?.height,
                                    width: m.dimensions?.width,
                                    blurHash: m.blurHash,
                                  ))
                              .toList();

                          downloadUrls = await uploadSupabaseStorageFiles(
                            bucketName: 'crm-tochka',
                            selectedFiles: selectedMedia,
                          );
                        } finally {
                          _model.isDataUploading = false;
                        }
                        if (selectedUploadedFiles.length ==
                                selectedMedia.length &&
                            downloadUrls.length == selectedMedia.length) {
                          safeSetState(() {
                            _model.uploadedLocalFile =
                                selectedUploadedFiles.first;
                            _model.uploadedFileUrl = downloadUrls.first;
                          });
                        } else {
                          safeSetState(() {});
                          return;
                        }
                      }

                      _model.updAvatar = await UsersByRolesTable().update(
                        data: {
                          'avatar_patch': FFAppState().avatar,
                        },
                        matchingRows: (rows) => rows.eqOrNull(
                          'email',
                          currentUserEmail,
                        ),
                        returnRows: true,
                      );
                      _model.avatarUpdated = true;
                      _model.avatarPatch = FFAppState().avatar;
                      safeSetState(() {});

                      safeSetState(() {});
                    },
                    child: Container(
                      width: 120.0,
                      height: 120.0,
                      decoration: BoxDecoration(),
                      child: Align(
                        alignment: AlignmentDirectional(0.0, 0.0),
                        child: Stack(
                          alignment: AlignmentDirectional(0.0, 0.0),
                          children: [
                            Opacity(
                              opacity: 0.6,
                              child: wrapWithModel(
                                model: _model.myAvatarModel,
                                updateCallback: () => safeSetState(() {}),
                                child: MyAvatarWidget(
                                  size: 120,
                                ),
                              ),
                            ),
                            if (!_model.avatarUpdated)
                              Icon(
                                Icons.photo_camera_outlined,
                                color: FlutterFlowTheme.of(context).primary,
                                size: 42.0,
                              ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  TextFormField(
                    controller: _model.displayNameTextController,
                    focusNode: _model.displayNameFocusNode,
                    autofocus: false,
                    textCapitalization: TextCapitalization.words,
                    obscureText: false,
                    decoration: InputDecoration(
                      isDense: true,
                      labelText: FFLocalizations.of(context).getText(
                        '7gr3urq2' /* Имя Фамилия */,
                      ),
                      labelStyle:
                          FlutterFlowTheme.of(context).bodyMedium.override(
                                fontFamily: 'Montserrat',
                                letterSpacing: 0.0,
                                fontWeight: FontWeight.normal,
                              ),
                      alignLabelWithHint: true,
                      hintText: FFAppState().username,
                      hintStyle: FlutterFlowTheme.of(context)
                          .bodyMedium
                          .override(
                            fontFamily: 'Montserrat',
                            color: FlutterFlowTheme.of(context).tertiaryText,
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.normal,
                          ),
                      enabledBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: FlutterFlowTheme.of(context).primaryBackground,
                          width: 2.0,
                        ),
                        borderRadius: BorderRadius.circular(16.0),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: FlutterFlowTheme.of(context).grayAlpha,
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
                      fillColor: FlutterFlowTheme.of(context).primaryBackground,
                    ),
                    style: FlutterFlowTheme.of(context).bodyMedium.override(
                          fontFamily: 'Montserrat',
                          letterSpacing: 0.0,
                          fontWeight: FontWeight.normal,
                        ),
                    validator: _model.displayNameTextControllerValidator
                        .asValidator(context),
                  ),
                  TextFormField(
                    controller: _model.phoneTextController,
                    focusNode: _model.phoneFocusNode,
                    autofocus: false,
                    autofillHints: [AutofillHints.telephoneNumber],
                    textCapitalization: TextCapitalization.none,
                    obscureText: false,
                    decoration: InputDecoration(
                      isDense: true,
                      labelText: FFLocalizations.of(context).getText(
                        'g9hj8ds6' /* Телефон */,
                      ),
                      labelStyle: FlutterFlowTheme.of(context)
                          .bodyMedium
                          .override(
                            fontFamily: 'Montserrat',
                            color: FlutterFlowTheme.of(context).tertiaryText,
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.w600,
                          ),
                      alignLabelWithHint: false,
                      hintText: valueOrDefault<String>(
                        FFAppState().userPhone,
                        '+7(XXX) XXX-XX-XX',
                      ),
                      hintStyle: FlutterFlowTheme.of(context)
                          .bodyMedium
                          .override(
                            fontFamily: 'Montserrat',
                            color: FlutterFlowTheme.of(context).tertiaryText,
                            letterSpacing: 0.0,
                            fontWeight: FontWeight.normal,
                          ),
                      enabledBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: FlutterFlowTheme.of(context).primaryBackground,
                          width: 2.0,
                        ),
                        borderRadius: BorderRadius.circular(16.0),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: FlutterFlowTheme.of(context).grayAlpha,
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
                      fillColor: FlutterFlowTheme.of(context).primaryBackground,
                    ),
                    style: FlutterFlowTheme.of(context).bodyMedium.override(
                          fontFamily: 'Montserrat',
                          letterSpacing: 0.0,
                          fontWeight: FontWeight.normal,
                        ),
                    keyboardType: TextInputType.phone,
                    validator: _model.phoneTextControllerValidator
                        .asValidator(context),
                    inputFormatters: [_model.phoneMask],
                  ),
                ].divide(SizedBox(height: 24.0)),
              ),
            ),
          ),
          Align(
            alignment: AlignmentDirectional(0.0, 0.0),
            child: FFButtonWidget(
              onPressed: () async {
                unawaited(
                  () async {
                    _model.editUserInfo = await UsersByRolesTable().update(
                      data: {
                        'phone': _model.phoneTextController.text,
                        'username': _model.displayNameTextController.text,
                        'avatar_patch': _model.uploadedFileUrl,
                      },
                      matchingRows: (rows) => rows.eqOrNull(
                        'created_by',
                        currentUserUid,
                      ),
                      returnRows: true,
                    );
                  }(),
                );
                FFAppState().userPhone = _model.phoneTextController.text;
                FFAppState().avatar = _model.uploadedFileUrl;
                FFAppState().username = _model.displayNameTextController.text;
                safeSetState(() {});
                await Future.delayed(const Duration(milliseconds: 500));
                if (Scaffold.of(context).isDrawerOpen ||
                    Scaffold.of(context).isEndDrawerOpen) {
                  Navigator.pop(context);
                }

                safeSetState(() {});
              },
              text: FFLocalizations.of(context).getText(
                '6miaw6jf' /* Сохранить */,
              ),
              options: FFButtonOptions(
                width: double.infinity,
                height: 44.0,
                padding: EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 0.0),
                iconPadding: EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 0.0),
                color: FlutterFlowTheme.of(context).primary,
                textStyle: FlutterFlowTheme.of(context).labelLarge.override(
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
              ),
            ),
          ),
          Align(
            alignment: AlignmentDirectional(0.0, 0.0),
            child: Padding(
              padding: EdgeInsetsDirectional.fromSTEB(0.0, 12.0, 0.0, 0.0),
              child: FFButtonWidget(
                onPressed: () async {
                  Navigator.pop(context);
                },
                text: FFLocalizations.of(context).getText(
                  'bkitc5ki' /* Отмена */,
                ),
                options: FFButtonOptions(
                  width: double.infinity,
                  height: 44.0,
                  padding: EdgeInsetsDirectional.fromSTEB(16.0, 4.0, 16.0, 4.0),
                  iconPadding:
                      EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 0.0),
                  color: Colors.transparent,
                  textStyle: FlutterFlowTheme.of(context).bodyLarge.override(
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
    );
  }
}
