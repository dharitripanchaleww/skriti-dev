function handleForm(e){function t(e){$("#news_article_form").find("button[type=submit]").attr("disabled",!1);const t=e.message;Swal.fire({title:"Success!",text:t,type:"success"}),e.data?.redirect_to&&setTimeout((()=>{window.location.href=e.data?.redirect_to}),1e3)}function r(e,t,r){$("#news_article_form").find("button[type=submit]").attr("disabled",!1);const o=JSON.parse(e.responseText).message;Swal.fire({title:"Error",text:o,type:"error"})}e.on("form:submit",(function(){return!1})),e.on("form:validate",(function(){return!1})),e.on("field:success",(function(){const e=this.$element;switch(e.attr("data-form-field-type")){case"dropdown":e.next().removeClass("invalid-item-border");break;case"image":e.parent().removeClass("invalid-item-border")}})),e.on("field:error",(function(){const e=this.$element;switch(e.attr("data-form-field-type")){case"dropdown":e.next().addClass("invalid-item-border");break;case"image":e.parent().addClass("invalid-item-border")}})),e.on("form:success",(function(e){const o=$(e.element),a=new FormData(o[0]);var i=o.attr("action");o.find("button[type=submit]").attr("disabled",!0),$.ajax({type:"POST",url:i,contentType:!1,processData:!1,data:a,success:t,error:r})}))}$(window).on("load",(function(){$(".selectpicker").selectpicker(),$(".dropify").dropify({messages:{default:"Drag and drop a Image here or click",replace:"Drag and drop or click to replace",remove:"Remove",error:"Ooops, something wrong appended."},error:{fileSize:"The file size is too big (1M max)."}});const e=$("#news_article_form").parsley({triggerAfterFailure:"focusout changed.bs.select"});e&&handleForm(e)}));