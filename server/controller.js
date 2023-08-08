require('dotenv').config();
const { CONNECTION_STRING } = process.env;
const { default: axios } = require('axios');
const Sequelize = require(`sequelize`);

const sequelize = new Sequelize(CONNECTION_STRING, 
    {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false
            }
        }
    }
)

module.exports = {
    createUser: (req, res) => {
        const { email, username, password } = req.body;
        console.log(username)
        sequelize.query(`SELECT * FROM users WHERE username = '${username}'`)
        .then(dbres => {
            console.log(dbres[0])
            if (dbres[0].length){
                res.status(409).send(`This username is unavailable`)
            }
            else{
                sequelize.query(`INSERT INTO users (email, username, password) VALUES ('${email}', '${username}', '${password}')`)
                .then(() => {
                    res.status(200).send(`Account created!`)
                })
            }
        })
    },

    getUsers: (req, res) => {
        sequelize.query(`SELECT * FROM users`)
        .then(dbres => {
            res.status(200).send(dbres[0])})
        .catch(error => console.log(error))
    },

    getPlayers: (req, res) => {
        const { team, position } = req.query;
        if (!team && !position){
            sequelize.query(`SELECT * FROM players`)
            .then(dbres => {
                res.status(200).send(dbres[0])})
            .catch(error => console.log(error))
        }
        else if (!position){
            sequelize.query(`SELECT * FROM players WHERE team = ${team}`)
            .then(dbres => {
                res.status(200).send(dbres[0])})
            .catch(error => console.log(error))
        }
        else if (!team){
            sequelize.query(`SELECT * FROM players WHERE position = ${position}`)
            .then(dbres => {
                res.status(200).send(dbres[0])})
            .catch(error => console.log(error))
        }
        else{
            sequelize.query(`SELECT * FROM players WHERE team = ${team} AND position = ${position}`)
            .then(dbres => {
                res.status(200).send(dbres[0])})
            .catch(error => console.log(error))
        }
    },

    getTeams: (req, res) => {
        sequelize.query(`SELECT * FROM teams`)
        .then(dbres => {
            res.status(200).send(dbres[0])
        })
        .catch(error => console.log(error))
    },

    getPositions: (req, res) => {
        sequelize.query(`SELECT * FROM positions`)
        .then(dbres => {
            res.status(200).send(dbres[0])
        })
        .catch(error => console.log(error))
    },

    getQBStats: (req, res) => {
        let { stat, sort } = req.query;
        if(!stat && !sort){
            sequelize.query(`SELECT SETSEED(0.754); SELECT q.id, p.name, q.pass_attempts, FLOOR(RANDOM() * (pass_attempts - (pass_attempts / 2)) + (pass_attempts / 2))  AS completions, q.passing_yards, q.passing_tds, q.interceptions, q.rushing_attempts, q.rushing_yards, CAST(ROUND((CAST(rushing_yards AS NUMERIC) / CAST(rushing_attempts AS NUMERIC)), 2) AS FLOAT) AS yards_per_carry, q.rushing_tds FROM quarterbacks q JOIN players p ON q.id = p.player_id`)
            .then(dbres => {
                res.status(200).send(dbres[0])
            })
            .catch(error => console.log(error))
        }
        else{
            sequelize.query(`SELECT SETSEED(0.754); SELECT q.id, p.name, q.pass_attempts, FLOOR(RANDOM() * (pass_attempts - (pass_attempts / 2)) + (pass_attempts / 2))  AS completions, q.passing_yards, q.passing_tds, q.interceptions, q.rushing_attempts, q.rushing_yards, CAST(ROUND((CAST(rushing_yards AS NUMERIC) / CAST(rushing_attempts AS NUMERIC)), 2) AS FLOAT) AS yards_per_carry, q.rushing_tds FROM quarterbacks q JOIN players p ON q.id = p.player_id ORDER BY ${stat} ${sort}`)
            .then(dbres => {
                res.status(200).send(dbres[0])
            })
            .catch(error => console.log(error))
        }
    },

    getRBStats: (req, res) => {
        let { stat, sort } = req.query;
        if (!stat && !sort){
            sequelize
            .query(`SELECT SETSEED(0.1454); SELECT r.id, p.name, r.rushing_attempts, r.rushing_yards, CAST(ROUND((CAST(rushing_yards AS NUMERIC) / CAST(rushing_attempts AS NUMERIC)), 2) AS FLOAT) AS yards_per_carry, r.receiving_targets, FLOOR(RANDOM() * (receiving_targets - (receiving_targets / 2)) + (receiving_targets / 2)) AS receptions, r.receiving_yards, CAST(ROUND((CAST(receiving_yards AS NUMERIC) / CAST(FLOOR(RANDOM() * (receiving_targets - (receiving_targets / 2)) + (receiving_targets / 2)) AS NUMERIC)), 2) AS FLOAT) AS yards_per_reception, r.touchdowns FROM skill_positions r JOIN players p ON r.id = p.player_id WHERE p.position = 2`)
            .then(dbres => {
                res.status(200).send(dbres[0])
            })
            .catch(error => console.log(error))
        }
        else{
            sequelize
            .query(`SELECT SETSEED(0.1454); SELECT r.id, p.name, r.rushing_attempts, r.rushing_yards, CAST(ROUND((CAST(rushing_yards AS NUMERIC) / CAST(rushing_attempts AS NUMERIC)), 2) AS FLOAT) AS yards_per_carry, r.receiving_targets, FLOOR(RANDOM() * (receiving_targets - (receiving_targets / 2)) + (receiving_targets / 2)) AS receptions, r.receiving_yards, CAST(ROUND((CAST(receiving_yards AS NUMERIC) / CAST(FLOOR(RANDOM() * (receiving_targets - (receiving_targets / 2)) + (receiving_targets / 2)) AS NUMERIC)), 2) AS FLOAT) AS yards_per_reception, r.touchdowns FROM skill_positions r JOIN players p ON r.id = p.player_id WHERE p.position = 2 ORDER BY ${stat} ${sort}`)
            .then(dbres => {
                res.status(200).send(dbres[0])
            })
            .catch(error => console.log(error))
        }
    },

    getWRStats: (req, res) => {
        let { stat, sort } = req.query;
        if (!stat && !sort){
            sequelize
            .query(`SELECT SETSEED(0.1455); SELECT w.id, p.name, w.rushing_attempts, w.rushing_yards, CAST(ROUND((CAST(rushing_yards AS NUMERIC) / CAST(rushing_attempts AS NUMERIC)), 2) AS FLOAT) AS yards_per_carry, w.receiving_targets, FLOOR(RANDOM() * (receiving_targets - (receiving_targets / 2)) + (receiving_targets / 2)) AS receptions, w.receiving_yards, CAST(ROUND((CAST(receiving_yards AS NUMERIC) / CAST(FLOOR(RANDOM() * (receiving_targets - (receiving_targets / 2)) + (receiving_targets / 2)) AS NUMERIC)), 2) AS FLOAT) AS yards_per_reception, w.touchdowns FROM skill_positions w JOIN players p ON w.id = p.player_id WHERE p.position = 3`)
            .then(dbres => {
                res.status(200).send(dbres[0])
            })
            .catch(error => console.log(error))
        }
        else{
            sequelize
            .query(`SELECT SETSEED(0.1455); SELECT w.id, p.name, w.rushing_attempts, w.rushing_yards, CAST(ROUND((CAST(rushing_yards AS NUMERIC) / CAST(rushing_attempts AS NUMERIC)), 2) AS FLOAT) AS yards_per_carry, w.receiving_targets, FLOOR(RANDOM() * (receiving_targets - (receiving_targets / 2)) + (receiving_targets / 2)) AS receptions, w.receiving_yards, CAST(ROUND((CAST(receiving_yards AS NUMERIC) / CAST(FLOOR(RANDOM() * (receiving_targets - (receiving_targets / 2)) + (receiving_targets / 2)) AS NUMERIC)), 2) AS FLOAT) AS yards_per_reception, w.touchdowns FROM skill_positions w JOIN players p ON w.id = p.player_id WHERE p.position = 3 ORDER BY ${stat} ${sort}`)
            .then(dbres => {
                res.status(200).send(dbres[0])
            })
            .catch(error => console.log(error))
        }
    },

    getTEStats: (req, res) => {
        let { stat, sort } = req.query;
        if (!stat && !sort){
            sequelize
            .query(`SELECT SETSEED(0.1456); SELECT t.id, p.name, t.rushing_attempts, t.rushing_yards, CAST(ROUND((CAST(rushing_yards AS NUMERIC) / CAST(rushing_attempts AS NUMERIC)), 2) AS FLOAT) AS yards_per_carry, t.receiving_targets, FLOOR(RANDOM() * (receiving_targets - (receiving_targets / 2)) + (receiving_targets / 2)) AS receptions, t.receiving_yards, CAST(ROUND((CAST(receiving_yards AS NUMERIC) / CAST(FLOOR(RANDOM() * (receiving_targets - (receiving_targets / 2)) + (receiving_targets / 2)) AS NUMERIC)), 2) AS FLOAT) AS yards_per_reception, t.touchdowns FROM skill_positions t JOIN players p ON t.id = p.player_id WHERE p.position = 4`)
            .then(dbres => {
                res.status(200).send(dbres[0])
            })
            .catch(error => console.log(error))
        }
        else{
            sequelize
            .query(`SELECT SETSEED(0.1456); SELECT t.id, p.name, t.rushing_attempts, t.rushing_yards, CAST(ROUND((CAST(rushing_yards AS NUMERIC) / CAST(rushing_attempts AS NUMERIC)), 2) AS FLOAT) AS yards_per_carry, t.receiving_targets, FLOOR(RANDOM() * (receiving_targets - (receiving_targets / 2)) + (receiving_targets / 2)) AS receptions, t.receiving_yards, CAST(ROUND((CAST(receiving_yards AS NUMERIC) / CAST(FLOOR(RANDOM() * (receiving_targets - (receiving_targets / 2)) + (receiving_targets / 2)) AS NUMERIC)), 2) AS FLOAT) AS yards_per_reception, t.touchdowns FROM skill_positions t JOIN players p ON t.id = p.player_id WHERE p.position = 4 ORDER BY ${stat} ${sort}`)
            .then(dbres => {
                res.status(200).send(dbres[0])
            })
            .catch(error => console.log(error))
        }
    },

    getKickerStats: (req, res) => {
        let { stat, sort } = req.query;
        if (!stat && !sort){
            sequelize
            .query(`SELECT SETSEED(0.477); SELECT k.id, p.name, k.xp_attempts, FLOOR(RANDOM() * (xp_attempts - (xp_attempts / 2)) + (xp_attempts / 2)) AS xp_made, k.fg_attempts, FLOOR(RANDOM() * (fg_attempts - (fg_attempts / 2)) + (fg_attempts / 2)) AS fg_made FROM kickers k JOIN players p ON k.id = p.player_id`)
            .then(dbres => {
                res.status(200).send(dbres[0])
            })
            .catch(error => console.log(error))
        }
        else{
            sequelize
            .query(`SELECT SETSEED(0.477); SELECT k.id, p.name, k.xp_attempts, FLOOR(RANDOM() * (xp_attempts - (xp_attempts / 2)) + (xp_attempts / 2)) AS xp_made, k.fg_attempts, FLOOR(RANDOM() * (fg_attempts - (fg_attempts / 2)) + (fg_attempts / 2)) AS fg_made FROM kickers k JOIN players p ON k.id = p.player_id ORDER BY ${stat} ${sort}`)
            .then(dbres => {
                res.status(200).send(dbres[0])
            })
            .catch(error => console.log(error))
        }
    }
}