import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import { ItineraryFormComponent } from "../ItineraryFormComponent/ItineraryFormComponent.js";
import { constructURLFromPath, navigate, serializeQueryParams } from "../../lib/router.js";
import { ActivityDatabase } from "../../Models/ActivityDatabase.js";
import Itinerary from "../../Models/Itinerary.js";

export class HomePageComponent extends BaseComponent {
  #container = null;
  #formComponent = null;
  #itineraryDB = null;

  constructor() {
    super();
    this.loadCSS("HomePageComponent");
    this.#formComponent = new ItineraryFormComponent();
    this.#itineraryDB = new ActivityDatabase('ItineraryDB');
  }

  render() {
    this.#createContainer();
    this.#fetchAndDisplayItineraries();
    return this.#container;
  }

  #createContainer() {
    this.#container = document.createElement("div");
    this.#container.classList.add("container");

    // Add the "plus" tile
    const addTile = document.createElement("div");
    addTile.classList.add("tile", "plus-tile");
    addTile.textContent = "+";
    addTile.onclick = () => this.#showForm();
    this.#container.appendChild(addTile);
  }

  #showForm() {
    // Remove any existing form
    const existingForm = this.#container.querySelector(".itinerary-form");
    if (existingForm) existingForm.remove();

    // Render and append the form component to the container
    const formElement = this.#formComponent.render();
    this.#container.appendChild(formElement);
    formElement.querySelector('dialog').showModal()

    // Attach event listener to the form submission
    formElement.querySelector("form").onsubmit = async (event) => {
      event.preventDefault(); // Prevent default form submission behavior

      const fd = new FormData(event.target)
      const locationEntries = this.#formComponent.getLocationEntries();

      const obj = Object.fromEntries(fd);
      obj["startLocation"] = locationEntries.startLocationEntry;
      obj["endLocation"] = locationEntries.endLocationEntry;

      const currentTime = Date.now();
      const randThreeDigitInt = (Math.floor((Math.random() * 900) + 100)).toString();
      const id = currentTime + randThreeDigitInt;
      const itineraryId = { id: id };

      obj["id"] = id;

      this.#addItineraryToIndexedDB({
        ...obj,
        ...itineraryId,
      });


      await Itinerary.saveItinerary(obj);
      this.#addItineraryTile(formElement.querySelector("#location").value);

      // Remove the form
      formElement.remove();

      const serializedParams = serializeQueryParams(itineraryId);
      const url = constructURLFromPath('/editItinerary', serializedParams);
      navigate(url);
    };
  }

  #addItineraryToIndexedDB(formData){
    this.#itineraryDB.addActivity(formData)
      .then((message) => {
        console.log(message);
      })
      .catch((error) => {
        console.error("Failed to add activity to ActivityDB:", error);
      });
  }

  #addItineraryTile(title) {
    // Create a new tile
    const newTile = document.createElement("div");
    newTile.classList.add("tile");
    newTile.textContent = title;

    // // Add navigation functionality to the tile
    // newTile.onclick = () => {
    //   // Update the URL without reloading the page
    //   const pageURL = `/activity/${encodeURIComponent(title)}`;
    //   history.pushState({}, "", pageURL);

    //   // Let the RouterComponent handle rendering the new page
    //   dispatchEvent(new PopStateEvent("popstate"));
    // };

    // Append the new tile to the container
    this.#container.appendChild(newTile);
  }

  async #fetchAndDisplayItineraries() {
    try {
      const itineraries = await this.#itineraryDB.getAllActivity();
      itineraries.forEach(data => {
        this.#addItineraryTile(data.location)
      });
    } catch (error) {
      console.error('failed to fetch itineraries from ItineraryDB:', error);
    }
  }
}
