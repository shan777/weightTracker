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
var targetWeight = 122;

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
      // renderGradeAverage( 0 );
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
      userEntryObj.weight= $('#weight').val();

      console.log('type:'+typeof(userEntryObj.date));

      if (!userEntryObj.note) { //if note is left blank, note value is set to "N/A"
            userEntryObj.note = "N/A";
      }

      if (!userEntryObj.date) { //if date field is left blank, date value is set to today's date
            var fullDate = new Date();
            var yr = fullDate.getFullYear();
            var mo = fullDate.getMonth() + 1;
            var dt = fullDate.getDate();
            userEntryObj.date = (yr+"-"+mo+"-"+dt).toString();
            console.log('date left blank: '+userEntryObj.date);

      }

      if (!userEntryObj.weight) { //if weight field is empty
            showModal('empty');
            handleAddClicked();
      } else if ((userEntryObj.note).length <=2) {
            showModal('error');
      } else if (isNaN(Number(userEntryObj.weight)) || Number(userEntryObj.weight)<=0) { //if input for the weight is not a number or a negative number
            // $("#myModal").modal();
            $('#newStudentNote').val(userEntryObj.note);
            $('#newCourse').val(userEntryObj.date);
            showModal('error');
            userEntryObj.weight = $('#newStudentWeight').val();
            handleModalAddClicked(userEntryObj);
            clearAddEntryInputs(); 
      } else {
            addEntry(userEntryObj);
            clearAddEntryInputs();
      }     
      sendDataToDB(userEntryObj); /** is this needed??????????????????? */
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
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param {object} userEntryObj a single student object with course, name, and weight inside
 */
function renderStudentOnDom( userEntryObj ){
      console.log('rendering students onto DOM');
      var newTr = $('<tr>');
      $('.student-list tbody').append( newTr );
      $(newTr).append('<td>' + userEntryObj.date ); 
      $(newTr).append('<td>' + userEntryObj.weight + ' lbs' ); 
      $(newTr).append('<td>' + userEntryObj.note );
      $(newTr).append('<td>' + (targetWeight / userEntryObj.weight * 100).toFixed(1) + '%');

      var deleteButton = $('<button>').addClass('btn btn-danger').text('Delete');
      $(newTr).append(deleteButton);
      $(deleteButton).click(function() {
            removeEntry ( userEntryObj );
      });
 }

/***************************************************************************************************
 * updateEntryList - centralized function to update the average and call student list update
 * @param students {array} the array of student objects
 * @returns {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateEntryList( userEntryObj ){
      console.log('updating student lists');
      renderStudentOnDom( userEntryObj );
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
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average    the grade average
 * @returns {undefined} none

function renderGradeAverage( average ){
      // var avg = Math.round(average);
      $('.avgGrade').html(targetWeight);
}
 */


function removeEntry ( userEntryObj ) {
      var indexNumToDelete = arrayOfEntryObjects.indexOf(userEntryObj);
      arrayOfEntryObjects.splice(indexNumToDelete, 1); 
      $(event.currentTarget).parent().remove()
      // renderGradeAverage(calculateGradeAverage());  
      deleteDataFromDB ( userEntryObj );
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



function hideModal(){
      var modalToHide = '#errorModal';
      $(modalToHide).modal('hide');
}