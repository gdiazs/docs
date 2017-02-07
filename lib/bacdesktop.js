/**
 * CRI-17851.
 * Se crea el componente. Esta clase permite interactuar con el BAC Desktop que se encuentra
 * instalado en la maquina local del usuario.
 *
 * @author darcia
 * @since 2016-05-08
 * @version 1.0
 *
 * */
var DesktopClient = Stapes.subclass({

    constructor : function(){
        this.MINIMUN_CHROME_VERSION = 55;
        this.MINIMUN_FIREFOX_VERSION = 50;
        this.MINIMUN_IE_VERSION = 10;
        this.MINIMUN_OPERA_VERSION = 42;

        //URL del servicio del BACDesktop
        this.DESKTOP_SERVICE = "https://localhost:8080/desktop";
        //this.DESKTOP_SERVICE = "http://sec10.sbe.cri.corp.redbac.com/bacdesktop-web/tramits";
        //Crea un link en el documento que permite llamar al desktop
		this.triggerLinkId = "BACDesktop"+new Date().getTime();
        this.modalId = this.triggerLinkId+'modal';
		this.modalWarningId = this.triggerLinkId+'warning';
		var link = $("<a id='"+this.triggerLinkId+"' href='#'></a>")
	    $("body").append(link);
	    var modal = this.createModal();
        $("body").append(modal);
	    var warningModal = this.createWarningModal();
        $("body").append(warningModal);		
       
    },

    /**
     * Metodo generico para despachar un callback
     * */
    dispatchCallback: function(callback, data){
        if(callback){
            callback.call(this, data);
        }
    },
	
    /**
     * Realiza un request para obtener una sesion con el BAC Desktop
     * */
     sendRequest: function(message, callback){

        var browserUtils = BrowserUtils(window);
        var browserName = browserUtils.getBrowserVersion().name;
        var browserVersion = browserUtils.getBrowserVersion().version;
        var isIncompatibleBrowser = false;
        switch(browserName){
            case "chrome":

                if (browserVersion < this.MINIMUN_CHROME_VERSION){  
                   isIncompatibleBrowser = true;
                }
                break;  

            case "firefox":
                if (browserVersion < this.MINIMUN_FIREFOX_VERSION){
                    isIncompatibleBrowser = true;
                }
                break;

            case "ie":
                if (browserVersion < this.MINIMUN_IE_VERSION){
                    isIncompatibleBrowser = true;
                }
                break;
                
            case "opera":
                if (browserVersion < this.MINIMUN_OPERA_VERSION){
                    isIncompatibleBrowser = true;           
                }
                break;
            
        }

        if (isIncompatibleBrowser){
            browserUtils.showHeaderMessage("La versión del navegador no es compatible con BAC Firma.");
            return; //Detiene el flujo normal.
        }

        var self = this;
		 //Valida el request
		 if(!message){
		     //console.log("BACDesktop: Request required.");
             this.dispatchCallback(callback);
		 }

		 if(!message.module){
             //console.log("BACDesktop: module field is required in request.");
             this.dispatchCallback(callback);
		 }

        if(!message.operationCode){
            //console.log("BACDesktop: operationCode field is required in request.");
            this.dispatchCallback(callback);
        }

        if(!message.userName){
            //console.log("BACDesktop: userName field is required in request.");
            this.dispatchCallback(callback);
        }

        if(!message.tramitId){
            message.tramitId = new Date().getTime();
        }

        //Verifica si el llamado es modal
        var modal = message.modal;
        if(modal){
            $("#"+this.modalId).modal({
                backdrop: 'static',
                keyboard: false
            });
        }

        //Pasa el objeto a string, para adjuntarlo al URI del schema
        var requestString = JSON.stringify(message);
        requestString = requestString.replace(/"/g, '\\"');
        requestString = "\"" + requestString + "\"";

        //Hace un encode de los datos para poder utilizarla de URI
        requestString = window.btoa(requestString);
        //console.log(requestString);
        $("#"+this.triggerLinkId).attr("href", "bacdesktop:"+requestString);
        //Vanilla JS dado que jQuery no soporta el click del link
        document.getElementById(this.triggerLinkId).click();
        //Ejecuta el consultado de la respuesta
        setTimeout(function(){
           self.getResponse(message, function(response){
           		
           		if(response){
           			console.log(response);
           		}else{
           			browserUtils.showHeaderMessage("No hemos podido establecer comunición con su lector de firma digital.Por favor asegúrse de tener instalado BAC Firma. <a href='#'>Descargar aquí</a>   ");
           		}
			   
               self.dispatchCallback(callback, response);
           });
        }, 2000);
    },

    /**
     * Consulta por la respuesta
     * */
     getResponse: function(message, callback){
        //Metodo que se encarga de obtener la respuesta del desktop
        this.waitForAnswer(message, 0, callback);
     },

    /**
     * Metodo que se encarga de obtener la respuesta del desktop
     * */
    waitForAnswer: function(message, iterationCounter, callback){
        var self = this;
        var module = message.module;
        var tramitId = message.tramitId;
        if(iterationCounter >= 20){
			self.dispatchCallback(callback);
            return false;
        }
        var url = this.DESKTOP_SERVICE + "?module="+module+"&tramitId="+tramitId;
        jQuery.support.cors = true;
        $.ajax({
            url: url,
            data: "",
            type: "GET",
            timeout: 10000,
            dataType: "text",
            success: function(data) {
                try{
                    if(data){
                        var response = JSON.parse(data);
                        if(response.resultCode == "-1"){
                            if(iterationCounter < 20){
                                //reintenta
                                setTimeout(function(){
                                    //console.log("BACDesktop ["+tramitId+"] : Retying response query...("+iterationCounter+")");
                                    iterationCounter++;
                                    self.waitForAnswer(message, iterationCounter, callback);
                                },2000);
                            }else{
                                //console.log("BACDesktop ["+tramitId+"] : No response found!");
								self.dispatchCallback(callback);
                            }
                        }else{
                            if(response.resultCode == "-2"){
                                //console.log("BACDesktop ["+tramitId+"] : Invalid request!");
								self.dispatchCallback(callback);
                            }else{
                                //console.log("BACDesktop ["+tramitId+"] : Response found!");

                                //Verifica si trae resultcontenr
                                try{
                                    if(response.resultContent){
                                        var content = JSON.parse(response.resultContent);
                                        response.resultContent = content;
                                    }
                                }catch(e){
                                    //console.log("BACDesktop ["+tramitId+"] : " + e);
                                }
                                self.dispatchCallback(callback, response);
                            }
                        }
                    }
                }catch(e){
                    //console.log("BACDesktop ["+tramitId+"] : Error! " + e);
                    self.dispatchCallback(callback);
                }
            },
            error: function(jqXHR, textStatus, ex) {
                //console.log("BACDesktop ["+tramitId+"] : Error! " + textStatus + "," + ex + "," + jqXHR.responseText);
                self.dispatchCallback(callback);
            }
        });
    },

    createModal: function(){
       var loadingModal = "";
        loadingModal += '<div class="modal fade" id="'+this.modalId+'" role="dialog">';
        loadingModal += '    <div class="modal-dialog modal-sm">';
        loadingModal += '        <div class="modal-content">';
        loadingModal += '            <div class="modal-body">';
        loadingModal += '                <p style="text-align:center;padding-bottom:10px;padding-top:10px;"><img src="img/desktoploader.gif" /></p>' +
                                        '<div class="well" style="padding:20px;">' +
                                        '<p>Se le solicitar&aacute; la informaci&oacute;n necesaria en el panel auxiliar que aparece en la parte inferior de su pantalla.</p>' +
                                        '<p>Una vez finalizado, podr&aacute; continuar con el flujo normal en la p&aacute;gina actual.</p>' +
                                        '<p class="pull-right"><img src="img/arrow.png" /></p>' +
                                    '</div>';
        loadingModal += '            </div>';
        loadingModal += '        </div>';
        loadingModal += '    </div>';
        loadingModal += ' </div>';
        loadingModal += '</div>';
        return loadingModal;
    },
	
    createWarningModal: function(){
       var loadingModal = "";
        loadingModal += '<div class="modal fade" id="'+this.modalWarningId+'" role="dialog">';
        loadingModal += '    <div class="modal-dialog modal-sm">';
        loadingModal += '        <div class="modal-content">';
        loadingModal += '            <div class="modal-body">';
        loadingModal += '                <div class="well" style="padding:20px;">' +
                                        '<p>No se obtuvo respuesta en el tiempo esperado del BAC Desktop por favor vuelva a intentarlo. Si tiene un panel de BAC Desktop abierto, por favor cerrarlo.</p>' +
                                        '<p>Puede regresar al flujo normal de la pagina.</p>' +
                                    '</div>';
        loadingModal += '            </div>';
        loadingModal += '        </div>';
        loadingModal += '    </div>';
        loadingModal += ' </div>';
        loadingModal += '</div>';
        return loadingModal;
    }	
	
})