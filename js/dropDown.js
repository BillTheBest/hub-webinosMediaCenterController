function enableServiceBoxes(){
    $('div.serviceBox').each(function(){        
        $(this).children('span.selected,span.selectArrow').click(function(){
            if($(this).parent().children('ul.selectOptions').css('display') == 'none'){
                $(this).parent().children('ul.selectOptions').css('display','block');
            }
            else{
                $(this).parent().children('ul.selectOptions').css('display','none');
            }
        });
                
        $(this).find('li.selectOption').click(function(){
            $(this).parent().css('display','none');
            $(this).parent().siblings('span.selected').html($(this).html());
        });
    });             
} 


function enableFilesBoxes(){    
    
//     $('#filesPanel').trigger('mouseenter');
    
    $('ul.selectOptions_file').each(function(){                  
        $(this).find('li.selectOption_file').click(function(){

//             $('#filesPanel').css('left','-330px');
//             $('#filesPanel').mouseleave();
//             $('#filesPanel').trigger('mouseleave');
            
            $('span.selected_file').data('selectedFile', $(this).html());
            $('span.selected_file').text('Ready to play ' +  $('span.selected_file').data('selectedFile'));

        });
    });             
}


$(document).ready(function() {
    enableServiceBoxes();
    enableFilesBoxes();
});
