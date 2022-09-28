import React, { Component} from 'react';
import '../../Universal/css/UNV.css'
import empty_profile_pic from '../../Universal/images/Empty_Profile_Pic.svg'

export class ProfileInfo extends Component {

    constructor(props){
        super(props)
        this.props = props
        this.state=
        {
            UserData:this.props.UserData,
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
                        query_inputs[i].classList.add("Dashboard_Placeholder_Black")
                        query_inputs[i].style.backgroundColor="rgb(240, 240, 251)"
                    }
                    return
                }
                query_inputs[0].style.backgroundColor="rgb(240, 240, 251)"
                query_inputs[0].classList.remove("Dashboard_hidden")
                query_inputs[0].classList.add("Dashboard_Placeholder_Black")
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
        this.changePhoto = async () => {
            let input = document.createElement("input")
            input.onchange= (e) => 
            {
                let element = document.querySelector(".UNV_IMG_Contained")
                let src = window.URL.createObjectURL(e.target.files[0])
                element.src = src
            }
            input.type="file"
            input.click()
        }
    }

    componentDidUpdate(){
        console.log(this.state.showPicOptions)
    }
    render() 
    {

        return (
            <div className="UNV_Main UNV_Col UNV_Root_Font">
                <div className="UNV_M1 UNV_F_Col_1 UNV_Row">
                    <div className="UNV_M1 UNV_Flex_1"></div>
                    <div className="UNV_M1 UNV_F_Row_1"></div>
                    <div className="UNV_M1 UNV_F_Row_3 UNV_Col">
                        <div className="UNV_M1 UNV_F_Col_3 UNV_Relative UNV_Row">
                            <div className="UNV_F_Row_5" onMouseEnter={() => {this.setState({showPicOptions: true})}} >
                                {this.state.UserData.user_data.profile_pic === null?<img className="UNV_IMG_Contained UNV_Clickable"src = {empty_profile_pic}/>:<img className="UNV_IMG_Contained" src = {this.state.UserData.user_data.profile_pic}></img>}
                            </div>
                            {this.state.showPicOptions === true?<div onClick ={() => {this.changePhoto()}} className="UNV_Photo_Options UNV_F_Row_2 UNV_Row UNV_F_Center">Change Photo</div>:null}
                        </div>
                        <div className="UNV_M1 UNV_F_Col_1"></div>

                    </div>
                    <div className="UNV_M1 UNV_F_Row_1"></div>
                </div>
                <div className="UNV_M1 UNV_F_Col_1"></div>
                <div className="UNV_M1 UNV_F_Col_1"></div>

            </div>
        )
    }
}