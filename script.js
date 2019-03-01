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
var targetWeight = 'N/A'; 

/***************************************************************************************************
* initializeApp - initializes the application, including adding click handlers and pulling in any data from the server
* @params  none
* @returns  none
* 
*/
function initializeApp(){
     
      $('.lbs-text').addClass('hidden');

      //assigns unique user browser id so displays only the user's own data on user's browser
      var uniqueBrowserID = localStorage.getItem('uniqueBrowserID');
      if (!uniqueBrowserID) { //if it doesn't have one existed already, assign a new id
            var randomGeneratedID = Math.floor(Math.random() * new Date(10000000000)); //random integer (up to 10 digit)
            uniqueBrowserID = localStorage.setItem('uniqueBrowserID', randomGeneratedID);
      }

      //show modal to ask for goal weight for very first time the user uses this app only
      //not working thoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
      if(targetWeight === 'N/A'){
            showModal('goalWeightInput');
            renderGoalWeight(targetWeight);
      }else{
            targetWeight = localStorage.getItem('targetWeight');
            renderGoalWeight(targetWeight);
      }
      console.log('target weight is: '+targetWeight);

      //displays today's date (in local time) as default
      var date = new Date();
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      var dateStr = date.toISOString().substring(0, 10);
      var field = document.querySelector('#today');
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
      console.log('click handlers added');
      // $("#goalWeightEnterButton").click(handleGoalWeight); //from edit goal weight modal
      $("#addButton").click(handleAddClicked); //add entry button
      // $("#newAddButton").click(handleModalAddClicked); //add button from modal
      $("#cancelButton").click(handleCancelClick); //cancel entry button
      // $(".btn-info").click(getDataFromServer); //get data from server button
      $('.goal-weight-display').click(editGoalWeight);
      // $("#updateButton").click(handleUpdateClicked); //update button from editing modal
      
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
      console.log('inside checkreminingagag');
      if(this.value.length > 10){
            return false;
      }
      $("#remainingC").html("Remaining characters : " +(10 - this.value.length));
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
      if(targetWeight == 'N/A') {
            $('.goal-weight-display').html(targetWeight);
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
      var newGoalWeight = $('<input>', {
            type: 'number',
            class: 'form-control input-goal-weight',
            name: 'updatedGoalWeight',
            id: 'updated-goal-weight',
            placeholder: 'Enter new target',
            text: $('#updated-goal-weight').val(),
      });

      var saveBtn = $('<button>', {
            id: 'saveButton',
            class: 'save-btn',
            text: 'Save'
      });

      $('.goal-weight-edit-btn').addClass('hidden');
      $('.goal-text').append(newGoalWeight, saveBtn);

      if($('#saveButton').click(function() {
            var updatedWeight = $('#updated-goal-weight').val(); 
            renderGoalWeight(updatedWeight);
            targetWeight = updatedWeight;
            newGoalWeight.addClass('hidden');
            saveBtn.addClass('hidden');
            $('.goal-weight-edit-btn').removeClass('hidden');
            saveBtn.remove();
            newGoalWeight.remove();
      }));
      
      //updateEntryList( userEntryObj ); //To Goal messages should be updated based on updated goal weight
}



/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param: {object} event  The event object from the click
 * @return: none
 */
function handleAddClicked(event){
      var validInput = true;
      var userEntryObj = {};
      userEntryObj.date = $('#today').val();
      userEntryObj.weight = $('#weight').val(); //weight is saved as a string
      userEntryObj.note = $('#note').val();


      if (!userEntryObj.note) { //if note is left blank, note value is set to "N/A"
            userEntryObj.note = "N/A";
      }

      if ((userEntryObj.note).length > 100) { //if note is more than 100 characters long, display error message
            $('#edit-note-alert-desktop').removeClass("hidden");
            $('#note').focus(function(){
                  $('#edit-note-alert-desktop').addClass('hidden');
            });

            $('#edit-note-alert-mobile').removeClass("hidden");
            $('#note').focus(function(){
                  $('#edit-note-alert-mobile').addClass('hidden');
            });

            validInput = false;
      } 

      if (!userEntryObj.date) { //if date field is left blank, default date value is set to today's date in local time
            var fullDate = new Date();
            var yr = fullDate.getFullYear();
            var mo = fullDate.getMonth() + 1;
            if(mo<10)
                  mo = "0" + mo;
            var dt = fullDate.getDate();
            userEntryObj.date = (yr+"-"+mo+"-"+dt).toString();
      }

      if (!userEntryObj.weight) { //if weight field is empty, display alert message
            $('#edit-weight-alert-desktop').removeClass("hidden");
            $('#weight').focus(function(){
                  $('#edit-weight-alert-desktop').addClass('hidden');
            });

            $('#edit-weight-alert-mobile').removeClass("hidden");
            $('#weight').focus(function(){
                  $('#edit-weight-alert-mobile').addClass('hidden');
            });

            validInput = false;
            // handleAddClicked();
      } else if (isNaN(Number(userEntryObj.weight)) || Number(userEntryObj.weight)<2) { //if input for the weight is not a number ex) 'e' or less than 2
            $('#edit-weight-alert-desktop').removeClass("hidden");
            $('#weight').focus(function(){
                  $('#edit-weight-alert-desktop').addClass('hidden');
            });

            $('#edit-weight-alert-mobile').removeClass("hidden");
            $('#weight').focus(function(){
                  $('#edit-weight-alert-mobile').addClass('hidden');
            });
            validInput = false;

            // handleAddClicked(userEntryObj);
      } 
      
      if (validInput) {
            addEntry(userEntryObj);
            clearAddEntryInputs();
            // sendDataToServer(userEntryObj); 
      }else {
            
      
   


      $('#edit-weight-alert-desktop').addClass("hidden");
      $('#edit-note-alert-desktop').addClass("hidden");

      $('#edit-weight-alert-mobile').addClass("hidden");
      $('#edit-note-alert-mobile').addClass("hidden");
}
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
 * addEntry - creates a student objects based on input fields in the form and adds the object to global student array
 * @param {undefined} none
 * @return undefined
 * @calls clearAddEntryInputs, updateEntryList
 */
function addEntry(userEntryObj){
      console.log('addEntry function called');
      arrayOfEntryObjects.push(userEntryObj); 
      counter++;
      renderEntryOnDom(userEntryObj);
      // updateEntryList( userEntryObj );
      // clearAddEntryInputs();
}


/***************************************************************************************************
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddEntryInputs(){
      $('#note').val('');
      $('#today').val('');
      $('#weight').val('');
}

/***************************************************************************************************
 * renderEntryOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} userEntryObj a single student object with course, name, and weight inside
 */
function renderEntryOnDom( userEntryObj ){
      console.log('rendering students onto DOM');
      var newTr = $('<tr>');
      var weightItem = $('<td>', {
            class: 'col-lg-1 col-md-1 col-sm-1 col-xs-1', 
            text: userEntryObj.weight + ' lbs'
      });
      var dateItem = $('<td>', {
            class: 'col-lg-2 col-md-2 col-sm-2 col-xs-2', 
            text: userEntryObj.date
      });
      var noteItem = $('<td>', {
            class: 'col-lg-4 col-md-4 col-sm-4 col-xs-4', 
            text: userEntryObj.note
      });

      $('.student-list tbody').append( newTr );
      newTr.append(dateItem); 
      newTr.append(weightItem);
      newTr.append(noteItem);

      // $(newTr).append('<td>' + (targetWeight / userEntryObj.weight * 100).toFixed(1) + '%'); //not gonna work

      var moreToLose = userEntryObj.weight - targetWeight;

      //display motivational quotes to lose weight/cheer up
      var equal = ['Yayy &#127930; &#127930; &#127930; You have reached the goal!', '&#127881; &#127881; &#127881; You did it!!!', '&#128077; You rock! &#10071;', 
            '&#127942; You made it! So proud of you. &#128079;', 'You made it happen &#128077; Keep it up!'];
      var less = ['You can set a new goal if you want &#128513;', '&#128175; Keep it up!', 'You are doing great &#128077;', '&#128170; You are strong &#10071;', 
            '&#127939; &#127939; &#127939; Let&#39;s get fit!'];
      var more = ['Excuses don&#39;t burn calories &#128581;', 'Yesterday you said tomorrow! &#129324;&#129324;&#129324;', 'Nothing tastes as good as being thin feels! &#128089;', 
            'Only you can change your life. No one can do it for you&#10071;', 'Don&#39;t reward yourself with food. You are not a dog &#128544;'];

      var randomNum = Math.floor(Math.random() *5);

      if(moreToLose == 0) { //goal achieved
            $('#motiv-msg').html(equal[randomNum]);
      }else if (moreToLose<0){ //lost more than the set goal
            $('#motiv-msg').html(less[randomNum]);
      }else { //still needs to work towards the goal
            $('#motiv-msg').html(more[randomNum] + ' Only <span style="color: orangered">' +  (moreToLose.toFixed(1) + '</span> lbs left!'));
      }

      //just a placeholder
      newTr.append('<td>difference here');
      // if(prev === curr) { if weight did not change
      //       newTr.append('<td><span style='font-size:24px; color: red;'>&#9660;</span>');
      // }else if (prev > curr) //if lost weight
      //       newTr.append('<td><span style='font-size:24px; color: green;'>&#9660;</span>');
      // }else { //if gained weight
      //       newTr.append('<td><span style='font-size:24px; color: red;'>&#9650;</span>');
      // }

     
      
      var editBtn = $('<button>', {
            class: 'btn btn-info',
            id: 'edit-entry',
            html: '<i class="fa fa-pencil-square-o">',
            style: 'margin-right: 5px; padding: 3px 5px; width: 30px;'
      });
      var deleteBtn = $('<button>', {
            class: 'btn btn-danger',
            id: 'delete-entry',
            html: '<i class="fa fa-trash">',
            style: 'padding: 3px 5px; width: 30px;'
      }, );

      newTr.append(editBtn, deleteBtn);

      
      $(editBtn).click(function() {
            handleEditEntry (userEntryObj);
      });
      $(deleteBtn).click(function() {
            handleDeleteEntry (userEntryObj);
      });
 }

/*************************************************************************************************** 
 * updateEntryList - updates the entry list ORRRRRRRRRRRR should i call it renderUpdatedListOnDom ???????? ?????? ????? ??????????? ??????? ??????? ???????? ?????????
 * @param students {array} the array of entry objects???????????????? needs to work on this!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * @returns {undefined} none
 * @calls renderEntryOnDom
 */
function updateEntryList( arrayOfEntryObjects ){
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






function handleDeleteEntry (userEntryObj) {
      showModal ('delete');
      
      if($('#delete-entry-button').click(function() {
            //gotta call updateEntryList function here to render the updated list on dom 
            var indexNumToDelete = arrayOfEntryObjects.indexOf(userEntryObj);
            arrayOfEntryObjects.splice(indexNumToDelete, 1); // check again!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            $(event.currentTarget).parent().remove(); //not sure what this is doing
            hideModal ('delete');

            deleteDataFromServer ( userEntryObj );
      }));
      
}



function handleEditEntry (userEntryObj) {
      showModal ('edit');

      var dateField = document.querySelector('#updatedDate');
      dateField.value = userEntryObj.date;
      var weightField = document.querySelector('#updatedWeight');
      weightField.value = userEntryObj.weight;
      var noteField = document.querySelector('#updatedNote');
      noteField.value = userEntryObj.note;

      // document.getElementsByName('newInputWeight')[0].placeholder = userEntryObj.weight;
      // document.getElementsByName('newInputNote')[0].placeholder = userEntryObj.note;

      if($('#updateButton').click(function() {
            console.log('updatebutton clicked');
            var indexNumToUpdate = arrayOfEntryObjects.indexOf(userEntryObj);

            var newUserEntryObj = {};
            newUserEntryObj.date = $('#updatedDate').val();
            newUserEntryObj.weight = $('#updatedWeight').val();
            newUserEntryObj.note = $('#updatedNote').val();
            arrayOfEntryObjects[indexNumToUpdate] = newUserEntryObj;

            hideModal ('edit');

            var entryIDToUpdate = arrayOfEntryObjects[indexNumToUpdate].entryID;
            updateDataInServer ( newUserEntryObj, entryIDToUpdate ); 
      }));
}




function getDataFromServer() {
      var ajaxConfig = {
            dataType: 'json',
            method: 'post',
            // url: 'http://localhost:8888/data.php',
            url: api_url.get_entries_url,
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
                        };
                  };
            },
            error: displayError,
      }
      $.ajax(ajaxConfig);
}



function updateDataInServer (newEntryObj, entryIDToUpdate) {
      var ajaxConfig = {
            dataType: 'json',
            method: 'post',
            url: api_url.update_entry_url,
            data: {
                  browserID: localStorage.getItem('uniqueBrowserID'),
                  entry_id: entryIDToUpdate,
                  entry_date: newEntryObj.date,
                  entry_weight: newEntryObj.weight,
                  entry_note: newEntryObj.note
            },
            success: function (serverResponse) {
                  var result = {};
                  result = serverResponse;
                  if (result.success) {
                        for (var i = 0; i < result.data.length; i++) {
                              arrayOfEntryObjects.push(result.data[i]);
                              updateEntryList();
                        };
                  };
            },
            error: displayError,
      }
      $.ajax(ajaxConfig);
}




function displayLFZ( result ) {
      console.log('displayLFZ function called');
      for (var i=0; i<result.data.length; i++) {
            addEntry(result.data[i]); //each contains the userEntryObj
      }
      console.log('displayLFZ line 212: ', result);
}



function sendDataToServer ( userEntryObj ) {
      console.log('sendDataToServer function called');
      var ajaxConfg = {
            dataType: 'json',
            method: 'post',
            // url: 'http://localhost:8888/data.php',
            url: 'dataApi/add_entry.php',
            data: {
                  // api_key: 'wjaABAN7N4',
                  entryNote: userEntryObj.note,
                  entryDate: userEntryObj.date,  
                  entryWeight: userEntryObj.weight,
                  // course_name: "Hllooooooooooooooooooo",
                  action: 'insert'
            },
            success: function (serverResponse) {
                  console.log("adding is successful");
                  var result = serverResponse;
                  if (result.success) {
                        
                        lastObjInitemArray.id = result.data[result.data.length - 1].id;
                  }
            },
            error: function (serverResponse) {
                  console.log("adding is NOT successful");

                  $(".add-item-error").removeClass('hidden')
            }
      }
      $.ajax(ajaxConfg);
}



function displaySuccess( serverResponse ) {
      var lastObjFromTheArray = arrayOfEntryObjects[arrayOfEntryObjects.length-1];
      if(serverResponse.success) {
            lastObjFromTheArray.id = serverResponse.new_id; //assign new_id in the database to the last student added
            console.log('Successful!');
      }
}




function displayError() {
      console.log('errrrrrrrrrrrrrrrrrrrror');
}




function deleteDataFromServer ( userEntryObj ) {
      var ajaxConfg = {
            dataType: 'json',
            method: 'post',
            url: api_url.delete_entry_url,
            data: {
                  browserID: localStorage.getItem('uniqueBrowserID'),
                  entryID: userEntryObj.entryID //tell DB the id you want to delete
            },
            success: function() {
                  console.log('You have successfully deleted the data');
            },
            error: displayError
      }
      $.ajax(ajaxConfg);
}




function showModal( type ){
      var modalToShow = '#' + type + 'Modal';
      $(modalToShow).modal('show');
}



function hideModal( type ){
      var modalToHide = '#' + type + 'Modal';
      $(modalToHide).modal('hide');
}