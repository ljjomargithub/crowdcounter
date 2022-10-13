var getlive;
var confirmjoin;

var mainClass = (function () {
	
	var APIUrl = "https://www.quizcatalog.com/crowdcounter/index.php";
	var qrcodeimg = "https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=";
	var postVars = { }
	
    return {		
		
		
        checkLogin: function () {
			return localStorage.getItem("participant");
        },
		
		doLogout: function () {
			localStorage.setItem("participant", "0");
			localStorage.removeItem("participantfname");
			localStorage.removeItem("eventname");
			localStorage.removeItem("currentEvent");
			localStorage.removeItem("numberaudience");
			localStorage.removeItem("isowner");
			clearInterval(getlive);
			clearInterval(confirmjoin); 
		},
		
		setCurrentEvent: function (data) {
			localStorage.setItem("currentEvent", data.eventid);
			localStorage.setItem("eventname", data.eventname);
			localStorage.setItem("numberaudience", data.numberaudience);
			localStorage.setItem("isowner", data.isowner);
			
			$(".eventid").html(mainClass.currentEvent());
			$(".eventname").html(mainClass.pageData("eventname"));
			$(".maincount strong").html(mainClass.pageData("numberaudience"));
		},
		
		currentEvent: function () {
			return localStorage.getItem("currentEvent");
		},
		
		pageData: function (k) {
			return localStorage.getItem(k);
		},
		
		leaveCurrentEvent: function () {
			
			postVars['action'] = "leaveEvent";
			postVars['id'] = mainClass.checkLogin();
			postVars['eventid'] = mainClass.currentEvent();
			
			$.ajax({type: "POST",url: APIUrl, data: postVars,
				success: function () {
					localStorage.removeItem("currentEvent");
					localStorage.removeItem("eventname");
					localStorage.removeItem("numberaudience");
				}
			});
			
			$("#partcounter").html("");
			
			clearInterval(confirmjoin);
			clearInterval(getlive);
			
		},
		
		
		cancelJoin: function () {
			
			postVars['action'] = "cancelJoin";
			postVars['id'] = mainClass.checkLogin();
			postVars['eventid'] = mainClass.currentEvent();
			
			$.ajax({type: "POST",url: APIUrl, data: postVars,
				success: function () {
					clearInterval(confirmjoin);
					$.mobile.changePage("#joinevent");
				}
			}); 
		},
		
		removeParticipant: function () {
			
			postVars['action'] = "removeParticipant";
			postVars['id'] = $("#tojoinid").val();
			postVars['eventid'] = mainClass.currentEvent();
			
			$.ajax({type: "POST",url: APIUrl, data: postVars,
				success: function () { 
					$.mobile.changePage("#waitingpage");
					clearInterval(confirmjoin);
				}
			});
			
		},
		
		joinEvent: function () {
			
			postVars['action'] = "joinEvent";
			postVars['id'] = mainClass.checkLogin();
			postVars['eventid'] = $("#txt-joinevent").val();
			
			$.ajax({type: "POST",url: APIUrl, data: postVars,
				success: function (data) {
					var data = JSON.parse(data);
					mainClass.setCurrentEvent(data);
					
					if (data.isowner == true ) {  
						$.mobile.changePage("#homecounter");
						getlive = setInterval(function(){ mainClass.getParticipantsFromEvent(); }, 2000);
						
					} else if (data.isowner == false && data.verified == true) {
						$.mobile.changePage("#homecounter");
						getlive = setInterval(function(){ mainClass.getParticipantsFromEvent(); }, 2000);
						
					} else {
						
						$.mobile.changePage("#waitingpage");
						confirmjoin = setInterval(function(){ mainClass.waitingforconfirmation(); }, 2000);
					}
				}
			});
		},
		
		waitingforconfirmation: function () {
						
			postVars['action'] = "confirmjoin";
			postVars['id'] = mainClass.checkLogin();
			postVars['eventid'] = mainClass.currentEvent()
			
			$.ajax({type: "POST", url: APIUrl, data: postVars,
				success: function (data) {
					var data = JSON.parse(data);
					if(data.confirmed == "accepted") {
						clearInterval(confirmjoin);
						$.mobile.changePage("#homecounter");
						getlive = setInterval(function(){ mainClass.getParticipantsFromEvent(); }, 2000);
					
					} else if(data.confirmed == "removed") {
						clearInterval(confirmjoin);
						$.mobile.changePage("#joinevent");
					}
				}
			});
		},
		
		loginToServer: function () {
			
			clearInterval(confirmjoin);
			clearInterval(getlive);
			
			postVars['username'] = $("#txt-email").val();
			postVars['password'] = $("#txt-password").val();
			postVars['action'] = "login";
			
			$.ajax({type: "POST",url: APIUrl, data: postVars, 
				success: function(data){
					var data = JSON.parse(data);
					if( data.id > 0) {
						localStorage.setItem("participant", data.id);
						localStorage.setItem("participantfname", data.fullname);
						
						$(".fullnamecap").html(data.fullname);

						$.mobile.changePage("#createevent"); 
					}
				}
			});
		},
		
		register: function () {
			
			clearInterval(confirmjoin);
			clearInterval(getlive);
			
			$("#registererrormessage").empty()

			postVars['email'] = $("#txt-regemail").val();
			postVars['password'] = $("#txt-regpassword").val();
			postVars['fname'] = $("#txt-fname").val();
			postVars['lname'] = $("#txt-lname").val();
			postVars['action'] = "register";
			
			$.ajax({type: "POST",url: APIUrl, data: postVars, 
				success: function(data){
					var data = JSON.parse(data);
					if( data.loginID != "0") {
						mainClass.setLogin(data)
						$.mobile.changePage("#createevent"); 
					} else {
					    $("#registererrormessage").html("Fields are empty.");
					}
					
				}
			});
		},
		
		createEvent: function () {
			
			postVars['event'] = $("#txt-event").val();
			postVars['audience'] = $("#txt-audience").val();
			postVars['id'] = mainClass.checkLogin();
			postVars['qrcodeval'] = mainClass.makeEventID()
			postVars['action'] = "createevent";
			
			$.ajax({type: "POST",url: APIUrl, data: postVars, 
				success: function(data){
					var data = JSON.parse(data);
					mainClass.setCurrentEvent(data);
					$.mobile.changePage("#homecounter");
					getlive = setInterval(function(){ mainClass.getParticipantsFromEvent(); }, 2000);
				}
			});
		},
		
		acceptParticipant: function () {
			
			postVars['action'] = "acceptParticipant";
			postVars['id'] = $("#tojoinid").val();
			postVars['eventid'] = mainClass.currentEvent();
			postVars['gate'] = $("#txtgate").val();
			
			$.ajax({type: "POST", url: APIUrl, data: postVars,
				success: function (data) {}
			});
		},
		
		assigndoor: function (id, fname) {
			$("#tojoin").html(fname);
			$("#tojoinid").val(id);
		},
		
		getParticipantsFromEvent: function () {
			$("#partcounter").html();
			postVars['action'] = "fromCurrentEvent";
			postVars['eventid'] = mainClass.currentEvent();
			postVars['isowner'] = mainClass.pageData("isowner");
			var li = "";
			var allcounts = 0;
			$.ajax({type: "POST",url: APIUrl, data: postVars, 
				success: function(data){ 
					var data = JSON.parse(data);
					var isremoved = 0;
					
					for(var i=0; i < data.length; i++){
						var pr = data[i];
						
						if (pr.id == mainClass.pageData("participant")) {
							isremoved++;
						}
						
						if(mainClass.pageData("isowner") == "true") {
							li +='<li><a href="#page2" class="ui-btn assigndoor" id="'+ pr.id +'" data-rel="dialog"><span class="fullnamecap">' + pr.fullname +'</span>';
							
						} else {
							li +='<li><a href="#" class="ui-btn assigndoor"><span class="fullnamecap">' + pr.fullname +'</span>';
						}
						
						li += "(" + pr.gate + ")";
						li += ( pr.verified == "0" ? "<i class='cf'>Waiting for Confirmation</i>" : "");
						li +='<span class="ui-li-count ui-body-b">'+ pr.scancount +'</span>';
						li +='</a></li>';
						allcounts = allcounts + Number(pr.scancount);
						$(".maincount i.allaud").html(pr.numberaudience);
					}
					
					$("#partcounter").html(li);
					$(".maincount i.sumcount").html(allcounts);
					
					if(isremoved == 0) {
						clearInterval(getlive);
						$.mobile.changePage("#joinevent");
					}
					
				}
			});
		},
		
		doScanning: function () {
			
			cordova.plugins.barcodeScanner.scan(
				function result(result) {
					if(! result.cancelled) {
						if (result.format == "QR_CODE") {
							
							postVars['action'] = "scanqr";
							postVars['id'] = mainClass.checkLogin();
							postVars['eventid'] = mainClass.currentEvent();
							postVars['qrvalue'] = result.text
							
							$.ajax({type: "POST", url: APIUrl, data: postVars,
								success: function (data) {
									getlive = setInterval(function(){ mainClass.getParticipantsFromEvent(); }, 2000);
									$("#scanningarea img").show();					
								},
								beforeSend: function() {
									$("#scanningarea img").hide();
									clearInterval(getlive)					
								}
							});
							
							
						}
					}
				},
				function (error) {
					alert("Scanning Failed " + error)
				}
			)
			
		},
		
		makeEventID: function () {
			
			const typedArray = new Uint8Array(10);
			const randomValues = window.crypto.getRandomValues(typedArray);
			var uniqueValue = randomValues.join('').substring(0, 6);
			return uniqueValue;
			
		},

		scanQRCode: function () {
			cordova.plugins.barcodeScanner.scan(
				function result(result) {
					if(! result.cancelled) {
						if (result.format == "QR_CODE") {
							var value = result.text;
							alert("value is " + value);
						}
					}
				},
				function (error) {
					alert("Scanning Failed " + error)
				}
			)
		}
		
    }
}());

//******************************************************
//
// 	Events
//
//******************************************************

$(document).on( "click", "#scanningarea", function() {
	mainClass.doScanning();
});

$(document).on("click", "#btn-createEvent", function () {
	mainClass.createEvent();
	
});

$(document).on("click", "#btn-register", function () {
	mainClass.register();
});

$(document).on("click", "#btnjoinevent", function () {
	mainClass.joinEvent();
});

$(document).on("click", "#navjoinevent, #navleave", function () {
	if( mainClass.checkLogin() == "") {
		$.mobile.changePage("#loginpage");
	} else {
		
		navtopage = $( this ).data( "navto" );
		
		if(navtopage == "createevent") {
			mainClass.leaveCurrentEvent();	
		}
		
		$.mobile.changePage("#" + navtopage);
	}
	clearInterval(getlive);
});

$(document).on("click", "#acceptparticipant", function () {
	mainClass.acceptParticipant();
});

$(document).on("click", "#removeparticipant", function () {
	mainClass.removeParticipant();
});

$(document).on("click", "#navRegister", function () {
	//if( mainClass.checkLogin() == "") {
	//	$.mobile.changePage("#registerpage");
	//} else {
	//	alert("asdf")
	//}
	$.mobile.changePage("#registerpage");
});

$(document).on("click", ".btnlogout", function () {
	mainClass.leaveCurrentEvent();
	mainClass.doLogout();
	$.mobile.changePage("#loginpage");
	$("#partcounter").html("");
});


$(document).on("click", "#cancelwaiting", function () {
	mainClass.cancelJoin(); 
});

$(document).on("click", "#btn-login", function () {
	mainClass.loginToServer(); 
});

$(document).on("click", ".assigndoor", function () {
	mainClass.assigndoor($(this).attr('id'), $(this).find("span.fullnamecap").html())
});

$(document).on("pagecreate",function(){
	
	if( mainClass.checkLogin() == "0") {
		$.mobile.changePage("#loginpage");
	} else {
		
		$(".fullnamecap").html(mainClass.pageData('participantfname'));
		$(".eventname").html(mainClass.pageData('eventname'));
		$(".eventid").html(mainClass.pageData('currentEvent'));
		
		var URL = $.mobile.path.parseUrl(window.location).toString().toLowerCase();
		currentpage = URL.substring(URL.indexOf('#') + 1);
		
		if(currentpage == "homecounter") {
			getlive = setInterval(function(){ mainClass.getParticipantsFromEvent(); }, 2000);
		}
		
	}
	
});