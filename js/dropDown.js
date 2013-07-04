function enableServiceBoxes(){
    $('div.serviceBox').each(function(){        
        $(this).children('span.selected,span.selectArrow').click(function(){
            if($(this).parent().children('ul.selectOptions').css('display') == 'none'){
                $(this).parent().children('ul.selectOptions').css('display','block');
            }
            else
            {
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
    $('div.filesBox').each(function(){      
        $(this).children('span.selected_file,span.selectArrow_file').click(function(){
            if($(this).parent().children('ul.selectOptions_file').css('display') == 'none'){
                $(this).parent().children('ul.selectOptions_file').css('display','block');
            }
            else
            {
                $(this).parent().children('ul.selectOptions_file').css('display','none');
            }
        });
        
        $(this).find('li.selectOption_file').click(function(){
            $(this).parent().css('display','none');
            $(this).parent().siblings('span.selected_file').html($(this).html());
        });
    });             
} 


$(document).ready(function() {
    enableServiceBoxes();
    enableFilesBoxes();
});
