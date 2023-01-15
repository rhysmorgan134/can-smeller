import React from 'react'
import {Grid, Box, Typography} from "@mui/material";

export default function ({id, data}) {
    console.log(id, data)
    const hexByte = (data) => {
        return <Grid item xs={2}><Typography align={'center'} variant={'body1'}>{data.toString(16).padStart(2, '0')}</Typography></Grid>
    }
    const binaryByte = (data) => {
        return <Grid item xs={2}><Typography align={'center'} variant={'body2'}>{data.toString(2).padStart(8, '0')}</Typography></Grid>
    }

    return (
        <Grid container spacing={2} sx={{width: '100%'}}>
            <Grid container item xs={12} sx={{'flexGrow': 1}}>
                <Grid item xs={2}>
                    <Box sx={{width: '20%'}}>
                        <Typography>{id}</Typography>
                    </Box>
                </Grid>
                <Grid container item xs={10} sx={{'flexGrow': 1}}>
                    <Box sx={{flexGrow: 1}}>
                        <Grid container  columns={16}>
                            {data.map(e => {
                                return hexByte(e)
                            })}
                        </Grid>
                        <Grid container columns={16}>
                            {data.map(e => {
                                return binaryByte(e)
                            })}
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    )
}