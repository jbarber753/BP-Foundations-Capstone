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
            DROP TABLE IF EXISTS quarterbacks;
            DROP TABLE IF EXISTS skill_positions;
            DROP TABLE IF EXISTS kickers;
            DROP TABLE IF EXISTS players;
            DROP TABLE IF EXISTS teams;
            DROP TABLE IF EXISTS positions;
            DROP TABLE IF EXISTS users;

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
              completions INTEGER,
              yards_per_completion FLOAT,
              passing_tds INTEGER,
              interceptions INTEGER,
              rushing_attempts INTEGER,
              yards_per_carry FLOAT,
              rushing_tds INTEGER,
              user_team INTEGER REFERENCES users(id)
            );

            CREATE TABLE skill_positions (
              id INTEGER REFERENCES players(player_id),
              rushing_attempts INTEGER,
              yards_per_carry FLOAT,
              receiving_targets INTEGER,
              receptions INTEGER,
              yards_per_reception FLOAT,
              touchdowns INTEGER,
              user_team INTEGER REFERENCES users(id)
            );

            CREATE TABLE kickers (
              id INTEGER REFERENCES players(player_id),
              xp_attempts INTEGER,
              xp_made INTEGER,
              fg_attempts INTEGER,
              fg_made INTEGER,
              user_team INTEGER REFERENCES users(id)
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
                      INSERT INTO quarterbacks SELECT player_id, FLOOR(RANDOM() * (750 - 60) + 60), FLOOR(RANDOM() * (500 - 2) + 2), RANDOM() * (15 - 2) + 2, FLOOR(RANDOM() * (60 - 2) + 2), FLOOR(RANDOM() * 30), FLOOR(RANDOM() * (175 - 15) + 15), RANDOM() * 7, FLOOR(RANDOM() * 15) FROM players WHERE position = 1;
                      SELECT SETSEED(0.476);
                      INSERT INTO skill_positions SELECT player_id, FLOOR(RANDOM() * (415 - 2) + 2), RANDOM() * 6.5, FLOOR(RANDOM() * (205 - 2) + 2), FLOOR(RANDOM() * (150 - 2) + 2), RANDOM() * 25, FLOOR(RANDOM() * 30) FROM players WHERE position IN (2, 3, 4);
                      SELECT SETSEED(0.1453);
                      INSERT INTO kickers SELECT player_id, FLOOR(RANDOM() * 50), FLOOR(RANDOM() * (50 - 43) + 43), FLOOR(RANDOM() * 40), FLOOR(RANDOM() * (40 - 30) + 30) FROM players WHERE position = 5;
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