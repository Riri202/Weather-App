const wrapper = document.querySelector('.wrapper');
 inputPart = wrapper.querySelector('.input-part'),
 infoTxt = inputPart.querySelector('.info-txt'),
 inputField = inputPart.querySelector('input');
 locationBtn = inputPart.querySelector('button');
 weatherPart = wrapper.querySelector(".weather-part")
 goBackBtn = wrapper.querySelector('.bx-left-arrow-alt')
 wIcon = wrapper.querySelector('.weather-icon')
 
 let api;

inputField.addEventListener('keyup', e => {
    // if the user pressed enter button and the input field is not empty
    if (e.key == 'Enter' && inputField.value != ''){
            requestApi(inputField.value)
    }
});

locationBtn.addEventListener('click' , () => {
    if (navigator.geolocation){  //if browser supports geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    }
})
function onSuccess (position){
    const {latitude, longitude} = position.coords; //getting lat and long of user device from coords obj
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    fetchData()
}
function onError (error){
    infoTxt.textContent = error.message;
    infoTxt.classList.add('error')
    
}

const apiKey = '4b672fdc850dc24606d2fe84fad9363b';
function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData()
}

function fetchData (){
    infoTxt.textContent = `Getting weather details...`;
    infoTxt.classList.add('pending')
    //request for api then consume the resolved value with parsing into js obj then
    //pass the result as an argument into a new functon using another then method
    fetch(api).then(response => {
        let info = response.json();
        return info;
    })
    .then((info) => {
            if (info.cod == '404') {
                infoTxt.textContent = `${inputField.value} is a not valid country name`;
                infoTxt.classList.replace('pending', 'error');
            } else {
                // getting required property values from info obj
                const city = info.name;
                const country = info.sys.country;
                const { description, id} = info.weather[0];
                const { feels_like, humidity, temp } = info.main;

                //changing weather icons according to weather ids
                if (id == 800){
                    wIcon.src = 'icons/clear.svg';
                }else if (id >= 200 && id <= 232){
                    wIcon.src = 'icons/storm.svg';
                }else if (id >= 500 && id <= 531){
                    wIcon.src = 'icons/snow.svg';
                }else if (id >= 701 && id <= 781){
                    wIcon.src = 'icons/haze.svg';
                }else if(id >= 801 && id <= 804){
                    wIcon.src = 'icons/rain.svg';
                }; 

                 // passing those property values to specific html element
                weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
                weatherPart.querySelector(".weather").innerText = description;
                weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
                weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
                weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;

                infoTxt.classList.remove('pending', 'error');
                wrapper.classList.add('active');
            }
        });
 
goBackBtn.addEventListener('click' , () =>{
    wrapper.classList.remove('active');
})    


}; 