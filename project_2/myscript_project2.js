"use strict";
	window.onload = init;

    //Setting up some constants
    const dogSelect = document.querySelector("#dog_selector");
    const limitSelect = document.querySelector("#limit");
    const prefix = "jpt7200-";
    const breedKey = prefix + "breed";
    const limitKey = prefix + "limit";

    // grab the stored data, will return `null` if the user has never been to this page
    const storedBreed = localStorage.getItem(breedKey);
    const storedLimit = localStorage.getItem(limitKey);

    // if we find a previously set breed value, display it
    if (storedBreed){
     	dogSelect.querySelector(`option[value='${storedBreed}']`).selected = true;
    }

    // if we find a previously set limit value, display it
    if (storedLimit){
        limitSelect.querySelector(`option[value='${storedLimit}']`).selected = true;
    }

	dogSelect.onchange = e => { localStorage.setItem(breedKey, e.target.value); };
    limitSelect.onchange = e => { localStorage.setItem(limitKey, e.target.value); };

	function init(){
		document.querySelector("#search").onclick = getData;
	}
	
	function getData(){
		// 1 - main entry point to web service
		const SERVICE_URL = "https://dog.ceo/api/breed/" + document.getElementById("dog_selector").value + "/images/random/" + document.getElementById("limit").value;
		
		// No API Key required!
		
		// 2 - build up our URL string
		// not necessary for this service endpoint
		let url = SERVICE_URL;
		
		// 3 - parse the user entered term we wish to search
		// not necessary for this service endpoint
		
		// 4 - update the UI
		document.querySelector("#debug").innerHTML = `<b>Searching web service with:</b> <a href="${url}" target="_blank">${url}</a>`;
		
		// 5 - create a new XHR object
		let xhr = new XMLHttpRequest();

		// 6 - set the onload handler
		xhr.onload = dataLoaded;
	
		// 7 - set the onerror handler
		xhr.onerror = dataError;

		// 8 - open connection and send the request
        xhr.open("GET",url);

        xhr.send();
	}
	
	function dataError(e){
		console.log("An error occurred");
	}
	
	function dataLoaded(e){
		// 1 - e.target is the xhr object
		let xhr = e.target;
	
		// 2 - xhr.responseText is the JSON file we just downloaded
		console.log(xhr.responseText);
	
		// 3 - turn the text into a parsable JavaScript object
		let obj = JSON.parse(xhr.responseText);

        console.log(obj);
		
		// 4 - if there are no results, print a message and return
		// Here, we don't get an array back, but instead a single object literal with 2 properties
		if(obj.status != "success"){
			document.querySelector("#content").innerHTML = "<p><i>There was a problem!</i></p>";
			return; // Bail out
		}
		
		// 5 - if there is an array of results, loop through them
		let results = obj.message;
		let bigString = "";
        
        console.log("results.length = " + results.length)

        for(let i = 0; i < results.length; i++){

		    bigString += `<img src="${results[i]}" alt="random dog" />`

        }
		// 6 - display final results to user
		document.querySelector("#lastP").innerHTML = "<i>Here are the results!</i>";
		document.querySelector("#content").innerHTML = bigString;
	}
	
