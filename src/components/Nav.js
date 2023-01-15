import React, {useState} from 'react'
import {Tabs, Tab, AppBar, Container, Button, Box} from "@mui/material";
import {Link} from "react-router-dom";

export default function Nav({updateView, currentView}) {
    return (
        <Container id={"draggable"}>
            <Box sx={{disable: "flex", alignItems: 'space-between', width: '100%'}}>
                <Button onClick={(e) => {
                    updateView("button")
                }
                }>Button Smeller</Button>
                <Button onClick={(e) => {
                    updateView("response")
                }
                }>Response Smeller</Button>
            </Box>
        </Container>
    )
}



