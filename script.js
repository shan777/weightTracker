/**
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp);

/**
 * Global variables:  
 *
 * arrayOfEntryObjects  @type {Array} - global array to hold the weight entries
 * targetWeight  @type {number} - global number (toFixed(1)) to hold the target weight
 */
var arrayOfEntryObjects = [];
var targetWeight; 
var errorMsg = '';


/***************************************************************************************************
* initializeApp - initializes the application
* @params  none
* @returns  none
* @calls:  addClickHandlersToElements
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
      if(windowWidth < 991){ //mobile size
            var field = document.querySelector('.today-mobile');
      }else{ //desktop size
            var field = document.querySelector('.today-desktop');
      }
      field.value = dateStr;

      getDataFromServer();
      addClickHandlersToElements();
}



/***************************************************************************************************
* addClickHandlersToElements - adds click handlers to the elements
* @params none 
* @returns none 
*/
function addClickHandlersToElements(){
      $(".add-entry-btn").click(handleAddClicked); //add entry button
      $(".cancel-entry-btn").click(handleCancelEntry); //cancel entry button

      $(".edit-cancel-button").click(handleCancelEdit); //cancel edit button

      $('.goal-weight-display').click(editGoalWeight);
   
      $('.note-mobile').keyup(checkRemainingChar);
      $('.note-desktop').keyup(checkRemainingChar);

}



/***************************************************************************************************
* checkEnterKeyPressed - checks if Enter key is pressed in input target weight modal for the first time
* after inputting goal weight and call handleGoalWeight function
* this function is called when the when the user inputs the target weight and press the enter key in the keyboard
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

      $(".remainingC").removeClass('hidden');
      len = this.value.length;
      if(len > maxchar){
            return false;
      }else if (len > 0){
            $(".remainingC").html("Remaining characters: " + (maxchar - len));
      }else{
            $(".remainingC").html("Remaining characters: " + (maxchar));
      }

      var windowWidth = window.innerWidth;
      if(windowWidth < 991){ //mobile size
            $('.note-mobile').focusout(function() {
                  $(".remainingC").addClass('hidden');
            });
      }else { //desktop size
            $('.note-desktop').focusout(function() {
                  $(".remainingC").addClass('hidden');
            });
      }
  
}



/***************************************************************************************************
* handleGoalWeight - once goal weight is entered from the modal, display onto DOM
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
 * editGoalWeight - updates the goal weight from DOM (not modal) then display updated goal weight on DOM
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

      $('#saveButton').click(function() {
            var updatedWeight = $('#updated-goal-weight').val(); 
            // handleGoalWeight();
            renderGoalWeight(updatedWeight);
            targetWeight = updatedWeight;
            localStorage.setItem('targetWeight', targetWeight);
            newGoalWeightInput.addClass('hidden');
            newGoalWeightSaveBtn.addClass('hidden');
            $('.goal-weight-edit-btn').removeClass('hidden');
            newGoalWeightSaveBtn.remove();
            newGoalWeightInput.remove();
            $('#motiv-msg').html(' ');
      });
}



/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param: {object} event  The event object from the click
 * @return: none
 */

function handleAddClicked(){
      var windowWidth = window.innerWidth;
      var userEntryObj = {};

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
            if(mo < 10)
                  mo = "0" + mo;
            var dt = fullDate.getDate();
            if(dt < 10)
                  dt = "0" + dt;
            userEntryObj.date = (yr+"-"+mo+"-"+dt).toString();
      }
    
      if (!userEntryObj.note) { //if note is left blank, note value is set to "N/A"
            userEntryObj.note = "N/A";
      }

      if(validateWeight(userEntryObj.weight)){
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
            $('.edit-weight-alert-mobile').removeClass("hidden");

            var windowWidth = window.innerWidth;
            if(windowWidth < 991){ //mobile size
                  $('.weight-mobile').focus(function(){
                        $('.edit-weight-alert-mobile').addClass('hidden');
                        fixWeight();
                  });
            }else{ //desktop size
                  $('.weight-desktop').focus(function(){
                        $('.edit-weight-alert-desktop').addClass('hidden');
                        fixWeight();
                  });
            }
      }else if (isNaN(Number(weight)) || Number(weight)<2) { //if input for the weight is not a number ex) 'e' or less than 2
            $('.edit-weight-alert-desktop').removeClass("hidden");
            $('.edit-weight-alert-mobile').removeClass("hidden");
            fixWeight();
      }else{
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
      var windowWidth = window.innerWidth;
      if(windowWidth < 991){ //mobile size
            $('.weight-mobile').focus(function(){
                  $('.edit-weight-alert-mobile').addClass("hidden");

                  $('.weight-mobile').on('focusout', function(){
                        var newWeight = this.value;
                        if (newWeight.length > 1) {
                              validateWeight(newWeight);
                        }
                  });
            });
      }else { //desktop size
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
}

/***************************************************************************************************
 * handleCancelEntry - when user clicks the "cancel" button, clears out the input fields in the form 
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddEntryInputs
 */
function handleCancelEntry(){
      clearAddEntryInputs();
}


/***************************************************************************************************
 * handleCancelEdit - when user clicks the "cancel" button in the edit modal, clears out the form and closes modal
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: hideModal
 */
function handleCancelEdit(){
      hideModal('edit');
}


/***************************************************************************************************
 * clearAddEntryInputs - clears out the form values 
 * @param none
 * @return none
 * @calls  none
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
 * compare - used to sort the array in ascending order by date
 * @param: a and b to compare
 * @returns: compareResult 0 (if a=b), 1 (if a>b), or -1 (if a<b)
 */
function compareTwoVars(a, b) {
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
 * addEntry - add the new entry object to the arrayOfEntryObjects array and render (refresh) data onto DOM
 * @param {object} userEntryObj
 * @return undefined
 * @calls renderEntryOnDom
 */
function addEntry(userEntryObj){
      arrayOfEntryObjects.push(userEntryObj); 
      renderEntryOnDom();
}



/***************************************************************************************************
 * renderEntryOnDom - sort the array in ascending order then render data onto the DOM
 * @param {object} userEntryObj a single weight entry object with entryID, date, weight, and note 
 * @return none
 * @calls  none
 */
function renderEntryOnDom(){
      //sort the entries by the ascending order of the date (old on top and recent on the bottom)
      //before rendering
      arrayOfEntryObjects.sort(compareTwoVars);

      var weightTable = document.getElementById("weight-table");
      //remove all children of the weight table before rendering sorted array of entry objects 
      //if weight-table has any children already
      if(weightTable.firstChild){
            //while there's any child left, remove - basically removes all children
            //this is cleaning up the weight table before updating w/ the fresh/updated table
            while (weightTable.firstChild) { 
                  weightTable.removeChild(weightTable.firstChild);
            }
      }

      //rendering onto dom from already sorted array from addEntry function, arrayOfEntryObjects
      for (var i=0; i<arrayOfEntryObjects.length; i++){
            var newTr = $('<tr>');
            var dateItem = $('<td>', {
                  rowspan: '2',
                  class: 'text-center entry-date',
                  style: 'vertical-align: middle; border-right: 1px solid #ddd;',
                  text: arrayOfEntryObjects[i].date
            });
            var weightItem = $('<td>', {
                  // class: 'col-lg-1 col-md-1 col-sm-1 col-xs-1 text-right', 
                  class: 'text-center entry-weight',
                  text: arrayOfEntryObjects[i].weight + ' lbs'
            });
            
            newTr.append(dateItem, weightItem); 

            if(i == 0){    
                  newTr.append('<td class="text-left" style="font-size:18px; color:black; padding-left: 8%;">-');
            }else if (i !== 0) {
                  var prev = Number(arrayOfEntryObjects[i-1].weight);
                  var curr = Number(arrayOfEntryObjects[i].weight);
                  var lbsLost = (prev-curr).toFixed(1);
                  var lbsGained = (curr-prev).toFixed(1);

                  var lostWeightItem = $('<td>', {
                        class: 'text-center entry-diff', 
                        style: 'font-size:14px; color: green; padding-left: 7%;',
                        html: '&#9660; ' + lbsLost

                  });
                  var gainedWeightItem = $('<td>', {
                        class: 'text-center entry-diff', 
                        style: 'font-size:14px; color: red; padding-left: 7%;',
                        html: '&#9650; ' + lbsGained
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
                  rowspan: '2',
                  class: 'text-center',
                  style: 'margin: 0 auto; vertical-align: middle; border-left: 1px solid #ddd;'
            });
            var editBtn = $('<button>', {
                  class: 'btn btn-info fa fa-pencil-square-o entry-editBtn',
                  style: 'margin-right: 5px; padding: 3px 5px; width: 30px;'
            });
            var deleteBtn = $('<button>', {
                  class: 'btn btn-danger fa fa-trash entry-deleteBtn',
                  style: 'padding: 3px 5px; width: 30px;'
            }, );
      
            editAndDelButtons.append(editBtn, deleteBtn);
            newTr.append(editAndDelButtons);

            editBtn.on("click", function() {
                  handleEditEntry();
            });

            deleteBtn.on("click", function() {
                  handleDeleteEntry();
            });

            var newTr2 = $('<tr>');
            var noteItem = $('<td>', {
                  colspan: '2',
                  class: 'text-center entry-note', 
                  text: arrayOfEntryObjects[i].note
            });

            newTr2.append(noteItem); 

            // $('.weight-list tbody').append(newTr, newTr2);
            $('#weight-table').append(newTr, newTr2);

      }
}


/***************************************************************************************************
 * displayMotivMsg - depending on whether user lost or gained weight, displays motivational quote 
 * @param none
 * @return none
 * @calls  none
 */
function displayMotivMsg (){
      var lastWeight = arrayOfEntryObjects[arrayOfEntryObjects.length-1].weight;
      var moreToLose = lastWeight - targetWeight;

      //display motivational quotes to lose weight/cheer up
      var equal = ['Yayy &#127930; &#127930; &#127930; You have reached the goal!', '&#127881; &#127881; &#127881; You did it!!!', '&#128077; You rock! &#10071;', 
            '&#127942; You made it! So proud of you. &#128079;', 'You made it happen &#128077; Keep it up!'];
      var less = ['You can set a new goal if you want &#128513;', '&#128175; Keep it up!', 'You are doing great &#128077;', '&#128170; You are strong &#10071;', 
            '&#127939; &#127939; &#127939; Let&#39;s get fit!'];
      var more = ['Excuses don&#39;t burn calories &#128581; &#9656;&#9656; ', 'Yesterday you said tomorrow! &#129324;&#129324;&#129324; &#9656;&#9656; ', 
            'Nothing tastes as good as being thin feels! &#128089; &#127940; &#9656;&#9656; ', 'Don&#39;t reward yourself with food. You are not a dog &#128544; &#9656;&#9656;',
            'Only you can change your life. No one can do it for you &#9656;&#9656; '];

      var randomNum = Math.floor(Math.random() *5); //to display a random quote the array

      if(moreToLose == 0) { //goal achieved
            $('#motiv-msg').html(equal[randomNum]);
      }else if (moreToLose<0){ //lost more than the set goal
            $('#motiv-msg').html(less[randomNum]);
      }else { //still needs to work towards the goal
            $('#motiv-msg').html(more[randomNum] + ' <span style="color: orangered">' +  (moreToLose.toFixed(1) + '</span> lbs left!'));
      }
      $('#motiv-msg').removeClass("hidden");
}




/*************************************************************************************************** 
 * deleteEntryFromTable - remove the TR with the indexNumToDelete from the weight table
 * @param indexNumToDelete
 * @returns none
 * @calls none
 */
function deleteEntryFromTable(indexNumToDelete){
      var tableRows = $('#weight-table').find('tr');
      tableRows[indexNumToDelete*2].remove();    
      tableRows[indexNumToDelete*2+1].remove();     
 
}



/*************************************************************************************************** 
 * handleDeleteEntry - gets called when the entry-deleteBtn is clicked and then finds the object to 
 * be deleted then once 'delete' button is clicked, removes entry from the global array and calls 
 * backend to delete data from the database.
 * @param none
 * @returns none
 * @calls showModal, hideModal, deleteDataFromServer
 */
function handleDeleteEntry () { //called when entry-deleteBtn was clicked
      showModal ('delete');
      var tr = event.currentTarget.closest("tr"); //finds the entry-deleteBtn 's closest <tr> that's the grandparent 
      var deleteEntryObj = {};

      deleteEntryObj.date = tr.children[0].innerText;
      var wt = (tr.children[1].innerText).split(' ');
      deleteEntryObj.weight = wt[0]; //weight without the string 'lbs' (wt[1] has "lbs")
      deleteEntryObj.note = tr.nextSibling.children[0].innerText;

      //unbind and then bind the cancel-delete-button to the function
      $('#cancel-delete-button').off('click').click(function(){
            hideModal ('delete');
      });

      //unbind and then bind the cfm-delete-entry-button to the function
      $('#cfm-delete-entry-button').off('click').click(function(){     
            //find index of the deleteObj in the array
            var i=0, notFound=true, indexNumToDelete;
            while(i < arrayOfEntryObjects.length && notFound){
                  if(arrayOfEntryObjects[i].date === deleteEntryObj.date &&
                     arrayOfEntryObjects[i].weight === deleteEntryObj.weight &&
                     arrayOfEntryObjects[i].note === deleteEntryObj.note)  {
                        indexNumToDelete = i;
                        notFound = false;
                  }else { 
                        i++;
                  }
            }
            //remove the entry from the global arrayOfEntryObjects
            arrayOfEntryObjects.splice(indexNumToDelete, 1); 

            hideModal ('delete');
            deleteDataFromServer (deleteEntryObj, indexNumToDelete);
      });
}



/*************************************************************************************************** 
 * handleEditEntry - gets called when the entry-editBtn is clicked and then finds the object to 
 * be edited then once 'update' button is clicked, updates the old entry with the new from the 
 * global array. Then calls handleUpdate function.
 * @param none
 * @returns none
 * @calls showModal, handleUpdate
 */
function handleEditEntry () {
      var editEntryObj = {};;
      var tr = event.currentTarget.closest("tr"); //finds the editEntry button's closest <tr> that's the grandparent 
      editEntryObj.date = tr.children[0].innerText;
      var wt = (tr.children[1].innerText).split(' ');
      editEntryObj.weight = wt[0]; //weight without the string 'lbs' (wt[1] has "lbs")
      editEntryObj.note = tr.nextSibling.children[0].innerText;

      showModal ('edit');

      //below displays the current data on modal to edit
      var dateField = document.querySelector('#updatedDate');
      dateField.value = editEntryObj.date;
      var weightField = document.querySelector('#updatedWeight');
      weightField.value = editEntryObj.weight;
      var noteField = document.querySelector('#updatedNote');
      noteField.value = editEntryObj.note;
      
      $('.update-button').off('click');
      $('.update-button').on('click', function(){
            handleUpdate(editEntryObj);

      });
}


/*************************************************************************************************** 
 * handleUpdate - finds the index number to edit, updates the global array, then calls backend
 * to update the database in the server. 
 * @param none
 * @returns none
 * @calls hideModal, updateDataInServer
 */
function handleUpdate(editEntryObj){
      var indexNumToUpdate = -1;
      var notFound = true, i = 0;

      while(notFound && i < arrayOfEntryObjects.length){
            //look for the entry to edit using the entryID
            if(arrayOfEntryObjects[i].date === editEntryObj.date &&
               arrayOfEntryObjects[i].weight === editEntryObj.weight &&
               arrayOfEntryObjects[i].note === editEntryObj.note){ 
                  indexNumToUpdate = i;
                  notFound = false; // =found it
            }else{
                  i++;
            }
      }

      if(indexNumToUpdate > -1){ //if entry trying to edit was found in the array
            var newUserEntryObj = {};
            newUserEntryObj.date = $('#updatedDate').val();
            newUserEntryObj.weight = $('#updatedWeight').val();
            newUserEntryObj.note = $('#updatedNote').val();
            arrayOfEntryObjects[indexNumToUpdate] = newUserEntryObj; //update the old with the new
            hideModal ('edit');
            updateDataInServer ( newUserEntryObj ); 
      }
}



function getDataFromServer() {
      var ajaxConfig = {
            data: JSON,
            method: 'post',
            url: 'dataApi/get_entries.php',
            dataType: 'json',
            data: {
                  browserID: localStorage.getItem('uniqueBrowserID'),
                  action: 'readAll'
            },
            success: function (serverResponse) {
                  if(serverResponse.success){ //if DB has some data in it
                        for (var i=0; i<serverResponse.data.length; i++) {
                              arrayOfEntryObjects[i] = {};
                              arrayOfEntryObjects[i].date = serverResponse.data[i].entryDate;
                              arrayOfEntryObjects[i].weight = serverResponse.data[i].entryWeight;
                              arrayOfEntryObjects[i].note = serverResponse.data[i].entryNote;
                        }
                        renderEntryOnDom();
                  }
            },
            error: function () {
                  errorMsg = 'There was an error getting data from the server.<br>Please try refreshing the page again.';
                  showModal('error');
            }
      }
      $.ajax(ajaxConfig);
}





/*************************************************************************************************** 
 * sendDataToServer - sends data to server and upon success, calls addEntry functions to add
 * @param userEntryObj
 * @returns none
 * @calls addEntry
 */
function sendDataToServer ( userEntryObj ) {
      var ajaxConfg = {
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
            success: function () {
                  addEntry(userEntryObj);
                  displayMotivMsg();
            },
            error: function () {
                  errorMsg = 'There is an error sending data to the server.<br>Please try again.';
                  showModal('error');
            }
      }
      $.ajax(ajaxConfg);
}



/*************************************************************************************************** 
 * updateDataInServer - sends updated data to server and then upon success, calls renderEntryOnDom 
 * functions to render updated data onto DOM.
 * @param newEntryObj
 * @returns none
 * @calls renderEntryOnDom
 */
function updateDataInServer ( newEntryObj ) {
      var ajaxConfig = {
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
            success: function () {
                  renderEntryOnDom();
                  displayMotivMsg();
            },
            error: function () {
                  errorMsg = 'There was an error making the update in the server.<br>Please try again.';
                  showModal('error');
            }
      }
      $.ajax(ajaxConfig);
}


/*************************************************************************************************** 
 * deleteDataFromServer - sends entry ID to delete to delete fro the database and then upon success,
 * calls deleteEntryFromTable functions to removed the deleted entry from DOM
 * @param entryIDToDelete, indexNumToDelete
 * @returns none
 * @calls deleteEntryFromTable
 */
function deleteDataFromServer ( deleteEntryObj, indexNumToDelete ) {
      var ajaxConfg = {
            data: JSON,
            method: 'post',
            url: 'dataApi/delete_entry.php',
            data: {
                  browserID: localStorage.getItem('uniqueBrowserID'),
                  entryDate: deleteEntryObj.date,
                  entryWeight: deleteEntryObj.weight,
                  entryNote: deleteEntryObj.note
            },
            success: function() {
                  deleteEntryFromTable(indexNumToDelete);
            },
            error: function() {
                  errorMsg = 'There was an error deleting the data.<br>Please try again.';
                  showModal('error');
            }
      }
      $.ajax(ajaxConfg);
}

/*************************************************************************************************** 
 * showModal - opens up modal based on the purpose 
 * @param purpose (goal weight input, edit entry, error, or delete)
 * @returns none
 * @calls none
 */
function showModal( purpose ){
      var modalToShow = '#' + purpose + 'Modal';
      $(modalToShow).modal('show');
      if(purpose == 'error'){
            $('#errorMsg').html(errorMsg);
      }

}


/*************************************************************************************************** 
 * hideModal - closes modal based on the purpose 
 * @param purpose (goal weight input, edit entry, error, or delete)
 * @returns none
 * @calls none
 */
function hideModal( purpose ){
      var modalToHide = '#' + purpose + 'Modal';
      $(modalToHide).modal('hide');
}