import React, { useState, useEffect, useRef } from 'react';
import BtnChangeTime from '../components/BtnChangeTime';
import './Clock.css';


const formatInMM_SS = (mins, seconds) => {
    return `${mins < 10 ? '0' : ''}${mins}:${seconds < 10 ? '0' : ''}${seconds}`;
}

const initialState = {
    timerMins: 25,
    timerSec: 0,
    breakMins: 5,
    sessionMins: 25,
    formattedTime: formatInMM_SS(25, 0)
}


export default function Clock() {
    const [state, setState] = useState(initialState);
    const [sessionState, setSessionState] = useState('pause');
    const [currentScreen, setCurrentScreen] = useState('session');
    const [intervalID, setIntervalID] = useState(null);
    const audioElement = useRef();

    const handleTimer = () => {
        let nextIntervalTime = 1000;
        let { timerMins, timerSec } = state;
        let intervalCleared = true;

        const timerID = setInterval(() => {
            const startTime = Date.now();

            if (timerSec === 0) {
                timerSec = 60;
                timerMins--;
            }
            timerSec--;

            if (timerMins < 0 && intervalCleared) {
                timerSec = 0;
                intervalCleared = false;
                clearInterval(timerID);
                const nextScreen = currentScreen === 'session'
                    ? 'break'
                    : currentScreen === 'break'
                        ? 'session'
                        : 'break';

                timerMins = state[`${nextScreen}Mins`];
                setState({
                    ...state,
                    timerMins,
                    formattedTime: formatInMM_SS(timerMins, timerSec)
                });

                setCurrentScreen(nextScreen);
                setSessionState('restart');
            }
            setState({
                ...state,
                timerMins,
                timerSec,
                formattedTime: formatInMM_SS(timerMins, timerSec)
            });

            const endTime = Date.now();
            nextIntervalTime = 1000 - (endTime - startTime);
        }, nextIntervalTime);
        return timerID;
    }

    const handleTimeSetControls = (type, action) => {
        if (sessionState === 'playing') return;

        const modifiedState = { ...state };

        const key = `${type}Mins`;
        if (action === 'inc' && state[key] < 60) {
            modifiedState[key] = modifiedState[key] + 1;
        } else if (action === 'dec' && state[key] > 1) {
            modifiedState[key] = modifiedState[key] - 1;
        } else return;

        if (type === currentScreen) {
            setState({
                ...modifiedState,
                timerMins: modifiedState[key],
                timerSec: 0,
                formattedTime: formatInMM_SS(modifiedState[key], 0)
            });
        } else {
            setState({ ...modifiedState });
        }
    }

    const handleAudio = (shouldReset = false) => {
        if (shouldReset) {
            audioElement.current.pause();
            audioElement.current.currentTime = 0;
        } else {
    		audioElement.current.load();        	
            audioElement.current.play();
        }
    }

    const handleSessionControls = (type) => {
        if (type === 'reset') {
            setSessionState('pause');
            setCurrentScreen('session');
            setState(initialState);
            handleAudio(true);
        } else {
            if (sessionState === 'playing') {
                setSessionState('pause');
            } else {
                setSessionState('playing');
            }
        }
    }

    useEffect(() => {
        if (sessionState === 'playing') {
            setIntervalID(handleTimer());
        } else {
            clearInterval(intervalID);
            if (sessionState === 'restart') {
                setSessionState('playing');
                handleAudio();
            }
        }
    }, [sessionState]);

    return (
        <div className="wrapper">
            <h1>Pomodoro Timer</h1>
            <div className="change_control">
                <BtnChangeTime
					id={['session-label','session-decrement','session-increment', 'session-length']} 
                    label="Session Length"
                    disabled={sessionState}
                    length={state.sessionMins}
                    setLength={handleTimeSetControls}
                    type="session"
                />
                <BtnChangeTime
					id={['break-label','break-decrement','break-increment', 'break-length']} 
                    label="Break Length"
                    disabled={sessionState}
                    length={state.breakMins}
                    setLength={handleTimeSetControls}
                    type="break"
                />
            </div>
            <div className="timer-wrapper">
                <div className="session-timer">
	                <h3 id="timer-label">{currentScreen.toUpperCase()} {currentScreen==='session'?<i class="bi bi-book-fill"></i>:<i class="bi bi-cup-hot-fill"></i>}</h3>
                    <h2 id="time-left">{state.formattedTime}</h2>
                </div>
                <div className="session-controls">
                    <button className="controls" id="start_stop" onClick={() => handleSessionControls('play_pause')}>{sessionState === 'playing'? <i class="bi bi-pause-fill"></i>: <i class="bi bi-play-fill"></i>}</button>
                    <button className="controls" id="reset" onClick={() => handleSessionControls('reset')} title="Reset"><i class="bi bi-arrow-clockwise"></i></button>
                </div>
                <audio
                    id="beep"
                    preload="auto"
                    ref={audioElement}
                    src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
                />
            </div>
        </div>
    );


}










