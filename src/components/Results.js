import {Divider, List, ListItem, ListItemText} from "@mui/material";
import React, {Fragment} from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


export default function({data, addToSniffer, filters}) {

    const renderCandidates = () => {
        const candidates = data.map((e) =>
            <Fragment>
                <ListItem >
                    <ListItemText
                        primary="Candidate - click to add to sniffer"
                        secondary={"ID: " + e.id + " Byte: " + e.byte + " value: " + e.value}
                        primaryTypographyProps={{align: 'center'}}
                        secondaryTypographyProps={{align: 'center'}}/>
                </ListItem>
                {filters.includes(e.id) ? <RemoveIcon onClick={() => {
                    addToSniffer(e.id)
                }} sx={{cursor: "pointer"}}/> : <AddIcon onClick={() => {
                    addToSniffer(e.id)
                }} sx={{cursor: "pointer"}}/>}
                <Divider variant="inset" component="li" />
            </Fragment>
        )
        return candidates
    }

    return (
        <List
            sx={{
                width: '100%',
                bgcolor: 'background.paper',
            }}
        >
            <ListItem>
                <ListItemText primary="Potential Candidates" secondary={data.length} primaryTypographyProps={{align: 'center'}} secondaryTypographyProps={{align: 'center'}} />
            </ListItem>
            <Divider variant="inset" component="li" />
            {renderCandidates()}
        </List>
    )
}