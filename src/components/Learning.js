import {Divider, List, ListItem, ListItemText} from "@mui/material";
import React from "react";


export default function({data}) {

    return (
        <List
            sx={{
                width: '100%',
                bgcolor: 'background.paper'
            }}
        >
            <ListItem>
                <ListItemText primary="Total Learnt IDs" secondary={data.taughtCountIds} primaryTypographyProps={{align: 'center'}} secondaryTypographyProps={{align: 'center'}} />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
                <ListItemText primary="Learnt IDs last interval" secondary={data.taughtIdsInterval} primaryTypographyProps={{align: 'center'}} secondaryTypographyProps={{align: 'center'}}/>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
                <ListItemText primary="Total Learnt Bytes" secondary={data.taughtCountBytes} primaryTypographyProps={{align: 'center'}} secondaryTypographyProps={{align: 'center'}}/>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
                <ListItemText primary="Learnt IDs last interval" secondary={data.taughtBytesInterval} primaryTypographyProps={{align: 'center'}} secondaryTypographyProps={{align: 'center'}}/>
            </ListItem>
            <Divider variant="inset" component="li" />
        </List>
    )
}