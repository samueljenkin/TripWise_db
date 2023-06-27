const db = require('../db/db')

const Attraction = {
    create: (userId, displayName, websiteUri, priceLevel, rating) => {
        const sql = `
            INSERT INTO attractions(user_id, display_name, website_uri, price_level, rating)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `

        return db
            .query(sql, [userId, displayName, websiteUri, priceLevel, rating])
            .then(dbRes => dbRes.rows[0])
    }
}

module.exports = Attraction