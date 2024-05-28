    // 1
    window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};
	
	// 2
	let displayTerm = "";
	
	// 3
	function searchButtonClicked(){
		console.log("searchButtonClicked() called");
		
        // 1
        const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

        // 2
        //Public API key from here: https://developers.giphy.com/docs/
        // If this one no longer works, get your own (it's free!)
        let GIHPY_KEY = "dc6zaTOxFJmzC";

        // 3 - Build up our URL string
        let url = GIPHY_URL;
        url += "api_key=" + GIHPY_KEY;

        // 4 - Parse the user entered term we wish to search for
        let term = document.querySelector("#searchterm").value
        displayTerm = term;

        // 5 - get rid of any leading and trailing spaces
        term = term.trim();

        // 6 - encode spaces and special characters
        term = encodeURIComponent(term);

        // 7 - if there's no term to search, bail out of the function (return does this)
        if(term.length <1) return;

        // 8 - append the search term to the url - the parameter name is 'q'
        url += "&q=" + term;

        // 9 - Grab the user chosen search 'limit' from the <select> and append it to the URL
        let limit = document.querySelector('#limit').value;
        url += "&limit=" + limit;

        // 10 - Update the UI
        document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>"

        // 11 - See what the URL looks like
        console.log(url);

        getData(url);

	}
	
    function getData(url) {
        // 1 - Create a new XHR object
        let xhr = new XMLHttpRequest();

        // 2 - Set the onload handler
        xhr.onload = dataLoaded;

        // 3 - Set the onerror handler
        xhr.onerror = dataError;

        // 4 - open connection and send the request
        xhr.open("GET",url);
        xhr.send();
    }

    function dataLoaded(e) {
        // 5 - event.target is the xhr object
        let xhr = e.target;
        
        // 6 - xhr.responseText is the JSON file we just downloaded
        console.log(xhr.responseText);

        // 7 - turn the text into a parsable JScript object
        let obj = JSON.parse(xhr.responseText);

        // 8 - if there are no results, print a message and return
        if(!obj.data || obj.data.length == 0) {
            document.querySelector("#status").innerHTML = "<b>No results for '" + displayTerm + "'</b>"
            return; // Bail out
        }

        // 9 - start building an HTML string we will display to the user
        let results = obj.data;
        console.log("results.length = " + results.length);
        let bigString = "";

        // 10 - Loop through an array of results
        for(let i = 0; i < results.length; i++){
            let result = results[i];

            // 11 - get the url to the gif
            let smallURL = result.images.fixed_width_downsampled.url;
            if (!smallURL) smallURL = "../images/no-image-found.png";

            // 12 - get the url to the GIPHY page
            let url = result.url;

            // 12.5 - get the rating
            let rating = (result.rating ? result.rating : "NA" ).toUpperCase()

            // 13 - build a <div> to hold each result
            // ES6 String Templating
            let line = `<div class ='result'><img src='${smallURL}' title= '${result.id}' />`;
            line += `<span><a target='_blank' href='${url}'>View on Giphy</a> <p>Rating: '${rating}'</p></span></div>`;

            // 14 - Multi-line way of doing the same thing, so I'm not going to copy it

            // 15 - add to the bigString and loop
                bigString += line;
        }

        // 16 - all done building the html - show it to the user!
        document.querySelector('#content').innerHTML = bigString;

        // 17 - update the status
        document.querySelector('#status').innerHTML = "<b>Success!</b><p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";



    }

    function dataError(e){
        console.log("An error occurred")
    }
