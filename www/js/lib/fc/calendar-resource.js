function se_drag_job(id) {
    $('#sel_warranty_id').val(id);
}

function viewunassignedjob_drag() {
    $('#div_unsassigned_job_drag').show();
    $('#div_warranty_job_drag').hide();
}

function viewwarrattiesjob_drag() {
    $('#div_warranty_job_drag').show();
    $('#div_unsassigned_job_drag').hide();
}


function viewunassignedjob() {
    $('#div_unsassigned_job').show();
    $('#div_warranty_job').hide();
}

function viewwarrattiesjob() {
    $('#div_warranty_job').show();
    $('#div_unsassigned_job').hide();
}

function _printscheduler() {
    var moment = $('#job-calendar').fullCalendar('getDate');
    var _date = moment.format();
    var _witht = _date.split('T')[1];
    var _date_split;
    if (_witht == undefined) {
        _date_split = _date.split('-')[2] + "/" + _date.split('-')[1] + "/" + _date.split('-')[0]
    }
    else {
        _date_split = _date.split('-')[2].split('T')[0] + "/" + _date.split('-')[1] + "/" + _date.split('-')[0]
    }

    var list = new Array();
    list.push({ 'Name': 'start_date', 'Value': _date_split });
    intTec.ajax2("/invoices-invoiced.aspx/AddSession", JSON.stringify({ 'list': list }),
        function (data) {
        }, function (err) {
            unitrakCmn.showErrorMessage(err, null, 'Error executing AddSession.', true);
        });

    document.location.href = "/csv/scheduler_print.aspx";
}


function _show_ujdw() {
    $('#show_ujdw').show();
    $('#hide_ujdw').hide();
    $('#div_ujdw').show();
}

function _hide_ujdw() {
    $('#show_ujdw').hide();
    $('#hide_ujdw').show();
    $('#div_ujdw').hide();
}

function _get_div_bookedjobs() {
    var _sb = $('#ddl_ShowBy').val();
    var tmp_div_booked_ps = '<option value="-1">Please Select</option>';
    var tmp_div_booked = '{{#lb_Booked}}<option value="{{ID}}">{{Display}}</option>{{/lb_Booked}}';
    var tmp_div_booked_div = '{{#lb_Bookeddiv}}<div id="{{ID}}" name="job" onclick="se_drag_job({{ID}})" class="fc-event" style=" margin-top:5px; margin-bottom:5px; border-radius: 4px; border-color: #46b8da;" title="Drag to schedule"><div style=" margin:5px">{{Display}}</div></div>{{/lb_Bookeddiv}}';
    intTec.ajax('Get_BookedJobs', JSON.stringify({ 'showBy': _sb, 'lunchID': 7551, 'leaveID': 7580, 'extras': 0 }),
    function (data) {
        var list = jQuery.parseJSON(data.d);
        var json = { 'lb_Booked': list }
        var json_div = { 'lb_Bookeddiv': list }
        var html = kite(tmp_div_booked, json);
        var html_div = kite(tmp_div_booked_div, json_div);
        $('#sel_lb_Booked').html(tmp_div_booked_ps + html);
        $('#external-events').empty();
        $('#external-events').append(html_div);

        $('#external-events .fc-event').each(function () {

            // store data so the calendar knows to render an event upon drop
            $(this).data('event', {
                title: $.trim($(this).text()), // use the element's text as the event title
                stick: true // maintain when user navigates (see docs on the renderEvent method)
            });

            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex: 999,
                //revert: true,      // will cause the event to go back to its
                //revertDuration: 0  //  original position after the drag
                revert: 'invalid',
                scroll: false,
                //containment: '#tagFun_div_main',
                helper: 'clone',
                start: function () {
                    this.style.display = "none";
                },
                stop: function () {
                    this.style.display = "";
                },


            });

            $('.draggable').data('duration', '01:00');
        });

    }, function (err) {
        unitrakCmn.showErrorMessage(err, null, 'Error...', true);
    });
}

function _get_div_bookedjobsdw() {
    var _sb = $('#ddl_ShowByW').val();
    var tmp_div_bookeddw_ps = '<option value="-1">Please Select</option>';
    var tmp_div_bookeddw = '{{#ddl_ShowByW}}<option value="{{ID}}">{{Display}}</option>{{/ddl_ShowByW}}';
    var tmp_div_bookeddw_div = '{{#lb_Bookeddivw}}<div id="{{ID}}" name="warranty" onclick="se_drag_job({{ID}})" class="fc-event" style=" margin-top:5px; margin-bottom:5px; border-radius: 4px; border-color: #46b8da;" title="Drag to schedule"><div style=" margin:5px">{{Display}}</div></div>{{/lb_Bookeddivw}}';
    intTec.ajax('Get_JobWarranties', JSON.stringify({ 'CustomerID': 0, 'Filter': '', 'Showby': _sb, 'Status': 3, 'SortOrder': 1, 'WarrantyID': 0, 'type': 0 }),
    function (data) {
        var list = jQuery.parseJSON(data.d);
        var json = { 'ddl_ShowByW': list }
        var json_div = { 'lb_Bookeddivw': list }
        var html = kite(tmp_div_bookeddw, json);
        var html_div = kite(tmp_div_bookeddw_div, json_div);
        $('#sel_lb_Bookeddw').html(tmp_div_bookeddw_ps + html);
        $('#external-events-warranty').empty();
        $('#external-events-warranty').append(html_div);

        $('#external-events-warranty .fc-event').each(function () {

            // store data so the calendar knows to render an event upon drop
            $(this).data('event', {
                title: $.trim($(this).text()), // use the element's text as the event title
                stick: true // maintain when user navigates (see docs on the renderEvent method)
            });

            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex: 999,
                //revert: true,      // will cause the event to go back to its
                //revertDuration: 0  //  original position after the drag
                revert: 'invalid',
                scroll: false,
                //containment: '#tagFun_div_main',
                helper: 'clone',
                start: function () {
                    this.style.display = "none";
                },
                stop: function () {
                    this.style.display = "";
                },
            });


            $('.draggable').data('duration', '01:00');


        });


    }, function (err) {
        unitrakCmn.showErrorMessage(err, null, 'Error...', true);
    });
}

function _viewjob_drag() {
    var jid = $('#sel_warranty_id').val();

    if (jid > 0) {
        window.location = 'Job.aspx?id=' + jid + '&redi=schedule';
    }
    else {
        dpm1.message_error('Action Error: Please select a booked job to view.');
    }
}

function _viewjwarranty_drag() {
    var wid = $('#sel_warranty_id').val();

    if (wid > 0) {
        window.location = 'Warranties.aspx?wi=' + wid;
    }
    else {
        dpm1.message_error('Action Error: Please select a job to view.');
    }
}

function _viewjob() {
    var jid = $('#sel_lb_Booked :selected').val();

    if (jid > 0) {
        window.location = 'Job.aspx?id=' + jid + '&redi=schedule';
    }
    else {
        dpm1.message_error('Action Error: Please select a booked job to view.');
    }
}

function _viewjwarranty() {
    var wid = $('#sel_lb_Bookeddw :selected').val();

    if (wid > 0) {
        window.location = 'Warranties.aspx?wi=' + wid;
    }
    else {
        dpm1.message_error('Action Error: Please select a job to view.');
    }
}

function _getallscheddates(date) {
    intTec.ajax2("/calendar-resource.aspx/GetCalendarFreeBusy2", JSON.stringify({ 'start': date }),
        function (data) {
            var c = jQuery.parseJSON(data.d);
            $('#hf_activedates').val(c.Job_Date);
            $("#hf_nav_picker").datepicker("refresh");
        },
        function (err) {
            unitrakCmn.showErrorMessage(err, null, 'Error...', true);
        });

}


function renderCalendarCallback(date) {
    var _dd = $('#hf_activedates').val();
    var _split;
    if (_dd == "") {
        var _test = "";
        var _split = _test.split(",");
    }
    else {
        var _split = _dd.split(",");
    }

    var m = date.getMonth(), d = date.getDate(), y = date.getFullYear();
    for (i = 0; i < _split.length; i++) {
        if ($.inArray(y + '-' + (m + 1) + '-' + d, _split) != -1) {
            return [true, 'Busy', ''];
        }
    }
    return [true, "Free"];
}

function _go_resource(id) {
    window.location = "calendar-resource.aspx?id=" + id;
}


var monthview = (function () {
    return {
        show_timesheet: function (jid, jnum) {
            $('#add_timesheet_modal').modal({ backdrop: 'static' });
        },
        initshowjobtimesheetentries: function (jid) {
            jobfc.initshowjobtimesheetentries(jid);
        },
        savetimesheetentry: function () {
            jobfc.savetimesheetentry();
        },
        closesheetentry: function () {
            jobfc.closesheetentry();
        }
    }
}());
var dpm1 = (function () {
    var statusbar = '#fccalendar-message';
    return {
        message: function (msg) {
            $(statusbar).removeClass('hidden').addClass('text-primary');
            $(statusbar).html('<i class="fa fa-info-circle"></i> ' + msg);
            setTimeout(function () { $(statusbar).addClass('hidden').removeClass('text-success'); }, 3000);
        },
        message_error: function (msg) {
            $(statusbar).removeClass('hidden');
            $(statusbar).html('<i class="fa fa-warning"></i> ' + msg).addClass('text-danger');
            setTimeout(function () { $(statusbar).addClass('hidden').removeClass('text-danger'); }, 4000);

        }
    }
}());
var jobfc = (function () {
    var _service_uri = '/calendar-resource.aspx/', _copy = 'copy', _move = 'move', _cut = 'cut', _moveto = false;
    var msgElID = 'div#main_calendar_job_display', calElID = 'div#main_calendar_search_result_display', caljobElID = 'div#main_calendar_job_display_child1';
    var clipboard = { jobID: 0, action: '', techID: 0 }, selectedcell = {};
    var _event = {}; // stores the selected event
    var _date = {}; // stores the selected day
    var eventdate = {}, timesheets = {};
    var mobile = $('#mobileView').val();
    return {
        resources: function () {
            var resources = [];
            var list = $('#calendar-resources').val().split(';');
            for (var i = 0, l = list.length; i < l; i++) {
                var res = list[i].split('|')
                if (res[0] > 0) {
                    resources.push({
                        id: res[0],
                        name: res[1],
                        color: 'gray',
                    })
                }
            }
            return resources;

        },
        getusercalendar: function (uid) {
            //dpm1.message("Loading data. Please wait...");
            $('#calendar-selected-staff-id').val(uid);
            jobfc.reloadCalendarEvents();
        },
        set_button_state: function (btn) {
            $(btn).button('loading');
            $('.go-button').click();
            return true;
        },
        showwaitmessage: function (msg) {
            if (msg)
                dpm1.message(msg);
            else
                dpm1.message('please wait while executing action...');
        },
        closedisplay: function (t) {
            $(caljobElID).empty();
        },
        _createmenu: function (clientX, clientY, html) {
            this.emptypopdisplay();
            $(caljobElID).append(html).attr('style', 'position:absolute;z-index:9999;top:' + (clientY - 175) + 'px;left:' + (clientX - 250) + 'px').addClass('data-hover-info-visible').slideDown();
        },
        show_event_menu: function (data) { //event menu
            $("#main_calendar_job_display_child1").html("");
            _event = data.event;
            var _start = _event.start.toJSON().split('T')[0] + ' ' + _event.start.toJSON().split('T')[1].replace('Z', '');
            var i = "'" + _start + "'";

            if ((_event.type == "lock") || (_event.type == "leave") || (_event.type == "lunch")) {
                var actions = '<div id="modal-container" style=position:absolute;top:0;left:0></div>' +
                '<div style="height:25px"><i class="fa fa-book" style=" width:15px;"></i> <a href="#" class="btn btn-link" onclick="jobfc.viewschedulenote(' + _event.id + '); ">Edit Job Note</a></div>' +
                '<div style="height:25px"><i class="fa fa-times" style=" width:15px;"></i> <a href="#" class="btn btn-link"  onclick="jobfc.deleteotherschedule(' + _event.jobID + ',' + _event.id + ',' + _event.recurrenceID + '); ">Unlock</a></div>';
                var html = '<div class="popover fade top in" style="display:block" role="tooltip"><button type="button" class="close" onclick="$(this).parent().remove()" style="margin:7px 7px 0 0"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h3 class="popover-title">Event Menu</h3><div class="popover-content" style="width:180px"><p>' + actions + '</p></div></div>';
                this._createmenu(data.clientX, data.clientY, html);
            }
            else if (_event.type == "job") {
                if (_event.approve == "true") {
                    var actions = '<div id="modal-container" style=position:absolute;top:0;left:0></div>';
                    if (_event.timerstatus == 0) { //none
                        actions += '<div id="start_timer" style="height:30px" onclick="jobfc.playjobtimer(' + _event.jobID + ',' + _event.techid + ');"><i class="fa fa-play" style=" width:15px;"></i> <a href="#" class="btn btn-link">Start Timer</a></div>';
                        actions += '<div style=" border-top: 1px solid #dddddd;"></div>';
                    }
                    else if (_event.timerstatus == 1) { //end
                    }
                    else if (_event.timerstatus == 2) { //break
                        actions += '<div id="end_timer" style="height:30px;" onclick="jobfc.stopjobtimer(' + _event.jobID + ',' + _event.techid + ');"><i class="fa fa-stop" style=" width:15px;"></i> <a href="#" class="btn btn-link" >Stop Timer</a></div>';
                        actions += '<div id="resume_timer" style="height:30px;" onclick="jobfc.resumejobtimer(' + _event.jobID + ',' + _event.techid + ');"><i class="fa fa-play" style=" width:15px;"></i> <a href="#" class="btn btn-link">Resume</a></div>';
                        actions += '<div style=" border-top: 1px solid #dddddd;"></div>';
                    }
                    else if (_event.timerstatus == 3) { // playing
                        actions += '<div id="end_timer" style="height:30px;" onclick="jobfc.stopjobtimer(' + _event.jobID + ',' + _event.techid + ');"><i class="fa fa-stop" style=" width:15px;"></i> <a href="#" class="btn btn-link" >Stop Timer</a></div>';
                        actions += '<div id="break_timer" style="height:30px;" onclick="jobfc.pausejobtimer(' + _event.jobID + ',' + _event.techid + ');"><i class="fa fa-pause" style=" width:15px;"></i> <a href="#" class="btn btn-link">Break</a></div>';
                        actions += '<div style=" border-top: 1px solid #dddddd;"></div>';
                    }


                    actions += '<div style="height:25px"><i class="fa fa-book" style=" width:15px;"></i> <a href="#" class="btn btn-link" onclick="display_calendareditnote(' + _event.jobID + '); ">Edit Job Note</a></div>' +
                    '<div style="height:25px"><i class="fa fa-times" style=" width:15px;"></i> <a href="#" class="btn btn-link" onclick="jobfc.deleteschedule(' + _event.jobID + ',' + _event.id + ',' + _event.recurrenceID + '); ">Delete Schedule</a></div>' +
                    '<div style="height:35px"><i class="fa fa-pencil-square-o" style=" width:15px;"></i> <a href="Job.aspx?id=' + _event.jobID + '&redi=schedule" class="btn btn-link" >Edit Job Schedule</a></div>' +
                    '<div style=" border-top: 1px solid #dddddd;"></div>' +
                    '<div style="height:25px"><i class="fa fa-clock-o" style=" width:15px;"></i> <a href="#" class="btn btn-link" onclick="_show_reschedulewindow(' + _event.id + '); ">Re-Schedule Job</a></div>' +
                    '<div style="height:25px"><i class="fa fa-usd" style=" width:15px;"></i> <a href="#" class="btn btn-link" onclick="jobfc.invoicejob(' + _event.id + ');">Invoice Job</a></div>' +
                    '<div style="height:25px"><i class="fa fa-print" style=" width:20px;"></i><a href="#" class="btn btn-link" onclick="jobfc.printdaysheetIndivByTech(' + _event.id + ', ' + i + ')">Print Job</a></div>' +
                    '<div style="height:30px"><i class="fa fa-check-circle" style=" width:20px;"></i><a href="#" class="btn btn-link" onclick="jobfc.markcomplete(' + _event.id + ');">Mark As Complete</a></div>' +
                    '<div style=" border-top: 1px solid #dddddd;"></div>' +
                    '<div style="height:30px"><i class="fa fa-files-o" style=" width:20px;"></i><a href="#" class="btn btn-link" onclick="jobfc.copyJob();">Copy</a></div>' +
                    '<div style=" border-top: 1px solid #dddddd;"></div>' +
                    '<div style="height:30px"><i class="fa fa-scissors" style=" width:20px;"></i><a href="#" class="btn btn-link" onclick="jobfc.cutJob();">Cut And Paste</a></div>' +
                    '<div style=" border-top: 1px solid #dddddd;"></div>' +
                    '<div style="height:30px"><i class="fa fa-times" style=" width:20px;"></i><a href="#" class="btn btn-link" onclick="jobfc.deleteinstance(' + _event.jobID + ',' + _event.techid + ');">Delete Instance</a></div>' +
                    '<div style=" border-top: 1px solid #dddddd;"></div>' +
                    '<div style="height:30px"><i class="fa fa-map-marker" style=" width:20px;"></i><a href="#" class="btn btn-link" onclick="jobfc.viewmap(' + _event.id + ',' + _event.techid + ');">View Map</a></div>' +
                    '<div style=" border-top: 1px solid #dddddd;"></div>' +
                    '<div style="height:25px"><i class="fa fa-times" style=" width:20px;"></i><a href="#" class="btn btn-link" onclick="jobfc.deleteschedule(' + _event.jobID + ',' + _event.id + ',' + _event.recurrenceID + '); ">Cancel Job</a></div>';

                    var html = '<div class="popover fade top in" style="display:block" role="tooltip"><button type="button" class="close" onclick="$(this).parent().remove()" style="margin:7px 7px 0 0"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h3 class="popover-title">Event Menu</h3><div class="popover-content" style="width:180px"><p>' + actions + '</p></div></div>';
                    this._createmenu(data.clientX, data.clientY, html);
                }
                else {
                    var actions = '<div id="modal-container" style=position:absolute;top:0;left:0></div>' +
                    '<div style="height:25px"><i class="fa fa-check" style=" width:15px;"></i> <a href="#" class="btn btn-link"  onclick="jobfc.approveschedule(' + _event.id + '); ">Approve</a></div>' +
                    '<div style="height:25px"><i class="fa fa-times" style=" width:15px;"></i> <a href="#" class="btn btn-link"  onclick="jobfc.deleteotherschedule(' + _event.jobID + ',' + _event.id + ',' + _event.recurrenceID + '); ">Decline</a></div>';
                    var html = '<div class="popover fade top in" style="display:block" role="tooltip"><button type="button" class="close" onclick="$(this).parent().remove()" style="margin:7px 7px 0 0"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h3 class="popover-title">Event Menu</h3><div class="popover-content" style="width:180px"><p>' + actions + '</p></div></div>';
                    this._createmenu(data.clientX, data.clientY, html);
                }
            }


        },
        show_menu: function (data) {  // day menu
            _event = data.event;
            var _start = "'" + data.start.toJSON().split('T')[0] + ' ' + data.start.toJSON().split('T')[1].replace('Z', '') + "'";
            var _end = "'" + data.end.toJSON().split('T')[0] + ' ' + data.end.toJSON().split('T')[1].replace('Z', '') + "'";

            var _date = data.start.toJSON().split('T')[0].split('-');

            var _stime = "'" + _date[2] + "-" + _date[1] + "-" + _date[0] + ' ' + data.start.toJSON().split('T')[1].replace('Z', '') + "'";
            var _etime = "'" + _date[2] + "-" + _date[1] + "-" + _date[0] + ' ' + data.end.toJSON().split('T')[1].replace('Z', '') + "'";

            var actions = '<div id="modal-container" style=position:absolute;top:0;left:0></div>' +
            '<div style="height:25px"><i class="fa fa-file-o" style=" width:15px;"></i> <a href="#" class="btn btn-link" onclick="jobfc.addnewquote(' + _stime + ',' + _etime + ',' + data.techid + '); ">Add New Quote</a></div>' +
            '<div style="height:25px"><i class="fa fa-file-text-o" style=" width:15px;"></i> <a href="#" class="btn btn-link" onclick="jobfc.addnewjob(' + _stime + ',' + _etime + ',' + data.techid + ');  ">Add New Job</a></div>' +
            '<div style="height:30px"><i class="fa fa-hand-o-right" style=" width:15px;"></i> <a href="#" class="btn btn-link"  onclick="jobfc.assignjob(' + _stime + ',' + _etime + ',' + data.techid + '); ">Assign Job</a></div>' +
            '<div style=" border-top: 1px solid #dddddd;"></div>' +
            '<div style="height:30px"><i class="fa fa-print" style=" width:15px;"></i> <a href="#" class="btn btn-link" onclick="jobfc.printdaysheetsummaryalltech(' + data.techid + ',' + _stime + ');">Print Job Allocation</a></div>' +
            '<div style=" border-top: 1px solid #dddddd;"></div>' +
            '<div style="height:25px"><i class="fa fa-clock-o" style=" width:15px;"></i> <a href="#" class="btn btn-link" onclick="jobfc.display_otherschedule(' + _event.id + ',' + _stime + ',' + _etime + ');">Other Schedule</a></div>' +
            '<div style="height:30px"><i class="fa fa-user" style=" width:15px;"></i> <a href="#" class="btn btn-link" onclick="jobfc.lockschedule(' + _event.id + ',' + _stime + ',' + _etime + ');">Lock Tech</a></div>' +
            '<div style=" border-top: 1px solid #dddddd;"></div>' +
            '<div style="height:25px"><i class="fa fa-print" style=" width:15px;"></i> <a href="#" class="btn btn-link" onclick="jobfc.pasteJob(true,' + _event.id + ');">Paste</a></div>';

            var html = '<div class="popover fade top in" style="display:block" role="tooltip"><button type="button" class="close" onclick="$(this).parent().remove()" style="margin:7px 7px 0 0"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><h3 class="popover-title">Event Menu</h3><div class="popover-content" style="width:190px"><p>' + actions + '</p></div></div>';
            this._createmenu(data.clientX, data.clientY, html);



        },
        playjobtimer: function (jobID, techID) {
            $("#main_calendar_job_display_child1").html("");
            var dto = { 'jobID': jobID, 'techID': techID };
            intTec.ajax2('/calendar-resource.aspx/PlayJobTimer', JSON.stringify(dto),
                function (data) {
                    dpm1.message("Timer Activated.");
                    jobfc.reloadCalendarEvents();
                }, function (err) {
                    unitrakCmn.showErrorMessage(err, null, 'Error Playing Timer', true);
                })
        },
        pausejobtimer: function (jobID, techID) {
            $("#main_calendar_job_display_child1").html("");
            var dto = { 'jobID': jobID, 'techID': techID };
            intTec.ajax2('/calendar-resource.aspx/UpdateJobTimer', JSON.stringify(dto),
                function (data) {
                    dpm1.message("Timer Paused.");
                    jobfc.reloadCalendarEvents();
                }, function (err) {
                    unitrakCmn.showErrorMessage(err, null, 'Error Pausing Timer', true);
                })
        },
        resumejobtimer: function (jobID, techID) {
            $("#main_calendar_job_display_child1").html("");
            var dto = { 'jobID': jobID, 'techID': techID };
            intTec.ajax2('/calendar-resource.aspx/ResumeJobTimer', JSON.stringify(dto),
                function (data) {
                    dpm1.message("Timer Paused.");
                    jobfc.reloadCalendarEvents();
                }, function (err) {
                    unitrakCmn.showErrorMessage(err, null, 'Error Resuming Timer', true);
                })
        },
        stopjobtimer: function (jobID, techID) {
            $("#main_calendar_job_display_child1").html("");
            _timernote_display(jobID, techID);
        },
        viewschedulenote: function (schedID) {
            $("#main_calendar_job_display_child1").html("");
            onclick_showschedulenote(schedID)
        },
        markcomplete: function (schedID) {
            $("#main_calendar_job_display_child1").html("");
            display_mp(schedID);
        },
        viewmap: function (schedID, techid) {
            $("#main_calendar_job_display_child1").html("");
            display_jobpmap(schedID, techid);
        },
        approveschedule: function (schedID) {
            $("#main_calendar_job_display_child1").html("");
            _show_approvedwindow(schedID);
        },
        canceljob: function (schedID) {
            $("#main_calendar_job_display_child1").html("");
            intTec.ajax("Check_JobInvoice", JSON.stringify({ '_scheduleID': schedID }), function (data) {
                var n = jQuery.parseJSON(data.d);
                var msg = '';
                if (n.Status == "true") {
                    msg = 'This will delete the job invoice. Would you like to continue?';
                    if (confirm(msg)) {
                        $('div#security_pass').show();
                        $('#hf_ID').val(schedID);
                    }
                }
                else {
                    _rnote_display(schedID);
                }


            }, function (err) {
                unitrakCmn.showErrorMessage(err, null, 'Error...', true);
            });
        },
        assignjob: function (start, end, uid, jobID) {
            $("#main_calendar_job_display_child1").html("");
            //var el = 'ctl00_ctl00_ContentBody_ScheduleContent_lb_Booked'
            var el = 'sel_lb_Booked';
            var val = unitrakCmn.calcDropdownValue(el);
            var txt = unitrakCmn.calcDropdownText(el);
            if (txt.length == 0) {
                dpm1.message("Please select an Unassigned Job before using this action.");
            }
            else if (val == -1) {
                dpm1.message("Please select an Unassigned Job before using this action.");
            }
            else {
                var comment = '';
                if (txt.indexOf('-') > 0)
                    comment = txt.split('-')[1];
                var dto = { 'jobID': val, 'userID': uid, 'start': start, 'end': end, 'comment': comment };
                intTec.ajax2('/calendar-resource.aspx/AssignJob', JSON.stringify(dto),
                    function (data) {
                        $('#' + el + ' :selected').remove();
                        dpm1.message("Job Successfully Assigned.");
                        jobfc.reloadCalendarEvents();
                    }, function (err) {
                        unitrakCmn.showErrorMessage(err, null, 'Error executing Schedule.aspx/AssignJob', true);
                    })
            }
        },
        assigndropjob: function (start, uid, jobID) {
            $("#main_calendar_job_display_child1").html("");

            if (uid.length == 0) {
                dpm1.message("Please select technician.");
            }
            else {
                var dto = { 'jobID': jobID, 'userID': uid, 'start': start };
                intTec.ajax2('/calendar-resource.aspx/AssignJobDrag', JSON.stringify(dto),
                    function (data) {
                        //$('#' + el + ' :selected').remove();
                        dpm1.message("Job Successfully Assigned.");
                        jobfc.reloadCalendarEvents();
                    }, function (err) {
                        unitrakCmn.showErrorMessage(err, null, 'Error executing Schedule.aspx/AssignJob', true);
                    })
            }
        },
        assigndropjobw: function (start, uid, jobID) {
            $("#main_calendar_job_display_child1").html("");
            var _user = $('#hf_UID').val();

            if (uid.length == 0) {
                dpm1.message("Please select technician.");
            }
            else {
                var dto = { 'warrantyID': jobID, 'tech': uid, 'start': start, 'user': _user };
                intTec.ajax2('/calendar-resource.aspx/AssignJobDragWarranty', JSON.stringify(dto),
                    function (data) {
                        dpm1.message("Job Successfully Assigned.");
                        jobfc.reloadCalendarEvents();
                    }, function (err) {
                        unitrakCmn.showErrorMessage(err, null, 'Error executing Schedule.aspx/AssignJob', true);
                    })
            }
        },
        printdaysheetIndivByTech: function (schedID, start) {
            $("#main_calendar_job_display_child1").html("");
            var list = new Array();
            list.push({ 'Name': 'start_date', 'Value': start });
            intTec.ajax2("/invoices-invoiced.aspx/AddSession", JSON.stringify({ 'list': list }),
                function (data) {
                }, function (err) {
                    unitrakCmn.showErrorMessage(err, null, 'Error executing AddSession.', true);
                });
            window.open("Summary_Report_Print.aspx?type=9&sumtype=0&schedID=" + schedID + "&date=" + start);
        },
        printdaysheetsummaryalltech: function (tech, date) {
            $("#main_calendar_job_display_child1").html("");
            var list = new Array();
            list.push({ 'Name': 'start_date', 'Value': date });
            intTec.ajax2("/invoices-invoiced.aspx/AddSession", JSON.stringify({ 'list': list }),
                function (data) {
                }, function (err) {
                    unitrakCmn.showErrorMessage(err, null, 'Error executing AddSession.', true);
                });
            window.open("Summary_Report_Print.aspx?type=7&sumtype=0&tech=" + tech);
        },
        printdaysheetsummary: function (e) {
            var moment = $('#job-calendar').fullCalendar('getDate');
            var _date = moment.format();
            var _witht = _date.split('T')[1];
            var _date_split;
            if (_witht == undefined) {
                _date_split = _date.split('-')[2] + "/" + _date.split('-')[1] + "/" + _date.split('-')[0]
            }
            else {
                _date_split = _date.split('-')[2].split('T')[0] + "/" + _date.split('-')[1] + "/" + _date.split('-')[0]
            }


            var list = new Array();
            list.push({ 'Name': 'start_date', 'Value': _date_split });
            intTec.ajax2("/invoices-invoiced.aspx/AddSession", JSON.stringify({ 'list': list }),
                function (data) {
                }, function (err) {
                    unitrakCmn.showErrorMessage(err, null, 'Error executing AddSession.', true);
                });
            $("#main_calendar_job_display_child1").html("");
            window.open("Summary_Report_Print.aspx?type=6&sumtype=0");
        },
        display_otherschedule: function (techid, start, end) {
            $("#main_calendar_job_display_child1").html("");
            display_otherschedule(techid, start, end);
        },
        lockschedule: function (techid, start, end) {
            $("#main_calendar_job_display_child1").html("");
            var _user = $('#hf_UID').val();
            var dto = { 'techID': techid, 'start': start, 'end': end, 'userID': _user };
            intTec.ajax2("/calendar-resource.aspx/LockSchedule", JSON.stringify(dto),
                function (data) {
                    dpm1.message("Schedule Lock Created.");
                    jobfc.reloadCalendarEvents();
                }, function (err) {
                    unitrakCmn.showErrorMessage(err, null, 'Error executing LockSchedule', true);
                });
        },
        invoicejob: function (schedID) {
            $("#main_calendar_job_display_child1").html("");
            var _user = $('#hf_UID').val();
            var msg = 'This will generate a new Invoice for this Job. Would you like to continue?';
            if (confirm(msg)) {
                intTec.ajax("Add_Invoice_Sch_New", JSON.stringify({ '_scheduleID': schedID, '_user': _user }),
                    function (data) {
                        var b = $.parseJSON(data.d);
                        if (b.Status == "") {
                            dpm1.message('New invoice successfully generated.');
                            jobfc.reloadCalendarEvents();
                        }
                        else {
                            dpm1.message(b.Status);
                        }
                    }, function (err) {
                        _showErrorInfo(err);
                    });
            }
        },
        deleteschedule: function (jid, schedID, recurrenceID) {
            $("#main_calendar_job_display_child1").html("");
            intTec.ajax('GetJobInvoices', JSON.stringify({ 'jobID': jid }),
            function (data) {
                var l = $.parseJSON(data.d);
                if (l.length > 0) {
                    dpm1.message('Error: Schedule cannot be deleted for job with active Invoice.');
                    return;
                } else {
                    if (confirm('Are you sure you want to delete job #' + jid + ' schedule? ') == false) {
                        //_close(id);
                        return;
                    }
                    var dto = { 'id': schedID, 'jobID': jid, 'recurrenceID': recurrenceID };
                    intTec.ajax2("/Calendar-Resource.aspx/DeleteScheduleEvent", JSON.stringify(dto),
                    function (data) {
                        //clipboard.jobID = 0;
                        dpm1.message('Schedule successfully deleted.');
                        jobfc.reloadCalendarEvents();
                    }, function (err) {
                        unitrakCmn.showErrorMessage(err, null, 'Error', true);
                    });
                }
            },
            function (err) {
                _showErrorInfo(err);
            });
        },
        deleteotherschedule: function (jid, schedID, recurrenceID) {
            $("#main_calendar_job_display_child1").html("");
            intTec.ajax('GetJobInvoices', JSON.stringify({ 'jobID': jid }),
            function (data) {
                var dto = { 'id': schedID, 'jobID': jid, 'recurrenceID': recurrenceID };
                intTec.ajax2("/Calendar-Resource.aspx/DeleteScheduleEvent", JSON.stringify(dto),
                function (data) {
                    //clipboard.jobID = 0;
                    dpm1.message('Schedule successfully updated.');
                    jobfc.reloadCalendarEvents();
                }, function (err) {
                    unitrakCmn.showErrorMessage(err, null, 'Error', true);
                });
            },
            function (err) {
                _showErrorInfo(err);
            });
        },
        deleteinstance: function (jid, techid) {
            $("#main_calendar_job_display_child1").html("");
            var i = confirm('Are you sure you want to delete this schedule instance?')
            if (i == 0)
                return;
            var jid = jid;
            var tid = techid;
            var dto = { 'jobID': jid, 'techID': tid };
            intTec.ajax2('/Calendar-Resource.aspx/DeleteJobScheduleInstance', JSON.stringify(dto),
                    function (data) {
                        dpm1.message('Schedule Instance Deleted.');
                        jobfc.reloadCalendarEvents();
                    }, function (err) {
                        unitrakCmn.showErrorMessage(err, null, 'Error executing DeleteInstance.', true);
                    });
        },
        addnewquote: function (start, end, tid) {
            $("#main_calendar_job_display_child1").html("");
            window.location = "Customer-quotes-new.aspx?id=0&start=" + start + "&end=" + end + "&tid=" + tid + "&redi=schedule"
        },
        addnewjob: function (start, end, tid) {
            $("#main_calendar_job_display_child1").html("");
            window.location = "Customer-job-new.aspx?id=0&start=" + start + "&end=" + end + "&tid=" + tid + "&redi=schedule";
        },
        mobile_copyjob: function () {
            clipboard.action = _copy;
            clipboard.jobID = _event.id;
            clipboard.techID = _event.techid;
            clipboard.event = _event;
            dpm1.message('Job #: ' + _event.jobnumber + ' copied to clipboard.');
            jobfc.closedisplay();
            //$('.data-hover-info').empty();
        },
        mobile_movejob_to: function () {
            _moveto = true;
            this.mobile_copyjob_to(_move);
        },
        mobile_copyjob_to: function (action) {
            var el = '#modal-container';
            if (action == undefined) action = _copy;

            intTec.ajax('GetTechninicians', JSON.stringify({ cid: unitrakCmn.activeCompanyID() }),
                function (data) {
                    var b = $.parseJSON(data.d);
                    var html = kite(b.tmpl, { bizobjs: b.list });
                    $(el).append(html)
                    setTimeout(function () { }, 500)
                    var date = _event.start.toJSON().split('T')[0].split('-');
                    var dt = date[2] + '/' + date[1] + '/' + date[0];
                    $('#target-date').val(dt);
                    $('#target-date').datepicker(unitrakCmn.defDateFormat());
                    $('#btn-save-copyjob-to').click(function (e) {
                        var tech = $('#target-tech :selected').val();
                        var start = $('#target-date').val();
                        var msg = { message: 'Job  successful copied to ' + $('#target-tech :selected').text() };

                        clipboard.action = action;
                        clipboard.techID = tech;
                        clipboard.jobID = _event.id;

                        if (action == _move) {
                            msg = { message: 'Job  successful reassigned to ' + $('#target-tech :selected').text() };
                        }

                        var e = {
                            action: action,
                            resource: tech,
                            start: start,
                            jobid: _event.id,
                            moveto: action == 'move',
                            userid: unitrakCmn.activeUserID(),
                        };
                        jobfc.moveJob(e, null, null)
                        jobfc.closedisplay();
                        $('#btn-close-copyjob-to').click();
                    });
                }, function (err) {
                    unitrakCmn.showErrorMessage(err, null, 'Error executing GetUsers', true, el);
                });

        },
        mobilemenu_pastejob: function () {
            var e = { date: _date, resource: unitrakCmn.activeUserID() };
            this.pasteJob(e, true);
            jobfc.closedisplay(true);
        },
        pasteJob: function (success_copy_message, tech) {
            $("#main_calendar_job_display_child1").html("");
            this.showwaitmessage();
            if (clipboard.jobID == 0) { dpm1.message('Clipboard is empty. Execute copy/cut before using this command.'); return; }

            var start = '';
            var dto = { jobid: clipboard.jobID, techID: tech, jobactionflag: clipboard.action };
            var uri = _service_uri + 'PasteJob';
            intTec.ajax2(uri, JSON.stringify(dto),
                function (data) {
                    clipboard.jobID = 0;
                    jobfc.reloadCalendarEvents();
                    dpm1.message("Job Action Completed.");

                }, function (err) {
                    try {
                        dpm1.message_error('Job Copy Paste Error: ' + $.parseJSON(err.responseText).Message);
                    } catch (e) {
                        unitrakCmn.showErrorMessage(err, null, 'Error executing ' + uri, true);
                    }

                }, function () {
                    _moveto = false;
                });
        },
        cutJob: function (e) {
            $("#main_calendar_job_display_child1").html("");
            _moveto = false;
            clipboard.action = _cut;
            clipboard.jobID = _event.jobID;
            clipboard.techID = _event.techid;
            var msg = 'Job #: ' + _event.jobID + ' copied to clipboard.';
            dpm1.message(msg);
        },
        copyJob: function (e) {
            $("#main_calendar_job_display_child1").html("");
            _moveto = false;
            clipboard.action = _copy;
            clipboard.jobID = _event.jobID;
            clipboard.techID = _event.techid;
            var msg = 'Job #: ' + _event.jobID + ' copied to clipboard.';
            dpm1.message(msg);
        },
        moveJob: function (e, newStart, newEnd) {
            _moveto = false;
            if (e.techid == _event.techid) {
                dpm1.message('Action Error: Target Technician already assigned to this Job.');
                return;
            }
            this.showwaitmessage();
            var uri = _service_uri + 'reassignuserjob';
            if (e.action == _copy) {
                uri = _service_uri + 'addnewjob';
                jobfc._executeCopyMoveJob(uri, e);
            } else {
                jobfc._executeCopyMoveJob(uri, e);
            }


        },
        reschedJob: function (ev, revertFn) {
            var _schedID = ev.id;
            var _jobID = ev.jobID;
            var _techID = ev.techid;
            var _resource = ev.resources[-1];
            var _start = ev.start.toJSON().split('T')[0] + ' ' + ev.start.toJSON().split('T')[1].replace('Z', '');
            var _end = ev.end.toJSON().split('T')[0] + ' ' + ev.end.toJSON().split('T')[1].replace('Z', '');

            if (_resource == undefined) { _resource = 0; }

            var dto = {
                'schedID': _schedID,
                'jobID': _jobID,
                'techID': _techID,
                'resource': _resource,
                'start': _start,
                'end': _end
            }

            intTec.ajax2('/calendar-resource.aspx/EventMoveSchedule', JSON.stringify(dto)
                , function (data) {
                    clipboard.jobID = 0;
                    dpm1.message("Job Action Completed.");
                    jobfc.reloadCalendarEvents();
                }, function (err) {
                    revertFn();
                    unitrakCmn.showErrorMessage(err, null, '', true);
                });

        },
        resizeJob: function (ev, revertFn) {
            var _schedID = ev.id;
            var _jobID = ev.jobID;
            var _techID = ev.techid;
            var _resource = ev.resources[-1];
            var _start = ev.start.toJSON().split('T')[0] + ' ' + ev.start.toJSON().split('T')[1].replace('Z', '');
            var _end = ev.end.toJSON().split('T')[0] + ' ' + ev.end.toJSON().split('T')[1].replace('Z', '');

            if (_resource == undefined) { _resource = 0; }

            var dto = {
                'schedID': _schedID,
                'jobID': _jobID,
                'techID': _techID,
                'resource': _resource,
                'start': _start,
                'end': _end
            }

            intTec.ajax2('/calendar-resource.aspx/EventMoveSchedule', JSON.stringify(dto)
                , function (data) {
                    clipboard.jobID = 0;
                    dpm1.message("Job Action Completed.");
                    jobfc.reloadCalendarEvents();
                }, function (err) {
                    revertFn();
                    unitrakCmn.showErrorMessage(err, null, '', true);
                });

        },
        emptypopdisplay: function () {
            $('.data-hover-info').removeClass('data-hover-info-visible');
            $(caljobElID).empty();
            $('#calendar_job_display_child2').empty();
        },
        fullcalendar: function () {
            window.location = "/calendar.aspx";
        },
        issecondaryuser: function (v) {
            if (v.length > 0) {
                dpm1.message('This action is not allowed for secondary job user.');
                return true;
            }
            return false;
        },
        reloadCalendarEvents: function () {
            $('#job-calendar').fullCalendar('refetchEvents');
        },
        _executeCopyMoveJob: function (uri, dto) {
            intTec.ajax2(uri, JSON.stringify(dto),
           function (data) {
               clipboard.jobID = 0;
               dpm1.message("Job Action Completed.");
               jobfc.reloadCalendarEvents();

           }, function (err) {
               try {
                   dpm1.message('Job Cut Paste Error Error: ' + $.parseJSON(err.responseText).Message);
               } catch (e) {
                   unitrakCmn.showErrorMessage(err, null, 'Error executing ' + uri, true);
               }

           }, function () {
               _moveto = false;
           });
        }


    }
}());


