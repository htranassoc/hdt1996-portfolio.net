import React  from 'react'
import {CardTemplate} from '../Universal/components/CardTemplate'

let Contact_Card = () => {

    return (
        <CardTemplate 
        Size={['100%','100%']} 
        CT_Title = "Contact Information" 
        Template="Contact"
        Email="h.duongacct@gmail.com"
        Phone="(916) 385-9846"
        Address="42 Paramount Circle  Sacramento, CA 95823"
        
      />
    )
}

export {Contact_Card}