/**
 *  @autor gdiazs
 *  @version 1.0 
 *  Esta clase permite validar el navgeador y la versión, también permite mostrar mensajes cuando hay incompatibilidades
 */

 if (+(/MSIE\s(\d+)/.exec(navigator.userAgent)||0)[1] < 9) {
 	alert("La versión de su navegador no se encuentra soportada");
 	window.location.reload();
 }

 var BrowserUtils = (function(win) {


 	function extractBrowserName() {

 		 var name = win.navigator.userAgent;
 		 if (name.match(/OPR\/(.*)$/))
 		 	return "opera";
 		 if (name.match(/Firefox\/(.*)$/))
 		 	return "firefox";
 		 if (name.match(/Chrome\/(.*)$/))
 		 	return "chrome";
 		 if(!!window.MSInputMethodContext && !!document.documentMode){
 		 	return "ie";
 		 }

 	}


	 function isValidIEBrowser (message) {
		 if (+(/MSIE\s(\d+)/.exec(navigator.userAgent)||0)[1] < 11) {
		    alert(message);
		    return false;
		 }
		 return true;
	 }

 	function extractBrowserVersion(){
 		var userAgent = win.navigator.userAgent;
 		var browserName = extractBrowserName();
 		var browserVersion = "";

 		if(browserName === "opera"){
 			var start = userAgent.indexOf("OPR");
 			browserVersion = userAgent.substring(start+4, start+6);
 		}
 		if(browserName === "firefox"){
 			var start = userAgent.indexOf("Firefox");
 			browserVersion = userAgent.substring(start+8, start+10);
 		}
 		if(browserName === "chrome"){
 			var start = userAgent.indexOf("Chrome");
 			browserVersion = userAgent.substring(start+7, start+9);
 		}
 		if (+(/MSIE\s(\d+)/.exec(navigator.userAgent)||0)[1] < 11) {

 			browserName = "ie";
 			browserVersion = +(/MSIE\s(\d+)/.exec(navigator.userAgent)||0)[1];
 		}else{
 			if (browserName === "ie"){
 				browserVersion = 11;
 			}
 		}

 		return {
 			name: browserName,
 			version: browserVersion
 		};
 	}


 	return {

 		getBrowserVersion: function () {
 			return extractBrowserVersion();
 		},

 		showHeaderMessage: function(msg) {
 			
 			$("#idIncompatibleBrowser").remove();

 			var message = "<div id='idIncompatibleBrowser'>" ;
 			message +=	  "	<p>" + msg + " <a id='idIncompatibleBrowserClose' style='float:right;margin-right:20px' href='#'>Cerrar</a></p>";

 			message += 	  "</div>";
 			message += "<div style='clear:both;'></div>";
 
 			$("body").append(message);

 			$("#idIncompatibleBrowser").css({
 				"width": "100%",
 				"height": "0px",
 				"background-color": "#f2dede",
 				"border-bottom":"1px solid rgb(206, 175, 175)",
 				"float" : "left",
 				"top": "0",
 				"position": "absolute",
 				"color": "#8c5e5e",
 				"z-index": "1000",
 				"text-align": "center",
 				"align-items": "center",
 			});

 			$("#idIncompatibleBrowser").animate({
 				"height": "50px",
 				"padding-top": "5px"
 			},{
 				duration: 300,
 			});

 			$("#idIncompatibleBrowserClose").click(function (event) {
 				event.preventDefault();
 				$("#idIncompatibleBrowser").remove();
 			})


		},

		showLoader: function (header, message) {
				var gears = "<?xml version='1.0' encoding='utf-8'?><svg width='68px' height='68px' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid' class='uil-gear'><rect x='0' y='0' width='100' height='100' fill='none' class='bk'></rect><path d='M75,50.5l5-1.5c-0.1-2.2-0.4-4.3-0.9-6.3l-5.2-0.1c-0.2-0.6-0.4-1.1-0.6-1.7l4-3.3c-0.9-1.9-2-3.8-3.2-5.5L69.2,34 c-0.4-0.5-0.8-0.9-1.2-1.3l2.4-4.6c-1.6-1.4-3.3-2.7-5.1-3.8l-3.7,3.6c-0.5-0.3-1.1-0.5-1.6-0.8l0.5-5.2c-2-0.7-4-1.3-6.2-1.6 l-2.1,4.8c-0.6-0.1-1.2-0.1-1.8-0.1l-1.5-5c-2.2,0.1-4.3,0.4-6.3,0.9l-0.1,5.2c-0.6,0.2-1.1,0.4-1.7,0.6l-3.3-4 c-1.9,0.9-3.8,2-5.5,3.2l1.9,4.9c-0.5,0.4-0.9,0.8-1.3,1.2l-4.6-2.4c-1.4,1.6-2.7,3.3-3.8,5.1l3.6,3.7c-0.3,0.5-0.5,1.1-0.8,1.6 l-5.2-0.5c-0.7,2-1.3,4-1.6,6.2l4.8,2.1c-0.1,0.6-0.1,1.2-0.1,1.8l-5,1.5c0.1,2.2,0.4,4.3,0.9,6.3l5.2,0.1c0.2,0.6,0.4,1.1,0.6,1.7 l-4,3.3c0.9,1.9,2,3.8,3.2,5.5l4.9-1.9c0.4,0.5,0.8,0.9,1.2,1.3l-2.4,4.6c1.6,1.4,3.3,2.7,5.1,3.8l3.7-3.6c0.5,0.3,1.1,0.5,1.6,0.8 l-0.5,5.2c2,0.7,4,1.3,6.2,1.6l2.1-4.8c0.6,0.1,1.2,0.1,1.8,0.1l1.5,5c2.2-0.1,4.3-0.4,6.3-0.9l0.1-5.2c0.6-0.2,1.1-0.4,1.7-0.6 l3.3,4c1.9-0.9,3.8-2,5.5-3.2L66,69.2c0.5-0.4,0.9-0.8,1.3-1.2l4.6,2.4c1.4-1.6,2.7-3.3,3.8-5.1l-3.6-3.7c0.3-0.5,0.5-1.1,0.8-1.6 l5.2,0.5c0.7-2,1.3-4,1.6-6.2l-4.8-2.1C74.9,51.7,75,51.1,75,50.5z M50,65c-8.3,0-15-6.7-15-15c0-8.3,6.7-15,15-15s15,6.7,15,15 C65,58.3,58.3,65,50,65z' fill='#998660'><animateTransform attributeName='transform' type='rotate' from='0 50 50' to='90 50 50' dur='1s' repeatCount='indefinite'></animateTransform></path></svg>";
				var crossImage = "<img src='data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDIxLjkgMjEuOSIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjEuOSAyMS45IiB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4Ij4KICA8cGF0aCBkPSJNMTQuMSwxMS4zYy0wLjItMC4yLTAuMi0wLjUsMC0wLjdsNy41LTcuNWMwLjItMC4yLDAuMy0wLjUsMC4zLTAuN3MtMC4xLTAuNS0wLjMtMC43bC0xLjQtMS40QzIwLDAuMSwxOS43LDAsMTkuNSwwICBjLTAuMywwLTAuNSwwLjEtMC43LDAuM2wtNy41LDcuNWMtMC4yLDAuMi0wLjUsMC4yLTAuNywwTDMuMSwwLjNDMi45LDAuMSwyLjYsMCwyLjQsMFMxLjksMC4xLDEuNywwLjNMMC4zLDEuN0MwLjEsMS45LDAsMi4yLDAsMi40ICBzMC4xLDAuNSwwLjMsMC43bDcuNSw3LjVjMC4yLDAuMiwwLjIsMC41LDAsMC43bC03LjUsNy41QzAuMSwxOSwwLDE5LjMsMCwxOS41czAuMSwwLjUsMC4zLDAuN2wxLjQsMS40YzAuMiwwLjIsMC41LDAuMywwLjcsMC4zICBzMC41LTAuMSwwLjctMC4zbDcuNS03LjVjMC4yLTAuMiwwLjUtMC4yLDAuNywwbDcuNSw3LjVjMC4yLDAuMiwwLjUsMC4zLDAuNywwLjNzMC41LTAuMSwwLjctMC4zbDEuNC0xLjRjMC4yLTAuMiwwLjMtMC41LDAuMy0wLjcgIHMtMC4xLTAuNS0wLjMtMC43TDE0LjEsMTEuM3oiIGZpbGw9IiMwMDAwMDAiLz4KPC9zdmc+Cg==' />";


				var div = "";
				div += "<div id='bacfirma-modal'>";
				div +=	"	<div id='bacfirma-modal-message'><div id='bacfirma-close'>";

				div += "		<a  id='bacfirma-modal-close' href='#'>" + crossImage + "</a></div>";

				div	+= "		<div id='bacfirma-modal-body'><h3>"+ header + "</h3> " + gears +" <p>" + message+" </p></div>"
				div += "	</div>"
				div += "</div>";


				var modalCss = {
					"width": "100%",
					"height": "100%",
					"background-color": "rgba(0, 0, 0, 0.50)",
					"opacity": "0",
					"position": "absolute",
					"z-index": "1000",
					"top": "0",
					"left": "0",
					"font-family": "Helvetica,Arial,sans-serif",
				}

				var messageCss = {
					"padding": "10px",
					"width": "30%",
					"background-color": "white",
					"margin": "0 auto",
					"margin-top": "15%",
					"border-radius": "4px",
				};

				var closeCss = {
					"float":"right",
					"display":"none"
				}

				var bodyCss = {
					"text-align":"center",
					"clear": "both"
				}

				$('#bacfirma-loader').remove();
				$('body').append(div);

				$("#bacfirma-modal").css(modalCss);
				$("#bacfirma-close").css(closeCss);
				$("#bacfirma-modal-body").css(bodyCss);
				$("#bacfirma-modal-body h3").css({"font-size":"24px"});

				$("#bacfirma-modal-close").click(function (e) {
					e.preventDefault();
					$("#bacfirma-modal").remove();

				});

				$("#bacfirma-modal #bacfirma-modal-message").css(messageCss);
				$("#bacfirma-modal").animate({"opacity": "1"}, 200, function () {

				});

		},

		closeLoader: function () {
			$("#bacfirma-modal").remove();
		}
 		
 	}

 });