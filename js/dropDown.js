function enableSelectBoxes(){
    $('div.selectBox').each(function(){
        $(this).children('span.selected').html($(this).children('ul.selectOptions').children('li.selectOption:first').html());
        $('input.price_values').attr('value',$(this).children('ul.selectOptions').children('li.selectOption:first').attr('data-value'));
        
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
                    $('input.price_values').attr('value',$(this).attr('data-value'));
                    $(this).parent().siblings('span.selected').html($(this).html());
                });
    });             
} 

$(document).ready(function() {
    enableSelectBoxes();
});
