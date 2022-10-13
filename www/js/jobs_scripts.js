var jobsms = (function () {
    return {
        showsms: function (job_id) {
            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        unitrak_mobile.showErrorMessage('Offline mode does not support sms feature!');
                    }
                    else {
                        $('#jobpage-footer-main').hide();
                        $('#jobs_sms').removeClass("hidden");
                        $('#jobpage-user-main-content').hide();
                        $('#hf_jobid_sms').val(job_id); 7
                        jobsms.getjobdetails(job_id);
                    }
                });
        },
        hidesms: function () {
            $('#jobpage-footer-main').show();
            $('#jobs_sms').addClass("hidden");
            $('#jobpage-user-main-content').show();
        },
        getjobdetails: function (job_id) {
            _ui.loading(true);
            var user = localdb.getUser();

            var model = {
                action: 'getjobforsms',
                CompanyId: user.company_id,
                UserId: user.id,
                job_id: job_id
            };

            unitrak_api.ajax('/sms/get/' + user.token + '/', model,
                function (data) {
                    console.log(data[0]);
                    $('#sms-cusname').html(data[0].cusname);
                    $('#tb_sms_job').html(data[0].jobdescription.replace(new RegExp("<br/>", 'g'), "\n"));
                    $('#hf_cusid_sms').val(data[0].cusid);
                    jobsms.getllacontact();

                    _ui.loading(false);
                }, function (err) {
                    unitrak_mobile._showError(err);
                    _ui.loading(false);
                    console.log(err.responseText);
                });
        },
        getllacontact: function (cusid) {
            var cusid = $('#hf_cusid_sms').val();

            var _cb_all = $('#cb_checkall_job').is(':checked');
            var tmpl = '{{#contacts}}<tr class="odd gradeX"><td><input type="checkbox" id="cb_js_{{id}}" onchange="jobsms.calcsmscontact(this.id,{{id}})" /> {{name}} ({{mobile}})</td></tr>{{/contacts}}';

            if (_cb_all) {
                tmpl = '{{#contacts}}<tr class="odd gradeX"><td><input type="checkbox" id="cb_js_{{id}}" onchange="jobsms.calcsmscontact(this.id,{{id}})" checked="checked" /> {{name}} ({{mobile}})</td></tr>{{/contacts}}';
            }

            _ui.loading(true);
            var user = localdb.getUser();

            var model = {
                action: 'getsmscustomercontactlist',
                CompanyId: user.company_id,
                UserId: user.id,
                customer_id: cusid
            };


            unitrak_api.ajax('/sms/get/' + user.token + '/', model,
                function (data) {
                    console.log(data);
                    if (data.length > 0) {
                        var html = kite(tmpl, { contacts: data });
                        $('table#contact-list-job tbody').html(html);
                        $('#lstListBox_job').empty();

                        if (_cb_all) {
                            for (i = 0; i < data.length; i++) {
                                var opt = document.createElement("option");
                                document.getElementById("lstListBox_job").options.add(opt);
                                opt.text = data[i].id;
                                opt.value = data[i].id;
                            }
                        }
                    }
                    else {
                        $('table#contact-list-job tbody').html("Contact(s) Has No Mobile # ");
                    }

                    _ui.loading(false);
                }, function (err) {
                    unitrak_mobile._showError(err);
                    _ui.loading(false);
                    console.log(err.responseText);
                });
        },
        calcsmscontact: function (el, id) {
            var el_cb = $('#cb_js_' + id).is(':checked');
            if (el_cb) { //true
                var opt = document.createElement("option");
                document.getElementById("lstListBox_job").options.add(opt);
                opt.text = id;
                opt.value = id;
                flag = false;
            }
            else {
                $("#lstListBox_job option[value='" + id + "']").remove();
            }
        },
        _calcCon: function () {
            var _concount = $('#lstListBox_job option').length;
            var a = new Array();
            for (var i = 0; i < _concount; i++) {
                var bp = {};
                var _conID = document.getElementById("lstListBox_job").options[i].value;
                bp.ID = _conID;
                a.push(bp);
            }
            return a;
        },
        sendsms_job: function () {
            var _cusid = $('#hf_cusid_sms').val();
            var _job_id = $('#hf_jobid_sms').val();


            var _contactcount = $('#lstListBox_job option').length;
            var _smsmsg = $('#tb_sms_job').val();
            if (_smsmsg == "") {
                unitrak_mobile._showMessage('Please enter message...');
                return;
            }

            var rcontact = {};
            rcontact.list = jobsms._calcCon();
            //console.log(rcontact.list);

            //console.log(_contactcount);
            if (_contactcount == 0) {
                unitrak_mobile._showMessage('Please select contact...');
                return;
            }

            var user = localdb.getUser();
            var model = {
                userid: user.id,
                CompanyId: user.company_id,
                //sendtomobilenumber: sendto,
                //sendusingmobilenumber: sendusingmobilenumber,
                message: _smsmsg,
                contacts: rcontact.list,
                othernumber: rcontact.listON,
                job_id: _job_id
            };
            console.log(model);

            $.mobile.loading("show");

            var uri = '/sms/PostSMS_Job/' + user.token + '/'
            unitrak_api.ajax_post(uri, model,
                function (data) {
                    $('#jobpage-footer-main').show();
                    unitrak_mobile._showMessage('SMS Successfully Sent!');
                    jobsms.hidesms();
                    $.mobile.loading("hide");
                }, function (err) {
                    unitrak_mobile._showError(err);
                });
        },
    }
}());


var jobpage = (function () {
    return {
        loadiframelink: function (job_id) {
            var user = localdb.getUser();

            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        sql_offline.load_offline_newinvoice(job_id);
                    }
                    else {
                        var uri = '/unitrakjobs/get/' + user.token + '/'
                        unitrak_api.ajax(uri, { user_id: user.id, company_id: user.company_id, job_id: job_id, action: 'get-invoice-forpayment' }, function (data) {
                            //console.log(data);

                            $("#jobpage-cusname").html(data.customerName);
                            $("#jobpage-invoice").html(data.prefix + data.invoiceId);
                            $("#jobpage-jobdate").html(data.jobDate);
                            $("#jobpage-description").html(data.description);
                            $("#jobpage-amount").html(data.amount.toFixed(2));
                            $("#jobpage-payment").html(data.payment);
                            $("#jobpage-total").html(data.bal);

                            if (data.bal == 0) {
                                $('#jobpage-footer-payment').hide();
                                //$('#jobpage-footer-addinvoice').hide();
                                $('#jobpage-footer-receipt').show();
                                $('#fullypaid').show();
                                $('#rwithbalancepaid').hide();
                                job.canceladdinvoice();
                                jobpage.showjobschedule('today');
                            }

                            $.mobile.loading("hide");
                        }, function (err) {
                            unitrak_mobile._showError(err);
                        });
                    }
                });

        },
        loadtodaysdate: function () {
            var date = new Date()
            var month = date.getMonth() + 1;
            if (month.toString().length == 1) {
                month = "0" + month;
            }
            var day = date.getDate();
            if (day.toString().length == 1) {
                day = "0" + day;
            }
            $('#tb_datecreated_cd').val(day + "/" + month + "/" + date.getFullYear());
            $('#tb_datecreated_cd').datepicker({ dateFormat: 'dd/mm/yy' });

        },
        updatejobnote: function () {
            $.mobile.loading("show");
            var user = localdb.getUser();
            if (user.id > 0) {
                var uri = '/unitrakjobs/get/' + user.token + '/'
                unitrak_api.ajax(uri, { user_id: user.id, company_id: user.company_id, action: 'check_authentication' }, function (data) {
                    if (data == "OK") {

                        var jnote = $("#textarea-jobins-jobs").val();
                        if (jnote.length < 1) {
                            jnote = "None";
                        }
                        var jobID = $("#hfseljobID").val();
                        var model = {
                            token: user.token,
                            company_id: user.company_id,
                            user_id: user.id,
                            jobID: jobID,
                            instructions: jnote,
                            blank: "blank",
                        };

                        var uri = '/unitrakjobs/PostUpdateJobInstruction/' + user.token + '/'
                        unitrak_api.ajax_post(uri, model,
                            function (data) {

                                $('#jobpage-user-main-content').removeClass('hidden');
                                $('#edit_jobnote_jobs').addClass('hidden');
                                $('#jobpage-footer').removeClass('hidden');

                                jobpage.showjobschedule('today');
                            }, function (err) {
                                unitrak_mobile._showError(err);
                            });
                    }
                    else {
                        localdb.logoff();
                    }

                    $.mobile.loading("hide");
                }, function (err) {
                    unitrak_mobile._showError(err);
                });
            }
        },
        canceleditjobnote: function () {
            $('#jobpage-user-main-content').removeClass('hidden');
            $('#edit_jobnote_jobs').addClass('hidden');
            $('#jobpage-footer').removeClass('hidden');

        },
        deleteschedule: function (flag) {
            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        unitrak_mobile.showErrorMessage('Offline mode does not support this feature at the moment!');
                    }
                    else {
                        $.mobile.loading("show");
                        $('#unlock_html').empty("");
                        var user = localdb.getUser();
                        if (user.id > 0) {
                            var jobID = $('#hfseljobID').val();
                            var schedID = $('#hfselschedID').val();
                            var uri = '/unitrakjobs/get/' + user.token + '/'
                            unitrak_api.ajax(uri, { user_id: user.id, company_id: user.company_id, action: 'canaddinvoice', job_id: jobID }, function (data) {
                                if (data == false) {
                                    var model = {
                                        token: user.token,
                                        user_id: user.id,
                                        company_id: user.company_id,
                                        job_id: jobID,
                                        schedID: schedID,
                                        blank: ""
                                    };

                                    var uri = '/unitrakjobs/delschedule/' + user.token + '/'
                                    unitrak_api.ajax_post(uri, model,
                                        function (data) {
                                            $('#edit_jobnote_jobs').hide();
                                            $('#main_content_jobs').show();
                                            jobpage.showjobschedule('today');

                                            $.mobile.loading("hide");
                                        }, function (err) {
                                            unitrak_mobile._showError(err);
                                        });

                                }
                                else {
                                    unitrak_mobile._showMessage("Cannot delete schedule with invoice.");
                                }

                                $.mobile.loading("hide");
                            }, function (err) {
                                unitrak_mobile._showError(err);
                            });
                        }
                    }
                });
        },
        editjobnote: function () {
            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        unitrak_mobile.showErrorMessage('Offline mode does not support this feature at the moment!');
                    }
                    else {
                        $.mobile.loading("show");
                        $('#jobpage-user-main-content').addClass('hidden');
                        $('#edit_jobnote_jobs').removeClass('hidden');
                        $('#jobpage-footer').addClass('hidden');

                        var schedID = $('#hfselschedID').val();
                        var jobID = $('#hfseljobID').val();
                        var user = localdb.getUser();
                        if (user.id > 0) {
                            var uri = '/unitrakjobs/get/' + user.token + '/'
                            unitrak_api.ajax(uri, { user_id: user.id, company_id: user.company_id, action: 'getjobins', job_id: jobID }, function (data) {
                                $('#textarea-jobins-jobs').val(data);
                                $('#unlock_html').empty("");
                                $.mobile.loading("hide");
                            }, function (err) {
                                unitrak_mobile._showError(err);
                            });
                        }
                    }
                });
        },
        showjobschedule: function (type) {
            schedule.get_user_jobslist(type, function (data) {
                var norecord = '' +
                '<ul data-role="listview" data-inset="true" class="ui-listview ui-listview-inset ui-corner-all ui-shadow">' +
                    '<li data-role="list-divider" data-theme="a" data-swatch="a" data-form="ui-bar-a" role="heading" class="ui-li-divider ui-bar-a ui-first-child">' +
                        '<p style=" white-space:normal; margin: 0 0 ! important; font-weight: bold"> <strong>No Job Schedule Found</strong></p>' +
                    '</li>' +
                    '<li data-form="ui-body-a" data-swatch="a" data-theme="a" class="ui-li-static ui-body-a">' +
                    '</li>' +
                '</ul>';

                if (data.length == 0) { $('#joblist-schedule').html(norecord); } else { $('#joblist-schedule').html(data); }
                //$('#joblist-schedule').listview('refresh');
                _ui.loading(false);
                $.mobile.loading("hide");
                console.log("done");

                 sql_offline.get_imode_callback(
                     function (status) {
                         if (status == 1) { //offline
                             _ui.showonlinemenu(1);
                //             sql_offline.upadatejobfortimer_offline();
                             _ui.loading(false);
                         }
                         else {
                //             var inv_list_ctr = $('#hf_invidlist_ctr').val();
                //             for (i = 1; i <= inv_list_ctr; i++) {
                //                 var _inv = $('#hf_invidlist_' + i).val();
                //                 sql_offline.get_jobinvoice_data(_inv);
                //             }
                         }

                     }
                 );

            });
        },
        sendJobEmail: function () {

            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        unitrak_mobile.showErrorMessage('Offline mode does not support this email feature at the moment!');
                        $.mobile.loading("hide");
                        return;
                    }
                }
            );

            var pfx = _ui.calc_prefix();
            var email = {
                refNumber: $('#' + pfx + 'email-ref-number').val(),
                job_id: $('#' + pfx + 'email-job-id').val(),
                to: $('#' + pfx + 'email-to-email').val(),
                toName: $('#' + pfx + 'email-to-name').attr('data-contactName'),
                from: "",
                //cc: $('#jobs-email-cc').val(),
                cc: '',
                subject: $('#' + pfx + 'email-subject').val(),
                message: $('#' + pfx + 'email-body').val(),
                //sendBtn: '#' + pfx + 'email-send-button',
                //closeBtn: '#' + pfx + 'email-close-button'
            };

            if(pfx == 'jobs-') {
                unitrak_mobile_ui.sendjobemail(email, function () {
                    //intentionally left emtpy.
                });
            }
            else if(pfx == 'edit-job-') {
                var email_type = $('#hf_email_type').val();
                if(email_type == 1){
                    unitrak_mobile_ui.sendjobemail(email, function () {
                        //intentionally left emtpy.
                    });
                }
                else{
                    jobpage.sendJobEmailWD();
                }
            }
            
        },
        sendJobEmailWD: function () {

            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        unitrak_mobile.showErrorMessage('Offline mode does not support this email feature at the moment!');
                        $.mobile.loading("hide");
                        return;
                    }
                }
            );

            var pfx = _ui.calc_prefix();
            var job_id = 0;
            emaillist = "";
            emailsubject = "";
            emailbody = "";

            if(pfx == 'jobs-'){
                job_id = $('#hfseljobID').val();
                emaillist = $('#' + pfx + 'email-to-email').val();
                emailsubject = $('#' + pfx + 'email-subject').val();
                emailbody = $('#' + pfx + 'email-body').val();
            }      
            else if(pfx == 'edit-job-') {
                job_id = unitrak_mobile.get_query_string_value('id');
                emaillist = $('#' + pfx + 'email-to-email').val();
                emailsubject = $('#' + pfx + 'email-subject').val();
                emailbody = $('#' + pfx + 'email-body').val();                
            } 

            var email = {
                job_id: job_id,
                emaillist: emaillist,
                emailsubject: emailsubject,
                emailbody: emailbody,
            };

            var type = $('#hf_isreceipt').val();
            if(type == 1){
                unitrak_mobile_ui.sendinvoiceemailWD(email, function () {
                    //intentionally left emtpy.
                });
            }
            else{
                unitrak_mobile_ui.sendinvoiceemailWDReceipt(email, function () {
                    //intentionally left emtpy.
                });
            }
        },
        loadmarkjobcompletedata: function () {
            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        unitrak_mobile.showErrorMessage('Offline mode does not support this feature at the moment!');
                    }
                    else {

                        $.mobile.loading("show");
                        var user = localdb.getUser();
                        $('#markcomplete').removeClass('hidden');
                        $('#jobpage-footer').addClass('hidden');
                        $('#jobpage-user-main-content').hide();
                        $('#jobpage-user-main-content').addClass('hidden');

                        $('#schedule_addinvoice_confirmation_jobs').addClass('hidden');
                        $('#jobpage-footer').removeClass('hidden');
                        $('#jobpage-user-main-content').removeClass('hidden');

                        $('#jobpage-adinvoice').hide();
                        $('#jobpage-footer-main').show();
                        //$('#jobpage-footer-addinvoice').hide();
                        $('#jobpage-footer-receipt').hide();
                        $('#jobpage-footer-payment').hide();

                        var job_id = $('#hfseljobID').val();

                        if (user.id > 0) {
                            var uri = '/unitrakjobs/get/' + user.token + '/'
                            unitrak_api.ajax(uri, { user_id: user.id, company_id: user.company_id, action: 'jobinvoice-list', job_id: job_id }, function (data) {

                                if (data == "true") {
                                    $('#invoice_div').hide();
                                }
                                else {
                                    $('#invoice_div').show();
                                }

                                var uri = '/unitrakjobs/get/' + user.token + '/'
                                unitrak_api.ajax(uri, { user_id: user.id, company_id: user.company_id, action: 'getjob', job_id: job_id }, function (data) {
                                    $("#tb_datecreated_mc").text(data.jobdate_shortstring);
                                    $("#hf_mc_jobno").val(data.id);
                                    $("#tb_mcjobno").text("Job #: " + data.id);

                                    $.mobile.loading("hide");
                                }, function (err) {
                                    unitrak_mobile._showError(err);
                                });

                                $.mobile.loading("hide");
                            }, function (err) {
                                unitrak_mobile._showError(err);
                            });
                        }

                    }
                });
        },
    }
}());

var jobfiles = (function () {
    return {
        add_image: function () {
            jobfiles.cancelview();
            var job_id = unitrak_mobile.get_query_string_value('id');
            var user = localdb.getUser();
            var width = 450, height = 600;

            window.imagePicker.getPictures(
                function (results) {
                    for (var i = 0; i < results.length; i++) {
                        var tmpl = '<div class="img-upload pull-left" id="' + i + '_' + job_id + '" style="padding:5px 1px;"><img id="img_' + i + '_' + job_id + '" class="job-image-element" src="' + results[i] + '" alt="" style="width:140px;height:200px"/></div>';

                        var tmpl_large = '<div class="img-upload_large pull-left" id="' + i + '_' + job_id + '" style="padding:5px 1px;"><img id="img_' + i + '_' + job_id + '" class="job-image-element" src="' + results[i] + '" alt="" style="width:740px;height:800px"/></div>';

                        $('#imgfile_load').prepend(tmpl);
                        $('#imgfile_load_large').prepend(tmpl_large);
                        console.log('Image URI: ' + results[i]);
                        console.log(tmpl);

                    }

                    var imgconut = $('#imgfile_load img').length;
                    if (imgconut > 0) {
                        $('#img_btn').removeClass('hidden');
                    }
                    //$('#0_' + elid).after('<div class="clearfix"></div>');

                }, function (error) {
                    console.log('Error: ' + error);
                }, {
                    width: width,
                    height: height
                }
            );

        },
        capture_image: function () {
            jobfiles.cancelview();
            var job_id = unitrak_mobile.get_query_string_value('id');
            var user = localdb.getUser();
            navigator.camera.getPicture(function (fileURI) {
                var i = $('#imgfile_load img').length;
                var tmpl = '<div class="img-upload pull-left" id="' + i + '_' + job_id + '"  style="padding:5px 1px;"><img class="job-image-element" src="' + fileURI + '" alt="" style="width:140px;height:200px"/></div>';
                var tmpl_large = '<div class="img-upload_large pull-left" id="' + i + '_' + job_id + '"  style="padding:5px 1px;"><img class="job-image-element" src="' + fileURI + '" alt="" style="width:740px;height:800px"/></div>';

                $('#imgfile_load').prepend(tmpl);
                $('#imgfile_load_large').prepend(tmpl_large);
                console.log('Image URI: ' + fileURI);

                $('#img_btn').removeClass('hidden');

            }, function (err) {
                console.log(err);
                _ui.alert(err.message);
            }, {
                    quality: 75,
                    targetWidth: 540,
                    targetHeight: 600,
                    destinationType: Camera.DestinationType.FILE_URI
                });

        },
        calcelupload: function () {
            jobfiles.cancelview();
            $('#imgfile_load').html('');
            $('#imgfile_load_large').html('');
            $('#img_btn').addClass('hidden');
        },
        execute_file_upload: function (type) {
            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        unitrak_mobile.showErrorMessage('Offline mode does not support catch and sync image!');
                    }
                    else {
                        $.mobile.loading("show");
                        var i = $('div#imgfile_load img').length;
                        var _counter = 1;
                        __ui.alert('Uploading Image...');
                        $('#imgfile_load_large img').each(function (i, v) {
                            var id = $(this).attr('id');
                            var fileUri = $(this).attr('src');
                            _form_manager.event.show_processing();
                            jobfiles.uploadFile(id, type, fileUri, _counter, function (ret) {
                                console.log('File Successfully Uploaded!');
                                __ui.alert('Image Successfully Uploaded. Please wait for few seconds to sync.');
                            });
                            _counter = _counter + 1;
                        });
                        $.mobile.loading("hide");
                        $('#imgfile_load').html('');
                        $('#imgfile_load_large').html('');
                        $('#img_btn').addClass('hidden');
                        $('#img_filename').val('');
                        $('#image-jobfile-description').val('');
                    }
                });
        },
        uploadFile: function (id, type, fileURI, counter, callback) {
            var user = localdb.getUser();
            var job_id = $('#hf_job_id').val();
            var img_filename = fileURI.substr(fileURI.lastIndexOf('/') + 1);
            var filename = $('#img_filename').val();
            if (filename == "") { filename = fileURI.substr(fileURI.lastIndexOf('/') + 1); }
            var description = $('#image-jobfile-description').val();
            //var img_count = $('div#imgfile_load img').length;
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            options.params = {
                token: user.token,
                user_id: user.user_id,
                job_id: job_id,
                company_id: user.company_id,
                name: img_filename,
                filename: filename,
                description: description,
                count: counter,
                type: type
            };

            console.log(options.params);

            if (isNaN(options.params.job_id)) options.params.job_id = 0;
            try {
                var ft = new FileTransfer();
                console.log('Uploading image file...');
                var _apiURI = 'https://api2.unitrak.com.au/api';
                ft.upload(fileURI, encodeURI(_apiURI + '/File/PostJobFileData'),
                    function (r) {
                        jobfiles.get_images();
                        jobfiles.get_docs();
                        if (callback) callback();
                    },
                    function (err) {
                        var msg = _ui.call_error_message(e);
                        //console.log('Error uploading image: ' + msg);
                    }, options);

                ft.onprogress = function (progressEvent) {
                    //perc = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
                    //$('#upload_info_' + el_id).html('Uploading: ' +(perc +1) +' %');
                }

            } catch (e) {
                var msg = _ui.call_error_message(e);
                console.log('uploadFile -  FileTransfer Error: ' + msg);
            }

        },
        get_images: function () {
            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        unitrak_mobile.showErrorMessage('Offline mode does not support catch and sync image!');
                    }
                    else {
                        jobfiles.cancelview();
                        _ui.loading(true);
                        var job_id = unitrak_mobile.get_query_string_value('id');
                        var user = localdb.getUser();
                        unitrak_api.ajax('/unitrakjobs/get/' + user.token + '/', { user_id: user.id, company_id: user.company_id, job_id: job_id, action: 'job-images' },
                            function (data) {
                                var tmpl = '{{#img}}' +
                                    '<div class="pull-left" style="padding:5px 1px; width: 150px ! important; text-align: center">' +
                                    '<img class="job-image-element" src="{{path}}{{filename}}" alt="" style="width:140px;height:200px"/>' +
                                    '<div><a class="ui-btn" onclick="jobfiles.vieweditimage({{id}},\'{{path}}{{filename}}\',\'{{description}}\')" style=" font-size:14px; font-weight:normal">View</a></div>' +
                                    '</div>' +
                                    '{{/img}}';
                                var html = kite(tmpl, { img: data });
                                $('#jobfile-images').html(html);

                            }, function (err) {
                            }, function () {
                                _ui.loading(false);
                            })
                    }
                });
        },
        vieweditimage: function (id, path, description) {
            var tmpl = '<div class="row">' +
                '<img src="' + path + '" style="width:100%;border:0;"/><br/>' +
                '<div id="text_descriptionin_' + id + '">' + description + '</div>' +
                '<textarea id="ta_description' + id + '" style="width:99%; display:none" name="imgdescription' + id + '" id="imgdescription' + id + '">' + description + '</textarea></div></a>' +

                ' <div class="ui-grid" style=" margin-top:2px;">' +
                '<div class="ui-block-a" style=" padding-right:1px;">' +
                '<a class="ui-btn" onclick="jobfiles.cancelview()" style=" font-size:14px; font-weight:normal"><i class="lIcon fa fa-ban"></i> Back</a>' +
                '</div>' +
                '<div class="ui-block-b" style=" padding-left:1px;">' +
                '<a id="editimgdescription' + id + '" class="ui-btn" onclick="jobfiles.editjobimageissue(' + id + ')" style=" font-size:14px; font-weight:normal"><i class="fa fa-pencil"></i> Edit Description</a>' +
                '<a id="saveimgdescription' + id + '" class="ui-btn" onclick="jobfiles.updatejobimageissue(' + id + ')" style="  display:none; font-size:14px; font-weight:normal"><i class="fa fa-save"></i> Update Description</a>' +
                '</div>' +
                '<div class="ui-block-c" style=" padding-left:1px;">' +
                '<a id="deleteimgdescription' + id + '" class="ui-btn" onclick="jobfiles.deletejobimageissue(' + id + ')" style=" font-size:14px; font-weight:normal"><i class="lIcon fa fa-trash-o"></i> Delete</a>' +
                '</div>' +
                '</div>' +
                '</div>';

            $('#jobfile-image-view').html(tmpl);
            $('#jobfile-image-view').removeClass('hidden');
            $('#jobfile-image-list').addClass('hidden');
        },
        cancelview: function () {
            $('#jobfile-image-view').addClass('hidden');
            $('#jobfile-image-list').removeClass('hidden');
        },
        deletejobimageissue: function (id) {
            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        unitrak_mobile.showErrorMessage('Offline mode does not support catch and sync image!');
                    }
                    else {
                        $.mobile.loading("show");
                        var user = localdb.getUser();
                        var job_id = $('#hf_job_id').val();
                        var model = {
                            company_id: user.company_id,
                            job_id: job_id,
                            user_id: user.id,
                            id: id,
                            blank: ""
                        };

                        var uri = '/unitrakjobs/PostDeleteJobImage/' + user.token + '/'
                        unitrak_api.ajax_post(uri, model,
                            function (data) {
                                $('#ta_description' + id).hide();
                                $('#text_description' + id).show();
                                $('#saveimgdescription' + id).hide();
                                $('#editimgdescription' + id).show();
                                $('#deleteimgdescription' + id).show();

                                jobfiles.get_images();
                                jobfiles.cancelview();

                                $.mobile.loading("hide");
                            }, function (err) {
                                unitrak_mobile._showError(err);
                            });
                    }
                });
        },
        editjobimageissue: function (id) {
            $('#ta_description' + id).show();
            $('#text_description' + id).hide();
            $('#saveimgdescription' + id).show();
            $('#editimgdescription' + id).hide();
            $('#deleteimgdescription' + id).hide();
        },
        updatejobimageissue: function (id) {
            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        unitrak_mobile.showErrorMessage('Offline mode does not support catch and sync image!');
                    }
                    else {
                        $.mobile.loading("show");
                        var user = localdb.getUser();
                        var job_id = $('#hf_job_id').val();
                        var decription = $('#ta_description' + id).val();
                        var model = {
                            company_id: user.company_id,
                            job_id: job_id,
                            user_id: user.id,
                            id: id,
                            decription: decription,
                            blank: ""
                        };

                        console.log(model);

                        var uri = '/unitrakjobs/PostUpdateJobImageDescription/' + user.token + '/'
                        unitrak_api.ajax_post(uri, model,
                            function (data) {
                                $('#ta_description' + id).hide();
                                $('#text_description' + id).show();
                                $('#saveimgdescription' + id).hide();
                                $('#editimgdescription' + id).show();
                                $('#deleteimgdescription' + id).show();

                                jobfiles.get_images();

                                $.mobile.loading("hide");
                            }, function (err) {
                                unitrak_mobile._showError(err);
                            });
                    }
                });
        },
        get_docs: function () {
            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        unitrak_mobile.showErrorMessage('Offline mode does not support catch and sync image!');
                    }
                    else {
                        var job_id = unitrak_mobile.get_query_string_value('id');
                        var user = localdb.getUser();
                        unitrak_api.ajax('/unitrakjobs/GetDocFiles/' + user.token + '/', { user_id: user.id, company_id: user.company_id, job_id: job_id },
                            function (data) {
                                console.log(data);

                                var pretmpl = '<tbody style=" cursor: pointer;" >';
                                var posttmpl = '</tbody>';

                                var tmpl = '{{#doc}}' +
                                    '<tr style="margin: 0; padding: 5px 8px; cursor: pointer;">' +
                                    '<td style="width:60%">' +
                                    '<div class="ui-corner-all custom-corners" style=" margin-top:10px;">' +
                                    '<div class="ui-body ui-body-a">' +
                                    '<div class="row">' +
                                    '<div style="padding:5px 1px;">' +
                                    '<div class=row">' +
                                    '<label>Name: {{file_name}}</label>' +
                                    '</div>' +
                                    '<div><a class="ui-btn" onclick="jobfiles.downloadFile({{id}},\'{{filePath}}\', \'{{file_name}}\')" style=" font-size:14px; font-weight:normal">Download</a></div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</td>' +
                                    '</tr>' +

                                    '{{/doc}}';

                                var html = kite(tmpl, { doc: data });
                                $('#jobdocfile-images').html(pretmpl + html + posttmpl);

                            }, function (err) {
                            }, function () {
                                _ui.loading(false);
                            })
                    }
                });
        },
        downloadFile: function (id, filepath, filename) {

            var user = localdb.getUser();
            var job_id = $('#hf_job_id').val();
            var uri = '/unitrakjobs/GetPostFileToServer/' + user.token + '/'
            unitrak_api.ajax(uri, { user_id: user.id, company_id: user.company_id, id: id }, function (data) {
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                    function (fs) {
                        fs.root.getFile(
                            "tmp.html",
                            { create: true, exclusive: false },
                            function (tmp) {
                                var path = tmp.toURL().replace("tmp.html", "");
                                tmp.remove();
                                var mimetype = iosfs.calcmimetype(data);
                                var fileURL = path + data;
                                var fileTransfer = new FileTransfer();
                                var reqFile = 'https://api2.unitrak.com.au/assets/downloads/company/' + user.company_id + '/' + data;
                                fileTransfer.download(reqFile, fileURL,
                                    function (entry) {
                                        console.log('test');
                                        unitrak_mobile.showMessage('Select an Application to Open this File.');
                                        cordova.plugins.fileOpener2.open(entry.toURI(), mimetype);
                                        _ui.loading(false);
                                    },
                                    function (err) {
                                        _ui.loading(false);
                                        unitrak_mobile.showErrorMessage("Error: Code: " + err.code + ' Source:' + err.source);
                                    });
                            }, iosfs._fail);
                    },
                    iosfs._fail);


            }, function (err) {
                unitrak_mobile._showError(err);
            });


        },
        init: function () {
            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) {}
                    else {
                        jobfiles.get_images();
                        jobfiles.get_docs();
                    }
                });
        },
    };
}());


var iosfs = (function () {
    return {
        calcmimetype: function (data) {
            var type = data.split('.')[1];
            if (type == 'doc' || type == 'docx')
                return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            else if (type == 'jpeg' || type == 'jpg' || type == 'gif' || type == 'png')
                return 'image/jpeg';
            else if (type == 'xls' || type == 'xlsx')
                return 'application/vnd.ms-excel';
            else if (type == 'txt' || type == 'rtf')
                return 'text/plain';
            else if (type == 'xml' || type == 'html')
                return 'text/html';
            else
                return 'application/pdf';
        },
        openpdf: function (pdf) {
            cordova.plugins.fileOpener2.open(
                pdf,
                'application/pdf',
                {
                    error: function (e) {
                        unitrak_mobile.showErrorMessage('Error status: ' + e.status + ' - Error message: ' + e.message);
                    },
                    success: function () {
                        //unitrak_mobile.showErrorMessage('file opened successfully');
                    }
                });
        },
        download: function (uri, callback) {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                function (fs) {
                    fs.root.getFile(
                        "tmp.html", { create: true, exclusive: false },
                        function (tmp) {
                            var path = tmp.toURL().replace("tmp.html", "");
                            var ft = new FileTransfer();
                            tmp.remove();
                            ft.download(
                                uri, path + "temp_1.pdf",
                                function (resfile) {
                                    //unitrak_mobile.showErrorMessage("download complete: " + resfile.toURI());
                                    callback(resfile.toURI());
                                },
                                function (error) {
                                    unitrak_mobile.showErrorMessage("Download Error: " + error.body + "<br/> Source "
                                        + error.source + "<br/>Target: " + error.target + "<br/>Code: " + error.code);
                                });
                        }, iosfs._fail);
                }, iosfs._fail);
        },
        _fail: function (err) {
            unitrak_mobile.showErrorMessage(err);
        },
    }
}());

var treated_areas = (function () {
    return {
        check_is_indoor: function () {
            var ischeck = $('#cb_indoor').is(':checked');
            if (ischeck == true) {
                $('#div_indoor_area').removeClass('hidden');
            }
            else {
                $('#div_indoor_area').addClass('hidden');
            }
        },
        check_is_outdoor: function () {
            var ischeck = $('#cb_outdoor').is(':checked');
            if (ischeck == true) {
                $('#div_outdoor_area').removeClass('hidden');
            }
            else {
                $('#div_outdoor_area').addClass('hidden');
            }
        },
        check_indoor_area_others: function () {
            var ischeck = $('#cb_ia_others').is(':checked');
            if (ischeck == true) {
                $('#div_ia_others').removeClass('hidden');
            }
            else {
                $('#div_ia_others').addClass('hidden');
            }
        },
        check_indoor_pest_others: function () {
            var ischeck = $('#cb_iap_others').is(':checked');
            if (ischeck == true) {
                $('#div_iap_others').removeClass('hidden');
            }
            else {
                $('#div_iap_others').addClass('hidden');
            }
        },
        check_indoor_equipment_others: function () {
            var ischeck = $('#cb_iae_others').is(':checked');
            if (ischeck == true) {
                $('#div_iae_others').removeClass('hidden');
            }
            else {
                $('#div_iae_others').addClass('hidden');
            }
        },
        check_outdoor_area_others: function () {
            var ischeck = $('#cb_oa_others').is(':checked');
            if (ischeck == true) {
                $('#div_oa_others').removeClass('hidden');
            }
            else {
                $('#div_oa_others').addClass('hidden');
            }
        },
        check_outdoor_pest_others: function () {
            var ischeck = $('#cb_oap_others').is(':checked');
            if (ischeck == true) {
                $('#div_oap_others').removeClass('hidden');
            }
            else {
                $('#div_oap_others').addClass('hidden');
            }
        },
        check_outdoor_equipment_others: function () {
            var ischeck = $('#cb_oae_others').is(':checked');
            if (ischeck == true) {
                $('#div_oae_others').removeClass('hidden');
            }
            else {
                $('#div_oae_others').addClass('hidden');
            }
        },
        addpesticide_indoor: function (type) {
            var user = localdb.getUser();
            var pesticide_id = 0;
            if (type == 1) {
                pesticide_id = $('#ddl_pesticidelist_i').val();
            }
            else {
                pesticide_id = $('#ddl_pesticidelist_o').val();
            }

            if (pesticide_id > 0) {

                var uri = '/unitrakjobs/GetPesticide/' + user.token + '/'
                unitrak_api.ajax(uri, { user_id: user.id, company_id: user.company_id, id: pesticide_id }, function (data) {
                    //console.log(data);
                    if (type == 1) { // indoor
                        var _pcount = $('#Select_pesticide_applied_indoor option').length;

                        var selectedIndex = $('#ddl_pesticidelist_i :selected').val();
                        var IndexValue = document.getElementById('ddl_pesticidelist_i').selectedIndex;
                        var SelectedVal = document.getElementById('ddl_pesticidelist_i').options[IndexValue].text;
                        if ((selectedIndex != null) && (selectedIndex > 0)) {

                            var flag = false;
                            var ddlArray = new Array();
                            var ddl = document.getElementById('Select_pesticide_applied_indoor');
                            for (i = 0; i < ddl.options.length; i++) {
                                ddlArray[i] = ddl.options[i].value;
                                if (ddlArray[i] == selectedIndex) { flag = true; }
                            }

                            if (flag == false) {
                                var opt_id = document.createElement("option");
                                document.getElementById("Select_pesticide_applied_indoor").options.add(opt_id);
                                opt_id.text = data.id;
                                opt_id.value = data.id;

                                var opt_name = document.createElement("option");
                                document.getElementById("Select_pesticide_applied_indoor_name").options.add(opt_name);
                                opt_name.text = data.name;
                                opt_name.value = data.name;

                                var opt_emul = document.createElement("option");
                                document.getElementById("Select_pesticide_applied_indoor_emulsion").options.add(opt_emul);
                                opt_emul.text = data.emulsion;
                                opt_emul.value = data.emulsion;

                                var opt_con = document.createElement("option");
                                document.getElementById("Select_pesticide_applied_indoor_concentrate").options.add(opt_con);
                                opt_con.text = data.concentrate;
                                opt_con.value = data.concentrate;

                                var opt_batchno = document.createElement("option");
                                document.getElementById("Select_pesticide_applied_indoor_batchno").options.add(opt_batchno);
                                opt_batchno.text = data.batchNo;
                                opt_batchno.value = data.batchNo;


                                var _htmlrow = '<div id="pesti_' + data.id + '" class="ui-corner-all custom-corners" style=" margin-top:10px;">' +
                                    '<div class="ui-body ui-body-a">' +
                                    '<div class=row">' +
                                    '<label for="label-appplace">Name: ' + data.name + '</label>' +
                                    '</div>' +
                                    '<div class=row">' +
                                    '<label for="label-appplace">Emulsion: ' + data.emulsion + '</label>' +
                                    '</div>' +
                                    '<div class=row">' +
                                    '<label for="label-appplace">Concentrate: ' + data.concentrate + '</label>' +
                                    '</div>' +
                                    '<div class=row">' +
                                    '<label for="label-appplace">Batch #: ' + data.batchNo + '</label>' +
                                    '</div>' +

                                    '<div class="ui-grid" style=" margin-top:2px;">' +
                                    '<div class="ui-block-a" style=" padding-right:1px;">' +
                                    '<a class="ui-btn" onclick="treated_areas.editpesticides(' + data.id + ',1)" style=" font-size:14px; font-weight:normal">Edit</a>' +
                                    '</div>' +
                                    '<div class="ui-block-b" style=" padding-left:1px;">' +
                                    '<a class="ui-btn" onclick="treated_areas.deletepesticides(' + data.id + ',1)" style=" font-size:14px; font-weight:normal">Delete</a>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>';

                                flag = false;
                                $('#ia_pa').append(_htmlrow);

                            }
                            else {
                                alert("Pesticide Exist!");
                            }
                        }
                    }
                    else { // outdoor
                        var _pcount = $('#Select_pesticide_applied_outdoor option').length;

                        var selectedIndex = $('#ddl_pesticidelist_o :selected').val();
                        var IndexValue = document.getElementById('ddl_pesticidelist_o').selectedIndex;
                        var SelectedVal = document.getElementById('ddl_pesticidelist_o').options[IndexValue].text;
                        if ((selectedIndex != null) && (selectedIndex > 0)) {

                            var flag = false;
                            var ddlArray = new Array();
                            var ddl = document.getElementById('Select_pesticide_applied_outdoor');
                            for (i = 0; i < ddl.options.length; i++) {
                                ddlArray[i] = ddl.options[i].value;
                                if (ddlArray[i] == selectedIndex) { flag = true; }
                            }

                            if (flag == false) {
                                var opt_id = document.createElement("option");
                                document.getElementById("Select_pesticide_applied_outdoor").options.add(opt_id);
                                opt_id.text = data.id;
                                opt_id.value = data.id;

                                var opt_name = document.createElement("option");
                                document.getElementById("Select_pesticide_applied_outdoor_name").options.add(opt_name);
                                opt_name.text = data.name;
                                opt_name.value = data.name;

                                var opt_emul = document.createElement("option");
                                document.getElementById("Select_pesticide_applied_outdoor_emulsion").options.add(opt_emul);
                                opt_emul.text = data.emulsion;
                                opt_emul.value = data.emulsion;

                                var opt_con = document.createElement("option");
                                document.getElementById("Select_pesticide_applied_outdoor_concentrate").options.add(opt_con);
                                opt_con.text = data.concentrate;
                                opt_con.value = data.concentrate;

                                var opt_batchno = document.createElement("option");
                                document.getElementById("Select_pesticide_applied_outdoor_batchno").options.add(opt_batchno);
                                opt_batchno.text = data.batchNo;
                                opt_batchno.value = data.batchNo;


                                var _htmlrow = '<div id="pesto_' + data.id + '" class="ui-corner-all custom-corners" style=" margin-top:10px;">' +
                                    '<div class="ui-body ui-body-a">' +
                                    '<div class=row">' +
                                    '<label for="label-appplace">Name: ' + data.name + '</label>' +
                                    '</div>' +
                                    '<div class=row">' +
                                    '<label for="label-appplace">Emulsion: ' + data.emulsion + '</label>' +
                                    '</div>' +
                                    '<div class=row">' +
                                    '<label for="label-appplace">Concentrate: ' + data.concentrate + '</label>' +
                                    '</div>' +
                                    '<div class=row">' +
                                    '<label for="label-appplace">Batch #: ' + data.batchNo + '</label>' +
                                    '</div>' +

                                    '<div class="ui-grid" style=" margin-top:2px;">' +
                                    '<div class="ui-block-a" style=" padding-right:1px;">' +
                                    '<a class="ui-btn" onclick="treated_areas.editpesticides(' + data.id + ',2)" style=" font-size:14px; font-weight:normal">Edit</a>' +
                                    '</div>' +
                                    '<div class="ui-block-b" style=" padding-left:1px;">' +
                                    '<a class="ui-btn" onclick="treated_areas.deletepesticides(' + data.id + ',2)" style=" font-size:14px; font-weight:normal">Delete</a>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>';

                                flag = false;
                                $('#oa_pa').append(_htmlrow);

                            }
                            else {
                                alert("Pesticide Exist!");
                            }
                        }
                    }


                }, function (err) {
                    unitrak_mobile._showError(err);
                });
            }
            else {
                alert("Select Pesticide!");
            }
        },
        editpesticides: function (id, type) {
            if (type == 1) { // indoor
                $('#div_ip_edit_btn').removeClass('hidden');
                $('#tbl_indoor_p').addClass('hidden');
                var selectobject = document.getElementById("Select_pesticide_applied_indoor");
                for (var i = 0; i < selectobject.length; i++) {
                    console.log(selectobject.options[i].value + " " + id);
                    if (selectobject.options[i].value == id) {
                        $('#hf_ip_pesticide_oid').val(i);
                        $('#hf_ip_pesticide_id').val(id);
                        var name = document.getElementById("Select_pesticide_applied_indoor_name").options[i].value;
                        $('#tb_ip_name').val(name);

                        var emulsion = document.getElementById("Select_pesticide_applied_indoor_emulsion").options[i].value;
                        $('#tb_ip_emulsion').val(emulsion);

                        var concentrate = document.getElementById("Select_pesticide_applied_indoor_concentrate").options[i].value;
                        $('#tb_ip_concentrate').val(concentrate);

                        var batchno = document.getElementById("Select_pesticide_applied_indoor_batchno").options[i].value;
                        $('#tb_ip_batchno').val(batchno);
                    }
                }
            }
            else { // outdoor
                $('#div_op_edit_btn').removeClass('hidden');
                $('#tbl_outdoor_p').addClass('hidden');
                var selectobject = document.getElementById("Select_pesticide_applied_outdoor");
                for (var i = 0; i < selectobject.length; i++) {
                    console.log(selectobject.options[i].value + " " + id);
                    if (selectobject.options[i].value == id) {
                        $('#hf_op_pesticide_oid').val(i);
                        $('#hf_op_pesticide_id').val(id);
                        var name = document.getElementById("Select_pesticide_applied_outdoor_name").options[i].value;
                        $('#tb_op_name').val(name);

                        var emulsion = document.getElementById("Select_pesticide_applied_outdoor_emulsion").options[i].value;
                        $('#tb_op_emulsion').val(emulsion);

                        var concentrate = document.getElementById("Select_pesticide_applied_outdoor_concentrate").options[i].value;
                        $('#tb_op_concentrate').val(concentrate);

                        var batchno = document.getElementById("Select_pesticide_applied_outdoor_batchno").options[i].value;
                        $('#tb_op_batchno').val(batchno);
                    }
                }
            }
        },
        saveeditedpesticides: function (type) {
            if (type == 1) { // indoor
                var id = $('#hf_ip_pesticide_id').val();
                var option = $('#hf_ip_pesticide_oid').val();
                var name = $('#tb_ip_name').val();
                document.getElementById("Select_pesticide_applied_indoor_name").options[option].value = name;
                document.getElementById("Select_pesticide_applied_indoor_name").options[option].text = name;

                var emulsion = $('#tb_ip_emulsion').val();
                document.getElementById("Select_pesticide_applied_indoor_emulsion").options[option].value = emulsion;
                document.getElementById("Select_pesticide_applied_indoor_emulsion").options[option].text = emulsion;

                var concentrate = $('#tb_ip_concentrate').val();
                document.getElementById("Select_pesticide_applied_indoor_concentrate").options[option].value = concentrate;
                document.getElementById("Select_pesticide_applied_indoor_concentrate").options[option].text = concentrate;

                var batchno = $('#tb_ip_batchno').val();
                document.getElementById("Select_pesticide_applied_indoor_batchno").options[option].value = batchno;
                document.getElementById("Select_pesticide_applied_indoor_batchno").options[option].text = batchno;


                var _htmlrow = '<div class="ui-body ui-body-a">' +
                    '<div class=row">' +
                    '<label for="label-appplace">Name: ' + name + '</label>' +
                    '</div>' +
                    '<div class=row">' +
                    '<label for="label-appplace">Emulsion: ' + emulsion + '</label>' +
                    '</div>' +
                    '<div class=row">' +
                    '<label for="label-appplace">Concentrate: ' + concentrate + '</label>' +
                    '</div>' +
                    '<div class=row">' +
                    '<label for="label-appplace">Batch #: ' + batchno + '</label>' +
                    '</div>' +

                    '<div class="ui-grid" style=" margin-top:2px;">' +
                    '<div class="ui-block-a" style=" padding-right:1px;">' +
                    '<a class="ui-btn" onclick="treated_areas.editpesticides(' + id + ',1)" style=" font-size:14px; font-weight:normal">Edit</a>' +
                    '</div>' +
                    '<div class="ui-block-b" style=" padding-left:1px;">' +
                    '<a class="ui-btn" onclick="treated_areas.deletepesticides(' + id + ',1)" style=" font-size:14px; font-weight:normal">Delete</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                $('#pesti_' + id).html(_htmlrow);
                $('#div_ip_edit_btn').addClass('hidden');
                $('#tbl_indoor_p').removeClass('hidden');
            }
            else { // outdoor
                var id = $('#hf_op_pesticide_id').val();
                var option = $('#hf_op_pesticide_oid').val();
                var name = $('#tb_op_name').val();
                document.getElementById("Select_pesticide_applied_outdoor_name").options[option].value = name;
                document.getElementById("Select_pesticide_applied_outdoor_name").options[option].text = name;

                var emulsion = $('#tb_op_emulsion').val();
                document.getElementById("Select_pesticide_applied_outdoor_emulsion").options[option].value = emulsion;
                document.getElementById("Select_pesticide_applied_outdoor_emulsion").options[option].text = emulsion;

                var concentrate = $('#tb_op_concentrate').val();
                document.getElementById("Select_pesticide_applied_outdoor_concentrate").options[option].value = concentrate;
                document.getElementById("Select_pesticide_applied_outdoor_concentrate").options[option].text = concentrate;

                var batchno = $('#tb_op_batchno').val();
                document.getElementById("Select_pesticide_applied_outdoor_batchno").options[option].value = batchno;
                document.getElementById("Select_pesticide_applied_outdoor_batchno").options[option].text = batchno;


                var _htmlrow = '<div class="ui-body ui-body-a">' +
                    '<div class=row">' +
                    '<label for="label-appplace">Name: ' + name + '</label>' +
                    '</div>' +
                    '<div class=row">' +
                    '<label for="label-appplace">Emulsion: ' + emulsion + '</label>' +
                    '</div>' +
                    '<div class=row">' +
                    '<label for="label-appplace">Concentrate: ' + concentrate + '</label>' +
                    '</div>' +
                    '<div class=row">' +
                    '<label for="label-appplace">Batch #: ' + batchno + '</label>' +
                    '</div>' +

                    '<div class="ui-grid" style=" margin-top:2px;">' +
                    '<div class="ui-block-a" style=" padding-right:1px;">' +
                    '<a class="ui-btn" onclick="treated_areas.editpesticides(' + id + ',2)" style=" font-size:14px; font-weight:normal">Edit</a>' +
                    '</div>' +
                    '<div class="ui-block-b" style=" padding-left:1px;">' +
                    '<a class="ui-btn" onclick="treated_areas.deletepesticides(' + id + ',2)" style=" font-size:14px; font-weight:normal">Delete</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                $('#pesto_' + id).html(_htmlrow);
                $('#div_op_edit_btn').addClass('hidden');
                $('#tbl_outdoor_p').removeClass('hidden');

            }
        },
        deletepesticides: function (id, type) {
            if (type == 1) { // indoor
                $('#tbl_indoor_p #pesti_' + id).remove();
                var selectobject = document.getElementById("Select_pesticide_applied_indoor");
                var selectobject_name = document.getElementById("Select_pesticide_applied_indoor_name");
                var selectobject_emulsion = document.getElementById("Select_pesticide_applied_indoor_emulsion");
                var selectobject_concentrate = document.getElementById("Select_pesticide_applied_indoor_concentrate");
                var selectobject_batchno = document.getElementById("Select_pesticide_applied_indoor_batchno");

                for (var i = 0; i < selectobject.length; i++) {
                    console.log(selectobject.options[i].value + " " + id);
                    if (selectobject.options[i].value == id) {
                        selectobject.remove(i);
                        selectobject_name.remove(i);
                        selectobject_emulsion.remove(i);
                        selectobject_concentrate.remove(i);
                        selectobject_batchno.remove(i);
                    }
                }
            }
            else { // outdoor
                $('#tbl_outdoor_p #pesto_' + id).remove();
                var selectobject = document.getElementById("Select_pesticide_applied_outdoor");
                var selectobject_name = document.getElementById("Select_pesticide_applied_outdoor_name");
                var selectobject_emulsion = document.getElementById("Select_pesticide_applied_outdoor_emulsion");
                var selectobject_concentrate = document.getElementById("Select_pesticide_applied_outdoor_concentrate");
                var selectobject_batchno = document.getElementById("Select_pesticide_applied_outdoor_batchno");
                for (var i = 0; i < selectobject.length; i++) {
                    console.log(selectobject.options[i].value + " " + id);
                    if (selectobject.options[i].value == id) {
                        selectobject.remove(i);
                        selectobject_name.remove(i);
                        selectobject_emulsion.remove(i);
                        selectobject_concentrate.remove(i);
                        selectobject_batchno.remove(i);
                    }
                }
            }
        },
        getpesticides: function () {
            var user = localdb.getUser();
            if (user.id > 0) {

                sql_offline.get_imode_callback(
                    function (status) {
                        if (status == 1) { //offline
                            sql_offline.get_pesticidelist_offline();
                        }
                        else {
                            var uri = '/unitrakjobs/GetPesticideList/' + user.token + '/'
                            unitrak_api.ajax(uri, { user_id: user.id, company_id: user.company_id }, function (data) {
                                var tmpl = '{{#list}}<option value="{{id}}">{{name}}</option>{{/list}}';
                                var pre = '<option value="-1">Please Select</option>';
                                var html = kite(tmpl, { list: data });

                                $('#ddl_pesticidelist_i').html(pre + html);
                                $('#ddl_pesticidelist_o').html(pre + html);
                                $('#ddl_pesticidelist_i').val(-1).selectmenu("refresh");
                                $('#ddl_pesticidelist_o').val(-1).selectmenu("refresh");

                            }, function (err) {
                                unitrak_mobile._showError(err);
                            });

                        }
                    });
            }
        },
        get_treatedareas: function () {
            var user = localdb.getUser();
            var job_id = unitrak_mobile.get_query_string_value('id');
            var uri = '/unitrakjobs/GetPTreatedAreas/' + user.token + '/'
            unitrak_api.ajax(uri, { user_id: user.id, company_id: user.company_id, job_id: job_id }, function (data) {
                console.log(data);

                if (data.indoor == true) {
                    $('#cb_indoor').prop('checked', true).checkboxradio("refresh");
                    treated_areas.check_is_indoor();

                    treated_areas.set_area_value(data.indoor_area, 1); //indoor area
                    treated_areas.set_pest_value(data.indoor_pest, 1); //indoor pest
                    treated_areas.set_equipment_value(data.indoor_equipment, 1); //indoor equipment
                    treated_areas.set_pesticide_value(data.i_pesticide_applied, 1); //indoor equipment
                }
                else {
                    $('#cb_indoor').removeAttr('checked');
                    treated_areas.check_is_indoor();
                }


                if (data.outdoor == true) {
                    $('#cb_outdoor').prop('checked', true).checkboxradio("refresh");
                    treated_areas.check_is_outdoor();

                    treated_areas.set_area_value(data.outdoor_area, 2); //outdoor area
                    treated_areas.set_pest_value(data.outdoor_pest, 2); //outdoor pest
                    treated_areas.set_equipment_value(data.outdoor_equipment, 2); //outdoor equipment
                    treated_areas.set_pesticide_value(data.o_pesticide_applied, 2); //indoor equipment
                }
                else {
                    $('#cb_outdoor').removeAttr('checked');
                    treated_areas.check_is_outdoor();
                }

                $('#tb_oap_temp').val(data.temperature);
                $('#tb_oap_conditions').val(data.conditions);
                $('#tb_oap_ws').val(data.windspeed);
                $('#tb_oap_wd').val(data.winddirection);


            }, function (err) {
                unitrak_mobile._showError(err);
            });
        },
        set_area_value: function (area, type) {
            var _value = "";
            if (type == 1) { // indoor
                var indoor_area = area;
                if (indoor_area != "") {
                    var indoor_area_split = indoor_area.split(';');
                    for (i = 0; i < (indoor_area_split.length - 1); i++) {
                        var id = indoor_area_split[i].split(',')[0];
                        var ischeck = indoor_area_split[i].split(',')[1];
                        var text = indoor_area_split[i].split(',')[2];
                        if (ischeck == "true") { $('#' + id).attr('checked', 'checked'); } else { $('#' + id).removeAttr('checked'); }
                        if (text.indexOf('other') != -1) { $('#tb_ia_others').val(text.substring(0, text.indexOf('other') - 1)); treated_areas.check_indoor_area_others(); } else {
                            $('#tb_ia_others').val(""); treated_areas.check_indoor_area_others();
                        }
                    }
                }
            }
            else { //outdoor
                var outdoor_area = area;
                if (outdoor_area != "") {
                    var outdoor_area_split = outdoor_area.split(';');
                    for (i = 0; i < (outdoor_area_split.length - 1); i++) {
                        var id = outdoor_area_split[i].split(',')[0];
                        var ischeck = outdoor_area_split[i].split(',')[1];
                        var text = outdoor_area_split[i].split(',')[2];
                        if (ischeck == "true") { $('#' + id).attr('checked', 'checked'); } else { $('#' + id).removeAttr('checked'); }
                        if (text.indexOf('other') != -1) { $('#tb_oa_others').val(text.substring(0, text.indexOf('other') - 1)); treated_areas.check_outdoor_area_others(); } else {
                            $('#tb_oa_others').val(""); treated_areas.check_outdoor_area_others();
                        }
                    }
                }
            }
        },
        set_pest_value: function (pest, type) {
            var _value = "";
            if (type == 1) { // indoor
                var indoor_pest = pest;
                if (indoor_pest != "") {
                    var indoor_pest_split = indoor_pest.split(';');
                    for (i = 0; i < (indoor_pest_split.length - 1); i++) {
                        var id = indoor_pest_split[i].split(',')[0];
                        var ischeck = indoor_pest_split[i].split(',')[1];
                        var text = indoor_pest_split[i].split(',')[2];
                        if (ischeck == "true") { $('#' + id).attr('checked', 'checked'); } else { $('#' + id).removeAttr('checked'); }
                        if (text.indexOf('other') != -1) { $('#tb_iap_others').val(text.substring(0, text.indexOf('other') - 1)); treated_areas.check_indoor_pest_others(); } else {
                            $('#tb_iap_others').val(""); treated_areas.check_indoor_pest_others();
                        }
                    }
                }
            }
            else { //outdoor
                var outdoor_pest = pest;
                if (outdoor_pest != "") {
                    var outdoor_pest_split = outdoor_pest.split(';');
                    for (i = 0; i < (outdoor_pest_split.length - 1); i++) {
                        var id = outdoor_pest_split[i].split(',')[0];
                        var ischeck = outdoor_pest_split[i].split(',')[1];
                        var text = outdoor_pest_split[i].split(',')[2];
                        if (ischeck == "true") { $('#' + id).attr('checked', 'checked'); } else { $('#' + id).removeAttr('checked'); }
                        if (text.indexOf('other') != -1) { $('#tb_oap_others').val(text.substring(0, text.indexOf('other') - 1)); treated_areas.check_outdoor_pest_others(); } else {
                            $('#tb_oap_others').val(""); treated_areas.check_outdoor_pest_others();
                        }
                    }
                }
            }
        },
        set_equipment_value: function (equipment, type) {
            var _value = "";
            if (type == 1) { // indoor
                var indoor_equipment = equipment;
                if (indoor_equipment != "") {
                    var indoor_equipment_split = indoor_equipment.split(';');
                    for (i = 0; i < (indoor_equipment_split.length - 1); i++) {
                        var id = indoor_equipment_split[i].split(',')[0];
                        var ischeck = indoor_equipment_split[i].split(',')[1];
                        var text = indoor_equipment_split[i].split(',')[2];
                        if (ischeck == "true") { $('#' + id).attr('checked', 'checked'); } else { $('#' + id).removeAttr('checked'); }
                        if (text.indexOf('other') != -1) { $('#tb_iae_others').val(text.substring(0, text.indexOf('other') - 1)); treated_areas.check_indoor_equipment_others(); } else {
                            $('#tb_iae_others').val(""); treated_areas.check_indoor_equipment_others();
                        }
                    }
                }
            }
            else { //outdoor
                var outdoor_equipment = equipment;
                if (outdoor_equipment != "") {
                    var outdoor_equipment_split = outdoor_equipment.split(';');
                    for (i = 0; i < (outdoor_equipment_split.length - 1); i++) {
                        var id = outdoor_equipment_split[i].split(',')[0];
                        var ischeck = outdoor_equipment_split[i].split(',')[1];
                        var text = outdoor_equipment_split[i].split(',')[2];
                        if (ischeck == "true") { $('#' + id).attr('checked', 'checked'); } else { $('#' + id).removeAttr('checked'); }
                        if (text.indexOf('other') != -1) { $('#tb_oae_others').val(text.substring(0, text.indexOf('other') - 1)); treated_areas.check_outdoor_equipment_others(); } else {
                            $('#tb_oae_others').val(""); treated_areas.check_outdoor_equipment_others();
                        }
                    }
                }
            }
        },
        set_pesticide_value: function (pesticide, type) {
            var _value = "";

            if (type == 1) { // indoor
                var i_pesticide_applied = pesticide;
                if (i_pesticide_applied != "") {
                    $('#Select_pesticide_applied_indoor').empty();
                    $('#Select_pesticide_applied_indoor_name').empty();
                    $('#Select_pesticide_applied_indoor_emulsion').empty();
                    $('#Select_pesticide_applied_indoor_concentrate').empty();
                    $('#Select_pesticide_applied_indoor_batchno').empty();

                    var i_pesticide_applied_split = i_pesticide_applied.split(';');
                    $('#ia_pa').html('');
                    for (i = 0; i < (i_pesticide_applied_split.length - 1); i++) {

                        var id = i_pesticide_applied_split[i].split(',')[0];
                        var name = i_pesticide_applied_split[i].split(',')[1];
                        var emulsion = i_pesticide_applied_split[i].split(',')[2];
                        var concentration = i_pesticide_applied_split[i].split(',')[3];
                        var batchno = i_pesticide_applied_split[i].split(',')[4];

                        var opt_id = document.createElement("option");
                        document.getElementById("Select_pesticide_applied_indoor").options.add(opt_id);
                        opt_id.text = id;
                        opt_id.value = id;

                        var opt_name = document.createElement("option");
                        document.getElementById("Select_pesticide_applied_indoor_name").options.add(opt_name);
                        opt_name.text = name;
                        opt_name.value = name;

                        var opt_emul = document.createElement("option");
                        document.getElementById("Select_pesticide_applied_indoor_emulsion").options.add(opt_emul);
                        opt_emul.text = emulsion;
                        opt_emul.value = emulsion;

                        var opt_con = document.createElement("option");
                        document.getElementById("Select_pesticide_applied_indoor_concentrate").options.add(opt_con);
                        opt_con.text = concentration;
                        opt_con.value = concentration;

                        var opt_batchno = document.createElement("option");
                        document.getElementById("Select_pesticide_applied_indoor_batchno").options.add(opt_batchno);
                        opt_batchno.text = batchno;
                        opt_batchno.value = batchno;

                        var _htmlrow = '<div id="pesti_' + id + '" class="ui-corner-all custom-corners" style=" margin-top:10px;">' +
                            '<div class="ui-body ui-body-a">' +
                            '<div class=row">' +
                            '<label for="label-appplace">Name: ' + name + '</label>' +
                            '</div>' +
                            '<div class=row">' +
                            '<label for="label-appplace">Emulsion: ' + emulsion + '</label>' +
                            '</div>' +
                            '<div class=row">' +
                            '<label for="label-appplace">Concentrate: ' + concentration + '</label>' +
                            '</div>' +
                            '<div class=row">' +
                            '<label for="label-appplace">Batch #: ' + batchno + '</label>' +
                            '</div>' +

                            '<div class="ui-grid" style=" margin-top:2px;">' +
                            '<div class="ui-block-a" style=" padding-right:1px;">' +
                            '<a class="ui-btn" onclick="treated_areas.editpesticides(' + id + ',1)" style=" font-size:14px; font-weight:normal">Edit</a>' +
                            '</div>' +
                            '<div class="ui-block-b" style=" padding-left:1px;">' +
                            '<a class="ui-btn" onclick="treated_areas.deletepesticides(' + id + ',1)" style=" font-size:14px; font-weight:normal">Delete</a>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>';

                        $('#ia_pa').append(_htmlrow);

                    }
                }
            }
            else { //outdoor
                var o_pesticide_applied = pesticide;
                if (o_pesticide_applied != "") {
                    $('#Select_pesticide_applied_outdoor').empty();
                    $('#Select_pesticide_applied_outdoor_name').empty();
                    $('#Select_pesticide_applied_outdoor_emulsion').empty();
                    $('#Select_pesticide_applied_outdoor_concentrate').empty();
                    $('#Select_pesticide_applied_outdoor_batchno').empty();

                    var o_pesticide_applied_split = o_pesticide_applied.split(';');
                    $('#oa_pa').html('');
                    for (i = 0; i < (o_pesticide_applied_split.length - 1); i++) {

                        var id = o_pesticide_applied_split[i].split(',')[0];
                        var name = o_pesticide_applied_split[i].split(',')[1];
                        var emulsion = o_pesticide_applied_split[i].split(',')[2];
                        var concentration = o_pesticide_applied_split[i].split(',')[3];
                        var batchno = o_pesticide_applied_split[i].split(',')[4];

                        var opt_id = document.createElement("option");
                        document.getElementById("Select_pesticide_applied_outdoor").options.add(opt_id);
                        opt_id.text = id;
                        opt_id.value = id;

                        var opt_name = document.createElement("option");
                        document.getElementById("Select_pesticide_applied_outdoor_name").options.add(opt_name);
                        opt_name.text = name;
                        opt_name.value = name;

                        var opt_emul = document.createElement("option");
                        document.getElementById("Select_pesticide_applied_outdoor_emulsion").options.add(opt_emul);
                        opt_emul.text = emulsion;
                        opt_emul.value = emulsion;

                        var opt_con = document.createElement("option");
                        document.getElementById("Select_pesticide_applied_outdoor_concentrate").options.add(opt_con);
                        opt_con.text = concentration;
                        opt_con.value = concentration;

                        var opt_batchno = document.createElement("option");
                        document.getElementById("Select_pesticide_applied_outdoor_batchno").options.add(opt_batchno);
                        opt_batchno.text = batchno;
                        opt_batchno.value = batchno;

                        var _htmlrow = '<div id="pesto_' + id + '" class="ui-corner-all custom-corners" style=" margin-top:10px;">' +
                            '<div class="ui-body ui-body-a">' +
                            '<div class=row">' +
                            '<label for="label-appplace">Name: ' + name + '</label>' +
                            '</div>' +
                            '<div class=row">' +
                            '<label for="label-appplace">Emulsion: ' + emulsion + '</label>' +
                            '</div>' +
                            '<div class=row">' +
                            '<label for="label-appplace">Concentrate: ' + concentration + '</label>' +
                            '</div>' +
                            '<div class=row">' +
                            '<label for="label-appplace">Batch #: ' + batchno + '</label>' +
                            '</div>' +

                            '<div class="ui-grid" style=" margin-top:2px;">' +
                            '<div class="ui-block-a" style=" padding-right:1px;">' +
                            '<a class="ui-btn" onclick="treated_areas.editpesticides(' + id + ',2)" style=" font-size:14px; font-weight:normal">Edit</a>' +
                            '</div>' +
                            '<div class="ui-block-b" style=" padding-left:1px;">' +
                            '<a class="ui-btn" onclick="treated_areas.deletepesticides(' + id + ',2)" style=" font-size:14px; font-weight:normal">Delete</a>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>';

                        flag = false;
                        $('#oa_pa').append(_htmlrow);
                    }
                }
            }
        },

        calc_areas: function (type) {
            var _value = "";
            if (type == 1) { // indoor
                $('.cb_i_area').each(function (i, v) {
                    var _id = $(this).attr('id');
                    var _selected = $(this).is(':checked');
                    var _text = $(this).attr('data-element');

                    if (_id == "cb_ia_others") {
                        _text = $('#tb_ia_others').val() + ':other';
                    }

                    if (_selected == true) {
                        _value += _id + "," + _selected + "," + _text + ";";
                    }

                });
                return _value;
            }
            else { //outdoor
                $('.cb_o_area').each(function (i, v) {
                    var _id = $(this).attr('id');
                    var _selected = $(this).is(':checked');
                    var _text = $(this).attr('data-element');

                    if (_id == "cb_oa_others") {
                        _text = $('#tb_oa_others').val() + ':other';
                    }

                    if (_selected == true) {
                        _value += _id + "," + _selected + "," + _text + ";";
                    }
                });
                return _value;
            }
        },
        calc_pest: function (type) {
            var _value = "";
            if (type == 1) { // indoor
                $('.cb_i_pest').each(function (i, v) {
                    var _id = $(this).attr('id');
                    var _selected = $(this).is(':checked');
                    var _text = $(this).attr('data-element');

                    if (_id == "cb_iap_others") {
                        _text = $('#tb_iap_others').val() + ':other';
                    }

                    if (_selected == true) {
                        _value += _id + "," + _selected + "," + _text + ";";
                    }
                });
                return _value;
            }
            else { //outdoor
                $('.cb_o_pest').each(function (i, v) {
                    var _id = $(this).attr('id');
                    var _selected = $(this).is(':checked');
                    var _text = $(this).attr('data-element');

                    if (_id == "cb_oap_others") {
                        _text = $('#tb_oap_others').val() + ':other';
                    }

                    if (_selected == true) {
                        _value += _id + "," + _selected + "," + _text + ";";
                    }
                });
                return _value;
            }
        },
        calc_equipment: function (type) {
            var _value = "";
            if (type == 1) { // indoor
                $('.cb_i_equipment').each(function (i, v) {
                    var _id = $(this).attr('id');
                    var _selected = $(this).is(':checked');
                    var _text = $(this).attr('data-element');

                    if (_id == "cb_iae_others") {
                        _text = $('#tb_iae_others').val() + ':other';
                    }

                    if (_selected == true) {
                        _value += _id + "," + _selected + "," + _text + ";";
                    }
                });
                return _value;
            }
            else { //outdoor
                $('.cb_o_equipment').each(function (i, v) {
                    var _id = $(this).attr('id');
                    var _selected = $(this).is(':checked');
                    var _text = $(this).attr('data-element');

                    if (_id == "cb_oae_others") {
                        _text = $('#tb_oae_others').val() + ':other';
                    }

                    if (_selected == true) {
                        _value += _id + "," + _selected + "," + _text + ";";
                    }
                });
                return _value;
            }
        },
        calc_pesticide_app: function (type) {
            var _value = "";
            if (type == 1) { // indoor
                var _count = $('#Select_pesticide_applied_indoor option').length;
                for (var i = 0; i < _count; i++) {

                    var id = document.getElementById("Select_pesticide_applied_indoor").options[i].value;
                    var name = document.getElementById("Select_pesticide_applied_indoor_name").options[i].value;
                    var emulsion = document.getElementById("Select_pesticide_applied_indoor_emulsion").options[i].value;
                    var concentration = document.getElementById("Select_pesticide_applied_indoor_concentrate").options[i].value;
                    var batchno = document.getElementById("Select_pesticide_applied_indoor_batchno").options[i].value;

                    _value += id + "," + name + "," + emulsion + "," + concentration + "," + batchno + ";";
                }
                return _value;
            }
            else { //outdoor
                var _count = $('#Select_pesticide_applied_outdoor option').length;
                for (var i = 0; i < _count; i++) {

                    var id = document.getElementById("Select_pesticide_applied_outdoor").options[i].value;
                    var name = document.getElementById("Select_pesticide_applied_outdoor_name").options[i].value;
                    var emulsion = document.getElementById("Select_pesticide_applied_outdoor_emulsion").options[i].value;
                    var concentration = document.getElementById("Select_pesticide_applied_outdoor_concentrate").options[i].value;
                    var batchno = document.getElementById("Select_pesticide_applied_outdoor_batchno").options[i].value;

                    _value += id + "," + name + "," + emulsion + "," + concentration + "," + batchno + ";";
                }
                return _value;
            }
        },
        init: function () {
            treated_areas.getpesticides();
            treated_areas.get_treatedareas();
        },

    };
}());


var camera = (function () {
    return {
        clearCache: function () {
            navigator.camera.cleanup();
        },
        showUploadElements: function (b) {
            if (b === true) {
                $('#capture-image-file').removeClass('hidden');
                $('#upload-image-file').removeClass('hidden');
                $('#image-file-description').removeClass('hidden');
            } else {
                $('#capture-image-file').addClass('hidden');
                $('#upload-image-file').addClass('hidden');
                $('#image-file-description').addClass('hidden'); 4
            }
            $('#image-file-description').html('');
        },
        uploadFile: function () {
            var description = $('#image-file-description').val();
            if (description.length == 0) {
                unitrak_mobile.showRequiredField('#image-file-description')
                return false;
            }

            var fileURI = $('#capture-image-file').attr('src'), user = localdb.getUser();

            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            options.params = {
                name: user.username,
                user_id: user.id,
                company_id: user.company_id,
                job_id: unitrak_mobile.get_query_string_value('id'),
                description: description
            };

            var ft = new FileTransfer();

            $('#upload_image_div').show();
            $('#upload_image_div').html('Uploading image file... Please wait... <i class="lIcon fa fa-spinner fa-spin"></i>');
            unitrak_mobile.showMessage('Uploading image file... Please wait... <i class="lIcon fa fa-spinner fa-spin"></i>');

            ft.upload(fileURI, encodeURI(uploadURI), function () {
                $('#upload_image_div').html('File upload complete');
                $('#upload_image_div').hide();
                unitrak_mobile.showMessage('File upload complete');
                jobeditpage.viewjobissues()
                camera.showUploadElements(false);
                jobinfo.getjobdocuments();
            }, function (err) {
                $('#upload_image_div').hide();
                unitrak_mobile.showErrorMessage('Error uploading image. Please try again later');
                camera.clearCache();
            }, options);
        },
        failCapture: function (message) {
            $('#upload_image_div').hide();
            unitrak_mobile.showErrorMessage('Error executing image capture.' + message);
        },

        fromCamera: function () {
            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        unitrak_mobile.showErrorMessage('Offline mode does not support catch and sync image! Please catch image and store to phone memory and attached to job from library when internet is available!');
                    }
                    else {
                        camera._getImage();
                    }
                });
        },
        fromLibrary: function () {
            //camera._getImage({ quality: 100, destinationType: destinationType.FILE_URI, sourceType: Camera.PictureSourceType.PHOTOLIBRARY3 });

            //navigator.camera.getPicture(camera.execCaptureImage, camera.failCapture, {
            //     quality: 100,
            //     destinationType: distinationType.FILE_URI,
            //     sourceType: Camera.PictureSourceType1.PHOTOLIBRARY3
            //});

            //navigator.camera.getPicture(onPhotoURISuccess, camera.failCapture, {
            //                            quality: 100,
            //                            destinationType: distinationType.FILE_URI,
            //                            sourceType: Camera.pictureSource.PHOTOLIBRARY3
            //                            });

        },
        execCaptureImage: function (fileURI) {
            if (fileURI.indexOf('.') != -1) {
                var ext = fileURI.split('.')[1].toLowerCase();
                //unitrak_mobile._showMessage(ext,true);
                if (ext == 'png' || ext == 'jpg' || ext == 'jpeg' || ext == 'gif' || ext == 'com') {
                    $('#capture-image-file').attr('src', fileURI);
                }
                else if (ext == 'doc' || ext == 'docx' || ext == 'txt' || ext == 'rtf') {
                    $('#capture-image-file').attr('src', 'css/images/doc-preview.png');
                }
                else if (ext == 'pdf') {
                    $('#capture-image-file').attr('src', 'css/images/pdf-preview.jpg');
                }
                else {
                    $('#capture-image-file').attr('src', 'css/images/no-preview.png');
                }
            } else {
                $('#capture-image-file').attr('src', fileURI);
            }
            camera.showUploadElements(true);
        },
        _getImage: function (option) {
            navigator.camera.getPicture(camera.execCaptureImage, camera.failCapture, {
                quality: 100,
                destinationType: distinationType.FILE_URI
            });

            //navigator.camera.getPicture(camera.execCaptureImage, camera.failCapture, option);
        },
    }
}());


var jobeditpage = (function () {
    return {
        get_treatments: function (user, callback, pfx) {
            _ui.loading(true);

            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        sql_offline.load_jobtreatmentautocomplete_offline(user, callback, pfx);
                    }
                    else {
                        unitrak_api.ajax('/unitrakjobs/get/' + user.token + '/', { user_id: user.id, company_id: user.company_id, action: 'get-treatments' },
                            function (data) {
                                _ui.loading(true);
                                if (!unitrak_api.validData(data)) {
                                    _ui.loading(false);
                                    return;
                                }

                                var tmpl = '{{#treatment}}<li class="ui-screen-hidden"><a id="treatment-{{clientID}}" href="#" ' +
                                    'onclick="_get_treatment_details({{clientID}})">{{name}}</a></li>{{/treatment}}';
                                var html = kite(tmpl, { treatment: data });
                                $('#add-treatment').html(html).listview('refresh');

                                var tmpl2 = '{{#treatment}}<li class="ui-screen-hidden"><a id="treatment-{{clientID}}" href="#" ' +
                                    'onclick="_update_treatment_details(this,{{clientID}})">{{name}}</a></li>{{/treatment}}';
                                var html2 = kite(tmpl2, { treatment: data });
                                $('#edit-treatment').html(html2).listview('refresh');

                                if (callback != undefined) callback();
                            }, function (err) {
                            }, function () {
                                _ui.loading(false);
                            })
                    }
                });
        },
        get_images: function () {
            _ui.loading(true);
            var job_id = unitrak_mobile.get_query_string_value('id');
            var user = localdb.getUser();
            unitrak_api.ajax('/unitrakjobs/get/' + user.token + '/', { user_id: user.id, company_id: user.company_id, job_id: job_id, action: 'job-images' },
                function (data) {
                    var tmpl = '{{#img}}<li style="border-style: none;"><div>' +
                        '<a href="#" data-jobid="{{job_id}}" data-filename="{{filename}}" data-path="{{path}}" class="img" id="docid_{{id}}">' +
                        '<div class="row"><img src="{{path}}{{filename}}" style="width:100%;border:0;"/><br/>' +
                        '<div id="text_description{{id}}">{{description}}</div>' +
                        '<textarea id="ta_description{{id}}" style="width:99%; display:none" name="imgdescription{{id}}" id="imgdescription{{id}}">{{description}}</textarea></div></a>' +
                        '<a onclick="jobeditpage.deletejobimageissue({{id}})" id="deleteimgdescription{{id}}" data-role="button" data-inline="true" class="ui-btn ui-btn-inline ui-mini btn-success" style=" color: #fff ! important; background-color: #2C3E50 ! important; width: 70px;" href="#"><i class="lIcon fa fa-trash-o"></i>Delete</a>' +
                        '<a onclick="jobeditpage.editjobimageissue({{id}})" id="editimgdescription{{id}}" data-role="button" data-inline="true" class="ui-btn ui-btn-inline ui-mini btn-success" style=" color: #fff ! important; background-color: #2C3E50 ! important; width: 170px;" href="#"><i class="lIcon fa fa-pencil"></i>Edit Description</a>' +
                        '<a onclick="jobeditpage.updatejobimageissue({{id}})" id="saveimgdescription{{id}}" data-role="button" data-inline="true" class="ui-btn ui-btn-inline ui-mini btn-success" style=" display:none; color: #fff ! important; background-color: #2C3E50 ! important; width: 170px;" href="#"><i class="lIcon fa fa-save"></i>Update Description</a>' +
                        '</div>' +
                        '</li>{{/img}}';
                    var html = kite(tmpl, { img: data });
                    $('#job-image-list').html(html);
                    $('#job-image-list').listview('refresh');

                }, function (err) {
                }, function () {
                    _ui.loading(false);
                })
        },
        editjobimageissue: function (id) {
            $('#ta_description' + id).show();
            $('#text_description' + id).hide();
            $('#saveimgdescription' + id).show();
            $('#editimgdescription' + id).hide();
            $('#deleteimgdescription' + id).hide();
        },
        updatejobimageissue: function (id) {
            $.mobile.loading("show");

            var user = localdb.getUser();
            var job_id = $('#hf_job_id').val();
            var decription = $('#ta_description' + id).val();
            var model = {
                company_id: user.company_id,
                job_id: job_id,
                user_id: user.id,
                id: id,
                decription: decription,
                blank: ""
            };

            console.log(model);

            var uri = '/unitrakjobs/PostUpdateJobImageDescription/' + user.token + '/'
            unitrak_api.ajax_post(uri, model,
                function (data) {
                    $('#ta_description' + id).hide();
                    $('#text_description' + id).show();
                    $('#saveimgdescription' + id).hide();
                    $('#editimgdescription' + id).show();
                    $('#deleteimgdescription' + id).show();

                    jobeditpage.get_images();

                    $.mobile.loading("hide");
                }, function (err) {
                    unitrak_mobile._showError(err);
                });
        },
        deletejobimageissue: function (id) {
            $.mobile.loading("show");

            var user = localdb.getUser();
            var job_id = $('#hf_job_id').val();
            var model = {
                company_id: user.company_id,
                job_id: job_id,
                user_id: user.id,
                id: id,
                blank: ""
            };

            var uri = '/unitrakjobs/PostDeleteJobImage/' + user.token + '/'
            unitrak_api.ajax_post(uri, model,
                function (data) {
                    $('#ta_description' + id).hide();
                    $('#text_description' + id).show();
                    $('#saveimgdescription' + id).hide();
                    $('#editimgdescription' + id).show();
                    $('#deleteimgdescription' + id).show();

                    jobeditpage.get_images();

                    $.mobile.loading("hide");
                }, function (err) {
                    unitrak_mobile._showError(err);
                });

        },
        viewjobdetails: function () {
            $('#btn-edit-job-mc').removeClass('hidden');
            $('#editjob-client-detail').show();
            $('#editjob-client-treatment').hide();
            $('#editjob-client-notes').hide();
            $('#editjob-client-timesheet').hide();
            $('#editjob-client-invoice').hide();
            $('#editjob-client-tech').hide();
            $('#editjob-client-issues').hide();
            $('#editjob-client-reports').hide();
            $('#editjob-client-timer').hide();
            $('#editjob-client-stationreports').hide();

            $('#editpage-footer-payment').hide();
            $('#editpage-footer-timesheet').hide();
            $('#editpage-footer-treatment').hide();
            //$('#editpage-footer-main').show();
            $('#editpage-footer-treatmentmain').hide();
            $('#editpage-footer-invoice').hide();
            $('#editpage-footer-invoice_tran').hide();
            $('#editpage-footer-receipt').hide();
            $('#editpage-footer-report').hide();
            $('#editpage-footer-report-new').hide();
            $('#editpage-footer-cancel').hide();

            $('#hf_seltab').val('details');
        },
        viewjobtreatment: function () {
            $('#btn-edit-job-mc').addClass('hidden');
            $('#editjob-client-detail').hide();
            $('#editjob-client-treatment').show();
            $('#editjob-client-notes').hide();
            $('#editjob-client-timesheet').hide();
            $('#editjob-client-invoice').hide();
            $('#editjob-client-tech').hide();
            $('#editjob-client-issues').hide();
            $('#editjob-client-reports').hide();
            $('#editjob-client-timer').hide();
            $('#editjob-client-stationreports').hide();

            $('#editjob-footer').hide();
            $('#editpage-footer-payment').hide();
            $('#editpage-footer-timesheet').hide();
            $('#editpage-footer-treatment').hide();
            //$('#editpage-footer-main').hide();
            //$('#editpage-footer-technician').hide();
            $('#editpage-footer-treatmentmain').show();
            $('#editpage-footer-invoice').hide();
            $('#editpage-footer-invoice_tran').hide();
            $('#editpage-footer-receipt').hide();
            $('#editpage-footer-report').hide();
            $('#editpage-footer-report-new').hide();
            $('#editpage-footer-cancel').hide();

            job.canceleditjobtreatment();

            $('#hf_seltab').val('treatment');


        },
        viewjobtimesheet: function () {

            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        unitrak_mobile.showErrorMessage('Offline mode does not support timesheet at the moment!');
                    }
                    else {
                        $('#btn-edit-job-mc').addClass('hidden');
                        $('#editjob-client-detail').hide();
                        $('#editjob-client-treatment').hide();
                        $('#editjob-client-notes').hide();
                        $('#editjob-client-timesheet').show();
                        $('#editjob-client-invoice').hide();
                        $('#editjob-client-tech').hide();
                        $('#editjob-client-issues').hide();
                        $('#editjob-client-reports').hide();
                        $('#editjob-client-timer').hide();
                        $('#editjob-client-stationreports').hide();

                        $('#editpage-footer-payment').hide();
                        $('#editpage-footer-timesheet').hide();
                        $('#editpage-footer-treatment').hide();
                        //$('#editpage-footer-main').hide();
                        $('#editjob-footer').hide();
                        //$('#editpage-footer-technician').hide();
                        $('#editpage-footer-treatmentmain').show();
                        $('#editpage-footer-invoice').hide();
                        $('#editpage-footer-invoice_tran').hide();
                        $('#editpage-footer-receipt').hide();
                        $('#editpage-footer-report').hide();
                        $('#editpage-footer-report-new').hide();
                        $('#editpage-footer-cancel').hide();

                        job.cancelnewtimesheet();

                        $('#hf_seltab').val('timesheet');

                        $('#canceladdtimesheet').hide();
                        $('#cancelmaintimesheet').show();
                    }
                });
        },
        viewjobnotes: function () {
            $('#btn-edit-job-mc').addClass('hidden');
            $('#editjob-client-detail').hide();
            $('#editjob-client-treatment').hide();
            $('#editjob-client-notes').show();
            $('#editjob-client-timesheet').hide();
            $('#editjob-client-invoice').hide();
            $('#editjob-client-tech').hide();
            $('#editjob-client-issues').hide();
            $('#editjob-client-reports').hide();
            $('#editjob-client-timer').hide();
            $('#editjob-client-stationreports').hide();

            $('#editpage-footer-payment').hide();
            $('#editpage-footer-timesheet').hide();
            $('#editpage-footer-treatment').hide();
            //$('#editpage-footer-main').hide();
            $('#editjob-footer').hide();
            //$('#editpage-footer-technician').hide();
            $('#editpage-footer-treatmentmain').show();
            $('#new_site_note').val('');
            $('#editpage-footer-invoice').hide();
            $('#editpage-footer-invoice_tran').hide();
            $('#editpage-footer-receipt').hide();
            $('#editpage-footer-report').hide();
            $('#editpage-footer-report-new').hide();
            $('#editpage-footer-cancel').hide();

            $('#hf_seltab').val('note');
            jobfiles.init();

        },
        viewjobinvoice: function () {
            $('#btn-edit-job-mc').removeClass('hidden');
            $('#editjob-client-detail').hide();
            $('#editjob-client-treatment').hide();
            $('#editjob-client-notes').hide();
            $('#editjob-client-timesheet').hide();
            $('#editjob-client-invoice').show();
            $('#editjob-client-tech').hide();
            $('#editjob-client-issues').hide();
            $('#editjob-client-reports').hide();
            $('#editjob-client-timer').hide();
            $('#editjob-client-stationreports').hide();

            $('#editpage-footer-payment').hide();
            $('#editpage-footer-timesheet').hide();
            $('#editpage-footer-treatment').hide();
            //$('#editpage-footer-main').hide();
            $('#editjob-footer').hide();
            //$('#editpage-footer-technician').hide();
            $('#editpage-footer-treatmentmain').hide();
            //$('#editpage-footer-invoice').show();
            $('#editpage-footer-invoice_tran').show();
            $('#editpage-footer-receipt').hide();
            $('#editpage-footer-invoice').hide();
            $('#editpage-footer-report').hide();
            $('#editpage-footer-report-new').hide();
            $('#editpage-footer-cancel').hide();
            //$('#jobinvoice_payments').show();
            $('#payment_pop').hide();
            $('#hf_seltab').val('invoice');
            var job_id = $('#hf_job_id').val();

            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        sql_offline.load_offline_editpageinvoice(job_id);
                    }
                    else {
                        var hasinvoice = $('#hf_iid_hasinvoice').val();
                        if (hasinvoice == "true") {
                            $('#hasinvoicewrapper').show();
                            $('#invoice_div').hide();
                            var user = localdb.getUser();

                            var uri = '/unitrakjobs/get/' + user.token + '/'
                            unitrak_api.ajax(uri, { user_id: user.id, company_id: user.company_id, job_id: job_id, action: 'get-invoice-forpayment' }, function (data) {
                                console.log(data);

                                
                                $("#jobeditpage-cusname").html(data.customerName);
                                $("#jobeditpage-invoice").html(data.prefix + data.invoiceId);
                                $("#jobeditpage-jobdate").html(data.jobDate);
                                $("#jobeditpage-amount").html(data.amount.toFixed(2));
                                $("#jobeditpage-description").html(data.description);
                                $("#jobeditpage-payment").html(data.payment);
                                $("#jobeditpage-total").html(data.bal);

                                $("#hf_EmailSubject").val(data.emailSubject);
                                $("#hf_EmailMsg").val(data.emailMsg);
                                
                                var uri_ib = '/unitrakjobs/get/' + user.token + '/'
                                unitrak_api.ajax(uri_ib, { user_id: user.id, company_id: user.company_id, action: 'getjobinvoicebalance', job_id: job_id }, function (data) {
                                    var bal = parseFloat(data);
                                    if (bal > 0) {
                                        $('#editpage-footer-receipt').hide();
                                        $('#editpage-footer-invoice_tran').show();
                                    }
                                    else {
                                        $('#editpage-footer-receipt').show();
                                        $('#editpage-footer-invoice_tran').hide();
                                    }

                                    _ui.loading(false);
                                    $.mobile.loading("hide");
                                                    
                                }, function (err) {
                                    _ui.loading(false);
                                    $.mobile.loading("hide");
                                    unitrak_mobile._showError(err);
                                });

                            }, function (err) {
                                _ui.loading(false);
                                $.mobile.loading("hide");
                                unitrak_mobile._showError(err);
                            });
                        }
                        else {
                            $('#hasinvoicewrapper').hide();
                            $('#invoice_div').show();
                            $('#editpage-footer-invoice_tran').hide();
                            $('#editpage-footer-receipt').hide();
                            $('#editpage-footer-invoice').hide();
                            _ui.loading(false);
                            $.mobile.loading("hide");
                        }
                    }
                });
        },

        viewjobinvoice_: function () {
            $('#editjob-client-detail').hide();
            $('#editjob-client-treatment').hide();
            $('#editjob-client-notes').hide();
            $('#editjob-client-timesheet').hide();
            $('#editjob-client-invoice').show();
            $('#editjob-client-tech').hide();
            $('#editjob-client-issues').hide();
            $('#editjob-client-reports').hide();
            $('#editjob-client-timer').hide();
            $('#editjob-client-stationreports').hide();

            $('#editpage-footer-payment').hide();
            $('#editpage-footer-timesheet').hide();
            $('#editpage-footer-treatment').hide();
            //$('#editpage-footer-main').hide();
            $('#editjob-footer').show();
            //$('#editpage-footer-technician').hide();
            $('#editpage-footer-treatmentmain').hide();
            $('#editpage-footer-invoice').show();
            $('#editpage-footer-report').hide();
            $('#editpage-footer-report-new').hide();
            $('#editpage-footer-cancel').hide();

            //$('#jobinvoice_payments').show();
            $('#payment_pop').hide();

            $('#hf_seltab').val('invoice');


            var job_id = $('#hf_job_id').val();

            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        sql_offline.load_offline_editpageinvoice(job_id);
                    }
                    else {

                        var hasinvoice = $('#hf_iid_hasinvoice').val();
                        if (hasinvoice == "true") {
                            $('#hasinvoicewrapper').show();
                            $('#invoice_div').hide();
                            var user = localdb.getUser();


                            var uri = '/unitrakjobs/get/' + user.token + '/'
                            unitrak_api.ajax(uri, { user_id: user.id, company_id: user.company_id, job_id: job_id, action: 'get-invoice-forpayment' }, function (data) {
                                //console.log(data);

                                $("#jobeditpage-cusname").html(data.customerName);
                                $("#jobeditpage-invoice").html(data.prefix + data.invoiceId);
                                $("#jobeditpage-jobdate").html(data.jobDate);
                                $("#jobeditpage-amount").html(data.amount.toFixed(2));
                                $("#jobeditpage-description").html(data.description);
                                $("#jobeditpage-payment").html(data.payment);
                                $("#jobeditpage-total").html(data.bal);

                                $('#tb_Amount').val(data.bal);

                                payment.get_invoicepayments(job_id);

                                $.mobile.loading("hide");
                            }, function (err) {
                                unitrak_mobile._showError(err);
                            });
                        }
                        else {
                            $('#hasinvoicewrapper').hide();
                            $('#invoice_div').show();
                        }
                    }
                });
            //if (data.hasinvoice == true) {
            //    $('#hasinvoicewrapper').show();
            //    $('#div_has_invoice').show();
            //    $('#div_has_invoice').html('Job has invoice # ' + data.invoiceno);
            //    payment.get_invoicepayments(job_id);
            //}


        },
        viewjobinvoiceonsave: function () {
            //$('#editjob-client-detail').hide();
            //$('#editjob-client-treatment').hide();
            //$('#editjob-client-notes').hide();
            //$('#editjob-client-timesheet').hide();
            //$('#editjob-client-invoice').show();
            //$('#editjob-client-tech').hide();
            //$('#editjob-client-issues').hide();

            //$('#editpage-footer-payment').hide();
            //$('#editpage-footer-timesheet').hide();
            //$('#editpage-footer-treatment').hide();
            //$('#editpage-footer-main').hide();
            //$('#editjob-footer').show();
            //$('#editpage-footer-technician').hide();
            //$('#editpage-footer-treatmentmain').hide();
            //$('#editpage-footer-invoice').show();

            //$('#jobinvoice_payments').show();
            //$('#payment_pop').hide();

            $('#hf_seltab').val('invoice');


            var job_id = $('#hf_job_id').val();

            var hasinvoice = $('#hf_iid_hasinvoice').val();
            if (hasinvoice == "true") {
                $('#hasinvoicewrapper').show();
                $('#invoice_div').hide();

                var user = localdb.getUser();
                var uri = '/unitrakjobs/get/' + user.token + '/'
                unitrak_api.ajax(uri, { user_id: user.id, company_id: user.company_id, job_id: job_id, action: 'get-invoice-forpayment' }, function (data) {

                    $("#jobeditpage-cusname").html(data.customerName);
                    $("#jobeditpage-invoice").html(data.prefix + data.invoiceId);
                    $("#jobeditpage-jobdate").html(data.jobDate);
                    $("#jobeditpage-amount").html(data.amount.toFixed(2));
                    $("#jobeditpage-description").html(data.description);
                    $("#jobeditpage-payment").html(data.payment);
                    $("#jobeditpage-total").html(data.bal);

                    $('#tb_Amount').val(data.bal);

                    payment.get_invoicepayments(job_id);

                    $('#editjob-client-detail').show();
                    $('#editjob-client-treatment').hide();
                    $('#editjob-client-notes').hide();
                    $('#editjob-client-timesheet').hide();
                    $('#editjob-client-invoice').hide();
                    $('#editjob-client-tech').hide();
                    $('#editjob-client-issues').hide();
                    $('#editjob-client-reports').hide();
                    $('#editjob-client-timer').hide();
                    $('#editjob-client-stationreports').hide();

                    $('#editjob-footer').show();
                    $('#editpage-footer-payment').hide();
                    $('#editpage-footer-treatment').hide();
                    //$('#editpage-footer-main').show();
                    //$('#editpage-footer-technician').hide();
                    $('#editpage-footer-treatmentmain').hide();
                    $('#editpage-footer-report').hide();
                    $('#editpage-footer-report-new').hide();
                    $('#editpage-footer-cancel').hide();

                    var pagevalue = $('#hf_seltab').val();
                    if (pagevalue == 'note') {
                        jobeditpage.viewjobnotes();
                    }
                    else if (pagevalue == 'timesheet') {
                        //jobeditpage.viewjobtimesheet();
                    }
                    $('#hf_seltab').val('details');
                    $('#canceladdtimesheet').hide();
                    $('#cancelmaintimesheet').show();


                    unitrak_mobile._showMessage("Job successfuly updated.");

                    $.mobile.loading("hide");
                }, function (err) {
                    unitrak_mobile._showError(err);
                });
            }
            else {
                $('#hasinvoicewrapper').hide();
                $('#invoice_div').show();
            }

        },
        viewjobtech: function () {
            $('#btn-edit-job-mc').addClass('hidden');
            $('#editjob-client-detail').hide();
            $('#editjob-client-treatment').hide();
            $('#editjob-client-notes').hide();
            $('#editjob-client-timesheet').hide();
            $('#editjob-client-invoice').hide();
            $('#editjob-client-tech').show();
            $('#editjob-client-issues').hide();
            $('#editjob-client-reports').hide();
            $('#editjob-client-timer').hide();
            $('#editjob-client-stationreports').hide();

            $('#editpage-footer-payment').hide();
            $('#editpage-footer-timesheet').hide();
            $('#editpage-footer-treatment').hide();
            //$('#editpage-footer-main').hide();
            $('#editjob-footer').hide();
            //$('#editpage-footer-technician').show();
            $('#editpage-footer-treatmentmain').hide();
            $('#editpage-footer-invoice').hide();
            $('#editpage-footer-invoice_tran').hide();
            $('#editpage-footer-receipt').hide();
            $('#editpage-footer-report').hide();
            $('#editpage-footer-report-new').hide();
            $('#editpage-footer-cancel').hide();

            $('#hf_seltab').val('tech');
        },
        viewjobtimer: function () {
            $('#btn-edit-job-mc').addClass('hidden');
            $('#editjob-client-detail').hide();
            $('#editjob-client-treatment').hide();
            $('#editjob-client-notes').hide();
            $('#editjob-client-timesheet').hide();
            $('#editjob-client-invoice').hide();
            $('#editjob-client-tech').hide();
            $('#editjob-client-issues').hide();
            $('#editjob-client-reports').hide();
            $('#editjob-client-timer').show();
            $('#editjob-client-stationreports').hide();

            $('#editpage-footer-payment').hide();
            $('#editpage-footer-timesheet').hide();
            $('#editpage-footer-treatment').hide();
            //$('#editpage-footer-main').hide();
            $('#editjob-footer').hide();
            //$('#editpage-footer-technician').show();
            $('#editpage-footer-treatmentmain').hide();
            $('#editpage-footer-invoice').hide();
            $('#editpage-footer-invoice_tran').hide();
            $('#editpage-footer-receipt').hide();
            $('#editpage-footer-report').hide();
            $('#editpage-footer-report-new').hide();
            $('#editpage-footer-cancel').hide();


            var job_id = unitrak_mobile.get_query_string_value('id');
            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        sql_offline.upadatejobfortimer_byjob_id_offline(job_id);
                    }
                    else {
                        var user = localdb.getUser();
                        var uri_ib = '/unitrakjobs/get/' + user.token + '/'
                        unitrak_api.ajax(uri_ib, { user_id: user.id, company_id: user.company_id, action: 'getjob-timer', job_id: job_id }, function (data) {
                            $('#edit-job-timer').html(data);
                        }, function (err) {
                            unitrak_mobile._showError(err);
                        });
                    }
                });




        },
        viewjobreport: function () {
            $('#btn-edit-job-mc').addClass('hidden');
            $('#editjob-client-detail').hide();
            $('#editjob-client-treatment').hide();
            $('#editjob-client-notes').hide();
            $('#editjob-client-timesheet').hide();
            $('#editjob-client-invoice').hide();
            $('#editjob-client-tech').hide();
            $('#editjob-client-issues').hide();
            $('#editjob-client-reports').show();
            $('#editjob-client-timer').hide();
            $('#editjob-client-stationreports').hide();

            $('#editpage-footer-payment').hide();
            $('#editpage-footer-timesheet').hide();
            $('#editpage-footer-treatment').hide();
            //$('#editpage-footer-main').hide();
            $('#editjob-footer').hide();
            //$('#editpage-footer-technician').hide();
            $('#editpage-footer-treatmentmain').hide();
            $('#editpage-footer-invoice').show();
            $('#editpage-footer-invoice_tran').hide();
            $('#editpage-footer-receipt').hide();
            $('#editpage-footer-report').hide();
            $('#editpage-footer-report-new').show();
            $('#editpage-footer-cancel').hide();


            $('#hf_seltab').val('report');
            $('.panel-form-data').addClass('hidden');
            $('#rpt-list').removeClass('hidden');
            reports.getreports();
            _form_manager.event.get_reportlist();

        },
        viewjobstationreport: function () {

            var hasreport = $('#hf_has_rodentreport').val();

            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        if(hasreport == "0"){
                            $('.add-station_report-container').hide();
                        }
                        else{
                            $('.add-station_report-container').show();
                        }
                    }
                    else{
                        $('.add-station_report-container').show();
                    }
                }
            );

            $('#btn-edit-job-mc').addClass('hidden');
            $('#editjob-client-detail').hide();
            $('#editjob-client-treatment').hide();
            $('#editjob-client-notes').hide();
            $('#editjob-client-timesheet').hide();
            $('#editjob-client-invoice').hide();
            $('#editjob-client-tech').hide();
            $('#editjob-client-issues').hide();
            $('#editjob-client-reports').hide();
            $('#editjob-client-timer').hide();
            $('#editjob-client-stationreports').show();

            $('#editpage-footer-payment').hide();
            $('#editpage-footer-timesheet').hide();
            $('#editpage-footer-treatment').hide();
            //$('#editpage-footer-main').hide();
            $('#editjob-footer').hide();
            //$('#editpage-footer-technician').hide();
            $('#editpage-footer-treatmentmain').hide();
            $('#editpage-footer-invoice').show();
            $('#editpage-footer-invoice_tran').hide();
            $('#editpage-footer-receipt').hide();
            $('#editpage-footer-report').hide();
            $('#editpage-footer-report-new').hide();
            $('#editpage-footer-cancel').hide();
            $('#editpage-footer-stationreport').hide();
            $('#stn-rpt-list-open').html('');
            $('#footer_stationreport').html('');
            $('#footer_stationreport').addClass('hidden');
            $('#stn-rpt-list').removeClass('hidden');
            $('#stn-rpt-list-open').addClass('hidden');

            report_template.get_link_report();

        },
        viewjobissues: function () {

            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offliner
                        unitrak_mobile.showErrorMessage('Offline mode does not support catch and sync image at the moment!');
                        $.mobile.loading("hide");
                        return;
                    }
                    else {
                        $('#btn-edit-job-mc').addClass('hidden');
                        $('#editjob-client-detail').hide();
                        $('#editjob-client-treatment').hide();
                        $('#editjob-client-notes').hide();
                        $('#editjob-client-timesheet').hide();
                        $('#editjob-client-invoice').hide();
                        $('#editjob-client-tech').hide();
                        $('#editjob-client-issues').show();
                        $('#editjob-client-reports').hide();
                        $('#editjob-client-timer').hide();
                        $('#editjob-client-stationreports').hide();

                        $('#editpage-footer-payment').hide();
                        $('#editpage-footer-timesheet').hide();
                        $('#editpage-footer-treatment').hide();
                        //$('#editpage-footer-main').hide();
                        $('#editjob-footer').show();
                        //$('#editpage-footer-technician').hide();
                        $('#editpage-footer-treatmentmain').show();
                        $('#editpage-footer-invoice').hide();
                        $('#editpage-footer-invoice_tran').hide();
                        $('#editpage-footer-receipt').hide();
                        $('#editpage-footer-report').hide();
                        $('#editpage-footer-report-new').hide();
                        $('#editpage-footer-cancel').hide();

                        jobeditpage.get_images();

                        $('#hf_seltab').val('issue');

                    }
                });

        },
        sendemail: function () {

            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        unitrak_mobile.showErrorMessage('Offline mode does not support sending email at the moment!');
                        $.mobile.loading("hide");
                        return;
                    }
                    else {
                        var job_id = unitrak_mobile.get_query_string_value('id');

                        var user = localdb.getUser();
                        if (user.id > 0) {
                            $.mobile.loading("show");

                            var model = {
                                token: user.token,
                                company_id: user.company_id,
                                job_id: job_id,
                                user_id: user.id,
                                blank: ""
                            };

                            var r = confirm("This will email the invoice to the customer. Do you want to continue? ");
                            if (r == true) {
                                var uri = '/unitrakjobs/PostJobInvoiceEmail/' + user.token + '/'
                                unitrak_api.ajax_post(uri, model,
                                    function (data) {
                                        unitrak_mobile._showMessage("Invoice successfuly sent.");
                                        $.mobile.loading("hide");
                                    }, function (err) {
                                        unitrak_mobile._showError(err);
                                    });
                            }
                            else {
                                $.mobile.loading("hide");
                            }

                        }
                    }
                });
        }
    }
}());

// global namespace for report
var _form_manager = _form_manager || {};
var _jobid = 0;
var _hf_elements = '#form_elements', _file_upload_images_list = '.file-upload-list';
var _location_options = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };
var _panel_formdata = '.panel-form-data', _btn_save = '.btn-save-form', _btn_post = '.btn-post-form', _btn_cancel_post = '.btn-cancel-post', _modalui = '#notification_modal_display';
var _geolocation = {};

var reports = (function () {
    return {
        getreports: function () {
            var user = localdb.getUser();
            $.mobile.loading("show");
            var job_id = $('#hf_job_id').val();
            $('#rpt-list').html('');

            var tmpl = '{{#reports}}<div class="row" style=" border: 1px solid #2C3E50; margin-bottom:5px; "><div style=" margin: 5px; "><div =class="row">' +
                '<p>Date: {{date_created_string}}</p>' +
                '<p>Name: {{name}}</p>' +
                '<p>Description: {{description}}</p>' +
                //'<p>Status: {{status}}</p>' +
                '<p id="lbl_offline_{{id}}" style="color: #d1453d">(Saved Offline)</p>' +
                '</div>' +
                '<div class="row">' +
                '{{?isposted}} ' +
                '<a onclick="reports.sendemailreport(\'{{id}}\');" data-role="button" data-inline="true" class="ui-btn ui-btn-inline ui-mini btn-success" style=" color: #fff! important; border-radius: 5px ! important; border: 1px solid #ddd !important; background-color: #D9534F ! important; width: 70px"><i class="lIcon fa fa-envelope"></i> Email</a>' +
                '{{^?}} {{}}<a id="btn-post-report" onclick="reports.getreportform(\'{{id}}\');" data-role="button" data-inline="true" class="ui-btn ui-btn-inline ui-mini btn-success" style=" color: #000! important; border-radius: 5px ! important; border: 1px solid #ddd !important; background-color: #f2f2f2 ! important; width: 70px"><i class="lIcon fa fa-arrow-circle-right"></i> Open</a>' +
                '<a onclick="reports.sendemailreport(\'{{id}}\');" data-role="button" data-inline="true" class="ui-btn ui-btn-inline ui-mini btn-success" style=" color: #fff! important; border-radius: 5px ! important; border: 1px solid #ddd !important; background-color: #D9534F ! important; width: 70px"><i class="lIcon fa fa-envelope"></i> Email</a>' +
                '</div></div></div>{{/reports}}';


            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        _db = sql_lite.create_db_nr();
                        _db.transaction(function (tx) {
                            tx.executeSql("SELECT data_json,is_posted,key FROM tbl_JobFormData where key='user_report_form_db'", [], function (tx, rs) {
                                if (rs.rows.length > 0) {
                                    var data = [];
                                    var _json = rs.rows.item(0).data_json;
                                    var _json_parse = $.parseJSON(_json);
                                    for (i = 0; i < _json_parse.length; i++) {
                                        if (job_id == _json_parse[i].job_id) {
                                            data.push(_json_parse[i]);
                                        }
                                    }

                                    var html = kite(tmpl, { reports: data });
                                    if (html == "") {
                                        reports.load_reportforms_stpdr(job_id, false);
                                    }
                                    else {
                                        $('#rpt-list').html(html);
                                        reports.load_reportforms_stpdr(job_id, true);
                                    }


                                    for (i = 0; i < _json_parse.length; i++) {
                                        if (job_id == _json_parse[i].job_id) {
                                            unitrak_frm.get_offline_form_db_status(job_id, _json_parse[i].id, 'lbl_offline_');
                                        }
                                    }

                                    _ui.loading(false);
                                    $.mobile.loading("hide");


                                } else {
                                }

                            }, function (e) {
                                _ui.writelog("ERROR insert form data\n");
                                _ui.writelog(e);
                            });
                        });

                    } else {

                        var uri = '/reports/GetUserFormsByJobID/' + user.token + '/'
                        unitrak_api.ajax(uri, { user_id: user.id, company_id: user.company_id, job_id: job_id }, function (data) {

                            var html = kite(tmpl, { reports: data });
                            if (html == "") {
                                reports.load_reportforms_stpdr(job_id, false);
                            }
                            else {
                                $('#rpt-list').html(html);
                                reports.load_reportforms_stpdr(job_id, true);
                            }

                            for (i = 0; i < data.length; i++) {
                                unitrak_frm.get_offline_form_db_status(job_id, data[i].id, 'lbl_offline_');
                            }

                            _ui.loading(false);
                            $.mobile.loading("hide");
                        }, function (err) {
                            unitrak_mobile._showError(err);
                        });

                    }
                });

        },
        load_reportforms_stpdr: function (job_id, hasotherreport) {
            var user = localdb.getUser();
            var tmpl = '{{#reports}}<div class="row" style=" border: 1px solid #2C3E50; margin-bottom:5px; "><div style=" margin: 5px; "><div =class="row">' +
                '<p>Date: {{date_created_string}}</p>' +
                '<p>Name: {{name}}</p>' +
                '<p>Description: {{description}}</p>' +
                '</div>' +
                '<div class="row">' +
                '<a id="btn-post-report" onclick="reports.getreportform(\'{{id}}\',true,{{type}});" data-role="button" data-inline="true" class="ui-btn ui-btn-inline ui-mini btn-success" style=" color: #000! important; border-radius: 5px ! important; border: 1px solid #ddd !important; background-color: #f2f2f2 ! important; width: 70px"><i class="lIcon fa fa-arrow-circle-right"></i> Open</a>' +
                '<a onclick="reports.sendemailreport(\'{{id}}\',true,{{type}});" data-role="button" data-inline="true" class="ui-btn ui-btn-inline ui-mini btn-success" style=" color: #fff! important; border-radius: 5px ! important; border: 1px solid #ddd !important; background-color: #D9534F ! important; width: 70px"><i class="lIcon fa fa-envelope"></i> Email</a>' +
                '</div></div></div>{{/reports}}';

                sql_offline.get_imode_callback(
                    function (status) {
                        if (status == 1) { //offline

                            unitrak_mobile.showErrorMessage('Offline mode does not support this feature at the moment!');
                            $.mobile.loading("hide");
                            return;


                            var db = sql_offline.sqllite_db();
                            db.transaction(function (tx) {
                                tx.executeSql("SELECT * FROM tbl_JobData where key='stpdr_report_db'", [], function (tx, rs) {
                                    if (rs.rows.length > 0) {
                                        var data = [];
                                        var _json = rs.rows.item(0).data_json;
                                        var _json_parse = $.parseJSON(_json);
                                        for (i = 0; i < _json_parse.length; i++) {
                                            if (job_id == _json_parse[i].job_id) {
                                                data.push(_json_parse[i].userreport);
                                            }
                                        }
                                    } 

                                    var html = kite(tmpl, { reports: data });
                                    if (html != "") {
                                        $('.panel-select-report').removeClass('hidden');
                                        $('#editpage-footer-report-new').show();
                                        $('#editpage-footer-cancel').hide();
                                        $('#rpt-list').show();
                                        $('#rpt-list').append(html);
                                    }
                                    else {
                                        if (hasotherreport == false) {                               
                                            $('#rpt-list').hide();
                                            $('.panel-select-report').removeClass('hidden');
                                            $('#editpage-footer-report-new').show();
                                            $('#editpage-footer-cancel').hide();
                                        }
                                    }
    
                                    _ui.loading(false);
                                    $.mobile.loading("hide");

                                }, function (e) {
                                    _ui.writelog("ERROR stpdr form data\n");
                                    _ui.writelog(e);
                                });
                            });
                        } else {
                            var uri = '/reports/GetPostedReportsForRSA/' + user.token + '/'
                            unitrak_api.ajax(uri, { user_id: user.id, company_id: user.company_id, job_id: job_id }, function (data) {
                                var html = kite(tmpl, { reports: data });
                                if (html != "") {
                                    //if (hasotherreport == false) {                               
                                    //    $('#rpt-list').hide();
                                    //    $('.panel-select-report').removeClass('hidden');
                                    //    $('#editpage-footer-report-new').show();
                                    //    $('#editpage-footer-cancel').hide();
                                    //}
                                    //else{
                                        $('.panel-select-report').removeClass('hidden');
                                        $('#editpage-footer-report-new').show();
                                        $('#editpage-footer-cancel').hide();
                                        $('#rpt-list').show();
                                    //}
                                    $('#rpt-list').append(html);
                                }
                                else {
                                    if (hasotherreport == false) {                               
                                        $('#rpt-list').hide();
                                        $('.panel-select-report').removeClass('hidden');
                                        $('#editpage-footer-report-new').show();
                                        $('#editpage-footer-cancel').hide();
                                    }
                                    else{
                                        $('.panel-select-report').removeClass('hidden');
                                        $('#editpage-footer-report-new').show();
                                        $('#editpage-footer-cancel').hide();
                                        $('#rpt-list').show();
                                    }
                                }
            
                                _ui.loading(false);
                                $.mobile.loading("hide");
                            }, function (err) {
                                unitrak_mobile._showError(err);
                            });
                        }
                    });
        },
        getreportform: function (reportId,is_stpdr, type) {
            $('#editpage-footer-payment').hide();
            $('#editpage-footer-timesheet').hide();
            $('#editpage-footer-treatment').hide();
            //$('#editpage-footer-main').hide();
            $('#editjob-footer').show();
            //$('#editpage-footer-technician').hide();
            $('#editpage-footer-treatmentmain').hide();
            $('#editpage-footer-invoice').hide();
            $('#editpage-footer-invoice_tran').hide();
            $('#editpage-footer-receipt').hide();
            $('#editpage-footer-report-new').hide();
            $('#editpage-footer-cancel').hide();

            $('#current-report-id').val(reportId);
            $('#editpage-footer-report').show();
            $('#editpage-footer-cancel').hide();


            $('.panel-select-report').addClass('hidden');
            $('.panel-form-data').html('').trigger("create");

            var tmpl = '{{#data}}<div style=" margin:5px;"><div class="panel-heading clearfix">' +
                '<p id="lbl_ur_offline" style="color: #d1453d" class="hidden">(Saved Offline)</p>' +
                '<p style=" white-space:normal; "><h3><i>{{name}}</i></h3><hr/></p>' +
                //'<h3 class="panel-title pull-left">{{name}}</h3>' +
                '</div>' +
                '<div class="list-group">' +
                '<div class="list-group-item">' +
                '<p class="list-group-item-text">Description</p>' +
                '<h4 class="list-group-item-heading">{{description}}</h4><hr/>' +
                '</div>' +
                '<div class="list-group form-element-list" style="padding:5px 15px">' +
                '</div></div></div>{{/data}}';

            var user = localdb.getUser();
            var job_id = $('#hf_job_id').val();
            var id = reportId;


            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        $.mobile.loading("show");

                        sql_lite.create_db(function (reportId) {
                            sql_lite.get_form(id, function (data) {
                                var images = [];
                                var json = data.json;
                                var html = kite(tmpl, { data: data });
                                $(_panel_formdata).html(html).attr('data-jobid', data.job_id);
                                $(_btn_save).attr('data-id', id);
                                $(_btn_post).attr('data-id', id);

                                var parentid = '.form-element-list';

                                unitrak_frm.render_report(json, images, job_id, parentid, function () {
                                    $('.panel-form-data').removeClass('hidden');
                                    $('#rpt-list').addClass('hidden');

                                    sql_lite.update_report_status(id);
                                    $.mobile.loading("hide");
                                });

                                _unitrak_ui_helper.hideLoadingWindow();
                                unitrak_frm.get_offline_form_db(job_id, id, function (data) {
                                    if (data == "") {
                                        $('#lbl_ur_offline').addClass("hidden");
                                    }
                                    else {
                                        $('#lbl_ur_offline').removeClass("hidden");
                                    }
                                });

                            });
                        });
                    }
                    else {

                        if(type == 1)
                        {
                            $('#editpage-footer-report').hide();
                            $('.panel-form-data').removeClass('hidden');
                            $('#rpt-list').addClass('hidden');
                            $('.panel-select-report').addClass('hidden');
                            unitrak_frm.load_stpdr_report(id, job_id);
                        }
                        else if(type == 2)
                        {
                            $('#editpage-footer-report').hide();
                            $('.panel-form-data').removeClass('hidden');
                            $('#rpt-list').addClass('hidden');
                            $('.panel-select-report').addClass('hidden');
                            unitrak_frm.load_ppstpdr_report(id, job_id);
                        }
                        else{
                            var jsonparam = { company_id: user.company_id, user_id: user.user_id, report_id: id };
                            var uri = '/reports/GetUserForm/' + user.token + '/';
                            $.mobile.loading("show");
                            unitrak_api.ajax(uri, jsonparam, function (data) {
                                var user_report = data.user_report;
                                __user_form = data;
                                var images = data.images;
                                var json = data.user_report.json;
                                var html = kite(tmpl, { data: user_report });
                                $(_panel_formdata).html(html).attr('data-jobid', data.job_id);
                                $(_btn_save).attr('data-id', id);
                                $(_btn_post).attr('data-id', id);

                                var parentid = '.form-element-list';

                                unitrak_frm.render_report(json, data.images, job_id, parentid, function () {
                                    $('.panel-form-data').removeClass('hidden');
                                    $('#rpt-list').addClass('hidden');

                                    sql_lite.update_report_status(id);
                                    $.mobile.loading("hide");
                                });

                                _unitrak_ui_helper.hideLoadingWindow();

                                unitrak_frm.get_offline_form_db(job_id, id, function (data) {
                                    if (data == "") {
                                        $('#lbl_ur_offline').addClass("hidden");
                                    }
                                    else {
                                        $('#lbl_ur_offline').removeClass("hidden");
                                    }
                                });


                            }, function (err) {
                                _unitrak_ui_helper.hideLoadingWindow();
                                _unitrak_ui_helper.showErrorMessage(err);
                            });
                        }

                    }
                });


        },
        cancelformupdate: function () {
            jobeditpage.viewjobreport();
        },
        sendemailreport: function (id,stpdr, type) {
            var user = localdb.getUser();
            var job_id = $('#hf_job_id').val();


            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        unitrak_mobile.showErrorMessage('Offline mode does not support this feature at the moment!');
                        $.mobile.loading("hide");
                        return;
                    }
                    else {

                        if(stpdr == true){
                                showConfirm('This will email the report to the customer. Do you want to continue?',
                                    'Confirmation',
                                    'Cancel,Continue', 
                                    function (confirm) {
                                        if(confirm == 1){
                                        }
                                        else{
                                            var model = {
                                                id: id,
                                                job_id: job_id,
                                                company_id: user.company_id,
                                                user_id: user.id,
                                            };
            
                                            if(type == 1){
                                                var uri = '/reports/PostSendSTPDREmail/' + user.token + '/';
                                                unitrak_api.ajax_post(uri, model,
                                                    function (data) {
                                                        __ui.alert('Report successfully sent');
                                                    }, function (err) {
                                                        unitrak_mobile._showError(err);
                                                    });
                                            }
                                            else{
                                                var uri = '/reports/PostSendPPSTPDREmail/' + user.token + '/';
                                                unitrak_api.ajax_post(uri, model,
                                                    function (data) {
                                                        __ui.alert('Report successfully sent');
                                                    }, function (err) {
                                                        unitrak_mobile._showError(err);
                                                    });
                                            }



                                        }
                                    }
                                );
                        }
                        else{

                            var jsonparam = { company_id: user.company_id, user_id: user.user_id, report_id: id };
                            var uri = '/reports/GetUserForm/' + user.token + '/';
                            $.mobile.loading("show");
                            unitrak_api.ajax(uri, jsonparam, function (data) {
                                var user_report = data.user_report;
                                //var images = data.images;
                                var json = $.parseJSON(data.user_report.json);
                
                                var model = {
                                    id: id,
                                    job_id: job_id,
                                    company_id: user.company_id,
                                    user_id: user.id,
                                    ReportTemplate: json
                                };
                
                                showConfirm('This will email the report to the customer. Do you want to continue?',
                                    'Confirmation',
                                    'Cancel,Continue', 
                                    function (confirm) {
                                        if(confirm == 1){
                                        }
                                        else{
                                            var uri = '/reports/PostSendEmail/' + user.token + '/';
                                            unitrak_api.ajax_post(uri, model,
                                                function (data) {
                                                    __ui.alert('Report successfully sent');
                                                }, function (err) {
                                                    unitrak_mobile._showError(err);
                                                });
                                        }
                                    }
                                );

                                //var r = confirm("This will email the report to the customer. Do you want to continue? ");
                                //if (r == true) {
                                //}
                
                                $.mobile.loading("hide");
                
                                _unitrak_ui_helper.hideLoadingWindow();
                            }, function (err) {
                                _unitrak_ui_helper.hideLoadingWindow();
                                _unitrak_ui_helper.showErrorMessage(err);
                            });
                        }
                    }
                }
            );
        },
    }
}());


var user_report = (function () {
    return {
        remove_image: function (btn) {
            var id = $(btn).attr('data-imageid');
            var name = $(btn).attr('data-filename');
            $(btn.parentElement.parentElement).remove();

        },
    }
}());

function viewdropdown(id) {
    var current_status = $('#hf_dp_' + id).val();
    if (current_status == "0") { //0 inactive
        $('#hf_dp_' + id).val("1");
        $('#choice_el_' + id).slideDown("slow");
    }
    else { //1 active
        $('#hf_dp_' + id).val("0");
        $('#choice_el_' + id).slideUp();
    }
}

function addpvaluetotb(id, type) {
    //var report_id = unitrakCmn.getQueryStringValue('id');
    var user_id = $('#hf_UID').val();

    //console.log('adora');
    var reportjson = ujson;
    //console.log(reportjson);

    var _choice_no = $('#hf_cn_' + id).val();
    var _element_no = $('#hf_en_' + id).val();
    console.log(_choice_no + " " + _element_no);
    var text = reportjson.elements[_element_no].choices[_choice_no].text;

    if (type == 1) { //radio
    }
    else if (type == 2) { //check
        var ischeck = $('#' + id).is(':checked');
        var elid = id.split("_")[2];
        var currenttext = $('#txt_dp_check_' + elid).val();

        if (ischeck) {
            if (currenttext == "") {
                $('#txt_dp_check_' + elid).val(text + ';');
            }
            else {
                if (currenttext.indexOf(text + ';') > -1) {
                }
                else {
                    $('#txt_dp_check_' + elid).val(currenttext + text + ';');
                }
            }
        }
        else {
            currenttext = currenttext.replace(text + ';', '');
            $('#txt_dp_check_' + elid).val(currenttext);
        }

        //$('#choice_el_check_' + elid).hide();
        //$('#hf_dp_check_' + elid).val("0");
    }
}


_form_manager.userGeoLocation = '';
_form_manager.event = {
    hide_notification_error: function () {
        $('.btn-close-notification-message').addClass('hidden');
        $('.navbar-notification').hide();
    },
    show_notification_error: function (msg) {
        $('.btn-notification-message').html(msg);
        $('.navbar-notification').show('slow');
        $('.btn-close-notification-message').removeClass('hidden');
    },
    show_notification: function (msg, callback) {
        $('.btn-notification-message').html(msg);
        $('.navbar-notification').show('slow');
        setTimeout(function () {
            $('.navbar-notification').hide('fade');
            if (callback != undefined) callback();
        }, 3000);
    },

    back_to_home: function () {
        window.location = 'index.html';
    },
    uploadFile: function (el_id, fileURI, idx, callback) {
        var user = localdb.getUser();
        var job_id = $('#hf_job_id').val();
        var report_id = $('#current-report-id').val();
        var options = new FileUploadOptions();

        options.fileKey = "file";
        options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.params = {
            token: user.token,
            user_id: user.user_id,
            job_id: job_id,
            company_id: user.company_id,
            el_id: el_id,
            report_id: report_id,
            name: options.fileName
        };

        console.log(options.params);


        if (isNaN(options.params.job_id)) options.params.job_id = 0;
        //console.log('File Transfer started for: ' + fileURI);
        var img_tmpl = '<li class="list-group-item">' +
            '<i class="fa fa-2x fa-spinner fa-spin pull-left" id="upload_' + el_id + '" ></i>' +
            '<i id="upload_info_' + el_id + '">Uploading: 0 %</i></li>';

        try {
            $(_file_upload_images_list).append(img_tmpl);
            var ft = new FileTransfer();
            //unitrak_mobile.showMessage('Uploading image file...');
            //console.log('Uploading image file...');
            var _apiURI = 'https://api2.unitrak.com.au/api';
            ft.upload(fileURI, encodeURI(_apiURI + '/Reports/PostFormData'),
                function (r) {
                    //$('#upload_info_' + el_id).html('Uploading: 100 %');
                    //$('#upload_' + el_id).removeClass('fa-spinner').removeClass('fa-spin').addClass('fa-check');
                    //console.log('File upload complete:' + options.fileName);
                    //console.log("Code = " + r.responseCode);
                    //console.log("Response = " + r.response);
                    //console.log("Sent = " + r.bytesSent);
                    if (callback) callback(idx + 1);
                },
                function (err) {
                    var msg = _ui.call_error_message(e);
                    //console.log('Error uploading image: ' + msg);
                }, options);

            ft.onprogress = function (progressEvent) {
                //perc = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
                //$('#upload_info_' + el_id).html('Uploading: ' +(perc +1) +' %');
            }

        } catch (e) {
            $('#upload_' + el_id).removeClass('fa-spinner').removeClass('fa-spin').addClass('fa-error');
            $('#upload_info_' + el_id).html('Uploading: ERROR');
            var msg = _ui.call_error_message(e);
            console.log('uploadFile -  FileTransfer Error: ' + msg);
        }

    },
    uploadFile_STPDR: function (el_id, fileURI, idx, elid, elIDdb, position, report_id, callback) {
        var user = localdb.getUser();
        var job_id = $('#hf_stpdr_job_id').val();
        var options = new FileUploadOptions();

        options.fileKey = "file";
        options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.params = {
            token: user.token,
            user_id: user.user_id,
            job_id: job_id,
            company_id: user.company_id,
            el_id: elIDdb,
            report_id: report_id,
            name: options.fileName,
            position: position
        };
        console.log(options.params);

        if (isNaN(options.params.job_id)) options.params.job_id = 0;
        //console.log('File Transfer started for: ' + fileURI);
        var img_tmpl = '<li class="list-group-item">' +
            '<i class="fa fa-2x fa-spinner fa-spin pull-left" id="upload_' + el_id + '" ></i>' +
            '<i id="upload_info_' + el_id + '">Uploading: 0 %</i></li>';

        try {
            $(_file_upload_images_list).append(img_tmpl);
            var ft = new FileTransfer();

            var _apiURI = 'https://api2.unitrak.com.au/api';
            ft.upload(fileURI, encodeURI(_apiURI + '/Reports/PostFormDataSTPDR'),
                function (r) {
                    if (callback) callback(idx + 1, elid, elIDdb, position, report_id);
                },
                function (err) {
                    console.log("========================================================error diri1");
                    console.log(err);
                    var msg = _ui.call_error_message(e);
                }, options);

            ft.onprogress = function (progressEvent) {
                //perc = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
                //$('#upload_info_' + el_id).html('Uploading: ' +(perc +1) +' %');
            }
            $.mobile.loading("hide");

        } catch (e) {
            console.log("========================================================error diri2");
            console.log(e);
            $('#upload_' + el_id).removeClass('fa-spinner').removeClass('fa-spin').addClass('fa-error');
            $('#upload_info_' + el_id).html('Uploading: ERROR');
            var msg = _ui.call_error_message(e);
            console.log('uploadFile -  FileTransfer Error: ' + msg);
            $.mobile.loading("hide");
        }

    },
    uploadFile_PPSTPDR: function (el_id, fileURI, idx, elid, elIDdb, position, report_id, callback) {
        var user = localdb.getUser();
        var job_id = $('#hf_stpdr_job_id').val();
        var options = new FileUploadOptions();

        options.fileKey = "file";
        options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.params = {
            token: user.token,
            user_id: user.user_id,
            job_id: job_id,
            company_id: user.company_id,
            el_id: elIDdb,
            report_id: report_id,
            name: options.fileName,
            position: position
        };

        if (isNaN(options.params.job_id)) options.params.job_id = 0;
        var img_tmpl = '<li class="list-group-item">' +
            '<i class="fa fa-2x fa-spinner fa-spin pull-left" id="upload_' + el_id + '" ></i>' +
            '<i id="upload_info_' + el_id + '">Uploading: 0 %</i></li>';

        try {
            $(_file_upload_images_list).append(img_tmpl);
            var ft = new FileTransfer();

            var _apiURI = 'https://api2.unitrak.com.au/api';
            ft.upload(fileURI, encodeURI(_apiURI + '/Reports/PostFormDataPPSTPDR'),
                function (r) {
                    if (callback) callback(idx + 1, elid, elIDdb, position, report_id);
                },
                function (err) {
                    var msg = _ui.call_error_message(e);
                }, options);

            ft.onprogress = function (progressEvent) {
                //perc = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
                //$('#upload_info_' + el_id).html('Uploading: ' +(perc +1) +' %');
            }
            $.mobile.loading("hide");

        } catch (e) {
            $('#upload_' + el_id).removeClass('fa-spinner').removeClass('fa-spin').addClass('fa-error');
            $('#upload_info_' + el_id).html('Uploading: ERROR');
            var msg = _ui.call_error_message(e);
            console.log('uploadFile -  FileTransfer Error: ' + msg);
            $.mobile.loading("hide");
        }

    },
    hide_processing: function () {
        //$('.main-form-content').show();
        _unitrak_ui_helper.hideLoadingWindow(_modalui);
    },
    show_processing: function () {
        $('.main-form-content').hide();
        _unitrak_ui_helper.showLoadingWindow(_modalui);

    },
    show_post_complete_button: function () {
        $('.btn-continue-after-post').removeClass('hidden');
    },
    _exec_post_forminfo: function (location) {
        _form_manager.event.save_element_value(undefined, function (data) {
            $.mobile.loading("show");

            var user = localdb.getUser();

            var elements = [];

            var model = {
                id: data.report_id,
                user_id: user.user_id,
                company_id: user.company_id,
                report_elements: elements,
                latitude: location.latitude,
                longitude: location.longitude
            };

            unitrak_api.ajax_post('/Reports/PostUserFormInfo/' + user.token + '/', model,
                function (data) {

                    jobeditpage.viewjobreport();
                    _form_manager.event.show_post_complete_button();
                    //unitrak_frm.postsignature(el_id, data, job_id, 2);

                    $('#processing_modal_display_edit_job').addClass('hidden');
                    __ui.alert('Posting Form Complete.');

                }, function (err) {
                    console.log(err.status + ' :  ' + err.statusText, 'Error Posting Form ');
                    _form_manager.event.hide_processing();
                    $('#processing_modal_display_edit_job').addClass('hidden');
                    _ui.alert(err.status + ' :  ' + err.statusText, 'Error Posting Form ');
                });

        }, true);
    },


    _exec_post_forminfo_: function (location) {
        _form_manager.event.save_element_value(undefined, function (data) {
            $.mobile.loading("show");

            var info_tmpl = '<li class="list-group-item">' +
                '<i class="fa fa-2x fa-spinner fa-spin pull-left" id="upload_xx" ></i>' +
                '<i id="upload_info_xx">Posting Form Data...</i></li>';
            $(_file_upload_images_list).append(info_tmpl);


            var user = localdb.getUser();
            // var report_id = $('#current-report-id').val();

            var elements = [];
            //for (var i = 0,l=data.elements.length; i < l; i++) {
            //     if (data.elements[i].type != 'image-canvas' && data.elements[i].type != 'image-camera') {
            //         elements.push(data.elements[i]);
            //     }
            //}


            var model = {
                id: data.report_id,
                user_id: user.user_id,
                company_id: user.company_id,
                report_elements: elements,
                latitude: location.latitude,
                longitude: location.longitude
            };

            //console.log('-----------------------------');
            //console.log(model);

            $.mobile.loading("show");
            unitrak_api.ajax_post('/Reports/PostUserFormInfo/' + user.token + '/', model,
                function (data) {

                    //sql_lite.post_report(model.id, model.latitude, model.longitude, function () {
                    //$('#upload_info_xx').html('Form Data Posted Successfully.');
                    //$('#upload_xx').removeClass('fa-spinner').removeClass('fa-spin').addClass('fa-check');

                    jobeditpage.viewjobreport();
                    _form_manager.event.show_post_complete_button();
                    unitrak_frm.postsignature(el_id, data, job_id, 2);

                    $('#processing_modal_display_edit_job').addClass('hidden');
                    __ui.alert('Posting Form Complete.');
                    //});
                }, function (err) {
                    console.log(err.status + ' :  ' + err.statusText, 'Error Posting Form ');
                    _form_manager.event.hide_processing();
                    _ui.alert(err.status + ' :  ' + err.statusText, 'Error Posting Form ');
                });

        }, true);
    },
    _save_and_post_report: function (location) {
        $.mobile.loading("show");
        //_form_manager.userGeoLocation = location;
        $(_file_upload_images_list).empty();

        if ($('.file-container.report-element img').length > 0) {
            this.execute_file_upload(0);
        } else {
            _form_manager.event._exec_post_forminfo(location);
        }
    },
    execute_file_upload: function (idx) {
        var img_el = $('.file-container.report-element img')[idx];
        var elid = $(img_el.parentElement).attr('id');
        if (elid != undefined) {
            var fileUri = $(img_el).attr('src');
            _form_manager.event.show_processing();
            _form_manager.event.uploadFile(elid, fileUri, idx, function (ret) {
                console.log('File Upload Complete. Executing Form Info post ...');
                var len = $('.file-container.report-element img').length;
                if (ret < len) {
                    //recursive
                    _form_manager.event.execute_file_upload(ret);
                } else {
                    _form_manager.event._exec_post_forminfo(location);
                }
            });
        }

    },
    execute_file_upload_stpdr: function (idx, elid, elIDdb, position, report_id) {
        var job_id =  $('#hf_stpdr_job_id').val();
        var img_el = $('.file-container.report-element.' + elid + ' img')[idx];
        if (elid != undefined) {
            var fileUri = $(img_el).attr('src');
            //_form_manager.event.show_processing();
            _form_manager.event.uploadFile_STPDR(elid, fileUri, idx, elid, elIDdb, position, report_id, function (ret) {
                var len = $('.file-container.report-element.' + elid + ' img').length;
                if (ret < len) {
                    //recursive
                    _form_manager.event.execute_file_upload_stpdr(ret, elid, elIDdb, position, report_id);
                } else {
                    stpdr_Script.get_img_list(job_id, report_id, position, function (data) {
                        stpdr_Script.reload_img_list(data, position, report_id);
                    });
                    $.mobile.loading("hide");
                }
            });
        }
    },
    execute_file_upload_ppstpdr: function (idx, elid, elIDdb, position, report_id) {
        var job_id =  $('#hf_stpdr_job_id').val();
        var img_el = $('.file-container.report-element.' + elid + ' img')[idx];
        if (elid != undefined) {
            var fileUri = $(img_el).attr('src');
            _form_manager.event.uploadFile_PPSTPDR(elid, fileUri, idx, elid, elIDdb, position, report_id, function (ret) {
                var len = $('.file-container.report-element.' + elid + ' img').length;
                if (ret < len) {
                    //recursive
                    _form_manager.event.execute_file_upload_ppstpdr(ret, elid, elIDdb, position, report_id);
                } else {
                    ppstpdr_Script.get_img_list(job_id, report_id, position, function (data) {
                        ppstpdr_Script.reload_img_list(data, position, report_id);
                    });
                    $.mobile.loading("hide");
                }
            });
        }
    },
    execute_post_report: function (btn) {
        var report_id = $('#current-report-id').val();
        _form_manager.event._save_and_post_report({ latitude: 0, longitude: 0 });
    },
    post_report: function () {

        sql_offline.get_imode_callback(
            function (status) {
                if (status == 1) { //offline
                    unitrak_mobile.showErrorMessage('Offline mode does not support posting of form report!');
                    __ui.alert('Posting failed! Please post your form report in online mode!');
                }
                else {
                    var message = "Do you really want post.  Further Editing on mobile will not be possible?";
                    navigator.notification.confirm(message, function (i) {
                        if (i == 1) {
                            $('#processing_modal_display_edit_job').removeClass('hidden');
                            $('#processing_modal_display_edit_job_html').html('Please wait... posting form...');
                            _form_manager.event._exec_post_forminfo({ latitude: 0, longitude: 0 });
                        }
                    }, 'Confirm Form Posting', ['YES', 'CANCEL'])

                }
            });
    },
    get_reportlist: function () {
        $.mobile.loading("show");
        var user = localdb.getUser();
        if (user.id > 0) {

            sql_offline.get_imode_callback(
                function (status) {
                    if (status == 1) { //offline
                        sql_lite.get_reportlist_data(
                            function (data) {
                                var pre = '<option value="-1">Please Select</option>';
                                $('#ddl_report_list').html(pre + data);
                                $('#ddl_report_list').val(-1).selectmenu("refresh");
                            }
                        );
                    }
                    else {
                        var uri = '/reports/GetPostedReports/' + user.token + '/';
                        unitrak_api.ajax(uri, { user_id: user.id, company_id: user.company_id }, function (data) {
                            sql_lite.save_reportlist_data(data,
                                function (data) {
                                    var pre = '<option value="-1">Please Select</option>';
                                    $('#ddl_report_list').html(pre + data);
                                    $('#ddl_report_list').val(-1).selectmenu("refresh");
                                }
                            );
                        }, function (err) {
                            unitrak_mobile._showError(err);
                        });
                    }
                }
            );



        }
        $.mobile.loading("hide");
    },
    addreporttolist: function () {
        $.mobile.loading("show");
        var user = localdb.getUser();
        var job_id = $('#hf_job_id').val();
        var report_id = $('#ddl_report_list').val();

        sql_offline.get_imode_callback(
            function (status) {
                if (status == 1) { //offline

                }
                else {
                    if (report_id != -1) {
                        if (report_id == "001RSA") {
                            _form_manager.event.addotherreport(1);
                        }
                        else if (report_id == "002RSA") {
                            _form_manager.event.addotherreport(2);
                        }
                        else {

                            var model = {
                                token: user.token,
                                company_id: user.company_id,
                                user_id: user.id,
                                name: user.name,
                                job_id: job_id,
                                report_id: report_id,
                                blank: ""
                            };

                            var uri = '/reports/PostAddReportToJob/' + user.token + '/'
                            unitrak_api.ajax_post(uri, model, function (data) {
                                reports.getreports();
                                //unitrak_frm.get_user_form(job_id);
                            }, function (err) {
                                unitrak_mobile._showError(err);
                            });
                        }
                    }
                }
            }
        );
    },
    addotherreport: function(type) {
        var user = localdb.getUser();
        var job_id = $('#hf_job_id').val();

        var model = {
            token: user.token,
            company_id: user.company_id,
            user_id: user.id,
            job_id: job_id,
            blank: ""
        };

        if(type == 1){
            var uri = '/reports/PostAdd_STPDR_ReportToJob/' + user.token + '/'
            unitrak_api.ajax_post(uri, model, function (data) {
                reports.getreports();
            }, function (err) {
                unitrak_mobile._showError(err);
            });
        }
        else if(type == 2){
            var uri = '/reports/PostAdd_PPSTPDR_ReportToJob/' + user.token + '/'
            unitrak_api.ajax_post(uri, model, function (data) {
                reports.getreports();
            }, function (err) {
                unitrak_mobile._showError(err);
            });
        }
    },
    process_element_value: function (element, callback) {
        1
        var htmltype = element.type;
        if (htmltype == 'input-number' || htmltype == 'input-email' || htmltype == 'input-address' || htmltype == 'input-text' || htmltype == 'input-date' || htmltype == 'input-time') {
            $('#txt_' + element.el_id).val(element.value);
        }
        else if (htmltype == 'image-canvas' || htmltype == 'image-camera') {
            if (element.value != undefined)
                $('#' + element.el_id).html(element.value);
        }
        else if (htmltype == 'checkbox' || htmltype == 'radio')
            if (element.value === true) {
                $('#' + element.el_id).attr('checked', 'checked').attr('data-type', 'input-' + htmltype);
            } else {
                $('#' + element.el_id).attr('data-type', 'input-' + htmltype);
            }
        else if (htmltype == 'heading' || htmltype == 'sub-heading' || htmltype == 'page-label') {
            $('#' + element.el_id).attr('data-type', htmltype);
        }
    },
    save_element_value: function (btn, callback, noalert) {
        $('#processing_modal_display_edit_job').removeClass('hidden');
        $('#processing_modal_display_edit_job_html').html('Please wait... saving form...');

        $.mobile.loading("show");
        var report_id = $('#current-report-id').val();

        var user = localdb.getUser();
        var job_id = $('#hf_job_id').val();
        var jsonparam = { company_id: user.company_id, user_id: user.user_id, report_id: report_id };


        sql_offline.get_imode_callback(
            function (status) {
                if (status == 1) { //offline

                    var _maincontent = $('.form-element-list').html();
                    unitrak_frm.save_offline_form_db(_maincontent, job_id, report_id);
                    __ui.alert('Form Data Successfully Saved Offline.');
                    $.mobile.loading("hide");
                    $('#processing_modal_display_edit_job').addClass('hidden');
                    $('#lbl_ur_offline').removeClass("hidden");

                }
                else {

                    var uri = '/reports/GetUserForm/' + user.token + '/';
                    unitrak_api.ajax(uri, jsonparam, function (data) {
                        var user_report = data.user_report;
                        var images = data.images;
                        var json = $.parseJSON(data.user_report.json);

                        var elements = [];
                        $('.text-element-container input').each(function (i, v) {
                            var htmltype = $(this).attr('data-type');
                            if (htmltype == 'input-number' || htmltype == 'input-email' || htmltype == 'input-address' || htmltype == 'input-text' || htmltype == 'input-date' || htmltype == 'input-time') {
                                var accesskey = $(this).attr('accesskey');
                                var value = $(this).val();
                                json.elements[accesskey].value = value;
                            }
                        });


                        var _actual_element_no = 0;
                        var _actual_value = "";
                        $('.rc-input-column input').each(function (i, v) {
                            var _tdid = $(this).attr('id');
                            var _element_no = $('#hf_en_' + _tdid).val();
                            var _choice_no = $('#hf_cn_' + _tdid).val();

                            if (_element_no != undefined) {

                                var _selected = $(this).is(':checked');

                                json.elements[_element_no].choices[_choice_no].selected = _selected;

                                if (_element_no != _actual_element_no) {
                                    json.elements[_actual_element_no].value = _actual_value;
                                    _actual_value = "";
                                }

                                if (_selected == true) {
                                    if (_actual_value == "") {
                                        _actual_value += json.elements[_element_no].choices[_choice_no].text;
                                    }
                                    else {
                                        _actual_value += ", " + json.elements[_element_no].choices[_choice_no].text;
                                    }
                                }

                                _actual_element_no = _element_no;
                            }
                        });



                        $('.file-container.report-element').each(function () {
                            //var _felement_no = $(this).attr('data-element-no');

                            //user_report.elements[accesskey].value = value;
                            //elements.push({
                            //                                             el_id: $(this).attr('id'),
                            //                                             report_id: report_id,
                            //                                             report_el_id: $(this).attr('id'),
                            //                                             value: $(this).html(),
                            //                                             type: $(this).attr('data-type')
                            //                                             });
                        });

                        if ($('.pad').length > 0) {
                            $('.pad').each(function () {
                                var id = $(this).attr('id');
                                var el_id = id.split('_')[1] + "_" + id.split('_')[2];
                                var _selement_no = $('#div_' + id).attr('data-element-no');

                                var sig_img = $('#output_' + el_id).val();
                                var canvass = $("#pad_" + el_id).get(0);
                                var data = canvass.toDataURL();
                                data = data.replace('data:image/png;base64,', '');
                                var job_id = $('#hf_job_id').val();
                                unitrak_frm.postsignature(el_id, data, job_id, 1);
                                json.elements[_selement_no].value = sig_img;
                            });
                        }


                        var job_id = $('#hf_job_id').val();

                        if (report_id != -1) {
                            var _json = JSON.stringify(json);
                            var rmodel = {
                                company_id: user.company_id,
                                user_id: user.id,
                                json: _json,
                                report_id: report_id,
                                blank: "",
                            };
                            //console.log(json);
                            var uri = '/reports/PostUpdateUserPostedReport/' + user.token + '/'
                            unitrak_api.ajax_post(uri, rmodel, function (data) {

                                $.mobile.loading("show");
                                if ($('.file-container.report-element img').length > 0) {
                                    $('#processing_modal_display_edit_job_html').html('Please wait... uploading pictures...');
                                    _form_manager.event.execute_file_upload_onsave(0);
                                }
                                else {
                                    $.mobile.loading("hide");
                                    $('#processing_modal_display_edit_job').addClass('hidden');
                                }

                                if (noalert === true) {
                                    callback({
                                        report_id: report_id,
                                        //elements: elements
                                    });
                                    return;
                                };
                                //Please wait... saving form/uploading pictures..
                                __ui.alert('Form Data Successfully Saved.');

                                unitrak_frm.get_offline_form_db(job_id, report_id, function (data) {
                                    if (data == "") {
                                    }
                                    else {
                                        unitrak_frm.delete_formdata_offline(report_id);
                                        $('#lbl_ur_offline').addClass("hidden");
                                    }
                                });


                            }, function (err) {
                                unitrak_mobile._showError(err);
                            });
                        }

                    }, function (err) {
                        _unitrak_ui_helper.hideLoadingWindow();
                        _unitrak_ui_helper.showErrorMessage(err);
                    });



                }
            }
        );


    },
    execute_file_upload_onsave: function (idx) {
        $.mobile.loading("show");
        var img_el = $('.file-container.report-element img')[idx];
        var elid = $(img_el.parentElement).attr('id');
        if (elid != undefined) {
            var fileUri = $(img_el).attr('src');
            _form_manager.event.show_processing();
            _form_manager.event.uploadFile(elid, fileUri, idx, function (ret) {
                console.log('File Upload Complete. Executing Form Info post ...');
                var len = $('.file-container.report-element img').length;
                if (ret < len) {
                    //recursive
                    _form_manager.event.execute_file_upload_onsave(ret);
                } else {
                    $('#processing_modal_display_edit_job').addClass('hidden');
                    $.mobile.loading("hide");
                    __ui.alert('Form Images Successfully Saved.');
                    var report_id = $('#current-report-id').val();
                    reports.getreportform(report_id);
                }
            });
        }

    },

};


function onclick_collapse_h(id, headno) {
    var status = $('#hf_hc_' + id).val()
    if (status == '1') {
        $('#ih-' + id).removeAttr('class');
        $('#ih-' + id).addClass('head_icon fa fa-plus-square fa-2x')
        $('#hf_hc_' + id).val("0");
        $('.head_' + headno).each(function () {
            $(this).addClass('hidden');
        });
        //console.log(_headarray);
        for (i = 0; i < _headarray.length; i++) {
            if (id == _headarray[i].h_el_id) {
                $('#' + _headarray[i].hid).val("0");
                if (_headaruray[i].iscollapse == true) {
                    $('.subhead_' + _headarray[i].subhead).each(function () {
                        $(this).addClass('hidden');
                    });
                    $('#is-' + _headarray[i].id).removeAttr('class');
                    $('#is-' + _headarray[i].id).addClass('head_icon fa fa-plus-circle fa-2x')
                }
                else {
                    $('.subhead_' + _headarray[i].subhead).each(function () {
                        $(this).addClass('hidden');
                    });
                }
            }
        }
    }
    else {
        $('#ih-' + id).removeAttr('class');
        $('#ih-' + id).addClass('head_icon fa fa-minus-square fa-2x')
        $('#hf_hc_' + id).val("1");
        $('.head_' + headno).each(function () {
            if ($(this).hasClass("haslink") == false) { $(this).removeClass('hidden'); }
        });

        for (i = 0; i < _headarray.length; i++) {
            if (id == _headarray[i].h_el_id) {
                if (_headarray[i].iscollapse == false) {
                    $('.subhead_' + _headarray[i].subhead).each(function () {
                        $(this).removeClass('hidden');
                    });
                }
            }
        }
    }
}

function onclick_collapse_sh(id, subheadno) {
    var status = $('#hf_shc_' + id).val();
    if (status == '1') {
        $('#is-' + id).removeAttr('class');
        $('#is-' + id).addClass('head_icon fa fa-plus-circle fa-2x')
        $('#hf_shc_' + id).val("0");
        $('.subhead_' + subheadno).each(function () {
            $(this).addClass('hidden');
        });
    }
    else {
        $('#is-' + id).removeAttr('class');
        $('#is-' + id).addClass('head_icon fa fa-minus-circle fa-2x')
        $('#hf_shc_' + id).val("1");
        $('.subhead_' + subheadno).each(function () {
            var _haslink = $(this).hasClass('haslink');
            if (_haslink == false) {
                $(this).removeClass('hidden');
            }
            else {
                $(this).addClass('hidden');
            };
        });
    }
}


function start_form(id, elements, callback) {
    var parentid = '.form-element-list';
    if (elements == undefined)
        elements = $.parseJSON($(_hf_elements).val());
    __ui.writelog('element count: ' + elements.length);
    unitrak_frm.render_report(elements, parentid, function () {
        $('.panel-form-data').removeClass('hidden');
        $('#rpt-list').addClass('hidden');

        //$('.navbar-savepost-form').removeClass('hidden');
        //$('.navbar-start-form').addClass('hidden');
        sql_lite.update_report_status(id);
        if (callback != undefined) callback();
    });
}


Date.prototype.defaultView = function () {
    var dd = this.getDate();
    if (dd < 10) dd = '0' + dd;
    var mm = this.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
    var yyyy = this.getFullYear();
    return String(dd + "\/" + mm + "\/" + yyyy)
}




function _get_treatment_details(id) {
    var treatmentame = $('#treatment-' + id).html();
    $('#hf_treatmentID').val(id);
    $('ul#add-treatment li').attr('class', 'ui-screen-hidden');
    job.addtreatment(id, treatmentame);
}

function _update_treatment_details(html, id) {
    var treatmentame = $('#treatment-' + id).html();
    $('#hf_treatmentID').val(id);
    $('ul#edit-treatment li').attr('class', 'ui-screen-hidden');
    var _value = $('#treatment-' + id).html();
    //$('#tb_treatmentname').val(_value);
    //$(this).parent().find('input').val(_value);
    //$('ul#edit-treatment li').attr('class', 'ui-screen-hidden');
    job.loadupdatedobtreatmentdetails(id, _value);
    //job.updatetreatment(id, treatmentame);
}



function checkcompany() {
    $('#rb_iyes').click();
    $('#rb_iyes').attr('checked', 'checked');
    $('#rb_iyes').checkboxradio("refresh");
    $('#hf_isel').val('2')
    var hf_isel = $('#hf_isel').val();
    $("#btn_rb_iyes").removeClass('btn-white-click');
    $("#btn_rb_iyes").addClass('btn-red-click');
    $("#btn_rb_ino").removeClass('btn-red-click');
    $("#btn_rb_ino").addClass('btn-white-click');
}

function job_add_invoice() {
    $('#rb_iyes').click();
    $('#rb_iyes').attr('checked', 'checked');
    $('#rb_iyes').checkboxradio("refresh");
    $('#hf_isel').val('2');
    $("#btn_rb_iyes").removeClass('btn-white-click');
    $("#btn_rb_iyes").addClass('btn-red-click');
    $("#btn_rb_ino").removeClass('btn-red-click');
    $("#btn_rb_ino").addClass('btn-white-click');
}    

function job_dont_add_invoice() {
    $('#rb_ino').click();
    $('#rb_ino').attr('checked', 'checked');
    $('#rb_ino').checkboxradio("refresh");
    $('#hf_isel').val('1');
    $("#btn_rb_iyes").removeClass('btn-red-click');
    $("#btn_rb_iyes").addClass('btn-white-click');
    $("#btn_rb_ino").removeClass('btn-white-click');
    $("#btn_rb_ino").addClass('btn-red-click');
}    

function todayjobs() {
    $('#btn-job-queue').html('Today');
    jobpage.showjobschedule('today');
}    

function pastjobs() {
    $('#btn-job-queue').html('Past');
    jobpage.showjobschedule('yesterday'); 
}    

function tomorrowjobs() {
    $('#btn-job-queue').html('Tomorrow');
    jobpage.showjobschedule('tomorrow');
}    


function btnselect_dc() {
    $('#mc_rb_dc').click();
    $('#mc_rb_dc').attr('checked', 'checked');
    $('#mc_rb_dc').checkboxradio("refresh");
    $("#btn_rb_datecreated").removeClass('btn-white-click');
    $("#btn_rb_datecreated").addClass('btn-red-click');
    $("#btn_rb_currentotherdate").removeClass('btn-red-click');
    $("#btn_rb_currentotherdate").addClass('btn-white-click');
}    

function btnselect_cd() {
    $('#mc_rb_cd').click();
    $('#mc_rb_cd').attr('checked', 'checked');
    $('#mc_rb_cd').checkboxradio("refresh");
    $("#btn_rb_datecreated").removeClass('btn-red-click');
    $("#btn_rb_datecreated").addClass('btn-white-click');
    $("#btn_rb_currentotherdate").removeClass('btn-white-click');
    $("#btn_rb_currentotherdate").addClass('btn-red-click');
}    

function edijob_add_invoice() {
    $('#rb_iyes').click();
    $('#rb_iyes').attr('checked', 'checked');
    $('#rb_iyes').checkboxradio("refresh");
    $('#hf_isel').val('2');
    $("#btn_ejrb_iyes").removeClass('btn-white-click');
    $("#btn_ejrb_iyes").addClass('btn-red-click');
    $("#btn_ejrb_ino").removeClass('btn-red-click');
    $("#btn_ejrb_ino").addClass('btn-white-click');
}    

function editjob_dont_add_invoice() {
    $('#rb_ino').click();
    $('#rb_ino').attr('checked', 'checked');
    $('#rb_ino').checkboxradio("refresh");
    $('#hf_isel').val('1');
    $("#btn_ejrb_iyes").removeClass('btn-red-click');
    $("#btn_ejrb_iyes").addClass('btn-white-click');
    $("#btn_ejrb_ino").removeClass('btn-white-click');
    $("#btn_ejrb_ino").addClass('btn-red-click');
}    

function sendemailui(job_id, contact, email){
    sql_offline.get_imode_callback(
        function (status) {
            if (status == 1) { //offline
                unitrak_mobile.showErrorMessage('Offline mode does not support this email feature at the moment!');
                return;
            }
        }
    );

    var pfx = _ui.calc_prefix();
    if(pfx == 'edit-job-'){
        $('#hf_email_type').val(1);
        $('#editjob-client-detail').addClass('hidden');
    }

    unitrak_mobile_ui.showjobemailui(job_id,job_id,$.trim(contact),$.trim(email));
}

function invoice_emailui(type){

    sql_offline.get_imode_callback(
        function (status) {
            if (status == 1) { //offline
                unitrak_mobile.showErrorMessage('Offline mode does not support this email feature at the moment!');
                return;
            }
        }
    );

    var job_id = 0;
    var contact = "";
    var email = "";
    if(type == 1){
        $('#hf_isreceipt').val(1);
    }
    else {
        $('#hf_isreceipt').val(2);
    }

    var pfx = _ui.calc_prefix();
    if(pfx == 'jobs-') {
        job_id = $("#hfseljobID").val();
        contact = $("#hf_job_contactname_" + job_id).val();
        email = $("#hf_job_email_" + job_id).val();
        $('#jobpage-adinvoice').hide();
    }
    else if(pfx == 'edit-job-') {
        job_id = unitrak_mobile.get_query_string_value('id');
        contact = $('#select-contact-html').html();
        email = $("#hf_job_email").val();
        $('#editjob-client-invoice').hide();
        $('#hf_email_type').val(2);
    }
    unitrak_mobile_ui.showjobemailui(job_id,job_id,$.trim(contact),$.trim(email),type);
}


function invoice_sendemailui(type, page){
    sql_offline.get_imode_callback(
        function (status) {
            if (status == 1) { //offline
                unitrak_mobile.showErrorMessage('Offline mode does not support this email feature at the moment!');
                return;
            }
        }
    );

    if(page == "job") {
        if(type == 1) { //invoice

        }
        else { //receipt
    
        }
    }
}


function editjob_changedate(){
    $('#btn-save-details-update').removeClass('hidden');
    $('#p-jobdate').addClass('hidden');
    $('#div-jobdate').removeClass('hidden');
}

function editjob_changeime(){
    $('#btn-save-details-update').removeClass('hidden');
    $('#p-jobtime').addClass('hidden');
    $('#div-jobstarttime').removeClass('hidden');
    $('#div-jobendtime').removeClass('hidden');
}

function cancljob_changedate(){
    $('#btn-save-details-update').addClass('hidden');
    $('#p-jobdate').removeClass('hidden');
    $('#div-jobdate').addClass('hidden');
    $('#p-jobtime').removeClass('hidden');
    $('#div-jobstarttime').addClass('hidden');   
    $('#div-jobendtime').addClass('hidden');   
}

function btn_highlight(btn_id,classname,hf,id,fnc,type_id,station_id){
    $('.' + classname).removeClass('btn-white-click');
    $('.' + classname).removeClass('btn-red-click');
    $('.' + classname).addClass('btn-white-click');
    $('#' + btn_id).removeClass('btn-white-click');
    $('#' + btn_id).addClass('btn-red-click');
    $('#' + hf).val(id);

    if(fnc != undefined){
        if(fnc == "inspected"){
            onchange_inspect('' + type_id + '','' + station_id + '')
        }
        else if(fnc == 'activity'){
            onchnage_detect_activity('' + type_id + '','' + station_id + '');
        }
        else if(fnc == 'station-bait'){
            if(id > 0){
                if(station_id > 1){
                    var _total_station = $('#hf_last_station_number').val();
                    for (i = (station_id - 1) ; i > 0; i--) {
                        var _previous_value = $('#hf_' + type_id + '_' + i + '_station_activity').val();
                        if (_previous_value == 'true') {
                            var _previous_station_bait = $('#hf_' + type_id + '_' + i + '_station_bait').val();
                            if(_previous_station_bait > 0){
                                var _previous_batch_no = $('#' + type_id + '_' + i + '_batch_no').val();
                                $('#' + type_id + '_' + station_id + '_batch_no').val(_previous_batch_no);
                                break;
                            }
                        }
                    }
                }
                $('#' + type_id + '_' + station_id + '_station_volume').val('');
            }
            else{
                $('#' + type_id + '_' + station_id + '_station_volume').val('0');
                $('#' + type_id + '_' + station_id + '_batch_no').val('');
            }
            //onchnage_detect_activity('' + type_id + '','' + station_id + '');
        }
    }


}

function btn_green_highlight(el){
    $('#' + el).addClass('btn-green-click');
}

function viewhide_station(btn_id,panelname,hf,type,station){
    var _inspected = $('#hf_' + type + '_' + station + '_station_inspected').val();
    if (_inspected == 'true') {
        btn_green_highlight(btn_id);
    }

    var hf_value = $('#' + hf).val();
    if(hf_value == "1" ){
        $('#' + btn_id).removeClass('hidden');
        $('#' + panelname).addClass('hidden');           
        $('#' + hf).val('0');
        $('html, body').animate({
            scrollTop: $('#'+ btn_id).offset().top - 300
        }, 200);
    }
    else{
        $('#' + btn_id).addClass('hidden');
        $('#' + panelname).removeClass('hidden');
        $('#' + hf).val('1');
    } 
}

function ablebutton(classname){
    $('.' + classname).removeClass('ui-disabled');
}

function disablebutton(classname){
    $('.' + classname).addClass('ui-disabled');
}

String.prototype.replaceAll = function(searchStr, replaceStr) {
    var str = this;
    
    // escape regexp special characters in search string
    searchStr = searchStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    
    return str.replace(new RegExp(searchStr, 'gi'), replaceStr);
};

