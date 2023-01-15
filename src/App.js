import logo from './logo.svg';
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import './App.css';
import Nav from "./components/Nav";
import Home from "./components/Home";
import ButtonSmeller from "./components/ButtonSmeller";
import {AppBar, Box, Button, Tab, Tabs} from "@mui/material";
import {useState} from "react";
import ResponseSmeller from "./components/ResponseSmeller";
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

let darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

darkTheme = responsiveFontSizes(darkTheme)

function App() {
    const [view, setView] = useState('button')
    const views = ['button', 'response']

    const updateView = (view) => {
        if(views.includes(view)) {
            setView(view)
        }
    }
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Box className="App" sx={{height: '100%'}}>
                <Nav updateView={updateView} currentView={view}/>
                {view === "button" ?
                    <ButtonSmeller /> :
                    view === "response" ?
                        <ResponseSmeller /> : <div>Welcome</div>
                }
            </Box>
        </ThemeProvider>
    );
}

export default App;
