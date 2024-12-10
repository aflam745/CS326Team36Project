const fs = require('node:fs')
const { Sequelize, DataTypes, QueryTypes } = require('sequelize')
const sqlite3 = require('sqlite3')

exports.db = new sqlite3.Database('records.db')

/**
  * @typedef {Object} Itinerary
  * @property {string} id
  * @property {string} tripName
  * @property {Date | string} endDate
  * @property {Date | string} startDate
  * @property {Location} startLocation
  * @property {Location} endLocation
  * @property {unknown} transportation
  * @property {string} description
  *
  * @typedef {Object} Location
  * @property {number} lon
  * @property {number} lat
  * @property {string} address
  *
  * @typedef {Object} ItineraryResult
  * @property {string} data
  * @property {string} imagePath
  */

const db = new Sequelize({ dialect: 'sqlite', storage: 'records.db' })

const itineraryModel = db.define('itinerary', {
  id: { primaryKey: true, type: DataTypes.STRING },
  data: { allowNull: false, type: DataTypes.STRING },
  imagePath: DataTypes.STRING,
}, { freezeTableName: true }
)

const ActivityModel = db.define('activity', {
  id: { type: DataTypes.STRING, primaryKey: true },
  itineraryId: { type: DataTypes.STRING, allowNull: false },
  data: { allowNull: false, type: DataTypes.STRING }
}, { freezeTableName: true }
)


async function initializeDatabase() {
    try {
        await db.authenticate();
        console.log('Connection established.');
        await db.sync();
        console.log('Database synchronized.');
    } catch (error) {
        console.error('Error initializing the database:', error);
    }
}

initializeDatabase()


/**
  * @param {Itinerary} itinerary - Instance of the Itinerary Object
  * @param {string} [imagePath] - Path of the image
  *
  * Saves the itinerary as a JSON String to the database
  */
async function saveItinerary(itinerary, imagePath) {
    console.log("here with itinerary:", itinerary)
  return await db.query(
    `insert into itinerary values(?, json(?), ?, ?, ?)`,
      { raw: true, replacements: [itinerary.id, JSON.stringify(itinerary), imagePath ?? null, new Date(), new Date()], type: QueryTypes.INSERT }
  )
}

async function saveActivity(activity) {
  return await db.query(
    `insert into activity values(?, json(?), ?, ?)`,
      { raw: true, replacements: [activity.id, JSON.stringify(activity), null, new Date(), new Date()], type: QueryTypes.INSERT }
  )
}

/** 
  * @param {string} id
  *
  * Retrieves the itinerary as a JSON string from the database
  */
async function loadItinerary(id) {

  /** 
    * WARNING: This query may blow up and 
    * return the wrong type I don't know
    * if it returns the right thing yet
    
    * @type {ItineraryResult}
    */
  const result = await db.query(`
    select data, imagePath from itinerary where id = ? limit 1
  `, { raw: true, replacements: { id: id }, type: QueryTypes.SELECT })

  const path = result.imagePath

  if (path != null) {
    // WARNING: I hope this doesn't throw
    const file = fs.readFileSync(path)

    return { file, itinerary: result.data }
  }

  return { itinerary: result.data }
}

// WARNING: I do not know the complete shapre of what this will return
async function loadItineraryWithActivities(id) {
  // TODO: nest r1 and r2?
  const tx = await db.transaction()

  const r1 = await db.query(
    `select data, imagePath from itinerary where id = ? limit 1`,
    {
      raw: true,
      replacements: { id: id },
      transaction: tx,
      type: QueryTypes.SELECT
    }
  )

  const r2 = await db.query(
    `select data from activity where id = ?`,
    {
      raw: true,
      replacements: { id: id },
      transaction: tx,
      type: QueryTypes.SELECT
    }
  )

  tx.commit()

  return { r1, r2 }
}


/**
  * WARNING: This function is untested may blow up
  *
  * @param {Activity[]} activites 
  */
async function saveActivities(activites) {
  const date = new Date(); // date for createdAt/updatedAt fields
  const a = activites.map(arr => [a.id, a.itineraryId, JSON.stringify(a)], date, date)
  const result = await db.query(`insert into activity values ${data.map(a => '(?)').join(',')}`, {
    replacements: a
  })
  return
}

exports.loadItinerary = loadItinerary
exports.saveItinerary = saveItinerary
exports.saveActivity = saveActivity
exports.saveActivities = saveActivities
exports.loadItineraryWithActivities = loadItineraryWithActivities