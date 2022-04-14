var user = document.getElementById("request.user").value
export { user };
function getToken(name) 
{
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') 
  {
    const cookies = document.cookie.split(/[;""]+/);
    for (let i = 0; i < cookies.length; i++) 
    {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) 
      {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const csrftoken = getToken('csrftoken');
export { csrftoken };

export function getCookie(name) 
{
      // Split cookie string and get all individual name=value pairs in an array
      var cookieArr = document.cookie.split(";");

      // Loop through the array elements
      for(var i = 0; i < cookieArr.length; i++) {
          var cookiePair = cookieArr[i].split("=");

          /* Removing whitespace at the beginning of the cookie name
          and compare it with the given string */
          if(name == cookiePair[0].trim()) {
              // Decode the cookie value and return
              return decodeURIComponent(cookiePair[1]);
          }
      }

      // Return null if not found
      return null;
    }

if(JSON.parse(getCookie('cart')) === undefined)
{
  var cart={};
}
else
{
  var cart = JSON.parse(getCookie('cart'))
};

if(user!='AnonymousUser')
  { 
    var cartItems = document.getElementById('cartItems').value;
    var cartItemsCk = document.getElementById('cartItemsCk').value;

    if(cartItemsCk !== cartItems && JSON.stringify(cart) == "{}") //REMEMBER, match statement will not work for empty object need to stringify it
    {
      cart = newcookie(); //only transfer cookies when cookies are empty and logged in with pending order
      location.reload();
    }

  }

else if(user=='AnonymousUser')
  {
    console.log('Guest: Cart exists | cart: ',cart)
  }

document.cookie='cart=' + JSON.stringify(cart) + ";domain=;path=/"

function newcookie()
{
  var newcookie = document.getElementById("newcookie").value

  newcookie=newcookie.split('&#x27;').join("'");
  newcookie=newcookie.split("'").join('"');
  newcookie=newcookie.split(' ').join('')

  cart=JSON.parse(newcookie)
  return cart

}