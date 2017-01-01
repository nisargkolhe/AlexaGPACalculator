'use strict';

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes: sessionAttributes,
        response: speechletResponse,
    };
}


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome to the GPA Calculator. ' +
        'Please tell me your current GPA by saying ' + 'my current GPA is three point four';
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'Please tell me your current GPA by saying ' + 'my current GPA is three point four';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Thank you for trying GPA Calculator. Have a nice day!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}


function setCurrentGPAInSession(intent, session, callback) {
    const cardTitle = intent.name;
    const gpaSlot = intent.slots.gpa;
    const decimalSlot = intent.slots.decimal;
    let decimal = 0;
    let gpa = 0;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    if(decimalSlot && decimalSlot.value) { 
        decimal=decimalSlot.value; 
        decimal=Number(decimal); 
        decimal=decimal/10; 
    }
    if(gpaSlot && gpaSlot.value) { 
        gpa=gpaSlot.value; 
        gpa=Number(gpa); 
        if(decimal) { 
            gpa+=Number(decimal); 
        }
        sessionAttributes.currGPA = gpa;
        speechOutput = `I now know your gpa is ${gpa}. Please tell me your total credits by saying ` +
            "my total credits are 29";
        repromptText = "You can tell me your total credits by saying my total credits are 29";    
    } else {
        speechOutput = "I'm not sure what your current GPA is. Please try again.";
        repromptText = "I'm not sure what your current GPA is. You can tell me your " +
            'GPA by saying, my current GPA is three point four';
    }

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function setTotalCreditsInSession(intent, session, callback) {
    const cardTitle = intent.name;
    const totalCreditsSlot = intent.slots.totalCredits;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    if (totalCreditsSlot) {
        const totalCredits = Number(totalCreditsSlot.value);
        sessionAttributes.totalCredits = totalCredits;
        speechOutput = `I now know your total credits are ${totalCredits}. Please tell me your semester GPA by saying ` +
            "my semester GPA is three point four";
        repromptText = "You can tell me your semester GPA by saying my semester GPA is three point four";
    } else {
        speechOutput = "I'm not sure how many total credits you have. Please try again.";
        repromptText = "I'm not sure how many total credits you have. You can tell me your total credits " +
            'by saying, my total credits are 29';
    }

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function setSemGPAInSession(intent, session, callback) {
    const cardTitle = intent.name;
    const gpaSlot = intent.slots.gpa;
    const decimalSlot = intent.slots.decimal;
    let decimal = 0;
    let gpa = 0;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    if(decimalSlot && decimalSlot.value) { 
        decimal=decimalSlot.value; 
        decimal=Number(decimal); 
        decimal=decimal/10; 
    }
    if(gpaSlot && gpaSlot.value) { 
        gpa=gpaSlot.value; 
        gpa=Number(gpa); 
        if(decimal) { 
            gpa+=Number(decimal); 
        }
        sessionAttributes.semGPA = gpa;
        speechOutput = `I now know your semester gpa is ${gpa}. Please tell me your semester credits by saying` +
            " my semester credits are 15";
        repromptText = "You can tell me your semester credits by saying my semester credits are 15";
        
    } else {
        speechOutput = "I'm not sure what your semester GPA is. Please try again.";
        repromptText = "I'm not sure what your semester GPA is. You can tell me your semester GPA by saying " +
            'my semester GPA is three point four';
    }

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function setSemCreditsInSession(intent, session, callback) {
    const cardTitle = intent.name;
    const semCreditsSlot = intent.slots.semCredits;
    let repromptText = '';
    let sessionAttributes = session.attributes;
    const shouldEndSession = false;
    let speechOutput = '';

    if (semCreditsSlot) {
        const semCredits = Number(semCreditsSlot.value);
        sessionAttributes.semCredits = semCredits;
        speechOutput = `I now know your semester credits are ${semCredits}. You can ask me to calculate your GPA by saying ` +
            "calculate my GPA";
        repromptText = "You can ask me to calculate your GPA by saying calculate my GPA";
    } else {
        speechOutput = "I'm not sure how many credits this semester had. Please try again.";
        repromptText = "I'm not sure how many credits this semester had. You can tell me your semester credits " +
            'by saying, my semester credits are 15';
    }

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function calculateGPA(intent, session, callback) {
    let currGPA;
    let totalCredits;
    let semGPA;
    let semCredits;
    const repromptText = '';
    let sessionAttributes = session.attributes;
    let shouldEndSession = false;
    let speechOutput = '';

    if (session.attributes) {
        currGPA = session.attributes.currGPA;
        totalCredits = session.attributes.totalCredits;
        semGPA = session.attributes.semGPA;
        semCredits = session.attributes.semCredits;
    }

    if (!currGPA) {
        speechOutput = "I'm not sure what your current GPA is. You can tell me your " +
            'GPA by saying, my current GPA is three point four';
    } else if (!totalCredits) {
        speechOutput = `CGPA: ${currGPA} I'm not sure how many total credits you have. You can tell me your total credits ` +
            'by saying, my total credits are 29';
    } else if (!semGPA) {
        speechOutput = `${currGPA}, totalCredits ${totalCredits} I'm not sure what your semester GPA is. You can tell me your ` +
            'GPA by saying, my GPA is three point four';
    } else if (!semCredits) {
        speechOutput = `${currGPA}, semGPA ${semGPA}, totalCredits ${totalCredits}, I'm not sure how many credits this semester had. You can tell me your semester credits ` +
            'by saying, my semester credits are 15';
    } else {
        var cumGPA = Math.round(((currGPA * totalCredits) + (semGPA * semCredits))/(totalCredits + semCredits) * 100) / 100;
        speechOutput = `Your cumulative GPA is ${cumGPA}`;
        shouldEndSession = true;
    }

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'MyCurrentGPAIsIntent') {
        setCurrentGPAInSession(intent, session, callback);
    } else if (intentName === 'MyTotalCreditsAreIntent') {
        setTotalCreditsInSession(intent, session, callback);
    } else if (intentName === 'MySemGPAIsIntent') {
        setSemGPAInSession(intent, session, callback);
    } else if (intentName === 'MySemCreditsAreIntent') {
        setSemCreditsInSession(intent, session, callback);
    } else if (intentName === 'CalculateGPA') {
        calculateGPA(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        if (event.session.application.applicationId !== 'amzn1.ask.skill.7a72899a-6873-44a5-935a-09d94e49082c') {
             callback('Invalid Application ID');
        }
        

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};
