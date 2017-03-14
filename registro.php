	<div>
		<div class="content-enc">
			<div class="div-button-enc">
			</div>
			<form name="ajax-form-registro" id="ajax-form-registro" method="post">
				<div class="div-tittle-table" style="width:1100px;" onclick="irAtras('login')">
					<span>REGISTRO</span>
				</div>
				<div class="table-encuesta div-registro">
					<div id="reg-paso-1" class="div-reg-paso">
						<table class="det-encuesta form-registro">
							<tr>
								<td><span>No. Identificación</span></td>
								<td><input id="no_id" name="no_id" type="text" class="input-det"></td>						
								<td><span>Fecha Nac.</span></td>
								<td><input id="f_nac" name="f_nac" type="date" class="input-det" value="" onchange="validarEdad()"></td>
								<td><span>Género</span></td>
								<td colspan="3"><input id="genero_f" name="genero" type="radio" class="" value="Femenino"><label for="genero_f">Femenino</label>
									<input id="genero-m" name="genero" type="radio" class="" value="Masculino"><label for="genero_m">Masculino</label></td>
							</tr>
							<tr>
								<td><span>Nombres</span></td>
								<td colspan="3"><input id="nombres" name="nombres" type="text" class="input-det"></td>
								<td><span>Apellidos</span></td>
								<td colspan="3"><input id="apellidos" name="apellidos" type="text" class="input-det"></td>
							</tr>
							<tr>
								<td><span>Pais</span></td>
								<td><select id="pais" name="pais" class="input-det">
									<option>-Seleccione-</option>
								</select></td>
								<td><span>Ciudad</span></td>
								<td><select id="ciudad" name="ciudad" class="input-det">
									<option>-Seleccione-</option>
								</select></td>
								<td><span>Dirección</span></td>
								<td colspan="3"><input id="direccion" name="direccion" type="text" class="input-det"></td>
							</tr>
							<tr>
								<td><span>E-mail</span></td>
								<td colspan="3"><input id="email" name="email" type="text" class="input-det"></td>
								<td><span>Teléfono</span></td>
								<td colspan="2"><input id="telefono" name="telefono" type="text" class="input-det"></td>
								<td><input id="idUser" name="idUser" type="text" class="oculto" value="0"></td>
							</tr>
							<tr>
								<td><span>Confirme su E-mail</span></td>
								<td colspan="3"><input id="email-confir" name="email-confir" type="text" class="input-det"></td>
								<td><span>Nivel Socioeconómico</span></td>
								<td colspan="3"><select id="estrato" name="estrato" class="input-det">
									<option>-Seleccione-</option>
								</select></td>
							</tr>
							<tr>
								<td colspan="2"><span>Donde prefieres reclamar tu premio</span></td>
								<td colspan="2"><select id="punto_entrega" name="punto_entrega" class="input-det">
									<option>-Seleccione-</option>
								</select></td>
								<td colspan="4"></td>
							</tr>
						</table>
						<div id="datos-acudiente" class="oculto">							
							<table class="det-encuesta form-registro" style="padding-top: 0;">
								<tr>
									<td colspan="8">
										<h1 class="title">DATOS DEL PADRE O ACUDIENTE</h1>
									</td>
								</tr>
								<tr>
									<td><span>No. Identificación</span></td>
									<td><input id="no_id_acudiente" name="no_id_acudiente" type="text" class="input-det"></td>						
									<td><span>Fecha Nac.</span></td>
									<td><input id="f_nac_acudiente" name="f_nac_acudiente" type="date" class="input-det" value=""></td>
									<td><span>Género</span></td>
									<td colspan="3"><input id="genero_f_acudiente" name="genero_acudiente" type="radio" class="" value="Femenino"><label for="genero_f">Femenino</label>
										<input id="genero-m_acudiente" name="genero_acudiente" type="radio" class="" value="Masculino"><label for="genero_m">Masculino</label></td>
								</tr>
								<tr>
									<td><span>Nombres</span></td>
									<td colspan="3"><input id="nombres_acudiente" name="nombres_acudiente" type="text" class="input-det"></td>
									<td><span>Apellidos</span></td>
									<td colspan="3"><input id="apellidos_acudiente" name="apellidos_acudiente" type="text" class="input-det"></td>
								</tr>
								<tr>
									<td><span>E-mail</span></td>
									<td colspan="3"><input id="email_acudiente" name="email_acudiente" type="text" class="input-det"></td>
									<td><span>Teléfono</span></td>
									<td colspan="2"><input id="telefono_acudiente" name="telefono_acudiente" type="text" class="input-det"></td>
									<td><input id="idUser" name="idUser" type="text" class="oculto" value="0"></td>
								</tr>
							</table>							
						</div>	
						<td class="centrar">
							<p class="elem-txt"><input id="terminos" type="checkbox" value="1">Acepto los <a class="btn-action-enc" onclick="terminos()" >Términos y condiciones</a>.</p>
						</td>
						<div class="div-btn-action" style="padding-bottom:50px; padding-right: 20px">
							<input type="button" class="btn-action-enc" value="Finalizar" onclick="registrarUser()">
							<!--<a id="btn-reg-paso1" class="btn-action-enc">Siguiente<img src="img/next.png" class="icon-action-enc"></a>-->
						</div>					
					</div>
				</div>
			</form>
		</div>
	</div>
	<script type="text/javascript">
		$.getJSON("http://cobaia.co/cobaia/admin/app_controller/registro_app.php?callback=?",{caso: "1"},function(res){ 
			var aux = "<option>-Seleccione-</option>"+res[0];
			$("#pais").html(aux);
		});
		
			
		$("#pais").change(function(){
			var valor = $(this).val();
			$.getJSON("http://cobaia.co/cobaia/admin/app_controller/registro_app.php?callback=?",{caso: "2", idPais : valor},function(res){        
				var aux = "<option>-Seleccione-</option>"+res[0];
				$("#ciudad").html(aux);
			});
			
			$.getJSON("http://cobaia.co/cobaia/admin/app_controller/registro_app.php?callback=?",{caso: "3", idPais : valor},function(res){        
				var aux = "<option>-Seleccione-</option>"+res[0];
				$("#estrato").html(aux);
			});
		});
		
		/*-----FUNCIONES DE REGISTRO-----------------------*/
		
		function registrarUser(){ // when the button is clicked the code executes  
			if($('#terminos:checked').val()){
				if (validarFormRegistro()){
					/*console.log("entro");*/
					var formElement = document.getElementById("ajax-form-registro");
					var FData = new FormData( formElement );
					/*console.log(FData);
					console.log($("ajax-form-registro").serialize());
					$.getJSON("http://cobaia.co/cobaia/admin/app_controller/registro_app.php?callback=?",{caso: "0", data: Fdata,idUser :3},function(res){        
						console.log(res);
					});	*/
					var dataToBeSent = $("#ajax-form-registro").serialize();
					$.getJSON("http://cobaia.co/cobaia/admin/app_controller/registro_app.php?callback=?", {data:dataToBeSent, caso:"0"}, function(data, textStatus) {
						alerta(data[0]);
						console.log(data);
						if(data[1]==1){
							irAtras('login');
						}					
					});
				}
			}else{
				alerta("Debe aceptar los términos y condiciones");
				
			}
		}

		function validarFormRegistro(){

			if($("#no_id").val().trim() === ''){
				alerta("Debe ingresar el No. de Identificación");
				return false;
			}
			else if (!$('input[name="genero"]:checked').val()){
				alerta("Debe seleccionar el género");
				return false;
			}
			else if ($("#nombres").val().trim() === ''){
				alerta("Debe ingresar el nombre");
				return false;
			}
			else if ($("#apellidos").val().trim() === ''){
				alerta("Debe ingresar apellidos");
				return false;
			}
			else if ($("#f_nac").val() == '')  {
				alerta("Debe ingresar la fecha de nacimiento");
				return false;
			}
			else if ($("#pais").val() == null || $("#pais").val() === '-Seleccione-')  {
				alerta("Debe seleccionar el pais");
				return false;
			}
			else if ($("#ciudad").val() == null || $("#ciudad").val() === '-Seleccione-'){
				alerta("Debe seleccionar la ciudad");
				return false;
			}	
			else if ($("#estrato").val() == null || $("#estrato").val() === '-Seleccione-'){
				alerta("Debe seleccionar el estrato");
				return false;
			}		
			else if ($("#direccion").val().trim() === ''){				
				alerta("Debe ingresar la dirección");
				return false;
			}			
			else if ($("#email").val().trim() === ''){
				alerta("Debe ingresar el e-mail");
				return false;
			}
			else if ($("#telefono").val().trim() === ''){
				alerta("Debe ingresar el número de telefono");
				return false;
			}		
			else if ($("#email").val().trim() != $("#email-confir").val().trim()){
				alerta("El e-mail y la confirmacion no coinciden");
				return false;
			}
			else if($('#datos-acudiente').is(':visible')){
				console.log('visible');
				if($("#no_id_acudiente").val().trim() === ''){
					alerta("Debe ingresar el No. de Identificación del padre o acudiente");
					return false;
				}
				else if (!$('input[name="genero_acudiente"]:checked').val()){
					alerta("Debe seleccionar el género del padre o acudiente");
					return false;
				}
				else if ($("#nombres_acudiente").val().trim() === ''){
					alerta("Debe ingresar el nombre del padre o acudiente");
					return false;
				}
				else if ($("#apellidos_acudiente").val().trim() === ''){
					alerta("Debe ingresar apellidos del padre o acudiente");
					return false;
				}
				else if ($("#f_nac_acudiente").val() == '')  {
					alerta("Debe ingresar la fecha de nacimiento del padre o acudiente");
					return false;
				}			
				else if ($("#email_acudiente").val().trim() === ''){
					alerta("Debe ingresar el e-mail del padre o acudiente");
					return false;
				}
				else if ($("#telefono_acudiente").val().trim() === ''){
					alerta("Debe ingresar el número de telefono del padre o acudiente");
					return false;
				}
				else{
					return true;
				}
			}
			else
			{	
			console.log('validacion');	
				return true;
			}
		}


		
		
	</script>
	<!--	
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
	<script src="js/main.js" type="text/javascript"></script>
	<script src="js/jquery.effects.core.js"></script>
	<script src="js/jquery.effects.slide.js"></script>
  	<script type="text/javascript" src="js/jquery.fancybox.js"></script>
    <script>
    $( document ).ready(function() {
		$("#f_nac").change(function(){
					//console.log($("#f_nac").val());
					if($("#f_nac").val() != ""){
						var array_fecha = $("#f_nac").val().split("-");
						var edad = 0;
						dia = array_fecha[2];
						mes = array_fecha[1];
						anho = array_fecha[0];
						hoy = new Date();
						diaActual = hoy.getDate();
						mesActual = hoy.getMonth() + 1;
						yearActual = hoy.getFullYear();
						if((mes >= mesActual)&&(dia > diaActual)){
							edad = (yearActual  - 1 ) - anho;
						}else{
							edad = yearActual - anho;
						}
						if(edad < 12){
							alerta("Debe tener mas de 12 años");
						}
						else if(edad < 18){
							$('#datos-acudiente').slideDown();
						}
						else{
							$('#datos-acudiente').slideUp();
						}
						//console.log(edad);
						//console.log(yearActual +'-' + anho);
					}
				});
    	
    	/*var arrayPais = JSON.parse( '<?php echo json_encode($paises) ?>' );
    	//var options = '<option>-Seleccione-</option>';			      
		//for (var i = 0; i < arrayPais.length; i++) {				      	
			//options += '<option value="' + arrayPais[i][0] + '">' + arrayPais[i][1] + '</option>';
		//}
		//$("#pais").html(options);*/
		
		
	});

	function terminos(){
      $.fancybox.open({
        href : 'terminos.html',
        type : 'iframe',
        padding : 0
      });
    }
  </script>
  <noscript><img height="1" width="1" style="display:none"
				src="https://www.facebook.com/tr?id=1029637210495980&ev=PageView&noscript=1"
				/></noscript>
<!-- End Facebook Pixel Code -->