import React,{Component} from 'react';
import '../css/Main.css'
import { domain } from '../../apps/Admin';
import {Create} from '../components/Create'
import { getToken } from '../../Universal/js/utils';

export class Main extends Component{
    constructor(props){
        super(props)
        this.props=props
        if(this.props.authenticate !== undefined){
            this.authenticate = this.props.authenticate
            this.navigate = (location) => {window.location.href = location}
        }
        else{this.navigate = this.props.navigate}

        if(this.props.handleNavCreateElement){
            this.handleNavCreateElement = this.props.handleNavCreateElement
        }
        this.state=
        {
            sp:[],
            char_selected:[0,0],
            status:null,
            username:null,
            pass_shown:false,
        }
        this.noActionKeys={'Shift':null,'Enter':null,'Tab':null,'Control':null,'CapsLock':null,'Escape':null,'Alt':null,'F1':null,'F2':null}

        this.handlePassChars = (e,type) => {
            if(this.noActionKeys[e.key] !== undefined){return }

            // Standard push at end of array
            let v_list = e.target.value.split("") //current value in element
            let new_chars = [] //Array of new characters mapped with index
            let arr_selected = this.state.char_selected
            let sp = this.state.sp //password in array stored in state
            let sp_copy= JSON.parse(JSON.stringify(sp)) //copy of above used for when showing password


            if(this.state.pass_shown === true)
            {
                sp_copy.splice(arr_selected[0],0,'ph')
            }

            for ( let i = 0; i < v_list.length; i++)
            {
                if(v_list[i] !== '*' && this.state.pass_shown === false)
                {
                    new_chars.push([v_list[i],i])
                }
                else if(this.state.pass_shown === true && v_list[i] !== sp_copy[i])
                {
                    new_chars.push([v_list[i],i])
                }
                v_list[i] = '*'
            }
            
            //mapping new characters based on position
            if(e.key === 'Backspace')
            {
                if(arr_selected[1]-arr_selected[0] > 0)
                {
                    sp.splice(arr_selected[0],arr_selected[1]-arr_selected[0])
                }
                else
                {
                sp.splice(arr_selected[0]-1,1)
                e.target.value=v_list.join("")
                }
                return this.setState({char_selected:[e.target.selectionStart,e.target.selectionEnd],pass_shown:false})
            }

            for ( let i = 0; i < new_chars.length; i++)
            {
                sp.splice(new_chars[i][1],arr_selected[1]-arr_selected[0],new_chars[i][0])
            }
            e.target.value=v_list.join("")
            e.target.selectionStart = arr_selected[0] + 1
            e.target.selectionEnd = arr_selected[0] + 1

            this.setState({char_selected:[e.target.selectionStart,e.target.selectionEnd],pass_shown:false})
        }
        
        this.handleLoginClick = async () => {
            const requestOptions={
                method: 'POST',
                headers:{'Content-Type': 'application/json','X-CSRFToken':getToken('csrftoken')},
                body: JSON.stringify({
                    username:this.state.username,
                    password:this.state.sp.join("")
                }),
            };
            let response = await fetch(`${domain}/api/login/`,requestOptions);
            let data = await response.json()

            if(data['Error_User'])
            {
                let element = document.querySelector("#Login_Username")
                element.value=''
                element.placeholder=data['Error_User']
                element.classList.add("Login_Failed")
                return console.log(data['Error_User']);
            }


            if(data['Login_Error'])
            {
                let div = document.createElement("div")
                div.innerHTML=data['Login_Error']
                div.id="Login_Error"
                let element = document.querySelector(".Login_Main_Mid #Spacer")

                if(document.querySelector("#Login_Error") !== null){
                   document.querySelector("#Login_Error").remove()
                }
                element.appendChild(div)
                return console.log(data['Login_Error'])
            }
            console.log('Successfuly Logged into Account \n \n Status: ',data)

            if(this.authenticate !== undefined){this.authenticate()}
            //this.navigate('/react/')
        }


        this.handleLoginOptions = (e,type) => {
            this.setState({status:type})
        }

        this.handleElements=(type) => {
            if(type==='reveal')
            {
                let sp = this.state.sp
                console.log(sp)
                let element = document.getElementById("Login_Password")
                this.setState({pass_shown:true})
                return element.value = sp.join('')
            }
        }

        this.renderComponentbyStatus = () => {
            if(this.state.status==="create")
            {
                if(this.handleNavCreateElement !== undefined)
                {
                    this.handleNavCreateElement()
                }
                return <Create navigate = {this.props.navigate}/>
            }

            if(this.state.status==="find")
            {
                return console.log('Find Component')
            }
        }
    }

    componentDidUpdate(){
        console.log(this.state.sp)
    }
    render(){

        return(
            <div className="Login_Main">
                {this.state.status !== null?
                this.renderComponentbyStatus()
                :
                <div className="Login_Inner_Col Login_Main_Mid">
                        <div className="Login_Label">
                            Username
                        </div>
                        <div className="Login_Input">
                            <input id="Login_Username" onChange={(e) => this.setState({username:e.target.value})}></input>
                        </div>
                        <div className="Login_Label">
                            Password
                        </div>
                        <div className="Login_Input">
                            <input id="Login_Password" onClick = {(e) => {this.setState({char_selected:[e.target.selectionStart,e.target.selectionEnd]})}} onKeyUp = {(e) => {this.handlePassChars(e,'')}}></input>
                            <button id="Login_Show_Password" onClick={() => {this.handleElements('reveal')}} >Show Password</button>
                        </div>
                        <div id="Spacer">
                        </div>
                        <button id="Login_Button" onClick={()=> {this.handleLoginClick()}}>Login</button>
                        <div className="Login_Inner_Row Login_Options">
                            <div onClick= {(e) => {this.handleLoginOptions(e,'create')}} className="Login_Row_Div">No Account? Create a New Account</div>
                            <div onClick= {(e) => {this.handleLoginOptions(e,'find')}} className="Login_Row_Div">Forgot your Username or Password</div>
                        </div>

                </div>
                }
            </div>
        )
    }
    
}

