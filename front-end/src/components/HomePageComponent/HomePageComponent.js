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
    this.#loadFontAwesome();
    this.#formComponent = new ItineraryFormComponent();
    this.#itineraryDB = new ActivityDatabase('ItineraryDB');
  }

  #loadFontAwesome() {
    if (document.querySelector('link[href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"]')) {
      // Font Awesome is already loaded
      return;
    }

    const faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    faLink.integrity = 'sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==';
    faLink.crossOrigin = 'anonymous';
    faLink.referrerPolicy = 'no-referrer';
    document.head.appendChild(faLink);
  }

  render() {
    this.#createContainer();
    this.#fetchAndDisplayItineraries();
    return this.#container;
  }

#createContainer() {
    this.#container = document.createElement("div");
    this.#container.classList.add("container");

    this.#addGoogleSignInButton();

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

      this.#addItineraryTile(formElement.querySelector("#location").value, itineraryId);


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

  #addItineraryTile(title, id) {
    // Create a new tile
    const newTile = document.createElement("div");
    newTile.classList.add("tile", "itineraryTile")

    const headerElement = document.createElement("h2");
    headerElement.classList.add("tileHeader");
    headerElement.innerHTML = title;

    const buttonGroup = document.createElement("div");
    buttonGroup.classList.add("buttonGroup");

    const deleteButton = document.createElement("button");
    deleteButton.id = "deleteItinerary";
    deleteButton.classList.add("icon-button");

    const iconElement = document.createElement("i");
    iconElement.classList.add("fas");
    iconElement.classList.add("fa-trash-alt");

    const hiddenIdField = document.createElement("input");
    hiddenIdField.type = "hidden";
    hiddenIdField.id = "itineraryID";
    hiddenIdField.value = id;

    deleteButton.appendChild(iconElement);

    buttonGroup.appendChild(deleteButton);

    newTile.appendChild(headerElement);
    newTile.appendChild(buttonGroup);
    newTile.appendChild(hiddenIdField);

    deleteButton.onclick = async (e) => {
      this.#itineraryDB.deleteActivity(id)
      .then((message) => {
        console.log(message);
      })
      .catch((error) => {
        console.error("Failed to delete itinerary from ItineraryDB:", error);
      });

      e.stopPropagation();

      newTile.remove();

      //Delete itinerary from database
      const res = await fetch(`http://localhost:4000/deleteItinerary/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) console.error("Failed to delete itinerary from database.");
    }

    // Add navigation functionality to the tile
      newTile.onclick = () => {
        const itineraryId = { id: id }
        const serializedParams = serializeQueryParams(itineraryId);
        const url = constructURLFromPath('/itinerary', serializedParams);

        navigate(url);
      };

    // Append the new tile to the container
    this.#container.appendChild(newTile);
  }

  async #fetchAndDisplayItineraries() {
    try {
      const itineraries = await this.#itineraryDB.getAllActivity();
      itineraries.forEach(data => {
        this.#addItineraryTile(data.location, data.id)
      });
    } catch (error) {
      console.error('failed to fetch itineraries from ItineraryDB:', error);
    }
  }
    #addGoogleSignInButton() {
    // Create the div to hold the Google Sign-In button
    const buttonDiv = document.createElement("div");
    buttonDiv.id = "buttonDiv"; // This is where the Google button will be rendered
    this.#container.appendChild(buttonDiv);

    // Load the Google Sign-In button script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      // Initialize Google Sign-In after the script is loaded
      google.accounts.id.initialize({
        client_id: "418418924635-kjfhcv4k4q69e7enevjtoimpert3kt9f.apps.googleusercontent.com",
        callback: this.#handleCredentialResponse
      });

      google.accounts.id.renderButton(
        document.getElementById("buttonDiv"),
        {
          theme: "outline", // Customization attributes
          size: "large",
          type: "standard" 
        }
      );

      google.accounts.id.prompt(); // Show the One Tap prompt (optional)
    };
    // Append the script to load the Google Sign-In client
    document.body.appendChild(script);

    // Style the button container to position it in the top-right
    buttonDiv.style.position = "absolute";
    buttonDiv.style.top = "10px";
    buttonDiv.style.right = "10px";
  }

  // Handle the response from Google Sign-In
#handleCredentialResponse(response) {
  const id_token = response.credential;  // The JWT ID token received from Google

  // Send the token to the server for verification and authentication
  fetch('http://localhost:4000/auth/google/callback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id_token }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('User authenticated successfully:', data.user);
      // Redirect or update UI based on successful authentication
    } else {
      console.error('Authentication failed:', data.message);
    }
  })
  .catch(error => {
    console.error('Error during authentication:', error);
  });
}
}
