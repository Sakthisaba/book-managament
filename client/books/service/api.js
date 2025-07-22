const backendUrl = 'https://book-managament.onrender.com/';

export const Authenticate = async (formData) => {

    return fetch(backendUrl+'authenticate', {  
        method: "post",
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify(formData),
     }).then(res=>res.json())
       .then(data => {
        if(data.success){
            localStorage.setItem('isloggedIn', true);
            localStorage.setItem('userdata', JSON.stringify(data.data));
            return {

                success: true,
                user: data.data

            };
        }
        else{
            return {
                success: false,
                message: data.data.message
            };
        }
      })
      .catch(rejected => {
         return {
            success: false,
            message: 'An error occurred while processing your request.'
         };
      });
}


export const fetchAllBooks = async(tableLength,tablerange,query,filterby)=>{
    var url=''
    var action = query? 'search' : 'getbook';
    if(action=='search'){
    var filterby = filterby;
    url =`getbooks?limit=${tableLength}&start=${tablerange[0]-1}&action=${action}&query=${query}&filterby=${filterby}`;}
    else{
    url =`getbooks?limit=${tableLength}&start=${tablerange[0]-1}&action=${action}`;} 
    
    return fetch(backendUrl+url, {
        method: "get",
        headers: {
            "Content-Type": "application/json"
          },
     }).then(res=>res.json())
       .then(data => {
        if(data.success){
            return {
                success: true,
                books: data.data.books,
                authors: data.data.authors,
                genre:data.data.genre,
                totalbooks: data.data.totalbooks
            };
        }
        else{
            return {
                success: false,
                message: data.data.message
            };
        }
      })
      .catch(rejected => {
         return {
            success: false,
            message: 'An error occurred while processing your request.'
         };
      });
}



export const fetchFilteredBooks = async(tableLength,tablerange,sortorder,sortby)=>{
    var url =`getbooks?limit=${tableLength}&start=${tablerange[0]-1}&action=sort&sortby=${sortby}&sortorder=${sortorder}`;
    return fetch(backendUrl+url, {
        method: "get",
        headers: {
            "Content-Type": "application/json"
          },
     }).then(res=>res.json())
       .then(data => {
        if(data.success){
            return {
                success: true,
                books: data.data.books
            };
        }
        else{
            return {
                success: false,
                message: data.data.message
            };
        }
      })
      .catch(rejected => {
         return {
            success: false,
            message: 'An error occurred while processing your request.'
         };
      });
}
export const addBook = async(formData,userid)=>{
    formData['userid'] = userid;
    return fetch(backendUrl+'addbook', {
        method: "post",
        headers: {
            "Content-Type": "application/json"
          },
        body: JSON.stringify(formData)
     }).then(res=>res.json())
       .then(data => {
        if(data.success){
            return {
                success: true
            };
        }
        else{
            return {
                success: false,
                message: data.data.message
            };
        }
      })
      .catch(rejected => {
         return {
            success: false,
            message: 'An error occurred while processing your request.'
         };
      });
    
}
export const updateBook = async(bookid,formData,userid)=>{
    formData['userid'] = userid;
    return fetch(backendUrl+'updatebook/'+bookid, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
          },
        body: JSON.stringify(formData)
     }).then(res=>res.json())
       .then(data => {
        if(data.success){
            return {
                success: true
            };
        }
        else{
            return {
                success: false,
                message: data.data.message
            };
        }
      })
      .catch(rejected => {
         return {
            success: false,
            message: 'An error occurred while processing your request.'
         };
      });
    
}

export const deleteBook = async(booklist,userid)=>{
    return fetch(backendUrl+'deletebook', {
        method: "delete",
        headers: {
            "Content-Type": "application/json"
          },
        body: JSON.stringify({userid: userid,booklist: booklist})
     }).then(res=>res.json())
       .then(data => {
        if(data.success){
            return {
                success: true
            };
        }
        else{
            return {
                success: false,
                message: data.data.message
            };
        }
      })
      .catch(rejected => {
         return {
            success: false,
            message: 'An error occurred while processing your request.'
         };
      });
    
}


