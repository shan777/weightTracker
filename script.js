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
var targetWeight = 125; // for now

/***************************************************************************************************
* initializeApp 
* @params {undefined} none
* @returns: {undefined} none
* initializes the application, including adding click handlers and pulling in any data from the server, in later versions
*/
function initializeApp(){
      //assigns unique user browser id so displays only the user's own data on user's browser
      var uniqueBrowserId = localStorage.getItem('uniqueBrowserId');
      if (!uniqueBrowserId) { //if it doesn't already, assign a new id
            var randomGeneratedId = Math.floor(Math.random() * new Date());
            uniqueBrowserId = localStorage.setItem('uniqueBrowserId', randomGeneratedId);
      }

      console.log('initializedApp');
      document.querySelector("#today").valueAsDate = new Date(); //displays today's date as default
      renderGoalWeight(targetWeight);
      // getDataFromServer();
      addClickHandlersToElements();
      // handleFocusInForForm();
}

/***************************************************************************************************
* addClickHandlersToElements
* @params {undefined} 
* @returns  {undefined}
* adds click handlers to the elements    
*/
function addClickHandlersToElements(){
      console.log('click handlers added');
      $("#addButton").click(handleAddClicked); //add button
      // $("#newAddButton").click(handleModalAddClicked); //add button from modal
      $("#cancelButton").click(handleCancelClick); //cancel button
      // $(".btn-info").click(getData); //get data from server button
      $('#goal-weight').click(editGoalWeight);
      
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param: {object} event  The event object from the click
 * @return: none
 */
function handleAddClicked(event){
      var userEntryObj = {};
      userEntryObj.note = $('#note').val();
      userEntryObj.date = $('#today').val();
      userEntryObj.weight = $('#weight').val(); //weight is a string

      // $('#edit-weight-alert').addClass("hidden");
      // $('#edit-note-alert').addClass("hidden");
      // $('#edit-weight-alert').removeClass("hidden");

      if (!userEntryObj.note) { //if note is left blank, note value is set to "N/A"
            userEntryObj.note = "N/A";
      }

      if (!userEntryObj.date) { //if date field is left blank, date value is set to today's date
            var fullDate = new Date();
            var yr = fullDate.getFullYear();
            var mo = fullDate.getMonth() + 1;
            if(mo<10)
                  mo = "0" + mo;
            var dt = fullDate.getDate();
            userEntryObj.date = (yr+"-"+mo+"-"+dt).toString();
      }




      if (!userEntryObj.weight) { //if weight field is empty, display alert message
            $('#edit-weight-alert').removeClass("hidden");
            handleAddClicked();
      } else if ((userEntryObj.note).length < 2) { //if note field is less than 2 characters long, display alert message
            $('#edit-note-alert').removeClass("hidden");
      } else if (isNaN(Number(userEntryObj.weight)) || Number(userEntryObj.weight)<2) { //if input for the weight is not a number or less than 2
            $('#edit-weight-alert').removeClass("hidden");

            // $('#newStudentNote').val(userEntryObj.note);
            // $('#newCourse').val(userEntryObj.date);
            // showModal('error');
            // userEntryObj.weight = $('#newStudentWeight').val();
            handleAddClicked(userEntryObj);
            clearAddEntryInputs(); 
      } else {
            addEntry(userEntryObj);
            clearAddEntryInputs();
      }     




      // if (!userEntryObj.weight) { //if weight field is empty, display alert message and get new input
      //       console.log('empty weight field');
      //       $('#edit-weight-alert').removeClass("hidden");
      //       // userEntryObj.weight = $('#weight').val();
      //       // $('#weight').focus(function(){
      //       //       $('#edit-weight-alert').addClass("hidden");
      //       // });
      // } 

//       if ((userEntryObj.note).length < 2) { //if note field is less than 2 characters long, display alert message
//             $('#edit-note-alert').removeClass("hidden");
//       } 
//       if (isNaN(Number(userEntryObj.weight)) || Number(userEntryObj.weight)<2) { //if input for the weight is not a number or less than 2
//             $('#edit-weight-alert').removeClass("hidden");
// // if(userEntryObj.weight)
//             // $('#newStudentNote').val(userEntryObj.note);
//             // $('#newCourse').val(userEntryObj.date);
//             // showModal('error');
//             // userEntryObj.weight = $('#newStudentWeight').val();
//             // handleAddClicked(userEntryObj);
//             clearAddEntryInputs(); 
//       } else {
//             addEntry(userEntryObj);
//             clearAddEntryInputs();
//       }     
//       sendDataToDB(userEntryObj); /** is this needed??????????????????? */

      $('#edit-weight-alert').addClass("hidden");
      $('#edit-note-alert').addClass("hidden");

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
      // $(newTr).append('<td>' + userEntryObj.weight + ' lbs' ); 
      newTr.append(weightItem);
      newTr.append('<td>' + userEntryObj.note );
      // $(newTr).append('<td>' + (targetWeight / userEntryObj.weight * 100).toFixed(1) + '%');
      var moreToLose = userEntryObj.weight - targetWeight;
      newTr.append('<td>' + (moreToLose.toFixed(1) + ' more to go'));

      var deleteButton = $('<button>').addClass('btn btn-danger').text('Delete');
      var editButton = $('<button>').addClass('btn btn-info').text('Edit');
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

/***************************************************************************************************
 * renderGoalWeight - render goal weight on DOM
 * @param: {number} targetWeight
 * @returns {undefined} none
 */
function renderGoalWeight( targetWeight ){
      $('.goal-Weight-display').html(targetWeight);
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
            newGoalWeight.addClass('hidden');
            saveBtn.addClass('hidden');
            $('.goal-weight-edit-btn').removeClass('hidden');
      }));

}


function removeEntry ( userEntryObj ) {
      var indexNumToDelete = arrayOfEntryObjects.indexOf(userEntryObj);
      arrayOfEntryObjects.splice(indexNumToDelete, 1); 
      $(event.currentTarget).parent().remove()
      // renderGradeAverage(calculateGradeAverage());  
      deleteDataFromDB ( userEntryObj );
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