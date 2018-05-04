import fetch from 'unfetch';
export default {
    call(request){
        const url = window.omneoEnvironment.url+request.url;
        const token = window.omneoEnvironment.token;
        return fetch(
            url,
            {
                method: request.method,
                body: request.data ? JSON.stringify(request.data) : {},
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                })
            })
            .then(response=>{
                if(response.ok){
                    return response.json().then(json=>json);
                }
                throw response;
            })
            .catch(response=> {
                throw response.json().then(json=>{
                    console.log('Error with JSON');
                    return Promise.resolve({response: response, json: json})
                }).catch(response=>{
                    console.log('Error no JSON');
                    return {response: response, json: {}}
                });
            });
    }
}
