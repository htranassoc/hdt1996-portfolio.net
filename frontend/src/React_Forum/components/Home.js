import React, { Component} from 'react';
import '../css/Forum.css'
import {domain} from '../../apps/Admin'

export class Home extends Component {
    constructor() 
    {
        super()
        this.categories=[
            'Cars',
            'Personal Finance',
            'Slice of Life',
            'Romance',
            'Education',
            'Sports',
            'Politics',
            'TV Shows',
            'Movies',
            'Anime',
            'Cartoons',
            'Investment',
            'Advice',
            'Stories',
            'Fiction',
            'Ideas',
        ]
        this.state=
            {
                roomData:null,
                roomIndex:null,
                roomSlice:null,
            }
        this.handleCategoryClick = (e) =>
        {
            console.log(e.target)
        }
        this.getSliceIndex = () => 
        {
            let slices = {}
            let increment= 50
            let index = 1
            let data = this.state.roomData
            for(let i=0; i < data.length;i+=increment)
            {
                if(i+increment > data.length)
                {
                    slices[index]=[i,data.length-1]
                }
                else
                {
                    slices[index]=[i,i+increment - 1]
                }
                index+=1
            }
            console.log(slices)
            this.setState({roomIndex:slices})
        }
        this.getSliceArray = (slice=1) => 
        {
            let data = this.state.roomData
            console.log(data)
            if(data.length === 0)
            {
                return console.log('No data')
            }
            let indices = this.state.roomIndex[slice]
            let arr = data.slice(indices[0],indices[1]+1)
            this.setState({roomSlice:arr})
        }
        this.convertUTC = (UTC) => {
            console.log(UTC)
            let timezone=Intl.DateTimeFormat().resolvedOptions().timeZone
            return new Date(UTC).toLocaleString("en-US",{timeZone:timezone})
        }

        
    }

    async componentDidMount(){
        let response = await fetch(`${domain}/api/react/rooms/`)
        let data = await response.json()
        console.log(data)
        this.setState(
            {
                roomData:data,
            }
        )
        this.getSliceIndex()
        this.getSliceArray()

    }
    render() 
    {
        let count = 0
        return (
            <div className="Forum_Main">
                <div className="Forum_Main_Side Forum_Inner_Col">
                    <div id="MS_Left_Title">
                        Home
                    </div>
                    <div className="Forum_Inner_Col" id="FMSL_Categories">
                        <div className="Forum_Div" id="FMSL_Category_Title">Categories</div>
                        <div id="FMSL_Category_Container">
                            {
                                this.categories.map
                                (
                                    (category,index)=>
                                    <div key = {index} className="Forum_Div" onClick = {(e) => {this.handleCategoryClick(e)}}>
                                        <button id = {category} className="Forum_Category_Button">{category}</button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>

                <div className="Forum_Main_Mid Forum_Inner_Col">
                    <div className="Forum_Inner_Col" id="MM_Content_Wrapper">
                        <div className="Forum_Inner_Row" id="MM_Subsection">
                            <div className="Forum_Div MM_Subsection_Title" id="MM_Listing_Title">Title</div>
                            <div className="Forum_Div MM_Subsection_Title" id="MM_Listing_ID">Room ID</div>
                            <div className="Forum_Div MM_Subsection_Title" id="MM_Listing_Category">Category</div>
                            <div className="Forum_Div MM_Subsection_Title" id="MM_Listing_Time">Created</div>
                            <div className="Forum_Div MM_Subsection_Title" id="MM_Listing_Author">Author</div>
                            <div className="Forum_Div MM_Subsection_Title" id="MM_Listing_NMembers">Members</div>
                            <div className="Forum_Div MM_Subsection_Title" id="MM_Listing_NMembers">Current Participants</div>
                            <div className="Forum_Div MM_Subsection_Title" id="MM_Listing_Time">Updated</div>
                            <div className="Forum_Div MM_Subsection_Title" id="MM_Listing_New_Message">Recent Message</div>

                        </div>
                        <div className="Forum_Inner_Col" id="MM_Listings">
                            {
                                this.state.roomSlice
                            ?
                                this.state.roomSlice.map
                                (
                                    (roomData,index)=>
                                    <div key = {index} className="Forum_Div Forum_Inner_Row">
                                        <div className="Forum_Div MM_Listing" id="MM_Listing_Title">{roomData.title}</div>
                                        <div className="Forum_Div MM_Listing" id="MM_Listing_ID">{roomData.code}</div>
                                        <div className="Forum_Div MM_Listing" id="MM_Listing_Category">{roomData.category}</div>
                                        <div className="Forum_Div MM_Listing" id="MM_Listing_Time">{this.convertUTC(`${roomData.created_at}`)}</div>
                                        <div className="Forum_Div MM_Listing" id = "MM_Listing_Author">{roomData.host}</div>
                                        <div className="Forum_Div MM_Listing" id="MM_Listing_NMembers">Members</div>
                                        <div className="Forum_Div MM_Listing" id="MM_Listing_NMembers">Active</div>
                                        <div className="Forum_Div MM_Listing" id="MM_Listing_Time">{this.convertUTC(`${roomData.updated_at}`)}</div>
                                        <div className="Forum_Div MM_Listing" id="MM_Listing_New_Message">Unavailable</div>
                                    </div>
                                )
                            :
                                null

                            }
                            <div className="Forum_Div" id="MM_Listing_Index">
                                {
                                    this.state.roomIndex?
                                    Object.keys(this.state.roomIndex).map(
                                        (i,index)=>
                                        
                                        <button onClick = {() => {this.getSliceArray(i)}} className="Forum_Div" id = "MMLI_Button" key={index}>{i}</button>
                                        
                                    )
                                    :
                                    null
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="Forum_Main_Side Forum_Inner_Col">
                    <div id="FMSR_Title">Scoreboard</div>
                    <div className="Forum_Inner_Col Forum_Div" id="FMSR_ScoreBoard">
                        <div className="Forum_Div Forum_Inner_Row" id="FMSR_Score_Categories">
                            <div className="Forum_Div" id="FSMRSC_Title">Most Members</div>
                            <div className="Forum_Div" id="FMSR_Score_Category">999</div>
                            <div className="Forum_Div" id="FMSR_Score_Category">Author</div>
                        </div>
                        <div className="Forum_Div Forum_Inner_Row" id="FMSR_Score_Categories">
                            <div className="Forum_Div" id="FSMRSC_Title">Most Likes</div>
                            <div className="Forum_Div" id="FMSR_Score_Category">999</div>
                            <div className="Forum_Div" id="FMSR_Score_Category">Author</div>
                        </div>
                        <div className="Forum_Div Forum_Inner_Row" id="FMSR_Score_Categories">
                            <div className="Forum_Div" id="FSMRSC_Title">Most Dislikes</div>
                            <div className="Forum_Div" id="FMSR_Score_Category">999</div>
                            <div className="Forum_Div" id="FMSR_Score_Category">Author</div>
                        </div>
                        <div className="Forum_Div Forum_Inner_Row" id="FMSR_Score_Categories">
                            <div className="Forum_Div" id="FSMRSC_Title">Most Rewards</div>
                            <div className="Forum_Div" id="FMSR_Score_Category">999</div>
                            <div className="Forum_Div" id="FMSR_Score_Category">Author</div>
                        </div>
                        <div className="Forum_Div Forum_Inner_Row" id="FMSR_Score_Categories">
                            <div className="Forum_Div" id="FSMRSC_Title">Most Views</div>
                            <div className="Forum_Div" id="FMSR_Score_Category">999</div>
                            <div className="Forum_Div" id="FMSR_Score_Category">Author</div>
                        </div>
                        <div className="Forum_Div Forum_Inner_Row" id="FMSR_Score_Categories">
                            <div className="Forum_Div" id="FSMRSC_Title">Most Lived</div>
                            <div className="Forum_Div" id="FMSR_Score_Category">999</div>
                            <div className="Forum_Div" id="FMSR_Score_Category">Author</div>
                        </div>


                        <div className="Forum_Div Forum_Inner_Row" id="FMSR_Score_Categories">
                            <div className="Forum_Div" id="FSMRSC_Title">Longest Life</div>
                            <div className="Forum_Div" id="FMSR_Score_Category">999</div>
                            <div className="Forum_Div" id="FMSR_Score_Category">Author</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}