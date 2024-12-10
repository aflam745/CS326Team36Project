// import { BaseComponent } from "../BaseComponent/BaseComponent.js";
// import { EventHub } from "../../eventhub/EventHub.js";
// import { Events } from "../../eventhub/Events.js";
// import { ActivityDatabase } from "../../Models/ActivityDatabase.js";

// export class ActivityFormComponent extends BaseComponent {
//   /** @type HTMLDivElement | null */
//   #container = null;
//   #activityDB = null;

//   constructor() {
//     super();
//     this.loadCSS('ActivityFormComponent');
//     this.#activityDB = new ActivityDatabase('ActivityDB');
//   }

//   render() {
//     this.#createContainer();
//     this.#attachEventListeners();
//     return this.#container;
//   }

//   #createContainer() {
//     this.#container = document.createElement('div');
//     this.#container.classList.add('activity-form');
//     this.#container.innerHTML = this.#getTemplate();
//   }

// //   #getTemplate() {
// //     return `
// //       <form>
// //         <h2>Add New Activity</h2>

// //         <input type="hidden" id="id" name="id">

// //         <label for="specific-day">Must happen on specific day:</label>
// //         <select id="specific-day" name="specificDay">
// //           <option value="No">No</option>
// //           <option value="Yes">Yes</option>
// //         </select>
// //         <br>

// //         <div id="choose-day" style="display: none">
// //           <label for="day-selection">Select day:</label>
// //           <select id="day-selection" name="daySelection">
// //             <option value="Day 1">Day 1</option>
// //             <option value="Day 2">Day 2</option>
// //             <option value="Day 3">Day 3</option>
// //           </select>
// //           <br>
// //         </div>

// //         <label for="location">Name of location:</label>
// //         <input type="text" id="location" name="location" placeholder="Enter location" required>
// //         <br>

// //         <label for="address">Address:</label>
// //         <input type="text" id="address" name="address" required>
// //         <br>

// //         <label for="activity-type">Type of activity:</label>
// //         <select id="activity-type" name="activityType">
// //           <option value="Activity">Activity</option>
// //           <option value="Breakfast">Breakfast</option>
// //           <option value="Lunch">Lunch</option>
// //           <option value="Dinner">Dinner</option>
// //         </select>
// //         <br>

// //         <label for="duration">Duration:</label>
// //         <input type="time" id="duration" name="duration" class="time-input" required>
// //         <br>

// //         <label for="open-time">Opens at:</label>
// //         <input type="time" id="open-time" name="openTime" class="time-input">
// //         <label for="close-time">Closes at:</label>
// //         <input type="time" id="close-time" name="closeTime" class="time-input">
// //         <br>

// //         <label for="notes">Notes:</label>
// //         <textarea id="notes" name="notes"></textarea>
// //         <br>

// //         <button id="add-activity">Add Activity</button>
// //         <button id="clear">Clear</button>
// //       </form>
// //     `;
// //   }

// //   #attachEventListeners() {
// //     /** @type HTMLButtonElement */
// //     const clearActivityBtn = this.#container.querySelector('#clear');

// //     /** @type HTMLFormElement */
// //     const submissionForm = this.#container.querySelector('form')

// //     const specificDaySelector = this.#container.querySelector('#specific-day');
// //     const chooseDaySelector = this.#container.querySelector('#choose-day');

// //     specificDaySelector.addEventListener('change', (e) => {
// //       if(specificDaySelector.value === "Yes"){
// //         chooseDaySelector.style.display = "block";
// //       } else {
// //         chooseDaySelector.style.display = "none";
// //       }
// //     })

// //     clearActivityBtn.addEventListener('click', (e) => {
// //       e.preventDefault();
// //       this.#clearInputs();
// //     });

// //     submissionForm.addEventListener('submit', (e) => {
// //       e.preventDefault()
// //       const formData = new FormData(e.target)
// //       this.#handleAddActivity2(formData)
// //     })

// //     const hub = EventHub.getInstance();
// //     hub.subscribe('EditActivity', activityData => this.#fillFormEditActivity(activityData));
// //   }

//     #getTemplate() {
//         return `
//         <form>
//             <h2>Add New Activity</h2>
//             <input type="hidden" id="id" name="id">
//             <label for="time-options">When can this activity occur?</label>
//             <select id="time-options" name="timeOptions">
//                 <option value="specific-time">Specific Time</option>
//                 <option value="interval">During Interval</option>
//                 <option value="any-time">Any Time</option>
//             </select>
//             <br>

//             <div id="specific-time-container" style="display: none;">
//                 <label for="start-time">Start Time:</label>
//                 <input type="datetime-local" id="start-time" name="startTime" required>
//                 <label for="end-time">End Time:</label>
//                 <input type="datetime-local" id="end-time" name="endTime" required>
//                 <br>
//             </div>

//             <div id="interval-container" style="display: none;">
//                 <label for="interval-start">Interval Start:</label>
//                 <input type="datetime-local" id="interval-start" name="intervalStart" required>
//                 <label for="interval-end">Interval End:</label>
//                 <input type="datetime-local" id="interval-end" name="intervalEnd" required>
//                 <br>
//                 <label for="duration">Duration:</label>
//                 <input type="number" id="duration-hours" name="durationHours" min="0" placeholder="Hours">
//                 <input type="number" id="duration-minutes" name="durationMinutes" min="0" placeholder="Minutes">
//                 <br>
//             </div>

//             <div id="any-time-container" style="display: none;">
//                 <label for="duration">Duration:</label>
//                 <input type="number" id="duration-hours" name="durationHours" min="0" placeholder="Hours">
//                 <input type="number" id="duration-minutes" name="durationMinutes" min="0" placeholder="Minutes">
//                 <br>
//             </div>

//             <label for="location">Name of location:</label>
//             <input type="text" id="location" name="location" placeholder="Enter location" required>
//             <br>

//             <label for="address">Address:</label>
//             <input type="text" id="address" name="address" required>
//             <br>

//             <label for="activity-type">Type of activity:</label>
//             <select id="activity-type" name="activityType">
//                 <option value="Activity">Activity</option>
//                 <option value="Breakfast">Breakfast</option>
//                 <option value="Lunch">Lunch</option>
//                 <option value="Dinner">Dinner</option>
//             </select>
//             <br>

//             <label for="notes">Notes:</label>
//             <textarea id="notes" name="notes"></textarea>
//             <br>

//             <button id="add-activity">Add Activity</button>
//             <button id="clear">Clear</button>
//         </form>
//     `;
//     }

//     #attachEventListeners() {
//         const clearActivityBtn = this.#container.querySelector('#clear');
//         const submissionForm = this.#container.querySelector('form');
//         const timeOptionsSelector = this.#container.querySelector('#time-options');
//         const specificTimeContainer = this.#container.querySelector('#specific-time-container');
//         const intervalContainer = this.#container.querySelector('#interval-container');
//         const anyTimeContainer = this.#container.querySelector('#any-time-container');

//         const specificStartInput = this.#container.querySelector('#start-time');
//         const specificEndInput = this.#container.querySelector('#end-time');
//         const intervalStartInput = this.#container.querySelector('#interval-start');
//         const intervalEndInput = this.#container.querySelector('#interval-end');
//         const durationHoursInput = this.#container.querySelector('#duration-hours');
//         const durationMinutesInput = this.#container.querySelector('#duration-minutes');

//         const updateFieldRequirements = () => {
//             if (timeOptionsSelector.value === 'specific-time') {
//                 specificStartInput.required = true;
//                 specificEndInput.required = true;

//                 intervalStartInput.required = false;
//                 intervalEndInput.required = false;
//                 durationHoursInput.required = false;
//                 durationMinutesInput.required = false;
//             } else if (timeOptionsSelector.value === 'interval') {
//                 intervalStartInput.required = true;
//                 intervalEndInput.required = true;
//                 durationHoursInput.required = true;
//                 durationMinutesInput.required = true;

//                 specificStartInput.required = false;
//                 specificEndInput.required = false;
//             } else if (timeOptionsSelector.value === 'any-time') {
//                 // Only duration fields are required for any time
//                 durationHoursInput.required = true;
//                 durationMinutesInput.required = true;

//                 specificStartInput.required = false;
//                 specificEndInput.required = false;
//                 intervalStartInput.required = false;
//                 intervalEndInput.required = false;
//             }
//         };

//         const initializeVisibility = () => {
//             specificTimeContainer.style.display = timeOptionsSelector.value === 'specific-time' ? 'block' : 'none';
//             intervalContainer.style.display = timeOptionsSelector.value === 'interval' ? 'block' : 'none';
//             anyTimeContainer.style.display = timeOptionsSelector.value === 'any-time' ? 'block' : 'none';

//             updateFieldRequirements();
//         };

//         initializeVisibility();

//         timeOptionsSelector.addEventListener('change', initializeVisibility);

//         clearActivityBtn.addEventListener('click', (e) => {
//             e.preventDefault();
//             this.#clearInputs();
//         });

//         submissionForm.addEventListener('submit', (e) => {
//             e.preventDefault();
//             const formData = new FormData(e.target);

//             // Collect duration fields and merge into the formData object
//             formData.set('duration',
//                 (parseInt(durationHoursInput.value || 0) * 60) +
//                 parseInt(durationMinutesInput.value || 0) // Convert hours + minutes to total minutes
//             );

//             this.#handleAddActivity2(formData);
//         });

//         const hub = EventHub.getInstance();
//         hub.subscribe('EditActivity', (activityData) => this.#fillFormEditActivity(activityData));
//     }






//   /**
//     * @param {FormData} formData  - Data from the form in formData format
//     */
//   #handleAddActivity2(formData) {
//     console.log(Object.fromEntries(formData));
//     if(Object.fromEntries(formData).id.length > 0){
//       this.#publishEditActivity(Object.fromEntries(formData));
//       this.#changeSubmitTextToAdd();
//     } else {
//       const currentTime = new Date().toLocaleTimeString();
//       const randThreeDigitInt = (Math.floor((Math.random() * 900) + 100)).toString();
//       const id = currentTime + "_" + randThreeDigitInt;
//       const activityId = { id: id.replace(/[\s:]/g, '_') }

//       this.#publishNewActivity2({
//         ...Object.fromEntries(formData),
//         ...activityId,
//       });
//     }

//     this.#clearInputs();
//   }

//   #publishEditActivity(data){
//     const hub = EventHub.getInstance();
//     hub.publish(Events.SubmitEditActivity, data);

//     this.#activityDB.deleteActivity(data.id)
//       .then((message) => {
//         console.log(message);
//       })
//       .catch((error) => {
//         console.error("Failed to delete activity from ActivityDB:", error);
//       });

//     this.#activityDB.addActivity(data)
//       .then((message) => {
//         console.log(message);
//       })
//       .catch((error) => {
//         console.error("Failed to add activity to ActivityDB:", error);
//       });
//   }

//   /**
//     * @param {Object} data
//     */
//   #publishNewActivity2(data) {
//     const hub = EventHub.getInstance();
//     hub.publish(Events.NewActivity, data);
//     hub.publish(Events.StoreActivity, data);

//     this.#activityDB.addActivity(data)
//       .then((message) => {
//         console.log(message);
//       })
//       .catch((error) => {
//         console.error("Failed to add activity to IndexedDB:", error);
//       });
//   }

//   // Clears the form
// //   #clearInputs() {
// //     this.#container.querySelector('form')?.reset();
// //     const chooseDaySelector = this.#container.querySelector('#choose-day');
// //     const idHiddenElement = this.#container.querySelector('#id');
// //     idHiddenElement.value = "";
// //     chooseDaySelector.style.display = "none";
// //   }

//     #clearInputs() {
//         const submissionForm = this.#container.querySelector('form');
//         const timeOptionsSelector = this.#container.querySelector('#time-options');
//         const specificTimeContainer = this.#container.querySelector('#specific-time-container');
//         const intervalContainer = this.#container.querySelector('#interval-container');
//         const anyTimeContainer = this.#container.querySelector('#any-time-container');

//         const specificStartInput = this.#container.querySelector('#start-time');
//         const specificEndInput = this.#container.querySelector('#end-time');
//         const intervalStartInput = this.#container.querySelector('#interval-start');
//         const intervalEndInput = this.#container.querySelector('#interval-end');
//         const durationHoursInput = this.#container.querySelector('#duration-hours');
//         const durationMinutesInput = this.#container.querySelector('#duration-minutes');

//         // Reset the form's input fields
//         submissionForm.reset();

//         // Reset the visibility of containers
//         specificTimeContainer.style.display = 'none';
//         intervalContainer.style.display = 'none';
//         anyTimeContainer.style.display = 'none';

//         // Reset dropdown to default option
//         timeOptionsSelector.value = 'specific-time'; // Adjust based on your default

//         // Reset required attributes
//         specificStartInput.required = true;
//         specificEndInput.required = true;
//         intervalStartInput.required = false;
//         intervalEndInput.required = false;
//         durationHoursInput.required = false;
//         durationMinutesInput.required = false;

//         // Re-attach any listeners or state updates needed
//         this.#attachEventListeners();
//     }



//   /*
//     * @param {Object} activityData
//     * Sets the values on the form based on the values present in the activityData object
//     */
//   #fillFormEditActivity(activityData) {
//     const data = activityData.activityData;

//     for (let [key, val] of Object.entries(data)) {
//       // This query searches for either an input, select, or textarea and then sets the value based on the in activityData
//       const query = `:is(input[name="${key}"], select[name="${key}"], textarea[name="${key}"])`
//       const input = this.#container.querySelector(query)
//       if(input !== null){
//         input.value = val
//       }
//     }

//     this.#changeSubmitTextToEdit();
//   }

//   #changeSubmitTextToEdit(){
//     const submitButton = this.#container.querySelector('#add-activity');

//     submitButton.innerText = "Edit Activity";
//   }

//   #changeSubmitTextToAdd(){
//     const submitButton = this.#container.querySelector('#add-activity');

//     submitButton.innerText = "Add Activity";
//   }
// }

import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { EventHub } from "../../eventhub/EventHub.js";
import { Events } from "../../eventhub/Events.js";
import { ActivityDatabase } from "../../Models/ActivityDatabase.js";
import LocationSearchComponent from "../LocationSearchComponent/LocationSearchComponent.js";

export class ActivityFormComponent extends BaseComponent {
    /** @type HTMLDivElement | null */
    #container = null;
    #activityDB = null;
    #locationSearchComponent = null;

    constructor() {
        super();
        this.loadCSS('ActivityFormComponent');
        this.#activityDB = new ActivityDatabase('ActivityDB');
    }

    render() {
        this.#createContainer();
        this.#attachEventListeners();
        return this.#container;
    }

    #createContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('activity-form');
        this.#container.innerHTML = this.#getTemplate();

        // Initialize LocationSearchComponent
        const locationSearchContainer = this.#container.querySelector('#location-search-container');
        const locationSearchComponent = new LocationSearchComponent();
        locationSearchContainer.appendChild(locationSearchComponent.render());
        this.#locationSearchComponent = locationSearchComponent; // Store reference for later use
    }


    //   <label for="address">Address:</label>
    //   <input type="text" id="address" name="address" required>
    //   <br>

    #getTemplate() {
        return `
        <form>
            <h2>Add New Activity</h2>

            <input type="hidden" id="id" name="id">

            <label for="name">Activity name:</label>
            <input type="text" id="name" name="name" placeholder="Enter activity name" required>
            <br>

            <label for="start-time">Earliest start time:</label>
            <input type="datetime-local" id="start-time" name="earliestStartTime">
            <br>
            <label for="end-time">Latest finish time:</label>
            <input type="datetime-local" id="end-time" name="latestEndTime">
            <br>

            <label for="duration-hours">Duration:</label>
            <input type="number" id="duration-hours" name="durationHours" placeholder="Hours" min="0" required><a>h</a>
            <input type="number" id="duration-minutes" name="durationMinutes" placeholder="Minutes" min="0" max="59" required><a>m</a>
            <button type="button" id="set-full-duration">Activity spans the full time interval</button>
            <br>

            <label for="location-search">Address:</label>
            <div id="location-search-container"></div>
            <br>

            <label for="activity-type">Type of activity:</label>
            <select id="activity-type" name="activityType">
                <option value="Activity">Activity</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
            </select>
            <br>

            <label for="notes">Notes:</label>
            <textarea id="notes" name="notes"></textarea>
            <br>

            <button id="add-activity">Add Activity</button>
            <button id="clear">Clear</button>
        </form>
  `;
    }


    #attachEventListeners() {
        const clearActivityBtn = this.#container.querySelector('#clear');
        const submissionForm = this.#container.querySelector('form');
        const setFullDurationBtn = this.#container.querySelector('#set-full-duration');
        const startTimeInput = this.#container.querySelector('#start-time');
        const endTimeInput = this.#container.querySelector('#end-time');
        const durationHoursInput = this.#container.querySelector('#duration-hours');
        const durationMinutesInput = this.#container.querySelector('#duration-minutes');

        clearActivityBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.#clearInputs();
        });

        function validateTimes(startTime, endTime) {
            if (!startTime || !endTime || endTime <= startTime) {
                alert("Please enter a valid start and end time first.");
                return false;
            }
            return true;
        }

        submissionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const startTime = new Date(startTimeInput.value);
            const endTime = new Date(endTimeInput.value);
            if (!validateTimes(startTime, endTime)) return;
            const formData = new FormData(e.target);
            console.log(Object.fromEntries(formData));
            this.#handleAddActivity2(formData);
        });

        setFullDurationBtn.addEventListener('click', () => {
            const startTime = new Date(startTimeInput.value);
            const endTime = new Date(endTimeInput.value);
            if (!validateTimes(startTime, endTime)) return;

            const durationMs = endTime - startTime;
            const durationHours = Math.floor(durationMs / 3600000); // Hours
            const durationMinutes = Math.floor((durationMs % 3600000) / 60000); // Remaining minutes

            durationHoursInput.value = durationHours;
            durationMinutesInput.value = durationMinutes;
        });

        const hub = EventHub.getInstance();
        hub.subscribe('EditActivity', (activityData) => this.#fillFormEditActivity(activityData));
    }


    /**
      * @param {FormData} formData  - Data from the form in formData format
      */
    #handleAddActivity2(formData) {

        // Retrieve location from LocationSearchComponent
        const location = this.#locationSearchComponent.getLocation();
        if (!location) {
            alert('Please provide a valid location.');
            return;
        }

        formData.set('lon', location.lon); // Add location to the form data
        formData.set('lat', location.lat); // Add location to the form data
        formData.set('address', location.address); // Add location to the form data

        if (Object.fromEntries(formData).id.length > 0) {
            this.#publishEditActivity(Object.fromEntries(formData));
            this.#changeSubmitTextToAdd();
        } else {
            const currentTime = Date.now();
            const randThreeDigitInt = (Math.floor((Math.random() * 900) + 100)).toString();
            const id = currentTime + randThreeDigitInt;
            const activityId = { id: id };

            this.#publishNewActivity2({
                ...Object.fromEntries(formData),
                ...activityId,
            });
        }

        this.#clearInputs();
    }


    #publishEditActivity(data) {
        const hub = EventHub.getInstance();
        hub.publish(Events.SubmitEditActivity, data);

        this.#activityDB.deleteActivity(data.id)
            .then((message) => {
                console.log(message);
            })
            .catch((error) => {
                console.error("Failed to delete activity from ActivityDB:", error);
            });

        this.#activityDB.addActivity(data)
            .then((message) => {
                console.log(message);
            })
            .catch((error) => {
                console.error("Failed to add activity to ActivityDB:", error);
            });
    }

    /**
      * @param {Object} data
      */
    #publishNewActivity2(data) {
        const hub = EventHub.getInstance();
        hub.publish(Events.NewActivity, data);
        hub.publish(Events.StoreActivity, data);

        this.#activityDB.addActivity(data)
            .then((message) => {
                console.log(message);
            })
            .catch((error) => {
                console.error("Failed to add activity to IndexedDB:", error);
            });
    }

    // Clears the form
    #clearInputs() {
        this.#container.querySelector('form')?.reset();
        const idHiddenElement = this.#container.querySelector('#id');
        idHiddenElement.value = "";

        // Clear LocationSearchComponent
        if (this.#locationSearchComponent) {
            this.#locationSearchComponent.resetEntry();
        }
    }


    /**
      * @param {Object} activityData
      * Sets the values on the form based on the values present in the activityData object
      */
    #fillFormEditActivity(activityData) {
        const data = activityData.activityData;

        for (let [key, val] of Object.entries(data)) {

            if (key === "address") {
                const addressInput = document.getElementById('searchInput');
                if (addressInput) {
                    // edit the address search bar
                    EventHub.getInstance().publish(Events.EditAddress, {
                        lon: data.lon,
                        lat: data.lat,
                        address: data.address
                    });
                }
            }

            const query = `:is(input[name="${key}"], select[name="${key}"], textarea[name="${key}"])`;
            const input = this.#container.querySelector(query);

            if (input !== null) {
                // Format datetime-local inputs
                if (input.type === 'datetime-local') {
                    if (val) {
                        const date = new Date(val);
                        // format to "YYYY-MM-DDTHH:MM"
                        input.value = date.toISOString().slice(0, 16);
                    } else {
                        // clear field if no value
                        input.value = '';
                    }
                } else {
                    // set other fields normally
                    input.value = val;
                }
            }
        }



        // Set duration if it is provided as hours and minutes
        if ('durationHours' in data && 'durationMinutes' in data) {
            const hoursInput = this.#container.querySelector('input[name="durationHours"]');
            const minutesInput = this.#container.querySelector('input[name="durationMinutes"]');

            if (hoursInput) hoursInput.value = data.durationHours || 0;
            if (minutesInput) minutesInput.value = data.durationMinutes || 0;
        }

        // Update the button text to indicate edit mode
        this.#changeSubmitTextToEdit();
    }

    #changeSubmitTextToEdit() {
        const submitButton = this.#container.querySelector('#add-activity');

        submitButton.innerText = "Edit Activity";
    }

    #changeSubmitTextToAdd() {
        const submitButton = this.#container.querySelector('#add-activity');

        submitButton.innerText = "Add Activity";
    }
}
