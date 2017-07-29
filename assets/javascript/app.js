//init firebase
var config = {
    apiKey: "AIzaSyAdOaaGB7AU17GKAS4SCUqHn6NA3NhvVdw",
    authDomain: "train-scheduler-ff460.firebaseapp.com",
    databaseURL: "https://train-scheduler-ff460.firebaseio.com",
    projectId: "train-scheduler-ff460",
    storageBucket: "",
    messagingSenderId: "306910540139"
  };
firebase.initializeApp(config);

//creating vars 
var database = firebase.database();

// capture inputs using click event and create vars
$(".submit").on("click", function(){

	//prevent default click action
	event.preventDefault();

	// take user input
	var trainName = $("#trainName").val().trim();
	var destination = $("#destination").val().trim();
	var firstTrain = moment($("#firstTrainTime").val().trim(), "HH:mm").format("HH:mm");
	var frequency = $("#frequency").val();

	// to create local temporary object to hold train data
	var newTrain = {
	trainName: trainName,
	destination: destination,
	firstTrain: firstTrain,
	frequency: frequency
	};

	// uploads train data to the database
	database.ref().push(newTrain);
	console.log(newTrain.trainName);
	// clears all the text-boxes
	$("#trainName").val("");
	$("#destination").val("");
	$("#firstTrainTime").val("");
	$("#frequency").val("");
	// Prevents moving to new page
	return false;
	});

	

	//  Created a firebase event listner for adding trains to database and a row in the html when the user adds an entry
	database.ref().on("child_added", function(childSnapshot){
	// Now we store the childSnapshot values into a variable
	var trainName = childSnapshot.val().trainName;
	var destination = childSnapshot.val().destination;
	var firstTrain = childSnapshot.val().firstTrain;
	var frequency = childSnapshot.val().frequency;
	var firstTimeConverted = moment(firstTrain, "HH:mm");
	console.log(firstTimeConverted);
	var currentTime = moment().format("HH:mm");
	console.log("CURRENT TIME: " + currentTime);
	// store difference between currentTime and fisrt train converted in a variable.
	var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
	console.log(firstTrain);
	console.log("Difference in Time: " + timeDiff);
	// find Remainder of the time left and store in a variable
	var timeRemainder = timeDiff % frequency;
	console.log(timeRemainder);
	// to calculate minutes till train,we store it in a variable
	var minutesAway = frequency - timeRemainder;
	// next train
	var nexTrain = moment().add(minutesAway, "minutes").format("HH:mm");

	// order them by time and date
	 database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot){
	//append all updated elements to HTML
	  $("tbody").append("<tr><td>" + trainName +
      "</td><td>" + destination +
      "</td><td>" + frequency +
      "</td><td>" + nexTrain +
      " </td><td>" + minutesAway + "</td></tr>");
  	});
 });
