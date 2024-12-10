import Activity from "./Activity.js";
import { EventHub } from "../eventhub/EventHub.js"
import { Events } from "../eventhub/Events.js"
import { convertDateToUnixTimestamp, convertHoursAndMinsToSeconds } from "../utils/TimeConversions.js";
import { ActivityDatabase } from "./ActivityDatabase.js";

export default class Itinerary {
    static #instance = null;
    constructor(id, tripName, startDate, endDate, startLocation, endLocation, transportation, description, image) {
        this.id = id;
        this.tripName = tripName;
        this.startDate = startDate; // earliest time activities can be scheduled
        this.endDate = endDate; // latest time activities can be scheduled
        this.startLocation = startLocation;
        this.endLocation = endLocation;
        this.transportation = transportation;
        this.description = description;
        this.image = image;

        this.activities = new Map(); // scheduled activities in the itinerary, mapped by ID

        this.stagedActivities = new Map(); // all activities including ones not yet optimized, mapped by ID
        // value field uses descriptors 'Added', 'Updated', 'Deleted', and 'none' to represent modification made (if any)

        this.subscribeToEvents();
    }

    /** @return {Itinerary | null} */
    static getInstance() {
        return Itinerary.#instance;
    }

    subscribeToEvents() {
        // const hub = EventHub.getInstance();

        // hub.subscribe(Events.NewActivity, activityData => {
        //     this.addActivity(...activityData);
        // });

        // hub.subscribe(Events.DeleteActivity, activityId => {
        //     this.deleteActivity(activityId);
        // });

        // hub.subscribe(Events.EditActivity, activityData => {
        //     this.updateActivity(activityData.id, ...activityData);
        // });
    }



    /**
     * Creates a new itinerary from scratch and adds the itinerary to the DB.
     * @param {*} tripName name of the trip
     * @param {*} startDate start date of the trip
     * @param {*} endDate end date of the trip
     * @param {*} startLocation start location of the trip
     * @param {*} endLocation end location of the trip
     * @param {*} description optional description of the trip
     * @param {*} image optional image to display with the trip
     * @returns an Itinerary instance
     */
    static async createNewItinerary(id, tripName, startDate, endDate, startLocation, endLocation, transportation, description, image) {
        // const id = Date.now() + Math.floor(Math.random() * 1000);
        const res = await fetch("/createItinerary", {
            method: 'POST',
            body: JSON.stringify({
                id,
                tripName,
                startDate,
                endDate,
                startLocation,
                endLocation,
                transportation,
                description,
                image
            })
        });
        if (!res.ok) console.error("Failed to save itinerary to database.");

        return Itinerary.#instance = new Itinerary(id, tripName, startDate, endDate, startLocation, endLocation, transportation, description, image);
    }

    /**
     * Loads an existing itinerary from the DB.
     * @param {*} id the ID of the itinerary
     * @returns an Itinerary instance
     */
    static async loadItineraryFromDB(id) {
        const res = await fetch("/loadItinerary", {
            method: 'GET',
            body: JSON.stringify(id)
        });
        if (!res.ok) console.error("Failed to load itinerary from database.");

        const data = await res.json();
        Itinerary.#instance = new Itinerary(
            data.id,
            data.tripName,
            data.startDate,
            data.endDate,
            data.startLocation,
            data.endLocation,
            data.transportation,
            data.description,
            data.image);
        data.activities.forEach(a => { // assume 'a' already in the format needed to create an Activity instance
            const newActivity = new Activity(a);
            const newStagedActivity = newActivity.clone(); // create a clone so the staged version doesn't modify the original
            Itinerary.#instance.activities.set(a.id, newActivity);
            Itinerary.#instance.stagedActivities.set(a.id, { change: 'none', newStagedActivity })
        });

        return Itinerary.#instance;
    }

    addActivity(
        name,
        isHotelStay,
        location,
        duration,
        timeframes,
        notes
    ) {
        const newActivity = new Activity({
            name,
            isHotelStay,
            location,
            duration,
            timeframes,
            notes
        });

        this.stagedActivities.set(newActivity.id, { change: 'Added', activity: newActivity });
    }

    deleteActivity(activityId) {
        // do not immediately delete but rather mark as 'Deleted' so we can actually delete it once we run the optimization
        this.stagedActivities.set(
            activityId,
            {
                change: 'Deleted',
                activity: this.stagedActivities.get(activityId).activity
            }
        );
    }

    updateActivity(activityId, args) {
        const activityToUpdate = this.stagedActivities.get(activityId).activity;
        Object.keys(args).forEach(key => {
            if (activityToUpdate.has(key)) {
                activityToUpdate.set(key, args[key])
            }
        });
        this.stagedActivities.set(
            activityId,
            {
                change: 'Updated',
                activity: activityToUpdate
            }
        );
    }

    static #getTransportationType = transportation => {
        switch (transportation) {
            case "Walking":
                return "foot-walking";
            case "Driving":
                return "driving-road";
            case "Biking":
                return "cycling-road";
            default:
                throw new Error("Invalid transportation type: ", transportation);
        }
    }

    static async getDirections(transportation, activities) {
        const req = {
            transportation: this.#getTransportationType(transportation),
            coordinates: activities.map(activity => [activity.lon, activity.lat])
        }

        const res = await fetch('http://localhost:4000/getDirections', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req)
        });

        return await res.json();
    }

    // async optimizeRoute() {

    //     // filter out any activities that have been deleted and then get the raw activity
    //     const activitiesToOptimize = Array.from(this.stagedActivities.values()).filter(a => a.change !== 'Deleted').map(a => a.activity);

    //     if (activitiesToOptimize.length >= 50) throw new Error("Too many activities!");

    //     tripStartLocation = this.startLocation;
    //     tripEndLocation = this.endLocation;

    //     tripStartTime = convertDateToUnixTimestamp(this.startDate);
    //     tripEndTime = convertDateToUnixTimestamp(this.endDate);

    //     const vehicle = {
    //         id: 1,
    //         profile: this.#getTransportationType(this.transportation),
    //         start: [tripStartLocation.lon, tripStartLocation.lat],
    //         end: [tripEndLocation.lon, tripEndLocation.lat],
    //         time_window: [tripStartTime, tripEndTime]
    //     };

    //     const jobs = [];

    //     // Iterate through each activity and structure it as an ORS "job"
    //     activitiesToOptimize.forEach(activity => {
    //         const job = {
    //             id: activity.id,
    //             location: [activity.location.lon, activity.location.lat],
    //             service: activity.duration
    //         };
    //         if (activity.timeframes.length > 0) {
    //             job.time_windows = activity.timeframes
    //                 .map(timeframe => timeframe
    //                     .map(time => convertDateToUnixTimestamp(time)));
    //         }
    //         jobs.push(job);
    //     });

    //     const req =
    //     {
    //         "jobs": jobs,
    //         "shipments": [],
    //         "vehicles": [vehicle],
    //         "options": {
    //             "g": true
    //         }
    //     }

    //     const response = await fetch('http://localhost:4000/optimize', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(req)
    //     });

    //     const data = await response.json();

    //     if (data["unassigned"] && data["unassigned"].length > 0) {
    //         throw new Error("Unable to optimize your itinerary. Try removing activities or adjusting their timings.")
    //     }

    //     const getActivityById = id => this.stagedActivities.get(id);

    //     const trip = data.routes[0];
    //     const steps = trip.steps;

    //     steps.forEach(step => {
    //         const { id, arrival, service, waiting_time: waitingTime } = step;

    //         const stagedActivity = getActivityById(id);
    //         const activity = stagedActivity.activity;

    //         const unixStartTime = arrival + waitingTime;
    //         const unixFinishTime = arrival + waitingTime + service;

    //         activity.startTime = new Date(unixStartTime);
    //         activity.finishTime = new Date(unixFinishTime);

    //         // Helper to calculate the day number relative to startDate
    //         const calculateDayNumber = timestamp => {
    //             const startDateUnix = convertDateToUnixTimestamp(this.startDate);
    //             return Math.floor((timestamp - startDateUnix) / 86400) + 1;
    //         };

    //         const startDay = calculateDayNumber(activity.startTime);
    //         const endDay = calculateDayNumber(activity.finishTime);

    //         activity.day = [startDay];

    //         // if it straddles midnight, also assign it to the next day
    //         if (endDay > startDay) {
    //             activity.day.push(endDay);
    //         }
    //     });

    // }

    acceptOptimizedItinerary() {
        const newActivities = new Map();
        this.activities = this.stagedActivities.forEach((a, _) => {
            const activity = a.activity;
            const activityClone = activity.clone();
            this.newActivies.set(activityClone.id, activityClone);
        })
        this.activities = newActivities;
    }

    declineOptimizedItinerary() { }






    static async optimizeRoute() {
        const activityDatabase = new ActivityDatabase('ActivityDB');
        const itineraryDatabase = new ActivityDatabase('ItineraryDB');

        const activities = activityDatabase.getAllActivity();
        const itinerary = itineraryDatabase.getItinerary();

        if (activities.length >= 50) {
            alert("Too many activities!");
            return;
        }

        tripStartLocation = itinerary.startLocation;
        tripEndLocation = itinerary.endLocation;

        tripStartTime = convertDateToUnixTimestamp(new Date(itinerary.startDate));
        tripEndTime = convertDateToUnixTimestamp(new Date(itinerary.endDate));

        const vehicle = {
            id: 1,
            profile: this.#getTransportationType(itinerary.transportation),
            start: [tripStartLocation.lon, tripStartLocation.lat],
            end: [tripEndLocation.lon, tripEndLocation.lat],
            time_window: [tripStartTime, tripEndTime]
        };

        const jobs = [];

        activities.forEach(activity => {
            const job = {
                id: activity.id,
                location: [activity.lon, activity.lat],
                service: convertHoursAndMinsToSeconds(activity.durationHours, activity.durationMinutes)
            };

            if (activity.earliestStartTime && activity.latestEndTime) {
                // assign the time_windows to an array of 1 window given by the earliest/latest start/end times
                job.time_windows = [
                    [
                        convertDateToUnixTimestamp(new Date(activity.earliestStartTime)), 
                        convertDateToUnixTimestamp(new Date(activity.latestEndTime))
                    ]
                ]
            }
            jobs.push(job);
        });

        const req =
        {
            "jobs": jobs,
            "shipments": [],
            "vehicles": [vehicle],
            "options": {
                "g": true
            }
        }

        console.log("Optimizing with request", req)

        const response = await fetch('http://localhost:4000/optimize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req)
        });

        const data = await response.json();

        if (data["unassigned"] && data["unassigned"].length > 0) {
            alert("Unable to optimize your itinerary. Try removing activities or adjusting their timings.");
            return;
        }

        const trip = data.routes[0];
        const steps = trip.steps;

        steps.forEach(step => {
            const { id, arrival, service, waiting_time: waitingTime } = step;

            const activity = activities[id];

            const unixStartTime = arrival + waitingTime;
            const unixFinishTime = arrival + waitingTime + service;

            activity.startTime = new Date(unixStartTime);
            activity.finishTime = new Date(unixFinishTime);

            // Helper to calculate the day number relative to startDate
            const calculateDayNumber = timestamp => {
                const startDateUnix = convertDateToUnixTimestamp(itinerary.startDate);
                return Math.floor((timestamp - startDateUnix) / 86400) + 1;
            };

            const startDay = calculateDayNumber(unixStartTime);
            const endDay = calculateDayNumber(unixFinishTime);

            activity.day = [startDay];

            // if it straddles midnight, also assign it to the next day
            if (endDay > startDay) {
                activity.day.push(endDay);
            }

            // update the activity in IndexedDB
            activityDatabase.deleteActivity(id);
            activityDatabase.addActivity(activity);
        });

        // save activities to database
        const res = await fetch("http://localhost:4000/saveActivities", {
            method: 'POST',
            body: JSON.stringify(activities)
        });
        if (!res.ok) console.error("Failed to save activities to database.");
    }


    static async saveItinerary(itinerary) {
        try {
            const response = await fetch('http://localhost:4000/saveItinerary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itinerary)
            });
            
            if (response.ok) {
                console.log("Saved itinerary!");
            } else {
                console.error("Failed to save itinerary:", response.status, response.statusText);
            }
        } catch (e) {
            console.error("Error while saving itinerary:", e);
        }
    }


}
