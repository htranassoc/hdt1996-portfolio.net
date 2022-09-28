///////////////////////////////////////////////////// CONVERT ITEMS DICTIONARY FROM PYTHON PASSED INTO HTML INTO USABLE JS DICTIONARY

import {user} from './cookie.mjs';
//console.log(user, 'user')

if(user!='AnonymousUser')

{var itemsjson = document.getElementById("itemsCk").value}
else if(user=='AnonymousUser')

{var itemsjson = document.getElementById("items").value}

//console.log(itemsjson, 'itemsjson');
var imgtypes=['png','jpg','jpeg','png','jfif'];


if(itemsjson ==''){console.log('Exiting Function')};



var itemsjson=itemsjson.split('&#x27;').join('"').split('{"id"').join('[{"id"').split('(').join('').split(')').join('').split('Decimal').join('') //cleanup singular string to create dictionary

for(var img in imgtypes)
    {
        itemsjson=itemsjson.split("."+imgtypes[img]+'"}').join("."+imgtypes[img]+'"');
    }

itemsjson=itemsjson.split("},").join(',');
itemsjson=itemsjson.split(", {'prod").join("}} ,{'prod");
itemsjson=itemsjson.split('}]').join('}}]');
itemsjson=itemsjson.split("'").join('"')

try
{
        var itemsdict=JSON.parse(itemsjson);
        for(var i in itemsdict)
        {
            var itemname=itemsdict[i]['product']['name'];

            if(itemname == "Out of Stock")              
            {
                document.getElementById(itemname+'uparrow'+y).style.visibility="hidden";
                document.getElementById(itemname+'downarrow'+y).style.visibility="hidden";
            }

            else
            {
                null
            }
        }
}

catch
{
    console.log('Parse String Error. Check Formulas and product attributes on cookiecart function in utils.')
}

