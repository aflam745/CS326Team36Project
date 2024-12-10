import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import LocationSearchComponent from "../LocationSearchComponent/LocationSearchComponent.js";


export class ItineraryFormComponent extends BaseComponent {
#container = null;
#startLocationEntry;
#endLocationEntry;

  constructor() {
    super();
    this.loadCSS('ItineraryFormComponent');
    this.#startLocationEntry = new LocationSearchComponent();
    this.#endLocationEntry = new LocationSearchComponent();
  }

  render() {
    this.#createContainer();
    this.#attachEventListeners();
    return this.#container;
  }

  getLocationEntries() {
    return { startLocationEntry: this.#startLocationEntry.getLocation(), endLocationEntry: this.#endLocationEntry.getLocation() }
  }

  #createContainer() {
    this.#container = document.createElement('div');
    this.#container.classList.add('itinerary-form');
    this.#container.innerHTML = this.#getTemplate();

    this.#container.querySelector('#start-location-container').appendChild(this.#startLocationEntry.render());
    this.#container.querySelector('#end-location-container').appendChild(this.#endLocationEntry.render());

  }

  #attachEventListeners(){
    const closeButton = this.#container.querySelector('#close-form');

    closeButton.addEventListener('click', () => {
      this.#container.remove();
    })
  }

  #getTemplate() {
    return `
      <div class="form-container" id="itinerary-form-container">

        <button class="close-button" id="close-form" aria-label="Close form">&times;</button>

        <form>
          <h2>Create New Itinerary</h2>

          <label for="location">Name of Trip:</label>
          <input type="text" id="location" name="location" placeholder="Enter name" required>

          <label for="picture">Insert Picture:</label>
          <input type="file" id="picture" name="picture" accept="image/*">

          <label for="start-location-container">Enter start location</label>
          <div id="start-location-container">
            <!-- Start location input can be added here -->
          </div>

          <label for="end-location-container">Enter end location</label>
          <div id="end-location-container">
            <!-- End location input can be added here -->
          </div>

          <label for="start-date">Start Date & Time:</label>
          <input type="datetime-local" id="start-date" name="startDate" required>

          <label for="end-date">End Date & Time:</label>
          <input type="datetime-local" id="end-date" name="endDate" required>

          <label for="description">Description:</label>
          <textarea id="description" name="description" rows="4" cols="30" placeholder="Add a description..."></textarea>

          <button id="add-itinerary" type="submit">Create Itinerary</button>
          <button id="clear" type="reset">Clear</button>
        </form>
      </div>
    `;
  }
}
