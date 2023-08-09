require('dotenv').config();
const bcrypt = require(`bcrypt`);
const { CONNECTION_STRING } = process.env;
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
    getAuth: (req, res) => {
        if (req.session.userID){
            res.status(200).send(req.session.userID)
        }
        else{
            res.status(200).send(``)
        }
    },

    endSession: (req, res) => {
        req.session.destroy();
        res.status(200).send(`Logged out`);
    },

    createUser: (req, res) => {
        const { email, username, password } = req.body;
        sequelize.query(`SELECT * FROM users WHERE username = '${username}'`)
        .then(dbres => {
            if (dbres[0].length){
                res.status(409).send(`This username is unavailable`)
            }
            else{
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds, (err, hash) => {
                let newUser = {
                    email,
                    username,
                    passwordHash: hash
                }
                if (err){
                    res.status(400).send(`Problem during hash`)
                }
                else{
                    sequelize.query(`INSERT INTO users (email, username, password) VALUES ('${newUser.email}', '${newUser.username}', '${newUser.passwordHash}')`)
                    .then(() => {
                        req.session.userID = newUser.username;
                        res.status(200).send(`Account created!`)
                    })
                }
                })
            }
        })
    },

    loginUser: (req, res) => {
        const { username, password } = req.body;
        sequelize.query(`SELECT * FROM users WHERE username = '${username}'`)
        .then(dbres => {
            if (!dbres[0].length){
                res.status(401).send(`Invalid credentials`)
            }
            else{
                bcrypt.compare(password, dbres[0][0].password, (err, result) => {
                    if (err){
                        res.status(400).send(`Problem during compare`)
                      }
                    else{
                        if(!result){
                          res.status(401).send(`Invalid credentials`)
                        }
                        else{
                            req.session.userID = username;
                            res.status(200).send(req.session)
                        }
                    }
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