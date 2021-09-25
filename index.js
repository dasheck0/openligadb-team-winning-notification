require('dotenv').config();

const axios = require('axios');
const fs = require('fs');
const dayjs = require('dayjs');
const isoWeek = require('dayjs/plugin/isoWeek')
dayjs.extend(isoWeek)

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });

const getAllMatchesForTeam = async (competition, season, teamId) => {
    const url = `https://openligadb.de/api/getmatchdata/${competition}/${season}`;

    try {
        const { data } = await axios.get(url);
        return data.filter((match) => {
            const team1 = (match.Team1 || {}).TeamId;
            const team2 = (match.Team2 || {}).TeamId;

            return [team1, team2].includes(parseInt(teamId, 10));
        });
    } catch (error) {
        console.error(error);
        return [];
    }
}

const getWonMatches = (matches, teamId) => {
    return matches.filter((match) => {
        const isHome = parseInt(match.Team1.TeamId, 10) === parseInt(teamId, 10);
        const myPropertyName = isHome ? '1' : '2';
        const opponentPropertyName = isHome ? '2' : '1';
        const finalMatchResult = match.MatchResults.find(matchResult => matchResult.ResultTypeID === 2);


        if (finalMatchResult) {
            return finalMatchResult['PointsTeam' + myPropertyName] > finalMatchResult['PointsTeam' + opponentPropertyName];
        }

        return false;
    });
}

const getMatchDescription = (match) => {
    const finalMatchResult = match.MatchResults.find(matchResult => matchResult.ResultTypeID === 2);
    const groupName = match.Group ? `${match.Group.GroupName}\n` : '';

    return `${groupName}${match.Team1.TeamName} - ${match.Team2.TeamName} ${finalMatchResult.PointsTeam1}:${finalMatchResult.PointsTeam2}

Goals:    
${match.Goals.map(goal => `${goal.ScoreTeam1}:${goal.ScoreTeam2} - ${goal.GoalGetterName} ${goal.MatchMinute}' ${goal.IsOwnGoal ? '(Own Goal)' : ''}`).join('\n')}
`;
}

const getLastWeeksMatches = (matches) => {
    const startDate = dayjs().locale('de').subtract(7, 'days').startOf('isoWeek');
    const endDate = dayjs().locale('de').subtract(7, 'days').endOf('isoWeek');

    return matches.filter((match) => {
        return startDate.isBefore(match.MatchDateTime) && endDate.isAfter(match.MatchDateTime);
    });
}

const sendEmail = async (recipient, matches) => {
    const subject = `${process.env.SEASON}/${parseInt(process.env.SEASON, 10) + 1} Match Results for Borussia Dortmund`;

    const params = {
        Destination: {
            ToAddresses: [
                recipient
            ]
        },
        Message: {
            Body: {
                Text: {
                    Charset: 'UTF-8',
                    Data: matches.map(match => getMatchDescription(match)).join('\n\n')
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject
            }
        },
        Source: 'stefan@rpdev.net'
    }

    try {
        await new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
        console.log('Done');
    } catch (error) {
        console.error(error);
    }
}

exports.handler = async function () {
    const matches = await getAllMatchesForTeam(process.env.COMPETITION, process.env.SEASON, process.env.TEAMID);
    console.log("Found", matches.length, "matches");

    const wonMatches = getWonMatches(matches, process.env.TEAMID);
    console.log(wonMatches.length, "were won");

    const lastWeeksWonMatches = getLastWeeksMatches(wonMatches);
    console.log(lastWeeksWonMatches.length, "in the last week");

    await sendEmail(process.env.RECIPIENT, lastWeeksWonMatches);
    console.log("Email was sent");
}
