var ppstpdr_Script = function () {
    return {
        view_tab: function (div, iconhide, iconshow, cookie_text, id_type) {
            $('#' + div).removeClass('hidden');
            $('#' + iconhide).addClass('hidden');
            $('#' + iconshow).removeClass('hidden');

            if (id_type == 1) { //customer
            }
            else if (id_type == 2) { //service requested
                ppstpdr_Script.save_stpdr_customer();
            }
            else if (id_type == 3) { //gen details
                ppstpdr_Script.save_service_requested();
            }
            else if (id_type == 4) { //accessibility
                ppstpdr_Script.save_roi();
            }
            else if (id_type == 5) { //termites
                ppstpdr_Script.save_accessibility();
            }
            else if (id_type == 6) { //chemdel
                ppstpdr_Script.save_termites();
            }
            else if (id_type == 7) { //fungal decay
                ppstpdr_Script.save_chemdel();
            }
            else if (id_type == 8) { //wood borer
                ppstpdr_Script.save_fd();
            }
            else if (id_type == 9) { //ccttpa
                ppstpdr_Script.save_wb();
            }
            else if (id_type == 10) { //safety hazard
                ppstpdr_Script.save_ccttpa();
            }
            else if (id_type == 12) { //additional comment
                ppstpdr_Script.save_msh();
            }
            else if (id_type == 13) { //annex
                ppstpdr_Script.save_ac();
            }
            else if (id_type == 14) { //certification
                ppstpdr_Script.save_annex();
            }
            else if (id_type == 15) { //conclusion
                ppstpdr_Script.save_cert();
            }

        },
        hide_tab: function (div, iconhide, iconshow, cookie_text, id_type) {
            $('#' + div).addClass('hidden');
            $('#' + iconhide).removeClass('hidden');
            $('#' + iconshow).addClass('hidden');

            if (id_type == 1) { //customer
                ppstpdr_Script.save_stpdr_customer();
            }
            else if (id_type == 2) { //service requested
                ppstpdr_Script.save_service_requested();
            }
            else if (id_type == 3) { //gen details
                ppstpdr_Script.save_roi();
            }
            else if (id_type == 4) { //accessibility
                ppstpdr_Script.save_accessibility();
            }
            else if (id_type == 5) { //termites
                ppstpdr_Script.save_termites();
            }
            else if (id_type == 6) { //chemdel
                ppstpdr_Script.save_chemdel();
            }
            else if (id_type == 7) { //fungal decay
                ppstpdr_Script.save_fd();
            }
            else if (id_type == 8) { //wood borer
                ppstpdr_Script.save_wb();
            }
            else if (id_type == 9) { //ccttpa
                ppstpdr_Script.save_ccttpa();
            }
            else if (id_type == 10) { //safety hazard
                ppstpdr_Script.save_msh();
            }
            else if (id_type == 12) { //additional comment
                ppstpdr_Script.save_ac();
            }
            else if (id_type == 13) { //annex
                ppstpdr_Script.save_annex();
            }
            else if (id_type == 14) { //certification
                ppstpdr_Script.save_cert();
            }
            else if (id_type == 15) { //conclusion
                ppstpdr_Script.save_conclusion();
            }


        },
        view_icon: function (id, type) {
            $('#' + type + '-view-icon').addClass('hidden');
            $('#' + type + '-hide-icon').removeClass('hidden');
            $('#' + type + '-diagram-icon').removeClass('hidden');
        },
        hide_icon: function (id, type) {
            $('#' + type + '-view-icon').removeClass('hidden');
            $('#' + type + '-hide-icon').addClass('hidden');
        },
        get_all_stpdr_info: function (report_id, job_id) {
            if (report_id > 0 && job_id > 0) {
                var user = localdb.getUser();
                var jsonparam = { company_id: user.company_id, user_id: user.user_id, job_id: job_id, rid: report_id };
                var uri = '/reports/GetPPSTPDR/' + user.token + '/';
                unitrak_api.ajax(uri, jsonparam, function (data) {

                    //customer details
                    $('#hf_stpdr_customer_id').val(data.rmstpR_Report.customer_id);
                    $('#tb_customer_name').val(data.rmstpR_Report.name).attr('data-client-id', data.rmstpR_Report.customer_id).attr('readonly', 'readonly');
                    $('#tb_customer_address').val(data.rmstpR_Report.address).attr('readonly', 'readonly');
                    $('#tb_customer_email').val(data.rmstpR_Report.email).attr('readonly', 'readonly');
                    $('#tb_customer_date_inspection').val(data.rmstpR_Report.date_of_inspection_string);
                    $('#tb_customer_duration_of_inspection').val(data.rmstpR_Report.duration_string);
                    $('#tb_customer_date_inspection').datepicker({ dateFormat: 'dd/mm/yy' });
                    ppstpdr_Script.get_img_list(job_id, report_id, '1.00', function (data) {
                        ppstpdr_Script.reload_img_list(data, '1.00', report_id);
                    });

                    //service requested
                    ppstpdr_Script.get_service_requested(data.sr);

                    //gen roi
                    ppstpdr_Script.get_roi(data.gen);

                    //gen accessibility
                    ppstpdr_Script.get_accessibility(data.access, report_id);

                    //termites
                    ppstpdr_Script.get_termites(data.termites, report_id);

                    //chem del
                    ppstpdr_Script.get_chemdel(data.chemdel, report_id);

                    //fungal decay
                    ppstpdr_Script.get_fd(data.fd, report_id);

                    //wood borers
                    ppstpdr_Script.get_wb(data.wb, report_id);

                    //ccttpa
                    ppstpdr_Script.get_ccttpa(data.ccttpa, report_id);

                    //safety hazard
                    ppstpdr_Script.get_msh(data.msh, report_id);

                    //additional comments
                    ppstpdr_Script.get_ac(data.acomment);

                    //annex
                    ppstpdr_Script.get_annex(data.annex, report_id);

                    //certification
                    ppstpdr_Script.get_cert(data.cert);

                    //conclusion
                    ppstpdr_Script.get_conclusion(data.conclusion);


                }, function (err) {
                    unitrak_mobile._showError(err);
                });
            }           
        },
        get_stpdr_info: function () {
        },
        save_stpdr_customer: function (callback) {
            var user = localdb.getUser();
            var job_id =  $('#hf_stpdr_job_id').val();
            var id = $('#hf_stpdr_report_id').val();
            if (job_id > 0 && id > 0) {

                var _customer_date_inspection = $('#tb_customer_date_inspection').val();
                if ($.trim(_customer_date_inspection.length) == 0) { var today = new Date();  _customer_date_inspection = today.defaultView(); }
                var _customer_duration_of_inspection = $('#tb_customer_duration_of_inspection').val();
                if ($.trim(_customer_duration_of_inspection).length == 0 || (isNaN(_customer_duration_of_inspection) == true)) { _customer_duration_of_inspection = 0; }

                var dto = {
                    company_id: user.company_id,
                    user_id: user.id,
                    report_id: id,
                    date_of_inspection: _customer_date_inspection,
                    duration: $('#tb_customer_duration_of_inspection').val(),
                    job_id: job_id,
                    customer_id: $('#hf_cusid').val(),
                    type_id: 1
                };

                sql_offline.get_imode_callback(
                    function (status) {
                        if (status == 1) { //offline
                        }
                        else {
                            var uri = '/reports/PostSavePPSTPDRData/' + user.token + '/'
                            unitrak_api.ajax_post(uri, dto,
                                function (data) {
                                    ppstpdr_Script.save_and_post_report('img_customer_html','img_customer', '1.00', id);
                                    if (callback) callback();
                                }, function (err) {
                                    console.log(err);
                                    if (callback) callback();
                                });
                        }
                    }
                );
            }
        },
        save_and_post_report: function (elid, elIDdb, position, report_id, callback) {
            $(_file_upload_images_list).empty();
            if ($('.file-container.report-element.' + elid + ' img').length > 0) {
                _form_manager.event.execute_file_upload_ppstpdr(0, elid, elIDdb, position, report_id);
            }
            else{
                $.mobile.loading("hide");
            }
            if (callback) callback();
        },
        get_img_list: function (job_id, report_id, position, callback) {
            if (report_id > 0) {
                var user = localdb.getUser();
                var jsonparam = { company_id: user.company_id, user_id: user.user_id, job_id: job_id, rid: report_id, position: position };
                var uri = '/reports/GetPPSTPDRIMG/' + user.token + '/';
                unitrak_api.ajax(uri, jsonparam, function (data) {
                    if (callback) callback(data);
                }, function (err) {
                    unitrak_mobile._showError(err);
                });
            }
        },
        reload_img_list: function (data, position, report_id) {
            if (position == "1.00") {
                $('#img_customer_html_list').html(data);
                $('#img_customer_html').html('');
            }
            else if (position == "2.2.2.1") {
                $('#img_accessibility_io_html_list').html(data);
                $('#img_accessibility_io_html').html('');
            }
            else if (position == "2.2.2.2") {
                $('#img_accessibility_eo_html_list').html(data);
                $('#img_accessibility_eo_html').html('');
            }
            else if (position == "2.2.2.3") {
                $('#img_accessibility_o_html_list').html(data);
                $('#img_accessibility_o_html').html('');
            }
            else if (position == "2.2.2.4") {
                $('#img_accessibility_sf_html_list').html(data);
                $('#img_accessibility_sf_html').html('');
            }
            else if (position == "2.2.2.5") {
                $('#img_accessibility_rs_html_list').html(data);
                $('#img_accessibility_rs_html').html('');
            }
            else if (position == "2.2.2.6") {
                $('#img_accessibility_s_html_list').html(data);
                $('#img_accessibility_s_html').html('');
            }
            else if (position == "2.2.2.7") {
                $('#img_accessibility_re_html_list').html(data);
                $('#img_accessibility_re_html').html('');
            }
            else if (position == "2.2.3") {
                $('#img_accessibility_inaccessible_areas_html_list').html(data);
                $('#img_accessibility_inaccessible_areas_html').html('');
            }
            else if (position == "3.1.0") {
                $('#img_termite_nest_found_html_list').html(data);
                $('#img_termite_nest_found_html').html('');
            }
            else if (position == "3.1.1") {
                $('#img_termite_ss_html_list').html(data);
                $('#img_termite_ss_html').html('');
            }
            else if (position == "3.3.0") {
                $('#img_termite_twd_html_list').html(data);
                $('#img_termite_twd_html').html('');
            }
            else if (position == "3.4.0") {
                $('#img_termite_ptmp_html_list').html(data);
                $('#img_termite_ptmp_html').html('');
            }
            else if (position == "5.0.0") {
                $('#img_fungal_decay_html_list').html(data);
                $('#img_fungal_decay_html').html('');
            }
            else if (position == "7.2.0") {
                $('#img_ccttpa_pem_html_list').html(data);
                $('#img_ccttpa_pem_html').html('');
            }
            else if (position == "7.3.0") {
                $('#img_ccttpa_bridging_html_list').html(data);
                $('#img_ccttpa_bridging_html').html('');
            }
            else if (position == "7.5.0") {
                $('#img_ccttpa_othercondition_html_list').html(data);
                $('#img_ccttpa_othercondition_html').html('');
            }
            else if (position == "8.0.0") {
                $('#img_msh_html_list').html(data);
                $('#img_msh_html').html('');
            }
            else if (position == "11.0.0") {
                $('#img_annex_comment_html_list').html(data);
                $('#img_annex_comment_html').html('');
            }
            else if (position == "4.0.0") {
                $('#img_chemdel_html_list').html(data);
                $('#img_chemdel_html').html('');
            }
            else if (position == "6.0.0") {
                $('#img_wood_borers_html_list').html(data);
                $('#img_wood_borers_html').html('');
            }
        },
        delete_img: function (id, position, report_id) {
        },
        get_service_requested: function (sr) {
            if (sr.id > 0) {
                $('#hf_service_requested').val(sr.sel_option);
                ppstpdr_Script.select_unselect('hf_service_requested', 'service-requested', sr.sel_option, 'sr-option' + sr.sel_option)
                $('#tb_sr_special_condition').val(sr.special_con_ins);
            }
        },
        save_service_requested: function (callback) {
            var user = localdb.getUser();
            var job_id =  $('#hf_stpdr_job_id').val();
            var report_id = $('#hf_stpdr_report_id').val();
            if (job_id > 0 && report_id > 0) {

                var _sel_option = $('#hf_service_requested').val();
                var _special_con_ins = $('#tb_sr_special_condition').val();

                var dto = {
                    company_id: user.company_id,
                    user_id: user.id,
                    report_id: report_id,
                    sel_option: _sel_option,
                    special_con_ins: _special_con_ins,
                    job_id: job_id,
                    type_id: 2
                };

                sql_offline.get_imode_callback(
                    function (status) {
                        if (status == 1) { //offline
                        }
                        else {
                            var uri = '/reports/PostSavePPSTPDRData/' + user.token + '/'
                            unitrak_api.ajax_post(uri, dto,
                                function () {
                                    if (callback) callback();
                                }, function (err) {
                                    console.log(err);
                                    if (callback) callback();
                                });
                        }
                    }
                );
            }
        },
        get_roi: function (gen) {
            if (gen.id > 0) {
                $('#hf_roi_building_type').val(gen.gen_building_type);
                var _gen_building_type_others = false;
                if (gen.gen_building_type == "16") {
                    _gen_building_type_others = true;
                    $('#tb_roi_building_type_others').val(gen.gen_building_type_others);
                }
                ppstpdr_Script.select_unselect('hf_roi_building_type', 'roi-building-type', gen.gen_building_type, 'roi-bt-option' + gen.gen_building_type, 'div_roi_building_type_others', _gen_building_type_others);

                $('#hf_roi_number_of_storeys').val(gen.gen_nostorey);
                var _gen_nostorey_others = false;
                if (gen.gen_nostorey == "7") {
                    _gen_nostorey_others = true;
                    $('#tb_roi_number_of_storeys_others').val(gen.gen_nostorey_others);
                }
                ppstpdr_Script.select_unselect('hf_roi_number_of_storeys', 'roi-nus', gen.gen_nostorey, 'roi-nus-option' + gen.gen_nostorey, 'div_roi_number_of_storeys_others', _gen_nostorey_others)

                $('#hf_roi_mb_fc').val(gen.gen_floor_struc);
                var _gen_floor_struc_others = false;
                if (gen.gen_floor_struc == "8") {
                    _gen_floor_struc_others = true;
                    $('#tb_roi_mb_fc_others').val(gen.gen_floor_struc_others);
                }
                ppstpdr_Script.select_unselect('hf_roi_mb_fc', 'roi-mb-fc', gen.gen_floor_struc, 'roi-mb-fc-option' + gen.gen_floor_struc, 'div_roi_mb_fc_others', _gen_floor_struc_others)

                $('#hf_roi_mb_wc').val(gen.gen_wall_struc);
                var _gen_wall_struc_others = false;
                if (gen.gen_wall_struc == "10") {
                    _gen_wall_struc_others = true;
                    $('#tb_roi_mb_wc_others').val(gen.gen_wall_struc_others);
                }
                ppstpdr_Script.select_unselect('hf_roi_mb_wc', 'roi-mb-wc', gen.gen_wall_struc, 'roi-mb-wc-option' + gen.gen_wall_struc, 'div_roi_mb_wc_others', _gen_wall_struc_others)

                $('#hf_roi_mb_rc').val(gen.gen_roof_struc);
                var _gen_roof_struc_others = false;
                if (gen.gen_roof_struc == "3") {
                    _gen_roof_struc_others = true;
                    $('#tb_roi_mb_rc_others').val(gen.gen_roof_struc_others);
                }
                ppstpdr_Script.select_unselect('hf_roi_mb_rc', 'roi-mb-rc', gen.gen_roof_struc, 'roi-mb-rc-option' + gen.gen_roof_struc, 'div_roi_mb_rc_others', _gen_roof_struc_others)

                $('#tb_roi_tsfec').val(gen.gen_timber_secon_fe_cons);
                $('#hf_roi_os').val(gen.gen_occupancystatus);
                var _gen_occupancystatus_others = false;
                if (gen.gen_occupancystatus == "7") {
                    _gen_occupancystatus_others = true;
                    $('#tb_roi_os_others').val(gen.gen_occupancystatus_others);
                }
                ppstpdr_Script.select_unselect('hf_roi_os', 'roi-os', gen.gen_occupancystatus, 'roi-os-option' + gen.gen_occupancystatus, 'div_roi_os_others', _gen_occupancystatus_others)

                $('#hf_roi_o').val(gen.gen_orientation);
                var _gen_orientation_others = false;
                if (gen.gen_orientation == "11") {
                    _gen_orientation_others = true;
                    $('#tb_roi_o_others').val(gen.gen_orientation_others);
                }
                ppstpdr_Script.select_unselect('hf_roi_o', 'roi-o', gen.gen_orientation, 'roi-o-option' + gen.gen_orientation, 'div_roi_o_others', _gen_orientation_others)

                $('#hf_roi_weather').val(gen.gen_weathercon);
                var _gen_weathercon_others = false;
                if (gen.gen_weathercon == "5") {
                    _gen_weathercon_others = true;
                    $('#tb_roi_weather_others').val(gen.gen_weathercon_others);
                }
                ppstpdr_Script.select_unselect('hf_roi_weather', 'roi-weather', gen.gen_weathercon, 'roi-weather-option' + gen.gen_weathercon, 'div_roi_weather_others', _gen_weathercon_others)
            }
        },
        set_weather_btn: function (el) {
            //dry
            if (el == 1) {
                ppstpdr_Script.select_unselect('hf_pem_weather', 'ccttpa-pem-weather', '2', 'ccttpa-pem-weather-option2');
            }
            else if (el == 2) {
                ppstpdr_Script.select_unselect('hf_pem_weather', 'ccttpa-pem-weather', '1', 'ccttpa-pem-weather-option1');
            }
            //wet
        },
        save_roi: function (callback) {
            var user = localdb.getUser();
            var job_id =  $('#hf_stpdr_job_id').val();
            var report_id = $('#hf_stpdr_report_id').val();
            if (job_id > 0 && report_id > 0) {

                var dto = {
                    company_id: user.company_id,
                    user_id: user.id,
                    job_id: job_id,
                    report_id: report_id,
                    gen_building_type: $('#hf_roi_building_type').val(),
                    gen_building_type_others: $('#tb_roi_building_type_others').val(),
                    gen_nostorey: $('#hf_roi_number_of_storeys').val(),
                    gen_nostorey_others: $('#tb_roi_number_of_storeys_others').val(),
                    gen_floor_struc: $('#hf_roi_mb_fc').val(),
                    gen_floor_struc_others: $('#tb_roi_mb_fc_others').val(),
                    gen_wall_struc: $('#hf_roi_mb_wc').val(),
                    gen_wall_struc_others: $('#tb_roi_mb_wc_others').val(),
                    gen_roof_struc: $('#hf_roi_mb_rc').val(),
                    gen_roof_struc_others: $('#tb_roi_mb_rc_others').val(),
                    gen_timber_secon_fe_cons: $('#tb_roi_tsfec').val(),
                    gen_occupancystatus: $('#hf_roi_os').val(),
                    gen_occupancystatus_others: $('#tb_roi_os_others').val(),
                    gen_orientation: $('#hf_roi_o').val(),
                    gen_orientation_others: $('#tb_roi_o_others').val(),
                    gen_weathercon: $('#hf_roi_weather').val(),
                    gen_weathercon_others: $('#tb_roi_weather_others').val(),
                    type_id: 3
            };

                sql_offline.get_imode_callback(
                    function (status) {
                        if (status == 1) { //offline
                        }
                        else {
                            var uri = '/reports/PostSavePPSTPDRData/' + user.token + '/'
                            unitrak_api.ajax_post(uri, dto,
                                function () {
                                    if (callback) callback();
                                }, function (err) {
                                    console.log(err);
                                    if (callback) callback();
                                });
                        }
                    }
                );
            }
        },
        get_accessibility: function (access, report_id) {
            var job_id =  $('#hf_stpdr_job_id').val();
            if (access.id > 0) {
                var _accessibility_accessible_areas = access.accessibility_accessible_areas;
                if ($.trim(access.accessibility_accessible_areas).length > 0) {
                    var _accessibility_accessible_areas_split = _accessibility_accessible_areas.split(';');
                    for (i = 0; i < _accessibility_accessible_areas_split.length - 1; i++) {
                        ppstpdr_Script.select_unselect_single_btn(_accessibility_accessible_areas_split[i]);
                    }
                }
                $('#tb_accessibility_area_ins_add_comment').val(access.accessbility_areas_addtional_comments);
                if ($.trim(access.accessibility_strata_inspection).length > 0) {
                    $('#hf_accessibility_si').val(access.accessibility_strata_inspection);
                    ppstpdr_Script.select_unselect('hf_accessibility_si', 'accessibility-si', access.accessibility_strata_inspection, 'accessibility-si-option' + access.accessibility_strata_inspection)
                }
                if ($.trim(access.accessibility_strata_inspection_limit).length > 0) {
                    $('#hf_accessibility_sil').val(access.accessibility_strata_inspection_limit);
                    ppstpdr_Script.select_unselect('hf_accessibility_sil', 'accessibility-sil', access.accessibility_strata_inspection_limit, 'accessibility-sil-option' + access.accessibility_strata_inspection_limit)
                }
                $('#tb_accessibility_strata_addtional_comments').val(access.accessbility_strata_addtional_comments);
                if ($.trim(access.accessibility_obstruction_bi_option).length > 0) {
                    $('#hf_accessibility_o_bi_option').val(access.accessibility_obstruction_bi_option);
                    ppstpdr_Script.select_unselect('hf_accessibility_o_bi_option', 'accessibility-o-bi-option', access.accessibility_obstruction_bi_option, 'accessibility-o-bi-option-option' + access.accessibility_obstruction_bi_option);
                    ppstpdr_Script.hideunhide('div_accessibility_o_bi_option', access.accessibility_obstruction_bi_option);
                }
                var _accessibility_obstruction_bi = access.accessibility_obstruction_bi;
                if ($.trim(access.accessibility_obstruction_bi).length > 0) {
                    var _accessibility_obstruction_bi_split = _accessibility_obstruction_bi.split(';');
                    for (i = 0; i < _accessibility_obstruction_bi_split.length - 1; i++) {
                        if (_accessibility_obstruction_bi_split[i] == "btn-accessibility-o-bi-option9") {
                            ppstpdr_Script.select_unselect_single_btn(_accessibility_obstruction_bi_split[i],'div_accessibility_o_bi_others',true);
                            $('#tb_accessibility_o_bi_others').val(access.accessibility_obstruction_bi_others);
                        }
                        else {
                            ppstpdr_Script.select_unselect_single_btn(_accessibility_obstruction_bi_split[i]);
                        }
                    }
                }
                $('#tb_accessibility_o_bi_comments').val(access.accessbility_obstruction_bi_comments);
                if ($.trim(access.accessibility_obstruction_be_option).length > 0) {
                    $('#hf_accessibility_o_be_option').val(access.accessibility_obstruction_be_option);
                    ppstpdr_Script.select_unselect('hf_accessibility_o_be_option', 'accessibility-o-be-option', access.accessibility_obstruction_be_option, 'accessibility-o-be-option-option' + access.accessibility_obstruction_be_option);
                    ppstpdr_Script.hideunhide('div_accessibility_o_be_option', access.accessibility_obstruction_be_option);
                }
                var _accessibility_obstruction_be = access.accessibility_obstruction_be;
                if ($.trim(access.accessibility_obstruction_be).length > 0) {
                    var _accessibility_obstruction_be_split = _accessibility_obstruction_be.split(';');
                    for (i = 0; i < _accessibility_obstruction_be_split.length - 1; i++) {
                        if (_accessibility_obstruction_be_split[i] == "btn-accessibility-o-be-option16") {
                            ppstpdr_Script.select_unselect_single_btn(_accessibility_obstruction_be_split[i], 'div_accessibility_o_be_others', true);
                            $('#tb_accessibility_o_be_others').val(access.accessibility_obstruction_be_others);
                        }
                        else {
                            ppstpdr_Script.select_unselect_single_btn(_accessibility_obstruction_be_split[i]);
                        }
                    }
                }
                $('#tb_accessibility_o_be_comments').val(access.accessbility_obstruction_be_comments);
                if ($.trim(access.accessibility_obstruction_outbuilding_option).length > 0) {
                    $('#hf_accessibility_o_o_option').val(access.accessibility_obstruction_outbuilding_option);
                    ppstpdr_Script.select_unselect('hf_accessibility_o_o_option', 'accessibility-o-o-option', access.accessibility_obstruction_outbuilding_option, 'accessibility-o-o-option-option' + access.accessibility_obstruction_outbuilding_option);
                    ppstpdr_Script.hideunhide('div_accessibility_o_o_option', access.accessibility_obstruction_outbuilding_option);
                }
                var _accessibility_obstruction_outbuilding = access.accessibility_obstruction_outbuilding;
                if ($.trim(access.accessibility_obstruction_outbuilding).length > 0) {
                    var _accessibility_obstruction_outbuilding_split = _accessibility_obstruction_outbuilding.split(';');
                    for (i = 0; i < _accessibility_obstruction_outbuilding_split.length - 1; i++) {
                        if (_accessibility_obstruction_outbuilding_split[i] == "btn-accessibility-o-o-option5") {
                            ppstpdr_Script.select_unselect_single_btn(_accessibility_obstruction_outbuilding_split[i], 'div_accessibility_o_o_others', true);
                            $('#tb_accessibility_o_o_others').val(access.accessibility_obstruction_outbuilding_others);
                        }
                        else {
                            ppstpdr_Script.select_unselect_single_btn(_accessibility_obstruction_outbuilding_split[i]);
                        }
                    }
                }
                $('#tb_accessibility_o_o_comments').val(access.accessibility_obstruction_outbuilding_comments);
                if ($.trim(access.accessibility_obstruction_subfloor_option).length > 0) {
                    $('#hf_accessibility_o_sf_option').val(access.accessibility_obstruction_subfloor_option);
                    ppstpdr_Script.select_unselect('hf_accessibility_o_sf_option', 'accessibility-o-sf-option', access.accessibility_obstruction_subfloor_option, 'accessibility-o-sf-option-option' + access.accessibility_obstruction_subfloor_option);
                    ppstpdr_Script.hideunhide('div_accessibility_o_sf_option', access.accessibility_obstruction_subfloor_option);
                }
                var _accessibility_obstruction_subfloor = access.accessibility_obstruction_subfloor;
                if ($.trim(access.accessibility_obstruction_subfloor).length > 0) {
                    var _accessibility_obstruction_subfloor_split = _accessibility_obstruction_subfloor.split(';');
                    for (i = 0; i < _accessibility_obstruction_subfloor_split.length - 1; i++) {
                        if (_accessibility_obstruction_subfloor_split[i] == "btn-accessibility-o-sf-option11") {
                            ppstpdr_Script.select_unselect_single_btn(_accessibility_obstruction_subfloor_split[i], 'div_accessibility_o_sf_others', true);
                            $('#tb_accessibility_o_sf_others').val(access.accessibility_obstruction_subfloor_others);
                        }
                        else {
                            ppstpdr_Script.select_unselect_single_btn(_accessibility_obstruction_subfloor_split[i]);
                        }
                    }
                }
                $('#tb_accessibility_o_sf_comments').val(access.accessibility_obstruction_subfloor_comments);
                if ($.trim(access.accessibility_obstruction_roofspace_option).length > 0) {
                    $('#hf_accessibility_o_rs_option').val(access.accessibility_obstruction_roofspace_option);
                    ppstpdr_Script.select_unselect('hf_accessibility_o_rs_option', 'accessibility-o-rs-option', access.accessibility_obstruction_roofspace_option, 'accessibility-o-rs-option-option' + access.accessibility_obstruction_roofspace_option);
                    ppstpdr_Script.hideunhide('div_accessibility_o_rs_option', access.accessibility_obstruction_roofspace_option);
                }
                var _accessibility_obstruction_roofspace = access.accessibility_obstruction_roofspace;
                if ($.trim(access.accessibility_obstruction_roofspace).length > 0) {
                    var _accessibility_obstruction_roofspace_split = _accessibility_obstruction_roofspace.split(';');
                    for (i = 0; i < _accessibility_obstruction_roofspace_split.length - 1; i++) {
                        if (_accessibility_obstruction_roofspace_split[i] == "btn-accessibility-o-rs-option12") {
                            ppstpdr_Script.select_unselect_single_btn(_accessibility_obstruction_roofspace_split[i], 'div_accessibility_o_rs_others', true);
                            $('#tb_accessibility_o_rs_others').val(access.accessibility_obstruction_roofspace_others);
                        }
                        else {
                            ppstpdr_Script.select_unselect_single_btn(_accessibility_obstruction_roofspace_split[i]);
                        }
                    }
                }
                $('#tb_accessibility_o_rs_comments').val(access.accessibility_obstruction_roofspace_comments);
                if ($.trim(access.accessibility_obstruction_site_option).length > 0) {
                    $('#hf_accessibility_o_s_option').val(access.accessibility_obstruction_site_option);
                    ppstpdr_Script.select_unselect('hf_accessibility_o_s_option', 'accessibility-o-s-option', access.accessibility_obstruction_site_option, 'accessibility-o-s-option-option' + access.accessibility_obstruction_site_option);
                    ppstpdr_Script.hideunhide('div_accessibility_o_s_option', access.accessibility_obstruction_site_option);
                }
                var _accessibility_obstruction_site = access.accessibility_obstruction_site;
                if ($.trim(access.accessibility_obstruction_site).length > 0) {
                    var _accessibility_obstruction_site_split = _accessibility_obstruction_site.split(';');
                    for (i = 0; i < _accessibility_obstruction_site_split.length - 1; i++) {
                        if (_accessibility_obstruction_site_split[i] == "btn-accessibility-o-s-option8") {
                            ppstpdr_Script.select_unselect_single_btn(_accessibility_obstruction_site_split[i], 'div_accessibility_o_s_others', true);
                            $('#tb_accessibility_o_s_others').val(access.accessibility_obstruction_site_others);
                        }
                        else {
                            ppstpdr_Script.select_unselect_single_btn(_accessibility_obstruction_site_split[i]);
                        }
                    }
                }
                $('#tb_accessibility_o_s_comments').val(access.accessibility_obstruction_site_comments);
                if ($.trim(access.accessibility_obstruction_roofexterior_option).length > 0) {
                    $('#hf_accessibility_o_re_option').val(access.accessibility_obstruction_roofexterior_option);
                    ppstpdr_Script.select_unselect('hf_accessibility_o_re_option', 'accessibility-o-re-option', access.accessibility_obstruction_roofexterior_option, 'accessibility-o-re-option-option' + access.accessibility_obstruction_roofexterior_option);
                    ppstpdr_Script.hideunhide('div_accessibility_o_re_option', access.accessibility_obstruction_roofexterior_option);
                }
                var _accessibility_obstruction_roofexterior = access.accessibility_obstruction_roofexterior;
                if ($.trim(access.accessibility_obstruction_roofexterior).length > 0) {
                    var _accessibility_obstruction_roofexterior_split = _accessibility_obstruction_roofexterior.split(';');
                    for (i = 0; i < _accessibility_obstruction_roofexterior_split.length - 1; i++) {
                        if (_accessibility_obstruction_roofexterior_split[i] == "btn-accessibility-o-re-option7") {
                            ppstpdr_Script.select_unselect_single_btn(_accessibility_obstruction_roofexterior_split[i], 'div_accessibility_o_re_others', true);
                            $('#tb_accessibility_o_re_others').val(access.accessibility_obstruction_roofexterior_others);
                        }
                        else {
                            ppstpdr_Script.select_unselect_single_btn(_accessibility_obstruction_roofexterior_split[i]);
                        }
                    }
                }
                $('#tb_accessibility_o_re_comments').val(access.accessibility_obstruction_roofexterior_comments);
                $('#tb_accessibility_o_add_comments').val(access.accessibility_obstruction_additional_comments);
                $('#tb_inaccessible_areas').val(access.accessibility_inaccessible_areas);
                if ($.trim(access.accessibility_undetected_tpp_assessment).length > 0) {
                    $('#hf_accessibility_undetected_tpp_assessment').val(access.accessibility_undetected_tpp_assessment);
                    ppstpdr_Script.select_unselect('hf_accessibility_undetected_tpp_assessment_option', 'accessibility-undetected-tpp-assessment-option', access.accessibility_undetected_tpp_assessment, 'accessibility-undetected-tpp-assessment-option-option' + access.accessibility_undetected_tpp_assessment)
                }
                $('#tb_accessibility_undetected_tpp_assessment_comments').val(access.accessibility_undetected_tpp_assessment_comments);

                ppstpdr_Script.get_img_list(job_id, report_id, '2.2.2.1', function (data) {
                    ppstpdr_Script.reload_img_list(data, '2.2.2.1', report_id);
                });
                ppstpdr_Script.get_img_list(job_id, report_id, '2.2.2.2', function (data) {
                    ppstpdr_Script.reload_img_list(data, '2.2.2.2', report_id);
                });
                ppstpdr_Script.get_img_list(job_id, report_id, '2.2.2.3', function (data) {
                    ppstpdr_Script.reload_img_list(data, '2.2.2.3', report_id);
                });
                ppstpdr_Script.get_img_list(job_id, report_id, '2.2.2.4', function (data) {
                    ppstpdr_Script.reload_img_list(data, '2.2.2.4', report_id);
                });
                ppstpdr_Script.get_img_list(job_id, report_id, '2.2.2.5', function (data) {
                    ppstpdr_Script.reload_img_list(data, '2.2.2.5', report_id);
                });
                ppstpdr_Script.get_img_list(job_id, report_id, '2.2.2.6', function (data) {
                    ppstpdr_Script.reload_img_list(data, '2.2.2.6', report_id);
                });
                ppstpdr_Script.get_img_list(job_id, report_id, '2.2.2.7', function (data) {
                    ppstpdr_Script.reload_img_list(data, '2.2.2.7', report_id);
                });
                ppstpdr_Script.get_img_list(job_id, report_id, '2.2.3', function (data) {
                    ppstpdr_Script.reload_img_list(data, '2.2.3', report_id);
                });
            }
        },
        save_accessibility: function (callback) {
            var user = localdb.getUser();
            var job_id =  $('#hf_stpdr_job_id').val();
            var report_id = $('#hf_stpdr_report_id').val();
            if (job_id > 0 && report_id > 0) {
                var _accessibility_accessible_areas = "";               
                $('.roi-accessibility-area-ins').each(function () {
                    var _hasclass = $('#' + this.id).hasClass('btn-red-click');
                    if (_hasclass == true) {
                        _accessibility_accessible_areas += this.id + ';';
                    }
                });

                var _accessbility_areas_addtional_comments = $('#tb_accessibility_area_ins_add_comment').val();
                var _accessibility_strata_inspection = $('#hf_accessibility_si').val();
                var _accessibility_strata_inspection_limit = $('#hf_accessibility_sil').val();
                var _accessbility_strata_addtional_comments = $('#tb_accessibility_strata_addtional_comments').val();
                var _accessibility_obstruction_bi_option = $('#hf_accessibility_o_bi_option').val();
                var _accessibility_obstruction_bi = "";
                $('.accessibility-o-bi').each(function () {
                    var _hasclass = $('#' + this.id).hasClass('btn-red-click');
                    if (_hasclass == true) {
                        _accessibility_obstruction_bi += this.id + ';';
                    }
                });
                var _accessbility_obstruction_bi_comments = $('#tb_accessibility_o_bi_comments').val();
                var _accessibility_obstruction_be_option = $('#hf_accessibility_o_be_option').val();
                var _accessibility_obstruction_be = "";
                $('.accessibility-o-be').each(function () {
                    var _hasclass = $('#' + this.id).hasClass('btn-red-click');
                    if (_hasclass == true) {
                        _accessibility_obstruction_be += this.id + ';';
                    }
                });
                var _accessbility_obstruction_be_comments = $('#tb_accessibility_o_be_comments').val();
                var _accessibility_obstruction_outbuilding_option = $('#hf_accessibility_o_o_option').val();
                var _accessibility_obstruction_outbuilding = "";
                $('.accessibility-o-o').each(function () {
                    var _hasclass = $('#' + this.id).hasClass('btn-red-click');
                    if (_hasclass == true) {
                        _accessibility_obstruction_outbuilding += this.id + ';';
                    }
                });
                var _accessibility_obstruction_outbuilding_comments = $('#tb_accessibility_o_o_comments').val();
                var _accessibility_obstruction_subfloor_option = $('#hf_accessibility_o_sf_option').val();
                var _accessibility_obstruction_subfloor = "";
                $('.accessibility-o-sf').each(function () {
                    var _hasclass = $('#' + this.id).hasClass('btn-red-click');
                    if (_hasclass == true) {
                        _accessibility_obstruction_subfloor += this.id + ';';
                    }
                });
                var _accessibility_obstruction_subfloor_comments = $('#tb_accessibility_o_sf_comments').val();
                var _accessibility_obstruction_roofspace_option = $('#hf_accessibility_o_rs_option').val();
                var _accessibility_obstruction_roofspace = "";
                $('.accessibility-o-rs').each(function () {
                    var _hasclass = $('#' + this.id).hasClass('btn-red-click');
                    if (_hasclass == true) {
                        _accessibility_obstruction_roofspace += this.id + ';';
                    }
                });
                var _accessibility_obstruction_roofspace_comments = $('#tb_accessibility_o_rs_comments').val();
                var _accessibility_obstruction_site_option = $('#hf_accessibility_o_s_option').val();
                var _accessibility_obstruction_site = "";
                $('.accessibility-o-s').each(function () {
                    var _hasclass = $('#' + this.id).hasClass('btn-red-click');
                    if (_hasclass == true) {
                        _accessibility_obstruction_site += this.id + ';';
                    }
                });
                var _accessibility_obstruction_site_comments = $('#tb_accessibility_o_s_comments').val();
                var _accessibility_obstruction_roofexterior_option = $('#hf_accessibility_o_re_option').val();
                var _accessibility_obstruction_roofexterior = "";
                $('.accessibility-o-re').each(function () {
                    var _hasclass = $('#' + this.id).hasClass('btn-red-click');
                    if (_hasclass == true) {
                        _accessibility_obstruction_roofexterior += this.id + ';';
                    }
                });
                var _accessibility_obstruction_roofexterior_comments = $('#tb_accessibility_o_re_comments').val();
                var _accessibility_obstruction_additional_comments = $('#tb_accessibility_o_add_comments').val();
                var _accessibility_inaccessible_areas = $('#tb_inaccessible_areas').val();
                var _accessibility_undetected_tpp_assessment = $('#hf_accessibility_undetected_tpp_assessment').val();
                var _accessibility_undetected_tpp_assessment_comments = $('#tb_accessibility_undetected_tpp_assessment_comments').val();

                var dto = {
                    company_id: user.company_id,
                    user_id: user.id,
                    job_id: job_id,
                    customer_id: $('#hf_cusid').val(),
                    report_id: report_id,
                    accessibility_accessible_areas: _accessibility_accessible_areas,
                    accessbility_areas_addtional_comments: _accessbility_areas_addtional_comments,
                    accessibility_strata_inspection: _accessibility_strata_inspection,
                    accessibility_strata_inspection_limit: _accessibility_strata_inspection_limit,
                    accessbility_strata_addtional_comments: _accessbility_strata_addtional_comments,
                    accessibility_obstruction_bi_option: _accessibility_obstruction_bi_option,
                    accessibility_obstruction_bi: _accessibility_obstruction_bi,
                    accessibility_obstruction_bi_others: $('#tb_accessibility_o_bi_others').val(),
                    accessbility_obstruction_bi_comments: _accessbility_obstruction_bi_comments,
                    accessibility_obstruction_be_option: _accessibility_obstruction_be_option,
                    accessibility_obstruction_be: _accessibility_obstruction_be,
                    accessibility_obstruction_be_others: $('#tb_accessibility_o_be_others').val(),
                    accessbility_obstruction_be_comments: _accessbility_obstruction_be_comments,
                    accessibility_obstruction_outbuilding_option: _accessibility_obstruction_outbuilding_option,
                    accessibility_obstruction_outbuilding: _accessibility_obstruction_outbuilding,
                    accessibility_obstruction_outbuilding_others: $('#tb_accessibility_o_o_others').val(),
                    accessibility_obstruction_outbuilding_comments: _accessibility_obstruction_outbuilding_comments,
                    accessibility_obstruction_subfloor_option: _accessibility_obstruction_subfloor_option,
                    accessibility_obstruction_subfloor: _accessibility_obstruction_subfloor,
                    accessibility_obstruction_subfloor_others: $('#tb_accessibility_o_sf_others').val(),
                    accessibility_obstruction_subfloor_comments: _accessibility_obstruction_subfloor_comments,
                    accessibility_obstruction_roofspace_option: _accessibility_obstruction_roofspace_option,
                    accessibility_obstruction_roofspace: _accessibility_obstruction_roofspace,
                    accessibility_obstruction_roofspace_others: $('#tb_accessibility_o_rs_others').val(),
                    accessibility_obstruction_roofspace_comments: _accessibility_obstruction_roofspace_comments,
                    accessibility_obstruction_site_option: _accessibility_obstruction_site_option,
                    accessibility_obstruction_site: _accessibility_obstruction_site,
                    accessibility_obstruction_site_others: $('#tb_accessibility_o_s_others').val(),
                    accessibility_obstruction_site_comments: _accessibility_obstruction_site_comments,
                    accessibility_obstruction_roofexterior_option: _accessibility_obstruction_roofexterior_option,
                    accessibility_obstruction_roofexterior: _accessibility_obstruction_roofexterior,
                    accessibility_obstruction_roofexterior_others: $('#tb_accessibility_o_re_others').val(),
                    accessibility_obstruction_roofexterior_comments: _accessibility_obstruction_roofexterior_comments,
                    accessibility_obstruction_additional_comments: _accessibility_obstruction_additional_comments,
                    accessibility_inaccessible_areas: _accessibility_inaccessible_areas,
                    accessibility_undetected_tpp_assessment: _accessibility_undetected_tpp_assessment,
                    accessibility_undetected_tpp_assessment_comments: _accessibility_undetected_tpp_assessment_comments,
                    type_id: 4
                };

                sql_offline.get_imode_callback(
                    function (status) {
                        if (status == 1) { //offline
                        }
                        else {
                            var uri = '/reports/PostSavePPSTPDRData/' + user.token + '/'
                            unitrak_api.ajax_post(uri, dto,
                                function () {
                                    
                                    ppstpdr_Script.save_and_post_report('img_accessibility_io_html','img_accessibility_io', '2.2.2.1', report_id);
                                    ppstpdr_Script.save_and_post_report('img_accessibility_eo_html','img_accessibility_eo', '2.2.2.2', report_id);
                                    ppstpdr_Script.save_and_post_report('img_accessibility_o_html','img_accessibility_o', '2.2.2.3', report_id);
                                    ppstpdr_Script.save_and_post_report('img_accessibility_sf_html','img_accessibility_sf', '2.2.2.4', report_id);
                                    ppstpdr_Script.save_and_post_report('img_accessibility_rs_html','img_accessibility_rs', '2.2.2.5', report_id);
                                    ppstpdr_Script.save_and_post_report('img_accessibility_s_html','img_accessibility_s', '2.2.2.6', report_id);
                                    ppstpdr_Script.save_and_post_report('img_accessibility_re_html','img_accessibility_re', '2.2.2.7', report_id);
                                    ppstpdr_Script.save_and_post_report('img_accessibility_inaccessible_areas_html','img_accessibility_inaccessible_areas', '2.2.3', report_id);
                                        
                                    if (callback) callback();
                                }, function (err) {
                                    console.log("============================ error");
                                    console.log(err);
                                    if (callback) callback();
                                });
                        }
                    }
                );
            }
        },
        get_termites: function (termites, report_id) {
            var job_id =  $('#hf_stpdr_job_id').val();
            if (termites.id > 0) {
                if ($.trim(termites.termite_termite_found).length > 0) {
                    $('#hf_termite_found').val(termites.termite_termite_found);
                    ppstpdr_Script.select_unselect('hf_termite_found', 'termite-f', termites.termite_termite_found, 'termite-f-option' + termites.termite_termite_found);
                    if (termites.termite_termite_found == "1") { ppstpdr_Script.hideunhide('termite_found_container', 1); }
                    else { ppstpdr_Script.hideunhide('termite_found_container', 2); }
                }
                if ($.trim(termites.termite_nest_termite_found).length > 0) {
                    $('#hf_termite_nest_found').val(termites.termite_nest_termite_found);
                    ppstpdr_Script.select_unselect('hf_termite_nest_found', 'termite-nest-f', termites.termite_nest_termite_found, 'termite-nest-f-option' + termites.termite_nest_termite_found);
                }
                if ($.trim(termites.termite_specimen_collected).length > 0) {
                    $('#hf_termite_specimen_collected').val(termites.termite_specimen_collected);
                    ppstpdr_Script.select_unselect('hf_termite_specimen_collected', 'termite-tsc', termites.termite_specimen_collected, 'termite-tsc-option' + termites.termite_specimen_collected)
                }
                var _termite_specimen_species = termites.termite_specimen_species;
                if ($.trim(termites.termite_specimen_species).length > 0) {
                    var _termite_specimen_species_split = _termite_specimen_species.split(';');
                    for (i = 0; i < _termite_specimen_species_split.length - 1; i++) {
                        ppstpdr_Script.select_unselect_single_btn(_termite_specimen_species_split[i]);
                    }
                }
                $('#tb_termite_specimen_species_details').val(termites.termite_specimen_species_details);
                if ($.trim(termites.termite_stmp_recommended).length > 0) {
                    $('#hf_termite_stmp_recommended').val(termites.termite_stmp_recommended);
                    ppstpdr_Script.select_unselect('hf_termite_stmp_recommended', 'termite-stmp-recommended', termites.termite_stmp_recommended, 'termite-stmp-recommended-option' + termites.termite_stmp_recommended);
                    if (termites.termite_stmp_recommended == "1") { ppstpdr_Script.hideunhide('termite_stmp_recommended_container', 1); }
                    else { ppstpdr_Script.hideunhide('termite_stmp_recommended_container', 2); }
                }
                if ($.trim(termites.termite_stmp_proposal).length > 0) {
                    $('#hf_termite_stmp_proposal').val(termites.termite_stmp_proposal);
                    ppstpdr_Script.select_unselect('hf_termite_stmp_proposal', 'termite-stmp-proposal', termites.termite_stmp_proposal, 'termite-stmp-proposal-option' + termites.termite_stmp_proposal);
                }
                $('#tb_termite_stmp_comments').val(termites.termite_stmp_comments);
                if ($.trim(termites.termite_twd_found).length > 0) {
                    $('#hf_termite_twd_found').val(termites.termite_twd_found);
                    ppstpdr_Script.select_unselect('hf_termite_twd_found', 'termite-twd-found', termites.termite_twd_found, 'termite-twd-found-option' + termites.termite_twd_found);
                    if (termites.termite_twd_found == "1") { ppstpdr_Script.hideunhide('termite_twd_found_container', 1); }
                    else { ppstpdr_Script.hideunhide('termite_twd_found_container', 2); }
                }
                if ($.trim(termites.termite_twd_damage).length > 0) {
                    $('#hf_termite_twd_damage').val(termites.termite_twd_damage);
                    ppstpdr_Script.select_unselect('hf_termite_twd_damage', 'termite-twd-damage', termites.termite_twd_damage, 'termite-twd-damage-option' + termites.termite_twd_damage);
                }
                $('#tb_termite_twd_details').val(termites.termite_twd_details);
                if ($.trim(termites.termite_ptmp_evidence).length > 0) {
                    $('#hf_termite_ptmp_evidence').val(termites.termite_ptmp_evidence);
                    ppstpdr_Script.select_unselect('hf_termite_ptmp_evidence', 'termite-ptmp-evidence', termites.termite_ptmp_evidence, 'termite-ptmp-evidence-option' + termites.termite_ptmp_evidence);
                    if (termites.termite_ptmp_evidence == "1") { ppstpdr_Script.hideunhide('termite_ptmp_evidence_container', 1); }
                    else { ppstpdr_Script.hideunhide('termite_ptmp_evidence_container', 2); }
                }
                $('#tb_termite_ptmp_details').val(termites.termite_ptmp_details);
                if ($.trim(termites.termite_ptmp_ffinspection).length > 0) {
                    $('#hf_termite_ptmp_ffinspection').val(termites.termite_ptmp_ffinspection);
                    ppstpdr_Script.select_unselect('hf_termite_ptmp_ffinspection', 'termite-ptmp-inspection', termites.termite_ptmp_ffinspection, 'termite-ptmp-inspection-option' + termites.termite_ptmp_ffinspection);
                }

                ppstpdr_Script.get_img_list(job_id, report_id, '3.1.0', function (data) {
                    ppstpdr_Script.reload_img_list(data, '3.1.0', report_id);
                });
                ppstpdr_Script.get_img_list(job_id, report_id, '3.1.1', function (data) {
                    ppstpdr_Script.reload_img_list(data, '3.1.1', report_id);
                });
                ppstpdr_Script.get_img_list(job_id, report_id, '3.3.0', function (data) {
                    ppstpdr_Script.reload_img_list(data, '3.3.0', report_id);
                });
                ppstpdr_Script.get_img_list(job_id, report_id, '3.4.0', function (data) {
                    ppstpdr_Script.reload_img_list(data, '3.4.0', report_id);
                });
            }
        },
        save_termites: function (callback) {
            var user = localdb.getUser();
            var job_id =  $('#hf_stpdr_job_id').val();
            var report_id = $('#hf_stpdr_report_id').val();
            if (job_id > 0 && report_id > 0) {

                var _termite_termite_found = $('#hf_termite_found').val();
                var _termite_nest_termite_found = $('#hf_termite_nest_found').val();
                var _termite_specimen_collected = $('#hf_termite_specimen_collected').val();
                var _termite_specimen_species = "";
                $('.termite-ss').each(function () {
                    var _hasclass = $('#' + this.id).hasClass('btn-red-click');
                    if (_hasclass == true) {
                        _termite_specimen_species += this.id + ';';
                    }
                });
                var _termite_specimen_species_details = $('#tb_termite_specimen_species_details').val();
                var _termite_stmp_recommended = $('#hf_termite_stmp_recommended').val();
                var _termite_stmp_proposal = $('#hf_termite_stmp_proposal').val();
                var _termite_stmp_comments = $('#tb_termite_stmp_comments').val();
                var _termite_twd_found = $('#hf_termite_twd_found').val();
                var _termite_twd_damage = $('#hf_termite_twd_damage').val();
                var _termite_twd_details = $('#tb_termite_twd_details').val();
                var _termite_ptmp_evidence = $('#hf_termite_ptmp_evidence').val();
                var _termite_ptmp_details = $('#tb_termite_ptmp_details').val();
                var _termite_ptmp_ffinspection = $('#hf_termite_ptmp_ffinspection').val();

                var dto = {
                    company_id: user.company_id,
                    user_id: user.id,
                    job_id: job_id,
                    customer_id: $('#hf_cusid').val(),
                    report_id: report_id,
                    termite_termite_found: _termite_termite_found,
                    termite_nest_termite_found: _termite_nest_termite_found,
                    termite_specimen_collected: _termite_specimen_collected,
                    termite_specimen_species: _termite_specimen_species,
                    termite_specimen_species_details: _termite_specimen_species_details,
                    termite_stmp_recommended: _termite_stmp_recommended,
                    termite_stmp_proposal: _termite_stmp_proposal,
                    termite_stmp_comments: _termite_stmp_comments,
                    termite_twd_found: _termite_twd_found,
                    termite_twd_damage: _termite_twd_damage,
                    termite_twd_details: _termite_twd_details,
                    termite_ptmp_evidence: _termite_ptmp_evidence,
                    termite_ptmp_details: _termite_ptmp_details,
                    termite_ptmp_ffinspection: _termite_ptmp_ffinspection,
                    type_id: 5
                };

                sql_offline.get_imode_callback(
                    function (status) {
                        if (status == 1) { //offline
                        }
                        else {
                            var uri = '/reports/PostSavePPSTPDRData/' + user.token + '/'
                            unitrak_api.ajax_post(uri, dto,
                                function (data) {
                                    ppstpdr_Script.save_and_post_report('img_termite_nest_found_html','img_termite_nest_found', '3.1.0', report_id);
                                    ppstpdr_Script.save_and_post_report('img_termite_ss_html','img_termite_ss', '3.1.1', report_id);
                                    ppstpdr_Script.save_and_post_report('img_termite_twd_html','img_termite_twd', '3.3.0', report_id);
                                    ppstpdr_Script.save_and_post_report('img_termite_ptmp_html','img_termite_ptmp', '3.4.0', report_id);
                                    if (callback) callback();
                                }, function (err) {
                                    console.log(err);
                                    if (callback) callback();
                                });
                        }
                    }
                );
            }
        },
        get_chemdel: function (chemdel, report_id) {
            var job_id =  $('#hf_stpdr_job_id').val();
            if (chemdel.id > 0) {
                if ($.trim(chemdel.chemdel_found).length > 0) {
                    $('#hf_chemdel_found').val(chemdel.chemdel_found);
                    ppstpdr_Script.select_unselect('hf_chemdel_found', 'chemdel-found', chemdel.chemdel_found, 'chemdel-found-option' + chemdel.chemdel_found)
                    if (chemdel.chemdel_found == "1") { ppstpdr_Script.hideunhide('chemdel_found_container', 1); }
                    else { ppstpdr_Script.hideunhide('chemdel_found_container', 2); }
                }
                if ($.trim(chemdel.chemdel_damage).length > 0) {
                    $('#hf_chemdel_damage').val(chemdel.chemdel_damage);
                    ppstpdr_Script.select_unselect('hf_chemdel_damage', 'chemdel-damage', chemdel.chemdel_damage, 'chemdel-damage-option' + chemdel.chemdel_damage)
                }
                $('#tb_chemdel_details').val(chemdel.chemdel_details);

                ppstpdr_Script.get_img_list(job_id, report_id, '4.0.0', function (data) {
                    ppstpdr_Script.reload_img_list(data, '4.0.0', report_id);
                });
            }
        },
        save_chemdel: function (callback) {
            var user = localdb.getUser();
            var job_id =  $('#hf_stpdr_job_id').val();
            var report_id = $('#hf_stpdr_report_id').val();
            if (job_id > 0 && report_id > 0) {

                var _chemdel_found = $('#hf_chemdel_found').val();
                var _chemdel_damage = $('#hf_chemdel_damage').val();
                var _chemdel_details = $('#tb_chemdel_details').val();

                var dto = {
                    company_id: user.company_id,
                    user_id: user.id,
                    job_id: job_id,
                    customer_id: $('#hf_cusid').val(),
                    report_id: report_id,
                    chemdel_found: _chemdel_found,
                    chemdel_damage: _chemdel_damage,
                    chemdel_details: _chemdel_details,
                    type_id: 6
                };

                sql_offline.get_imode_callback(
                    function (status) {
                        if (status == 1) { //offline
                        }
                        else {
                            var uri = '/reports/PostSavePPSTPDRData/' + user.token + '/'
                            unitrak_api.ajax_post(uri, dto,
                                function (data) {
                                    ppstpdr_Script.save_and_post_report('img_chemdel_html','img_chemdel', '4.0.0', report_id);
                                    if (callback) callback();
                                }, function (err) {
                                    console.log(err);
                                    if (callback) callback();
                                });
                        }
                    }
                );
            }
        },
        get_fd: function (fd, report_id) {
            var job_id =  $('#hf_stpdr_job_id').val();
            if (fd.id > 0) {
                if ($.trim(fd.fungal_decay_found).length > 0) {
                    $('#hf_fungal_decay_found').val(fd.fungal_decay_found);
                    ppstpdr_Script.select_unselect('hf_fungal_decay_found', 'fungal-decay-found', fd.fungal_decay_found, 'fungal-decay-found-option' + fd.fungal_decay_found);
                    if (fd.fungal_decay_found == "1") { ppstpdr_Script.hideunhide('fungal_decay_found_container', 1); }
                    else { ppstpdr_Script.hideunhide('fungal_decay_found_container', 2); }
                }
                if ($.trim(fd.fungal_decay_timber_condition).length > 0) {
                    $('#hf_fungal_decay_timber_condition').val(fd.fungal_decay_timber_condition);
                    ppstpdr_Script.select_unselect('hf_fungal_decay_timber_condition', 'fungal-decay-tc', fd.fungal_decay_timber_condition, 'fungal-decay-tc-option' + fd.fungal_decay_timber_condition);
                }
                if ($.trim(fd.fungal_decay_damage).length > 0) {
                    $('#hf_fungal_decay_damage').val(fd.fungal_decay_damage);
                    ppstpdr_Script.select_unselect('hf_fungal_decay_damage', 'fungal-decay-damage', fd.fungal_decay_damage, 'fungal-decay-damage-option' + fd.fungal_decay_damage);
                }
                $('#tb_fungal_decay_details').val(fd.fungal_decay_details);

                ppstpdr_Script.get_img_list(job_id, report_id, '5.0.0', function (data) {
                    ppstpdr_Script.reload_img_list(data, '5.0.0', report_id);
                });
            }
        },
        save_fd: function (callback) {
            var user = localdb.getUser();
            var job_id =  $('#hf_stpdr_job_id').val();
            var report_id = $('#hf_stpdr_report_id').val();
            if (job_id > 0 && report_id > 0) {

                var _fungal_decay_found = $('#hf_fungal_decay_found').val();
                var _fungal_decay_timber_condition = $('#hf_fungal_decay_timber_condition').val();
                var _fungal_decay_damage = $('#hf_fungal_decay_damage').val();
                var _fungal_decay_details = $('#tb_fungal_decay_details').val();

                var dto = {
                    company_id: user.company_id,
                    user_id: user.id,
                    job_id: job_id,
                    customer_id: $('#hf_cusid').val(),
                    report_id: report_id,
                    fungal_decay_found: _fungal_decay_found,
                    fungal_decay_timber_condition: _fungal_decay_timber_condition,
                    fungal_decay_damage: _fungal_decay_damage,
                    fungal_decay_details: _fungal_decay_details,
                    type_id: 7
                };

                sql_offline.get_imode_callback(
                    function (status) {
                        if (status == 1) { //offline
                        }
                        else {
                            var uri = '/reports/PostSavePPSTPDRData/' + user.token + '/'
                            unitrak_api.ajax_post(uri, dto,
                                function (data) {
                                    ppstpdr_Script.save_and_post_report('img_fungal_decay_html','img_fungal_decay', '5.0.0', report_id);
                                    if (callback) callback();
                                }, function (err) {
                                    console.log(err);
                                    if (callback) callback();
                                });
                        }
                    }
                );
            }
        },
        get_wb: function (wb, report_id) {
            var job_id =  $('#hf_stpdr_job_id').val();
            if (wb.id > 0) {
                if ($.trim(wb.wood_borers_found).length > 0) {
                    $('#hf_wood_borers_found').val(wb.wood_borers_found);
                    ppstpdr_Script.select_unselect('hf_wood_borers_found', 'wood-borers-found', wb.wood_borers_found, 'wood-borers-found-option' + wb.wood_borers_found)
                    if (wb.wood_borers_found == "1") { ppstpdr_Script.hideunhide('wood_borers_found_container', 1); }
                    else { ppstpdr_Script.hideunhide('wood_borers_found_container', 2); }
                }
                if ($.trim(wb.wood_borers).length > 0) {
                    $('#hf_wood_borers').val(wb.wood_borers);
                    ppstpdr_Script.select_unselect('hf_wood_borers', 'wood-borers', wb.wood_borers, 'wood-borers-option' + wb.wood_borers)
                }
                if ($.trim(wb.wood_borers_damage).length > 0) {
                    $('#hf_wood_borers_damage').val(wb.wood_borers_damage);
                    ppstpdr_Script.select_unselect('hf_wood_borers_damage', 'wood-borers-damage', wb.wood_borers_damage, 'wood-borers-damage-option' + wb.wood_borers_damage)
                }
                $('#tb_wood_borers_details').val(wb.wood_borers_details);

                ppstpdr_Script.get_img_list(job_id, report_id, '6.0.0', function (data) {
                    ppstpdr_Script.reload_img_list(data, '6.0.0', report_id);
                });
            }
        },
        save_wb: function (callback) {
            var user = localdb.getUser();
            var job_id =  $('#hf_stpdr_job_id').val();
            var report_id = $('#hf_stpdr_report_id').val();
            if (job_id > 0 && report_id > 0) {

                var _wood_borers_found = $('#hf_wood_borers_found').val();
                var _wood_borers = $('#hf_wood_borers').val();
                var _wood_borers_damage = $('#hf_wood_borers_damage').val();
                var _wood_borers_details = $('#tb_wood_borers_details').val();

                var dto = {
                    company_id: user.company_id,
                    user_id: user.id,
                    job_id: job_id,
                    customer_id: $('#hf_cusid').val(),
                    report_id: report_id,
                    wood_borers_found: _wood_borers_found,
                    wood_borers: _wood_borers,
                    wood_borers_damage: _wood_borers_damage,
                    wood_borers_details: _wood_borers_details,
                    type_id: 8
                };

                sql_offline.get_imode_callback(
                    function (status) {
                        if (status == 1) { //offline
                        }
                        else {
                            var uri = '/reports/PostSavePPSTPDRData/' + user.token + '/'
                            unitrak_api.ajax_post(uri, dto,
                                function (data) {
                                    ppstpdr_Script.save_and_post_report('img_wood_borers_html','img_wood_borers', '6.0.0', report_id);
                                    if (callback) callback();
                                }, function (err) {
                                    console.log(err);
                                    if (callback) callback();
                                });
                        }
                    }
                );
            }
        },
        get_ccttpa: function (ccttpa, report_id) {
            var job_id =  $('#hf_stpdr_job_id').val();
            if (ccttpa.id > 0) {
                if ($.trim(ccttpa.lasv).length > 0) {
                    $('#hf_lasv').val(ccttpa.lasv);
                    ppstpdr_Script.select_unselect('hf_lasv', 'ccttpa-lasv', ccttpa.lasv, 'ccttpa-lasv-option' + ccttpa.lasv);
                    if (ccttpa.lasv == "1" || ccttpa.lasv == "2") { ppstpdr_Script.hideunhide('lasv_container', 1); }
                    else { ppstpdr_Script.hideunhide('lasv_container', 2); }
                }
                $('#tb_lasv_details').val(ccttpa.lasv_details);
                if ($.trim(ccttpa.pem_weather).length > 0) {
                    $('#hf_pem_weather').val(ccttpa.pem_weather);
                    ppstpdr_Script.select_unselect('hf_pem_weather', 'ccttpa-pem-weather', ccttpa.pem_weather, 'ccttpa-pem-weather-option' + ccttpa.pem_weather);
                }
                if ($.trim(ccttpa.pem_evidence).length > 0) {
                    $('#hf_pem_evidence').val(ccttpa.pem_evidence);
                    ppstpdr_Script.select_unselect('hf_pem_evidence', 'ccttpa-pem-evidence', ccttpa.pem_evidence, 'ccttpa-pem-evidence-option' + ccttpa.pem_evidence);
                }
                if ($.trim(ccttpa.pem_moisture).length > 0) {
                    $('#hf_pem_moisture').val(ccttpa.pem_moisture);
                    ppstpdr_Script.select_unselect('hf_pem_moisture', 'ccttpa-pem-moisture', ccttpa.pem_moisture, 'ccttpa-pem-moisture-option' + ccttpa.pem_moisture);
                }
                if ($.trim(ccttpa.pem_mould).length > 0) {
                    $('#hf_pem_mould').val(ccttpa.pem_mould);
                    ppstpdr_Script.select_unselect('hf_pem_mould', 'ccttpa-pem-mould', ccttpa.pem_mould, 'ccttpa-pem-mould-option' + ccttpa.pem_mould);
                }
                $('#tb_pem_details').val(ccttpa.pem_details);
                if ($.trim(ccttpa.bridging_obstruction).length > 0) {
                    $('#hf_bridging_obstruction').val(ccttpa.bridging_obstruction);
                    ppstpdr_Script.select_unselect('hf_bridging_obstruction', 'ccttpa-bridging-obstruction', ccttpa.bridging_obstruction, 'ccttpa-bridging-obstruction-option' + ccttpa.bridging_obstruction);
                    if (ccttpa.bridging_obstruction == "1" || ccttpa.bridging_obstruction == "2") { ppstpdr_Script.hideunhide('bridging_obstruction_container', 1); }
                    else { ppstpdr_Script.hideunhide('bridging_obstruction_container', 2); }
                }
                if ($.trim(ccttpa.bridging_evidence).length > 0) {
                    $('#hf_bridging_evidence').val(ccttpa.bridging_evidence);
                    ppstpdr_Script.select_unselect('hf_bridging_evidence', 'ccttpa-bridging-evidence', ccttpa.bridging_evidence, 'ccttpa-bridging-evidence-option' + ccttpa.bridging_evidence);
                    if (ccttpa.bridging_evidence == "1" || ccttpa.bridging_evidence == "2") { ppstpdr_Script.hideunhide('bridging_obstruction_container', 1); }
                    else { ppstpdr_Script.hideunhide('bridging_obstruction_container', 2); }
                }
                var _bridging_visible_evidence = ccttpa.bridging_visible_evidence;
                if ($.trim(ccttpa.bridging_visible_evidence).length > 0) {
                    var _bridging_visible_evidence_split = _bridging_visible_evidence.split(';');
                    for (i = 0; i < _bridging_visible_evidence_split.length - 1; i++) {
                        ppstpdr_Script.select_unselect_single_btn(_bridging_visible_evidence_split[i]);
                    }
                }
                $('#tb_bridging_details').val(ccttpa.bridging_details);
                if ($.trim(ccttpa.untreated_evidence).length > 0) {
                    $('#hf_untreated_evidence').val(ccttpa.untreated_evidence);
                    ppstpdr_Script.select_unselect('hf_untreated_evidence', 'ccttpa-untreated-evidence', ccttpa.untreated_evidence, 'ccttpa-untreated-evidence-option' + ccttpa.untreated_evidence);
                    if (ccttpa.untreated_evidence == "2" || ccttpa.untreated_evidence == "3") { ppstpdr_Script.hideunhide('untreated_evidence_container', 1); }
                    else { ppstpdr_Script.hideunhide('untreated_evidence_container', 2); }
                }
                $('#tb_untreated_details').val(ccttpa.untreated_details);
                if ($.trim(ccttpa.othercondition_evidence).length > 0) {
                    $('#hf_othercondition_evidence').val(ccttpa.othercondition_evidence);
                    ppstpdr_Script.select_unselect('hf_othercondition_evidence', 'ccttpa-othercondition-evidence', ccttpa.othercondition_evidence, 'ccttpa-othercondition-evidence-option' + ccttpa.othercondition_evidence);
                    if (ccttpa.othercondition_evidence == "2" || ccttpa.othercondition_evidence == "3") { ppstpdr_Script.hideunhide('othercondition_evidence_container', 1); }
                    else { ppstpdr_Script.hideunhide('othercondition_evidence_container', 2); }
                }
                $('#tb_othercondition_details').val(ccttpa.othercondition_details);

                ppstpdr_Script.get_img_list(job_id, report_id, '7.2.0', function (data) {
                    ppstpdr_Script.reload_img_list(data, '7.2.0', report_id);
                });
                ppstpdr_Script.get_img_list(job_id, report_id, '7.3.0', function (data) {
                    ppstpdr_Script.reload_img_list(data, '7.3.0', report_id);
                });
                ppstpdr_Script.get_img_list(job_id, report_id, '7.5.0', function (data) {
                    ppstpdr_Script.reload_img_list(data, '7.5.0', report_id);
                });

            }
        },
        save_ccttpa: function (callback) {
            var user = localdb.getUser();
            var job_id =  $('#hf_stpdr_job_id').val();
            var report_id = $('#hf_stpdr_report_id').val();
            if (job_id > 0 && report_id > 0) {

                var _lasv = $('#hf_lasv').val();
                var _lasv_details = $('#tb_lasv_details').val();
                var _pem_weather = $('#hf_pem_weather').val();
                var _pem_evidence = $('#hf_pem_evidence').val();
                var _pem_moisture = $('#hf_pem_moisture').val();
                var _pem_mould = $('#hf_pem_mould').val();
                var _pem_details = $('#tb_pem_details').val();
                var _bridging_obstruction = $('#hf_bridging_obstruction').val();
                var _bridging_evidence = $('#hf_bridging_evidence').val();
                var _bridging_visible_evidence = "";
                $('.bridging-visible-evidence').each(function () {
                    var _hasclass = $('#' + this.id).hasClass('btn-red-click')
                    if (_hasclass == true) {
                        _bridging_visible_evidence += this.id + ';';
                    }
                });
                var _bridging_details = $('#tb_bridging_details').val();
                var _untreated_evidence = $('#hf_untreated_evidence').val();
                var _untreated_details = $('#tb_untreated_details').val();
                var _othercondition_evidence = $('#hf_othercondition_evidence').val();
                var _othercondition_details = $('#tb_othercondition_details').val();

                var dto = {
                    company_id: user.company_id,
                    user_id: user.id,
                    job_id: job_id,
                    customer_id: $('#hf_cusid').val(),
                    report_id: report_id,
                    lasv: _lasv,
                    lasv_details: _lasv_details,
                    pem_weather: _pem_weather,
                    pem_evidence: _pem_evidence,
                    pem_moisture: _pem_moisture,
                    pem_mould: _pem_mould,
                    pem_details: _pem_details,
                    bridging_obstruction: _bridging_obstruction,
                    bridging_evidence: _bridging_evidence,
                    bridging_visible_evidence: _bridging_visible_evidence,
                    bridging_details: _bridging_details,
                    untreated_evidence: _untreated_evidence,
                    untreated_details: _untreated_details,
                    othercondition_evidence: _othercondition_evidence,
                    othercondition_details: _othercondition_details,
                    type_id: 9
                };

                sql_offline.get_imode_callback(
                    function (status) {
                        if (status == 1) { //offline
                        }
                        else {
                            var uri = '/reports/PostSavePPSTPDRData/' + user.token + '/'
                            unitrak_api.ajax_post(uri, dto,
                                function (data) {
                                    ppstpdr_Script.save_and_post_report('img_ccttpa_pem_html','img_ccttpa_pem', '7.2.0', report_id);
                                    ppstpdr_Script.save_and_post_report('img_ccttpa_bridging_html','img_ccttpa_bridging', '7.3.0', report_id);
                                    ppstpdr_Script.save_and_post_report('img_ccttpa_othercondition_html','img_ccttpa_othercondition', '7.5.0', report_id);
                                    if (callback) callback();
                                }, function (err) {
                                    console.log(err);
                                    if (callback) callback();
                                });
                        }
                    }
                );
            }
        },
        get_msh: function (msh, report_id) {
            var job_id =  $('#hf_stpdr_job_id').val();
            if (msh.id > 0) {
                if ($.trim(msh.evidence).length > 0) {
                    $('#hf_msh_evidence').val(msh.evidence);
                    ppstpdr_Script.select_unselect('hf_msh_evidence', 'msh-evidence', msh.evidence, 'msh-evidence-option' + msh.evidence);
                    if (msh.evidence == "2" || msh.evidence == "3") { ppstpdr_Script.hideunhide('msh_evidence_container', 1); }
                    else { ppstpdr_Script.hideunhide('msh_evidence_container', 2); }
                }
                $('#tb_msh_details').val(msh.details);

                ppstpdr_Script.get_img_list(job_id, report_id, '8.0.0', function (data) {
                    ppstpdr_Script.reload_img_list(data, '8.0.0', report_id);
                });
            }
        },
        save_msh: function (callback) {
            var user = localdb.getUser();
            var job_id =  $('#hf_stpdr_job_id').val();
            var report_id = $('#hf_stpdr_report_id').val();
            if (job_id > 0 && report_id > 0) {

                var _evidence = $('#hf_msh_evidence').val();
                var _details = $('#tb_msh_details').val();

                var dto = {
                    company_id: user.company_id,
                    user_id: user.id,
                    job_id: job_id,
                    customer_id: $('#hf_cusid').val(),
                    report_id: report_id,
                    evidence: _evidence,
                    details: _details,
                    type_id: 10
                };

                sql_offline.get_imode_callback(
                    function (status) {
                        if (status == 1) { //offline
                        }
                        else {
                            var uri = '/reports/PostSavePPSTPDRData/' + user.token + '/'
                            unitrak_api.ajax_post(uri, dto,
                                function (data) {
                                    ppstpdr_Script.save_and_post_report('img_msh_html','img_msh', '8.0.0', report_id);
                                    if (callback) callback();
                                }, function (err) {
                                    console.log(err);
                                    if (callback) callback();
                                });
                        }
                    }
                );
            }
        },
        get_ac: function (acomment) {
            $('#tb_ac_comment').val(acomment);
        },
        save_ac: function (callback) {
            var user = localdb.getUser();
            var job_id =  $('#hf_stpdr_job_id').val();
            var report_id = $('#hf_stpdr_report_id').val();
            if (job_id > 0 && report_id > 0) {

                var dto = {
                    company_id: user.company_id,
                    user_id: user.id,
                    job_id: job_id,
                    customer_id: $('#hf_cusid').val(),
                    report_id: report_id,
                    comments: $('#tb_ac_comment').val(),
                    type_id: 11
                };

                sql_offline.get_imode_callback(
                    function (status) {
                        if (status == 1) { //offline
                        }
                        else {
                            var uri = '/reports/PostSavePPSTPDRData/' + user.token + '/'
                            unitrak_api.ajax_post(uri, dto,
                                function (data) {
                                    if (callback) callback();
                                }, function (err) {
                                    console.log(err);
                                    if (callback) callback();
                                });
                        }
                    }
                );
            }
        },
        get_annex: function (annex, report_id) {
            var job_id =  $('#hf_stpdr_job_id').val();
            $('#tb_annex_comment').val(annex);
            ppstpdr_Script.get_img_list(job_id, report_id, '11.0.0', function (data) {
                ppstpdr_Script.reload_img_list(data, '11.0.0', report_id);
            });
        },
        save_annex: function (callback) {
            var user = localdb.getUser();
            var job_id =  $('#hf_stpdr_job_id').val();
            var report_id = $('#hf_stpdr_report_id').val();
            if (job_id > 0 && report_id > 0) {

                var dto = {
                    company_id: user.company_id,
                    user_id: user.id,
                    job_id: job_id,
                    customer_id: $('#hf_cusid').val(),
                    report_id: report_id,
                    comments: $('#tb_annex_comment').val(),
                    type_id: 12
                };

                sql_offline.get_imode_callback(
                    function (status) {
                        if (status == 1) { //offline
                        }
                        else {
                            var uri = '/reports/PostSavePPSTPDRData/' + user.token + '/'
                            unitrak_api.ajax_post(uri, dto,
                                function (data) {
                                    ppstpdr_Script.save_and_post_report('img_annex_comment_html','img_annex_comment', '11.0.0', report_id);
                                    if (callback) callback();
                                }, function (err) {
                                    console.log(err);
                                    if (callback) callback();
                                });
                        }
                    }
                );
            }
        },
        get_cert: function (cert) {
            $('#tb_cert_company_name').val(cert.company_name).attr('readonly', 'readonly');
            $('#tb_cert_company_address').val(cert.company_address).attr('readonly', 'readonly');
            $('#tb_cert_company_email').val(cert.company_email).attr('readonly', 'readonly');
            $('#tb_cert_company_phone').val(cert.company_phone).attr('readonly', 'readonly');
            $('#tb_cert_date').val(cert.data_issued_tostring);
            $('#tb_cert_consulatant').val(cert.consultant_name).attr('readonly', 'readonly');
            $('#tb_cert_date').datepicker({ dateFormat: 'dd/mm/yy' });

            var html = '<div class="form-group" style=" width: 300px ! important">' +
                        '<label>Authorised Signatory</label>' +

                        '<div class="sigPad" style=" width: 300px;">' +
                            '<ul class="sigNav">' +
                                '<li class="drawIt"><a href="#draw-it" >Draw It</a></li>' +
                                '<li class="clearButton"><a href="#clear">Clear</a></li>' +
                            '</ul>' +
                            '<div class="sig sigWrapper" style="text-align: center ! important;">' +
                                '<div class="typed"></div>' +
                                '<canvas class="pad" width="298" height="155" id="pad"></canvas>' +
                                '<input type="hidden" name="output" id="output" class="output">' +
                            '</div>' +
                        '</div>' +
                    '</div>';

            $('#cert_sig').html(html);
            if (cert.authorized_sig != "" && cert.authorized_sig != null) {
                $('.sigPad').signaturePad({ drawOnly: true }).regenerate(cert.authorized_sig);
            }
            else {
                $('.sigPad').signaturePad({ drawOnly: true });
            }
        },
        save_cert: function (callback) {
            var user = localdb.getUser();
            var job_id =  $('#hf_stpdr_job_id').val();
            var report_id = $('#hf_stpdr_report_id').val();
            if (job_id > 0 && report_id > 0) {

                var _company_name = $('#tb_cert_company_name').val();
                var _company_address = $('#tb_cert_company_address').val();
                var _company_phone = $('#tb_cert_company_phone').val();
                var _data_issued = $('#tb_cert_date').val();
    
                var sig_img = $('#output').val();
                var canvass = $("#pad").get(0);
                var data = canvass.toDataURL();
                data = data.replace('data:image/png;base64,', '');

                var dto = {
                    company_id: user.company_id,
                    user_id: user.id,
                    job_id: job_id,
                    customer_id: $('#hf_cusid').val(),
                    report_id: report_id,
                    company_name: _company_name,
                    company_address: _company_address,
                    company_phone: _company_phone,
                    data_issued: _data_issued,
                    authorized_sig: sig_img,
                    authorized_sig_data: data,
                    type_id: 13
                };

                sql_offline.get_imode_callback(
                    function (status) {
                        if (status == 1) { //offline
                        }
                        else {
                            var uri = '/reports/PostSavePPSTPDRData/' + user.token + '/'
                            unitrak_api.ajax_post(uri, dto,
                                function (data) {
                                    if (callback) callback();
                                }, function (err) {
                                    console.log(err);
                                    if (callback) callback();
                                });
                        }
                    }
                );
            }
        },
        get_conclusion: function (conclusion) {
            var job_id =  $('#hf_stpdr_job_id').val();
            if (conclusion.id > 0) {
                if ($.trim(conclusion.ttpa_required).length > 0) {
                    $('#hf_conclusion_ttpa_required').val(conclusion.ttpa_required);
                    ppstpdr_Script.select_unselect('hf_conclusion_ttpa_required', 'conclusion-ttpa-required', conclusion.ttpa_required, 'conclusion-ttpa-required-option' + conclusion.ttpa_required);
                }
                if ($.trim(conclusion.written_stmp).length > 0) {
                    $('#hf_conclusion_written_stmp').val(conclusion.written_stmp);
                    ppstpdr_Script.select_unselect('hf_conclusion_written_stmp', 'conclusion-written-stmp', conclusion.written_stmp, 'conclusion-written-stmp-option' + conclusion.written_stmp);
                }
                if ($.trim(conclusion.removal_cctpa).length > 0) {
                    $('#hf_conclusion_removal_cctpa').val(conclusion.removal_cctpa);
                    ppstpdr_Script.select_unselect('hf_conclusion_removal_cctpa', 'conclusion-removal-cctpa', conclusion.removal_cctpa, 'conclusion-removal-cctpa-option' + conclusion.removal_cctpa);
                }
                if ($.trim(conclusion.next_inspection).length > 0) {
                    $('#hf_conclusion_next_inspection').val(conclusion.next_inspection);
                    ppstpdr_Script.select_unselect('hf_conclusion_next_inspection', 'conclusion-next-inspection', conclusion.next_inspection, 'conclusion-next-inspection-option' + conclusion.next_inspection);
                }
            }
        },
        save_conclusion: function (callback) {
            var user = localdb.getUser();
            var job_id =  $('#hf_stpdr_job_id').val();
            var report_id = $('#hf_stpdr_report_id').val();
            if (job_id > 0 && report_id > 0) {

                var _ttpa_required = $('#hf_conclusion_ttpa_required').val();
                var _written_stmp = $('#hf_conclusion_written_stmp').val();
                var _removal_cctpa = $('#hf_conclusion_removal_cctpa').val();
                var _next_inspection = $('#hf_conclusion_next_inspection').val();

                var dto = {
                    company_id: user.company_id,
                    user_id: user.id,
                    job_id: job_id,
                    customer_id: $('#hf_cusid').val(),
                    report_id: report_id,
                    ttpa_required: _ttpa_required,
                    written_stmp: _written_stmp,
                    removal_cctpa: _removal_cctpa,
                    next_inspection: _next_inspection,
                    type_id: 14
                };

                sql_offline.get_imode_callback(
                    function (status) {
                        if (status == 1) { //offline
                        }
                        else {
                            var uri = '/reports/PostSavePPSTPDRData/' + user.token + '/'
                            unitrak_api.ajax_post(uri, dto,
                                function (data) {
                                    if (callback) callback();
                                }, function (err) {
                                    console.log(err);
                                    if (callback) callback();
                                });
                        }
                    }
                );
            }
        },
        select_unselect: function (hf, class_name, el_name, btn, other_el, other_el_status) {
            $('#' + hf).val(el_name);
            $('.' + class_name).removeClass('btn-red-click btn-white-click').addClass('btn-white-click');
            $('#btn-' + btn).removeClass('btn-white-click').addClass('btn-red-click');
            if (other_el_status == true) {
                $('#' + other_el).removeClass('hidden');
            }
            else {
                $('#' + other_el).addClass('hidden');
            }
        },
        select_unselect_single: function (hf, el_name, btn) {
            if ($('#btn-' + btn).hasClass('btn-red-click')) {
                $('#btn-' + btn).removeClass('btn-red-click').addClass('btn-white-click');
            }
            else {
                $('#btn-' + btn).removeClass('btn-white-click').addClass('btn-red-click');
            }
        },
        select_unselect_single_btn: function (btn, other_el, other_el_stat) {
            if ($('#' + btn).hasClass('btn-red-click')) {
                $('#' + btn).removeClass('btn-red-click').addClass('btn-white-click');
                if (other_el_stat == true) {
                    $('#' + other_el).addClass('hidden');
                }
            }
            else {
                $('#' + btn).removeClass('btn-white-click').addClass('btn-red-click');
                if (other_el_stat == true) {
                    $('#' + other_el).removeClass('hidden');
                }
            }
        },
        hideunhide: function (el_name, value) {
            if (value == 1) {
                $('#' + el_name).removeClass('hidden');
            }
            else {
                $('#' + el_name).addClass('hidden');
            }
        },
        register_img_uploads: function (report_id) {
        },
        check_collapse_state: function () {
        },
        email_report_pdf: function () {
            $('#main_stpdrcontent').addClass('hidden');
            $('#userform-email-modal-ui').removeClass('hidden');
            ppstpdr_Script.init_email(1);
        },
        init_email: function (type) {
        },
        send_email: function (btn) {
        },
        save_all: function () {

            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        unitrak_mobile.showErrorMessage('Offline mode does not support this feature at the moment!');
                        $.mobile.loading("hide");
                        return;
                    }
                }
            );

            $.mobile.loading("show");
            unitrak_mobile._showMessage("Saving data.");
            ppstpdr_Script.save_stpdr_customer(function () {
                ppstpdr_Script.save_service_requested(function () {
                    ppstpdr_Script.save_roi(function () {
                        //ppstpdr_Script.save_accessibility(function () {
                            ppstpdr_Script.save_termites(function () {
                                ppstpdr_Script.save_chemdel(function () {
                                    ppstpdr_Script.save_fd(function () {
                                        ppstpdr_Script.save_wb(function () {
                                            ppstpdr_Script.save_ccttpa(function () {
                                                ppstpdr_Script.save_msh(function () {
                                                    ppstpdr_Script.save_ac(function () {
                                                        ppstpdr_Script.save_annex(function () {
                                                            ppstpdr_Script.save_cert(function () {
                                                                ppstpdr_Script.save_conclusion(function () {
                                                                    ppstpdr_Script.save_accessibility(function () {
                                                                        $.mobile.loading("hide");
                                                                        unitrak_mobile._showMessage("Updates successfully saved.");
                                                                        jobeditpage.viewjobreport();
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        //});
                    });
                });
            });
        },
        load_stpdr_report: function(id, job_id){
            var template = '' +
            '<div class="clearfix"></div>' +
            '<div class="list-group-item" style=" margin-left:-10px;">' +
                '<h3 class="list-group-item-heading report-element">PRE-PURCHASE TIMBER PEST DETECTION REPORT RSA</h3>' +
                '<div style=" height: 10px ! important"></div>' +
                '<input id="hf_stpdr_report_id" type="hidden" value="" />' +
                '<input id="hf_stpdr_job_id" type="hidden" value="" />' +
                '<input id="hf_stpdr_customer_id" type="hidden" value="" />' +

                //customer
                '<div class="row" style=" margin-bottom:5px; ">' +
                    '<div style=" margin: 5px; ">' +
                        '<div class="row">' +
                            '<table><tr><td>' +
                                '<i id="i_customer_hide" onclick="ppstpdr_Script.view_tab(\'div_customer\',\'i_customer_hide\',\'i_customer_show\',\'collapse_state_customer\', 1)" class="fa fa-plus-square fa-2x" style="cursor: pointer"></i>' +
                                '<i id="i_customer_show" onclick="ppstpdr_Script.hide_tab(\'div_customer\',\'i_customer_hide\',\'i_customer_show\',\'collapse_state_customer\', 1)" class="fa fa-minus-square fa-2x hidden" style="cursor: pointer"></i>' +
                            '</td><td>' +
                                '<h3 class="list-group-item-heading report-element"> Customer</h3>' +
                            '</td></tr></table>' +
                        '</div>' +
                        '<div id="div_customer" class="row hidden" style=" margin-top:5px ! important">' +
                            '<div class="row" style=" margin-top:12px ! important">' +
                                '<div class="ui-field-contain">' +
                                    '<label>Name</label>' +
                                    '<input type="text" id="tb_customer_name"/>' +
                                '</div>' +
                                '<div class="ui-field-contain">' +
                                    '<label>Address</label>' +
                                    '<input type="text" id="tb_customer_address"/>' +
                                '</div>' +
                                '<div class="ui-field-contain">' +
                                    '<label>Email</label>' +
                                    '<input type="text" id="tb_customer_email"/>' +
                                '</div>' +
                                '<div class="ui-field-contain">' +
                                    '<label>Date of Inspection</label>' +
                                    '<input type="text" id="tb_customer_date_inspection" />' +
                                '</div>' +
                                '<div class="ui-field-contain">' +
                                    '<label>Duration of Inspection</label>' +
                                    '<input type="text" id="tb_customer_duration_of_inspection"/>' +
                                '</div>' +
                            '</div>' +
                            '<div class="row" style=" margin-top:5px ! important">' +
                                '<div class="list-group-item text-element-container">' +
                                    '<h4 class="list-group-item-heading">Photo of Site Inspected</h4>' +
                                    '<div style=" height:15px!important"></div>' +
                                    '<div style="clear:both"></div><div id="img_customer_html_list"></div><div style="clear:both"></div>' +
                                    '<div class="ui-grid-b" style=" margin-top:15px;">' +
                                        '<div class="ui-block-a" style=" padding-right:1px;">' +
                                            '<button class="ui-btn" onclick="unitrak_frm.clear_images_report(\'img_customer_html\')"><i class="fa fa-times"></i> Clear</button>' +
                                        '</div>' +
                                        '<div class="ui-block-b" style=" padding-right:1px;">' +
                                            '<button class="ui-btn" onclick="unitrak_frm.capture_image_report(this,\'img_customer_html\')"><i class="fa fa-camera"></i> Camera</button>' +
                                        '</div>' +
                                        '<div class="ui-block-c" style=" padding-left:1px;">' +
                                            '<button class="ui-btn" onclick="unitrak_frm.add_image_report(this,\'img_customer_html\')"><i class="fa fa-list"></i> Library</button>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div style="clear:both"></div><div class="file-container report-element img_customer_html" id="img_customer_html"></div><div style="clear:both"></div>' +
                                '</div>' +
                            '</div>' +
                            '<div style=" height: 20px ! important"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +


                //Service Requested
                '<div class="row" style=" margin-bottom:5px; ">' +
                    '<div style=" margin: 5px; ">' +
                        '<div class="row">' +
                            '<table><tr><td>' +
                                '<i id="i_service_requested_hide" onclick="ppstpdr_Script.view_tab(\'div_service_requested\',\'i_service_requested_hide\',\'i_service_requested_show\',\'collapse_state_service_requested\', 2)" class="fa fa-plus-square fa-2x" style=" cursor: pointer"></i>' + 
                                '<i id="i_service_requested_show" onclick="ppstpdr_Script.hide_tab(\'div_service_requested\',\'i_service_requested_hide\',\'i_service_requested_show\',\'collapse_state_service_requested\', 2)" class="fa fa-minus-square fa-2x hidden" style=" cursor: pointer"></i>' + 
                            '</td><td>' +
                                '<h3 class="list-group-item-heading report-element"> Service Requested</h3>' +
                            '</td></tr></table>' +
                        '</div>' +
                        '<div id="div_service_requested" class="row hidden" style=" margin-top:5px ! important">' +
                            '<div class="list-group-item"><p class="list-group-item-text report-element">Service</p></div>' +
                            '<input id="hf_service_requested" type="hidden" value="1" />' +
                            '<div class="row" style=" margin-top:12px ! important">' +
                                '<a id="btn-sr-option1" data-role="button" class="ui-btn btn-red-click service-requested" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">PRE-PURCHASE TIMBER PEST DETECTION REPORT</a>' +
                            '</div>' +
                            '<div style=" height: 15px ! important"></div>' +
                            '<div class="row">' +
                                '<label>Special Conditions or Instructions</label>' +
                                '<textarea id="tb_sr_special_condition" cols="20" rows="2"></textarea>' +
                            '</div>' +
                            '<div style=" height: 20px ! important"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +


                //1. Results Of Inspection
                '<div class="row" style=" margin-bottom:5px; ">' +
                    '<div style=" margin: 5px; ">' +
                        '<div class="row">' +
                            '<table><tr><td>' +
                                '<i id="i_roi_hide" onclick="ppstpdr_Script.view_tab(\'div_roi\',\'i_roi_hide\',\'i_roi_show\',\'collapse_state_roi\', 3)" class="fa fa-plus-square fa-2x" style=" cursor: pointer"></i>' + 
                                '<i id="i_roi_show" onclick="ppstpdr_Script.hide_tab(\'div_roi\',\'i_roi_hide\',\'i_roi_show\',\'collapse_state_roi\', 3)" class="fa fa-minus-square fa-2x hidden" style=" cursor: pointer"></i>' + 
                            '</td><td>' +
                                '<h3 class="list-group-item-heading report-element"> 1. Results Of Inspection</h3>' +
                            '</td></tr></table>' +
                        '</div>' +
                        '<div id="div_roi" class="row hidden" style=" margin-top:5px ! important">' +
                            '<div class="list-group-item"><p class="list-group-item-text report-element">1. GENERAL</p></div>' +
                            '<div class="list-group-item"><p class="list-group-item-text report-element">1.1 General Description of the Property</p></div>' +
                            '<label>Building type</label>' +
                            '<div class="row" style=" margin-top:12px ! important">' +
                                '<input id="hf_roi_building_type" type="hidden" value="0" />' +
                                '<a id="btn-roi-bt-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_building_type\',\'roi-building-type\',\'1\',\'roi-bt-option1\',\'div_roi_building_type_others\', false)" class="ui-btn btn-white-click roi-building-type" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Detached House</a>' +
                                '<a id="btn-roi-bt-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_building_type\',\'roi-building-type\',\'2\',\'roi-bt-option2\',\'div_roi_building_type_others\', false)" class="ui-btn btn-white-click roi-building-type" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Semidetached house</a>' +
                                '<a id="btn-roi-bt-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_building_type\',\'roi-building-type\',\'3\',\'roi-bt-option3\',\'div_roi_building_type_others\', false)" class="ui-btn btn-white-click roi-building-type" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Terrace house</a>' +
                                '<a id="btn-roi-bt-option4" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_building_type\',\'roi-building-type\',\'4\',\'roi-bt-option4\',\'div_roi_building_type_others\', false)" class="ui-btn btn-white-click roi-building-type" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Queenslander</a>' +
                                '<a id="btn-roi-bt-option5" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_building_type\',\'roi-building-type\',\'5\',\'roi-bt-option5\',\'div_roi_building_type_others\', false)" class="ui-btn btn-white-click roi-building-type" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Duplex</a>' +
                                '<a id="btn-roi-bt-option6" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_building_type\',\'roi-building-type\',\'6\',\'roi-bt-option6\',\'div_roi_building_type_others\', false)" class="ui-btn btn-white-click roi-building-type" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Townhouse</a>' +
                                '<a id="btn-roi-bt-option7" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_building_type\',\'roi-building-type\',\'7\',\'roi-bt-option7\',\'div_roi_building_type_others\', false)" class="ui-btn btn-white-click roi-building-type" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Home Unit</a>' +
                                '<a id="btn-roi-bt-option8" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_building_type\',\'roi-building-type\',\'8\',\'roi-bt-option8\',\'div_roi_building_type_others\', false)" class="ui-btn btn-white-click roi-building-type" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Villa Unit</a>' +
                                '<a id="btn-roi-bt-option9" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_building_type\',\'roi-building-type\',\'9\',\'roi-bt-option9\',\'div_roi_building_type_others\', false)" class="ui-btn btn-white-click roi-building-type" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Unit</a>' +
                                '<a id="btn-roi-bt-option10" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_building_type\',\'roi-building-type\',\'10\',\'roi-bt-option10\',\'div_roi_building_type_others\', false)" class="ui-btn btn-white-click roi-building-type" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Flat</a>' +
                                '<a id="btn-roi-bt-option11" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_building_type\',\'roi-building-type\',\'11\',\'roi-bt-option11\',\'div_roi_building_type_others\', false)" class="ui-btn btn-white-click roi-building-type" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Apartment</a>' +
                                '<a id="btn-roi-bt-option12" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_building_type\',\'roi-building-type\',\'12\',\'roi-bt-option12\',\'div_roi_building_type_others\', false)" class="ui-btn btn-white-click roi-building-type" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Medium density housing complex</a>' +
                                '<a id="btn-roi-bt-option13" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_building_type\',\'roi-building-type\',\'13\',\'roi-bt-option13\',\'div_roi_building_type_others\', false)" class="ui-btn btn-white-click roi-building-type" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Industrial</a>' +
                                '<a id="btn-roi-bt-option14" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_building_type\',\'roi-building-type\',\'14\',\'roi-bt-option14\',\'div_roi_building_type_others\', false)" class="ui-btn btn-white-click roi-building-type" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Commercial</a>' +
                                '<a id="btn-roi-bt-option15" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_building_type\',\'roi-building-type\',\'15\',\'roi-bt-option15\',\'div_roi_building_type_others\', false)" class="ui-btn btn-white-click roi-building-type" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Farm</a>' +
                                '<a id="btn-roi-bt-option16" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_building_type\',\'roi-building-type\',\'16\',\'roi-bt-option16\',\'div_roi_building_type_others\', true)" class="ui-btn btn-white-click roi-building-type" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Others</a>' +
                            '</div>' +
                            '<div id="div_roi_building_type_others" class="row hidden">' +
                                '<div style=" height:10px!important"></div>' +
                                    '<div class="form-group">' +
                                        '<label>Others</label>' +
                                        '<textarea id="tb_roi_building_type_others" class="form-control" cols="20" rows="1"></textarea>' +
                                '</div>' +
                            '</div>' +
                            '<div style=" height:15px!important"></div>' +
                            '<label>Number of storeys</label>' +
                            '<input id="hf_roi_number_of_storeys" type="hidden" value="0" />' +
                            '<div class="row">' +
                                '<a id="btn-roi-nus-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_number_of_storeys\',\'roi-nus\',\'1\',\'roi-nus-option1\',\'div_roi_number_of_storeys_others\',false)" class="ui-btn btn-white-click roi-nus" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Single Storey</a>' +
                                '<a id="btn-roi-nus-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_number_of_storeys\',\'roi-nus\',\'2\',\'roi-nus-option2\',\'div_roi_number_of_storeys_others\',false)" class="ui-btn btn-white-click roi-nus" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Split-level</a>' +
                                '<a id="btn-roi-nus-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_number_of_storeys\',\'roi-nus\',\'3\',\'roi-nus-option3\',\'div_roi_number_of_storeys_others\',false)" class="ui-btn btn-white-click roi-nus" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Two Storey</a>' +
                                '<a id="btn-roi-nus-option4" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_number_of_storeys\',\'roi-nus\',\'4\',\'roi-nus-option4\',\'div_roi_number_of_storeys_others\',false)" class="ui-btn btn-white-click roi-nus" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Three Storey</a>' +
                                '<a id="btn-roi-nus-option5" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_number_of_storeys\',\'roi-nus\',\'5\',\'roi-nus-option5\',\'div_roi_number_of_storeys_others\',false)" class="ui-btn btn-white-click roi-nus" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Lowset</a>' +
                                '<a id="btn-roi-nus-option6" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_number_of_storeys\',\'roi-nus\',\'6\',\'roi-nus-option6\',\'div_roi_number_of_storeys_others\',false)" class="ui-btn btn-white-click roi-nus" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Highset</a>' +
                                '<a id="btn-roi-nus-option7" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_number_of_storeys\',\'roi-nus\',\'7\',\'roi-nus-option7\',\'div_roi_number_of_storeys_others\',true)" class="ui-btn btn-white-click roi-nus" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Others</a>' +
                            '</div>' +
                            '<div id="div_roi_number_of_storeys_others" class="row hidden">' +
                                '<div style=" height:10px!important"></div>' +
                                '<div class="form-group">' +
                                    '<label>Others</label>' +
                                    '<textarea id="tb_roi_number_of_storeys_others" cols="20" rows="1"></textarea>' +
                                '</div>' +
                            '</div>' +
                            '<div class="row">' +
                                '<div style=" height:25px!important"></div>' +
                                '<p style=" font-weight: bold">1.2 Primary Method of Construction</p>' +
                                '<div class="row">' +
                                    '<label>Main Building - Floor construction</label>' +
                                    '<input id="hf_roi_mb_fc" type="hidden" value="0" />' +
                                    '<div class="row">' +
                                        '<a id="btn-roi-mb-fc-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_mb_fc\',\'roi-mb-fc\',\'1\',\'roi-mb-fc-option1\',\'div_roi_mb_fc_others\',false)" class="ui-btn btn-white-click roi-mb-fc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Suspended timber framed</a>' +
                                        '<a id="btn-roi-mb-fc-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_mb_fc\',\'roi-mb-fc\',\'2\',\'roi-mb-fc-option2\',\'div_roi_mb_fc_others\',false)" class="ui-btn btn-white-click roi-mb-fc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Suspended steel framed</a>' +
                                        '<a id="btn-roi-mb-fc-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_mb_fc\',\'roi-mb-fc\',\'3\',\'roi-mb-fc-option3\',\'div_roi_mb_fc_others\',false)" class="ui-btn btn-white-click roi-mb-fc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Suspended slab</a>' +
                                        '<a id="btn-roi-mb-fc-option4" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_mb_fc\',\'roi-mb-fc\',\'4\',\'roi-mb-fc-option4\',\'div_roi_mb_fc_others\',false)" class="ui-btn btn-white-click roi-mb-fc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Slab floor (infill)</a>' +
                                        '<a id="btn-roi-mb-fc-option5" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_mb_fc\',\'roi-mb-fc\',\'5\',\'roi-mb-fc-option5\',\'div_roi_mb_fc_others\',false)" class="ui-btn btn-white-click roi-mb-fc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Part suspended timber framed and slab-on-ground</a>' +
                                        '<a id="btn-roi-mb-fc-option6" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_mb_fc\',\'roi-mb-fc\',\'6\',\'roi-mb-fc-option6\',\'div_roi_mb_fc_others\',false)" class="ui-btn btn-white-click roi-mb-fc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Part suspended steel framed and slab-on-ground</a>' +
                                        '<a id="btn-roi-mb-fc-option7" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_mb_fc\',\'roi-mb-fc\',\'7\',\'roi-mb-fc-option7\',\'div_roi_mb_fc_others\',false)" class="ui-btn btn-white-click roi-mb-fc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Slab-on-ground</a>' +
                                        '<a id="btn-roi-mb-fc-option8" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_mb_fc\',\'roi-mb-fc\',\'8\',\'roi-mb-fc-option8\',\'div_roi_mb_fc_others\',true)"  class="ui-btn btn-white-click roi-mb-fc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Others</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div id="div_roi_mb_fc_others" class="row hidden">' +
                                    '<div style=" height:10px!important"></div>' +
                                        '<div class="form-group">' +
                                            '<label>Others</label>' +
                                            '<textarea id="tb_roi_mb_fc_others" cols="20" rows="1"></textarea>'  +
                                        '</div>' +
                                '</div>' +
                                '<div style=" height:20px!important"></div>' +
                                '<div class="row">' +
                                    '<label>Main Building - Wall construction</label>' +
                                    '<input id="hf_roi_mb_wc" type="hidden" value="0" />' +
                                    '<div class="row">' +
                                        '<a id="btn-roi-mb-wc-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_mb_wc\',\'roi-mb-wc\',\'1\',\'roi-mb-wc-option1\',\'div_roi_mb_wc_others\',false)" class="ui-btn btn-white-click roi-mb-wc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Timber framed</a>' +
                                        '<a id="btn-roi-mb-wc-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_mb_wc\',\'roi-mb-wc\',\'2\',\'roi-mb-wc-option2\',\'div_roi_mb_wc_others\',false)" class="ui-btn btn-white-click roi-mb-wc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Steel framed</a>' +
                                        '<a id="btn-roi-mb-wc-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_mb_wc\',\'roi-mb-wc\',\'3\',\'roi-mb-wc-option3\',\'div_roi_mb_wc_others\',false)" class="ui-btn btn-white-click roi-mb-wc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Brick Veneer</a>' +
                                        '<a id="btn-roi-mb-wc-option4" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_mb_wc\',\'roi-mb-wc\',\'4\',\'roi-mb-wc-option4\',\'div_roi_mb_wc_others\',false)" class="ui-btn btn-white-click roi-mb-wc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Full brick</a>' +
                                        '<a id="btn-roi-mb-wc-option5" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_mb_wc\',\'roi-mb-wc\',\'5\',\'roi-mb-wc-option5\',\'div_roi_mb_wc_others\',false)" class="ui-btn btn-white-click roi-mb-wc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Brick Veneer (timber framed)</a>' +
                                        '<a id="btn-roi-mb-wc-option6" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_mb_wc\',\'roi-mb-wc\',\'6\',\'roi-mb-wc-option6\',\'div_roi_mb_wc_others\',false)"  class="ui-btn btn-white-click roi-mb-wc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Brick Veneer (steel framed)</a>' +
                                        '<a id="btn-roi-mb-wc-option7" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_mb_wc\',\'roi-mb-wc\',\'7\',\'roi-mb-wc-option7\',\'div_roi_mb_wc_others\',false)" class="ui-btn btn-white-click roi-mb-wc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Cavity brick</a>' +
                                        '<a id="btn-roi-mb-wc-option8" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_mb_wc\',\'roi-mb-wc\',\'8\',\'roi-mb-wc-option8\',\'div_roi_mb_wc_others\',false)" class="ui-btn btn-white-click roi-mb-wc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Concrete block</a>' +
                                        '<a id="btn-roi-mb-wc-option9" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_mb_wc\',\'roi-mb-wc\',\'9\',\'roi-mb-wc-option9\',\'div_roi_mb_wc_others\',false)" class="ui-btn btn-white-click roi-mb-wc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Earth-wall</a>' +
                                        '<a id="btn-roi-mb-wc-option10" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_mb_wc\',\'roi-mb-wc\',\'10\',\'roi-mb-wc-option10\',\'div_roi_mb_wc_others\',true)" class="ui-btn btn-white-click roi-mb-wc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Others</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div id="div_roi_mb_wc_others" class="row hidden">' +
                                    '<div style=" height:10px!important"></div>' +
                                    '<div class="form-group">' +
                                        '<label>Others</label>' +
                                        '<textarea id="tb_roi_mb_wc_others" cols="20" rows="1"></textarea>' +
                                    '</div>' +
                                '</div>' +
                                '<div style=" height:12px!important"></div>' +
                                '<div class="row">'+
                                    '<label>Main Building - Roof construction</label>' +
                                    '<input id="hf_roi_mb_rc" type="hidden" value="0" />' +
                                    '<div class="row">' +
                                        '<a id="btn-roi-mb-rc-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_mb_rc\',\'roi-mb-rc\',\'1\',\'roi-mb-rc-option1\',\'div_roi_mb_rc_others\',false)" class="ui-btn btn-white-click roi-mb-rc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Timber framed</a>' +
                                        '<a id="btn-roi-mb-rc-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_mb_rc\',\'roi-mb-rc\',\'2\',\'roi-mb-rc-option2\',\'div_roi_mb_rc_others\',false)" class="ui-btn btn-white-click roi-mb-rc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Steel framed</a>' +
                                        '<a id="btn-roi-mb-rc-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_mb_rc\',\'roi-mb-rc\',\'3\',\'roi-mb-rc-option3\',\'div_roi_mb_rc_others\',true)" class="ui-btn btn-white-click roi-mb-rc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Others</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div id="div_roi_mb_rc_others" class="row hidden">' +
                                    '<div style=" height:10px!important"></div>' +
                                    '<div class="form-group">' +
                                        '<label>Others</label>' +
                                        '<textarea id="tb_roi_mb_rc_others" cols="20" rows="1"></textarea>' +
                                    '</div>' +
                                '</div>' +
                                '<div style=" height:12px!important"></div>' +
                                '<div class="row">' +
                                    '<div class="form-group">' +
                                        '<label>Timber Secondary and Finishing Elements of Construction:</label>' +
                                        '<textarea id="tb_roi_tsfec" cols="20" rows="2"></textarea>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="row">' +
                                '<div style=" height:20px!important"></div>' +
                                '<p style=" font-weight: bold">1.3 Occupancy Status</p>' +
                                '<div class="row">' +
                                    '<input id="hf_roi_os" type="hidden" value="0" />' +
                                    '<div class="row">' +
                                        '<a id="btn-roi-os-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_os\',\'roi-os\',\'1\',\'roi-os-option1\',\'div_roi_os_others\',false)" class="ui-btn btn-white-click roi-os" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Occupied and fully furnished</a>' +
                                        '<a id="btn-roi-os-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_os\',\'roi-os\',\'2\',\'roi-os-option2\',\'div_roi_os_others\',false)" class="ui-btn btn-white-click roi-os" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Occupied and partly furnished</a>' +
                                        '<a id="btn-roi-os-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_os\',\'roi-os\',\'3\',\'roi-os-option3\',\'div_roi_os_others\',false)" class="ui-btn btn-white-click roi-os" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Occupied and unfurnished</a>' +
                                        '<a id="btn-roi-os-option4" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_os\',\'roi-os\',\'4\',\'roi-os-option4\',\'div_roi_os_others\',false)" class="ui-btn btn-white-click roi-os" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Unoccupied but fully furnished</a>' +
                                        '<a id="btn-roi-os-option5" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_os\',\'roi-os\',\'5\',\'roi-os-option5\',\'div_roi_os_others\',false)" class="ui-btn btn-white-click roi-os" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Unoccupied but partly furnished</a>' +
                                        '<a id="btn-roi-os-option6" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_os\',\'roi-os\',\'6\',\'roi-os-option6\',\'div_roi_os_others\',false)" class="ui-btn btn-white-click roi-os" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Unoccupied and unfurnished</a>' +
                                         '<a id="btn-roi-os-option7" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_os\',\'roi-os\',\'7\',\'roi-os-option7\',\'div_roi_os_others\',true)" class="ui-btn btn-white-click roi-os" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Others</a>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div id="div_roi_os_others" class="row hidden">' +
                                '<div style=" height:10px!important"></div>' +
                                '<div class="form-group">' +
                                    '<label>Others</label>' +
                                    '<textarea id="tb_roi_os_others" cols="20" rows="1"></textarea>' +
                                '</div>' +
                            '</div>' +
                            '<div class="row">' +
                                '<div style=" height:20px!important"></div>'+
                                '<p style=" font-weight: bold">1.4 Orientation: To establish the way in which the property was viewed. The facade of the building faces</p>' +
                                '<div class="row">' +
                                    '<input id="hf_roi_o" type="hidden" value="0" />' +
                                    '<div class="row">' +
                                        '<a id="btn-roi-o-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_o\',\'roi-o\',\'1\',\'roi-o-option1\',\'div_roi_o_others\',false)" class="ui-btn btn-white-click roi-o" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">The facade of the building faces north</a>' +
                                        '<a id="btn-roi-o-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_o\',\'roi-o\',\'2\',\'roi-o-option2\',\'div_roi_o_others\',false)" class="ui-btn btn-white-click roi-o" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">The facade of the building faces northeast</a>' +
                                        '<a id="btn-roi-o-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_o\',\'roi-o\',\'3\',\'roi-o-option3\',\'div_roi_o_others\',false)" class="ui-btn btn-white-click roi-o" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">The facade of the building faces northwest</a>' +
                                        '<a id="btn-roi-o-option4" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_o\',\'roi-o\',\'4\',\'roi-o-option4\',\'div_roi_o_others\',false)" class="ui-btn btn-white-click roi-o" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">The facade of the building faces south</a>' +
                                        '<a id="btn-roi-o-option5" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_o\',\'roi-o\',\'5\',\'roi-o-option5\',\'div_roi_o_others\',false)" class="ui-btn btn-white-click roi-o" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">The facade of the building faces southeast</a>' +
                                        '<a id="btn-roi-o-option6" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_o\',\'roi-o\',\'6\',\'roi-o-option6\',\'div_roi_o_others\',false)" class="ui-btn btn-white-click roi-o" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">The facade of the building faces southwest</a>' +
                                        '<a id="btn-roi-o-option7" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_o\',\'roi-o\',\'7\',\'roi-o-option7\',\'div_roi_o_others\',false)" class="ui-btn btn-white-click roi-o" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">The facade of the building faces east</a>' +
                                        '<a id="btn-roi-o-option8" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_o\',\'roi-o\',\'8\',\'roi-o-option8\',\'div_roi_o_others\',false)" class="ui-btn btn-white-click roi-o" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">The facade of the building faces west</a>' +
                                        '<a id="btn-roi-o-option9" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_o\',\'roi-o\',\'9\',\'roi-o-option9\',\'div_roi_o_others\',false)" class="ui-btn btn-white-click roi-o" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">The facade of the building faces the street</a>' +
                                        '<a id="btn-roi-o-option10" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_o\',\'roi-o\',\'10\',\'roi-o-option10\',\'div_roi_o_others\',false)" class="ui-btn btn-white-click roi-o" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">See attached Property and Floor Plant Sketch</a>' +
                                        '<a id="btn-roi-o-option11" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_o\',\'roi-o\',\'11\',\'roi-o-option11\',\'div_roi_o_others\',true)" class="ui-btn btn-white-click roi-o" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Other</a>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div id="div_roi_o_others" class="row hidden">' +
                                '<div style=" height:10px!important"></div>' +
                                '<div class="form-group">' +
                                    '<label>Others</label>' +
                                    '<textarea id="tb_roi_o_others" cols="20" rows="1"></textarea>' +
                                '</div>' +
                            '</div>' +
                            '<div class="row">' +
                                '<div style=" height:20px!important"></div>' +
                                '<p style=" font-weight: bold">1.5 Weather. Prevailing weather conditions at the time of inspection</p>' +
                                '<div class="row">' +
                                    '<input id="hf_roi_weather" type="hidden" value="0" />' +
                                    '<div class="row">' +
                                        '<a id="btn-roi-weather-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_weather\',\'roi-weather\',\'1\',\'roi-weather-option1\',\'div_roi_weather_others\',false);ppstpdr_Script.set_weather_btn(1)" class="ui-btn btn-white-click roi-weather" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Dry</a>' +
                                        '<a id="btn-roi-weather-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_weather\',\'roi-weather\',\'2\',\'roi-weather-option2\',\'div_roi_weather_others\',false);ppstpdr_Script.set_weather_btn(2)" class="ui-btn btn-white-click roi-weather" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Wet</a>' +
                                        '<a id="btn-roi-weather-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_weather\',\'roi-weather\',\'3\',\'roi-weather-option3\',\'div_roi_weather_others\',false);ppstpdr_Script.set_weather_btn(1)" class="ui-btn btn-white-click roi-weather" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Prolonged dry spell</a>' +
                                        '<a id="btn-roi-weather-option4" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_weather\',\'roi-weather\',\'4\',\'roi-weather-option4\',\'div_roi_weather_others\',false);ppstpdr_Script.set_weather_btn(2)" class="ui-btn btn-white-click roi-weather" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Prolonged wet spell</a>' +
                                        '<a id="btn-roi-weather-option5" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_roi_weather\',\'roi-weather\',\'5\',\'roi-weather-option5\',\'div_roi_weather_others\',true)" class="ui-btn btn-white-click roi-weather" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Other</a>' +                                  
                                    '</div>' +
                                '</div>' +
                                '<div id="div_roi_weather_others" class="row hidden">' +
                                    '<div style=" height:10px!important"></div>' +
                                    '<div class="form-group">' +
                                        '<label>Others</label>' +
                                        '<textarea id="tb_roi_weather_others" class="form-control" cols="20" rows="1"></textarea>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div style=" height: 20px ! important"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +

            
                //2. Accessibility
                '<div class="row" style=" margin-bottom:5px; ">' +
                    '<div style=" margin: 5px; ">' +
                        '<div class="row">' +
                            '<table><tr><td>' +
                                '<i id="i_accessibility_hide" onclick="ppstpdr_Script.view_tab(\'div_accessibility\',\'i_accessibility_hide\',\'i_accessibility_show\',\'collapse_state_accessibility\', 4)" class="fa fa-plus-square fa-2x" style=" cursor: pointer"></i>' + 
                                '<i id="i_accessibility_show" onclick="ppstpdr_Script.hide_tab(\'div_accessibility\',\'i_accessibility_hide\',\'i_accessibility_show\',\'collapse_state_accessibility\', 4)" class="fa fa-minus-square fa-2x hidden" style=" cursor: pointer"></i>' +
                            '</td><td>' +
                                '<h3 class="list-group-item-heading report-element"> 2. Accessibility</h3>' +
                            '</td></tr></table>' +
                        '</div>' +
                        '<div id="div_accessibility" class="row hidden" style=" margin-top:5px ! important">' +
                            '<div class="list-group-item"><p class="list-group-item-text report-element">2.1 The inspection covered the following Readily Accessible Areas including</p></div>' +
                            '<div class="row" style=" margin-top:12px ! important">' +
                                '<div class="row">' +
                                    '<input id="hf_accessibility_area_ins" type="hidden" value="0" />' +
                                    '<div class="row">' +
                                        '<a id="btn-accessibility_area_ins-option1" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility_area_ins-option1\')" class="ui-btn btn-white-click roi-accessibility-area-ins" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Building interior</a>' +
                                        '<a id="btn-accessibility_area_ins-option2" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility_area_ins-option2\')" class="ui-btn btn-white-click roi-accessibility-area-ins" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Building exterior</a>' +
                                        '<a id="btn-accessibility_area_ins-option3" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility_area_ins-option3\')" class="ui-btn btn-white-click roi-accessibility-area-ins" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Roof exterior</a>' +
                                        '<a id="btn-accessibility_area_ins-option4" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility_area_ins-option4\')" class="ui-btn btn-white-click roi-accessibility-area-ins" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Roof space</a>' +
                                        '<a id="btn-accessibility_area_ins-option5" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility_area_ins-option5\')" class="ui-btn btn-white-click roi-accessibility-area-ins" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Subfloor space</a>' +
                                        '<a id="btn-accessibility_area_ins-option6" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility_area_ins-option6\')" class="ui-btn btn-white-click roi-accessibility-area-ins" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Outbuildings</a>' +
                                        '<a id="btn-accessibility_area_ins-option7" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility_area_ins-option7\')" class="ui-btn btn-white-click roi-accessibility-area-ins" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">The site</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div style=" height:12px!important"></div>' +
                                '<div class="row">' +
                                    '<label>Additional Comments</label>' +
                                    '<textarea id="tb_accessibility_area_ins_add_comment" cols="20" rows="2"></textarea>' +
                                '</div>' +
                            '</div>' +
                            '<div style=" height:20px!important"></div>' +
                            '<div class="row">' +
                                '<div class="list-group-item"><p class="list-group-item-text report-element">2.2 Areas Not Inspected - The inspection did not include areas which were not readily accessible, inaccessible or obstructed at the time of inspection. This includes the void under the laundry, kitchen and vanity cupboards, baths, showers and wall cavities. See also Clause A.1 - Limitation No. 2.</p></div>' +
                            '</div>' +
                            //strata
                            '<div style=" height:15px!important"></div>' +
                            '<div class="row">' +
                                '<div class="list-group-item"><p class="list-group-item-text report-element">2.2.1 Strata or Company Title Properties</p></div>' +
                                '<div class="row">' +
                                    '<label>Was the inspection of a strata or company title property (e.g. a home unit or townhouse)?</label>' +
                                    '<input id="hf_accessibility_si" type="hidden" value="2" />' +
                                    '<div class="row">' +
                                        '<a id="btn-accessibility-si-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_si\',\'accessibility-si\',\'1\',\'accessibility-si-option1\')" class="ui-btn btn-white-click accessibility-si" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes</a>' +
                                        '<a id="btn-accessibility-si-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_si\',\'accessibility-si\',\'2\',\'accessibility-si-option2\')" class="ui-btn btn-red-click accessibility-si" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No</a>' +
                                        '<a id="btn-accessibility-si-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_si\',\'accessibility-si\',\'3\',\'accessibility-si-option3\')" class="ui-btn btn-white-click accessibility-si" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Not Applicable</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div style=" height:12px!important"></div>' +
                                '<div class="row">' +
                                    '<label>Was the inspection limited to assessing the interior and immediate exterior of a particular unit? </label>' +
                                    '<input id="hf_accessibility_sil" type="hidden" value="2" />' +
                                    '<div class="row">' +
                                        '<a id="btn-accessibility-sil-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_sil\',\'accessibility-sil\',\'1\',\'accessibility-sil-option1\')" class="ui-btn btn-white-click accessibility-sil" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes - see note below</a>' +
                                        '<a id="btn-accessibility-sil-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_sil\',\'accessibility-sil\',\'2\',\'accessibility-sil-option2\')" class="ui-btn btn-red-click accessibility-sil" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No</a>' +
                                        '<a id="btn-accessibility-sil-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_sil\',\'accessibility-sil\',\'3\',\'accessibility-sil-option3\')" class="ui-btn btn-white-click accessibility-sil" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Not Applicable</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div style=" height:12px!important"></div>' +
                                '<div class="row">' +
                                    '<label>Additional Comments</label>' +
                                    '<textarea id="tb_accessibility_strata_addtional_comments" cols="20" rows="2"></textarea>' +
                                '</div>' +
                            '</div>' +
                            '<div style=" height:20px!important"></div>' +

                            //obstruction
                            '<div class="row">' +
                                    '<div class="list-group-item"><p class="list-group-item-text report-element">2.2.2 Obstructions</p></div>' +
                                    '<div class="row">' +
                                        '<label>Were there any obstructions that may conceal a possible timber pest attack?</label>' +
                                        '<div style=" height:10px!important"></div>' +

                                        //interior
                                        '<div class="row">' +
                                            '<div class="list-group-item"><p class="list-group-item-text report-element">To the Building Interior</p></div>' +
                                            '<input id="hf_accessibility_o_bi_option" type="hidden" value="2" />' +
                                            '<div class="row">' +
                                                '<a id="btn-accessibility-o-bi-option-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_o_bi_option\',\'accessibility-o-bi-option\',\'1\',\'accessibility-o-bi-option-option1\');ppstpdr_Script.hideunhide(\'div_accessibility_o_bi_option\',1)" class="ui-btn btn-white-click accessibility-o-bi-option" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes</a>' +
                                                '<a id="btn-accessibility-o-bi-option-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_o_bi_option\',\'accessibility-o-bi-option\',\'2\',\'accessibility-o-bi-option-option2\');ppstpdr_Script.hideunhide(\'div_accessibility_o_bi_option\',2)" class="ui-btn btn-red-click accessibility-o-bi-option" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No</a>' +
                                            '</div>' +
                                            '<div style=" height:15px!important"></div>' +
                                            '<div id="div_accessibility_o_bi_option" class="row hidden">' +
                                                '<label>Building Interior Obstructions</label>' +
                                                '<input id="hf_accessibility_o_bi" type="hidden" value="0" />' +
                                                '<div class="row">' +
                                                    '<a id="btn-accessibility-o-bi-option1" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-bi-option1\')" class="ui-btn btn-white-click accessibility-o-bi" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">The area being locked</a>' +
                                                    '<a id="btn-accessibility-o-bi-option2" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-bi-option2\')" class="ui-btn btn-white-click accessibility-o-bi" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Access denied by client</a>' +
                                                    '<a id="btn-accessibility-o-bi-option3" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-bi-option3\')" class="ui-btn btn-white-click accessibility-o-bi" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No reasonable access to the area</a>' +
                                                    '<a id="btn-accessibility-o-bi-option4" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-bi-option4\')" class="ui-btn btn-white-click accessibility-o-bi" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Large Bulky items restricting access</a>' +
                                                    '<a id="btn-accessibility-o-bi-option5" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-bi-option5\')" class="ui-btn btn-white-click accessibility-o-bi" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Furniture</a>' +
                                                    '<a id="btn-accessibility-o-bi-option6" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-bi-option6\')" class="ui-btn btn-white-click accessibility-o-bi" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Stored Items</a>' +
                                                    '<a id="btn-accessibility-o-bi-option7" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-bi-option7\')" class="ui-btn btn-white-click accessibility-o-bi" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Fixtures</a>' +
                                                    '<a id="btn-accessibility-o-bi-option8" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-bi-option8\')" class="ui-btn btn-white-click accessibility-o-bi" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Flooring</a>' +
                                                    '<a id="btn-accessibility-o-bi-option9" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-bi-option9\',\'div_accessibility_o_bi_others\',true)" class="ui-btn btn-white-click accessibility-o-bi" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Others</a>' +
                                                '</div>' +
                                                '<div id="div_accessibility_o_bi_others" class="row hidden">' +
                                                    '<div style=" height:10px!important"></div>' +
                                                    '<label>Others</label>' +
                                                    '<textarea id="tb_accessibility_o_bi_others" cols="20" rows="1"></textarea>' +
                                                '</div>' +
                                                '<div style=" height:15px!important"></div>' +
                                                '<div class="row">' +
                                                    '<label>Comments</label>' +
                                                    '<textarea id="tb_accessibility_o_bi_comments" cols="20" rows="2"></textarea>' +
                                                '</div>' +
                                                '<div class="row" style=" margin-top:15px ! important">' +
                                                    '<div class="list-group-item text-element-container">' +
                                                        '<h4 class="list-group-item-heading">Photo of Interior Obstructions</h4>' +
                                                        '<div style=" height:15px!important"></div>' +
                                                        '<div style="clear:both"></div><div id="img_accessibility_io_html_list"></div><div style="clear:both"></div>' +
                                                        '<div class="ui-grid-b" style=" margin-top:15px;">' +
                                                            '<div class="ui-block-a" style=" padding-right:1px;">' +
                                                                '<button class="ui-btn" onclick="unitrak_frm.clear_images_report(\'img_accessibility_io_html\')"><i class="fa fa-times"></i> Clear</button>' +
                                                            '</div>' +
                                                            '<div class="ui-block-b" style=" padding-right:1px;">' +
                                                                '<button class="ui-btn" onclick="unitrak_frm.capture_image_report(this,\'img_accessibility_io_html\')"><i class="fa fa-camera"></i> Camera</button>' +
                                                            '</div>' +
                                                            '<div class="ui-block-c" style=" padding-left:1px;">' +
                                                                '<button class="ui-btn" onclick="unitrak_frm.add_image_report(this,\'img_accessibility_io_html\')"><i class="fa fa-list"></i> Library</button>' +
                                                            '</div>' +
                                                        '</div>' +
                                                        '<div style="clear:both"></div><div class="file-container report-element img_accessibility_io_html" id="img_accessibility_io_html"></div><div style="clear:both"></div>' +
                                                    '</div>' +
                                                '</div>' +                                                
                                            '</div>' +
                                        '</div>' +
                                        '<div style=" height:10px!important"></div>' +

                                        //exrterior
                                        '<div class="row">' +
                                            '<div class="list-group-item"><p class="list-group-item-text report-element">To the Building Exterior</p></div>' +
                                            '<input id="hf_accessibility_o_be_option" type="hidden" value="2" />' +
                                            '<div class="row">' +
                                                '<a id="btn-accessibility-o-be-option-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_o_be_option\',\'accessibility-o-be-option\',\'1\',\'accessibility-o-be-option-option1\');ppstpdr_Script.hideunhide(\'div_accessibility_o_be_option\',1)" class="ui-btn btn-white-click accessibility-o-be-option" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes</a>' +
                                                '<a id="btn-accessibility-o-be-option-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_o_be_option\',\'accessibility-o-be-option\',\'2\',\'accessibility-o-be-option-option2\');ppstpdr_Script.hideunhide(\'div_accessibility_o_be_option\',2)" class="ui-btn btn-red-click accessibility-o-be-option" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No</a>' +
                                            '</div>' +
                                            '<div style=" height:15px!important"></div>' +
                                            '<div id="div_accessibility_o_be_option" class="row hidden">' +
                                                '<label>Building Exterior Obstructions</label>' +
                                                '<input id="hf_accessibility_o_be" type="hidden" value="0" />' +
                                                '<div class="row">' +
                                                    '<a id="btn-accessibility-o-be-option1" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-be-option1\')" class="ui-btn btn-white-click accessibility-o-be" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Block work</a>' +
                                                    '<a id="btn-accessibility-o-be-option2" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-be-option2\')" class="ui-btn btn-white-click accessibility-o-be" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Brickwork</a>' +
                                                    '<a id="btn-accessibility-o-be-option3" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-be-option3\')" class="ui-btn btn-white-click accessibility-o-be" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Built-up areas abutting the building</a>' +
                                                    '<a id="btn-accessibility-o-be-option4" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-be-option4\')" class="ui-btn btn-white-click accessibility-o-be" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Cladding</a>' +
                                                    '<a id="btn-accessibility-o-be-option5" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-be-option5\')" class="ui-btn btn-white-click accessibility-o-be" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Decking</a>' +
                                                    '<a id="btn-accessibility-o-be-option6" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-be-option6\')" class="ui-btn btn-white-click accessibility-o-be" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Duct Work</a>' +
                                                    '<a id="btn-accessibility-o-be-option7" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-be-option7\')" class="ui-btn btn-white-click accessibility-o-be" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Earth abutting the building</a>' +
                                                    '<a id="btn-accessibility-o-be-option8" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-be-option8\')" class="ui-btn btn-white-click accessibility-o-be" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Grass-covered areas abutting the building</a>' +
                                                    '<a id="btn-accessibility-o-be-option9" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-be-option9\')" class="ui-btn btn-white-click accessibility-o-be" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Landscaping abutting the building</a>' +
                                                    '<a id="btn-accessibility-o-be-option10" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-be-option10\')" class="ui-btn btn-white-click accessibility-o-be" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Paved areas abutting the bulding</a>' +
                                                    '<a id="btn-accessibility-o-be-option11" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-be-option11\')" class="ui-btn btn-white-click accessibility-o-be" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Stairways</a>' +
                                                    '<a id="btn-accessibility-o-be-option12" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-be-option12\')" class="ui-btn btn-white-click accessibility-o-be" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Steps</a>' +
                                                    '<a id="btn-accessibility-o-be-option13" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-be-option13\')" class="ui-btn btn-white-click accessibility-o-be" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Stored building materials abutting the building</a>' +
                                                    '<a id="btn-accessibility-o-be-option14" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-be-option14\')" class="ui-btn btn-white-click accessibility-o-be" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Thick foliage</a>' +
                                                    '<a id="btn-accessibility-o-be-option15" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-be-option15\')" class="ui-btn btn-white-click accessibility-o-be" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Vegetation</a>' +
                                                    '<a id="btn-accessibility-o-be-option16" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-be-option16\',\'div_accessibility_o_be_others\',true)" class="ui-btn btn-white-click accessibility-o-be" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Others</a>' +
                                                '</div>' +
                                                '<div id="div_accessibility_o_be_others" class="row hidden">' +
                                                    '<div style=" height:15px!important"></div>' +
                                                    '<label>Others</label>' +
                                                    '<textarea id="tb_accessibility_o_be_others" cols="20" rows="1"></textarea>' +
                                                '</div>' +
                                                '<div style=" height:15px!important"></div>' +
                                                '<div class="row">' +
                                                    '<label>Comments</label>' +
                                                    '<textarea id="tb_accessibility_o_be_comments" cols="20" rows="2"></textarea>' +
                                                '</div>' +
                                                '<div class="row" style=" margin-top:15px ! important">' +
                                                    '<div class="list-group-item text-element-container">' +
                                                        '<h4 class="list-group-item-heading">Photo of Exterior Obstructions</h4>' +
                                                        '<div style=" height:15px!important"></div>' +
                                                        '<div style="clear:both"></div><div id="img_accessibility_eo_html_list"></div><div style="clear:both"></div>' +
                                                        '<div class="ui-grid-b" style=" margin-top:15px;">' +
                                                            '<div class="ui-block-a" style=" padding-right:1px;">' +
                                                                '<button class="ui-btn" onclick="unitrak_frm.clear_images_report(\'img_accessibility_eo_html\')"><i class="fa fa-times"></i> Clear</button>' +
                                                            '</div>' +
                                                            '<div class="ui-block-b" style=" padding-right:1px;">' +
                                                                '<button class="ui-btn" onclick="unitrak_frm.capture_image_report(this,\'img_accessibility_eo_html\')"><i class="fa fa-camera"></i> Camera</button>' +
                                                            '</div>' +
                                                            '<div class="ui-block-c" style=" padding-left:1px;">' +
                                                                '<button class="ui-btn" onclick="unitrak_frm.add_image_report(this,\'img_accessibility_eo_html\')"><i class="fa fa-list"></i> Library</button>' +
                                                            '</div>' +
                                                        '</div>' +
                                                        '<div style="clear:both"></div><div class="file-container report-element img_accessibility_eo_html" id="img_accessibility_eo_html"></div><div style="clear:both"></div>' +
                                                    '</div>' +
                                                '</div>' +                                                
                                            '</div>' +
                                        '</div>' +                                       
                                        '<div style=" height:10px!important"></div>' +

                                        //outbuilding
                                        '<div class="row">' +
                                            '<div class="list-group-item"><p class="list-group-item-text report-element">To the Outbuildings</p></div>' +
                                            '<input id="hf_accessibility_o_o_option" type="hidden" value="2" />' +
                                            '<div class="row">' +
                                                '<a id="btn-accessibility-o-o-option-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_o_o_option\',\'accessibility-o-o-option\',\'1\',\'accessibility-o-o-option-option1\');ppstpdr_Script.hideunhide(\'div_accessibility_o_o_option\',1)" class="ui-btn btn-white-click accessibility-o-o-option" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes</a>' +
                                                '<a id="btn-accessibility-o-o-option-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_o_o_option\',\'accessibility-o-o-option\',\'2\',\'accessibility-o-o-option-option2\');ppstpdr_Script.hideunhide(\'div_accessibility_o_o_option\',2)" class="ui-btn btn-red-click accessibility-o-o-option" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No</a>' +
                                            '</div>' +
                                            '<div style=" height:15px!important"></div>' +
                                            '<div id="div_accessibility_o_o_option" class="row hidden">' +
                                                '<label>Outbuildings Obstructions</label>' +
                                                '<input id="hf_accessibility_o_o" type="hidden" value="0" />' +
                                                '<div class="row">' +
                                                    '<a id="btn-accessibility-o-o-option1" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-o-option1\')" class="ui-btn btn-white-click accessibility-o-o" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No access was granted</a>' +
                                                    '<a id="btn-accessibility-o-o-option2" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-o-option2\')" class="ui-btn btn-white-click accessibility-o-o" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Restricted access due to stored items</a>' +
                                                    '<a id="btn-accessibility-o-o-option3" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-o-option3\')" class="ui-btn btn-white-click accessibility-o-o" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">The area was unsafe</a>' +
                                                    '<a id="btn-accessibility-o-o-option4" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-o-option4\')" class="ui-btn btn-white-click accessibility-o-o" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">The building was locked</a>' +
                                                    '<a id="btn-accessibility-o-o-option5" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-o-option5\',\'div_accessibility_o_o_others\',true)" class="ui-btn btn-white-click accessibility-o-o" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Others</a>' +
                                                '</div>' +
                                                '<div id="div_accessibility_o_o_others" class="row hidden">' +
                                                    '<div style=" height:10px!important"></div>' +
                                                    '<label>Others</label>' +
                                                    '<textarea id="tb_accessibility_o_o_others" cols="20" rows="1"></textarea>' +
                                                '</div>' +
                                                '<div style=" height:15px!important"></div>' +
                                                '<div class="row">' +
                                                    '<label>Comments</label>' +
                                                    '<textarea id="tb_accessibility_o_o_comments" cols="20" rows="2"></textarea>' +
                                                '</div>' +
                                                '<div class="row" style=" margin-top:15px ! important">' +
                                                    '<div class="list-group-item text-element-container">' +
                                                        '<h4 class="list-group-item-heading">Photo of Outbuilding Obstructions</h4>' +
                                                        '<div style=" height:15px!important"></div>' +
                                                        '<div style="clear:both"></div><div id="img_accessibility_o_html_list"></div><div style="clear:both"></div>' +
                                                        '<div class="ui-grid-b" style=" margin-top:15px;">' +
                                                            '<div class="ui-block-a" style=" padding-right:1px;">' +
                                                                '<button class="ui-btn" onclick="unitrak_frm.clear_images_report(\'img_accessibility_o_html\')"><i class="fa fa-times"></i> Clear</button>' +
                                                            '</div>' +
                                                            '<div class="ui-block-b" style=" padding-right:1px;">' +
                                                                '<button class="ui-btn" onclick="unitrak_frm.capture_image_report(this,\'img_accessibility_o_html\')"><i class="fa fa-camera"></i> Camera</button>' +
                                                            '</div>' +
                                                            '<div class="ui-block-c" style=" padding-left:1px;">' +
                                                                '<button class="ui-btn" onclick="unitrak_frm.add_image_report(this,\'img_accessibility_o_html\')"><i class="fa fa-list"></i> Library</button>' +
                                                            '</div>' +
                                                        '</div>' +
                                                        '<div style="clear:both"></div><div class="file-container report-element img_accessibility_o_html" id="img_accessibility_o_html"></div><div style="clear:both"></div>' +
                                                    '</div>' +
                                                '</div>' +                                                
                                            '</div>' +
                                        '</div>' +
                                        '<div style=" height:10px!important"></div>' +
                                        
                                        //sub flor
                                        '<div class="row">' +
                                            '<div class="list-group-item"><p class="list-group-item-text report-element">To the Sub Floor Space</p></div>' +
                                            '<input id="hf_accessibility_o_sf_option" type="hidden" value="2" />' +
                                            '<div class="row">' +
                                                '<a id="btn-accessibility-o-sf-option-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_o_sf_option\',\'accessibility-o-sf-option\',\'1\',\'accessibility-o-sf-option-option1\');ppstpdr_Script.hideunhide(\'div_accessibility_o_sf_option\',1)" class="ui-btn btn-white-click accessibility-o-sf-option" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes</a>' +
                                                '<a id="btn-accessibility-o-sf-option-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_o_sf_option\',\'accessibility-o-sf-option\',\'2\',\'accessibility-o-sf-option-option2\');ppstpdr_Script.hideunhide(\'div_accessibility_o_sf_option\',2)" class="ui-btn btn-red-click accessibility-o-sf-option" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No</a>' +
                                            '</div>' +
                                            '<div style=" height:15px!important"></div>' +
                                            '<div id="div_accessibility_o_sf_option" class="row hidden">' +
                                                '<label>Sub-floor Areas Obstructions</label>' +
                                                '<input id="hf_accessibility_o_sf" type="hidden" value="0" />' + 
                                                '<div class="row">' +
                                                    '<a id="btn-accessibility-o-sf-option1" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-sf-option1\')" class="ui-btn btn-white-click accessibility-o-sf" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No reasonable access</a>' +
                                                    '<a id="btn-accessibility-o-sf-option2" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-sf-option2\')" class="ui-btn btn-white-click accessibility-o-sf" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No access point</a>' +
                                                    '<a id="btn-accessibility-o-sf-option3" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-sf-option3\')" class="ui-btn btn-white-click accessibility-o-sf" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Construction design</a>' +
                                                    '<a id="btn-accessibility-o-sf-option4" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-sf-option4\')" class="ui-btn btn-white-click accessibility-o-sf" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Partial/limited access due to height restrictions</a>' +
                                                    '<a id="btn-accessibility-o-sf-option5" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-sf-option5\')" class="ui-btn btn-white-click accessibility-o-sf" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Stored Items</a>' +
                                                    '<a id="btn-accessibility-o-sf-option6" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-sf-option6\')" class="ui-btn btn-white-click accessibility-o-sf" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Pipe work blocking/restricting access</a>' +
                                                    '<a id="btn-accessibility-o-sf-option7" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-sf-option7\')" class="ui-btn btn-white-click accessibility-o-sf" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Ducting blocking/restricting access</a>' +
                                                    '<a id="btn-accessibility-o-sf-option8" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-sf-option8\')" class="ui-btn btn-white-click accessibility-o-sf" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No reasonable access to some areas due to height restrictions</a>' +
                                                    '<a id="btn-accessibility-o-sf-option9" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-sf-option9\')" class="ui-btn btn-white-click accessibility-o-sf" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No reasonable access due to height restrictions</a>' +
                                                    '<a id="btn-accessibility-o-sf-option10" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-sf-option10\')" class="ui-btn btn-white-click accessibility-o-sf" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">The area was not safe</a>' +
                                                    '<a id="btn-accessibility-o-sf-option11" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-sf-option11\',\'div_accessibility_o_sf_others\',true)" class="ui-btn btn-white-click accessibility-o-sf" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Others</a>' +
                                                '</div>' +
                                                '<div id="div_accessibility_o_sf_others" class="row hidden">' +
                                                    '<div style=" height:10px!important"></div>' +
                                                    '<label>Others</label>' +
                                                    '<textarea id="tb_accessibility_o_sf_others" cols="20" rows="1"></textarea>' +
                                                '</div>' +
                                                '<div style=" height:15px!important"></div>' +
                                                '<div class="row">' +
                                                    '<label>Comments</label>' +
                                                    '<textarea id="tb_accessibility_o_sf_comments" cols="20" rows="2"></textarea>' +
                                                '</div>' +
                                                '<div class="row" style=" margin-top:15px ! important">' +
                                                    '<div class="list-group-item text-element-container">' +
                                                        '<h4 class="list-group-item-heading">Photo of Sub Floor Obstructions</h4>' +
                                                        '<div style=" height:15px!important"></div>' +
                                                        '<div style="clear:both"></div><div id="img_accessibility_sf_html_list"></div><div style="clear:both"></div>' +
                                                        '<div class="ui-grid-b" style=" margin-top:15px;">' +
                                                            '<div class="ui-block-a" style=" padding-right:1px;">' +
                                                                '<button class="ui-btn" onclick="unitrak_frm.clear_images_report(\'img_accessibility_sf_html\')"><i class="fa fa-times"></i> Clear</button>' +
                                                            '</div>' +
                                                            '<div class="ui-block-b" style=" padding-right:1px;">' +
                                                                '<button class="ui-btn" onclick="unitrak_frm.capture_image_report(this,\'img_accessibility_sf_html\')"><i class="fa fa-camera"></i> Camera</button>' +
                                                            '</div>' +
                                                            '<div class="ui-block-c" style=" padding-left:1px;">' +
                                                                '<button class="ui-btn" onclick="unitrak_frm.add_image_report(this,\'img_accessibility_sf_html\')"><i class="fa fa-list"></i> Library</button>' +
                                                            '</div>' +
                                                        '</div>' +
                                                        '<div style="clear:both"></div><div class="file-container report-element img_accessibility_sf_html" id="img_accessibility_sf_html"></div><div style="clear:both"></div>' +
                                                    '</div>' +
                                                '</div>' +                                                
                                            '</div>' +
                                        '</div>' +
                                        '<div style=" height:10px!important"></div>' +

                                        //rood space
                                        '<div class="row">' +
                                            '<div class="list-group-item"><p class="list-group-item-text report-element">To the Roof Space</p></div>' +
                                            '<input id="hf_accessibility_o_rs_option" type="hidden" value="2" />' +
                                            '<div class="row">' +
                                                '<a id="btn-accessibility-o-rs-option-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_o_rs_option\',\'accessibility-o-rs-option\',\'1\',\'accessibility-o-rs-option-option1\');ppstpdr_Script.hideunhide(\'div_accessibility_o_rs_option\',1)" class="ui-btn btn-white-click accessibility-o-rs-option" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes</a>' +
                                                '<a id="btn-accessibility-o-rs-option-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_o_rs_option\',\'accessibility-o-rs-option\',\'2\',\'accessibility-o-rs-option-option2\');ppstpdr_Script.hideunhide(\'div_accessibility_o_rs_option\',2)" class="ui-btn btn-red-click accessibility-o-rs-option" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No</a>' +
                                            '</div>' +
                                            '<div style=" height:15px!important"></div>' +
                                            '<div id="div_accessibility_o_rs_option" class="row hidden">' +
                                                '<label>Roof Space Obstructions</label>' +
                                                '<input id="hf_accessibility_o_rs" type="hidden" value="0" />' +
                                                '<div class="row">' +
                                                    '<a id="btn-accessibility-o-rs-option1" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-rs-option1\')" class="ui-btn btn-white-click accessibility-o-rs" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No reasonable access</a>' +
                                                    '<a id="btn-accessibility-o-rs-option2" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-rs-option2\')" class="ui-btn btn-white-click accessibility-o-rs" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No access point</a>' +
                                                    '<a id="btn-accessibility-o-rs-option3" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-rs-option3\')" class="ui-btn btn-white-click accessibility-o-rs" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Construction design</a>' +
                                                    '<a id="btn-accessibility-o-rs-option4" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-rs-option4\')" class="ui-btn btn-white-click accessibility-o-rs" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Partial/limited access due to height restrictions</a>' +
                                                    '<a id="btn-accessibility-o-rs-option5" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-rs-option5\')" class="ui-btn btn-white-click accessibility-o-rs" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No roof-void</a>' +
                                                    '<a id="btn-accessibility-o-rs-option6" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-rs-option6\')" class="ui-btn btn-white-click accessibility-o-rs" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Stored Items</a>' +
                                                    '<a id="btn-accessibility-o-rs-option7" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-rs-option7\')" class="ui-btn btn-white-click accessibility-o-rs" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Pipe work blocking/restricting access</a>' +
                                                    '<a id="btn-accessibility-o-rs-option8" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-rs-option8\')" class="ui-btn btn-white-click accessibility-o-rs" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Ducting blocking/restricting access</a>' +
                                                    '<a id="btn-accessibility-o-rs-option9" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-rs-option9\')" class="ui-btn btn-white-click accessibility-o-rs" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No reasonable access to some areas due to height restrictions</a>' +
                                                    '<a id="btn-accessibility-o-rs-option10" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-rs-option10\')" class="ui-btn btn-white-click accessibility-o-rs" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No reasonable access due to height restrictions</a>' +
                                                    '<a id="btn-accessibility-o-rs-option11" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-rs-option11\')" class="ui-btn btn-white-click accessibility-o-rs" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">The area was not safe</a>' +
                                                    '<a id="btn-accessibility-o-rs-option12" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-rs-option12\',\'div_accessibility_o_rs_others\',true)" class="ui-btn btn-white-click accessibility-o-rs" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Others</a>' +
                                                '</div>' +
                                                '<div id="div_accessibility_o_rs_others" class="row hidden">' +
                                                    '<div style=" height:10px!important"></div>' +
                                                    '<label>Others</label>' +
                                                    '<textarea id="tb_accessibility_o_rs_others" cols="20" rows="1"></textarea>' +
                                                '</div>' +
                                                '<div style=" height:15px!important"></div>' +
                                                '<div class="row">' +
                                                    '<label>Comments</label>' +
                                                    '<textarea id="tb_accessibility_o_rs_comments" cols="20" rows="2"></textarea>' +
                                                '</div>' +
                                                '<div class="row" style=" margin-top:15px ! important">' +
                                                    '<div class="list-group-item text-element-container">' +
                                                        '<h4 class="list-group-item-heading">Photo of Roof Space Obstructions</h4>' +
                                                        '<div style=" height:15px!important"></div>' +
                                                        '<div style="clear:both"></div><div id="img_accessibility_rs_html_list"></div><div style="clear:both"></div>' +
                                                        '<div class="ui-grid-b" style=" margin-top:15px;">' +
                                                            '<div class="ui-block-a" style=" padding-right:1px;">' +
                                                                '<button class="ui-btn" onclick="unitrak_frm.clear_images_report(\'img_accessibility_rs_html\')"><i class="fa fa-times"></i> Clear</button>' +
                                                            '</div>' +
                                                            '<div class="ui-block-b" style=" padding-right:1px;">' +
                                                                '<button class="ui-btn" onclick="unitrak_frm.capture_image_report(this,\'img_accessibility_rs_html\')"><i class="fa fa-camera"></i> Camera</button>' +
                                                            '</div>' +
                                                            '<div class="ui-block-c" style=" padding-left:1px;">' +
                                                                '<button class="ui-btn" onclick="unitrak_frm.add_image_report(this,\'img_accessibility_rs_html\')"><i class="fa fa-list"></i> Library</button>' +
                                                            '</div>' +
                                                        '</div>' +
                                                        '<div style="clear:both"></div><div class="file-container report-element img_accessibility_rs_html" id="img_accessibility_rs_html"></div><div style="clear:both"></div>' +
                                                    '</div>' +
                                                '</div>' +                                                
                                            '</div>' +
                                        '</div>' +                                       
                                        '<div style=" height:10px!important"></div>' +
                                        
                                        //the site
                                        '<div class="row">' +
                                            '<div class="list-group-item"><p class="list-group-item-text report-element">To The Site</p></div>' +
                                            '<input id="hf_accessibility_o_s_option" type="hidden" value="2" />' +
                                            '<div class="row">' +
                                                '<a id="btn-accessibility-o-s-option-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_o_s_option\',\'accessibility-o-s-option\',\'1\',\'accessibility-o-s-option-option1\');ppstpdr_Script.hideunhide(\'div_accessibility_o_s_option\',1)" class="ui-btn btn-white-click accessibility-o-s-option" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes</a>' +
                                                '<a id="btn-accessibility-o-s-option-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_o_s_option\',\'accessibility-o-s-option\',\'2\',\'accessibility-o-s-option-option2\');ppstpdr_Script.hideunhide(\'div_accessibility_o_s_option\',2)" class="ui-btn btn-red-click accessibility-o-s-option" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No</a>' +
                                            '</div>' +
                                            '<div style=" height:15px!important"></div>' +
                                            '<div id="div_accessibility_o_s_option" class="row hidden">' +
                                                '<label>Site Obstructions</label>' +
                                                '<input id="hf_accessibility_o_s" type="hidden" value="0" />' +
                                                '<div class="row">' +
                                                    '<a id="btn-accessibility-o-s-option1" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-s-option1\')" class="ui-btn btn-white-click accessibility-o-s" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Access was not available</a>' +
                                                    '<a id="btn-accessibility-o-s-option2" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-s-option2\')" class="ui-btn btn-white-click accessibility-o-s" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Gate was locked</a>' +
                                                    '<a id="btn-accessibility-o-s-option3" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-s-option3\')" class="ui-btn btn-white-click accessibility-o-s" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">The area was not safe</a>' +
                                                    '<a id="btn-accessibility-o-s-option4" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-s-option4\')" class="ui-btn btn-white-click accessibility-o-s" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Stored items</a>' +
                                                    '<a id="btn-accessibility-o-s-option5" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-s-option5\')" class="ui-btn btn-white-click accessibility-o-s" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Overgrown/Thick Vegetation</a>' +
                                                    '<a id="btn-accessibility-o-s-option6" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-s-option6\')" class="ui-btn btn-white-click accessibility-o-s" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Adjoining property (see Strata Title)</a>' +
                                                    '<a id="btn-accessibility-o-s-option7" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-s-option7\')" class="ui-btn btn-white-click accessibility-o-s" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Dog was not restrained</a>' +
                                                    '<a id="btn-accessibility-o-s-option8" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-s-option8\',\'div_accessibility_o_s_others\',true)" class="ui-btn btn-white-click accessibility-o-s" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Others</a>' +
                                                '</div>' +
                                                '<div id="div_accessibility_o_s_others" class="row hidden">' +
                                                    '<div style=" height:10px!important"></div>' +
                                                    '<label>Others</label>' +
                                                    '<textarea id="tb_accessibility_o_s_others" cols="20" rows="1"></textarea>' +
                                                '</div>' +
                                                '<div style=" height:15px!important"></div>' +
                                                '<div class="row">' +
                                                    '<label>Comments</label>' +
                                                    '<textarea id="tb_accessibility_o_s_comments" cols="20" rows="2"></textarea>' +
                                                '</div>' +
                                                '<div class="row" style=" margin-top:15px ! important">' +
                                                    '<div class="list-group-item text-element-container">' +
                                                        '<h4 class="list-group-item-heading">Photo of Site Obstructions</h4>' +
                                                        '<div style=" height:15px!important"></div>' +
                                                        '<div style="clear:both"></div><div id="img_accessibility_s_html_list"></div><div style="clear:both"></div>' +
                                                        '<div class="ui-grid-b" style=" margin-top:15px;">' +
                                                            '<div class="ui-block-a" style=" padding-right:1px;">' +
                                                                '<button class="ui-btn" onclick="unitrak_frm.clear_images_report(\'img_accessibility_s_html\')"><i class="fa fa-times"></i> Clear</button>' +
                                                            '</div>' +
                                                            '<div class="ui-block-b" style=" padding-right:1px;">' +
                                                                '<button class="ui-btn" onclick="unitrak_frm.capture_image_report(this,\'img_accessibility_s_html\')"><i class="fa fa-camera"></i> Camera</button>' +
                                                            '</div>' +
                                                            '<div class="ui-block-c" style=" padding-left:1px;">' +
                                                                '<button class="ui-btn" onclick="unitrak_frm.add_image_report(this,\'img_accessibility_s_html\')"><i class="fa fa-list"></i> Library</button>' +
                                                            '</div>' +
                                                        '</div>' +
                                                        '<div style="clear:both"></div><div class="file-container report-element img_accessibility_s_html" id="img_accessibility_s_html"></div><div style="clear:both"></div>' +
                                                    '</div>' +
                                                '</div>' +                                                
                                            '</div>' +
                                        '</div>' +
                                        '<div style=" height:10px!important"></div>' +
                                        
                                        //rood exterior
                                        '<div class="row">' +
                                            '<div class="list-group-item"><p class="list-group-item-text report-element">To the Roof Exterior</p></div>' +
                                            '<input id="hf_accessibility_o_re_option" type="hidden" value="2" />' +
                                            '<div class="row">' +
                                                '<a id="btn-accessibility-o-re-option-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_o_re_option\',\'accessibility-o-re-option\',\'1\',\'accessibility-o-re-option-option1\');ppstpdr_Script.hideunhide(\'div_accessibility_o_re_option\',1)" class="ui-btn btn-white-click accessibility-o-re-option" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes</a>' +
                                                '<a id="btn-accessibility-o-re-option-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_o_re_option\',\'accessibility-o-re-option\',\'2\',\'accessibility-o-re-option-option2\');ppstpdr_Script.hideunhide(\'div_accessibility_o_re_option\',2)" class="ui-btn btn-red-click accessibility-o-re-option" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No</a>' +
                                            '</div>' +
                                            '<div style=" height:15px!important"></div>' +
                                            '<div id="div_accessibility_o_re_option" class="row hidden">' +
                                                '<label>Roof Exterior Obstructions</label>' +
                                                '<input id="hf_accessibility_o_re" type="hidden" value="0" />' +
                                                '<div class="row">' +
                                                    '<a id="btn-accessibility-o-re-option1" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-re-option1\')" class="ui-btn btn-white-click accessibility-o-re" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Leaves</a>' +
                                                    '<a id="btn-accessibility-o-re-option2" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-re-option2\')" class="ui-btn btn-white-click accessibility-o-re" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Pipe works</a>' +
                                                    '<a id="btn-accessibility-o-re-option3" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-re-option3\')" class="ui-btn btn-white-click accessibility-o-re" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Roofing</a>' +
                                                    '<a id="btn-accessibility-o-re-option4" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-re-option4\')" class="ui-btn btn-white-click accessibility-o-re" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Solar heating panels</a>' +
                                                    '<a id="btn-accessibility-o-re-option5" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-re-option5\')" class="ui-btn btn-white-click accessibility-o-re" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Thick foliage</a>' +
                                                    '<a id="btn-accessibility-o-re-option6" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-re-option6\')" class="ui-btn btn-white-click accessibility-o-re" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Vegetation</a>' +
                                                    '<a id="btn-accessibility-o-re-option7" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-accessibility-o-re-option7\',\'div_accessibility_o_re_others\',true)" class="ui-btn btn-white-click accessibility-o-re" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Others</a>' +
                                                '</div>' +
                                                '<div id="div_accessibility_o_re_others" class="row hidden">' +
                                                    '<div style=" height:10px!important"></div>' +
                                                    '<label>Others</label>' +
                                                    '<textarea id="tb_accessibility_o_re_others" cols="20" rows="1"></textarea>' +
                                                '</div>' +
                                                '<div style=" height:15px!important"></div>' +
                                                '<div class="row">' +
                                                    '<label>Comments</label>' +
                                                    '<textarea id="tb_accessibility_o_re_comments" cols="20" rows="2"></textarea>' +
                                                '</div>' +
                                                '<div class="row" style=" margin-top:15px ! important">' +
                                                    '<div class="list-group-item text-element-container">' +
                                                        '<h4 class="list-group-item-heading">Photo of Roof Exterior Obstructions</h4>' +
                                                        '<div style=" height:15px!important"></div>' +
                                                        '<div style="clear:both"></div><div id="img_accessibility_re_html_list"></div><div style="clear:both"></div>' +
                                                        '<div class="ui-grid-b" style=" margin-top:15px;">' +
                                                            '<div class="ui-block-a" style=" padding-right:1px;">' +
                                                                '<button class="ui-btn" onclick="unitrak_frm.clear_images_report(\'img_accessibility_re_html\')"><i class="fa fa-times"></i> Clear</button>' +
                                                            '</div>' +
                                                            '<div class="ui-block-b" style=" padding-right:1px;">' +
                                                                '<button class="ui-btn" onclick="unitrak_frm.capture_image_report(this,\'img_accessibility_re_html\')"><i class="fa fa-camera"></i> Camera</button>' +
                                                            '</div>' +
                                                            '<div class="ui-block-c" style=" padding-left:1px;">' +
                                                                '<button class="ui-btn" onclick="unitrak_frm.add_image_report(this,\'img_accessibility_re_html\')"><i class="fa fa-list"></i> Library</button>' +
                                                            '</div>' +
                                                        '</div>' +
                                                        '<div style="clear:both"></div><div class="file-container report-element img_accessibility_re_html" id="img_accessibility_re_html"></div><div style="clear:both"></div>' +
                                                    '</div>' +
                                                '</div>' +                                                
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                            '</div>' +
                            '<div style=" height:12px!important"></div>' +
                            '<div class="row">' +
                                '<label>Additional Comments</label>' +
                                '<textarea id="tb_accessibility_o_add_comments" cols="20" rows="2"></textarea>' +
                            '</div>' +
                            '<div class="row">' +
                                '<div style=" height:20px!important"></div>' +
                                '<div class="list-group-item"><p class="list-group-item-text report-element">2.2.3 Inaccessible Areas</p></div>' +
                                '<div class="row">' +
                                    '<label>Were there any normally accessible areas that did not permit entry?</label>' +
                                    '<input type="text" id="tb_inaccessible_areas"/>' +
                                '</div>' +
                                '<div class="row" style=" margin-top:15px ! important">' +
                                    '<div class="list-group-item text-element-container">' +
                                        '<h4 class="list-group-item-heading">Photo of areas</h4>' +
                                        '<div style=" height:15px!important"></div>' +
                                        '<div style="clear:both"></div><div id="img_accessibility_inaccessible_areas_html_list"></div><div style="clear:both"></div>' +
                                        '<div class="ui-grid-b" style=" margin-top:15px;">' +
                                            '<div class="ui-block-a" style=" padding-right:1px;">' +
                                                '<button class="ui-btn" onclick="unitrak_frm.clear_images_report(\'img_accessibility_inaccessible_areas_html\')"><i class="fa fa-times"></i> Clear</button>' +
                                            '</div>' +
                                            '<div class="ui-block-b" style=" padding-right:1px;">' +
                                                '<button class="ui-btn" onclick="unitrak_frm.capture_image_report(this,\'img_accessibility_inaccessible_areas_html\')"><i class="fa fa-camera"></i> Camera</button>' +
                                            '</div>' +
                                            '<div class="ui-block-c" style=" padding-left:1px;">' +
                                                '<button class="ui-btn" onclick="unitrak_frm.add_image_report(this,\'img_accessibility_inaccessible_areas_html\')"><i class="fa fa-list"></i> Library</button>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div style="clear:both"></div><div class="file-container report-element img_accessibility_inaccessible_areas_html" id="img_accessibility_inaccessible_areas_html"></div><div style="clear:both"></div>' +
                                    '</div>' +
                                '</div>' +                                                
                            '</div>' +
                            '<div class="row">' +
                                '<div style=" height:20px!important"></div>' +
                                '<div class="list-group-item"><p class="list-group-item-text report-element">2.3 Undetected Timber Pest Risk Assessment</p></div>' +
                                '<p style=" font-weight: bold">2.3 Undetected Timber Pest Risk Assessment </p>' +
                                '<div class="row">' +
                                    '<label>Due to the level of accessibility for inspection including the presence of obstructions, the overall degree of risk of undetected Timber Pest Attack and Conditions Conducive to Timber Pest Attack was considered</label>' +
                                    '<input id="hf_accessibility_undetected_tpp_assessment" type="hidden" value="2" />' +
                                    '<div class="row">' +
                                        '<a id="btn-accessibility-undetected-tpp-assessment-option-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_undetected_tpp_assessment\',\'accessibility-undetected-tpp-assessment-option\',\'1\',\'accessibility-undetected-tpp-assessment-option-option1\');" class="ui-btn btn-white-click accessibility-undetected-tpp-assessment-option" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Low</a>' +
                                        '<a id="btn-accessibility-undetected-tpp-assessment-option-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_undetected_tpp_assessment\',\'accessibility-undetected-tpp-assessment-option\',\'2\',\'accessibility-undetected-tpp-assessment-option-option2\');" class="ui-btn btn-red-click accessibility-undetected-tpp-assessment-option" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Moderate. See recommendations below</a>' +
                                        '<a id="btn-accessibility-undetected-tpp-assessment-option-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_undetected_tpp_assessment\',\'accessibility-undetected-tpp-assessment-option\',\'3\',\'accessibility-undetected-tpp-assessment-option-option3\');" class="ui-btn btn-white-click accessibility-undetected-tpp-assessment-option" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Moderate to High. See recommendations below</a>' +
                                        '<a id="btn-accessibility-undetected-tpp-assessment-option-option4" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_accessibility_undetected_tpp_assessment\',\'accessibility-undetected-tpp-assessment-option\',\'4\',\'accessibility-undetected-tpp-assessment-option-option4\');" class="ui-btn btn-white-click accessibility-undetected-tpp-assessment-option" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">High. See recommendations below</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="row">' +
                                    '<label>Additional Comments</label>' +
                                    '<textarea id="tb_accessibility_undetected_tpp_assessment_comments" cols="20" rows="2"></textarea>' +
                                '</div>' +
                            '</div>' +
                            '<div style=" height: 20px ! important"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +

                //3. Termites 
                '<div class="row" style=" margin-bottom:5px; ">' +
                    '<div style=" margin: 5px; ">' +
                        '<div class="row">' +
                            '<table><tr><td>' +
                                '<i id="i_termites_hide" onclick="ppstpdr_Script.view_tab(\'div_termites\',\'i_termites_hide\',\'i_termites_show\',\'collapse_state_termites\', 5)" class="fa fa-plus-square fa-2x" style=" cursor: pointer"></i>' + 
                                '<i id="i_termites_show" onclick="ppstpdr_Script.hide_tab(\'div_termites\',\'i_termites_hide\',\'i_termites_show\',\'collapse_state_termites\', 5)" class="fa fa-minus-square fa-2x hidden" style=" cursor: pointer"></i>' +
                            '</td><td>' +
                                '<h3 class="list-group-item-heading report-element"> 3. Termites </h3>' +
                            '</td></tr></table>' +
                        '</div>' +
                        '<div id="div_termites" class="row hidden" style=" margin-top:5px ! important">' +
                            '<div class="list-group-item"><p class="list-group-item-text report-element">3.1 Active (live) Termites</p></div>' +
                            '<div class="row" style=" margin-top:12px ! important">' +
                                '<label>Were live termites found?</label>' +
                                '<input id="hf_termite_found" type="hidden" value="2" />' +
                                '<div class="row">' +
                                    '<a id="btn-termite-f-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_found\',\'termite-f\',\'1\',\'termite-f-option1\');ppstpdr_Script.hideunhide(\'termite_found_container\',1)" class="ui-btn btn-white-click termite-f" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes - continue.</a>' +
                                    '<a id="btn-termite-f-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_found\',\'termite-f\',\'2\',\'termite-f-option2\');ppstpdr_Script.hideunhide(\'termite_found_container\',2)" class="ui-btn btn-red-click termite-f" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No - go to Item 3.2.</a>' +
                                '</div>' +
                            '</div>' +
                            '<div id="termite_found_container" class="row hidden">' +
                                '<div class="row">' +
                                    '<div style=" height:15px!important"></div>' +
                                    '<label>Was a termite nest found?</label>' +
                                    '<input id="hf_termite_nest_found" type="hidden" value="2" />' +
                                    '<div class="row">' +
                                        '<a id="btn-termite-nest-f-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_nest_found\',\'termite-nest-f\',\'1\',\'termite-nest-f-option1\')" class="ui-btn btn-white-click termite-nest-f" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes - see details below</a>' +
                                        '<a id="btn-termite-nest-f-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_nest_found\',\'termite-nest-f\',\'2\',\'termite-nest-f-option2\')" class="ui-btn btn-red-click termite-nest-f" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No</a>' +
                                        '<a id="btn-termite-nest-f-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_nest_found\',\'termite-nest-f\',\'3\',\'termite-nest-f-option3\')" class="ui-btn btn-white-click termite-nest-f" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Undetermined - see details below</a>' +
                                        '<a id="btn-termite-nest-f-option4" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_nest_found\',\'termite-nest-f\',\'4\',\'termite-nest-f-option4\')" class="ui-btn btn-white-click termite-nest-f" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Not applicable</a>' +
                                    '</div>' +
                                    '<div class="row" style=" margin-top:15px ! important">' +
                                        '<div class="list-group-item text-element-container">' +
                                            '<h4 class="list-group-item-heading">Photos</h4>' +
                                            '<div style=" height:15px!important"></div>' +
                                            '<div style="clear:both"></div><div id="img_termite_nest_found_html_list"></div><div style="clear:both"></div>' +
                                            '<div class="ui-grid-b" style=" margin-top:15px;">' +
                                                '<div class="ui-block-a" style=" padding-right:1px;">' +
                                                    '<button class="ui-btn" onclick="unitrak_frm.clear_images_report(\'img_termite_nest_found_html\')"><i class="fa fa-times"></i> Clear</button>' +
                                                '</div>' +
                                                '<div class="ui-block-b" style=" padding-right:1px;">' +
                                                    '<button class="ui-btn" onclick="unitrak_frm.capture_image_report(this,\'img_termite_nest_found_html\')"><i class="fa fa-camera"></i> Camera</button>' +
                                                '</div>' +
                                                '<div class="ui-block-c" style=" padding-left:1px;">' +
                                                    '<button class="ui-btn" onclick="unitrak_frm.add_image_report(this,\'img_termite_nest_found_html\')"><i class="fa fa-list"></i> Library</button>' +
                                                '</div>' +
                                            '</div>' +
                                            '<div style="clear:both"></div><div class="file-container report-element img_termite_nest_found_html" id="img_termite_nest_found_html"></div><div style="clear:both"></div>' +
                                        '</div>' +
                                    '</div>' +                                                
                                '</div>' +
                                '<div class="row">' +
                                    '<div style=" height:15px!important"></div>' +
                                    '<label>Have any specimens been collected for the purpose of positive identification?</label>' +
                                    '<input id="hf_termite_specimen_collected" type="hidden" value="2" />' +
                                    '<div class="row">' +
                                        '<a id="btn-termite-tsc-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_specimen_collected\',\'termite-tsc\',\'1\',\'termite-tsc-option1\')" class="ui-btn btn-white-click termite-tsc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes</a>' +
                                        '<a id="btn-termite-tsc-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_specimen_collected\',\'termite-tsc\',\'2\',\'termite-tsc-option2\')" class="ui-btn btn-red-click termite-tsc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No</a>' +
                                        '<a id="btn-termite-tsc-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_specimen_collected\',\'termite-tsc\',\'3\',\'termite-tsc-option3\')" class="ui-btn btn-white-click termite-tsc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Not applicable</a>' +
                                    '</div>' +
                                    '<div style=" height:12px!important"></div>' +
                                    '<div class="row">' +
                                        '<label>The genus or species has been positively identified as</label>' +
                                        '<input id="hf_termite_specimen_species" type="hidden" value="0" />' +
                                        '<div class="row">' +
                                            '<a id="btn-termite-ss-option1" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-termite-ss-option1\')" class="ui-btn btn-white-click termite-ss" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Coptotermes</a>' +
                                            '<a id="btn-termite-ss-option2" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-termite-ss-option2\')" class="ui-btn btn-white-click termite-ss" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Cryptotermes species</a>' +
                                            '<a id="btn-termite-ss-option3" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-termite-ss-option3\')" class="ui-btn btn-white-click termite-ss" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Heterotermes ferox</a>' +
                                            '<a id="btn-termite-ss-option4" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-termite-ss-option4\')" class="ui-btn btn-white-click termite-ss" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Mastotermes darwiniensis</a>' +
                                            '<a id="btn-termite-ss-option5" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-termite-ss-option5\')" class="ui-btn btn-white-click termite-ss" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Nasutitermes exitiosus</a>' +
                                            '<a id="btn-termite-ss-option6" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-termite-ss-option6\')" class="ui-btn btn-white-click termite-ss" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Schedorhinotermes</a>' +
                                            '<a id="btn-termite-ss-option7" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-termite-ss-option7\')" class="ui-btn btn-white-click termite-ss" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Other (explain below)</a>' +
                                            '<a id="btn-termite-ss-option8" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-termite-ss-option8\')" class="ui-btn btn-white-click termite-ss" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Undetermined (explain below)</a>' +
                                        '</div>' +
                                        '<div style=" height:12px!important"></div>' +
                                        '<div class="row">' +
                                            '<label>Details (include location of live termites found and any recommendation for further expert advice)</label>' +
                                            '<textarea id="tb_termite_specimen_species_details" cols="20" rows="2"></textarea>' +
                                        '</div>' +
                                        '<div class="row" style=" margin-top:15px ! important">' +
                                            '<div class="list-group-item text-element-container">' +
                                                '<h4 class="list-group-item-heading">Photo of species</h4>' +
                                                '<div style=" height:15px!important"></div>' +
                                                '<div style="clear:both"></div><div id="img_termite_ss_html_list"></div><div style="clear:both"></div>' +
                                                '<div class="ui-grid-b" style=" margin-top:15px;">' +
                                                    '<div class="ui-block-a" style=" padding-right:1px;">' +
                                                        '<button class="ui-btn" onclick="unitrak_frm.clear_images_report(\'img_termite_ss_html\')"><i class="fa fa-times"></i> Clear</button>' +
                                                    '</div>' +
                                                    '<div class="ui-block-b" style=" padding-right:1px;">' +
                                                        '<button class="ui-btn" onclick="unitrak_frm.capture_image_report(this,\'img_termite_ss_html\')"><i class="fa fa-camera"></i> Camera</button>' +
                                                    '</div>' +
                                                    '<div class="ui-block-c" style=" padding-left:1px;">' +
                                                        '<button class="ui-btn" onclick="unitrak_frm.add_image_report(this,\'img_termite_ss_html\')"><i class="fa fa-list"></i> Library</button>' +
                                                    '</div>' +
                                                '</div>' +
                                                '<div style="clear:both"></div><div class="file-container report-element img_termite_ss_html" id="img_termite_ss_html"></div><div style="clear:both"></div>' +
                                            '</div>' +                                      
                                        '</div>' +                                                
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="row">' + 
                                '<div style=" height:20px!important"></div>' +
                                '<div class="list-group-item"><p class="list-group-item-text report-element">3.2 Subterranean Termite Management Proposal</p></div>' +
                                '<div class="row">' +
                                    '<label>Is a Subterranean Termite Management Proposal recommended?</label>' +
                                    '<input id="hf_termite_stmp_recommended" type="hidden" value="2" />' +
                                    '<div class="row">' +
                                        '<a id="btn-termite-stmp-recommended-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_stmp_recommended\',\'termite-stmp-recommended\',\'1\',\'termite-stmp-recommended-option1\');ppstpdr_Script.hideunhide(\'termite_stmp_recommended_container\', 1);" class="ui-btn btn-white-click termite-stmp-recommended" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes - continue</a>' +
                                        '<a id="btn-termite-stmp-recommended-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_stmp_recommended\',\'termite-stmp-recommended\',\'2\',\'termite-stmp-recommended-option2\');ppstpdr_Script.hideunhide(\'termite_stmp_recommended_container\', 2);" class="ui-btn btn-red-click termite-stmp-recommended" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No - go to Item 3.3</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div id="termite_stmp_recommended_container" class="row hidden">' +
                                    '<div style=" height:12px!important"></div>' +
                                    '<label>Is this Consultant engaged to provide a management proposal?</label>' +
                                    '<input id="hf_termite_stmp_proposal" type="hidden" value="2" />' +
                                    '<div class="row">' +
                                        '<a id="btn-termite-stmp-proposal-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_stmp_proposal\',\'termite-stmp-proposal\',\'1\',\'termite-stmp-proposal-option1\')" class="ui-btn btn-white-click termite-stmp-proposal" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes - see Note 1 below</a>' +
                                        '<a id="btn-termite-stmp-proposal-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_stmp_proposal\',\'termite-stmp-proposal\',\'2\',\'termite-stmp-proposal-option2\')" class="ui-btn btn-red-click termite-stmp-proposal" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No - see note 2 below</a>' +
                                    '</div>' +
                                    '<div style=" height:10px!important"></div>' +
                                    '<div class="row">' +
                                        '<label>Additional Comments</label>' +
                                        '<textarea id="tb_termite_stmp_comments" cols="20" rows="2"></textarea>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="row">' +
                                '<div style=" height:20px!important"></div>' +
                                '<div class="list-group-item"><p class="list-group-item-text report-element">3.3 Termite Workings and/or Damage</p></div>' +
                                '<div class="row">' +
                                    '<label>Was evidence of termite workings or damage found?</label>' +
                                    '<input id="hf_termite_twd_found" type="hidden" value="2" />' +
                                    '<div class="row">' +
                                        '<a id="btn-termite-twd-found-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_twd_found\',\'termite-twd-found\',\'1\',\'termite-twd-found-option1\');ppstpdr_Script.hideunhide(\'termite_twd_found_container\', 1); " class="ui-btn btn-white-click termite-twd-found" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes - continue</a>' +
                                        '<a id="btn-termite-twd-found-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_twd_found\',\'termite-twd-found\',\'2\',\'termite-twd-found-option2\');ppstpdr_Script.hideunhide(\'termite_twd_found_container\', 2); " class="ui-btn btn-red-click termite-twd-found" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No - go to Item 3.4</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div id="termite_twd_found_container" class="row hidden">' +
                                    '<div style=" height:12px!important"></div>' +
                                    '<div class="row">' +
                                        '<label>The extent of any visible damage appears</label>' +
                                        '<input id="hf_termite_twd_damage" type="hidden" value="0" />' +
                                        '<div class="row">' +
                                            '<a id="btn-termite-twd-damage-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_twd_damage\',\'termite-twd-damage\',\'1\',\'termite-twd-damage-option1\')" class="ui-btn btn-white-click termite-twd-damage" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Localised - see details and recommendations below</a>' +
                                            '<a id="btn-termite-twd-damage-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_twd_damage\',\'termite-twd-damage\',\'2\',\'termite-twd-damage-option2\')" class="ui-btn btn-white-click termite-twd-damage" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Widespread - see details and recommendations below</a>' +
                                            '<a id="btn-termite-twd-damage-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_twd_damage\',\'termite-twd-damage\',\'3\',\'termite-twd-damage-option3\')" class="ui-btn btn-white-click termite-twd-damage" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Undetermined - see details and recommendations below</a>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div style=" height:12px!important"></div>' +
                                    '<div class="row">' +
                                        '<label>DETAILS: (indicate the location of all accessible timbers and other materials showing signs of attack, and a description of any termite workings found)</label>' +
                                        '<textarea id="tb_termite_twd_details" cols="20" rows="2"></textarea>' +
                                    '</div>' +
                                    '<div class="row" style=" margin-top:15px ! important">' +
                                        '<div class="list-group-item text-element-container">' +
                                            '<h4 class="list-group-item-heading">Photo of damage</h4>' +
                                            '<div style=" height:15px!important"></div>' +
                                            '<div style="clear:both"></div><div id="img_termite_twd_html_list"></div><div style="clear:both"></div>' +
                                            '<div class="ui-grid-b" style=" margin-top:15px;">' +
                                                '<div class="ui-block-a" style=" padding-right:1px;">' +
                                                    '<button class="ui-btn" onclick="unitrak_frm.clear_images_report(\'img_termite_twd_html\')"><i class="fa fa-times"></i> Clear</button>' +
                                                '</div>' +
                                                '<div class="ui-block-b" style=" padding-right:1px;">' +
                                                    '<button class="ui-btn" onclick="unitrak_frm.capture_image_report(this,\'img_termite_twd_html\')"><i class="fa fa-camera"></i> Camera</button>' +
                                                '</div>' +
                                                '<div class="ui-block-c" style=" padding-left:1px;">' +
                                                    '<button class="ui-btn" onclick="unitrak_frm.add_image_report(this,\'img_termite_twd_html\')"><i class="fa fa-list"></i> Library</button>' +
                                                '</div>' +
                                            '</div>' +
                                            '<div style="clear:both"></div><div class="file-container report-element img_termite_twd_html" id="img_termite_twd_html"></div><div style="clear:both"></div>' +
                                        '</div>' +                                      
                                    '</div>' +                                                
                                '</div>' +
                            '</div>' +
                            '<div class="row">' +
                                '<div style=" height:20px!important"></div>' +
                                '<div class="list-group-item"><p class="list-group-item-text report-element">3.4 Previous Termite Management Program</p></div>' +
                                '<div class="row">' +
                                    '<label>Was evidence of a possible previous termite management program noted?</label>' +
                                    '<input id="hf_termite_ptmp_evidence" type="hidden" value="2" />' +
                                    '<div class="row">' +
                                        '<a id="btn-termite-ptmp-evidence-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_ptmp_evidence\',\'termite-ptmp-evidence\',\'1\',\'termite-ptmp-evidence-option1\');ppstpdr_Script.hideunhide(\'termite_ptmp_evidence_container\', 1);" class="ui-btn btn-white-click termite-ptmp-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes - see details below and also Clause A.3 and Clause A.8</a>' +
                                        '<a id="btn-termite-ptmp-evidence-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_ptmp_evidence\',\'termite-ptmp-evidence\',\'2\',\'termite-ptmp-evidence-option2\');ppstpdr_Script.hideunhide(\'termite_ptmp_evidence_container\', 2);" class="ui-btn btn-red-click termite-ptmp-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No - go to item 3.5</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div id="termite_ptmp_evidence_container" class="row hidden">' +
                                    '<div style=" height:12px!important"></div>' +
                                    '<div class="row">' +
                                        '<label>Details: (Indicate the location of the possible previous termite management program including the location of any \'Termite Treatment Notice\')</label>' +
                                        '<textarea id="tb_termite_ptmp_details" cols="20" rows="2"></textarea>' +
                                    '</div>' +
                                    '<div class="row" style=" margin-top:15px ! important">' +
                                        '<div class="list-group-item text-element-container">' +
                                            '<h4 class="list-group-item-heading">Photos</h4>' +
                                            '<div style=" height:15px!important"></div>' +
                                            '<div style="clear:both"></div><div id="img_termite_ptmp_html_list"></div><div style="clear:both"></div>' +
                                            '<div class="ui-grid-b" style=" margin-top:15px;">' +
                                                '<div class="ui-block-a" style=" padding-right:1px;">' +
                                                    '<button class="ui-btn" onclick="unitrak_frm.clear_images_report(\'img_termite_ptmp_html\')"><i class="fa fa-times"></i> Clear</button>' +
                                                '</div>' +
                                                '<div class="ui-block-b" style=" padding-right:1px;">' +
                                                    '<button class="ui-btn" onclick="unitrak_frm.capture_image_report(this,\'img_termite_ptmp_html\')"><i class="fa fa-camera"></i> Camera</button>' +
                                                '</div>' +
                                                '<div class="ui-block-c" style=" padding-left:1px;">' +
                                                    '<button class="ui-btn" onclick="unitrak_frm.add_image_report(this,\'img_termite_ptmp_html\')"><i class="fa fa-list"></i> Library</button>' +
                                                '</div>' +
                                            '</div>' +
                                            '<div style="clear:both"></div><div class="file-container report-element img_termite_ptmp_html" id="img_termite_ptmp_html"></div><div style="clear:both"></div>' +
                                        '</div>' +                                      
                                    '</div>' +                                                
                                '</div>' +
                            '</div>' +
                            '<div class="row">' +
                                '<div style=" height:20px!important"></div>' +
                                '<div class="list-group-item"><p class="list-group-item-text report-element">3.5 Frequency of Future Inspections</p></div>' +
                                '<div class="row">' +
                                    '<label>The next inspection to help detect termite attack is recommended in</label>' +
                                    '<input id="hf_termite_ptmp_ffinspection" type="hidden" value="1" />' +
                                    '<div class="row">' +
                                        '<a id="btn-termite-ptmp-inspection-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_ptmp_ffinspection\',\'termite-ptmp-inspection\',\'1\',\'termite-ptmp-inspection-option1\');ppstpdr_Script.select_unselect(\'hf_conclusion_next_inspection\',\'conclusion-next-inspection\',\'1\',\'conclusion-next-inspection-option1\');" class="ui-btn btn-red-click termite-ptmp-inspection" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">1 Month</a>' +
                                        '<a id="btn-termite-ptmp-inspection-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_ptmp_ffinspection\',\'termite-ptmp-inspection\',\'2\',\'termite-ptmp-inspection-option2\');ppstpdr_Script.select_unselect(\'hf_conclusion_next_inspection\',\'conclusion-next-inspection\',\'2\',\'conclusion-next-inspection-option2\');" class="ui-btn btn-white-click termite-ptmp-inspection" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">2 Months</a>' +
                                        '<a id="btn-termite-ptmp-inspection-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_ptmp_ffinspection\',\'termite-ptmp-inspection\',\'3\',\'termite-ptmp-inspection-option3\');ppstpdr_Script.select_unselect(\'hf_conclusion_next_inspection\',\'conclusion-next-inspection\',\'3\',\'conclusion-next-inspection-option3\');" class="ui-btn btn-white-click termite-ptmp-inspection" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">3 Months</a>' +
                                        '<a id="btn-termite-ptmp-inspection-option4" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_ptmp_ffinspection\',\'termite-ptmp-inspection\',\'4\',\'termite-ptmp-inspection-option4\');ppstpdr_Script.select_unselect(\'hf_conclusion_next_inspection\',\'conclusion-next-inspection\',\'4\',\'conclusion-next-inspection-option4\');" class="ui-btn btn-white-click termite-ptmp-inspection" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">6 Months</a>' +
                                        '<a id="btn-termite-ptmp-inspection-option5" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_termite_ptmp_ffinspection\',\'termite-ptmp-inspection\',\'5\',\'termite-ptmp-inspection-option5\');ppstpdr_Script.select_unselect(\'hf_conclusion_next_inspection\',\'conclusion-next-inspection\',\'5\',\'conclusion-next-inspection-option5\');" class="ui-btn btn-white-click termite-ptmp-inspection" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">12 Months</a>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div style=" height: 20px ! important"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +


                //4. Chemical Delignification
                '<div class="row" style=" margin-bottom:5px; ">' +
                    '<div style=" margin: 5px; ">' +
                        '<div class="row">' +
                            '<table><tr><td>' +
                                '<i id="i_chemdel_hide" onclick="ppstpdr_Script.view_tab(\'div_chemdel\',\'i_chemdel_hide\',\'i_chemdel_show\',\'collapse_state_chemdel\', 6)" class="fa fa-plus-square fa-2x" style=" cursor: pointer"></i>' + 
                                '<i id="i_chemdel_show" onclick="ppstpdr_Script.hide_tab(\'div_chemdel\',\'i_chemdel_hide\',\'i_chemdel_show\',\'collapse_state_chemdel\', 6)" class="fa fa-minus-square fa-2x hidden" style=" cursor: pointer"></i>' +
                            '</td><td>' +
                                '<h3 class="list-group-item-heading report-element"> 4. Chemical Delignification</h3>' +
                            '</td></tr></table>' +
                        '</div>' +
                        '<div id="div_chemdel" class="row hidden" style=" margin-top:5px ! important">' +
                            '<div class="row">' +
                                '<label>Was evidence of Chemical Delignification found?</label>' +
                                '<input id="hf_chemdel_found" type="hidden" value="2" />' +
                                '<div class="row">' +
                                    '<a id="btn-chemdel-found-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_chemdel_found\',\'chemdel-found\',\'1\',\'chemdel-found-option1\');ppstpdr_Script.hideunhide(\'chemdel_found_container\', 1); " class="ui-btn btn-white-click chemdel-found" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes - continue</a>' +
                                    '<a id="btn-chemdel-found-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_chemdel_found\',\'chemdel-found\',\'2\',\'chemdel-found-option2\');ppstpdr_Script.hideunhide(\'chemdel_found_container\', 2); " class="ui-btn btn-red-click chemdel-found" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No - go to item 5</a>' +
                                '</div>' +
                            '</div>' +
                            '<div id="chemdel_found_container" class="row hidden">' +
                                '<div style=" height:12px!important"></div>' +
                                '<div class="row">' +
                                    '<label>The extent of any visible damage appears</label>' +
                                    '<input id="hf_chemdel_damage" type="hidden" value="3" />' +
                                    '<div class="row">' +
                                        '<a id="btn-chemdel-damage-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_chemdel_damage\',\'chemdel-damage\',\'1\',\'chemdel-damage-option1\')" class="ui-btn btn-white-click chemdel-damage" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Localised</a>' +
                                        '<a id="btn-chemdel-damage-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_chemdel_damage\',\'chemdel-damage\',\'2\',\'chemdel-damage-option2\')" class="ui-btn btn-white-click chemdel-damage" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Widespread</a>' +
                                        '<a id="btn-chemdel-damage-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_chemdel_damage\',\'chemdel-damage\',\'3\',\'chemdel-damage-option3\')" class="ui-btn btn-red-click chemdel-damage" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Undetermined</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div style=" height:12px!important"></div>' +
                                '<div class="row">' +
                                    '<label>Details (include the location and any recommendation for further expert advice, eg from a licensed building contractor)</label>' +
                                    '<textarea id="tb_chemdel_details" cols="20" rows="2"></textarea>' +
                                '</div>' +
                                '<div class="row" style=" margin-top:15px ! important">' +
                                    '<div class="list-group-item text-element-container">' +
                                        '<h4 class="list-group-item-heading">Photos</h4>' +
                                        '<div style=" height:15px!important"></div>' +
                                        '<div style="clear:both"></div><div id="img_chemdel_html_list"></div><div style="clear:both"></div>' +
                                        '<div class="ui-grid-b" style=" margin-top:15px;">' +
                                            '<div class="ui-block-a" style=" padding-right:1px;">' +
                                                '<button class="ui-btn" onclick="unitrak_frm.clear_images_report(\'img_chemdel_html\')"><i class="fa fa-times"></i> Clear</button>' +
                                            '</div>' +
                                            '<div class="ui-block-b" style=" padding-right:1px;">' +
                                                '<button class="ui-btn" onclick="unitrak_frm.capture_image_report(this,\'img_chemdel_html\')"><i class="fa fa-camera"></i> Camera</button>' +
                                            '</div>' +
                                            '<div class="ui-block-c" style=" padding-left:1px;">' +
                                                '<button class="ui-btn" onclick="unitrak_frm.add_image_report(this,\'img_chemdel_html\')"><i class="fa fa-list"></i> Library</button>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div style="clear:both"></div><div class="file-container report-element img_chemdel_html" id="img_chemdel_html"></div><div style="clear:both"></div>' +
                                    '</div>' +                                      
                                '</div>' +                                                
                            '</div>' +
                        '<div style=" height: 20px ! important"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +


                //5. Fungal Decay
                '<div class="row" style=" margin-bottom:5px; ">' +
                    '<div style=" margin: 5px; ">' +
                        '<div class="row">' +
                            '<table><tr><td>' +
                                '<i id="i_fd_hide" onclick="ppstpdr_Script.view_tab(\'div_fd\',\'i_fd_hide\',\'i_fd_show\',\'collapse_state_fd\', 7)" class="fa fa-plus-square fa-2x" style=" cursor: pointer"></i>' + 
                                '<i id="i_fd_show" onclick="ppstpdr_Script.hide_tab(\'div_fd\',\'i_fd_hide\',\'i_fd_show\',\'collapse_state_fd\', 7)" class="fa fa-minus-square fa-2x hidden" style=" cursor: pointer"></i> ' +
                            '</td><td>' +
                                '<h3 class="list-group-item-heading report-element"> 5. Fungal Decay</h3>' +
                            '</td></tr></table>' +
                        '</div>' +
                        '<div id="div_fd" class="row hidden" style=" margin-top:5px ! important">' +
                            '<div class="row">' +
                                '<label>Was evidence of Fungal Decay found?</label>' +
                                '<input id="hf_fungal_decay_found" type="hidden" value="2" />' +
                                '<div class="row">' +
                                    '<a id="btn-fungal-decay-found-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_fungal_decay_found\',\'fungal-decay-found\',\'1\',\'fungal-decay-found-option1\');ppstpdr_Script.hideunhide(\'fungal_decay_found_container\', 1);" class="ui-btn btn-white-click fungal-decay-found" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes - continue</a>' +
                                    '<a id="btn-fungal-decay-found-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_fungal_decay_found\',\'fungal-decay-found\',\'2\',\'fungal-decay-found-option2\');ppstpdr_Script.hideunhide(\'fungal_decay_found_container\', 2);" class="ui-btn btn-red-click fungal-decay-found" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No - go to item 6</a>' +
                                '</div>' +
                            '</div>' +
                            '<div id="fungal_decay_found_container" class="row hidden">' +
                                '<div style=" height:12px!important"></div>' +
                                '<div class="row">' +
                                    '<label>The extent of any visible damage appears</label>' +
                                    '<input id="hf_fungal_decay_timber_condition" type="hidden" value="3" />' +
                                    '<div class="row">' +
                                        '<a id="btn-fungal-decay-tc-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_fungal_decay_timber_condition\',\'fungal-decay-tc\',\'1\',\'fungal-decay-tc-option1\')" class="ui-btn btn-white-click fungal-decay-tc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Decaying</a>' +
                                        '<a id="btn-fungal-decay-tc-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_fungal_decay_timber_condition\',\'fungal-decay-tc\',\'2\',\'fungal-decay-tc-option2\')" class="ui-btn btn-white-click fungal-decay-tc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Decayed</a>' +
                                        '<a id="btn-fungal-decay-tc-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_fungal_decay_timber_condition\',\'fungal-decay-tc\',\'3\',\'fungal-decay-tc-option3\')" class="ui-btn btn-red-click fungal-decay-tc" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Undetermined</a>' +   
                                    '</div>' +
                                '</div>' +
                                '<div style=" height:12px!important"></div>' +
                                '<div class="row">' +
                                    '<label>The condition of the timber appears</label>' +
                                    '<input id="hf_fungal_decay_damage" type="hidden" value="3" />' +
                                    '<div class="row">' +
                                        '<a id="btn-fungal-decay-damage-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_fungal_decay_damage\',\'fungal-decay-damage\',\'1\',\'fungal-decay-damage-option1\')" class="ui-btn btn-white-click fungal-decay-damage" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Localised</a>' +
                                        '<a id="btn-fungal-decay-damage-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_fungal_decay_damage\',\'fungal-decay-damage\',\'2\',\'fungal-decay-damage-option2\')" class="ui-btn btn-white-click fungal-decay-damage" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Widespread</a>' +
                                        '<a id="btn-fungal-decay-damage-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_fungal_decay_damage\',\'fungal-decay-damage\',\'3\',\'fungal-decay-damage-option3\')" class="ui-btn btn-red-click fungal-decay-damage" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Undetermined</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div style=" height:12px!important"></div>' +
                                '<div class="row">' +
                                    '<label>Details (include the location and any recommendation for further expert advice, eg from a licensed building contractor)</label>' +
                                    '<textarea id="tb_fungal_decay_details" cols="20" rows="2"></textarea>' +
                                '</div>' +
                                '<div class="row" style=" margin-top:15px ! important">' +
                                    '<div class="list-group-item text-element-container">' +
                                        '<h4 class="list-group-item-heading">Photos</h4>' +
                                        '<div style=" height:15px!important"></div>' +
                                        '<div style="clear:both"></div><div id="img_fungal_decay_html_list"></div><div style="clear:both"></div>' +
                                        '<div class="ui-grid-b" style=" margin-top:15px;">' +
                                            '<div class="ui-block-a" style=" padding-right:1px;">' +
                                                '<button class="ui-btn" onclick="unitrak_frm.clear_images_report(\'img_fungal_decay_html\')"><i class="fa fa-times"></i> Clear</button>' +
                                            '</div>' +
                                            '<div class="ui-block-b" style=" padding-right:1px;">' +
                                                '<button class="ui-btn" onclick="unitrak_frm.capture_image_report(this,\'img_fungal_decay_html\')"><i class="fa fa-camera"></i> Camera</button>' +
                                            '</div>' +
                                            '<div class="ui-block-c" style=" padding-left:1px;">' +
                                                '<button class="ui-btn" onclick="unitrak_frm.add_image_report(this,\'img_fungal_decay_html\')"><i class="fa fa-list"></i> Library</button>' +
                                            '</div>' +
                                        '</div>' +
                                        '<div style="clear:both"></div><div class="file-container report-element img_fungal_decay_html" id="img_fungal_decay_html"></div><div style="clear:both"></div>' +
                                    '</div>' +                                      
                                '</div>' +                                                
                            '</div>' +
                        '<div style=" height: 20px ! important"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +


                //6. Wood Borers
                '<div class="row" style=" margin-bottom:5px; ">' +
                    '<div style=" margin: 5px; ">' +
                        '<div class="row">' +
                            '<table><tr><td>' +
                                '<i id="i_wb_hide" onclick="ppstpdr_Script.view_tab(\'div_wb\',\'i_wb_hide\',\'i_wb_show\',\'collapse_state_wb\', 8)" class="fa fa-plus-square fa-2x" style=" cursor: pointer"></i>' + 
                                '<i id="i_wb_show" onclick="ppstpdr_Script.hide_tab(\'div_wb\',\'i_wb_hide\',\'i_wb_show\',\'collapse_state_wb\', 8)" class="fa fa-minus-square fa-2x hidden" style=" cursor: pointer"></i>' +
                            '</td><td>' +
                                '<h3 class="list-group-item-heading report-element"> 6. Wood Borers</h3>' +
                            '</td></tr></table>' +
                        '</div>' +
                        '<div id="div_wb" class="row hidden" style=" margin-top:5px ! important">' +
                            '<div class="row">' +
                                '<div class="row">' +
                                    '<label>Was evidence of Wood Borers found?</label>' +
                                    '<input id="hf_wood_borers_found" type="hidden" value="2" />' +
                                    '<div class="row">' +
                                        '<a id="btn-wood-borers-found-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_wood_borers_found\',\'wood-borers-found\',\'1\',\'wood-borers-found-option1\');ppstpdr_Script.hideunhide(\'wood_borers_found_container\', 1);" class="ui-btn btn-white-click wood-borers-found" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes - continue</a>' +
                                        '<a id="btn-wood-borers-found-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_wood_borers_found\',\'wood-borers-found\',\'2\',\'wood-borers-found-option2\');ppstpdr_Script.hideunhide(\'wood_borers_found_container\', 2);" class="ui-btn btn-red-click wood-borers-found" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No - go to item 7</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div id="wood_borers_found_container" class="row hidden">' +
                                    '<div style=" height:12px!important"></div>' +
                                    '<div class="row">' +
                                        '<label>The Wood Borer is believed to be</label>' +
                                        '<input id="hf_wood_borers" type="hidden" value="3" />' +
                                        '<div class="row">' +
                                            '<a id="btn-wood-borers-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_wood_borers\',\'wood-borers\',\'1\',\'wood-borers-option1\')" class="ui-btn btn-white-click wood-borers" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Lyctid Borer</a>' +
                                            '<a id="btn-wood-borers-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_wood_borers\',\'wood-borers\',\'2\',\'wood-borers-option2\')" class="ui-btn btn-white-click wood-borers" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Anobiid Borer</a>' +
                                            '<a id="btn-wood-borers-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_wood_borers\',\'wood-borers\',\'3\',\'wood-borers-option3\')" class="ui-btn btn-red-click wood-borers" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Other(Specify Below)</a>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div style=" height:12px!important"></div>' +
                                    '<div class="row">' +
                                        '<label>The extent of any visible damage appears</label>' +
                                        '<input id="hf_wood_borers_damage" type="hidden" value="3" />' +
                                        '<div class="row">' +
                                            '<a id="btn-wood-borers-damage-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_wood_borers_damage\',\'wood-borers-damage\',\'1\',\'wood-borers-damage-option1\')" class="ui-btn btn-white-click wood-borers-damage" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Localised</a>' +
                                            '<a id="btn-wood-borers-damage-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_wood_borers_damage\',\'wood-borers-damage\',\'2\',\'wood-borers-damage-option2\')" class="ui-btn btn-white-click wood-borers-damage" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Widespread</a>' +
                                            '<a id="btn-wood-borers-damage-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_wood_borers_damage\',\'wood-borers-damage\',\'3\',\'wood-borers-damage-option3\')" class="ui-btn btn-red-click wood-borers-damage" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Undetermined</a>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div style=" height:12px!important"></div>' +
                                    '<div class="row">' +
                                        '<label>Details (include the location and any recommendation for further expert advice, eg from a licensed building contractor)</label>' +
                                        '<textarea id="tb_wood_borers_details" cols="20" rows="2"></textarea>' +
                                    '</div>' +
                                    '<div class="row" style=" margin-top:15px ! important">' +
                                        '<div class="list-group-item text-element-container">' +
                                            '<h4 class="list-group-item-heading">Photos</h4>' +
                                            '<div style=" height:15px!important"></div>' +
                                            '<div style="clear:both"></div><div id="img_wood_borers_html_list"></div><div style="clear:both"></div>' +
                                            '<div class="ui-grid-b" style=" margin-top:15px;">' +
                                                '<div class="ui-block-a" style=" padding-right:1px;">' +
                                                    '<button class="ui-btn" onclick="unitrak_frm.clear_images_report(\'img_wood_borers_html\')"><i class="fa fa-times"></i> Clear</button>' +
                                                '</div>' +
                                                '<div class="ui-block-b" style=" padding-right:1px;">' +
                                                    '<button class="ui-btn" onclick="unitrak_frm.capture_image_report(this,\'img_wood_borers_html\')"><i class="fa fa-camera"></i> Camera</button>' +
                                                '</div>' +
                                                '<div class="ui-block-c" style=" padding-left:1px;">' +
                                                    '<button class="ui-btn" onclick="unitrak_frm.add_image_report(this,\'img_wood_borers_html\')"><i class="fa fa-list"></i> Library</button>' +
                                                '</div>' +
                                            '</div>' +
                                            '<div style="clear:both"></div><div class="file-container report-element img_wood_borers_html" id="img_wood_borers_html"></div><div style="clear:both"></div>' +
                                        '</div>' +                                      
                                    '</div>' +                                                
                                '</div>' +
                            '</div>' +
                        '<div style=" height: 20px ! important"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +


                //7. Conditions Conducive To Timber Pest Attack
                '<div class="row" style=" margin-bottom:5px; ">' +
                    '<div style=" margin: 5px; ">' +
                        '<div class="row">' +
                            '<table><tr><td>' +
                                '<i id="i_ccttpa_hide" onclick="ppstpdr_Script.view_tab(\'div_ccttpa\',\'i_ccttpa_hide\',\'i_ccttpa_show\',\'collapse_state_ccttpa\', 9)" class="fa fa-plus-square fa-2x" style=" cursor: pointer"></i>' +
                                '<i id="i_ccttpa_show" onclick="ppstpdr_Script.hide_tab(\'div_ccttpa\',\'i_ccttpa_hide\',\'i_ccttpa_show\',\'collapse_state_ccttpa\', 9)" class="fa fa-minus-square fa-2x hidden" style=" cursor: pointer"></i>' +
                            '</td><td>' +
                                '<h3 class="list-group-item-heading report-element"> 7. Conditions Conducive To Timber Pest Attack</h3>' +
                            '</td></tr></table>' +
                        '</div>' +
                        '<div id="div_ccttpa" class="row hidden" style=" margin-top:5px ! important">' +
                            '<div class="row">' +
                                '<div class="row">' +
                                    '<div class="list-group-item"><p class="list-group-item-text report-element">7.1 Lack of Adequate Subfloor Ventilation</p></div>' +
                                    '<label>Was evidence of a lack of adequate ventilation found?</label>' +
                                    '<input id="hf_lasv" type="hidden" value="2" />' +
                                    '<div class="row">' +
                                        '<a id="btn-ccttpa-lasv-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_lasv\',\'ccttpa-lasv\',\'1\',\'ccttpa-lasv-option1\');ppstpdr_Script.hideunhide(\'lasv_container\', 1);" class="ui-btn btn-white-click ccttpa-lasv" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes - see details below</a>' +
                                        '<a id="btn-ccttpa-lasv-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_lasv\',\'ccttpa-lasv\',\'2\',\'ccttpa-lasv-option2\');ppstpdr_Script.hideunhide(\'lasv_container\', 1);" class="ui-btn btn-red-click ccttpa-lasv" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Undetermined - see details below</a>' +
                                        '<a id="btn-ccttpa-lasv-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_lasv\',\'ccttpa-lasv\',\'3\',\'ccttpa-lasv-option3\');ppstpdr_Script.hideunhide(\'lasv_container\', 2);" class="ui-btn btn-white-click ccttpa-lasv" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">NO</a>' +                                   
                                    '</div>' +
                                    '<div id="lasv_container" class="row hidden">' +
                                        '<div style=" height:12px!important"></div>' +
                                        '<label>Details (include the location and any recommendation for further expert advice e.g. from a licensed a building contractor)</label>' +
                                        '<textarea id="tb_lasv_details" cols="20" rows="2"></textarea>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="row">' +
                                    '<div style=" height:15px!important"></div>' +
                                    '<div class="list-group-item"><p class="list-group-item-text report-element">7.2 The Presence of Excessive Moisture</p></div>' +
                                    '<label>Prevailing weather conditions at the time of inspection</label>' +
                                    '<input id="hf_pem_weather" type="hidden" value="2" />' +
                                    '<div class="row">' +
                                        '<a id="btn-ccttpa-pem-weather-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_pem_weather\',\'ccttpa-pem-weather\',\'1\',\'ccttpa-pem-weather-option1\')" class="ui-btn btn-white-click ccttpa-pem-weather" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Wet</a>' +
                                        '<a id="btn-ccttpa-pem-weather-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_pem_weather\',\'ccttpa-pem-weather\',\'2\',\'ccttpa-pem-weather-option2\')" class="ui-btn btn-red-click ccttpa-pem-weather" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Dry</a>' +
                                    '</div>' +
                                    '<div style=" height:12px!important"></div>' +
                                    '<label>Was evidence of the presence of excessive moisture found?</label>' +
                                    '<input id="hf_pem_evidence" type="hidden" value="3" />' +
                                    '<div class="row">' +
                                        '<a id="btn-ccttpa-pem-evidence-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_pem_evidence\',\'ccttpa-pem-evidence\',\'1\',\'ccttpa-pem-evidence-option1\')" class="ui-btn btn-white-click ccttpa-pem-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes - see details below</a>' +
                                        '<a id="btn-ccttpa-pem-evidence-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_pem_evidence\',\'ccttpa-pem-evidence\',\'2\',\'ccttpa-pem-evidence-option2\')" class="ui-btn btn-white-click ccttpa-pem-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Undetermined - see details below</a>' +
                                        '<a id="btn-ccttpa-pem-evidence-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_pem_evidence\',\'ccttpa-pem-evidence\',\'3\',\'ccttpa-pem-evidence-option3\')" class="ui-btn btn-red-click ccttpa-pem-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">NO</a>' +
                                    '</div>' +
                                    '<div style=" height:12px!important"></div>' +
                                    '<label>Were high moisture readings obtained using a moisture meter?</label>' +
                                    '<input id="hf_pem_moisture" type="hidden" value="3" />' +
                                    '<div class="row">' +
                                        '<a id="btn-ccttpa-pem-moisture-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_pem_moisture\',\'ccttpa-pem-moisture\',\'1\',\'ccttpa-pem-moisture-option1\')" class="ui-btn btn-white-click ccttpa-pem-moisture" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes - see details below</a>' +
                                        '<a id="btn-ccttpa-pem-moisture-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_pem_moisture\',\'ccttpa-pem-moisture\',\'2\',\'ccttpa-pem-moisture-option2\')" class="ui-btn btn-white-click ccttpa-pem-moisture" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Undetermined - see details below</a>' +
                                        '<a id="btn-ccttpa-pem-moisture-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_pem_moisture\',\'ccttpa-pem-moisture\',\'3\',\'ccttpa-pem-moisture-option3\')" class="ui-btn btn-red-click ccttpa-pem-moisture" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">NO</a>' +
                                    '</div>' +
                                    '<div style=" height:12px!important"></div>' +
                                    '<label>Was evidence of mould growth found?</label>' +
                                    '<input id="hf_pem_mould" type="hidden" value="1" />' +
                                    '<div class="row">' +
                                        '<a id="btn-ccttpa-pem-mould-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_pem_mould\',\'ccttpa-pem-mould\',\'1\',\'ccttpa-pem-mould-option1\')" class="ui-btn btn-red-click ccttpa-pem-mould" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">NO</a>' +
                                        '<a id="btn-ccttpa-pem-mould-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_pem_mould\',\'ccttpa-pem-mould\',\'2\',\'ccttpa-pem-mould-option2\')" class="ui-btn btn-white-click ccttpa-pem-mould" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes - see details and mould recommendation below</a>' +                                   
                                    '</div>' +
                                    '<div style=" height:12px!important"></div>' +
                                    '<div class="row">' +
                                        '<label>Details (include the location and any recommendation for further expert advice e.g. from a licensed a plumbing contractor)</label>' +
                                        '<textarea id="tb_pem_details" cols="20" rows="2"></textarea>' +
                                    '</div>' +
                                    '<div class="row" style=" margin-top:15px ! important">' +
                                        '<div class="list-group-item text-element-container">' +
                                            '<h4 class="list-group-item-heading">Photos</h4>' +
                                            '<div style=" height:15px!important"></div>' +
                                            '<div style="clear:both"></div><div id="img_ccttpa_pem_html_list"></div><div style="clear:both"></div>' +
                                            '<div class="ui-grid-b" style=" margin-top:15px;">' +
                                                '<div class="ui-block-a" style=" padding-right:1px;">' +
                                                    '<button class="ui-btn" onclick="unitrak_frm.clear_images_report(\'img_ccttpa_pem_html\')"><i class="fa fa-times"></i> Clear</button>' +
                                                '</div>' +
                                                '<div class="ui-block-b" style=" padding-right:1px;">' +
                                                    '<button class="ui-btn" onclick="unitrak_frm.capture_image_report(this,\'img_ccttpa_pem_html\')"><i class="fa fa-camera"></i> Camera</button>' +
                                                '</div>' +
                                                '<div class="ui-block-c" style=" padding-left:1px;">' +
                                                    '<button class="ui-btn" onclick="unitrak_frm.add_image_report(this,\'img_ccttpa_pem_html\')"><i class="fa fa-list"></i> Library</button>' +
                                                '</div>' +
                                            '</div>' +
                                            '<div style="clear:both"></div><div class="file-container report-element img_ccttpa_pem_html" id="img_ccttpa_pem_html"></div><div style="clear:both"></div>' +
                                        '</div>' +                                      
                                    '</div>' +                                                
                                '</div>' +
                                '<div class="row">' +
                                    '<div style=" height:20px!important"></div>' +
                                    '<div class="list-group-item"><p class="list-group-item-text report-element">7.3 Bridging or Breaching of Termite Barriers and Inspection Zones</p></div>' +
                                    '<div style=" height:12px!important"></div>' +
                                    '<label>Was the finished ground or paving level above the adjacent internal floor level or damp-proof-course or obstructing any weephole or vent face on external walls?</label>' +
                                    '<input id="hf_bridging_obstruction" type="hidden" value="3" />' +
                                    '<div class="row">' +
                                        '<a id="btn-ccttpa-bridging-obstruction-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_bridging_obstruction\',\'ccttpa-bridging-obstruction\',\'1\',\'ccttpa-bridging-obstruction-option1\');ppstpdr_Script.hideunhide(\'bridging_obstruction_container\', 1);" class="ui-btn btn-white-click ccttpa-bridging-obstruction" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes - see details below</a>' +
                                        '<a id="btn-ccttpa-bridging-obstruction-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_bridging_obstruction\',\'ccttpa-bridging-obstruction\',\'2\',\'ccttpa-bridging-obstruction-option2\');ppstpdr_Script.hideunhide(\'bridging_obstruction_container\', 1);" class="ui-btn btn-white-click ccttpa-bridging-obstruction" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Undetermined - see details below</a>' +
                                        '<a id="btn-ccttpa-bridging-obstruction-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_bridging_obstruction\',\'ccttpa-bridging-obstruction\',\'3\',\'ccttpa-bridging-obstruction-option3\');ppstpdr_Script.hideunhide(\'bridging_obstruction_container\', 2);" class="ui-btn btn-red-click ccttpa-bridging-obstruction" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">NO</a>' +
                                    '</div>' +
                                    '<div style=" height:12px!important"></div>' +
                                    '<label>Was evidence of bridging or breaching  including the condition insufficient slab edge exposure found?</label>' +
                                    '<input id="hf_bridging_evidence" type="hidden" value="1" />' +
                                    '<div class="row">' +
                                        '<a id="btn-ccttpa-bridging-evidence-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_bridging_evidence\',\'ccttpa-bridging-evidence\',\'1\',\'ccttpa-bridging-evidence-option1\');ppstpdr_Script.hideunhide(\'bridging_obstruction_container\', 2);" class="ui-btn btn-red-click ccttpa-bridging-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No</a>' +
                                        '<a id="btn-ccttpa-bridging-evidence-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_bridging_evidence\',\'ccttpa-bridging-evidence\',\'2\',\'ccttpa-bridging-evidence-option2\');ppstpdr_Script.hideunhide(\'bridging_obstruction_container\', 1);" class="ui-btn btn-white-click ccttpa-bridging-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes</a>' +
                                        '<a id="btn-ccttpa-bridging-evidence-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_bridging_evidence\',\'ccttpa-bridging-evidence\',\'3\',\'ccttpa-bridging-evidence-option3\');ppstpdr_Script.hideunhide(\'bridging_obstruction_container\', 1);" class="ui-btn btn-white-click ccttpa-bridging-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Undetermined</a>' +
                                    '</div>' +
                                    '<div id="bridging_obstruction_container" class="row hidden">' +
                                        '<div style=" height:12px!important"></div>' +
                                        '<label>Yes or Undetermined - Include any visible evidence of bridging or breaching or slab edges obstructed by</label>' +
                                        '<input id="hf_bridging_visible_evidence" type="hidden" value="0" />' +
                                        '<div class="row">' +
                                            '<a id="btn-bridging-visible-evidence-option1" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-bridging-visible-evidence-option1\')" class="ui-btn btn-white-click bridging-visible-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Carports</a>' +
                                            '<a id="btn-bridging-visible-evidence-option2" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-bridging-visible-evidence-option2\')" class="ui-btn btn-white-click bridging-visible-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Verandahs</a>' +
                                            '<a id="btn-bridging-visible-evidence-option3" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-bridging-visible-evidence-option3\')" class="ui-btn btn-white-click bridging-visible-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Steps/Ramps</a>' +
                                            '<a id="btn-bridging-visible-evidence-option4" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-bridging-visible-evidence-option4\')" class="ui-btn btn-white-click bridging-visible-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Cladding</a>' +
                                            '<a id="btn-bridging-visible-evidence-option5" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-bridging-visible-evidence-option5\')" class="ui-btn btn-white-click bridging-visible-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Pipework</a>' +
                                            '<a id="btn-bridging-visible-evidence-option6" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-bridging-visible-evidence-option6\')" class="ui-btn btn-white-click bridging-visible-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Paths/Paving</a>' +
                                            '<a id="btn-bridging-visible-evidence-option7" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-bridging-visible-evidence-option7\')" class="ui-btn btn-white-click bridging-visible-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Driveways</a>' +
                                            '<a id="btn-bridging-visible-evidence-option8" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-bridging-visible-evidence-option8\')" class="ui-btn btn-white-click bridging-visible-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Earth</a>' +
                                            '<a id="btn-bridging-visible-evidence-option9" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-bridging-visible-evidence-option9\')" class="ui-btn btn-white-click bridging-visible-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Landscaping</a>' +
                                            '<a id="btn-bridging-visible-evidence-option10" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-bridging-visible-evidence-option10\')" class="ui-btn btn-white-click bridging-visible-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Additional Slabs</a>' +
                                            '<a id="btn-bridging-visible-evidence-option11" data-role="button" onclick="ppstpdr_Script.select_unselect_single_btn(\'btn-bridging-visible-evidence-option11\')" class="ui-btn btn-white-click bridging-visible-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Other (Indicate below)</a>' +
                                        '</div>' +
                                        '<div style=" height:12px!important"></div>' +
                                        '<div class="row">' +
                                            '<label>Details (include the location and any recommendation for further expert advice e.g. from a licensed a building contractor)</label>' +
                                            '<textarea id="tb_bridging_details" cols="20" rows="2"></textarea>' +
                                        '</div>' +
                                        '<div class="row" style=" margin-top:15px ! important">' +
                                            '<div class="list-group-item text-element-container">' +
                                                '<h4 class="list-group-item-heading">Photos</h4>' +
                                                '<div style=" height:15px!important"></div>' +
                                                '<div style="clear:both"></div><div id="img_ccttpa_bridging_html_list"></div><div style="clear:both"></div>' +
                                                '<div class="ui-grid-b" style=" margin-top:15px;">' +
                                                    '<div class="ui-block-a" style=" padding-right:1px;">' +
                                                        '<button class="ui-btn" onclick="unitrak_frm.clear_images_report(\'img_ccttpa_bridging_html\')"><i class="fa fa-times"></i> Clear</button>' +
                                                    '</div>' +
                                                    '<div class="ui-block-b" style=" padding-right:1px;">' +
                                                        '<button class="ui-btn" onclick="unitrak_frm.capture_image_report(this,\'img_ccttpa_bridging_html\')"><i class="fa fa-camera"></i> Camera</button>' +
                                                    '</div>' +
                                                    '<div class="ui-block-c" style=" padding-left:1px;">' +
                                                        '<button class="ui-btn" onclick="unitrak_frm.add_image_report(this,\'img_ccttpa_bridging_html\')"><i class="fa fa-list"></i> Library</button>' +
                                                    '</div>' +
                                                '</div>' +
                                                '<div style="clear:both"></div><div class="file-container report-element img_ccttpa_bridging_html" id="img_ccttpa_bridging_html"></div><div style="clear:both"></div>' +
                                            '</div>' +                                      
                                        '</div>' +                                                
                                    '</div>' +
                                '</div>' +
                                '<div class="row">' +
                                    '<div style=" height:20px!important"></div>' +
                                    '<div class="list-group-item"><p class="list-group-item-text report-element">7.4 Untreated or Non-Durable Timber Used in a Hazardous Environment</p></div>' +
                                    '<div style=" height:12px!important"></div>' +
                                    '<label>Was evidence of untreated or non-durable timber used in a hazardous environment found?</label>' +
                                    '<input id="hf_untreated_evidence" type="hidden" value="1" />' +
                                    '<div class="row">' +
                                        '<a id="btn-ccttpa-untreated-evidence-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_untreated_evidence\',\'ccttpa-untreated-evidence\',\'1\',\'ccttpa-untreated-evidence-option1\');ppstpdr_Script.hideunhide(\'untreated_evidence_container\', 2);" class="ui-btn btn-red-click ccttpa-untreated-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">NO</a>' +
                                        '<a id="btn-ccttpa-untreated-evidence-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_untreated_evidence\',\'ccttpa-untreated-evidence\',\'2\',\'ccttpa-untreated-evidence-option2\');ppstpdr_Script.hideunhide(\'untreated_evidence_container\', 1);" class="ui-btn btn-white-click ccttpa-untreated-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes - see details below</a>' +
                                        '<a id="btn-ccttpa-untreated-evidence-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_untreated_evidence\',\'ccttpa-untreated-evidence\',\'3\',\'ccttpa-untreated-evidence-option3\');ppstpdr_Script.hideunhide(\'untreated_evidence_container\', 1);" class="ui-btn btn-white-click ccttpa-untreated-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Undetermined - see details below</a>' +
                                    '</div>' +
                                    '<div id="untreated_evidence_container" class="row hidden">' +
                                        '<div style=" height:12px!important"></div>' +
                                        '<label>Details (include the location and any recommendation for further expert advice e.g. from a licensed a building contractor)</label>' +
                                        '<textarea id="tb_untreated_details" cols="20" rows="2"></textarea>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="row">' +
                                    '<div style=" height:12px!important"></div>' +
                                    '<div class="list-group-item"><p class="list-group-item-text report-element">7.5 Other Conditions Conducive to Timber Pest Attack</p></div>' +
                                    '<div style=" height:12px!important"></div>' +
                                    '<label>Was evidence of any other condition conducive to timber pest attack found?</label>' +
                                    '<input id="hf_othercondition_evidence" type="hidden" value="1" />' +
                                    '<div class="row">' +
                                        '<a id="btn-ccttpa-othercondition-evidence-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_othercondition_evidence\',\'ccttpa-othercondition-evidence\',\'1\',\'ccttpa-othercondition-evidence-option1\');ppstpdr_Script.hideunhide(\'othercondition_evidence_container\', 2);" class="ui-btn btn-red-click ccttpa-othercondition-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">NO</a>' +
                                        '<a id="btn-ccttpa-othercondition-evidence-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_othercondition_evidence\',\'ccttpa-othercondition-evidence\',\'2\',\'ccttpa-othercondition-evidence-option2\');ppstpdr_Script.hideunhide(\'othercondition_evidence_container\', 1);" class="ui-btn btn-white-click ccttpa-othercondition-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes - see details below</a>' +
                                        '<a id="btn-ccttpa-othercondition-evidence-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_othercondition_evidence\',\'ccttpa-othercondition-evidence\',\'3\',\'ccttpa-othercondition-evidence-option3\');ppstpdr_Script.hideunhide(\'othercondition_evidence_container\', 1);" class="ui-btn btn-white-click ccttpa-othercondition-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Undetermined - see details below</a>' +
                                    '</div>' +
                                    '<div id="othercondition_evidence_container" class="row hidden">' +
                                        '<div style=" height:12px!important"></div>' +
                                        '<div class="row">' +
                                            '<label>Details (include the location and any recommendation for further expert advice e.g. from a licensed a building contractor)</label>' +
                                            '<textarea id="tb_othercondition_details" cols="20" rows="2"></textarea>' +
                                        '</div>' +
                                        '<div class="row" style=" margin-top:15px ! important">' +
                                            '<div class="list-group-item text-element-container">' +
                                                '<h4 class="list-group-item-heading">Photos</h4>' +
                                                '<div style=" height:15px!important"></div>' +
                                                '<div style="clear:both"></div><div id="img_ccttpa_othercondition_html_list"></div><div style="clear:both"></div>' +
                                                '<div class="ui-grid-b" style=" margin-top:15px;">' +
                                                    '<div class="ui-block-a" style=" padding-right:1px;">' +
                                                        '<button class="ui-btn" onclick="unitrak_frm.clear_images_report(\'img_ccttpa_othercondition_html\')"><i class="fa fa-times"></i> Clear</button>' +
                                                    '</div>' +
                                                    '<div class="ui-block-b" style=" padding-right:1px;">' +
                                                        '<button class="ui-btn" onclick="unitrak_frm.capture_image_report(this,\'img_ccttpa_othercondition_html\')"><i class="fa fa-camera"></i> Camera</button>' +
                                                    '</div>' +
                                                    '<div class="ui-block-c" style=" padding-left:1px;">' +
                                                        '<button class="ui-btn" onclick="unitrak_frm.add_image_report(this,\'img_ccttpa_othercondition_html\')"><i class="fa fa-list"></i> Library</button>' +
                                                    '</div>' +
                                                '</div>' +
                                                '<div style="clear:both"></div><div class="file-container report-element img_ccttpa_othercondition_html" id="img_ccttpa_othercondition_html"></div><div style="clear:both"></div>' +
                                            '</div>' +                                      
                                        '</div>' +                                                
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '<div style=" height: 20px ! important"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +


                //8. Major Safety Hazards
                '<div class="row" style=" margin-bottom:5px; ">' +
                    '<div style=" margin: 5px; ">' +
                        '<div class="row">' +
                            '<table><tr><td>' +
                                '<i id="i_msh_hide" onclick="ppstpdr_Script.view_tab(\'div_msh\',\'i_msh_hide\',\'i_msh_show\',\'collapse_state_msh\', 10)" class="fa fa-plus-square fa-2x" style=" cursor: pointer"></i>' + 
                                '<i id="i_msh_show" onclick="ppstpdr_Script.hide_tab(\'div_msh\',\'i_msh_hide\',\'i_msh_show\',\'collapse_state_msh\', 10)" class="fa fa-minus-square fa-2x hidden" style=" cursor: pointer"></i>' + 
                            '</td><td>' +
                                '<h3 class="list-group-item-heading report-element"> 8. Major Safety Hazards</h3>' +
                            '</td></tr></table>' +
                        '</div>' +
                        '<div id="div_msh" class="row hidden" style=" margin-top:5px ! important">' +
                            '<div class="row">' +
                                '<label>Was evidence of any item or matter (within the Consultant’s expertise) that may constitute a present or imminent major safety hazard observed?</label>' +
                                '<input id="hf_msh_evidence" type="hidden" value="1" />' +
                                '<div class="row">' +
                                    '<a id="btn-msh-evidence-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_msh_evidence\',\'msh-evidence\',\'1\',\'msh-evidence-option1\');ppstpdr_Script.hideunhide(\'msh_evidence_container\', 2); " class="ui-btn btn-red-click msh-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No</a>' +
                                    '<a id="btn-msh-evidence-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_msh_evidence\',\'msh-evidence\',\'2\',\'msh-evidence-option2\');ppstpdr_Script.hideunhide(\'msh_evidence_container\', 1); " class="ui-btn btn-white-click msh-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes - see details below</a>' +
                                    '<a id="btn-msh-evidence-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_msh_evidence\',\'msh-evidence\',\'3\',\'msh-evidence-option3\');ppstpdr_Script.hideunhide(\'msh_evidence_container\', 1); " class="ui-btn btn-white-click msh-evidence" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Undetermined - see details below</a>' +
                                '</div>' +
                                '<div id="msh_evidence_container" class="row hidden">' +
                                    '<div style=" height:12px!important"></div>' +
                                    '<div class="row">' +
                                        '<label>Details – including the location and any recommendations for further expert advice e.g. from a licensed building contractor</label>' +
                                        '<textarea id="tb_msh_details" cols="20" rows="2"></textarea>' +
                                    '</div>' +
                                    '<div class="row" style=" margin-top:15px ! important">' +
                                        '<div class="list-group-item text-element-container">' +
                                            '<h4 class="list-group-item-heading">Photos</h4>' +
                                            '<div style=" height:15px!important"></div>' +
                                            '<div style="clear:both"></div><div id="img_msh_html_list"></div><div style="clear:both"></div>' +
                                            '<div class="ui-grid-b" style=" margin-top:15px;">' +
                                                '<div class="ui-block-a" style=" padding-right:1px;">' +
                                                    '<button class="ui-btn" onclick="unitrak_frm.clear_images_report(\'img_msh_html\')"><i class="fa fa-times"></i> Clear</button>' +
                                                '</div>' +
                                                '<div class="ui-block-b" style=" padding-right:1px;">' +
                                                    '<button class="ui-btn" onclick="unitrak_frm.capture_image_report(this,\'img_msh_html\')"><i class="fa fa-camera"></i> Camera</button>' +
                                                '</div>' +
                                                '<div class="ui-block-c" style=" padding-left:1px;">' +
                                                    '<button class="ui-btn" onclick="unitrak_frm.add_image_report(this,\'img_msh_html\')"><i class="fa fa-list"></i> Library</button>' +
                                                '</div>' +
                                            '</div>' +
                                            '<div style="clear:both"></div><div class="file-container report-element img_msh_html" id="img_msh_html"></div><div style="clear:both"></div>' +
                                        '</div>' +                                      
                                    '</div>' +                                                
                                '</div>' +
                            '</div>' +
                        '<div style=" height: 20px ! important"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +


                //Addtional Comments
                '<div class="row" style=" margin-bottom:5px; ">' +
                    '<div style=" margin: 5px; ">' +
                        '<div class="row">' +
                            '<table><tr><td>' +
                                '<i id="i_ac_hide" onclick="ppstpdr_Script.view_tab(\'div_ac\',\'i_ac_hide\',\'i_ac_show\',\'collapse_state_ac\', 12)" class="fa fa-plus-square fa-2x" style=" cursor: pointer"></i>' + 
                                '<i id="i_ac_show" onclick="ppstpdr_Script.hide_tab(\'div_ac\',\'i_ac_hide\',\'i_ac_show\',\'collapse_state_ac\', 12)" class="fa fa-minus-square fa-2x hidden" style=" cursor: pointer"></i>' + 
                            '</td><td>' +
                                '<h3 class="list-group-item-heading report-element"> Addtional Comments</h3>' +
                            '</td></tr></table>' +
                        '</div>' +
                        '<div id="div_ac" class="row hidden" style=" margin-top:5px ! important">' +
                            '<div class="row">' +
                                '<label>Comments</label>' +
                                '<textarea id="tb_ac_comment" cols="20" rows="2"></textarea>' +
                            '</div>' +
                            '<div style=" height: 20px ! important"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +


                //List Any Annexures To This Report
                '<div class="row" style=" margin-bottom:5px; ">' +
                    '<div style=" margin: 5px; ">' +
                        '<div class="row">' +
                            '<table><tr><td>' +
                                '<i id="i_annex_hide" onclick="ppstpdr_Script.view_tab(\'div_annex\',\'i_annex_hide\',\'i_annex_show\',\'collapse_state_annex\', 13)" class="fa fa-plus-square fa-2x" style=" cursor: pointer"></i>' + 
                                '<i id="i_annex_show" onclick="ppstpdr_Script.hide_tab(\'div_annex\',\'i_annex_hide\',\'i_annex_show\',\'collapse_state_annex\', 13)" class="fa fa-minus-square fa-2x hidden" style=" cursor: pointer"></i>' + 
                            '</td><td>' +
                                '<h3 class="list-group-item-heading report-element"> List Any Annexures To This Report</h3>' +
                            '</td></tr></table>' +
                        '</div>' +
                        '<div id="div_annex" class="row hidden" style=" margin-top:5px ! important">' +
                            '<div class="row">' +
                                '<label>Where applicable, include for example, any photographs, property and floor plan sketch, and any support documentation</label>' +
                                '<textarea id="tb_annex_comment" cols="20" rows="2"></textarea>' +
                            '</div>' +
                            '<div class="row" style=" margin-top:15px ! important">' +
                                '<div class="list-group-item text-element-container">' +
                                    '<h4 class="list-group-item-heading">Photos</h4>' +
                                    '<div style=" height:15px!important"></div>' +
                                    '<div style="clear:both"></div><div id="img_annex_comment_html_list"></div><div style="clear:both"></div>' +
                                    '<div class="ui-grid-b" style=" margin-top:15px;">' +
                                        '<div class="ui-block-a" style=" padding-right:1px;">' +
                                            '<button class="ui-btn" onclick="unitrak_frm.clear_images_report(\'img_annex_comment_html\')"><i class="fa fa-times"></i> Clear</button>' +
                                        '</div>' +
                                        '<div class="ui-block-b" style=" padding-right:1px;">' +
                                            '<button class="ui-btn" onclick="unitrak_frm.capture_image_report(this,\'img_annex_comment_html\')"><i class="fa fa-camera"></i> Camera</button>' +
                                        '</div>' +
                                        '<div class="ui-block-c" style=" padding-left:1px;">' +
                                            '<button class="ui-btn" onclick="unitrak_frm.add_image_report(this,\'img_annex_comment_html\')"><i class="fa fa-list"></i> Library</button>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div style="clear:both"></div><div class="file-container report-element img_annex_comment_html" id="img_annex_comment_html"></div><div style="clear:both"></div>' +
                                '</div>' +                                      
                            '</div>' +                                                
                            '<div style=" height: 20px ! important"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +


                //Conclusion
                '<div class="row" style=" margin-bottom:5px; ">' +
                    '<div style=" margin: 5px; ">' +
                        '<div class="row">' +
                            '<table><tr><td>' +
                                '<i id="i_conclusion_hide" onclick="ppstpdr_Script.view_tab(\'div_conclusion\',\'i_conclusion_hide\',\'i_conclusion_show\',\'collapse_state_conclusion\', 15)" class="fa fa-plus-square fa-2x" style=" cursor: pointer"></i>' +
                                '<i id="i_conclusion_show" onclick="ppstpdr_Script.hide_tab(\'div_conclusion\',\'i_conclusion_hide\',\'i_conclusion_show\',\'collapse_state_conclusion\', 15)" class="fa fa-minus-square fa-2x hidden" style=" cursor: pointer"></i>' + 
                            '</td><td>' +
                                '<h3 class="list-group-item-heading report-element"> Conclusion</h3>' +
                            '</td></tr></table>' +
                        '</div>' +
                        '<div id="div_conclusion" class="row hidden" style=" margin-top:5px ! important">' +
                            '<div class="row">' +
                                '<div class="list-group-item"><p class="list-group-item-text report-element">The following Timber Pest remediation actions are recommended</p></div>' +
                                '<div class="row">' +
                                    '<label>Treatment Of Timber Pest Attack is required</label>' +
                                    '<input id="hf_conclusion_ttpa_required" type="hidden" value="1" />' +
                                    '<div class="row">' +
                                        '<a id="btn-conclusion-ttpa-required-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_conclusion_ttpa_required\',\'conclusion-ttpa-required\',\'1\',\'conclusion-ttpa-required-option1\');" class="ui-btn btn-red-click conclusion-ttpa-required" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No</a>' +
                                        '<a id="btn-conclusion-ttpa-required-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_conclusion_ttpa_required\',\'conclusion-ttpa-required\',\'2\',\'conclusion-ttpa-required-option2\');" class="ui-btn btn-white-click conclusion-ttpa-required" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div style=" height:12px!important"></div>' +
                                '<div class="row">' +
                                    '<label>In addition to this Report a written subterranean termite management proposal to help manage the risk of future subterranean termite access to buildings and structures is</label>' +
                                    '<input id="hf_conclusion_written_stmp" type="hidden" value="2" />' +
                                    '<div class="row">' +
                                        '<a id="btn-conclusion-written-stmp-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_conclusion_written_stmp\',\'conclusion-written-stmp\',\'1\',\'conclusion-written-stmp-option1\');" class="ui-btn btn-white-click conclusion-written-stmp" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Recommended</a>' +
                                        '<a id="btn-conclusion-written-stmp-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_conclusion_written_stmp\',\'conclusion-written-stmp\',\'2\',\'conclusion-written-stmp-option2\');" class="ui-btn btn-red-click conclusion-written-stmp" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Not Recommended</a>' +
                                        '<a id="btn-conclusion-written-stmp-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_conclusion_written_stmp\',\'conclusion-written-stmp\',\'3\',\'conclusion-written-stmp-option3\');" class="ui-btn btn-white-click conclusion-written-stmp" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Not Applicable</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div style=" height:12px!important"></div>' +
                                '<div class="row">' +
                                    '<label>Removal Of Conditions Conducive to Timber Pest Attack is necessary</label>' +
                                    '<input id="hf_conclusion_removal_cctpa" type="hidden" value="2" />' +
                                    '<div class="row">' +
                                        '<a id="btn-conclusion-removal-cctpa-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_conclusion_removal_cctpa\',\'conclusion-removal-cctpa\',\'1\',\'conclusion-removal-cctpa-option1\');" class="ui-btn btn-white-click conclusion-removal-cctpa" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Yes</a>' +
                                        '<a id="btn-conclusion-removal-cctpa-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_conclusion_removal_cctpa\',\'conclusion-removal-cctpa\',\'2\',\'conclusion-removal-cctpa-option2\');" class="ui-btn btn-red-click conclusion-removal-cctpa" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">No</a>' +
                                        '<a id="btn-conclusion-removal-cctpa-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_conclusion_removal_cctpa\',\'conclusion-removal-cctpa\',\'3\',\'conclusion-removal-cctpa-option3\');" class="ui-btn btn-white-click conclusion-removal-cctpa" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">Not Applicable</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div style=" height:12px!important"></div>' +
                                '<div class="row">' +
                                    '<label>Due to the susceptibility of the property to sustaining Timber Pest Attack the next inspection is recommended in</label>' +
                                    '<input id="hf_conclusion_next_inspection" type="hidden" value="1" />' +
                                    '<div class="row">' +
                                        '<a id="btn-conclusion-next-inspection-option1" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_conclusion_next_inspection\',\'conclusion-next-inspection\',\'1\',\'conclusion-next-inspection-option1\');" class="ui-btn btn-red-click conclusion-next-inspection" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">1 Month</a>' +
                                        '<a id="btn-conclusion-next-inspection-option2" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_conclusion_next_inspection\',\'conclusion-next-inspection\',\'2\',\'conclusion-next-inspection-option2\');" class="ui-btn btn-white-click conclusion-next-inspection" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">2 Months</a>' +
                                        '<a id="btn-conclusion-next-inspection-option3" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_conclusion_next_inspection\',\'conclusion-next-inspection\',\'3\',\'conclusion-next-inspection-option3\');" class="ui-btn btn-white-click conclusion-next-inspection" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">3 Months</a>' +
                                        '<a id="btn-conclusion-next-inspection-option4" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_conclusion_next_inspection\',\'conclusion-next-inspection\',\'4\',\'conclusion-next-inspection-option4\');" class="ui-btn btn-white-click conclusion-next-inspection" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">6 Months</a>' +
                                        '<a id="btn-conclusion-next-inspection-option5" data-role="button" onclick="ppstpdr_Script.select_unselect(\'hf_conclusion_next_inspection\',\'conclusion-next-inspection\',\'5\',\'conclusion-next-inspection-option5\');" class="ui-btn btn-white-click conclusion-next-inspection" style=" white-space:normal; border-radius: 5px ! important; border: 1px solid #ddd !important; margin-bottom:2px ! important">12 Months</a>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                            '<div style=" height: 20px ! important"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +


                //Certification 
                '<div class="row" style=" margin-bottom:5px; ">' +
                    '<div style=" margin: 5px; ">' +
                        '<div class="row">' +
                            '<table><tr><td>' +
                                '<i id="i_cert_hide" onclick="ppstpdr_Script.view_tab(\'div_cert\',\'i_cert_hide\',\'i_cert_show\',\'collapse_state_cert\', 14)" class="fa fa-plus-square fa-2x" style=" cursor: pointer"></i>' + 
                                '<i id="i_cert_show" onclick="ppstpdr_Script.hide_tab(\'div_cert\',\'i_cert_hide\',\'i_cert_show\',\'collapse_state_cert\', 14)" class="fa fa-minus-square fa-2x hidden" style=" cursor: pointer"></i>' + 
                            '</td><td>' +
                                '<h3 class="list-group-item-heading report-element"> Certification</h3>' +
                            '</td></tr></table>' +
                        '</div>' +
                        '<div id="div_cert" class="row hidden" style=" margin-top:5px ! important">' +
                            '<div class="row">' +
                                '<div class="list-group-item"><p class="list-group-item-text report-element">This document certifies that the property described in this Report has been inspected by the Timber Pest Detection Consultant in accordance with the level of service requested by the Client and the Terms and Conditions set out in Clause A.1 of this Report, and in accordance with the current edition of the Report Systems Australia (RSA) Handbook Timber Pest Detection Reports ‘Uniform Inspection Guidelines for Timber Pest Detection Consultants’.</p></div>' +
                                '<div class="row">' +
                                    '<div class="ui-field-contain">' +
                                        '<label>Company Name</label>' +
                                        '<input type="text" id="tb_cert_company_name"/>' +
                                    '</div>' +
                                    '<div class="ui-field-contain">' +
                                        '<label>Address</label>' +
                                        '<input type="text" id="tb_cert_company_address"/>' +
                                    '</div>' +
                                    '<div class="ui-field-contain">' +
                                        '<label>Phone</label>' +
                                        '<input type="text" id="tb_cert_company_phone"/>' +
                                    '</div>' +
                                    '<div class="ui-field-contain">' +
                                        '<label>Email</label>' +
                                        '<input type="text" id="tb_cert_company_email"/>' +
                                    '</div>' +
                                    '<div class="ui-field-contain">' +
                                        '<label>Name of Consultant</label>' +
                                        '<input type="text" id="tb_cert_consulatant"/>' +
                                    '</div>' +
                                    '<div class="ui-field-contain">' +
                                        '<label><label>Date</label></label>' +
                                        '<input type="text" id="tb_cert_date"/>' +
                                    '</div>' +
                                '</div>' +
                                '<div style=" height:12px!important"></div>' +
                                '<div class="row">' +
                                    '<div id="cert_sig"></div>' +
                                '</div>' +
                            '</div>' +
                            '<div style=" height: 20px ! important"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +


                        '<div class="ui-grid-a" style=" margin-top:2px;">' +
                            '<div class="ui-block-a" style=" padding-right:1px;">' +
                                '<a href="#" class="ui-btn" onclick="jobeditpage.viewjobreport();" style=" border-radius:5px! important; "><i class="fa fa-ban"></i> Close</a>' +
                            '</div>' +
                            '<div class="ui-block-b" style=" padding-left:1px;">' +
                                '<a href="#" onclick="ppstpdr_Script.save_all();" class="ui-btn" style=" border-radius:5px! important; "><i class="fa fa-save"></i> Save</a>' +
                            '</div>' +
                        '</div>' +

            '</div>';

            $('.panel-form-data').html(template).trigger("create");
            $('#hf_stpdr_report_id').val(id);
            $('#hf_stpdr_job_id').val(job_id);

            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                    }
                    else {
                        ppstpdr_Script.get_all_stpdr_info(id, job_id);
                    }
                }
            );

            
        },
        init: function () {
        }
    }
}();


$(document).ready(function () {
    ppstpdr_Script.init();
});

