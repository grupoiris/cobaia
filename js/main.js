$( document ).ready(function() {
		
		
    	/*var arrayPais = JSON.parse( '<?php echo json_encode($paises) ?>' );
    	//var options = '<option>-Seleccione-</option>';			      
		//for (var i = 0; i < arrayPais.length; i++) {				      	
			//options += '<option value="' + arrayPais[i][0] + '">' + arrayPais[i][1] + '</option>';
		//}
		//$("#pais").html(options);*/
		//$.getJSON("http://cobaia.co/enviarNotificacion.php?callback=?",{deviceToken: "89a7df8f9544ea2913b1a3e2f96b96798c00122a19dddd76511f002e7074e868"},function(res){        
			//console.log(res); 
		//});
		
});
function tick(){
    var intYears, intMonths, intDates, intHours, intMinutes, intSeconds;
    var today;
    today = new Date();
    
    intYears   = today.getUTCFullYear();
    intMonths  = today.getUTCMonth()   ;
    intDates   = today.getUTCDate()    ;
    intHours   = today.getUTCHours()   ;
    intMinutes = today.getUTCMinutes() ;
    intSeconds = today.getUTCSeconds() ;
    
    var fechaGw = (intYears+"-"+(intMonths+1)+"-"+intDates+" "+intHours+":"+intMinutes+":"+intSeconds); 
    var fff =  new Date(fechaGw); 
    return fff;
}

function enviar(){
    //$.getJSON("http://cobaia.co/cobaia/enviarNotificacion.php?callback=?",{idUser: 8},function(res){
    $.getJSON("http://cobaia.co/enviarNotificacion.php?callback=?",{deviceToken: "89a7df8f9544ea2913b1a3e2f96b96798c00122a19dddd76511f002e7074e868"},function(res){        
        console.log(res); 
    });
}

function registrarDispositivo(){
    var pushNotification = window.plugins.pushNotification;    
    if ( device.platform == 'iOS' || device.platform == 'IOS' || device.platform == "ios" ){
        pushNotification.register(successHandler2,errorHandler2,{ "badge":"true","sound":"true","alert":"true", "ecb":"onNotificationAPN"});
    }else{
        pushNotification.register(successHandler, errorHandler,{"senderID":"219469657172","ecb":"onNotificationGCM"}); 
    }   
}

function successHandler(result) { 
    console.log('Callback Success! Result = '+result) 
}

function errorHandler(error) {  
    console.log("Error "+error); 
}

function successHandler2(result) {                     
    var regId = result;
    var sal1 = localStorage.getItem('user');
    var sal = JSON.parse(sal1);
    var id = sal[1]; 
    var plataforma = device.platform;
    $.getJSON("http://cobaia.co/cobaia/admin/app_controller/registroNtf.php?callback=?",{idUser: id, regId: regId, disp: plataforma },function(res){
        console.log("Registro ios"+res);
    });
 } 
 
function errorHandler2(error) { 
   alert("Intenta nuevamente IOS "); 
}

 function onNotificationAPN (event) { 
    var pushNotification = window.plugins.pushNotification; 
    if (event.alert) { 
        navigator.notification.alert(event.alert);
    } 
    if (event.badge) { 
        pushNotification.setApplicationIconBadgeNumber(function(){alert("sucees APN");}, function(){alert("error APN");}, event.badge); 
    } 
    if (event.sound) { 
        var snd = new Media(event.sound); 
        snd.play(); 
    } 
} 

function onNotificationGCM(e) { 
    switch( e.event ){ 
        case 'registered': 
            if ( e.regid.length > 0 ){ 
                var regId =e.regid;                                                
                var regId = e.regid;
                var sal1 = localStorage.getItem('user');
                var sal = JSON.parse(sal1);
                var id = sal[1]; 
                var plataforma = device.platform;
                $.getJSON("http://cobaia.co/cobaia/admin/app_controller/registroNtf.php?callback=?",{idUser: id, regId: regId, disp: plataforma },function(res){
                    console.log("Registro en BD = "+res); 
                });
            } 
            break; 
        case 'message': 
            break;
        case 'error': 
            alert('GCM error = '+e.msg); 
            break;
        default: 
            alert('An unknown GCM event has occurred'); 
            break; 
    } 
}


function login(){
    if ($("#recordarL").is(':checked')){
        recordarlogin();
    }    
    if($("#tyc").is(':checked')) {  
        var logeado = false;
        var usr = $("#user").val();
        var pass = $("#pass").val();
        var c = 1; 
        var res ="";  
        
        if (checkConnection()){
           $("#loading").show();            
            $.getJSON("http://cobaia.co/cobaia/admin/app_controller/login_app.php?callback=?",{user: usr, pass: pass,caso: c},function(res){              
                if (res[0]==0){
                    $("#content").load('view/perfil-user.html',function(){                        
                        console.log(res);
                        var myJsonString = JSON.stringify(res);
                        localStorage.setItem("login", true);
                        localStorage.setItem("user", myJsonString);                        
                        var e = GetEdad(res[4]);
                        $("#id").val(res[1]);
                        $("#edad").val(e);                     
                        $("#nombre").val(res[2]); 
                        $("#apellido").val(res[3]); 
                        $("#dir").val(res[11]); 
                        $("#tel").val(res[12]);                     
                        $("#country").val(res[5]);                     
                        $("#city").val(res[6]); 
                        $("#socioeconomic").val(res[8]); 
                        $("#genero").val(res[7]); 
                        $("#marker").val(res[9]); 
                        $("#puntos").text(res[10]); 
                        $("#puntos2").text(res[13]); 
                        $("#loading").hide();
                        localStorage.setItem("ultPagina", "login");
                        localStorage.setItem("pagina", "perfil-user");
                        registrarDispositivo();
                        downloadFile();
                        
                    });
                }else{
                    $("#loading").hide();
                    $("#error").html("Datos de Login incorrectos!!");
                    $("#error").fadeIn();
                    setTimeout(function() {
                        $("#error").fadeOut(1500);
                    },3000);   
                }  
            });
            console.log("despues de la peticion "); 
        }
        
    }else{
        alerta("No ha aceptado Términos y condiciones");
    }
    console.log("lal final ");    
}


function perfil(){
    var sal1 = localStorage.getItem('user');
            var sal = JSON.parse(sal1);
            var c = 1;
            $("body").removeClass('body-gris');
            $("body").addClass('body-rosa');
            $("#content").load('view/perfil-user.html',function(){
                localStorage.setItem("pagina", "perfil-user");
                validarPerfil();
                var e = GetEdad(sal[4]);
                $("#id").val(sal[1]);
                $("#edad").val(e); 
                $("#country").val(sal[5]); 
                $("#nombre").val(sal[2]); 
                $("#apellido").val(sal[3]); 
                $("#dir").val(sal[11]); 
                $("#tel").val(sal[12]); 
                $("#city").val(sal[6]);  
                $("#socioeconomic").val(sal[8]); 
                $("#genero").val(sal[7]); 
                $("#marker").val(sal[9]); 
                $("#puntos").text(sal[10]);  
                $("#puntos2").text(sal[13]);  
            });
    ocultarMenu();
}

function convertImgToDataURLviaCanvas(){
    var url = $("#perfil").attr("src");
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL("image/png",1.0);
        canvas = null;   
        guardar();
    };
    img.src = url;    
}

function archivo(fileInput) {
    var files = fileInput.files;
                for (var i = 0; i < files.length; i++) {                    
                    var file = files[i];
                    var img=document.getElementById("imgPerfil");            
                    img.file = file;                   
                    var reader = new FileReader();
                    reader.onload = (function(aImg) { 
                        return function(e) { 
                            aImg.src = e.target.result;
                            localStorage.perfil = e.target.result; 
                            $("#imgPerfil").attr("src",localStorage.perfil);
                            $("#perfil").attr("src",localStorage.perfil);
                        }; 
                    })(img);
                    reader.readAsDataURL(file);
                    resizeAndUpload(file, uploaded, progressBar);
                }    
   
}

function resizeAndUpload(file, callback, progress)
{  
    console.log(file);
    if (file["size"] > "3072000"){
        alerta("Tamaño de la imagen excede los 3MB.");
    }else{
        var reader = new FileReader();
        reader.onloadend = function() {
            var tempImg = new Image();
            tempImg.onload = function() {
                var MAX_WIDTH = 120;
                var MAX_HEIGHT = 120; 
                var tempW = tempImg.width;
                var tempH = tempImg.height;
                var resizedCanvas = document.createElement('canvas');
                resizedCanvas.width = tempW;
                resizedCanvas.height = tempH;
                var ctx = resizedCanvas.getContext("2d");
                ctx.drawImage(this, 0, 0, tempW, tempH);
                var dataURL = resizedCanvas.toDataURL("image/jpeg"); 
                 var sal1 = localStorage.getItem('user');
                var sal = JSON.parse(sal1);
                var id =  sal[1];     
                var fd = new FormData();
                fd.append("file", file);
                $.ajax({
                    url: "http://cobaia.co/cobaia/admin/app_controller/cargarImagen.php?idUser="+id,
                    type: "POST",
                    data: fd,
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    xhr: function() {
                        var xhr = new window.XMLHttpRequest();
                        xhr.upload.addEventListener("progress", function(evt) {
                            if (evt.lengthComputable) {
                                var percentComplete = evt.loaded / evt.total;
                                progress(percentComplete*100);
                            }
                        }, false);
                        return xhr;
                    },
                    success: function(res){
                        console.log("succes "+res);
                    },
                    error: function(e,r){
                        console.log(e);                    
                    }
                }).done(function(respond) {
                    // Una vez ha acabado la subida
                    console.log(respond);
                    //callback(respond);
                });
            };
            tempImg.src = reader.result;
        }
        reader.readAsDataURL(file);
    }
}
 
 
function uploaded(response){
	console.log("uploaded "+response);
}
 
function progressBar(percent){
    $("#error").html("Cargando "+Math.trunc(percent)+"% ..");
    $("#volver").val("Cargando "+Math.trunc(percent)+"% ..");
        $("#error").fadeIn();
    if (""+percent == "100"){
        $("#error").fadeOut();
        $("#volver").val("Volver");
    }
	console.log("progressBar "+percent);
}

function AbrirCamara(id){
	localStorage.setItem("cam", id);
    navigator.camera.getPicture(cameraSuccess, cameraError,{quality: 50});
 }
            
 function AbrirVideo(id){
	 localStorage.setItem("vid", id);
     var options = { duration : 10 };
     navigator.device.capture.captureVideo(captureSuccess, captureError, options);
 }

function AbrirAudio(id) {
	localStorage.setItem("aud", id);
    navigator.device.capture.captureAudio(captureSuccessA, captureError, {limit: 1});
}

 function cameraSuccess(imageData) {	
	var num = localStorage.getItem("cam");
     $(".img-"+num).css("display","block");
     $(".img-"+num).attr("src",imageData); 
     $("#element-"+num).css("display","none");
     
     var sal1 = localStorage.getItem('user');
     var sal = JSON.parse(sal1);
     var idUsu =  sal[1];
     var idEnc = localStorage.idEnc;
     var idEle = $("#element-"+num).attr("id").split("-")[1];
     var ext = imageData.substr(imageData.lastIndexOf('.')); 
     var fecha =  new Date();
     var nombre = idUsu+"-"+idEnc+"-"+idEle+"-"+fecha.getFullYear()+""+(fecha.getMonth()+1)+""+fecha.getDate()+"-"+fecha.getUTCHours()+""+fecha.getMinutes()+""+fecha.getSeconds()+ext;
     localStorage.setItem("imagen", nombre);
	 $("#element-"+num).attr("data-nombre",nombre);
     
     var options = new FileUploadOptions(); 
     options.fileKey="file";
     options.fileName=nombre;
     options.mimeType="image/jpeg";
     options.chunkedMode = false;
     
     
     
     var ft = new FileTransfer();
     ft.upload(imageData, encodeURI("http://cobaia.co/cobaia/admin/app_controller/imagenRespuesta.php"), win, fail,options); 
     
     $("#carga").css("display","block");
     ft.onprogress = function(progressEvent) {
		if (progressEvent.lengthComputable) {
			var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
            $("#carga").text(perc + "% cargado...");
		}
     };
 }
            
 function win(r) {
     alert("Envío correcto "+r.response+" "+r.bytesSent+" "+r.responseCode);    
     $("#carga").css("display","none");
 }

 function fail(error) {
     $("#urlImagen").css("display","none");
     alert("Por favor tome nuevamente la imagen.. ");
     $("#carga").css("display","none");
 }
            
 function captureSuccess(mediaFiles) {
	 var num = localStorage.getItem("vid");
     $("#element-"+num).css("display","none"); 
     $(".video-"+num).css("display","block"); 
	 
     var i, path, len;
     for (i = 0, len = mediaFiles.length; i < len; i += 1) {
         path = mediaFiles[i].fullPath;
         $(".video-"+num).attr("src",path);
         uploadVideo(mediaFiles[i]);
     }
 }

            
 function captureError(message) {
     alert('Toma nuevamente el video: ' + message);
     reintentar(1);
 }

            
 function captureSuccessA(mediaFiles) { 
	var num = localStorage.getItem("aud");
     $("#element-"+num).css("display","none"); 
     $(".audio-"+num).css("display","block"); 

     var i, path, len;
     for (i = 0, len = mediaFiles.length; i < len; i += 1) {
         path = mediaFiles[i].fullPath;
         $(".audio-"+num).attr("src",path);
         uploadAudio(mediaFiles[i]);
     }
 }

function captureErrorA(message) {
     alert('Toma nuevamente el video: ' + message);
     reintentar(3);
 }

function uploadAudio(mediaFile) {
	var num = localStorage.getItem("aud");
    var sal1 = localStorage.getItem('user');
    var sal = JSON.parse(sal1);
    var idUsu =  sal[1];
    var idEnc = localStorage.idEnc;
    var idEle = $("#element-"+num).attr("id").split("-")[1];
    var ext = mediaFile.name.substr(mediaFile.name.lastIndexOf('.')); 
    var fecha =  new Date();
    var nombre = idUsu+"-"+idEnc+"-"+idEle+"-"+fecha.getFullYear()+""+(fecha.getMonth()+1)+""+fecha.getDate()+"-"+fecha.getUTCHours()+""+fecha.getMinutes()+""+fecha.getSeconds()+ext;
    localStorage.setItem("audio", nombre);
	$("#element-"+num).attr("data-nombre",nombre);
    
   var ft = new FileTransfer(),
       path = mediaFile.fullPath,
       name = nombre;
    
    //name = mediaFile.name;

   ft.upload(path,"http://cobaia.co/cobaia/admin/app_controller/videoRespuesta.php",succesVideo,failVideo,{ fileName: name });
    $("#carga").css("display","block");
    ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
            var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
            $("#carga").text(perc + "% cargado...");
        }
     };
}
            
 function cameraError(message) {
     alert('Toma la foto nuevamente ' + message);
     reintentar(2);
 }


function uploadVideo(mediaFile) {
	var num = localStorage.getItem("vid");
    var sal1 = localStorage.getItem('user');
    var sal = JSON.parse(sal1);
    var idUsu =  sal[1];
    var idEnc = localStorage.idEnc;
    var idEle = $("#element-"+num).attr("id").split("-")[1];
    var ext = mediaFile.name.substr(mediaFile.name.lastIndexOf('.')); 
    var fecha =  new Date();
    var nombre = idUsu+"-"+idEnc+"-"+idEle+"-"+fecha.getFullYear()+""+(fecha.getMonth()+1)+""+fecha.getDate()+"-"+fecha.getUTCHours()+""+fecha.getMinutes()+""+fecha.getSeconds()+ext;
    localStorage.setItem("video", nombre);
	$("#element-"+num).attr("data-nombre",nombre);
   var ft = new FileTransfer(),
       path = mediaFile.fullPath,
       name = nombre;
    //name = mediaFile.name;
   
   ft.upload(path,"http://cobaia.co/cobaia/admin/app_controller/videoRespuesta.php",succesVideo,failVideo,{ fileName: name });
    $("#carga").css("display","block");
    ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
            var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
            $("#carga").text(perc + "% cargado...");
        }
     };
}

function failVideo(error) {
    alert('Error uploading file ' + path + ': ' + error.code+" respuesta: "+error.response);
    reintentar(1);
    alert("Por favor tome nuevamente el video..");
 }

function succesVideo(r){
    if (r.response == "true")
        alerta("Envío correcto "); 
    else
        alerta("Intente nuevamente!!"+r.response+" "+r.bytesSent+" "+r.responseCode); 
     $("#carga").css("display","none");
}


function reintentar(valor){
    switch(valor){
        case 1:
            $("#urlVideo").css("display","none");
            $("#carga").css("display","none");
            $(".video").css("display","block");
            
            $("#urlAudio").css("display","none");
            $(".audio").css("display","block");
            break;
        case 2:
            $("#urlImagen").css("display","none");
            $("#carga").css("display","none");
            $(".camara").css("display","block");
            break;
        case 3:
            $("#carga").css("display","none");
            $("#urlAudio").css("display","none");
            $(".audio").css("display","block");
            break;
        default:
    }
    
} 

function validarPerfil(){
    if (localStorage.perfil !== undefined){
        console.log("valida");
        $("#perfil").attr("src",localStorage.perfil);
    }else{
        console.log(" no valida");
    }
}

function logout(){    
    localStorage.removeItem("login");
    limpiarLocalStorage();
    location.reload();
}

function limpiarLocalStorage(){
    localStorage.removeItem("user");
    localStorage.removeItem("idEnc");
    localStorage.removeItem("pagEnc");
    
}

function GetEdad(fecha_nac){
// Si la fecha es correcta, calculamos la edad
    var values=fecha_nac.split("-");
    var dia = values[2];
    var mes = values[1];
    var ano = values[0];
    
    // cogemos los valores actuales
    var fecha_hoy = new Date();
    var ahora_ano = fecha_hoy.getYear();
    var ahora_mes = fecha_hoy.getMonth()+1;
    var ahora_dia = fecha_hoy.getDate();
    
    // realizamos el calculo
    var edad = (ahora_ano + 1900) - ano;
    if ( ahora_mes < mes )
        edad--;    
    if ((mes == ahora_mes) && (ahora_dia < dia))
        edad--;    
    if (edad > 1900)
        edad -= 1900;
    
    // calculamos los meses
    var meses=0;
    if(ahora_mes>mes)
        meses=ahora_mes-mes;
    if(ahora_mes<mes)
        meses=12-(mes-ahora_mes);
    if(ahora_mes==mes && dia>ahora_dia)
        meses=11;
    
    // calculamos los dias
    var dias=0;
    if(ahora_dia>dia)
        dias=ahora_dia-dia;
    if(ahora_dia<dia){
        ultimoDiaMes=new Date(ahora_ano, ahora_mes, 0);
        dias=ultimoDiaMes.getDate()-(dia-ahora_dia);
    }
     return edad;
    
}

function encuestasUsuario(){ 
    localStorage.setItem("ultPagina", "perfil-user");
    var sal1 = localStorage.getItem('user');
    var sal = JSON.parse(sal1);
    var id =  sal[1];
    if (checkConnection()){
        localStorage.setItem("pagina", "encuestas-user");
        $("#content").load("view/encuestas-user.html");    
        $("body").addClass('body-gris');
        $("#menu-user").toggleClass("bgcolor-menu");    
        $("#menu-user").css("background","transparent");
        var c = 1;    
        $("#loading").show();
        $.getJSON("http://cobaia.co/cobaia/admin/app_controller/encuesta_app.php?callback=?",{id: id, caso: c},function(res){
            console.log(res); 
            if (res[0]==1){
                $("#loading").hide();
                $("#encuesta").html("");
                $("#error").html("No tiene encuestas pendientes por contestar!!");
                $("#error").fadeIn();
                setTimeout(function() {
                    $("#error").fadeOut(1500);
                },3000);
            }else{  
                $("#loading").hide();
                $("#encuesta").html(res);
                if(typeof(timer) != "undefined")
                    clearInterval(timer);             
            }

        });
    }
}

function infoEncuesta(idEnc){
    $("body").removeClass('body-rosa');
    $("body").addClass('body-gris');
    localStorage.setItem("ultPagina","encuestas-user");
    var c = 2;
    var sal1 = localStorage.getItem('user');
    var sal = JSON.parse(sal1);
    var id =  sal[1];
    var p = sal[5];
    if (checkConnection()){
        $.getJSON("http://cobaia.co/cobaia/admin/app_controller/encuesta_app.php?callback=?",{id: idEnc, caso: c, pais:p},function(res){
            console.log(res);       
            localStorage.setItem("idEnc", res[1][0][0]);
            localStorage.setItem("pagEnc", 1);
            $("#nomEnc").text((res[1][0][1]).toUpperCase());
            $("#descripcionEnc").text(res[1][0][2]);
            if (res.length > 2){
                var f = parseDate((res[1][0][3]).replace(' ', 'T'));
                var f2 = parseDate((res[1][0][4]).replace(' ', 'T'));

                var fechaInicial = new Date(f);
                var fechaFinal = new Date(f2); 

                var valor1 =  parseInt(res[2][1]);
                var fechaFinRango1 = new Date(fechaInicial.getTime()+((valor1) * 3600 * 1000));

                var valor2 =  parseInt(res[3][1]);
                var fechaFinRango2 = new Date(fechaInicial.getTime()+((valor2) * 3600 * 1000));

                var valor3 =  parseInt(res[4][1]);
                var fechaFinRango3 = new Date(fechaInicial.getTime()+((valor3) * 3600 * 1000));

                timer = setInterval(function(){ cronometros(fechaFinRango1,fechaFinRango2,fechaFinRango3); }, 1000);
                $("#puntos1").text(res[2][2]);
                $("#puntos2").text(res[3][2]);
                $("#puntos3").text(res[4][2]);
            }

        });  
        $("#content").load("view/info-encuesta-user.html");
        localStorage.setItem("pagina", "info-encuesta-user");
    }
}

function cronometros(h1,h2,h3){
    var fechaInicio = new Date();
    
    var fechaFin1 = new Date(h1);    
    var dif1 = fechaFin1 - fechaInicio; // diferencia en milisegundos
    var difSeg1 = Math.floor(dif1/1000); //diferencia en segundos  getSeconds()
    
    if (difSeg1 >= 0 ){       
        var segundos1 = difSeg1 % 60; //segundos
        var difMin1 = Math.floor(difSeg1/60); //diferencia en minutos
        var minutos1 = difMin1 % 60; //minutos
        var difHs1 = Math.floor(difMin1/60); //diferencia en horas
        var horas1 = difHs1; //horas
        //console.log("Tiempo "+horas+":"+minutos+":"+segundos); //armo el tiempo de diferencia
        if (horas1   < 10) { hours   = "0"+horas1; } else { hours   = horas1 ; }
        if (minutos1 < 10) { minutes = "0"+minutos1; } else { minutes = minutos1 ; }
        if (segundos1 < 10) { seconds = "0"+segundos1; } else { seconds = segundos1; } 

        $("#conteo1").text(hours+":"+minutes+":"+seconds);
        $("#conteo1").css("color","#C2172C");
        $("#puntos1").css("color","#C2172C");
    }
    
    var fechaFin2 = new Date(h2);    
    var dif2 = fechaFin2 - fechaInicio; // diferencia en milisegundos
    var difSeg2 = Math.floor(dif2/1000); //diferencia en segundos
    if (difSeg2 >= 0 ){
        var segundos2 = difSeg2 % 60; //segundos
        var difMin2 = Math.floor(difSeg2/60); //diferencia en minutos
        var minutos2 = difMin2 % 60; //minutos
        var difHs2 = Math.floor(difMin2/60); //diferencia en horas
        var horas2 = difHs2; //horas
        //console.log("Tiempo "+horas2+":"+minutos2+":"+segundos2); //armo el tiempo de diferencia
        if (horas2   < 10) { hours   = "0"+horas2; } else { hours   = horas2 ; }
        if (minutos2 < 10) { minutes = "0"+minutos2; } else { minutes = minutos2 ; }
        if (segundos2 < 10) { seconds = "0"+segundos2; } else { seconds = segundos2; } 

        $("#conteo2").text(hours+":"+minutes+":"+seconds);
        $("#conteo2").css("color","#C2172C");
        $("#puntos2").css("color","#C2172C");
    }
    
    var fechaFin3 = new Date(h3);    
    var dif3 = fechaFin3 - fechaInicio; // diferencia en milisegundos
    var difSeg3 = Math.floor(dif3/1000); //diferencia en segundos
    if (difSeg3 >= 0 ){
        var segundos3 = difSeg3 % 60; //segundos
        var difMin3 = Math.floor(difSeg3/60); //diferencia en minutos
        var minutos3 = difMin3 % 60; //minutos
        var difHs3 = Math.floor(difMin3/60); //diferencia en horas
        var horas3 = difHs3; //horas
        if (horas3   < 10) { hours   = "0"+horas3 ; } else { hours   = horas3 ; }
        if (minutos3 < 10) { minutes = "0"+minutos3; } else { minutes = minutos3 ; }
        if (segundos3 < 10) { seconds = "0"+segundos3; } else { seconds = segundos3; } 

        $("#conteo3").text(hours+":"+minutes+":"+seconds);
        $("#conteo3").css("color","#C2172C");
        $("#puntos3").css("color","#C2172C");
    }
}

function irAtras(pagina){
    var dir = "view/"+pagina+"-user.html";
    console.log(pagina);
    switch(pagina){
        case "perfil":
            localStorage.setItem("ultPagina", "login");
            var sal1 = localStorage.getItem('user');
            var sal = JSON.parse(sal1);
            var c = 1;
            $("body").removeClass('body-gris');
            $("body").addClass('body-rosa');
            $("#content").load('view/perfil-user.html',function(){
                localStorage.setItem("pagina", "perfil-user");
                validarPerfil();
                var e = GetEdad(sal[4]);
                $("#id").val(sal[1]);
                $("#edad").val(e); 
                $("#country").val(sal[5]); 
                $("#nombre").val(sal[2]); 
                $("#apellido").val(sal[3]); 
                $("#dir").val(sal[11]); 
                $("#tel").val(sal[12]); 
                $("#city").val(sal[6]); 
                $("#socioeconomic").val(sal[8]); 
                $("#genero").val(sal[7]); 
                $("#marker").val(sal[9]); 
                $("#puntos").text(sal[10]);
                $("#puntos2").text(sal[13]);  
            });
            break;
        case "encuestas":
                var sal1 = localStorage.getItem('user');
                var sal = JSON.parse(sal1);
                encuestasUsuario(sal[1]);
            break;
        case "contactenos":
                $("body").addClass('body-gris');
                $("body").removeClass('body-rosa');
                $("#content").load('view/contactenos.html'); 
                localStorage.setItem("pagina", "contactenos");
            break;
        case "infoEncuesta":
            infoEncuesta(localStorage.idEnc);
            break;
		case "login":
			$("body").addClass('body-rosa');
			$("body").removeClass('body-gris');
			$("#content").load('view/login.html');
			
			break;
    } 
}

function irAtrasPregunta(){
    var pag = parseInt(localStorage.pagEnc)-2;
    if (pag > 0){
        if (localStorage.atrasPagSalto != undefined && (parseInt(localStorage.pagEnSalto) == parseInt(localStorage.pagEnc)-1)){
            pag = localStorage.atrasPagSalto-1;
            localStorage.pagEnc = parseInt(localStorage.atrasPagSalto)+1;
            localStorage.removeItem("atrasPagSalto");
            //localStorage.removeItem("pagEnSalto");
        }
        
        var enc = localStorage.getItem('idEnc');
        var sal1 = localStorage.getItem('user');
        var dependientes = localStorage.getItem('ids');
        if (dependientes == undefined)
            dependientes = "";
        
        var sal = JSON.parse(sal1);
        var usr = sal[1];
        if (checkConnection()){
            $("#loading").show();
            console.log(enc+" - "+pag+" - "+usr+"  ");
            //Consultar si hay pagina siguiente por salto
            $.getJSON("http://cobaia.co/cobaia/admin/app_controller/elemento_app2.php?callback=?",{idEnc: enc, pagEnc: pag, user: usr, caso: "3", dep: dependientes},function(res){ 
                console.log(res);
                var estructura = "";
                 var numPregunta ="";
                for (var i in res){
                    switch(i){
                        case "0":                    
                            break;
                        case "1":
                            //$("#num-pregunta").text(res[i]);
                            numPregunta = res[i];
                            var til = "";
                            if (numPregunta =! null)
                                til = res[i];
                            console.log("res: "+til);
                            break;
                        default: 
                            estructura += res[i];
                    }         
                }
                
                var aux = res[0].split("-");        
                switch(aux[0]){
                    case "3":
                        console.log("Entra a la opcion tres");
                        localStorage.pagEnc = parseInt(localStorage.pagEnc)-1;
                        irAtrasPregunta();
                        break;
                    default:
                        $("#num-pregunta").text(numPregunta);
                        console.log(res);
                        localStorage.pagEnc = parseInt(localStorage.pagEnc)-1;                
                        $("#content").load("view/modificarPregunta.html",function(){
                            $("#formPregunta").append(estructura); 
                            $("#num-pregunta").text(til);
                             console.log("siguiente"+localStorage.pagEnc);                            
                            $('.div-element').each(function() {
                                if ($(this).attr("id") == 9){
                                    var idCheck ="";
                                    $('input:checkbox').each(function() {
                                       idCheck += $(this).attr("id").split('-')[3]+",";                                       
                                    });
                                    if (localStorage.ids != undefined){
                                       // var x =localStorage.ids.substring(0,localStorage.ids.length-1);
                                        var ids = localStorage.ids.split(',');
                                        var idNuevos = "";
                                        for(var i=0;i<ids.length;i++){
                                            if (idCheck.indexOf(ids[i]) == -1 )
                                                idNuevos += ids[i]+",";
                                        }
                                        if (idNuevos != ""){
                                            localStorage.ids = idNuevos.substring(0,idNuevos.length-1);
                                        }else{
                                            localStorage.removeItem("ids");
                                        }
                                        
                                    }
                                    
                                }
                                    
                            });
                        }); 
                }
                

                    
                $("#loading").hide();
            });
        }
    }else{
        irAtras("infoEncuesta");
    }
}


function terminos(){
    localStorage.setItem("ultPagina", "contactenos");
    $("body").addClass('body-gris');
    $("body").removeClass('body-rosa');
    $("#content").load('view/terminosCondiciones.html');
    localStorage.setItem("pagina", "terminosCondiciones");
}
 

function historial(){   
    var sal1 = localStorage.getItem('user');
    var sal = JSON.parse(sal1);
    var id =  sal[1];
    if (checkConnection()){
        localStorage.setItem("ultPagina", "perfil-user");
        localStorage.setItem("pagina", "historial-user");
        $("body").addClass('body-gris');
        $("body").removeClass('body-rosa');
        $("#content").load('view/historial-user.html'); 
        $("#loading").show();
        $.getJSON("http://cobaia.co/cobaia/admin/app_controller/encuesta_app.php?callback=?",{idUsr: id, caso: 4},function(res){  
            console.log(res);
            if (res[0]==1 || res[0]==2){
               $("#error").html("No existe historial de encuestas!");
                $("#error").fadeIn();
                setTimeout(function() {
                    $("#error").fadeOut(1500);
                },3000); 
            }else{
               $("#encuesta").html(res); 
            } 
           $("#loading").hide(); 
        });    
        ocultarMenu();
    }
}

function contactenos(){
    localStorage.setItem("ultPagina", "perfil-user");
    localStorage.setItem("pagina", "contactenos");
    $("body").addClass('body-gris');
    $("body").removeClass('body-rosa');
    $("#content").load('view/contactenos.html'); 
    ocultarMenu();
}

function iniciarEncuesta(){
    localStorage.setItem("ultPagina","info-encuesta-user"); 
    localStorage.setItem("pagina", "info-encuesta-user");
    var enc = localStorage.getItem('idEnc');
    var pag = localStorage.getItem('pagEnc');
    var sal1 = localStorage.getItem('user');
    var dependientes = localStorage.getItem('ids');
    var saltPag = localStorage.getItem('pagEnSalto');
    
    
    if (dependientes == undefined)
        dependientes = "";
    if (saltPag == undefined )
        saltPag = ""; 
        
    var sal = JSON.parse(sal1);
    var usr = sal[1];
    if (checkConnection()){
        $("#loading").show();
        $.getJSON("http://cobaia.co/cobaia/admin/app_controller/elemento_app2.php?callback=?",{idEnc: enc, pagEnc: pag, user: usr, caso: 2, dep:dependientes, salto:saltPag},function(res){ 
            console.log(res);
            var estructura = ""; 
            for (var i in res){
                switch(i){
                    case "0":
                        break;
                    case "1":
                        $("#num-pregunta").text(res[i]);
                        var til = res[i];
                        break;
                    default: 
                        estructura += res[i];
                }         
            }
            var aux = res[0].split("-");        
            switch(aux[0]){
                case "1":       //Mando el total de puntos adquiridos por la encuentas y las gracias boton siguiente a nuevamente encuentas
                    console.log("uno ");
                    var c =3;
                    var enc =  localStorage.idEnc;
                    var sal1 = localStorage.getItem('user');
                    var sal = JSON.parse(sal1);
                    var id =  sal[1];
                    var p  = sal[5];
                    var est = 3;
                    $.getJSON("http://cobaia.co/cobaia/admin/app_controller/encuesta_app.php?callback=?",{idEnc: enc, idUsr: id, estado: est ,caso: c, pais:p},function(res){  
                        console.log("Fin encuesta "+res);
                        localStorage.removeItem("idEnc");  
                        $("#content").load("view/fin-encuesta-user.html",function(){
                            puntosPorEncuesta(enc);
                        });
                    });           

                    break;
                case "2":       //Error en el idEnc y lo mando a todas las encuentas
                    $("#content").load("view/encuestas-user.html");
                    localStorage.setItem("pagina", "encuestas-user");
                    break;
                case "3":
                    var enc = localStorage.getItem('idEnc');
                    var dependientes = localStorage.getItem('ids');
                    $.getJSON("http://cobaia.co/cobaia/admin/app_controller/elemento_app2.php?callback=?",{idEnc: enc, user: usr, caso: 4, dep:dependientes},function(res){ 
                        console.log(res);
                        var estructura = ""; 
                        for (var i in res){
                            switch(i){
                                case "0":
                                    break;
                                case "1":
                                    $("#num-pregunta").text(res[i]);
                                    var til = res[i];
                                    break;
                                default: 
                                    estructura += res[i];
                            }         
                        }
                        var aux = res[0].split("-");
                        localStorage.pagEnc = parseInt(aux[1])+1;
                        $("#content").load("view/pregunta.html",function(){
                            $("#formPregunta").append(estructura); 
                            $("#num-pregunta").text(til);

                        });
                    });
                    break;
                default:
                    localStorage.pagEnc = parseInt(aux[1])+1;
                    $("#content").load("view/pregunta.html",function(){
                        $("#formPregunta").append(estructura); 
                        $("#num-pregunta").text(til);

                    });
                    estadoEncuesta(2);
            }
            $("#loading").hide();
        });
    }
}

function parseDate(s) {
  var b = s.split(/\D+/);
  return new Date(b[0]+"/"+ b[1]+"/"+ b[2]+" "+b[3]+":"+ b[4]+":"+ b[5]);
}


function puntosPorEncuesta(idEnc){
    var sal1 = localStorage.getItem('user');
    var sal = JSON.parse(sal1);
    var id =  sal[1];
    var p = sal[5];
    if (checkConnection()){
        $("#loading").show();
        $.getJSON("http://cobaia.co/cobaia/admin/app_controller/encuesta_app.php?callback=?",{id: idEnc, caso: "2", pais:p},function(res){
            console.log(res);
            if (res.length > 2){
                var f = parseDate(res[1][0][3]);       //Fecha Inicial encuesta
                var f2 = parseDate(res[1][0][4]);      //Fecha Final encuesta
                var fechaInicial = new Date(f);
                var fechaFinal = new Date(f2);
                var date = new Date();
                var ffu = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());       //Fecha Final encuesta usuario
                
                intYears   = ffu.getUTCFullYear();
                intMonths  = ffu.getUTCMonth()   ;
                intDates   = ffu.getUTCDate()    ;
                intHours   = ffu.getUTCHours()   ;
                intMinutes = ffu.getUTCMinutes() ;
                intSeconds = ffu.getUTCSeconds() ;
                
                var valor1 =  parseInt(res[2][1]);
                var valor12 =  parseInt(res[2][0]);
                
                var fechaInicialRango1 = new Date(fechaInicial.getTime()+((valor12) * 3600 * 1000));
                var fechaFinRango1 = new Date(fechaInicial.getTime()+((valor1) * 3600 * 1000));
                
                var valor2 =  parseInt(res[3][1]);
                var valor22 =  parseInt(res[3][0]);
                var fechaInicialRango2 = new Date(fechaInicial.getTime()+((valor22) * 3600 * 1000));
                var fechaFinRango2 = new Date(fechaInicial.getTime()+((valor2) * 3600 * 1000));
                var valor3 =  parseInt(res[4][1]);
                var valor32 =  parseInt(res[4][0]);
                var fechaInicialRango3 = new Date(fechaInicial.getTime()+((valor32) * 3600 * 1000));
                var fechaFinRango3 = new Date(fechaInicial.getTime()+((valor3) * 3600 * 1000));
                var ptos = 0;
                if (ffu >= fechaInicialRango1 && ffu <= fechaFinRango1){
                    ptos = parseInt(res[2][2]);
                }else if(ffu >= fechaInicialRango2 && ffu <= fechaFinRango2){
                    ptos = parseInt(res[3][2]);
                }else if(ffu >= fechaInicialRango3 && ffu <= fechaFinRango3){
                    ptos = parseInt(res[4][2]);
                }
                console.log("puntos "+ptos); 
                $("#puntosObtenidos").text(ptos);
                //guardar puntos
                $("#loading").hide();
                if (checkConnection()){
                    $("#loading").show();
                    $.getJSON("http://cobaia.co/cobaia/admin/app_controller/encuesta_app.php?callback=?",{idEnc: idEnc, idUser: id, puntos: ptos ,caso: "5"},function(res){
                        console.log(res);
                    });
                    $("#loading").hide();
                }
            }else{
                $("#loading").hide();
            }

        });
    }
}

function siguiente(){ 
    $("#error").fadeOut();
    var enc = localStorage.getItem('idEnc');
    var pag = localStorage.getItem('pagEnc');
    var sal1 = localStorage.getItem('user');
    var dependientes = localStorage.getItem('ids');
    if (dependientes == undefined)
        dependientes = "";
    
    var sal = JSON.parse(sal1);
    var usr = sal[1];
    if (checkConnection()){
        $("#loading").show();
        console.log(enc+" - "+pag+" - "+usr+"  ");
        //Consultar si hay pagina siguiente por salto 
        $.getJSON("http://cobaia.co/cobaia/admin/app_controller/elemento_app2.php?callback=?",{idEnc: enc, pagEnc: pag, user: usr, caso: "1", dep: dependientes },function(res){ 
            console.log(res);
            var estructura = "";
            for (var i in res){
                switch(i){
                    case "0":                    
                        break;
                    case "1":
                        $("#num-pregunta").text("");
                        var til = res[i]+"";
                        console.log("Titulo "+res[i]);
                        if (res[i] == null){
                            til = "";                            
                        }
                        $("#num-pregunta").text(til);
                        console.log("res:"+til+".");
                        break;
                    default: 
                        estructura += res[i];
                }         
            }
            switch(res[0]){
                case "1":       //Mando el total de puntos adquiridos por la encuentas y las gracias boton siguiente a nuevamente encuentas
                    console.log("uno ");
                    var c =3;
                    var enc =  localStorage.idEnc;
                    var sal1 = localStorage.getItem('user');
                    var sal = JSON.parse(sal1);
                    var id =  sal[1];
                    var p  = sal[5];
                    var est = 3;
                     console.log("dos ");
                    $.getJSON("http://cobaia.co/cobaia/admin/app_controller/encuesta_app.php?callback=?",{idEnc: enc, idUsr: id, estado: est ,caso: c, pais:p},function(res){  
                        console.log("Fin encuesta "+res);
                        localStorage.removeItem("idEnc"); 
                        $("#content").load("view/fin-encuesta-user.html",function(){
                            puntosPorEncuesta(enc);
                        });
                    });

                    break;
                case "2":       //Error en el idEnc y lo mando a todas las encuentas
                    $("#content").load("view/encuestas-user.html");
                    localStorage.setItem("pagina", "encuestas-user");
                    break;
                case "3":
                    console.log("Entra a la opcion tres");
                    localStorage.pagEnc = parseInt(localStorage.pagEnc)+1;
                    siguiente();
                    break;
                default:
                    console.log(res);
                    localStorage.pagEnc = parseInt(localStorage.pagEnc)+1;                
                    $("#content").load("view/pregunta.html",function(){
                        $("#formPregunta").append(estructura); 
                        $("#num-pregunta").text(til);
                         console.log("siguiente"+localStorage.pagEnc);
                    });
                    break;
            }      
            $("#loading").hide();
        });
    }
}

function guardarRespuesta(){ 
    if (validarFormulario()){
        localStorage.setItem("ultPagina","pregunta");
        localStorage.setItem("pagina", "info-encuesta-user");
        var vec2 = new Array();
        var f = new Date();
		console.log(f);
        var fecha = f.getFullYear() + "-" + (f.getMonth() +1) + "-" + f.getDate() +" "+ f.getHours()+":"+f.getMinutes()+":"+f.getSeconds();
        
		var sal1 = localStorage.getItem('user');
        var sal = JSON.parse(sal1); 
        var idUsu = sal[1];
        var idEnc = localStorage.getItem('idEnc');        
        var datosEnviar = ""; 
        //var tipoElemento = $(".div-element").attr("id");
        //console.log("tipo elemento"+tipoElemento);
        var salida  = $(".div-element").find("select, textarea, input, input[type='hidden']").serialize();
        console.log("salida "+salida);           
        var salida2 = ""; 
        
        /*salida2 = $(".camara,.video,.idElemento,.audio").attr("id");
        if(salida2!="")            
            salida += "&"+salida2;*/
        if (salida != ""){
            salida += "&";
        }
        
        $(".camara,.video,.idElemento,.audio").attr("id",function(res){
            var id = $(this).attr("id");
            salida += id+"&";
        });
        salida = salida.substring(0,salida.length-1);
        console.log("salida2 "+salida); 
        var respuesta = new Array();
        var vec2 = new Array();
        respuesta = salida.split("&");
        //alert("respuesta "+ respuesta); 
        var i;
        for	(i in respuesta) {             
            var id = respuesta[i].split("=")[0];
            var idP = $("#"+id).closest(".div-element").attr("id");
            switch(idP){                
                case "1":
                case "2":
                case "3":   
                    var vec1 = new Array();
                    var idEle = respuesta[i];
                    var idRes = null;       
                    var idCol = null;
                    var valResp = null;                
                    vec1.push(idUsu);
                    vec1.push(idEnc);
                    vec1.push(idEle);
                    vec1.push(idRes);
                    vec1.push(idCol);
                    vec1.push(valResp);
                    vec1.push(fecha);
                    var datosEnviar = "ArregloPhp[]="+vec1;
                    vec2.push(vec1);
                   break;            
                case "4": 
                case "5":
                case "6":
                    var vec1 = new Array();
                    var idE = respuesta[i].split("=")[0];
                    var idEle = idE.split("-")[1];
                    console.log("IdElemento "+idEle);
                    var idRes = null;       
                    var idCol = null;
                    var valResp = respuesta[i].split("=")[1];                
                    vec1.push(idUsu);
                    vec1.push(idEnc);
                    vec1.push(idEle);
                    vec1.push(idRes);
                    vec1.push(idCol);
                    vec1.push(valResp);
                    vec1.push(fecha);
                    var datosEnviar = "ArregloPhp[]="+vec1;
                    vec2.push(vec1);
                    console.log("vec2 "+vec2);
                    break;
                case "7"://select 
                    var aux= new Array();
                    aux = respuesta[i].split("=");   
                    var vec1 = new Array();
                    var idEle = aux[1].split("-")[0]; 
                    console.log("id ele"+ idEle);
                    var idRes = aux[1].split("-")[1];   
                    var idCol = null;
                    var valResp = null;                
                    vec1.push(idUsu);
                    vec1.push(idEnc);
                    vec1.push(idEle);
                    vec1.push(idRes);
                    vec1.push(idCol);
                    vec1.push(valResp);
                    vec1.push(fecha);
                    var datosEnviar = "ArregloPhp[]="+vec1;
                    vec2.push(vec1);
                    break;
                case "8"://Radio buttons resp-element-39-90=on 
                    var aux= new Array();
                    aux = respuesta[i].split("=");
                    respuesta = $("input[name='"+aux[0]+"']:checked").data("question").split("-");
                    console.log("nueva respuesta "+respuesta);
                    var vec1 = new Array();
                    var idEle = respuesta[2];
                    var idRes = respuesta[3];      
                    var idCol = respuesta[4];
                    var valResp = "";
                    vec1.push(idUsu);
                    vec1.push(idEnc);
                    vec1.push(idEle);
                    vec1.push(idRes);
                    vec1.push(idCol);
                    vec1.push(valResp);
                    vec1.push(fecha);
                    datosEnviar = "ArregloPhp[]="+vec1;
                    vec2.push(vec1);
                    break;
                case "9"://Checkedbox resp-element-41-104=on&resp-element-41-107=on
                    var index;  
                    console.log(respuesta);                 
                    var vec1 = new Array();
                    var idEle = respuesta[i].split("-")[2];
                    var idRes = respuesta[i].split("-")[3];      
                    var idCol = respuesta[i].split("-")[4];
                    var valResp = "";
                    vec1.push(idUsu);
                    vec1.push(idEnc);
                    vec1.push(idEle);
                    vec1.push(idRes);
                    vec1.push(idCol);
                    vec1.push(valResp);
                    vec1.push(fecha);
                    datosEnviar += "ArregloPhp[]="+vec1+"&";
                    vec2.push(vec1);
                    datosEnviar = datosEnviar.substring(0,datosEnviar.length - 1);
                    break;
                case "10"://Tabla de Radios resp-element-42-108=on&resp-element-42-109=on&resp-element-42-110=on&resp-element-42-111=on&resp-element-42-112=on 
                    //$('a').data("category");
                    sal2 = salida.substring(0,salida.length - 3);
                    var r2 = sal2.split("=on&");
                    var index;                
                    console.log("r2  "+r2); 
                    var nom = respuesta[i].split("&");
                    var vec1 = new Array();
                    var idEle = respuesta[i].split("-")[2];
                    var idRes = respuesta[i].split("-")[3]; 
                    var clase = r2[i];
                    var info = $("input[name='"+clase+"']:checked").data("question");                    
                    var idCol = info.split("-")[4];  
                    console.log("idCol  "+idCol);
                    var valResp = "";
                    vec1.push(idUsu);
                    vec1.push(idEnc);
                    vec1.push(idEle);
                    vec1.push(idRes);
                    vec1.push(idCol);
                    vec1.push(valResp);
                    vec1.push(fecha);
                    datosEnviar += "ArregloPhp[]="+vec1+"&";  
                    vec2.push(vec1);
                    datosEnviar = datosEnviar.substring(0,datosEnviar.length - 1);
                    break;
                case "11":
                    var vec1 = new Array();
                    var info = $("#"+id).data("question");
                    var idEle = info.split("-")[2];
                    var idRes = info.split("-")[3]; 
                    var idCol = info.split("-")[4];                    
                    var valResp = "";
                    vec1.push(idUsu);
                    vec1.push(idEnc);
                    vec1.push(idEle);
                    vec1.push(idRes);
                    vec1.push(idCol);
                    vec1.push(valResp);
                    vec1.push(fecha);
                    datosEnviar += "ArregloPhp[]="+vec1+"&"; 
                    vec2.push(vec1);
                    datosEnviar = datosEnviar.substring(0,datosEnviar.length - 1);
                    break;
                case "12":
                    var index; 
                    var c = "";                    
                    c = id;
                    var vec1 = new Array();
                    var idEle = c.split("-")[2];
                    var idRes = c.split("-")[3]; 
                    var idCol = c.split("-")[4];                    
                    var valResp = $("#"+id).val();
                    vec1.push(idUsu);
                    vec1.push(idEnc);
                    vec1.push(idEle);
                    vec1.push(idRes);
                    vec1.push(idCol);
                    vec1.push(valResp);
                    vec1.push(fecha);
                    datosEnviar += "ArregloPhp[]="+vec1+"&"; 
                    vec2.push(vec1);
                    datosEnviar = datosEnviar.substring(0,datosEnviar.length - 1);
                    break;
                case "13":
                    var vec1 = new Array();
                    var info = $("#"+id).attr("name");
                    var idEle = info.split("-")[2];
                    var idRes = info.split("-")[3]; 
                    var idCol = info.split("-")[4];
                    var x = $("#"+id).val();
                    if (x == "on")
                        var valResp = "";
                    else
                        var valResp = x;
                    vec1.push(idUsu);
                    vec1.push(idEnc);
                    vec1.push(idEle);
                    vec1.push(idRes);
                    vec1.push(idCol);
                    vec1.push(valResp);
                    vec1.push(fecha);
                    datosEnviar += "ArregloPhp[]="+vec1+"&"; 
                    vec2.push(vec1);
                    datosEnviar = datosEnviar.substring(0,datosEnviar.length - 1);
                    break;
                case "14":
                    var valor2 = localStorage.imagen;
                    /*var videoData = $("#urlImagen").attr("src");
					if (videoData != undefined){
						var valor = videoData.substr(videoData.lastIndexOf('/')+1);
					}else
						var valor = "";*/
                    var c = "";
                    //var vec2 = new Array(); 
					var clase = $("#"+id).attr("class");
                    //$(".camara").each(function(index, value ){
					if(clase == "camara"){
                            c = id;
                            var vec1 = new Array();
                            var idEle = c.split("-")[1];
							/*var videoData = $(".img-"+idEle).attr("src");
							if (videoData != undefined){
								var valor = videoData.substr(videoData.lastIndexOf('/')+1);
							}else
								var valor = "";*/
							var valor = $("#element-"+idEle).attr("data-nombre");		
                            var idRes = null;       
                            var idCol = null;
                            //var valor2 = idUsu+"-"+idEnc+"-"+idEle+"-"+fecha.getFullYear()+""+(fecha.getMonth()+1)+""+fecha.getDate()+"-"+fecha.getUTCHours()+""+fecha.getMinutes()+""+fecha.getSeconds()+ext;                       
                            //alert(valor2);  
                            var valResp = "img/respuestas/"+valor; 
                            vec1.push(idUsu);
                            vec1.push(idEnc);
                            vec1.push(idEle);
                            vec1.push(idRes);
                            vec1.push("idColumna"); 
                            vec1.push(valResp);
                            vec1.push(fecha);
                            var datosEnviar = "ArregloPhp[]="+vec1;
                            vec2.push(vec1);
                    //}); 
					}					
                   break;
                case "15":
                    var valor2 = localStorage.video;
                    
					/*if (imageData != undefined){
                        var valor = imageData.substr(imageData.lastIndexOf('/')+1);                     
					}else
                         var valor = "";   */               
                    var c = "";
                    //var vec2 = new Array();
					var clase = $("#"+id).attr("class");
                    if(clase == "video"){
                            c = id;
                            var vec1 = new Array();
                            var idEle = c.split("-")[1];
							
							/*var imageData = $(".video-".$idEle).attr("src");
							alert(imageData+" "+".video-".$idEle);
							if (imageData != undefined){
								var valor = imageData.substr(imageData.lastIndexOf('/')+1);                     
							}else
								 var valor = ""; */
							var valor = $("#element-"+idEle).attr("data-nombre");	
                            var idRes = null;       
                            var idCol = null;
                            //var valor2 = idUsu+"-"+idEnc+"-"+idEle+"-"+fecha.getFullYear()+""+(fecha.getMonth()+1)+""+fecha.getDate()+"-"+fecha.getUTCHours()+""+fecha.getMinutes()+""+fecha.getSeconds()+ext;
                            //alert(valor2); 
                            var valResp = "img/respuestas/"+valor; 
                            vec1.push(idUsu);
                            vec1.push(idEnc);
                            vec1.push(idEle);
                            vec1.push(idRes);
                            vec1.push(idCol);
                            vec1.push(valResp);
                            vec1.push(fecha);
                            var datosEnviar = "ArregloPhp[]="+vec1;
                            vec2.push(vec1);
                    }
                   break; 
                case "16": 
                    var valor2 = localStorage.audio;
                    /*var imageData = $("#urlAudio").attr("src");
					if (imageData != undefined){
                        var valor = imageData.substr(imageData.lastIndexOf('/')+1);
                    }else
                         var valor = "";*/
                    var c = "";
                    //var vec2 = new Array();
                    var clase = $("#"+id).attr("class");
                    if(clase == "audio"){
                            c = id;
                            var vec1 = new Array();
                            var idEle = c.split("-")[1]; 
														
							/*var imageData = $(".audio-".$idEle).attr("src");
							alert(imageData+" "+".audio-".$idEle);
							if (imageData != undefined){
								var valor = imageData.substr(imageData.lastIndexOf('/')+1);
							}else
								 var valor = "";*/
							var valor = $("#element-"+idEle).attr("data-nombre");	
                            var idRes = null;       
                            var idCol = null;
                            //var valor2 = idUsu+"-"+idEnc+"-"+idEle+"-"+fecha.getFullYear()+""+(fecha.getMonth()+1)+""+fecha.getDate()+"-"+fecha.getUTCHours()+""+fecha.getMinutes()+""+fecha.getSeconds()+ext;
                            var valResp = "img/respuestas/"+valor; 
                            vec1.push(idUsu);
                            vec1.push(idEnc);
                            vec1.push(idEle);
                            vec1.push(idRes);
                            vec1.push(idCol);
                            vec1.push(valResp);
                            vec1.push(fecha);
                            var datosEnviar = "ArregloPhp[]="+vec1;
                            vec2.push(vec1);
                    }
                   break; 
               default:
                    console.log("default");
                   break;
            }
        }
        console.log(vec2);
            if (vec2 != null || vec2 != undefined){
                if (checkConnection()){
                    $("#loading").show();
                    $.getJSON("http://cobaia.co/cobaia/admin/app_controller/respuestas_app.php?callback=?",{vec2:vec2},function(res){
                        siguiente();  
                        $("#loading").hide();
                    }); 
                }
            }else{
               siguiente();  
               $("#loading").hide(); 
            }
        
    }else{
        $("#error").html("Por favor llene todos los campos!!");
        $("#error").fadeIn();
        setTimeout(function() {
            $("#error").fadeOut(1500);
        },3000);
    }
}

function win(r) {
    if (r.response == "true")
        alerta("Envío correcto "); 
    else
        alerta("Intente nuevamente!! "); 
     $("#carga").css("display","none");
 }

 function fail(error) {
     alert("Por favor tome nuevamente la imagen..");
     reintentar(2);
 }

function validarFormulario() {
    var todoCorrecto = true;
    var formulario = document.formPregunta;
    var marcadoRadio = true; 
    var marcadoNum = false;    
    for (var i=0; i<formulario.length; i++) {
        var id = formulario[i].id; 
        console.log("validar tipo"+formulario[i].type);
        switch(formulario[i].type){                
            case "text":
            case "textarea":
            case "file":     
                var valor = document.getElementById(id).value;
                if( valor == null || valor.length == 0 || /^\s+$/.test(valor) ) {
                  todoCorrecto =  false;
                }
                break;
            case "select-one":
                indice = document.getElementById(id).selectedIndex;
                if( indice == null || indice == 0 ) {
                    todoCorrecto =  false;
                }
                break;
            case "checkbox":
                var check = $("input[type='checkbox']:checked").length;
                if(check == ""){
                    todoCorrecto =  false;
                }
                break;
            case "number":
                var valor = formulario[i].value;
                if (isNaN(parseInt(valor))){
                    todoCorrecto =  false;
                    break;
                }          
                break;
            case "radio":
                var nombre = formulario[i].name;          
                marcadoRadio = (marcadoRadio && $("input[name='"+nombre+"']:radio").is(':checked'));                
                if (!marcadoRadio){
                    todoCorrecto =  false;
                }
                break;
            case "button"://Video, audio, Imagen
                /*var img = $("#urlImagen").attr("src");
                var vid = $("#urlVideo").attr("src");
                if (img == null && vid == null){
                   todoCorrecto =  false;
                }*/  
                break;
            default:
                console.log("defecto");
                break;
        }        
    }    
    return todoCorrecto;
}

function estadoEncuesta(est){
    var c =3;
    var enc =  localStorage.idEnc;
    var sal1 = localStorage.getItem('user');
    var sal = JSON.parse(sal1);
    var id =  sal[1];
    if (checkConnection()){
        $.getJSON("http://cobaia.co/cobaia/admin/app_controller/encuesta_app.php?callback=?",{idEnc: enc, idUsr: id, estado: est ,caso: c},function(res){  
            console.log("estadoEncuesta "+res);              
        }); 
    }
}

function finalizar(){
    encuestasUsuario();
    localStorage.removeItem("idEnc");
    localStorage.removeItem("ids");
    var sal1 = localStorage.getItem('user');
    var sal = JSON.parse(sal1);
    var id =  sal[1];
    $.getJSON("http://cobaia.co/cobaia/admin/app_controller/perfilUser_app.php?callback=?",{idUser: id, caso: "7"},function(res){
        if (res[0]==0){
            var myJsonString = JSON.stringify(res);
            console.log(myJsonString);
            localStorage.setItem("user", myJsonString);
            localStorage.removeItem("ids");
            localStorage.removeItem("pagEnSalto");
            localStorage.removeItem("atrasPagSalto");
            
        }
    });
}

function changePerfil(){
    $("#content").load('view/change-perfil-user.html',function(){
        localStorage.setItem("pagina", "change-perfil-user");
        validarPerfil();
        if (localStorage.perfil !== undefined){
            $("#imgPerfil").attr("src",localStorage.perfil);
        }
    });
}

function mostrarMenu(){
    if ($( ".menu" ).css("display") == "none"){
		$(".menu-flotante").css("display","block");
        $( ".menu" ).css("display","block");
        $( ".menu" ).animate({          
            left: "0%",
        }, 500);
        
        $( "#divMenu2" ).css("display","block");
        $( "#divMenu2" ).animate({          
            left: "0%",
        }, 500); 

		
    }else{
		$(".menu-flotante").css("display","none");
        $( ".menu" ).animate({
            left: "-100%"
        }, 500,function(){$( ".menu" ).css("display","none");});
        
        $( "#divMenu2" ).animate({
            left: "-100%"
        }, 500,function(){$( "#divMenu2" ).css("display","none");});
    }
}

function ocultarMenu(){
    $( ".menu" ).animate({
        left: "-102%"
        }, 500,function(){$( ".menu" ).css("display","none");}
    );
    $( "#divMenu2" ).animate({
            left: "-100%"
    }, 500,function(){$( "#divMenu2" ).css("display","none");});
}

function alerta(mensaje){
    $("#error").html(mensaje);
    $("#error").fadeIn();
    setTimeout(function() {
        $("#error").fadeOut(1500);
    },3000);
}

function aceptarTermino(){
    if ($('#tyc').is(':checked')){
        $("#book").load('view/terminosCondiciones.html',function(){
            $("#terminos").append("<input onclick='salirTerminos()' type='button' value='Aceptar' class='inputs button-general'>");
            $("#head-user").css("display","none");
            $("body").css("background-attachment","inherit");
            $("body").removeClass("body-rosa");
            $("body").addClass("body-gris");
            $( "#book" ).animate({
                left: "0%",
                height: "250%"
            }, 500);
        });     
    }    
}

function salirTerminos(){ 
    $("#loading").show();
    $("body").removeClass("body-gris");
    $("body").addClass("body-rosa");
    console.log("prueba");    
    $( "#book" ).animate({
        left: "-102%"
    }, 500);
    $("body").css("background-attachment","fixed");
     
    $("#loading").hide();
}

function cambiarContrasena(){
    localStorage.setItem("ultPagina", "perfil-user");
    $("#book").css("position","fixed");
    $("#content").load('view/cambiarClave.html',function(){
        localStorage.setItem("pagina", "cambiarClave");
        ocultarMenu();
        $("body").removeClass("body-rosa");
        $("body").addClass("body-gris");
    });
}

function contrasena(){    
    if (validarform()){  
        var _user = $("#user2").val();
        var _pss = $("#pass2").val();
        var _pssAnt = $("#pass1").val();
        if (checkConnection()){
            $.getJSON("http://cobaia.co/cobaia/admin/app_controller/perfilUser_app.php?callback=?",{User: _user, pass : _pss, pass_ant: _pssAnt, caso : '6' },function(res){
                //$("body").removeClass("body-rosa");
                //$("body").addClass("body-gris");
                var mensaje = res[0];
                console.log(mensaje); 
                alerta(mensaje);
                if(mensaje == "Contraseña actualizada con éxito"){
                    $("#user2").val("");
                    $("#pass1").val("");
                    $("#pass2").val("");
					irAtras('login');
                }
            });
        }
    }
}

function validarform(){
    if($("#user2").val().trim() === ''){
		alerta("Debe ingresar el usuario");
		return false;
	}
	else if ($("#pass1").val().trim() === ''){
		alerta("Debe ingresar la contraseña actual");
		return false;
	}
	else if ($("#pass2").val().trim() === ''){
		alerta("Debe ingresar la nueva contraseña");
		return false;
	}
	else if ($("#pass3").val().trim() === ''){
		alerta("Debe confirmar la nueva contraseña");
		return false;
	}
	else if ($("#pass2").val().trim() != $("#pass3").val().trim()){
		alerta("La nueva contraseña y la confirmacion no coinciden");
		return false;
	}
	else{
		return true;
	}
}

function modifyData(valor){
    console.log(valor);
    var opcion = "";
    var sal1 = localStorage.getItem('user');
    var sal = JSON.parse(sal1);
    switch (valor){
        case 1:
            $("#content").load("view/cambioDatosPerfil.html", function(){
                $("body").addClass("body-gris");
                $("#div1").css("display","block");
                $("#1").val(sal[2]);
            }); 
            break;
        case 2:
            $("#content").load("view/cambioDatosPerfil.html", function(){
                $("body").addClass("body-gris");
                $("#div2").css("display","block");
                $("#2").val(sal[3]);
            });
            break;
        case 3:
            break;
        case 4:
            if (checkConnection()){
                $("#loading").show();
                $.getJSON("http://cobaia.co/cobaia/admin/app_controller/perfilUser_app.php?callback=?",{caso: "1", nom: sal[5]+"" },function(res){
                    console.log(res);
                    $("#content").load("view/cambioDatosPerfil.html", function(){
                        $("body").addClass("body-gris");
                        $("#div4").css("display","block");
                        $("#4").html(res);                    
                    });
                    $("#loading").hide();
                });
            }
            break;
        case 5:
            if (checkConnection()){
                $("#loading").show();
                $.getJSON("http://cobaia.co/cobaia/admin/app_controller/perfilUser_app.php?callback=?",{caso: "2", pais: sal[5]+"", nom:sal[6]+"" },function(res){
                    console.log(res);
                    $("#content").load("view/cambioDatosPerfil.html", function(){
                        $("body").addClass("body-gris");
                        $("#div5").css("display","block");
                        $("#5").html(res);                    
                    });
                    $("#loading").hide();
                });
            }
            break;
        case 6:
            $("#content").load("view/cambioDatosPerfil.html", function(){
                $("body").addClass("body-gris");
                $("#div6").css("display","block");
                $("#6").val(sal[11]);
            }); 
            break;
        case 7:
            $("#content").load("view/cambioDatosPerfil.html", function(){
                $("body").addClass("body-gris");
                $("#div7").css("display","block");
                $("#7").val(sal[12]);
            }); 
            break;
        case 8:
            if (checkConnection()){
                $("#loading").show();
                $.getJSON("http://cobaia.co/cobaia/admin/app_controller/perfilUser_app.php?callback=?",{caso: "3", pais: sal[5]+"", est: sal[8]},function(res){
                    console.log(res);
                    $("#content").load("view/cambioDatosPerfil.html", function(){
                        $("body").addClass("body-gris");
                        $("#div8").css("display","block");
                        $("#8").html(res);                    
                    });
                    $("#loading").hide();
                });
            }
            break;
        case 9:
            $("#content").load("view/cambioDatosPerfil.html", function(){
                $("body").addClass("body-gris");
                $("#div9").css("display","block");
                if (sal[7] == "Femenino"){
                    $("#genero_f").prop( "checked", true );
                }else{
                    $("#genero-m").prop( "checked", true );
                }
            });
            break;
        case 10:
            if (checkConnection()){
                $("#loading").show();
                $.getJSON("http://cobaia.co/cobaia/admin/app_controller/perfilUser_app.php?callback=?",{caso: "4", user : sal[1] },function(res){
                    console.log(res);
                    $("#content").load("view/cambioDatosPerfil.html", function(){
                        $("body").addClass("body-gris");
                        $("#div10").css("display","block");
                        $("#div10").append(res); 
                        $("#div10").append("<input class='inputs button-general'  type='button'  value='Guardar' onclick='actualizarPerfil(10)'>");
                    });
                    $("#loading").hide();
                });
            }
            break;
    }
}

function actualizarPerfil(opcion){
    var dato = "";
    switch(opcion){
        case 1:
        case 2:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
            dato = $("#"+opcion).val();
            break;
        case 9:
            dato = $("input:radio[name=9]:checked").val();
            break;
        case 10:
            $('input[type=checkbox]').each(function(){
                if (this.checked) {
                    dato += $(this).val()+', ';
                }
            }); 
            break;
    }
    console.log("opcion "+opcion+" dato "+dato);
    var dato2 = $.trim(dato);
    if (dato2 != "" && dato2 != undefined){
        console.log("entra");
        var sal1 = localStorage.getItem('user');
        var sal = JSON.parse(sal1);
        var id =  sal[1];
        var c = "5";
        if (checkConnection()){
            $("#loading").show();
                $.getJSON("http://cobaia.co/cobaia/admin/app_controller/guardarperfilUser_app.php?callback=?",{caso: opcion, valor : dato, idUser: id},function(res1){
                    console.log(res1);
                    if (res1[0] == false )
                        alerta("Error al actualizar, intente nuevamente.");
                    
                    $.getJSON("http://cobaia.co/cobaia/admin/app_controller/perfilUser_app.php?callback=?",{caso: "5", idUser: id, pais :sal[5] },function(res){
                        console.log(res);
                            if (res[0]==0){
                                $("#content").load('view/perfil-user.html',function(){
                                    localStorage.setItem("pagina", "perfil-user");
                                    $("body").removeClass('body-gris');
                                    $("body").addClass('body-rosa');
                                    validarPerfil();
                                    console.log(res);
                                    var myJsonString = JSON.stringify(res);
                                    localStorage.setItem("user", myJsonString);
                                    var e = GetEdad(res[4]);
                                    $("#id").val(res[1]);
                                    $("#edad").val(e);                     
                                    $("#nombre").val(res[2]); 
                                    $("#apellido").val(res[3]); 
                                    $("#dir").val(res[11]); 
                                    $("#tel").val(res[12]);                     
                                    $("#country").val(res[5]);                     
                                    $("#city").val(res[6]); 
                                    $("#socioeconomic").val(res[8]); 
                                    $("#genero").val(res[7]); 
                                    $("#marker").val(res[9]); 
                                    $("#puntos").text(res[10]); 
                                    $("#puntos2").text(res[13]); 
                                    $("#loading").hide();
                                }); 

                            }else{
                                alerta("verifique los datos del usuario.");   
                            } 
                        });
                    $("#loading").hide();
                });
        }
    }else{
        console.log("no entra"+dato);
    }
}

function recordarlogin(){
     localStorage.usuario = $("#user").val(); 
     localStorage.pass = $("#pass").val();  
     localStorage.tyc = $("#recordarL").attr('checked');
}

function enviarCorreo(){
    var sal1 = localStorage.getItem('user');
    var sal = JSON.parse(sal1);
    var idUser =  sal[1];
    var dato = $("#text-pregunta").val();
    if (checkConnection()){
        $.getJSON("http://cobaia.co/cobaia/admin/app_controller/enviarCorreo_app.php?callback=?",{idUser: idUser, dato : dato},function(res){
            if (res[0]){
                alerta("Mensaje enviado correctamente.");
                $("#text-pregunta").val("");
            }else{
                alerta("Error en la conexión. Intente nuevamente");
                $("#text-pregunta").val("");
            }
        });
    }
}

function checkConnection() {
    return true;
    var result = true;
    var networkState = navigator.connection.type;
    if (networkState == Connection.UNKNOWN || networkState == Connection.NONE){
        alerta("No tiene conexión a internet. Intente nuevamente!!");
        result = false;
    }
    return result;
}

function downloadFile(){
        var sal1 = localStorage.getItem('user');
        var sal = JSON.parse(sal1);
        var id =  sal[1];
        if(id != "undefined" && id != ""){
            var fileTransfer = new FileTransfer();
            var store = cordova.file.dataDirectory;
            fileTransfer.download(
              "http://cobaia.co/cobaia/admin/img/perfil/"+id+".png",
              store+id+".png",
              function(theFile) {
                  $("#perfil").attr("src",theFile.toURI());
                  localStorage.setItem("perfil", theFile.toURI());
              },
                  function(error) {
                      alerta("No tienes imagen de perfil");
                  }
             );            
             fileTransfer.onprogress = function(progressEvent) {
                if (progressEvent.lengthComputable) {
                    var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                }
             };
        }
 }


function onBackKeyDown() {
    var pagina = localStorage.ultPagina;
    if ( pagina != "undefined"){
        switch( pagina ){             
            case 'encuestas-user':
                irAtras("encuestas");
                break;
            case 'info-encuesta-user':
                irAtras("infoEncuesta");
                break;
            case 'pregunta':
                irAtrasPregunta();
                break;
            case 'login':
                var r = confirm("Desea salir de Cobaia?");
                if (r == true) {
                    logout();
                }
                break;
            case 'contactenos':
                irAtras("contactenos");
                break;
            case 'exit':
                navigator.app.exitApp();
                break;
            case 'perfil-user':                
            default:
                irAtras("perfil");
                break;                
        }
    }
}

function ultimaPagina(){
    var pagina = localStorage.pagina;
    console.log("pagin "+pagina);
    if ( pagina != "undefined"){
        switch( pagina ){
            case 'change-perfil-user':
                changePerfil();
                break;
            case 'terminosCondiciones':
                terminos();
                break;
            case 'cambiarClave':
                cambiarContrasena();
                break;
            case 'encuestas-user':
                encuestasUsuario();
                break;
            case 'info-encuesta-user':
                var idE = localStorage.idEnc;
                if(idE != undefined){
                    infoEncuesta(idE);       
                }else{
                    encuestasUsuario();
                }
                break;
            case 'historial-user':
                historial();
                break;
            case 'contactenos':
                contactenos();
                break;
            case 'perfil-user':
            case 'login':
                perfil();
                break;
            default:
                //location.reload();
                break;
        }
    }
}

function paginaPorSalto(){
    //consulto si existe la localstore idPagSalto
}

function guardarPagSalto(valor){
    var salida = $(valor).find("option:selected").attr("title");
    if(salida!=""){
        localStorage.atrasPagSalto = localStorage.pagEnc;
        localStorage.pagEnc=salida;
        localStorage.pagEnSalto = salida;
    }
}

function recuperarContrasena(){
	$("body").addClass('body-gris');
	$("body").removeClass('body-rosa');    
	$("#content").load('view/recuperarClave.html');
}

function solicitarContrasena(){
	var user = $("#user_cambiarPass").val();
	if (user != ""){
		$.getJSON("http://cobaia.co/cobaia/admin/controller/gestionar_usuario.php?callback=?",{User: user, action : "recuperar-clave"},function(res){
			alerta(res);
			$("#user_cambiarPass").val("");
			irAtras('login');
		});
	}else{
		alerta("Ingrese el usuario!!");
	}	
}

function irARegistro(){
	//window.open('registro.php');
	$("#content").load("registro.php");
}