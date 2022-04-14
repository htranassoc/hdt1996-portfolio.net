import React, { Component} from 'react';
import {domain,dashboard_dir} from '../../apps/Admin'
import '../css/Dashboard.css'
import '../../React_Login/css/Create.css'

export class Main extends Component {
    constructor(props){
        super(props)
        this.props = props
        this.state=
        {
            UserData:null,
            sp:[],
            sp2:[],
            char_selected:[0,0],
            pass_shown:false,
            to_change_password:false,
            password_verified:{},
            to_update:{},
            chosenSection:'Profile Information',
            showPicOptions:false
        }
        this.getUserData = async () => {
            let response = await fetch(`${domain}/api/getUserData/`)
            let data = await response.json()
            console.log(data)
            console.log(Object.keys(data.user_data))
            this.setState({UserData:data})
            
          }

        this.handleEditPassClick = () => {
            let element = document.querySelector("#Account_Info_Pass_Wrapper")
            console.log('Clicked', element)
            this.setState({to_change_password:true})

        }

        this.handleElements=(e,action,type,index) => {
            let selected_pass = null
            if(type === 'Current'){selected_pass = 'sp'}
            if(type === 'New'){selected_pass = 'sp2'}

            if(action==='reveal')
            {

                let sp = this.state[selected_pass]
                let element = document.querySelectorAll("#Create_Password")
                console.log(element)
                console.log(element[0], element[1])
                element = element[index]
                console.log(element, 'passes')
                this.setState({pass_shown:true})
                return element.value = sp.join('')
            }

            if(action === 'validated_password')
            {
                let element = document.querySelectorAll("#Create_Password")
                element = element[index]
                element.value = ''
                this.setState({[selected_pass]:[]})
                return element.placeholder = this.state.password_verified['Validated']
            }

            if(action === 'invalidated_password')
            {
                let element = document.querySelectorAll("#Create_Password")
                element = element[index]
                element.value = ''
                this.setState({[selected_pass]:[]})
                return element.placeholder = this.state.password_verified['Invalidated']
            }

            if(action === 'edit')
            {
                let parent = e.target.parentElement
                let query_inputs = parent.querySelectorAll('input')
                if( query_inputs.length > 1)
                {
                    for(let i= 0; i < query_inputs.length;i++)
                    {
                        console.log(query_inputs[i])
                        query_inputs[i].classList.remove("Dashboard_hidden")
                        query_inputs[i].style.backgroundColor="rgb(240, 240, 251)"
                    }
                    return
                }
                query_inputs[0].style.backgroundColor="rgb(240, 240, 251)"
                query_inputs[0].classList.remove("Dashboard_hidden")
                return 

            }
        }
        this.noActionKeys={'Shift':null,'Enter':null,'Tab':null,'Control':null,'CapsLock':null,'Escape':null,'Alt':null,'F1':null,'F2':null}
        this.handlePassChars = (e,type) => {
            if(this.noActionKeys[e.key] !== undefined){return }
            let selected_pass = null
            if(type === 'Current'){selected_pass = 'sp'}
            if(type === 'New'){selected_pass = 'sp2'}
            // Standard push at end of array
            let v_list = e.target.value.split("") //current value in elemenet
            
            let new_chars = [] //Array of new characters mapped with index
            let arr_selected = this.state.char_selected
            let sp = this.state[selected_pass] //password in array stored in state
            console.log(v_list)
            console.log(sp)
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
        this.verifyPasswordChange = async () => {
            const requestOptions=
            {
                method: 'POST',
                headers:{'Content-Type': 'application/json'/* ,'X-CSRFToken':getToken('csrftoken') */},
                body: JSON.stringify(this.state.sp.join(""))
            }
            let response = await fetch(`${domain}/api/authenticated/`,requestOptions)
            let data = await response.json()
            if(data['Validated'])
            {
              this.setState({password_verified:data})
              this.handleElements(null,'validated_password','current',0)
            }
            if(data['Invalidated'])
            {
            this.setState({password_verified:data})
            this.handleElements(null,'invalidated_password','current',0)
            }
        }

        this.handleSaveClick = async () => {
            let post_data = JSON.parse(JSON.stringify(this.state));
            let password = this.state.sp.join("")
            let update_data = {}
            delete post_data['sp']
            delete post_data['char_selected']

            let keys = Object.keys(this.state)
            for(let i = 0 ; i< keys.length;i++){
                console.log(keys[i],this.state[keys[i]])
            }
            return
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
        this.chooseSection = (value) => {
            this.setState({chosenSection:value})
        }
        this.renderSection = () => {
            let section = this.state.chosenSection
            if(this.state.UserData === null){return console.log('No Data')}
            if (section === 'Account Information'){
                return (
                <div className="Dashboard_Acct_Inf_Wrapper">
                    <div className="Create_Inner_Col  Dashboard_Acct_Inf_Main">
                        <div className="Dashboard_Title">
                            Account Information
                        </div>
                        <div id="Dashboard_Spacer"></div>
                        <div className="Create_Col_Div Create_Inner_Row Dashboard_AI_Row">
                            <div className="Create_Label Dashboard_Label">
                                Username
                            </div>
                            <div className="Create_Input_Wrapper" >
                                <input className="Dashboard_hidden Create_Input_Data" id="Login_Username" placeholder = {this.state.UserData.username} onChange={(e) => this.setState({username:e.target.value})}></input>
                            </div>
                            <div onClick = {(e) => {this.handleElements(e,'edit',null,null)}} className="Account_Edit">Edit</div>
                        </div>
                        

                        <div className="Create_Col_Div Create_Inner_Row Dashboard_AI_Row" id="Account_Info_Pass_Wrapper">
                            <div className="Create_Label Dashboard_Label" id="Account_Info_Pass_Label">
                                Password
                            </div>
                            {
                                this.state.to_change_password === true?
                                <div className="Account_Info_Pass_Row_Wrapper Create_Inner_Col">
                                    <div className="Create_Input_Wrapper Create_Inner_Row" id="Account_Info_Password">
                                        <input className="Create_Input_Data" id="Create_Password" placeholder="Please Enter Current Password" onClick = {(e) => {this.setState({char_selected:[e.target.selectionStart,e.target.selectionEnd]})}} onKeyUp = {(e) => {this.handlePassChars(e,'Current')}}></input>
                                        <button id="Create_Show_Password"  onClick={() => {this.handleElements(null,'reveal','Current',0)}} >Show Password</button>
                                    </div>
                                    <div className="Create_Input_Wrapper Create_Inner_Row" id="Account_Info_Password">
                                        <input className="Create_Input_Data" id="Create_Password" placeholder="Please Enter Your New Password" onClick = {(e) => {this.setState({char_selected:[e.target.selectionStart,e.target.selectionEnd]})}} onKeyUp = {(e) => {this.handlePassChars(e,'New')}}></input>
                                        <button id="Create_Show_Password"  onClick={() => {this.handleElements(null,'reveal','New',1)}} >Show Password</button>
                                    </div>
                                    <div className="Create_Input_Wrapper">
                                        <button onClick = {() => {this.verifyPasswordChange()}} id="Dashboard_Account_Verify_Pass">Verify Password</button>
                                    </div>
                                </div>
                            :
                                <div onClick = {() => {this.handleEditPassClick()}} id="Account_Edit_Pass">
                                    <div>Edit Password</div>
                                </div>
                            }

                        </div>


                        <div className="Create_Col_Div Create_Inner_Row Dashboard_AI_Row" id="Create_Security_Wrapper">
                            <div className="Create_Label Dashboard_Label" id="Create_Security_Title">
                                Security Questions
                            </div>
                            <div className="Create_Row_Div Create_Inner_Col" id="Create_Security">
                                <div className="Create_Col_Div Create_Inner_Col Create_Mult_Row_Wrap">
                                    <div className="Create_Col_Div">
                                        <div className="Create_Label">
                                            Sec. Q1
                                        </div>
                                        <div className="Create_Input_Wrapper" >
                                            <input className="Dashboard_hidden Create_Input_Data" id="Login_Username" placeholder = {this.state.UserData.user_data.sec_q1} onChange={(e) => this.setState({sec_q1:e.target.value})}></input>
                                        </div>
                                    </div>

                                    <div className="Create_Col_Div">
                                        <div className="Create_Label">
                                            Answer
                                        </div>
                                        <div className="Create_Input_Wrapper" >
                                            <input className="Dashboard_hidden Create_Input_Data" id="Login_Username" placeholder = {this.state.UserData.user_data.sec_a1} onChange={(e) => this.setState({sec_a1:e.target.value})}></input>
                                        </div>
                                    </div>
                                </div>

                                <div className="Create_Col_Div Create_Inner_Col Create_Mult_Row_Wrap">
                                    <div className="Create_Col_Div">
                                        <div className="Create_Label">
                                            Sec. Q2
                                        </div>
                                        <div className="Create_Input_Wrapper" >
                                            <input className="Dashboard_hidden Create_Input_Data" id="Login_Username" placeholder = {this.state.UserData.user_data.sec_q2} onChange={(e) => this.setState({sec_q2:e.target.value})}></input>
                                        </div>
                                    </div>

                                    <div className="Create_Col_Div">
                                        <div className="Create_Label">
                                            Answer
                                        </div>
                                        <div className="Create_Input_Wrapper" >
                                            <input className="Dashboard_hidden Create_Input_Data" id="Login_Username" placeholder = {this.state.UserData.user_data.sec_a2} onChange={(e) => this.setState({sec_a2:e.target.value})}></input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div onClick = {(e) => {this.handleElements(e,'edit',null,null)}} className="Account_Edit_Mult">Edit</div>

                            
                        </div>

                        <div className="Create_Col_Div Create_Inner_Row Dashboard_AI_Row" id="Login_Mult_Col_Wrapper">
                            <div className="Create_Label Dashboard_Label"  id="Login_Full_Name_Title">
                                Full Name
                            </div>
                            <div className="Create_Row_Div Create_Inner_Row" id="Login_Mult_Col_Sub">
                                <div className="Create_Col_Div Create_Inner_Col Create_Mult_Col_Wrap">
                                    <div className="Create_Label">
                                        First Name
                                    </div>
                                    <div className="Create_Input_Wrapper">
                                        <input className="Dashboard_hidden Create_Input_Data" placeholder = {this.state.UserData.user_data.first} onChange={(e) => this.setState({first:e.target.value})}></input>
                                    </div>
                                </div>

                                <div className="Create_Col_Div Create_Inner_Col Create_Mult_Col_Wrap">
                                    <div className="Create_Label">
                                        Middle Name
                                    </div>
                                    <div className="Create_Input_Wrapper">
                                        <input className="Dashboard_hidden Create_Input_Data" placeholder = {this.state.UserData.user_data.middle} onChange={(e) => this.setState({middle:e.target.value})}></input>
                                    </div>
                                </div>

                                <div className="Create_Col_Div Create_Inner_Col Create_Mult_Col_Wrap">
                                    <div className="Create_Label">
                                        Last Name
                                    </div>
                                    <div className="Create_Input_Wrapper">
                                        <input className="Dashboard_hidden Create_Input_Data" placeholder = {this.state.UserData.user_data.last} onChange={(e) => this.setState({last:e.target.value})}></input>
                                    </div>
                                </div>
                            </div>
                            <div onClick = {(e) => {this.handleElements(e,'edit',null,null)}} className="Account_Edit_Mult">Edit</div>
                        </div>
                        <div className="Create_Col_Div Create_Inner_Row Dashboard_AI_Row">
                            <div className="Create_Label Dashboard_Label">
                                Age
                            </div>
                            <div className="Create_Input_Wrapper"  >
                                <input className="Dashboard_hidden Create_Input_Data" placeholder = {this.state.UserData.user_data.age} id="Login_Age"  onChange={(e) => this.setState({age:e.target.value})}></input>
                            </div>
                            <div onClick = {(e) => {this.handleElements(e,'edit',null,null)}} className="Account_Edit">Edit</div>
                        </div>

                        <div className="Create_Col_Div Create_Inner_Row Dashboard_AI_Row">
                            <div className="Create_Label Dashboard_Label">
                                Occupation
                            </div>
                            <div className="Create_Input_Wrapper"  >
                                <input className="Dashboard_hidden Create_Input_Data" placeholder = {this.state.UserData.user_data.occupation} id="Login_Occupation"  onChange={(e) => this.setState({occupation:e.target.value})}></input>
                            </div>
                            <div onClick = {(e) => {this.handleElements(e,'edit',null,null)}} className="Account_Edit">Edit</div>
                        </div>

                        <div className="Create_Col_Div Create_Inner_Row Dashboard_AI_Row" id="Test_Email">
                            <div className="Create_Label Dashboard_Label">
                                Email
                            </div>
                            <div className="Create_Input_Wrapper" >
                                <input className="Dashboard_hidden Create_Input_Data" id="Login_Email"  placeholder = {this.state.UserData.user_data.email} onChange={(e) => this.setState({email:e.target.value})}></input>
                            </div>
                            <div onClick = {(e) => {this.handleElements(e,'edit',null,null)}} className="Account_Edit">Edit</div>
                        </div>





                        <div className="Create_Col_Div Create_Inner_Row Dashboard_AI_Row" id="Login_Mult_Col_Wrapper">
                            <div className="Create_Label Dashboard_Label" id="Create_Location">
                                Location
                            </div>
                            <div className="Create_Row_Div Create_Inner_Row" id="Login_Mult_Col_Sub">
                                <div className="Create_Col_Div Create_Inner_Col Create_Mult_Col_Wrap">
                                    <div className="Create_Label">
                                        City
                                    </div>
                                    <div className="Create_Input_Wrapper">
                                        <input className="Dashboard_hidden Create_Input_Data" placeholder = {this.state.UserData.user_data.city} onChange={(e) => this.setState({city:e.target.value})}></input>
                                    </div>
                                </div>

                                <div className="Create_Col_Div Create_Inner_Col Create_Mult_Col_Wrap">
                                    <div className="Create_Label">
                                        State
                                    </div>
                                    <div className="Create_Input_Wrapper">
                                        <input className="Dashboard_hidden Create_Input_Data" placeholder = {this.state.UserData.user_data.state} onChange={(e) => this.setState({state:e.target.value})}></input>
                                    </div>
                                </div>

                                <div className="Create_Col_Div Create_Inner_Col Create_Mult_Col_Wrap">
                                    <div className="Create_Label">
                                        Zipcode
                                    </div>
                                    <div className="Create_Input_Wrapper">
                                        <input className="Dashboard_hidden Create_Input_Data" placeholder = {this.state.UserData.user_data.zipcode} onChange={(e) => this.setState({zipcode:e.target.value})}></input>
                                    </div>
                                </div>

                                <div className="Create_Col_Div Create_Inner_Col Create_Mult_Col_Wrap">
                                    <div className="Create_Label">
                                        Country
                                    </div>
                                    <div className="Create_Input_Wrapper">
                                        <input className="Dashboard_hidden Create_Input_Data" placeholder = {this.state.UserData.user_data.country} onChange={(e) => this.setState({country:e.target.value})}></input>
                                    </div>
                                </div>
                            </div>
                            <div onClick = {(e) => {this.handleElements(e,'edit',null,null)}} className="Account_Edit_Mult">Edit</div>
                        </div>

                        <div id="Dashboard_Spacer"></div>
                        <button id="Dashboard_Acct_Edit_Save" onClick={()=> {this.handleSaveClick()}}>Save</button>
                    </div>
                </div>)
            }

            if(section === 'Profile Information'){
                return(
                <div className="Dashboard_Main">
                    <div className="Dashboard_Main_Mid Dashboard_Inner_Col">

                        <div className="Dashboard_IMG_Col_Div Dashboard_Inner_Row">
                            <div className="Dashboard_Div Dashboard_Div_Row">T
                               
                            </div>
                            <div className="Dashboard_IMG_Row_Div Dashboard_Div_Row">
                                <img onClick={() => {this.setShowPicOptions()}} src={`${domain}${this.state.UserData.user_data.profile_pic}`} className="Dashboard_Profile_Pic" alt=""></img>
                                {this.state.showPicOptions === true?<div>Options to Show</div>:null}
                            </div>
                            <div className="Dashboard_Div Dashboard_Div_Row">T</div>
                        </div>
                        <div className="Dashboard_Div">
                            Image
                        </div>
                        <div className="Dashboard_Div">
                            Image
                        </div>
                        <div className="Dashboard_Div">
                            Image
                        </div>

                    </div>
                </div>)
            }
        }
        this.setShowPicOptions = () => {
            this.setState({showPicOptions:true});
            console.log('Set')
        }
    }

    async componentDidMount(){
        await this.getUserData()
    }

    componentDidUpdate(){
        console.log(this.state.chosenSection)
    }
    render() 
    {

        return (
            <div className="Dashboard_Main">
                <div className="Dashboard_Main_Side Dashboard_Inner_Col">
                    <div onClick = {(e) => {this.chooseSection(e.target.innerHTML)}} className="Dashboard_Div_Left">Profile Information</div>
                    <div onClick = {(e) => {this.chooseSection(e.target.innerHTML)}} className="Dashboard_Div_Left">Account Information</div>
                    <div onClick = {(e) => {this.chooseSection(e.target.innerHTML)}} className="Dashboard_Div_Left">Subscribed Groups</div>
                    <div onClick = {(e) => {this.chooseSection(e.target.innerHTML)}} className="Dashboard_Div_Left">Friends</div>
                    <div onClick = {(e) => {this.chooseSection(e.target.innerHTML)}} className="Dashboard_Div_Left">Points and Rankings</div>
                    <div onClick = {(e) => {this.chooseSection(e.target.innerHTML)}} className="Dashboard_Div_Left">Payment Information</div>
                </div>

                <div className="Dashboard_Main_Mid Dashboard_Inner_Col">
                    {this.renderSection()}
                </div>
            </div>
        )
    }
}