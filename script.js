/* information about jsdocs: 
* param: http://usejsdoc.org/tags-param.html#examples
* returns: http://usejsdoc.org/tags-returns.html
* 
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
      var uniqueBrowserId = localStorage.getItem('uniqueBrowserId');
      if (!uniqueBrowserId) { //if it doesn't already, assign a new id
            var randomGeneratedId = Math.floor(Math.random() * new Date());
            uniqueBrowserId = localStorage.setItem('uniqueBrowserId', randomGeneratedId);
      }

      //show modal to input goal weight for very first time the user uses this app only
      if(targetWeight === 'N/A'){
            showModal('goalWeightInput');
            renderGoalWeight(targetWeight);
      }else{
            targetWeight = localStorage.getItem('targetWeight');
            renderGoalWeight(targetWeight);
      }
      console.log('target weight is: '+targetWeight);

      //displays today's date (local time) as default
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
      $("#goalWeightEnterButton").click(handleGoalWeight);
      $("#addButton").click(handleAddClicked); //add button
      // $("#newAddButton").click(handleModalAddClicked); //add button from modal
      $("#cancelButton").click(handleCancelClick); //cancel button
      // $(".btn-info").click(getData); //get data from server button
      $('.goal-weight-display').click(editGoalWeight);
}



/***************************************************************************************************
* checkEnterKeyPressed - checks if Enter key is pressed in modal for goal weight input, if pressed, call handleGoalWeight function
* @params event 
* @returns  none 
*/
function checkEnterKeyPressed(e){
      if(e.which == 13) {
            handleGoalWeight();
      }
}



/***************************************************************************************************
* handleGoalWeight - once goal weight is entered from modal, display onto DOM
* @params none 
* @returns none
*/
function handleGoalWeight() {
      var goalWeight = $('#setGoalWeight').val();
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
            localStorage.setItem('targetWeight',targetWeight);
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
      userEntryObj.note = $('#note').val();
      userEntryObj.date = $('#today').val();
      userEntryObj.weight = $('#weight').val(); //weight is saved as a string


      if (!userEntryObj.note) { //if note is left blank, note value is set to "N/A"
            userEntryObj.note = "N/A";
      }

      if ((userEntryObj.note).length < 2) { //if note field is less than 2 characters long, display alert message
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

      if (!userEntryObj.date) { //if date field is left blank, default date value is set to today's date
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
      }
   

      sendDataToDB(userEntryObj); /** is this needed??????????????????? */

      $('#edit-weight-alert-desktop').addClass("hidden");
      $('#edit-note-alert-desktop').addClass("hidden");

      $('#edit-weight-alert-mobile').addClass("hidden");
      $('#edit-note-alert-mobile').addClass("hidden");

}



function handleModalAddClicked(entryObj){
      console.log(entryObj);
      addEntry(entryObj);
      clearAddEntryInputs();
      sendDataToDB(entryObj); 
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
      updateEntryList( userEntryObj );
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
            class: 'weightOutput', //do i need to have this class??????
            text: userEntryObj.weight + ' lbs'
      });

      $('.student-list tbody').append( newTr );
      newTr.append('<td>' + userEntryObj.date ); 
      newTr.append(weightItem);
      newTr.append('<td>' + userEntryObj.note );
      // $(newTr).append('<td>' + (targetWeight / userEntryObj.weight * 100).toFixed(1) + '%');
      var moreToLose = userEntryObj.weight - targetWeight;
      if(moreToLose == 0) {
            newTr.append('<td>Yayyy You have reached the goal!');
      }else if (moreToLose<0){
            newTr.append('<td>You might wanna set a new goal.');
      }else {
            newTr.append('<td>' + (moreToLose.toFixed(1) + ' lbs. more to go'));
      }
      var deleteButton = $('<button>', {
            class: 'btn btn-danger',
            id: 'delete-entry',
            text: 'Delete'
      });

      var editButton = $('<button>', {
            class: 'btn btn-info',
            id: 'edit-entry',
            text: 'Edit'
      });

      newTr.append(deleteButton, editButton);

      $(deleteButton).click(function() {
            removeEntry (userEntryObj);
      });
      $(editButton).click(function() {
            editEntry (userEntryObj);
      });
 }

/***************************************************************************************************
 * updateEntryList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderEntryOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateEntryList( userEntryObj ){
      console.log('updating student lists');
      renderEntryOnDom( userEntryObj );
      // renderGradeAverage(calculateGradeAverage());  
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






function removeEntry ( userEntryObj ) {
      showModal ('delete');
      // var indexNumToDelete = arrayOfEntryObjects.indexOf(userEntryObj);
      // arrayOfEntryObjects.splice(indexNumToDelete, 1); 
      // $(event.currentTarget).parent().remove()
      // // renderGradeAverage(calculateGradeAverage());  
      // deleteDataFromDB ( userEntryObj );
}



function editEntry (userEntryObj) {
      var indexNumToDelete = arrayOfEntryObjects.indexOf(userEntryObj);
      showModal ('edit');
}




function getData() {
      var ajaxConfig = {
            dataType: 'json',
            method: 'post',
            // url: 'http://localhost:8888/data.php',
            url: api_url.get_items_url,
            data: {
                  browserId: localStorage.getItem('uniqueBrowserId'),
            },
            success: function (serverResponse) {
                  var result = {};
                  result = serverResponse;
                  if (result.success) {
                        for (var i = 0; i < result.data.length; i++) {
                              itemArray.push(result.data[i]);
                              updateItemList();
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



function sendDataToDB ( userEntryObj ) {
      console.log('sendDataToDB function called');
      var ajaxConfg = {
            dataType: 'json',
            method: 'post',
            // url: 'http://localhost:8888/data.php',
            url: api_url.add_item_url,
            data: {
                  // api_key: 'wjaABAN7N4',
                  note: userEntryObj.note,
                  date: userEntryObj.date,  
                  weight: userEntryObj.weight,
                  // course_name: "Hllooooooooooooooooooo",
                  action: 'insert'
            },
            success: function (serverResponse) {
                  var result = serverResponse;
                  if (result.success) {
                        lastObjInitemArray.id = result.data[result.data.length - 1].id;
                  }
            },
            error: function (serverResponse) {
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




function deleteDataFromDB ( userEntryObj ) {
      var ajaxConfg = {
            dataType: 'json',
            method: 'post',
            url: 'http://s-apis.learningfuze.com/sgt/delete',
            data: {
                  api_key: 'wjaABAN7N4', 
                  student_id: userEntryObj.id //tell DB the id you want to delete
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