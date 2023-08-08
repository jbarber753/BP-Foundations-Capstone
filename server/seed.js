require("dotenv").config();
const { CONNECTION_STRING } = process.env;

const { default: axios } = require("axios");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

module.exports = {
    seed: (req, res) => {
      sequelize
        .query(
            `
            DROP TABLE IF EXISTS users;
            DROP TABLE IF EXISTS quarterbacks;
            DROP TABLE IF EXISTS skill_positions;
            DROP TABLE IF EXISTS kickers;
            DROP TABLE IF EXISTS players;
            DROP TABLE IF EXISTS teams;
            DROP TABLE IF EXISTS positions;

            CREATE TABLE users (
              id SERIAL PRIMARY KEY,
              email VARCHAR,
              username VARCHAR,
              password VARCHAR
            );

            CREATE TABLE teams (
              team_id SERIAL PRIMARY KEY,
              location VARCHAR,
              name VARCHAR
            );

            CREATE TABLE positions (
              position_id SERIAL PRIMARY KEY,
              name VARCHAR
            );

            CREATE TABLE players (
              player_id SERIAL PRIMARY KEY,
              name VARCHAR,
              position INTEGER REFERENCES positions(position_id),
              team INTEGER REFERENCES teams(team_id)
            );

            CREATE TABLE quarterbacks (
              id INTEGER REFERENCES players(player_id),
              pass_attempts INTEGER,
              passing_yards INTEGER,
              passing_tds INTEGER,
              interceptions INTEGER,
              rushing_attempts INTEGER,
              rushing_yards INTEGER,
              rushing_tds INTEGER
            );

            CREATE TABLE skill_positions (
              id INTEGER REFERENCES players(player_id),
              rushing_attempts INTEGER,
              rushing_yards INTEGER,
              receiving_targets INTEGER,
              receiving_yards INTEGER,
              touchdowns INTEGER
            );

            CREATE TABLE kickers (
              id INTEGER REFERENCES players(player_id),
              xp_attempts INTEGER,
              fg_attempts INTEGER
            );

            INSERT INTO teams (location, name) VALUES
            ('Arizona', 'Finches'), ('Baltimore', 'Crows'), ('Atlanta', 'Kestrels'), ('Buffalo', 'Bison'),
            ('Carolina', 'Pumas'), ('Cincinnati', 'Tigers'), ('Chicago', 'Boars'), ('Cleveland', 'Beiges'),
            ('Dallas', 'Cattlemen'), ('Denver', 'Mustangs'), ('Detroit', 'Leopards'), ('Houston', 'Houstonians'),
            ('Green Bay', 'Cheddars'), ('Indianapolis', 'Foals'), ('Los Angeles', 'Goats'), ('Jacksonville', 'Cheetahs'),
            ('Minnesota', 'Barbarians'), ('Kansas City', 'Bosses'), ('New Orleans', 'Angels'), ('Las Vegas', 'Bandits'),
            ('New York', 'Goliaths'), ('Los Angeles', 'Stampeders'), ('Philadelphia', 'Condors'), ('Miami', 'Orcas'),
            ('San Francisco', 'Prospectors'), ('New England', 'Revolutionaries'), ('Seattle', 'Storks'), ('New York', 'Planes'),
            ('Tampa Bay', 'Swashbucklers'), ('Pittsburg', 'Smelters'), ('Washington', 'Majors'), ('Tennessee', 'Olympians');

            INSERT INTO positions (name) VALUES
            ('Quarterback'), ('Running Back'), ('Wide Receiver'), ('Tight End'), ('Kicker');
            `
        )
        .then(() => {
            axios.get(`https://fakerapi.it/api/v1/persons?_quantity=320&_gender=male`)
                .then(res => {
                    let response = res.data.data;
                    let teamCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    let teamIndex = 0;
                    let positionCount = [0, 0, 0, 0, 0];
                    let positionIndex = 0;
                    for (let i = 0; i < response.length; i++){
                        if (response[i].firstname.includes("'")){
                          response[i].firstname = response[i].firstname.replace("'", "''");
                        }
                        if (response[i].lastname.includes("'")){
                          response[i].lastname = response[i].lastname.replace("'", "''");
                        }
                        if (teamCount[teamIndex] > 9){
                          teamIndex++
                        }
                        if (positionCount[positionIndex] > 1){
                          positionIndex++
                        }
                        if (positionIndex > 4){
                          positionIndex = 0;
                        }
                        teamCount[teamIndex]++;
                        positionCount[positionIndex]++;
                        sequelize
                        .query(
                            `INSERT INTO players (name, position, team) VALUES
                            (CONCAT('${response[i].firstname}', ' ', '${response[i].lastname}'), ${positionIndex + 1}, ${teamIndex + 1});
                            `
                        )
                    }
                    sequelize.query(`
                      SELECT SETSEED(0.753);
                      INSERT INTO quarterbacks SELECT player_id, FLOOR(RANDOM() * (850 - 170) + 170), FLOOR(RANDOM() * (5500 - 1000) + 1000), FLOOR(RANDOM() * (60 - 20) + 20), FLOOR(RANDOM() * 30), FLOOR(RANDOM() * (160 - 10) + 10), FLOOR(RANDOM() * (1000 - 20) + 20), FLOOR(RANDOM() * 15) FROM players WHERE position = 1;
                      SELECT SETSEED(0.476);
                      INSERT INTO skill_positions SELECT player_id, FLOOR(RANDOM() * (380 - 1) + 2), FLOOR(RANDOM() * 2100), FLOOR(RANDOM() * (210 - 1) + 2), FLOOR(RANDOM() * 2000), FLOOR(RANDOM() * 30) FROM players WHERE position IN (2, 3, 4);
                      SELECT SETSEED(0.1453);
                      INSERT INTO kickers SELECT player_id, FLOOR(RANDOM() * (85-10) + 10), FLOOR(RANDOM() * (50-15) +15) FROM players WHERE position = 5;
                    `)
                    console.log(`Players seeded!`)
                })
                .catch((err) => console.log("Error while generating players", err));
            console.log("Tables created!");
            res.sendStatus(200);
          })
        .catch((err) => console.log("Error while creating tables", err));
    }
}