import { user } from './cookie.mjs';
import { getCookie } from './cookie.mjs';
import { csrftoken } from './cookie.mjs';

var cart = JSON.parse(getCookie('cart'));
var updateBtns = document.getElementsByClassName('update-cart');
for (var i = 0; i < updateBtns.length; i++) 
{
	updateBtns[i].addEventListener('click', function()
	{	
		var productId = this.dataset.product;

		var action = this.dataset.action;

		eventactions(productId,action);
		location.reload()
		
	})
}

var clearBtn = document.getElementsByClassName("clearbutton"); //update-cart confused the buttons, made separate class name in main.css
for (i = 0; i < clearBtn.length; i++) 
{
    clearBtn[i].addEventListener('click', function()
    {	
        var action = this.dataset.action;
        
        try{var productId=this.dataset.product}
        catch{productId = 0};

		eventactions(productId,action);
		location.reload();
	})
}


var nvs

var clear_ots = document.getElementsByClassName("clear_ots"); 
for (i = 0; i < clear_ots.length; i++) 
{
    clear_ots[i].addEventListener('click', function()
    {		

		removeitemsoutofstock();
		document.cookie='cart=' + JSON.stringify(cart) + ";domain=;path=/" + ";SameSite=Lax";
		location.reload();
	})
}

function addCookieItem(productId, action)
{
	if(action=='add')
	{
		if(cart[productId] == undefined)
		{
			cart[productId]={'quantity':0};
			cart[productId]['quantity'] += 1;
		}
		else
		{
			cart[productId]['quantity'] += 1;
		};
	}
	else if(action=='remove')
	{
		cart[productId]['quantity'] -= 1;

		if(cart[productId]['quantity'] <=0 || undefined)
		{
			delete cart[productId];
		}	
	}
	else if(action=='clear')
	{
		var cartstr=JSON.stringify(cart)
		if(cartstr != "{}" ){
			cart={};
		}
		else if(cartstr == "{}"){
			console.log('Cart is already empty');
		}
	}
	
	document.cookie='cart=' + JSON.stringify(cart) + ";domain=;path=/" + ";SameSite=Lax";
}

function updateUserOrder(productId, action)
{
		var url = '/store/update_item/';

		fetch(url, 
		{
			
			method:'POST',
			headers:
				{
				'Content-Type':'application/json',
				'X-CSRFToken': csrftoken	
				}, 
			body:JSON.stringify({'productId':productId, 'action':action})
		})
		.then((response) => 
		{
		   return response.json();
		})
		.then((data) => 
		{
			console.log('...')
		})
	
}	




function removeitemsoutofstock()
{	
	if (Object.keys(document.getElementById("newvsold")).length == 0){console.log('Empty Object Detected')}
	else
	{
		for(nvs in newvsold)
		{
		delete cart[newvsold[nvs]];
		}
	}
}

function eventactions(productId,action)
{
	if (user == 'AnonymousUser')
	{
		addCookieItem(productId, action);
	}
	else if (user !== 'AnonymousUser')
	{	
		addCookieItem(productId,action);
		updateUserOrder(productId, action);
	}
}


