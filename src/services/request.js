import fetch from 'unfetch';
export default {
    refreshToken(request){
        return fetch(
            request.url, {
                method: "POST",
                body: JSON.stringify({id: request.id}),
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                })
            })
            .then(response=>{
                if(!response.ok){throw response;}
                return fetch('/pages/omneotoken',{credentials: 'include'}).then(function(response){
                    return response.text().then(function(text){
                        var myRegexp = /\<TOKEN\>(.*)\<TOKEN\>/;
                        var match = myRegexp.exec(text);
                        console.log("match",match);
                        return {
                            data:{
                                token: match[1]
                            }
                        }
                    })
                });
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
    },
    call(request){
        return fetch(
            request.url,
            {
                method: request.method,
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': request.token ? 'Bearer '+request.token : null
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
