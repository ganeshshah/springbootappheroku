import fetch from  'unfetch';



const checkStatus = response => {
    if (response.ok) {
        return response;
    } else {
        let error = new Error(response.statusText);
        error.response = response;
        response.json().then(e => {
            error.error = e;
        });
        return Promise.reject(error);
    }
}

export const getAllStudents = () => fetch('/student').then(checkStatus);
export const addNewStudent = student => fetch('/student',{
    headers: {
        'Content-Type' : 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(student)
}).then(checkStatus);