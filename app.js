$(document).ready(function() {
	
	var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;

	if(isMac){
		$("#arrow-inverse").css({
			'display':'block'
		});
		$("#arrow-inverse-c").css({
			'display':'block'
		});
	}else{
		$("#arrow").css({
			'display':'block'
		});
		$("#arrow-c").css({
			'display':'block'
		});
	}




	$("#start-validation").click(function (event) {
		event.preventDefault();

		$("#step_a").fadeOut(function() {
			$("#step_b").fadeIn();
		});


	});


	$("#step-b-valid-btn").click(function (event) {
        event.preventDefault();
		var desktopClient = new DesktopClient();
       	var uniqueId = new Date().getTime();
        //Arma la estructura de mensaje que ocupa BAC Desktop
         var request = {
             module: "digitalSignature",
             operationCode: "DS001", /*Listar amigos*/
             userName: "test",
             tramitId: uniqueId}; /* Id unico, de referencia para la consulta*/

         
        //Agrega parametros adicionales al mensaje
        request.params = {
            "name" : name
        };

        $("#arrow-bg-b").fadeIn();

        desktopClient.sendRequest(request, function(response){
        	
        	if (response){
            	if (response.resultContent.resultCode == 'ok'){
            		 $("#arrow-bg-b").fadeOut();
            		 $("#pki").fadeOut();
            		 $("#step_b").fadeOut();
            		 $("#step_c").fadeIn();


            	}else if(response.resultContent.resultCode == 'cancel'){
            		$("#steb-b-message").fadeOut();
            		$("#valid-btn").fadeOut()
 					$("#arrow-bg-b").fadeOut();
 					$("#pki").fadeOut();
 					$("#step-b-valid-btn").fadeOut();
 					$("#steb-b-cancel").fadeIn();
            	}
        	}else{
				setTimeout(function(){
							location.reload();

				}, 10000);
				

        	}

        });

	});



	$("#step-c-finish").click(function (event) {
        event.preventDefault();

		var desktopClient = new DesktopClient();
       	var uniqueId = new Date().getTime();
        //Arma la estructura de mensaje que ocupa BAC Desktop
         var request = {
             module: "digitalSignature",
             operationCode: "DS002", /*Listar amigos*/
             userName: "test",
             tramitId: uniqueId}; /* Id unico, de referencia para la consulta*/

         
        //Agrega parametros adicionales al mensaje
        request.params = {
            "name" : name
        };
		$("#arrow-bg-c").fadeIn();
        desktopClient.sendRequest(request, function(response){
        	
        	if (response){
            	if (response.resultContent.resultCode == 'ok'){
					$("#step_c").fadeOut(function() {
						$("#finish-sucess").fadeIn();
						var name = response.resultContent.params.customerName;


						$("#customerLabel").text(name.replace("(AUTENTICACION)", ""));
					});
            	}else if(response.resultContent.resultCode == 'cancel'){
					$("#step_c").fadeOut(function() {
						$("#finish-cancel").fadeIn();
					});
            	}
        	}else{
					$("#step_c").fadeOut(function() {
						$("#finish-error").fadeIn();
					});
        	}

        });

	});




	$("#close").click(function (event) {
		window.top.close();
	
	});


	$("#retry-error").click(function () {

	})

	$("#retry-cancel").click(function () {
		location.reload();
	})

	$("#step-c-retry-cancel").click(function () {
		location.reload();
	})



});