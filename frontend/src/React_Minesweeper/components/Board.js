import React, {useState, useEffect} from 'react'
import {Dead} from './Dead'
import {AppTitle} from '../../Universal/components/AppTitle'
import '../css/MS.css'

const Board = () =>
{
    console.log('Rendered Page')
    let [dead,setdead] = useState(false)
    let x = 30
    let row = x;
    let col = x;
    let difficulty = 100
    let createbombs = (length,max) => {
        let bomb_list=[]
        for(var d = 0; d<difficulty;d++)
        {
            let randomArray = [...new Array(length)]
            .map(() => Math.round(Math.random() * max));
            bomb_list.push([randomArray[0],randomArray[1]])
        }
        return bomb_list}

    let createArray = () => 
    {
        var arr = []
        for (let r = 0; r < col; r++)
        {
            const array = new Array(row);
            for (let i = 0; i < row; i++)
            {array[i]=0};
            arr.push(array)
        }
        window.localStorage.setItem('MineSweeper',JSON.stringify(arr))
        return arr
    };
    let findbombs = (field) =>
    {
        for(var i=0; i < bombs.length;i++)
        {
            var [bomb_row, bomb_col] = [bombs[i][0],bombs[i][1]];
            field[bomb_row][bomb_col] = -1;

            for(var r=bomb_row-1; r < bomb_row+2;r++)
            {
                for (var c = bomb_col - 1; c < bomb_col + 2;c++)
                {
                    if (r < row - 1 && r >= 0 && c < col - 1 && c >= 0 && field[r][c] !== -1)
                    {
                        field[r][c]+=1
                    }
                }
            }
        }
        return field
    };    

    let unhide = (docid,value) =>
    {
        let [x,y] = docid
        let element=document.getElementById(docid)
        element.classList.remove('hidden') 
        let savedata=JSON.parse(window.localStorage.getItem('Save-Data'))
        
        if(value === -1){
            console.log('You stepped on a mine!')
            setdead(true);
            reset(false);
            element.classList.add('Wrong_Choice')
            return false
        }
        else if(value === 0){

            var check_element = document.getElementById(docid)
            if(check_element.classList.contains('Safe'))
            {
                return false
            }
            for(var r=x-1; r < x+2;r++)
            {
                for (var c = y - 1; c < y + 2;c++)
                {
                    if (r <= row - 1 && r >= 0 && c <= col - 1 && c >= 0 && field[r][c] === 0)
                    {
                        let element = document.getElementById([r,c])
                        if(element.classList.contains('Safe')){
                            continue
                        }
                        let p_element=document.getElementById([r,c,0]);
                        p_element.classList.add('shallow_hide');
                        element.classList.remove('hidden')
                        element.classList.add('Safe');
                        savedata.push([r,c])
                    }
                }
            } 

        }
        else{
            let marker = [x,y,'M']
            savedata.push(marker)
        }
        window.localStorage.setItem('Save-Data',JSON.stringify(savedata))
        
    }
    let reset= (to_reload) => {
        window.localStorage.setItem('Save-Data','[]');
        window.localStorage.removeItem('MineSweeper')
        if(to_reload === true){
        window.location.reload();}
    }

    let flagmine = (docid) =>{
        let savedata=JSON.parse(window.localStorage.getItem('Save-Data'))
        var [x,y]=docid;
        var p_element=document.getElementById([x,y,0]);
        let element = document.getElementById(docid)
        if(p_element.classList.contains('flagmine')){
            p_element.classList.remove('flagmine')
            let spl_index = savedata.indexOf([x,y,'F'])
            savedata.splice(spl_index,1)
            window.localStorage.setItem('Save-Data',JSON.stringify(savedata))
            return console.log('Unflagging cell')
        }
        else if (element.classList.contains('Safe')){
            return console.log('Already colored cell')
        }
        p_element.classList.add('flagmine');
        savedata.push([x,y,'F'])
        window.localStorage.setItem('Save-Data',JSON.stringify(savedata))
        return console.log('Flagging cell');
    }
    let bombs = createbombs(2,x-1)
    
    if (JSON.parse(window.localStorage.getItem('MineSweeper')===null)){
        var data = createArray(row,col)
        data = findbombs(data)
        window.localStorage.setItem('MineSweeper',JSON.stringify(data))
    }
    if (JSON.parse(window.localStorage.getItem('Save-Data')===null)){
        window.localStorage.setItem('Save-Data',JSON.stringify([]));}

    let [field]=useState(JSON.parse(window.localStorage.getItem('MineSweeper')))

    let rightclickevent = (e) =>{
        e.preventDefault()
    }


    useEffect(() => {
        console.log('MineSweep Side Effect')
        let current_save = JSON.parse(window.localStorage.getItem('Save-Data'))
        if (current_save!== null){
            for (var i = 0; i < current_save.length;i++){
                let [x,y] = current_save[i]
                if(current_save[i][2] === 'M'){
                    let element = document.getElementById([current_save[i][0],current_save[i][1]]);
                    element.classList.remove('hidden')
                }
                else if (current_save[i][2] === 'F'){
                    let p_element = document.getElementById([current_save[i][0],current_save[i][1],0]);
                    p_element.classList.add('flagmine');}
                else{
                    let element = document.getElementById(current_save[i])
                    let p_element=document.getElementById([x,y,0])
                    p_element.classList.add('shallow_hide');
                    element.classList.remove('hidden')
                    element.classList.add('Safe');}
            }
        }
        window.addEventListener('contextmenu', rightclickevent, false);
    },[dead]); 

    useEffect(()=>{

    return () => {window.removeEventListener('contextmenu',rightclickevent, false)};
    },[])

    return (
        <div className= "MSContainer" >
            
            <div className = "AppTitle">
                <AppTitle title = 'MineSweeper'></AppTitle>
            </div>

            {dead===true?
            <div className = "Dead">
                <Dead onClick={() => {reset(true)}}></Dead>
            </div>
            :
            <div className="hidden">
                <Dead onClick={() => {reset(true)}}></Dead>
            </div>
            }

            <div className = "MineSweeper">
                {field.map
                        (
                            (cell, index) => 
                            (
                                <div key = {index}>
                                    {
                                        cell.map((item,index_2) =>
                                        (
                                        <button id = {[index,index_2,0]} onContextMenu = {() => {flagmine([index,index_2])}} onClick ={() => {unhide([index,index_2],item)}}  key={index_2} className = 'cells'> 
                                            <div className="hidden" id = {[index,index_2]}>{item}</div> 
                                        </button>
                                        )
                                        )
                                    }
                                </div>
                            )
                        )
                }
            </div>
        
        </div>
    )
}

export {Board}