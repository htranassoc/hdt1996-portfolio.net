import React,{Component} from 'react';
import '../css/Create.css'
import { domain} from '../../apps/Admin';
import { getToken } from '../../Universal/js/utils';

export class Create extends Component{
    constructor(props){
        super(props)
        this.props=props
        this.state=
        {
            sp:[],
            char_selected:[0,0],
            status:null,
            username:null,
            sec_q1:null,
            sec_a1:null,
            sec_q2:null,
            sec_a2:null,
            first:null,
            middle:null,
            last:null,
            age:null,
            occupation:null,
            email:null,
            city:null,
            state:null,
            zipcode:null,
            country:null,
            pass_shown:false,
        }
        this.noActionKeys={'Shift':null,'Enter':null,'Tab':null,'Control':null,'CapsLock':null,'Escape':null,'Alt':null,'F1':null,'F2':null}
        this.handleCreateClick = async () => {
            let post_data = JSON.parse(JSON.stringify(this.state));
            let password = this.state.sp.join("")
            delete post_data['sp']
            delete post_data['char_selected']
            delete post_data['status']
            post_data['password']=password
            const requestOptions={
                method: 'POST',
                headers:{'Content-Type': 'application/json','X-CSRFToken':getToken('csrftoken')},
                body: JSON.stringify(post_data),
                
            };
            let response = await fetch(`${domain}/api/signup/`,requestOptions);
            let data = await response.json()
            if(data['Error_User'])
            {
                let element = document.querySelector("#Login_Username")
                element.value=''
                element.placeholder=data['Error_User']
                element.classList.add("Login_Failed")
                return console.log(data['Error_User']);
            }

            if(data['Error_Pass'])
            {
                let element = document.querySelector("#Create_Password")
                element.placeholder=data['Error_Pass']
                element.value = ''
                this.state.sp=[]
                element.classList.add("Login_Failed")
                return console.log(this.state.sp);
            }

            console.log('Successfuly Created Account')
            console.log(this.state.sp)
            //this.props.navigate('/react/')
        }

        this.handleElements=(type) => {
            if(type==='reveal')
            {
                let sp = this.state.sp
                let element = document.getElementById("Create_Password")
                this.setState({pass_shown:true})
                return element.value = sp.join('')
            }
        }

        this.handlePassChars = (e,type) => {
            if(this.noActionKeys[e.key] !== undefined){return }

            // Standard push at end of array
            let v_list = e.target.value.split("") //current value in elemenet
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
    }

    componentDidUpdate(){
        console.log(this.state.sp, this.state.char_selected)
    } 
    render(){

        return(
            <div className="Create_Main">
                <div className="Create_Inner_Col Create_Main_Mid">
                        <div className="Create_Title">
                            Create an account
                        </div>
                        <div className="Create_Col_Div Create_Inner_Row">
                            <div className="Create_Label">
                                Set Your Username
                            </div>
                            <div className="Create_Input_Wrapper" >
                                <input className = "Create_Input_Data" id="Login_Username" onChange={(e) => this.setState({username:e.target.value})}></input>
                            </div>
                        </div>

                        <div className="Create_Col_Div Create_Inner_Row" id = "Create_Password_Wrapper">
                            <div className="Create_Label">
                                Set Your Password
                            </div>
                            <div className="Create_Input_Wrapper" id="Create_Password_Sub">
                                <input className = "Create_Input_Data" id="Create_Password" onClick = {(e) => {this.setState({char_selected:[e.target.selectionStart,e.target.selectionEnd]})}} onKeyUp = {(e) => {this.handlePassChars(e,'')}}></input>
                                <button id="Create_Show_Password" onClick={() => {this.handleElements('reveal')}} >Show Password</button>
                            </div>
                        </div>


                        <div className="Create_Col_Div Create_Inner_Row" id="Create_Security_Wrapper">
                            <div className="Create_Label" id="Create_Security_Title">
                                Security Questions
                            </div>
                            <div className="Create_Row_Div Create_Inner_Col" id="Create_Security">
                                <div className="Create_Col_Div Create_Inner_Col Create_Mult_Row_Wrap">
                                    <div className="Create_Col_Div">
                                        <div className="Create_Label">
                                            Sec. Q1
                                        </div>
                                        <div className="Create_Input_Wrapper" >
                                            <input className = "Create_Input_Data" id="Login_Username" onChange={(e) => this.setState({sec_q1:e.target.value})}></input>
                                        </div>
                                    </div>

                                    <div className="Create_Col_Div">
                                        <div className="Create_Label">
                                            Answer
                                        </div>
                                        <div className="Create_Input_Wrapper" >
                                            <input className = "Create_Input_Data" id="Login_Username" onChange={(e) => this.setState({sec_a1:e.target.value})}></input>
                                        </div>
                                    </div>
                                </div>

                                <div className="Create_Col_Div Create_Inner_Col Create_Mult_Row_Wrap">
                                    <div className="Create_Col_Div">
                                        <div className="Create_Label">
                                            Sec. Q2
                                        </div>
                                        <div className="Create_Input_Wrapper" >
                                            <input className = "Create_Input_Data" id="Login_Username" onChange={(e) => this.setState({sec_q2:e.target.value})}></input>
                                        </div>
                                    </div>

                                    <div className="Create_Col_Div">
                                        <div className="Create_Label">
                                            Answer
                                        </div>
                                        <div className="Create_Input_Wrapper" >
                                            <input className = "Create_Input_Data" id="Login_Username" onChange={(e) => this.setState({sec_a2:e.target.value})}></input>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            
                        </div>

                        <div className="Create_Col_Div Create_Inner_Row" id="Login_Mult_Col_Wrapper">
                            <div className="Create_Label"  id="Login_Full_Name_Title">
                                Full Name
                            </div>
                            <div className="Create_Row_Div Create_Inner_Row" id="Login_Mult_Col_Sub">
                                <div className="Create_Col_Div Create_Inner_Col Create_Mult_Col_Wrap">
                                    <div className="Create_Label">
                                        First Name
                                    </div>
                                    <div className="Create_Input_Wrapper">
                                        <input className = "Create_Input_Data"  onChange={(e) => this.setState({first:e.target.value})}></input>
                                    </div>
                                </div>

                                <div className="Create_Col_Div Create_Inner_Col Create_Mult_Col_Wrap">
                                    <div className="Create_Label">
                                        Middle Name
                                    </div>
                                    <div className="Create_Input_Wrapper">
                                        <input className = "Create_Input_Data"  onChange={(e) => this.setState({middle:e.target.value})}></input>
                                    </div>
                                </div>

                                <div className="Create_Col_Div Create_Inner_Col Create_Mult_Col_Wrap">
                                    <div className="Create_Label">
                                        Last Name
                                    </div>
                                    <div className="Create_Input_Wrapper">
                                        <input className = "Create_Input_Data" onChange={(e) => this.setState({last:e.target.value})}></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="Create_Col_Div Create_Inner_Row">
                            <div className="Create_Label">
                                Age
                            </div>
                            <div className="Create_Input_Wrapper"  >
                                <input className = "Create_Input_Data" id="Login_Age"  onChange={(e) => this.setState({age:e.target.value})}></input>
                            </div>
                        </div>

                        <div className="Create_Col_Div Create_Inner_Row">
                            <div className="Create_Label">
                                Occupation
                            </div>
                            <div className="Create_Input_Wrapper"  >
                                <input className = "Create_Input_Data" id="Login_Occupation"  onChange={(e) => this.setState({occupation:e.target.value})}></input>
                            </div>
                        </div>

                        <div className="Create_Col_Div Create_Inner_Row">
                            <div className="Create_Label">
                                Email
                            </div>
                            <div className="Create_Input_Wrapper" >
                                <input className = "Create_Input_Data" id="Login_Email"  onChange={(e) => this.setState({email:e.target.value})}></input>
                            </div>
                        </div>





                        <div className="Create_Col_Div Create_Inner_Row"  id="Login_Mult_Col_Wrapper">
                            <div className="Create_Label" id="Create_Location">
                                Location
                            </div>
                            <div className="Create_Row_Div Create_Inner_Row" id="Login_Mult_Col_Sub">
                                <div className="Create_Col_Div Create_Inner_Col Create_Mult_Col_Wrap">
                                    <div className="Create_Label">
                                        City
                                    </div>
                                    <div className="Create_Input_Wrapper">
                                        <input className = "Create_Input_Data"  onChange={(e) => this.setState({city:e.target.value})}></input>
                                    </div>
                                </div>

                                <div className="Create_Col_Div Create_Inner_Col Create_Mult_Col_Wrap">
                                    <div className="Create_Label">
                                        State
                                    </div>
                                    <div className="Create_Input_Wrapper">
                                        <input className = "Create_Input_Data"  onChange={(e) => this.setState({state:e.target.value})}></input>
                                    </div>
                                </div>

                                <div className="Create_Col_Div Create_Inner_Col Create_Mult_Col_Wrap">
                                    <div className="Create_Label">
                                        Zipcode
                                    </div>
                                    <div className="Create_Input_Wrapper">
                                        <input className = "Create_Input_Data"  onChange={(e) => this.setState({zipcode:e.target.value})}></input>
                                    </div>
                                </div>

                                <div className="Create_Col_Div Create_Inner_Col Create_Mult_Col_Wrap">
                                    <div className="Create_Label">
                                        Country
                                    </div>
                                    <div className="Create_Input_Wrapper">
                                        <input className = "Create_Input_Data"  onChange={(e) => this.setState({country:e.target.value})}></input>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="Spacer"></div>
                        <button id="Create_Button" onClick={()=> {this.handleCreateClick()}}>Create</button>
                        <div className="Create_Inner_Row Create_Options">
                            <div onClick= {(e) => {this.handleLoginOptions(e,'create')}} className="Create_Row_Div" id="Create_Option_Buttons">Back to Login Page</div>
                            <div onClick= {(e) => {this.handleLoginOptions(e,'find')}} className="Create_Row_Div" id="Create_Option_Buttons">Find Username/Password</div>
                        </div>

                </div>
                
            </div>
        )
    }
    
}

