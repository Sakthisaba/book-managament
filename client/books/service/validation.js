function formvalidator(formdata){

    var error = {};

    if(formdata.username === undefined || formdata.username === ''){
        error.username='Username is required';
    }
    if(formdata.password === undefined || formdata.password === ''){

        error.password='Password is required';
    }
    
    return error;
    


}


function bookSubmissionValidation(formdata){
    var error = {};
    formdata.bookname==='' ? error.bookname = 'Book name is required' : '';
    !formdata.author||formdata.author.id==='' || formdata.author.id==undefined? error.authorid = 'Author is required' : '';
    formdata.genre==='' || formdata.genre==undefined? error.genre = 'Genre is required' : '';
    formdata.isbn.toString().length<12 || formdata.isbn==undefined? error.isbn = 'Enter complete ISBN number- 12 digit' : '';
    formdata.noofcopies==='' || formdata.noofcopies<=0? error.noofcopies = 'Enter valid no of copies' : '';
    return error;
}

export default {formvalidator,bookSubmissionValidation};

