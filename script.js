/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * Define all global variables here.  
 */
/***********************
 * student_array - global array to hold student objects
 * @type {Array}
 * example of student_array after input: 
 * student_array = [
 *  { name: 'Jake', course: 'Math', grade: 85 },
 *  { name: 'Jill', course: 'Comp Sci', grade: 85 }
 * ];
 */
var arrayOfEntryObjects = [];
var counter = 0;
var targetWeight; 
var entryIDNum = 1;

/***************************************************************************************************
* initializeApp - initializes the application, including adding click handlers and pulling in any data from the server
* @params  none
* @returns  none
* 
*/
function initializeApp(){
     
      $('.lbs-text').addClass('hidden');

      //assigns unique user browser id so displays only the user's own data on user's browser
      var uniqueBrowserID = localStorage.getItem('uniqueBrowserID'); //uniqueBrowserID type is a string
      if (!uniqueBrowserID) { //if it doesn't have one existed already, assign a new id
            var randomGeneratedID = Math.floor(Math.random() * new Date(10000000000)); //random integer (up to 10 digit)
            uniqueBrowserID = localStorage.setItem('uniqueBrowserID', randomGeneratedID);
      }

      
      targetWeight = localStorage.getItem('targetWeight');

      if(targetWeight === undefined){
            showModal('goalWeightInput');
            renderGoalWeight(targetWeight);
      }else{ 
            renderGoalWeight(targetWeight);
      }

      //displays today's date (in local time) as default
      var date = new Date();
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      var dateStr = date.toISOString().substring(0, 10);
      var windowWidth = window.innerWidth;
      if(windowWidth<991){ //mobile size
            var field = document.querySelector('.today-mobile');
      }else{
            var field = document.querySelector('.today-desktop');
      }
      field.value = dateStr;


      // getDataFromServer();
      addClickHandlersToElements();
      // handleFocusInForForm();
}



/***************************************************************************************************
* addClickHandlersToElements - adds click handlers to the elements
* @params none 
* @returns none 
*/
function addClickHandlersToElements(){
      // $("#goalWeightEnterButton").click(handleGoalWeight); //from edit goal weight modal

      $(".add-entry-btn").click(handleAddClicked); //add entry button

      // $("#cancelButton-mobile").click(handleCancelClick); //cancel entry button
      // $("#cancelButton-desktop").click(handleCancelClick); //cancel entry button
      $(".cancel-button").click(handleCancelClick); //cancel entry button

      // $(".btn-info").click(getDataFromServer); //get data from server button
      $('.goal-weight-display').click(editGoalWeight);
      // $("#updateButton").click(handleUpdateClicked); //update button from editing modal
      $('.note-mobile').keyup(checkRemainingChar);
      $('.note-desktop').keyup(checkRemainingChar);

      // $('.entry-editBtn').click(handleEditEntry);
      // $('.entry-deleteBtn').click(handleDeleteEntry);
}



/***************************************************************************************************
* checkEnterKeyPressed - checks if Enter key is pressed in modal after inputting goal weight and call handleGoalWeight function
* @params event 
* @returns  none 
*/
function checkEnterKeyPressed(e){
      if(e.which == 13) { //"13" is the "Enter" key
            handleGoalWeight();
      }
}



/***************************************************************************************************
* checkRemainingChar - checks if Enter key is clicked in modal for goal weight input, if clicked, call handleGoalWeight function
* @params event 
* @returns  none 
*/
function checkRemainingChar(){
      var len = 0;
      var maxchar = 80;

      $("#remainingC").removeClass('hidden');
      len = this.value.length;
      if(len > maxchar){
            return false;
      }else if (len > 0){
            $("#remainingC").html("Remaining characters: " + (maxchar - len));
      }else{
            $("#remainingC").html("Remaining characters: " + (maxchar));
      }

      var windowWidth = window.innerWidth;
      if(windowWidth<991){ //mobile size
            $('.note-mobile').focusout(function() {
                  $("#remainingC").addClass('hidden');
            });
      }else {
            $('.note-desktop').focusout(function() {
                  $("#remainingC").addClass('hidden');
            });
      }
  
}



/***************************************************************************************************
* handleGoalWeight - once goal weight is entered from modal, display onto DOM
* @params none 
* @returns none
*/
function handleGoalWeight() {
      var goalWeight = $('#setGoalWeight').val(); //from the goal weight input modal
      
      if(!goalWeight) { //if target weight field is empty and the user click 'Enter'
            showModal('goalWeightInput');
            $('#modal-empty-goal-weight-alert').removeClass('hidden');
            $('#setGoalWeight').focus(function(){
                  $('#modal-empty-goal-weight-alert').addClass('hidden');
            });
      }else if(goalWeight < 2){ //if goal is less than 2 lbs. (including a negative number)
            showModal('goalWeightInput');
            $('#modal-invalid-goal-weight-alert').removeClass('hidden');
            $('#setGoalWeight').focus(function(){
                  $('#modal-invalid-goal-weight-alert').addClass('hidden');
            });
      }else{            
            renderGoalWeight(goalWeight);
            hideModal('goalWeightInput');
            targetWeight = goalWeight;
            localStorage.setItem('targetWeight', targetWeight);
      }
}


/***************************************************************************************************
 * renderGoalWeight - render goal weight on DOM
 * @param: {number} targetWeight
 * @returns {undefined} none
 */
function renderGoalWeight( targetWeight ){
      if(targetWeight == undefined) {
            $('.goal-weight-display').html('N/A');
      }else {
            $('.goal-weight-display').html(targetWeight + ' lbs');
      }
}
 


/***************************************************************************************************
 * editGoalWeight - updates the goal weight and display updated goal weight on DOM
 * @param: none
 * @returns none
 */
function editGoalWeight(){
      var newGoalWeightInput = $('<input>', {
            type: 'number',
            class: 'form-control input-goal-weight',
            name: 'updatedGoalWeight',
            id: 'updated-goal-weight',
            placeholder: 'Enter new target',
            text: $('#updated-goal-weight').val(),
      });

      var newGoalWeightSaveBtn = $('<button>', {
            id: 'saveButton',
            class: 'save-btn',
            text: 'Save'
      });

      $('.goal-weight-edit-btn').addClass('hidden');
      $('.goal-text').append(newGoalWeightInput, newGoalWeightSaveBtn);

      if($('#saveButton').click(function() {
            var updatedWeight = $('#updated-goal-weight').val(); 
            renderGoalWeight(updatedWeight);
            targetWeight = updatedWeight;
            newGoalWeightInput.addClass('hidden');
            newGoalWeightSaveBtn.addClass('hidden');
            $('.goal-weight-edit-btn').removeClass('hidden');
            newGoalWeightSaveBtn.remove();
            newGoalWeightInput.remove();
      }));
      
      //updateEntryList( userEntryObj ); //To Goal messages should be updated based on updated goal weight
      //renderEntryOnDom(userEntryObj); or just render the motiv msg again based on new goal weight???

}



/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param: {object} event  The event object from the click
 * @return: none
 */

function handleAddClicked(){
      var windowWidth = window.innerWidth;
      var userEntryObj = {};
      userEntryObj.entryID = entryIDNum;
      entryIDNum++;

      if(windowWidth < 991){ //mobile size
            userEntryObj.date = $('.today-mobile').val();
            userEntryObj.weight = $('.weight-mobile').val(); //weight is saved as a string
            userEntryObj.note = $('.note-mobile').val();
      }else { //desktop size
            userEntryObj.date = $('.today-desktop').val();
            userEntryObj.weight = $('.weight-desktop').val(); //weight is saved as a string
            userEntryObj.note = $('.note-desktop').val();
      }

      //removes leading zero(s) from user's weight input if there's any
      if(userEntryObj.weight[0] === '0') {
            var weightWithoutLeadingZeros = userEntryObj.weight;
            while(weightWithoutLeadingZeros[0]==='0') {
                  weightWithoutLeadingZeros = weightWithoutLeadingZeros.substring(1, weightWithoutLeadingZeros.length);
            }
            userEntryObj.weight = weightWithoutLeadingZeros;
      }

      if (!userEntryObj.date) { //if date field is left blank, default date value is set to today's date in local time
            var fullDate = new Date();
            var yr = fullDate.getFullYear();
            var mo = fullDate.getMonth() + 1;
            if(mo<10)
                  mo = "0" + mo;
            var dt = fullDate.getDate();
            if(dt<10)
                  dt = "0" + dt;
            userEntryObj.date = (yr+"-"+mo+"-"+dt).toString();
      }

    
      if (!userEntryObj.note) { //if note is left blank, note value is set to "N/A"
            userEntryObj.note = "N/A";
      }


      if(validateWeight(userEntryObj.weight)){
            // userEntryObj.weight = Number(userEntryObj.weight); //converting the string type weight to the number
            clearAddEntryInputs();
            sendDataToServer(userEntryObj);
      }
   
}


/***************************************************************************************************
 * validateWeight - validates weight and keeps fixing until get the valid weight
 * @param: weight
 * @return: true if valid input, false if otherwise
 */
function validateWeight (weight) {
      if (!weight) { //if weight field is empty, display alert message
            $('.edit-weight-alert-desktop').removeClass("hidden");
            var windowWidth = window.innerWidth;
            if(windowWidth<991){ //mobile size
                  $('.weight-mobile').focus(function(){
                        $('.edit-weight-alert-desktop').addClass('hidden');
                        fixWeight();
                  });
            }else{
                  $('.weight-desktop').focus(function(){
                        $('.edit-weight-alert-desktop').addClass('hidden');
                        fixWeight();
                  });
            }
      }else if (isNaN(Number(weight)) || Number(weight)<2) { //if input for the weight is not a number ex) 'e' or less than 2
            $('.edit-weight-alert-desktop').removeClass("hidden");
            $('.edit-weight-alert-mobile').removeClass("hidden");
            fixWeight();
      } else {
            return true;
      }
}


/***************************************************************************************************
 * fixWeight - Fixes weight value until it is a valid weight
 * @param: none
 * @returns: none
 * @calls: validateWeight
 */
function fixWeight() {
      $('.weight-mobile').focus(function(){
            $('.edit-weight-alert-mobile').addClass("hidden");

            $('.weight-mobile').on('focusout', function(){
                  var newWeight = this.value;
                  if (newWeight.length > 1) {
                        validateWeight(newWeight);
                  }
            });
      });
      $('.weight-desktop').focus(function(){
            $('.edit-weight-alert-desktop').addClass("hidden");

            $('.weight-desktop').on('focusout', function(){
                  var newWeight = this.value;
                  if (newWeight.length > 1) {
                        validateWeight(newWeight);
                  }
            });
      });
}


/***************************************************************************************************
 * handleCancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddEntryInputs
 */
function handleCancelClick(){
      clearAddEntryInputs();
}



/***************************************************************************************************
 * compare - used to sort the array in ascending order by date
 * @param: a and b to compare
 * @returns: compareResult 0 (if a=b), 1 (if a>b), or -1 (if a<b)
 */
function compare(a, b) {
      var dateA = a.date;
      var dateB = b.date;      
      var compareResult = 0;

      if (dateA > dateB){
            compareResult = 1;
      }else if (dateA < dateB){
            compareResult = -1;
      }
      return compareResult;
}


/***************************************************************************************************
 * addEntry - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {object} userEntryObj
 * @return undefined
 * @calls renderEntryOnDom
 */
function addEntry(userEntryObj){
      //add to the array
      arrayOfEntryObjects.push(userEntryObj); 
      
      //then sort the entries by order of the date (ascending - old on top and recent on the bottom)
      arrayOfEntryObjects.sort(compare);
          
      // counter++;
      renderEntryOnDom(userEntryObj);
      // updateEntryList( userEntryObj ); this is not needed if renderEntryOnDom is there... i think
      // clearAddEntryInputs();
}


/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 * @param none
 * @return none
 */
function clearAddEntryInputs(){
      $('.today-mobile').val('');
      $('.weight-mobile').val('');
      $('.note-mobile').val('');

      $('.today-desktop').val('');
      $('.weight-desktop').val('');
      $('.note-desktop').val('');
}


/***************************************************************************************************
 * renderEntryOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} userEntryObj a single student object with course, name, and weight inside
 */
function renderEntryOnDom(userEntryObj){
      console.log('inside renderEntryOnDom userEntryObj: ', userEntryObj);
      //remove all children of the weight table before rendering sorted array of entry objects
      var weightTable = document.getElementById("weightTable");
      //while there's any child left, remove - basically removes all children
      //this is cleaning up the weight table before updating w/ the updated table
      while (weightTable.firstChild) { 
            weightTable.removeChild(weightTable.firstChild);
      }

      //rendering onto dom from already sorted array from addEntry function, arrayOfEntryObjects
      for (var i=0; i<arrayOfEntryObjects.length; i++){
            var newTr = $('<tr>',{
                  class: 'test'
            });
            var dateItem = $('<td>', {
                  // class: 'col-lg-1 col-md-1 col-sm-1 col-xs-1 text-center',
                  class: 'text-center entry-date',
                  text: arrayOfEntryObjects[i].date
            });
            var weightItem = $('<td>', {
                  // class: 'col-lg-1 col-md-1 col-sm-1 col-xs-1 text-right', 
                  class: 'text-right entry-weight',
                  style: 'padding-right: 6%;',
                  text: arrayOfEntryObjects[i].weight + ' lbs'
            });
            
            var noteItem = $('<td>', {
                  class: 'text-center entry-note', 
                  text: arrayOfEntryObjects[i].note
            });
      
            $('.weight-list tbody').append(newTr);
            newTr.append(dateItem); 
            newTr.append(weightItem);
            newTr.append(noteItem);

            if(i == 0){    
                  newTr.append('<td class="text-left" style="font-size:18px; color:black; padding-left: 8%;">-');
            }else if (i !== 0) {
                  var prev = Number(arrayOfEntryObjects[i-1].weight);
                  var curr = Number(arrayOfEntryObjects[i].weight);

                  var lostWeightItem = $('<td>', {
                        class: 'text-left entry-diff', 
                        style: 'font-size:14px; color: green; padding-left: 7%;',
                        html: '&#9660; ' + (prev-curr)

                  });
                  var gainedWeightItem = $('<td>', {
                        class: 'text-left entry-diff', 
                        style: 'font-size:14px; color: red; padding-left: 7%;',
                        html: '&#9650; ' + (curr-prev)
                  });

                  if(prev === curr) { //if weight did not change
                        newTr.append('<td class="text-left" style="font-size:18px; color: blue; padding-left: 8%;">-');
                  }else if (prev > curr){ //if lost weight
                        newTr.append(lostWeightItem); 
                  }else { //if gained weight
                        newTr.append(gainedWeightItem);
                  }
            }

            var editAndDelButtons = $('<td>', {
                  class: 'text-center'
            });
            var editBtn = $('<button>', {
                  class: 'btn btn-info fa fa-pencil-square-o entry-editBtn',
                  // html: '<i class="fa fa-pencil-square-o">',
                  style: 'margin-right: 5px; padding: 3px 5px; width: 30px;'
            });
            var deleteBtn = $('<button>', {
                  class: 'btn btn-danger fa fa-trash entry-deleteBtn',
                  // html: '<i class="fa fa-trash">',
                  style: 'padding: 3px 5px; width: 30px;'
            }, );
      
            editAndDelButtons.append(editBtn, deleteBtn);
            newTr.append(editAndDelButtons);
      
      }
     
     

// problem: .entry-editBtn is grabbing the very last edit btn
      $('.entry-editBtn').click(function() {
            var editEntryObj = {};;
      console.log('tr[0]: ',($(this).parents("tr"))[0]);
            editEntryObj.entryID = userEntryObj.entryID;
            editEntryObj.date = ($(this).parents("tr"))[0].children[0].innerText;
            var wt = (($(this).parents("tr"))[0].children[1].innerText).split(' ');
            editEntryObj.weight = wt[0]; //weight without the string 'lbs'
            editEntryObj.note = ($(this).parents("tr"))[0].children[2].innerText;

            handleEditEntry(editEntryObj);
            
      });
      

 /* assigning a click handler for each entry-editBtn - below is needed?????????????????
 var clickedBtnObj = {};
 var editButtons = document.getElementsByClassName('entry-editBtn'); //editButtons is an array with all the buttons w/ the class entry-editBtn
 console.log('closest: ',($(this).closest("tr")));
 for ( var i in Object.keys( editButtons ) ) {
       editButtons[i].onclick = function() {
             clickedBtnObj.date = ($(this).closest("tr")).childNodes[0].innerText;
             clickedBtnObj.weight = ($(this).closest("tr"))[0].childNodes[1].innerText;
             clickedBtnObj.note = $(this).closest("tr").childNodes[2].innerText;


       };
 } */


      $('.entry-deleteBtn').off("click").click(function() {
            var deleteEntryObj = {};
            deleteEntryObj.entryID = userEntryObj.entryID;
            deleteEntryObj.date = ($(this).parents("tr"))[0].children[0].innerText;
            deleteEntryObj.weight = ($(this).parents("tr"))[0].children[1].innerText;
            deleteEntryObj.note = ($(this).parents("tr"))[0].children[2].innerText;

            handleDeleteEntry(deleteEntryObj);
      });
      

      displayMotivMsg (userEntryObj);
    
      
}


function displayMotivMsg (userEntryObj){
      var moreToLose = userEntryObj.weight - targetWeight;

      //display motivational quotes to lose weight/cheer up
      var equal = ['Yayy &#127930; &#127930; &#127930; You have reached the goal!', '&#127881; &#127881; &#127881; You did it!!!', '&#128077; You rock! &#10071;', 
            '&#127942; You made it! So proud of you. &#128079;', 'You made it happen &#128077; Keep it up!'];
      var less = ['You can set a new goal if you want &#128513;', '&#128175; Keep it up!', 'You are doing great &#128077;', '&#128170; You are strong &#10071;', 
            '&#127939; &#127939; &#127939; Let&#39;s get fit!'];
      var more = ['Excuses don&#39;t burn calories &#128581; &#9656;&#9656; ', 'Yesterday you said tomorrow! &#129324;&#129324;&#129324; &#9656;&#9656; ', 'Nothing tastes as good as being thin feels! &#128089; &#9656;&#9656; ', 
            'Only you can change your life. No one can do it for you &#9656;&#9656; ', 'Don&#39;t reward yourself with food. You are not a dog &#128544; &#9656;&#9656; '];

      var randomNum = Math.floor(Math.random() *5); //to display a random quote from the array

      if(moreToLose == 0) { //goal achieved
            $('#motiv-msg').html(equal[randomNum]);
      }else if (moreToLose<0){ //lost more than the set goal
            $('#motiv-msg').html(less[randomNum]);
      }else { //still needs to work towards the goal
            $('#motiv-msg').html(more[randomNum] + ' <span style="color: orangered">' +  (moreToLose.toFixed(1) + '</span> lbs left!'));
  
      }
}




/*************************************************************************************************** 
 * updateEntryList - updates the entry list ORRRRRRRRRRRR should i call it renderUpdatedListOnDom ???????? ?????? ????? ??????????? ??????? ??????? ???????? ?????????
 * @param none
 * @returns {undefined} none
 * @calls renderEntryOnDom
 */
function updateEntryList(){
      console.log('updating student lists');
      //get data from server and render? or use the global arrayofentryobjects??
      // renderEntryOnDom( userEntryObj );
}


/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} students  the array of student objects
 * @returns {number}

function calculateGradeAverage(){
      var sum = 0, average = 0;
      for (var i=0; i<arrayOfEntryObjects.length; i++) {
            sum = sum + Number(arrayOfEntryObjects[i]['grade']);
      }
      average = sum / arrayOfEntryObjects.length;

      if (arrayOfEntryObjects.length === 0)
            return 0;
      return average;
} */





function handleDeleteEntry ( deleteEntryObj ) {
      showModal ('delete');
      
      if($('#delete-entry-button').click(function() {
            var entryIDToDelete = deleteEntryObj.entryID;
            var indexNumToDelete = arrayOfEntryObjects.indexOf(deleteEntryObj);
console.log('index of entry to delete: ', indexNumToDelete);
console.log('entryID to delete: ', entryIDToDelete);

            arrayOfEntryObjects.splice(indexNumToDelete, 1); //remove the entry from the global arrayOfEntryObjects
            $(event.currentTarget).parent().parenet().remove(); //remove the entry by removing its parent node

            hideModal ('delete');
            //gotta call updateEntryList function here to render the updated list on dom - or the below instead? let's check later
            renderEntryOnDom(deleteEntryObj);
            deleteDataFromServer ( entryIDToDelete );
      }));
      
}



function handleEditEntry (editEntryObj) {
      console.log('inside handleEditEntry, userEntryObj: ', editEntryObj);
      console.log('arrayOfEntryObjects: ', arrayOfEntryObjects);

      var trparent= event.currentTarget.closest("tr"); //finds the editEntry button's closest 'tr' 
     
      var wt = (trparent.childNodes[1].innerText).split(' '); //returns ex) "140 lbs" so parsing just the number (before the space)
      var weightNum = wt[0]; //wt[1] has "lbs"

      showModal ('edit');

      var dateField = document.querySelector('#updatedDate');
      dateField.value = trparent.firstChild.innerText;
      var weightField = document.querySelector('#updatedWeight');
      weightField.value = weightNum;
      var noteField = document.querySelector('#updatedNote');
      noteField.value = trparent.childNodes[2].innerText;

      
      if($('.update-button').click(function() {
            var indexNumToUpdate = arrayOfEntryObjects.findIndex(function(weightEntry){
                  return weightEntry.entryID === editEntryObj.entryID;
            });
            console.log('index of entry to edit: ', indexNumToUpdate);

            console.log(' and entryID for '+indexNumToUpdate+' is: ', editEntryObj.entryID);

            console.log('weight to be updated: ', editEntryObj.weight);

            var newUserEntryObj = {};
            newUserEntryObj.date = $('#updatedDate').val();
            newUserEntryObj.weight = $('#updatedWeight').val();
            newUserEntryObj.note = $('#updatedNote').val();
            newUserEntryObj.entryID = editEntryObj.entryID;
            if(indexNumToUpdate > -1){
                  arrayOfEntryObjects[indexNumToUpdate] = newUserEntryObj;
                  console.log('new weight: ', newUserEntryObj.weight);

                  hideModal ('edit');
                  updateDataInServer ( newUserEntryObj ); 
            }else{ //when indexNumToUpdate = -1, meaning no match (not found)
                  console.log('entry trying to edit not found.');
            }
      }));
}






function getDataFromServer() {
      var ajaxConfig = {
            dataType: 'json',
            method: 'post',
            url: 'dataApi/get_entries.php',
            data: {
                  browserID: localStorage.getItem('uniqueBrowserID'),
            },
            success: function (serverResponse) {
                  var result = {};
                  result = serverResponse;
                  if (result.success) {
                        for (var i = 0; i < result.data.length; i++) {
                              arrayOfEntryObjects.push(result.data[i]);
                              updateEntryList();
                              //            renderEntryOnDom(userEntryObj); let's come back here

                        };
                  };
            },
            error: displayError,
      }
      $.ajax(ajaxConfig);
}



function updateDataInServer ( newEntryObj ) {
      console.log('sending data from updateDataInServer: ', newEntryObj);

      var ajaxConfig = {
            // dataType: 'json',
            data: JSON,
            method: 'post',
            url: 'dataApi/update_entry.php',
            data: {
                  browserID: localStorage.getItem('uniqueBrowserID'),
                  entryID: newEntryObj.entryID,
                  entryDate: newEntryObj.date,
                  entryWeight: newEntryObj.weight,
                  entryNote: newEntryObj.note
            },
            success: function (serverResponse) {
                  var result = {};
                  result = serverResponse;
                  if (result.success) {
                        for (var i = 0; i < result.data.length; i++) {
                              arrayOfEntryObjects.push(result.data[i]);
                              // updateEntryList();
                              renderEntryOnDom(newEntryObj);

                        };
                  };
                  console.log("Updating in server successful.");
            },
            function (serverResponse) {
                  console.log("Error updating in server.");
            }
      }
      $.ajax(ajaxConfig);
}




function sendDataToServer ( userEntryObj ) {
      console.log('inside sendDataToServer function');
      var ajaxConfg = {
            // dataType: 'json',
            data: JSON,
            method: 'post',
            url: 'dataApi/add_entry.php',
            data: {
                  entryNote: userEntryObj.note,
                  entryDate: userEntryObj.date,  
                  entryWeight: userEntryObj.weight,
                  browserID: localStorage.getItem('uniqueBrowserID'),
                  action: 'insert'
            },
            success: function (serverResponse) {
                  addEntry(userEntryObj);
                  console.log("sending data to server is successful");

                  // check!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                  var result = {};
                  result = serverResponse;
                  if (result.success) {
                        for (var i = 0; i < result.data.length; i++) {
                              arrayOfEntryObjects.push(result.data[i]);
                              console.log('result.data[0]', result.data[i]);
                              // updateEntryList();
                              renderEntryOnDom(userEntryObj);

                        };
                  };
            },
            //function (serverResponse) {
            //       console.log("adding is successful");
                  
            // },
            error: function (serverResponse) {
                  console.log("adding is NOT successful");
            }
      }
      $.ajax(ajaxConfg);
}




function deleteDataFromServer ( entryIDToDelete ) {
      var ajaxConfg = {
            data: JSON,
            method: 'post',
            url: 'dataApi/delete_entry.php',
            data: {
                  browserID: localStorage.getItem('uniqueBrowserID'),
                  entryID: entryIDToDelete //tell DB the entryID to delete from the server
            },
            success: function() {
                  console.log('You have successfully deleted the data.');
            },
            error: function() {
                  console.log('Error deleting the data.');
            }
      }
      $.ajax(ajaxConfg);
}






function displayLFZ( result ) {
      console.log('displayLFZ function called');
      for (var i=0; i<result.data.length; i++) {
            addEntry(result.data[i]); //each contains the userEntryObj
      }
      console.log('displayLFZ line 212: ', result);
}



function showModal( type ){
      var modalToShow = '#' + type + 'Modal';
      $(modalToShow).modal('show');
}



function hideModal( type ){
      var modalToHide = '#' + type + 'Modal';
      $(modalToHide).modal('hide');
}