import React, { Component,createRef,useState } from 'react';
import { Table } from 'reactstrap';
import axios from 'axios'
import {MdAddCircleOutline,MdDeleteForever} from 'react-icons/md'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

class Home extends Component{
    state ={
        dataposts:[],
        inputauthor:createRef(),
        inpputtitle:createRef(),
        indexedit:-1,
        indexdelete:-1,
        editform:{
            editauthor:createRef(),
            edittitle:createRef()  
          }
    }

   

componentDidMount(){
    axios.get("http://localhost:4000/posts")
    .then((res)=>{
        this.state.inputauthor.current.focus()
        this.setState({dataposts:res.data})
    }).catch((err)=>{
        console.log(err)
    })
}
 
 onKeyUphandler=(e)=>{
     if(e.keyCode==13){
        this.state.inpputtitle.current.focus()
     }
 }
 onKeyUpTitle=(e)=>{
    if(e.keyCode==13){
       this.addpostclick()
    }
}

DeletePostid=(id,index)=>{
    MySwal.fire({
        title: `Are you sure wanna delete ${this.state.dataposts[index].author} ?`,
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
            axios.delete(`http://localhost:4000/posts/${id}`)
            .then(()=>{
                axios.get('http://localhost:4000/posts')
                .then((res)=>{
                    this.setState({dataposts:res.data})
                    MySwal.fire(
                      'Deleted!',
                      'Your file has been deleted.',
                      'success'
                    )
                }).catch((err)=>{
                    console.log(err)
                })
            }).catch((err)=>{
                console.log(err)
            })
        }
      })
}


editclik=(id)=>{
   var namaauthor=this.state.editauthor.current.value
   var namatitle=this.state.edittitle.current.value
   var obj={
       namaauthor,
       namatitle
   }
   axios.put(`http://localhost:4000/posts/${id}`,obj)
   .then(()=>{
       axios.get("http://localhost:4000/posts")
       .then((res)=>{
        this.setState({dataposts:res.data})
       }).catch((err)=>{
           console.log(err);
       })
   }).catch((err)=>{
       console.log(err);
   })
}



 addpostclick=()=>{
     var author=this.state.inputauthor.current.value
     var title=this.state.inpputtitle.current.value
     axios.post("http://localhost:4000/posts",{
         author,
         title
     }).then(()=>{
        axios.get("http://localhost:4000/posts")
        .then((res1)=>{
            this.state.inputauthor.current.value=''
            this.state.inpputtitle.current.value=''
            this.state.inputauthor.current.focus()
            this.setState({dataposts:res1.data})
        }).catch((err)=>{
            console.log(err)
        })
     }).catch((err)=>{
        console.log(err)
    })
 }

 renderdataposts =()=>{
    return this.state.dataposts.map((val,index)=>{
       return(
           <tr key={index}>
               <td>{index+1}</td>
               <td>{val.author}</td>
               <td>{val.title}</td>
               <td>
               <button className='btn btn-danger' onClick={()=>this.DeletePostid(val.id,index)}> <MdDeleteForever/></button>
               </td>
           </tr>
       )
    })
}
 
 
    render(){
        return(
            <div className="d-flex align-items-center flex-column pt-5">
                    <h1>Daftar List</h1>
                <div className="d-flex align-items-center flex-column">
                    <input type="text" ref={this.state.inputauthor}onKeyUp={this.onKeyUphandler} className="form-control mb-3" placeholder="author"/>
                    <input type="text" ref={this.state.inpputtitle}onKeyUp={this.onKeyUpTitle} className="form-control mb-3" placeholder="title"/>
                    <button onClick={this.addpostclick} className='btn btn-outline-primary mb-3' style={{width:'60%'}}>
                     <MdAddCircleOutline/> Add
                    </button>
                </div>
                <div style={{width:'40%'}}>
                <Table striped>
                    <thead>
                        <tr>
                        <th>No</th>
                        <th>Author</th>
                        <th>Title</th>
                        <th>Action</th>

                        </tr>
                    </thead>
                    <tbody>
                       {this.renderdataposts()}
                    </tbody>
                </Table>
                </div>
            </div>
        )
    }
}
export default Home;