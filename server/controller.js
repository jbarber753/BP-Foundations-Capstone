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
            res.status(200).send(req.session)
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
                        sequelize.query(`SELECT * FROM users WHERE username = '${username}'`)
                        .then(dbres2 => {
                            req.session.username = dbres2[0][0].username;
                            req.session.userID = dbres2[0][0].id;
                            res.status(200).send(req.session)
                        })
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
                            req.session.username = username;
                            req.session.userID = dbres[0][0].id;
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
            sequelize.query(`SELECT CONCAT(t.location,' ', t.name) AS team, q.id, p.name, q.pass_attempts, q.completions, CAST(ROUND(CAST(completions * yards_per_completion AS NUMERIC), 0) AS INTEGER) AS passing_yards, CAST(ROUND(CAST(q.yards_per_completion AS NUMERIC), 2) AS FLOAT) AS yards_per_completion, q.passing_tds, q.interceptions, q.rushing_attempts, CAST(ROUND(CAST(rushing_attempts * yards_per_carry AS NUMERIC), 0) AS INTEGER) AS rushing_yards, CAST(ROUND(CAST(q.yards_per_carry AS NUMERIC), 2) AS FLOAT) AS yards_per_carry, q.rushing_tds, CAST(ROUND(CAST((completions * yards_per_completion * 0.04) + (passing_tds * 4) + (rushing_attempts * yards_per_carry * 0.1) + (rushing_tds * 6) - (interceptions) AS NUMERIC), 0) AS INTEGER) AS fantasy_points, q.user_team FROM quarterbacks q JOIN players p ON q.id = p.player_id JOIN teams t ON p.team = t.team_id`)
            .then(dbres => {
                res.status(200).send(dbres[0])
            })
            .catch(error => console.log(error))
        }
        else{
            sequelize.query(`SELECT CONCAT(t.location,' ', t.name) AS team, q.id, p.name, q.pass_attempts, q.completions, CAST(ROUND(CAST(completions * yards_per_completion AS NUMERIC), 0) AS INTEGER) AS passing_yards, CAST(ROUND(CAST(q.yards_per_completion AS NUMERIC), 2) AS FLOAT) AS yards_per_completion, q.passing_tds, q.interceptions, q.rushing_attempts, CAST(ROUND(CAST(rushing_attempts * yards_per_carry AS NUMERIC), 0) AS INTEGER) AS rushing_yards, CAST(ROUND(CAST(q.yards_per_carry AS NUMERIC), 2) AS FLOAT) AS yards_per_carry, q.rushing_tds, CAST(ROUND(CAST((completions * yards_per_completion * 0.04) + (passing_tds * 4) + (rushing_attempts * yards_per_carry * 0.1) + (rushing_tds * 6) - (interceptions) AS NUMERIC), 0) AS INTEGER) AS fantasy_points, q.user_team FROM quarterbacks q JOIN players p ON q.id = p.player_id JOIN teams t ON p.team = t.team_id ORDER BY ${stat} ${sort}`)
            .then(dbres => {
                res.status(200).send(dbres[0])
            })
            .catch(error => console.log(error))
        }
    },

    addQB: (req, res) => {
        let { user, player } = req.query;
        sequelize.query(`UPDATE quarterbacks SET user_team = ${user} WHERE id = ${player}`)
        .then(dbres => res.status(200).send(`Player added to your team!`))
    },

    getRBStats: (req, res) => {
        let { stat, sort } = req.query;
        if (!stat && !sort){
            sequelize
            .query(`SELECT CONCAT(t.location,' ', t.name) AS team, r.id, p.name, r.rushing_attempts, CAST(ROUND(CAST(rushing_attempts * yards_per_carry AS NUMERIC), 0) AS INTEGER) AS rushing_yards, CAST(ROUND(CAST(r.yards_per_carry AS NUMERIC), 2) AS FLOAT) AS yards_per_carry, r.receiving_targets, LEAST(receiving_targets, receptions) AS receptions, CAST(ROUND(CAST(receptions * yards_per_reception AS NUMERIC), 0) AS INTEGER) AS receiving_yards, CAST(ROUND(CAST(r.yards_per_reception AS NUMERIC), 2) AS FLOAT) AS yards_per_reception, LEAST(receiving_targets, touchdowns) AS touchdowns, CAST(ROUND(CAST((rushing_attempts * yards_per_carry * 0.1) + (receptions * yards_per_reception * 0.1) + (touchdowns * 6) AS NUMERIC), 0) AS INTEGER) AS fantasy_points, r.user_team FROM skill_positions r JOIN players p ON r.id = p.player_id JOIN teams t ON p.team = t.team_id WHERE p.position = 2`)
            .then(dbres => {
                res.status(200).send(dbres[0])
            })
            .catch(error => console.log(error))
        }
        else{
            sequelize
            .query(`SELECT CONCAT(t.location,' ', t.name) AS team, r.id, p.name, r.rushing_attempts, CAST(ROUND(CAST(rushing_attempts * yards_per_carry AS NUMERIC), 0) AS INTEGER) AS rushing_yards, CAST(ROUND(CAST(r.yards_per_carry AS NUMERIC), 2) AS FLOAT) AS yards_per_carry, r.receiving_targets, LEAST(receiving_targets, receptions) AS receptions, CAST(ROUND(CAST(receptions * yards_per_reception AS NUMERIC), 0) AS INTEGER) AS receiving_yards, CAST(ROUND(CAST(r.yards_per_reception AS NUMERIC), 2) AS FLOAT) AS yards_per_reception, LEAST(receiving_targets, touchdowns) AS touchdowns, CAST(ROUND(CAST((rushing_attempts * yards_per_carry * 0.1) + (receptions * yards_per_reception * 0.1) + (touchdowns * 6) AS NUMERIC), 0) AS INTEGER) AS fantasy_points, r.user_team FROM skill_positions r JOIN players p ON r.id = p.player_id JOIN teams t ON p.team = t.team_id WHERE p.position = 2 ORDER BY ${stat} ${sort}`)
            .then(dbres => {
                res.status(200).send(dbres[0])
            })
            .catch(error => console.log(error))
        }
    },

    addRB: (req, res) => {
        let { user, player } = req.query;
        sequelize.query(`UPDATE skill_positions SET user_team = ${user} WHERE id = ${player}`)
        .then(dbres => res.status(200).send(`Player added to your team!`))
    },

    getWRStats: (req, res) => {
        let { stat, sort } = req.query;
        if (!stat && !sort){
            sequelize
            .query(`SELECT CONCAT(t.location,' ', t.name) AS team, r.id, p.name, r.rushing_attempts, CAST(ROUND(CAST(rushing_attempts * yards_per_carry AS NUMERIC), 0) AS INTEGER) AS rushing_yards, CAST(ROUND(CAST(r.yards_per_carry AS NUMERIC), 2) AS FLOAT) AS yards_per_carry, r.receiving_targets, LEAST(receiving_targets, receptions) AS receptions, CAST(ROUND(CAST(receptions * yards_per_reception AS NUMERIC), 0) AS INTEGER) AS receiving_yards, CAST(ROUND(CAST(r.yards_per_reception AS NUMERIC), 2) AS FLOAT) AS yards_per_reception, LEAST(receiving_targets, touchdowns) AS touchdowns, CAST(ROUND(CAST((rushing_attempts * yards_per_carry * 0.1) + (receptions * yards_per_reception * 0.1) + (touchdowns * 6) AS NUMERIC), 0) AS INTEGER) AS fantasy_points, r.user_team FROM skill_positions r JOIN players p ON r.id = p.player_id JOIN teams t ON p.team = t.team_id WHERE p.position = 3`)
            .then(dbres => {
                res.status(200).send(dbres[0])
            })
            .catch(error => console.log(error))
        }
        else{
            sequelize
            .query(`SELECT CONCAT(t.location,' ', t.name) AS team, r.id, p.name, r.rushing_attempts, CAST(ROUND(CAST(rushing_attempts * yards_per_carry AS NUMERIC), 0) AS INTEGER) AS rushing_yards, CAST(ROUND(CAST(r.yards_per_carry AS NUMERIC), 2) AS FLOAT) AS yards_per_carry, r.receiving_targets, LEAST(receiving_targets, receptions) AS receptions, CAST(ROUND(CAST(receptions * yards_per_reception AS NUMERIC), 0) AS INTEGER) AS receiving_yards, CAST(ROUND(CAST(r.yards_per_reception AS NUMERIC), 2) AS FLOAT) AS yards_per_reception, LEAST(receiving_targets, touchdowns) AS touchdowns, CAST(ROUND(CAST((rushing_attempts * yards_per_carry * 0.1) + (receptions * yards_per_reception * 0.1) + (touchdowns * 6) AS NUMERIC), 0) AS INTEGER) AS fantasy_points, r.user_team FROM skill_positions r JOIN players p ON r.id = p.player_id JOIN teams t ON p.team = t.team_id WHERE p.position = 3 ORDER BY ${stat} ${sort}`)
            .then(dbres => {
                res.status(200).send(dbres[0])
            })
            .catch(error => console.log(error))
        }
    },

    addWR: (req, res) => {
        let { user, player } = req.query;
        sequelize.query(`UPDATE skill_positions SET user_team = ${user} WHERE id = ${player}`)
        .then(dbres => res.status(200).send(`Player added to your team!`))
    },

    getTEStats: (req, res) => {
        let { stat, sort } = req.query;
        if (!stat && !sort){
            sequelize
            .query(`SELECT CONCAT(t.location,' ', t.name) AS team, r.id, p.name, r.rushing_attempts, CAST(ROUND(CAST(rushing_attempts * yards_per_carry AS NUMERIC), 0) AS INTEGER) AS rushing_yards, CAST(ROUND(CAST(r.yards_per_carry AS NUMERIC), 2) AS FLOAT) AS yards_per_carry, r.receiving_targets, LEAST(receiving_targets, receptions) AS receptions, CAST(ROUND(CAST(receptions * yards_per_reception AS NUMERIC), 0) AS INTEGER) AS receiving_yards, CAST(ROUND(CAST(r.yards_per_reception AS NUMERIC), 2) AS FLOAT) AS yards_per_reception, LEAST(receiving_targets, touchdowns) AS touchdowns, CAST(ROUND(CAST((rushing_attempts * yards_per_carry * 0.1) + (receptions * yards_per_reception * 0.1) + (touchdowns * 6) AS NUMERIC), 0) AS INTEGER) AS fantasy_points, r.user_team FROM skill_positions r JOIN players p ON r.id = p.player_id JOIN teams t ON p.team = t.team_id WHERE p.position = 4`)
            .then(dbres => {
                res.status(200).send(dbres[0])
            })
            .catch(error => console.log(error))
        }
        else{
            sequelize
            .query(`SELECT CONCAT(t.location,' ', t.name) AS team, r.id, p.name, r.rushing_attempts, CAST(ROUND(CAST(rushing_attempts * yards_per_carry AS NUMERIC), 0) AS INTEGER) AS rushing_yards, CAST(ROUND(CAST(r.yards_per_carry AS NUMERIC), 2) AS FLOAT) AS yards_per_carry, r.receiving_targets, LEAST(receiving_targets, receptions) AS receptions, CAST(ROUND(CAST(receptions * yards_per_reception AS NUMERIC), 0) AS INTEGER) AS receiving_yards, CAST(ROUND(CAST(r.yards_per_reception AS NUMERIC), 2) AS FLOAT) AS yards_per_reception, LEAST(receiving_targets, touchdowns) AS touchdowns, CAST(ROUND(CAST((rushing_attempts * yards_per_carry * 0.1) + (receptions * yards_per_reception * 0.1) + (touchdowns * 6) AS NUMERIC), 0) AS INTEGER) AS fantasy_points, r.user_team FROM skill_positions r JOIN players p ON r.id = p.player_id JOIN teams t ON p.team = t.team_id WHERE p.position = 4 ORDER BY ${stat} ${sort}`)
            .then(dbres => {
                res.status(200).send(dbres[0])
            })
            .catch(error => console.log(error))
        }
    },

    addTE: (req, res) => {
        let { user, player } = req.query;
        sequelize.query(`UPDATE skill_positions SET user_team = ${user} WHERE id = ${player}`)
        .then(dbres => res.status(200).send(`Player added to your team!`))
    },

    getKickerStats: (req, res) => {
        let { stat, sort } = req.query;
        if (!stat && !sort){
            sequelize
            .query(`SELECT CONCAT(t.location,' ', t.name) AS team, k.id, p.name, k.xp_attempts, LEAST(xp_attempts, xp_made) AS xp_made, k.fg_attempts, LEAST(fg_attempts, fg_made) AS fg_made, xp_made + (fg_made * 3) - (xp_attempts - xp_made) - (fg_attempts - fg_made) AS fantasy_points, k.user_team FROM kickers k JOIN players p ON k.id = p.player_id JOIN teams t ON p.team = t.team_id`)
            .then(dbres => {
                res.status(200).send(dbres[0])
            })
            .catch(error => console.log(error))
        }
        else{
            sequelize
            .query(`SELECT SETSEED(0.477); SELECT CONCAT(t.location,' ', t.name) AS team, k.id, p.name, k.xp_attempts, FLOOR(RANDOM() * (xp_attempts - (xp_attempts / 2)) + (xp_attempts / 2)) AS xp_made, k.fg_attempts, FLOOR(RANDOM() * (fg_attempts - (fg_attempts / 2)) + (fg_attempts / 2)) AS fg_made, xp_made + (fg_made * 3) - (xp_attempts - xp_made) - (fg_attempts - fg_made) AS fantasy_points, k.user_team FROM kickers k JOIN players p ON k.id = p.player_id JOIN teams t ON p.team = t.team_id ORDER BY ${stat} ${sort}`)
            .then(dbres => {
                res.status(200).send(dbres[0])
            })
            .catch(error => console.log(error))
        }
    },

    addK: (req, res) => {
        let { user, player } = req.query;
        sequelize.query(`UPDATE kickers SET user_team = ${user} WHERE id = ${player}`)
        .then(dbres => res.status(200).send(`Player added to your team!`))
    },

    getClaimedQBs: (req, res) => {
        let { user, stat, sort } = req.query;
        if (!user && !stat && !sort){
            sequelize.query(`SELECT CONCAT(t.location,' ', t.name) AS team, q.id, p.name, q.pass_attempts, q.completions, CAST(ROUND(CAST(completions * yards_per_completion AS NUMERIC), 0) AS INTEGER) AS passing_yards, CAST(ROUND(CAST(q.yards_per_completion AS NUMERIC), 2) AS FLOAT) AS yards_per_completion, q.passing_tds, q.interceptions, q.rushing_attempts, CAST(ROUND(CAST(rushing_attempts * yards_per_carry AS NUMERIC), 0) AS INTEGER) AS rushing_yards, CAST(ROUND(CAST(q.yards_per_carry AS NUMERIC), 2) AS FLOAT) AS yards_per_carry, q.rushing_tds, CAST(ROUND(CAST((completions * yards_per_completion * 0.04) + (passing_tds * 4) + (rushing_attempts * yards_per_carry * 0.1) + (rushing_tds * 6) - (interceptions) AS NUMERIC), 0) AS INTEGER) AS fantasy_points, q.user_team FROM quarterbacks q JOIN players p ON q.id = p.player_id JOIN teams t ON p.team = t.team_id WHERE q.user_team IS NOT NULL`)
            .then(dbres => res.status(200).send(dbres[0]))
        }
        else if (!stat && !sort){
            sequelize.query(`SELECT CONCAT(t.location,' ', t.name) AS team, q.id, p.name, q.pass_attempts, q.completions, CAST(ROUND(CAST(completions * yards_per_completion AS NUMERIC), 0) AS INTEGER) AS passing_yards, CAST(ROUND(CAST(q.yards_per_completion AS NUMERIC), 2) AS FLOAT) AS yards_per_completion, q.passing_tds, q.interceptions, q.rushing_attempts, CAST(ROUND(CAST(rushing_attempts * yards_per_carry AS NUMERIC), 0) AS INTEGER) AS rushing_yards, CAST(ROUND(CAST(q.yards_per_carry AS NUMERIC), 2) AS FLOAT) AS yards_per_carry, q.rushing_tds, CAST(ROUND(CAST((completions * yards_per_completion * 0.04) + (passing_tds * 4) + (rushing_attempts * yards_per_carry * 0.1) + (rushing_tds * 6) - (interceptions) AS NUMERIC), 0) AS INTEGER) AS fantasy_points, q.user_team FROM quarterbacks q JOIN players p ON q.id = p.player_id JOIN teams t ON p.team = t.team_id WHERE q.user_team = ${user}`)
            .then(dbres => res.status(200).send(dbres[0]))
        }
        else {
            sequelize.query(`SELECT CONCAT(t.location,' ', t.name) AS team, q.id, p.name, q.pass_attempts, q.completions, CAST(ROUND(CAST(completions * yards_per_completion AS NUMERIC), 0) AS INTEGER) AS passing_yards, CAST(ROUND(CAST(q.yards_per_completion AS NUMERIC), 2) AS FLOAT) AS yards_per_completion, q.passing_tds, q.interceptions, q.rushing_attempts, CAST(ROUND(CAST(rushing_attempts * yards_per_carry AS NUMERIC), 0) AS INTEGER) AS rushing_yards, CAST(ROUND(CAST(q.yards_per_carry AS NUMERIC), 2) AS FLOAT) AS yards_per_carry, q.rushing_tds, CAST(ROUND(CAST((completions * yards_per_completion * 0.04) + (passing_tds * 4) + (rushing_attempts * yards_per_carry * 0.1) + (rushing_tds * 6) - (interceptions) AS NUMERIC), 0) AS INTEGER) AS fantasy_points, q.user_team FROM quarterbacks q JOIN players p ON q.id = p.player_id JOIN teams t ON p.team = t.team_id WHERE q.user_team = ${user} ORDER BY ${stat} ${sort}`)
            .then(dbres => res.status(200).send(dbres[0]))
        }
    },

    getClaimedRBs: (req, res) => {
        let { user, stat, sort } = req.query;
        if (!user && !stat && !sort){
            sequelize.query(`SELECT CONCAT(t.location,' ', t.name) AS team, r.id, p.name, r.rushing_attempts, CAST(ROUND(CAST(rushing_attempts * yards_per_carry AS NUMERIC), 0) AS INTEGER) AS rushing_yards, CAST(ROUND(CAST(r.yards_per_carry AS NUMERIC), 2) AS FLOAT) AS yards_per_carry, r.receiving_targets, LEAST(receiving_targets, receptions) AS receptions, CAST(ROUND(CAST(receptions * yards_per_reception AS NUMERIC), 0) AS INTEGER) AS receiving_yards, CAST(ROUND(CAST(r.yards_per_reception AS NUMERIC), 2) AS FLOAT) AS yards_per_reception, LEAST(receiving_targets, touchdowns) AS touchdowns, CAST(ROUND(CAST((rushing_attempts * yards_per_carry * 0.1) + (receptions * yards_per_reception * 0.1) + (touchdowns * 6) AS NUMERIC), 0) AS INTEGER) AS fantasy_points, r.user_team FROM skill_positions r JOIN players p ON r.id = p.player_id JOIN teams t ON p.team = t.team_id WHERE p.position = 2 AND r.user_team IS NOT NULL`)
            .then(dbres => res.status(200).send(dbres[0]))
        }
        else if (!stat && !sort){
            sequelize.query(`SELECT CONCAT(t.location,' ', t.name) AS team, r.id, p.name, r.rushing_attempts, CAST(ROUND(CAST(rushing_attempts * yards_per_carry AS NUMERIC), 0) AS INTEGER) AS rushing_yards, CAST(ROUND(CAST(r.yards_per_carry AS NUMERIC), 2) AS FLOAT) AS yards_per_carry, r.receiving_targets, LEAST(receiving_targets, receptions) AS receptions, CAST(ROUND(CAST(receptions * yards_per_reception AS NUMERIC), 0) AS INTEGER) AS receiving_yards, CAST(ROUND(CAST(r.yards_per_reception AS NUMERIC), 2) AS FLOAT) AS yards_per_reception, LEAST(receiving_targets, touchdowns) AS touchdowns, CAST(ROUND(CAST((rushing_attempts * yards_per_carry * 0.1) + (receptions * yards_per_reception * 0.1) + (touchdowns * 6) AS NUMERIC), 0) AS INTEGER) AS fantasy_points, r.user_team FROM skill_positions r JOIN players p ON r.id = p.player_id JOIN teams t ON p.team = t.team_id WHERE p.position = 2 AND r.user_team = ${user}`)
            .then(dbres => res.status(200).send(dbres[0]))
        }
        else{
            sequelize.query(`SELECT CONCAT(t.location,' ', t.name) AS team, r.id, p.name, r.rushing_attempts, CAST(ROUND(CAST(rushing_attempts * yards_per_carry AS NUMERIC), 0) AS INTEGER) AS rushing_yards, CAST(ROUND(CAST(r.yards_per_carry AS NUMERIC), 2) AS FLOAT) AS yards_per_carry, r.receiving_targets, LEAST(receiving_targets, receptions) AS receptions, CAST(ROUND(CAST(receptions * yards_per_reception AS NUMERIC), 0) AS INTEGER) AS receiving_yards, CAST(ROUND(CAST(r.yards_per_reception AS NUMERIC), 2) AS FLOAT) AS yards_per_reception, LEAST(receiving_targets, touchdowns) AS touchdowns, CAST(ROUND(CAST((rushing_attempts * yards_per_carry * 0.1) + (receptions * yards_per_reception * 0.1) + (touchdowns * 6) AS NUMERIC), 0) AS INTEGER) AS fantasy_points, r.user_team FROM skill_positions r JOIN players p ON r.id = p.player_id JOIN teams t ON p.team = t.team_id WHERE p.position = 2 AND r.user_team = ${user} ORDER BY ${stat} ${sort}`)
            .then(dbres => res.status(200).send(dbres[0]))
        }
    },

    getClaimedWRs: (req, res) => {
        let { user, stat, sort } = req.query;
        if (!user && !stat && !sort)
            sequelize.query(`SELECT CONCAT(t.location,' ', t.name) AS team, r.id, p.name, r.rushing_attempts, CAST(ROUND(CAST(rushing_attempts * yards_per_carry AS NUMERIC), 0) AS INTEGER) AS rushing_yards, CAST(ROUND(CAST(r.yards_per_carry AS NUMERIC), 2) AS FLOAT) AS yards_per_carry, r.receiving_targets, LEAST(receiving_targets, receptions) AS receptions, CAST(ROUND(CAST(receptions * yards_per_reception AS NUMERIC), 0) AS INTEGER) AS receiving_yards, CAST(ROUND(CAST(r.yards_per_reception AS NUMERIC), 2) AS FLOAT) AS yards_per_reception, LEAST(receiving_targets, touchdowns) AS touchdowns, CAST(ROUND(CAST((rushing_attempts * yards_per_carry * 0.1) + (receptions * yards_per_reception * 0.1) + (touchdowns * 6) AS NUMERIC), 0) AS INTEGER) AS fantasy_points, r.user_team FROM skill_positions r JOIN players p ON r.id = p.player_id JOIN teams t ON p.team = t.team_id WHERE p.position = 3 AND r.user_team IS NOT NULL`)
            .then(dbres => res.status(200).send(dbres[0]))
        else if (!stat && !sort){
            sequelize.query(`SELECT CONCAT(t.location,' ', t.name) AS team, r.id, p.name, r.rushing_attempts, CAST(ROUND(CAST(rushing_attempts * yards_per_carry AS NUMERIC), 0) AS INTEGER) AS rushing_yards, CAST(ROUND(CAST(r.yards_per_carry AS NUMERIC), 2) AS FLOAT) AS yards_per_carry, r.receiving_targets, LEAST(receiving_targets, receptions) AS receptions, CAST(ROUND(CAST(receptions * yards_per_reception AS NUMERIC), 0) AS INTEGER) AS receiving_yards, CAST(ROUND(CAST(r.yards_per_reception AS NUMERIC), 2) AS FLOAT) AS yards_per_reception, LEAST(receiving_targets, touchdowns) AS touchdowns, CAST(ROUND(CAST((rushing_attempts * yards_per_carry * 0.1) + (receptions * yards_per_reception * 0.1) + (touchdowns * 6) AS NUMERIC), 0) AS INTEGER) AS fantasy_points, r.user_team FROM skill_positions r JOIN players p ON r.id = p.player_id JOIN teams t ON p.team = t.team_id WHERE p.position = 3 AND r.user_team = ${user}`)
            .then(dbres => res.status(200).send(dbres[0]))
        }
        else{
            sequelize.query(`SELECT CONCAT(t.location,' ', t.name) AS team, r.id, p.name, r.rushing_attempts, CAST(ROUND(CAST(rushing_attempts * yards_per_carry AS NUMERIC), 0) AS INTEGER) AS rushing_yards, CAST(ROUND(CAST(r.yards_per_carry AS NUMERIC), 2) AS FLOAT) AS yards_per_carry, r.receiving_targets, LEAST(receiving_targets, receptions) AS receptions, CAST(ROUND(CAST(receptions * yards_per_reception AS NUMERIC), 0) AS INTEGER) AS receiving_yards, CAST(ROUND(CAST(r.yards_per_reception AS NUMERIC), 2) AS FLOAT) AS yards_per_reception, LEAST(receiving_targets, touchdowns) AS touchdowns, CAST(ROUND(CAST((rushing_attempts * yards_per_carry * 0.1) + (receptions * yards_per_reception * 0.1) + (touchdowns * 6) AS NUMERIC), 0) AS INTEGER) AS fantasy_points, r.user_team FROM skill_positions r JOIN players p ON r.id = p.player_id JOIN teams t ON p.team = t.team_id WHERE p.position = 3 AND r.user_team = ${user} ORDER BY ${stat} ${sort}`)
            .then(dbres => res.status(200).send(dbres[0]))
        }
    },

    getClaimedTEs: (req, res) => {
        let { user, stat, sort } = req.query;
        if (!user && !stat && !sort){
            sequelize.query(`SELECT CONCAT(t.location,' ', t.name) AS team, r.id, p.name, r.rushing_attempts, CAST(ROUND(CAST(rushing_attempts * yards_per_carry AS NUMERIC), 0) AS INTEGER) AS rushing_yards, CAST(ROUND(CAST(r.yards_per_carry AS NUMERIC), 2) AS FLOAT) AS yards_per_carry, r.receiving_targets, LEAST(receiving_targets, receptions) AS receptions, CAST(ROUND(CAST(receptions * yards_per_reception AS NUMERIC), 0) AS INTEGER) AS receiving_yards, CAST(ROUND(CAST(r.yards_per_reception AS NUMERIC), 2) AS FLOAT) AS yards_per_reception, LEAST(receiving_targets, touchdowns) AS touchdowns, CAST(ROUND(CAST((rushing_attempts * yards_per_carry * 0.1) + (receptions * yards_per_reception * 0.1) + (touchdowns * 6) AS NUMERIC), 0) AS INTEGER) AS fantasy_points, r.user_team FROM skill_positions r JOIN players p ON r.id = p.player_id JOIN teams t ON p.team = t.team_id WHERE p.position = 4 AND r.user_team IS NOT NULL`)
            .then(dbres => res.status(200).send(dbres[0]))
        }
        else if (!stat && !sort){
            sequelize.query(`SELECT CONCAT(t.location,' ', t.name) AS team, r.id, p.name, r.rushing_attempts, CAST(ROUND(CAST(rushing_attempts * yards_per_carry AS NUMERIC), 0) AS INTEGER) AS rushing_yards, CAST(ROUND(CAST(r.yards_per_carry AS NUMERIC), 2) AS FLOAT) AS yards_per_carry, r.receiving_targets, LEAST(receiving_targets, receptions) AS receptions, CAST(ROUND(CAST(receptions * yards_per_reception AS NUMERIC), 0) AS INTEGER) AS receiving_yards, CAST(ROUND(CAST(r.yards_per_reception AS NUMERIC), 2) AS FLOAT) AS yards_per_reception, LEAST(receiving_targets, touchdowns) AS touchdowns, CAST(ROUND(CAST((rushing_attempts * yards_per_carry * 0.1) + (receptions * yards_per_reception * 0.1) + (touchdowns * 6) AS NUMERIC), 0) AS INTEGER) AS fantasy_points, r.user_team FROM skill_positions r JOIN players p ON r.id = p.player_id JOIN teams t ON p.team = t.team_id WHERE p.position = 4 AND r.user_team = ${user}`)
            .then(dbres => res.status(200).send(dbres[0]))
        }
        else{
            sequelize.query(`SELECT CONCAT(t.location,' ', t.name) AS team, r.id, p.name, r.rushing_attempts, CAST(ROUND(CAST(rushing_attempts * yards_per_carry AS NUMERIC), 0) AS INTEGER) AS rushing_yards, CAST(ROUND(CAST(r.yards_per_carry AS NUMERIC), 2) AS FLOAT) AS yards_per_carry, r.receiving_targets, LEAST(receiving_targets, receptions) AS receptions, CAST(ROUND(CAST(receptions * yards_per_reception AS NUMERIC), 0) AS INTEGER) AS receiving_yards, CAST(ROUND(CAST(r.yards_per_reception AS NUMERIC), 2) AS FLOAT) AS yards_per_reception, LEAST(receiving_targets, touchdowns) AS touchdowns, CAST(ROUND(CAST((rushing_attempts * yards_per_carry * 0.1) + (receptions * yards_per_reception * 0.1) + (touchdowns * 6) AS NUMERIC), 0) AS INTEGER) AS fantasy_points, r.user_team FROM skill_positions r JOIN players p ON r.id = p.player_id JOIN teams t ON p.team = t.team_id WHERE p.position = 4 AND r.user_team = ${user} ORDER BY ${stat} ${sort}`)
            .then(dbres => res.status(200).send(dbres[0]))
        }
    },

    getClaimedKs: (req, res) => {
        let { user, stat, sort } = req.query;
        if (!user && !stat && !sort){
            sequelize.query(`SELECT CONCAT(t.location,' ', t.name) AS team, k.id, p.name, k.xp_attempts, LEAST(xp_attempts, xp_made) AS xp_made, k.fg_attempts, LEAST(fg_attempts, fg_made) AS fg_made, xp_made + (fg_made * 3) - (xp_attempts - xp_made) - (fg_attempts - fg_made) AS fantasy_points, k.user_team FROM kickers k JOIN players p ON k.id = p.player_id JOIN teams t ON p.team = t.team_id WHERE k.user_team IS NOT NULL`)
            .then(dbres => res.status(200).send(dbres[0]))
        }
        else if(!stat && !sort){
            sequelize.query(`SELECT CONCAT(t.location,' ', t.name) AS team, k.id, p.name, k.xp_attempts, LEAST(xp_attempts, xp_made) AS xp_made, k.fg_attempts, LEAST(fg_attempts, fg_made) AS fg_made, xp_made + (fg_made * 3) - (xp_attempts - xp_made) - (fg_attempts - fg_made) AS fantasy_points, k.user_team FROM kickers k JOIN players p ON k.id = p.player_id JOIN teams t ON p.team = t.team_id WHERE k.user_team = ${user}`)
            .then(dbres => res.status(200).send(dbres[0]))
        }
        else{
            sequelize.query(`SELECT CONCAT(t.location,' ', t.name) AS team, k.id, p.name, k.xp_attempts, LEAST(xp_attempts, xp_made) AS xp_made, k.fg_attempts, LEAST(fg_attempts, fg_made) AS fg_made, xp_made + (fg_made * 3) - (xp_attempts - xp_made) - (fg_attempts - fg_made) AS fantasy_points, k.user_team FROM kickers k JOIN players p ON k.id = p.player_id JOIN teams t ON p.team = t.team_id WHERE k.user_team = ${user} ORDER BY ${stat} ${sort}`)
            .then(dbres => res.status(200).send(dbres[0]))
        }
    }
}