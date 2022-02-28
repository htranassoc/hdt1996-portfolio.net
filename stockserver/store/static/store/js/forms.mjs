////////////////////////////////////// Shipping Info Hide Depending on Products and User ////////////////////////////////////
import {user} from './cookie.mjs';
import { csrftoken } from './cookie.mjs';
var shipping = document.getElementById("order.shipping").value;
var total = document.getElementById("order.get_cart_total").value;

if(shipping == 'False')    //if item is non ship item (digital) then hide the form using innerHTML
{
    document.getElementById('shipping-info').innerHTML=''
}

if (user != 'AnonymousUser') //if user is NOT A GUEST then hide user form using innerHTML
{
    //document.getElementById('user-info').innerHTML = ''
}

if (shipping == 'False' && user != 'AnonymousUser')
{
    document.getElementById('form-wrapper').classList.add("hidden");
    document.getElementById('payment-info').classList.remove("hidden")
}

var form = document.getElementById('form')

form.addEventListener('submit', function(e)
{
    e.preventDefault();
    console.log('Form submitted');
    document.getElementById('form-button').classList.add('hidden');
    document.getElementById('payment-info').classList.remove('hidden')
})





////////////////////////////// Submit form data to back end/////////////////////////////////////////////////////

function submitFormData()
    {
        console.log('Payment button clicked')
        var userFormData =
        {
        'name':null,
        'email':null,
        'total':total,
        }

        var shippingInfo =
        {
        'address':null,
        'city':null,
        'state':null,
        'zipcode':null
        }

        if(shipping != 'False')
        {
            shippingInfo.address = form.address.value;
            shippingInfo.city = form.city.value;
            shippingInfo.state = form.state.value;
            shippingInfo.zipcode = form.zipcode.value
        }

        if(user == 'AnonymousUser')
        {
            userFormData.name = form.name.value;
            userFormData.email = form.email.value
        }

        var url = '/store/process_order/'
        fetch(url,
        {
            method:'POST',
            headers:
            {
                'Content-Type':'application/json',
                'X-CSRFToken':csrftoken
            },
            
            body:JSON.stringify({'form':userFormData,'shipping':shippingInfo})
        })
        
        .then((response) => response.json())
        .then((data)=>
        {
            console.log('Success:', data);
            console.log(csrftoken);
            

            cart = {};
            console.log('Cart is reset');


            document.cookie='cart=' + JSON.stringify(cart) + ";domain=;path=/";

            window.alert('Transaction Completed');
            window.location.href = "{% url 'store' %}"
        })
    }

///////////////////////////////////// Render the PayPal button into #paypal-button-container ///////////////////////////////////////////////////////
paypal.Buttons({

        style: {
            color:  'blue',
            shape:  'rect',
        },

        // Set up the transaction
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value:parseFloat(total).toFixed(2)
                    }
                }]
            });
        },

        // Finalize the transaction
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                // Show a success message to the buyer 
                submitFormData()
                alert('Transaction completed by ' + details.payer.name.given_name + '!');
                
            });
        }

    }).render('#paypal-button-container');

