import { BaseComponent } from "../BaseComponent/BaseComponent.js";
import ItineraryHeaderComponent from "../ItineraryHeaderComponent/ItineraryHeaderComponent.js";
import { MapComponent } from "../ItineraryMapComponent/ItineraryMapComponent.js";
import { EventHub } from "../../eventhub/EventHub.js";
import { Events } from "../../eventhub/Events.js";

export default class ItineraryPage extends BaseComponent {
    #container = null;
    #selectedDay = 1;
    constructor() {

    }

    #initContainer() {
        this.#container = document.createElement('div');
        this.#container.classList.add('itinerary-page');
        this.#container.id = 'itineraryPage';
    }

    #loadHeader() {
        const itineraryHeaderComponent = new ItineraryHeaderComponent();
        this.#container.appendChild(itineraryHeaderComponent);
    }

    #loadMap() {
        const mapComponent = new MapComponent();
        this.#container.appendChild(mapComponent);
    }

    #loadActivityList() {
        const activityListComponent = new ItineraryActivityListComponent();
        this.#container.appendChild(activityListComponent);
    }

    #attachEventListeners() {
        EventHub.getInstance().subscribe(Events.ChangeDay, day => this.#changeDay(day))
    }

    #changeDay(day) {
        this.#selectedDay = day;
    }

    render() {
        this.#initContainer();
        this.#attachEventListeners();
        this.#loadHeader();
        this.#loadMap();
        this.#loadActivityList();
        return this.#container;
    }
}