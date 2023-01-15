import React, {Fragment, useEffect, useState} from 'react'
import {Grid, Typography, Button, Box, Modal, Paper, ListItem, ListItemText, Divider} from "@mui/material";
import Learning from "./Learning";
import Results from "./Results";
import Sniffer from "./Sniffer";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
const { ipcRenderer } = window.require('electron');


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const snifferStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
};

export default function() {
    const [open, setOpen] = React.useState(false);
    const [timing, setTiming] = React.useState(false);
    const [timeLeft, setTimeLeft] = React.useState(0);
    const [timeAcc, setTimerAcc] = React.useState(4000);
    const [timerStart, setTimerStart] = React.useState(null);
    const [timerEnd, setTimerEnd] = React.useState(null)
    const [learning, setLearning] = React.useState(false)
    const [results, setResults] = React.useState([])
    const [stats, setStats] = React.useState({
        taughtCountBytes: 0,
        prevTaughtBytes: 0,
        taughtBytesInterval: 0,
        taughtCountIds: 0,
        prevTaughtIds: 0,
        taughtIdsInterval: 0,
        candidateCount: 0,})
    const [filters, setFilters] = React.useState([])
    const [snifferResults, setSnifferResults] = React.useState({})
    const [sniffing, setSniffing] = React.useState(false)
    let interval;

    useEffect(() => {
        ipcRenderer.on('learning', (event, args) => {
            setLearning(args)
        })
        ipcRenderer.on('stats', (event, data) => {
            setStats(data)
        })
        ipcRenderer.on('countdown', (event, data) => {
            setTiming(data)
        })
        ipcRenderer.on('remaining', (event, data) => {
            setTimeLeft(data)
        })
        ipcRenderer.on('complete', (event, data) => {
            setResults(data)
        })
        ipcRenderer.on('snifferUpdate', (event, data) => {
            let tempData = {}
            tempData[data.id] = data.data
            console.log(data)
            setSnifferResults(data);
        })
        ipcRenderer.on('sniffingStatus', (event, data) => {
            console.log("sniffing status", data)
            setSniffing(data)
        })

        return () => {
            ipcRenderer.removeAllListeners()
        }
    }, [])

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const getTimeLeft = (timeout) =>{
        setTimeLeft(timerEnd - timerStart);
    }

    const addFilter = (id) => {
        if(filters.includes(id)) {
            setFilters(filters.filter(item => item !== id))
        } else {
            setFilters(oldFilter => [...oldFilter, id])
        }

    }
    const startSmelling = () => {
        ipcRenderer.send('process', {type: 'buttonSmelling', time: 4000})
    }

    const startSniffing = () => {
        ipcRenderer.send('process', {type: 'sniffer', action: 'start', filters})
    }

    const endSniffing = () => {
        ipcRenderer.send('process', {type: 'sniffer', action: 'end'})
    }

    const beginTiming = () => {
        ipcRenderer.send('process', {type: 'button'})
        // setTiming(true)
        // setTimerStart(new Date())
        // setTimerEnd((new Date()).setSeconds(new Date().getTime() + 4))
        // interval = setInterval(() => {
        //     console.log("calculating", timeLeft, timerStart, timerEnd)
        //     getTimeLeft()
        // }, 100)
        // timer = setTimeout(() => {
        //     endTiming()
        // }, timeAcc)
    }

    const endTiming = () => {
        setTiming(false)
        clearInterval(interval)
    }

    const reset = () => {
        setResults([])
        setSnifferResults([])

    }

    const renderCountDown = () => {
        switch(timeLeft) {
            case 0:
                return "READY"
            case 1:
                return "READY"
            case 2:
                return "STEADY"
            case 3:
                return "PRESS NOW"
            default:
                return "Error"
        }
    }

    const renderSniffers = (data) => {
        console.log("returning sniffer")
        return <Sniffer id={data} data={snifferResults[data]} />
    }

    const exampleData = {
        taughtCountBytes: 0,
        prevTaughtBytes: 0,
        taughtBytesInterval: 0,
        taughtCountIds: 0,
        prevTaughtIds: 0,
        taughtIdsInterval: 0,
        candidateCount: 0,
    }

    return(
        <Box sx={{height: '100%'}}>
            <Grid  spacing={2} sx={{height: '100%'}}>
                <Grid item xs={12} sx={{height: '10%',}}>
                    <Typography>Begin the smeller, then wait until new learnt bytes are low and steady. Press begin then, when the popup says go press the required button in one second.</Typography>
                </Grid>
                <Grid item xs={12} sx={{display: 'flex', flexGrow: 1}}>
                    {results.length > 0 ? <Results data={results} addToSniffer={addFilter} filters={filters}/> : <Learning data={stats}/>}
                </Grid>
                <Grid item xs={12} sx={{height: '50px', position: 'fixed', bottom: 0, left: 0, right: 0}} >
                    <Paper elevation={3} sx={{height: '100%'}}>
                        <Button xs={'large'} disabled={learning} onClick={() => beginTiming()}>Begin</Button>
                        <Button xs={'large'} disabled={!learning} onClick={() => startSmelling()}>Smell</Button>
                        <Button xs={'large'} disabled={!filters.length > 0} onClick={() => startSniffing()}>Sniffer</Button>
                    </Paper>
                </Grid>
            </Grid>
            <Modal
                open={timing}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {renderCountDown()}
                    </Typography>
                </Box>
            </Modal>
            <Modal
                open={sniffing}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={snifferStyle}>
                    {Object.keys(snifferResults).map(e => {
                        console.log(snifferResults)
                        console.log("rendering", e)
                        return renderSniffers(e)
                    })}
                    <Button xs={'large'} onClick={() => endSniffing()}>Stop Can Sniffer</Button>
                </Box>
            </Modal>
        </Box>

    )
}