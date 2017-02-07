$(document).ready(function() {
	

	$("#start-sign").click(function (event) {
		event.preventDefault();
		var desktopClient = new DesktopClient();
       	var uniqueId = new Date().getTime();
		var signData =  $("#signComment").val();
        //Arma la estructura de mensaje que ocupa BAC Desktop
         var request = {
             module: "digitalSignature",
             operationCode: "DS003", /*Listar amigos*/
             userName: "test",
             tramitId: uniqueId}; /* Id unico, de referencia para la consulta*/

         
        //Agrega parametros adicionales al mensaje
        request.params = {
            "name" : name,
			"dataSign" : signData
        };
		
        desktopClient.sendRequest(request, function(response){
        	
        	if (response){
        		console.log("El response es: "+response);
            	if (response.resultContent.resultCode == 'ok'){
					$("#step_a").fadeOut();
					var cname = response.resultContent.params.customerName;
					var cid = response.resultContent.params.customerId;
					var ctype = response.resultContent.params.customerType;
					var signedData = response.resultContent.params.signedData;
					
					$("#customerName").text(cname.substring(0, cname.length - 7));
					$("#customerId").text(cid.substring(4, cid.length));
					$("#customerIdType").text(ctype);
					$("#signedComment").text(signedData);
					$("#step_a").fadeOut(function() {
						$("#step_b").fadeIn();
					});
					
            	}else if(response.resultContent.resultCode == 'cancel'){
					$("#step_a").fadeOut(function() {
						$("#finish-cancel").fadeIn();
					});
            	}
        	}else{
					$("#step_a").fadeOut(function() {
						$("#finish-error").fadeIn();
					});
        	}

        });


	});


	



	$("#step-b-valid-btn").click(function (event) {
		location.reload();
	
	});


	$("#step-c-retry-error").click(function () {
        location.reload();
	});

	$("#step-c-retry-cancel").click(function () {
		location.reload();
	});



});